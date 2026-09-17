#!/usr/bin/env node
/**
 * Répare les slugs produit non conformes dans Sanity.
 *
 *   node scripts/fix-product-slugs.mjs            # simulation, n'écrit rien
 *   node scripts/fix-product-slugs.mjs --write    # applique
 *
 * Pourquoi
 * --------
 * Les slugs produit ont été saisis à la main au lieu de passer par « Generate ».
 * Ils contiennent des espaces, des virgules et des guillemets doubles. Next
 * prérend alors une page sous ce nom brut, espaces littéraux compris, mais un
 * espace ne peut pas voyager dans une requête HTTP : le navigateur envoie %20,
 * plus aucune route ne correspond, et toutes les fiches produit répondent 404.
 * Vérifié identiquement en local et sur filandflow.fr.
 *
 * Le nouveau slug est calculé depuis le TITRE, pas depuis l'ancien slug, pour
 * éviter de propager les guillemets. Les collisions sont suffixées -2, -3, ...
 *
 * Les brouillons (drafts.<id>) sont corrigés en même temps que leur version
 * publiée, pour qu'un brouillon en attente ne réintroduise pas l'ancien slug.
 */

import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

// Reprise de sanity/schemas/slugify.ts (17/09/2026). Dupliqué parce que ce
// script est en .mjs et ne peut pas importer le .ts sans loader. Si l'une des
// deux versions change, l'autre doit suivre.
function slugify(input) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96)
    .replace(/-+$/g, "");
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const WRITE = process.argv.includes("--write");

// --- Chargement de .env.local ------------------------------------------------
function loadEnv(path) {
  const out = {};
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    return out;
  }
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_0-9]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = { ...loadEnv(new URL("../.env.local", import.meta.url).pathname), ...process.env };

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("NEXT_PUBLIC_SANITY_PROJECT_ID ou SANITY_API_WRITE_TOKEN manquant.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
  perspective: "raw", // inclut les brouillons
});

// --- Lecture -----------------------------------------------------------------
const docs = await client.fetch(
  `*[_type == "product"]{_id, title, "slug": slug.current} | order(_id asc)`,
);

console.log(`Dataset : ${dataset}`);
console.log(`Documents product : ${docs.length}\n`);

// Un brouillon et sa version publiée sont le même produit : on les regroupe.
const groups = new Map();
for (const d of docs) {
  const baseId = d._id.replace(/^drafts\./, "");
  if (!groups.has(baseId)) groups.set(baseId, []);
  groups.get(baseId).push(d);
}

// --- Calcul des nouveaux slugs, avec gestion des collisions -------------------
const taken = new Set();
const plan = [];

for (const [baseId, variants] of groups) {
  // Le titre de la version publiée fait foi ; à défaut celui du brouillon.
  const source =
    variants.find((v) => !v._id.startsWith("drafts."))?.title ||
    variants[0].title ||
    variants[0].slug ||
    baseId;

  const current = variants.map((v) => v.slug);
  const alreadyClean = current.every((s) => s && SLUG_PATTERN.test(s));

  let candidate = slugify(String(source));
  if (!candidate) candidate = slugify(baseId);

  // Deux produits au titre identique (ou ne différant que par un espace final)
  // convergent vers le même slug : on suffixe pour garder l'unicité.
  let unique = candidate;
  let n = 2;
  while (taken.has(unique)) {
    unique = `${candidate}-${n}`;
    n += 1;
  }
  taken.add(unique);

  plan.push({ baseId, variants, source, current, next: unique, alreadyClean });
}

// --- Affichage ---------------------------------------------------------------
const toFix = plan.filter((p) => p.alreadyClean === false || p.current.some((s) => s !== p.next));

for (const p of plan) {
  const mark = toFix.includes(p) ? "CORRIGE" : "ok     ";
  console.log(`${mark} ${p.baseId}`);
  console.log(`        titre  : ${p.source}`);
  for (const v of p.variants) {
    const kind = v._id.startsWith("drafts.") ? "brouillon" : "publié   ";
    console.log(`        ${kind} : ${JSON.stringify(v.slug)}`);
  }
  if (toFix.includes(p)) console.log(`        ->       : ${JSON.stringify(p.next)}`);
  console.log("");
}

console.log(`À corriger : ${toFix.length} produit(s) sur ${plan.length}`);

if (!WRITE) {
  console.log("\nSimulation. Relance avec --write pour appliquer.");
  process.exit(0);
}

if (toFix.length === 0) {
  console.log("Rien à faire.");
  process.exit(0);
}

// --- Écriture ----------------------------------------------------------------
console.log("\nÉcriture...\n");

let tx = client.transaction();
let count = 0;
for (const p of toFix) {
  for (const v of p.variants) {
    tx = tx.patch(v._id, (patch) => patch.set({ "slug.current": p.next }));
    count += 1;
  }
}

const res = await tx.commit();
console.log(`${count} document(s) mis à jour. Transaction ${res.transactionId}`);
console.log("\nLes fiches produit répondront après un rebuild.");
