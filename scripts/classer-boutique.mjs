#!/usr/bin/env node
/**
 * Range les produits de la boutique dans leurs rubriques (une seule fois)
 * et vérifie que tout l'inventaire est présent et classé.
 *
 *   node scripts/classer-boutique.mjs            # simulation, n'écrit rien
 *   node scripts/classer-boutique.mjs --write    # applique
 *   node scripts/classer-boutique.mjs --verify   # vérifie seulement ; échoue si impossible
 *   node scripts/classer-boutique.mjs --ci       # utilisé par « prebuild »
 *
 * En mode --ci, le script n'agit que dans un build d'aperçu Vercel
 * (VERCEL_ENV=preview) : il applique, puis échoue si la vérification ne passe
 * pas, ce qui rend le résultat visible dans le statut du déploiement. Partout
 * ailleurs (production, build local), il ne fait rien.
 *
 * Ce qu'il fait, sans jamais rien supprimer :
 *   1. crée les 4 rubriques si elles n'existent pas (identifiants fixes) ;
 *   2. donne une rubrique aux produits qui n'en ont pas, d'après leur titre ;
 *   3. corrige les slugs non conformes (ex. « Châle crocheté » avec espace et
 *      accent, dont la fiche répondait 404), seulement ceux-là ;
 *   4. vérifie que les 22 produits de la boutique au 11/10/2026 sont là,
 *      tous rangés, avec des slugs propres et uniques.
 * Les brouillons sont modifiés avec leur version publiée, pour qu'une
 * publication ultérieure n'efface pas la rubrique.
 */

import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

const CI = process.argv.includes("--ci");
const VERIFY = process.argv.includes("--verify");
const WRITE = !VERIFY && (CI || process.argv.includes("--write"));

if (CI && process.env.VERCEL_ENV !== "preview") {
  console.log(`[classer-boutique] Ignoré (VERCEL_ENV=${process.env.VERCEL_ENV ?? "local"}).`);
  process.exit(0);
}

// Reprise de sanity/schemas/slugify.ts. Si l'une des deux versions change, l'autre doit suivre.
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
const plain = (s) => slugify(String(s ?? "")).replace(/-/g, " ");

// --- Rubriques -----------------------------------------------------------------
// L'ordre des règles compte : « Pochette livre » doit aller dans les livres,
// pas dans les pochettes.
const RUBRIQUES = [
  { _id: "rubrique-pochettes-sacs", title: "Pochettes & sacs", sortOrder: 1 },
  { _id: "rubrique-pochettes-livre", title: "Pochettes à livre", sortOrder: 2 },
  { _id: "rubrique-chales-crochet", title: "Châles au crochet", sortOrder: 3 },
  { _id: "rubrique-maison-bien-etre", title: "Maison & bien-être", sortOrder: 4 },
];
const RULES = [
  { id: "rubrique-pochettes-livre", test: /\blivres?\b/ },
  { id: "rubrique-chales-crochet", test: /\b(chales?|crochete?e?s?)\b/ },
  { id: "rubrique-pochettes-sacs", test: /\b(pochettes?|bananes?|sacs?|sacoches?|trousses?|tote)\b/ },
  { id: "rubrique-maison-bien-etre", test: /\b(bouillottes?|savons?|douches?|brosses?|miroirs?|macrame|bougies?|etuis?)\b/ },
];
function guess(title) {
  const t = plain(title);
  return RULES.find((r) => r.test.test(t))?.id ?? null;
}

// --- Inventaire de la boutique en ligne au 11/10/2026 (22 produits) ------------
const EXPECTED_SLUGS = [
  "miroir-macrame",
  "banane-xl-canevas-recycle",
  "combi-etuis-brosse-a-dents-et-porte-savon-solide",
  "3-fleurs-de-douches",
  "pochette-100-girl",
  "pochette-100-girly",
  "chale-crochete-blanc-craie",
  "chale-crochete-tons-greige",
  "chale-crochete-noir",
  "bouillotte-en-graines-de-lin-et-sa-housse-lavable",
  "bouillotte-corail-en-graines-de-lin",
  "pochette-livre-matelassee-brodee-la-femme-assise",
  "pochette-livre-matelassee-brodee-la-femme-couchee",
  "pochette-livre-matelassee-brodee",
  "pochette-livre-brodee",
  "pochette-livre-molletonnee-et-brodee",
  "pochette-brodee-love-love-love",
  "pochette-brodee-machine-love-love-love",
  "pochette-love-love-love",
  "pochette-love",
];
// Les deux « Châle crocheté » avaient un slug cassé : ils sont identifiés par leur titre.
const EXPECTED_TITLES = [{ title: "Châle crocheté", count: 2 }];
const EXPECTED_TOTAL = EXPECTED_SLUGS.length + 2;

// --- Connexion -------------------------------------------------------------------
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
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}
const env = { ...loadEnv(new URL("../.env.local", import.meta.url).pathname), ...process.env };
const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "[classer-boutique] NEXT_PUBLIC_SANITY_PROJECT_ID ou SANITY_API_WRITE_TOKEN manquant" +
      (CI ? " dans les variables Preview de Vercel." : ".")
  );
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

const log = (...a) => console.log("[classer-boutique]", ...a);

async function readProducts() {
  const docs = await client.fetch(
    `*[_type == "product"]{ _id, title, status, "slug": slug.current, "category": category._ref } | order(_id asc)`
  );
  const groups = new Map();
  for (const d of docs) {
    const baseId = d._id.replace(/^drafts\./, "");
    if (!groups.has(baseId)) groups.set(baseId, []);
    groups.get(baseId).push(d);
  }
  return [...groups.entries()].map(([baseId, variants]) => {
    const published = variants.find((v) => !v._id.startsWith("drafts.")) ?? null;
    const main = published ?? variants[0];
    return { baseId, variants, published, title: main.title, slug: main.slug, category: main.category };
  });
}

// --- 1 à 3 : écriture ----------------------------------------------------------
log(`Dataset : ${dataset} · mode ${VERIFY ? "vérification" : WRITE ? "écriture" : "simulation"}`);
const before = await readProducts();
log(`${before.length} produit(s) trouvé(s) (brouillons regroupés avec leur version publiée).`);

const takenSlugs = new Set(before.map((p) => p.slug).filter((s) => s && SLUG_PATTERN.test(s)));
let tx = client.transaction();
let ops = 0;

for (const r of RUBRIQUES) {
  tx = tx.createIfNotExists({ _type: "shopCategory", ...r });
  ops++;
}

for (const p of before) {
  const set = {};
  if (!p.category) {
    const target = guess(p.title);
    if (target) set.category = { _type: "reference", _ref: target };
    log(`${target ? "→" : "?"} ${p.title}  ${target ? RUBRIQUES.find((r) => r._id === target).title : "(aucune règle, à ranger à la main)"}`);
  }
  const badSlug = p.variants.some((v) => !v.slug || !SLUG_PATTERN.test(v.slug));
  if (badSlug) {
    const base = slugify(String(p.title || p.baseId)) || slugify(p.baseId);
    let next = base;
    for (let n = 2; takenSlugs.has(next); n++) next = `${base}-${n}`;
    takenSlugs.add(next);
    set["slug"] = { _type: "slug", current: next };
    log(`  slug corrigé : ${JSON.stringify(p.slug)} → "${next}"`);
  }
  if (Object.keys(set).length) {
    for (const v of p.variants) {
      tx = tx.patch(v._id, (patch) => patch.set(set));
      ops++;
    }
  }
}

if (VERIFY) {
  log("Vérification seule : aucune écriture.");
} else if (WRITE) {
  const res = await tx.commit();
  log(`${ops} opération(s) appliquée(s). Transaction ${res.transactionId}`);
} else {
  log(`Simulation : ${ops} opération(s) prévue(s). Relance avec --write pour appliquer.`);
  process.exit(0);
}

// --- 4 : vérification ------------------------------------------------------------
const after = (await readProducts()).filter((p) => p.published);
const categoryIds = new Set(
  await client.fetch(`*[_type == "shopCategory" && !(_id in path("drafts.**"))]._id`)
);
const problems = [];

const slugs = after.map((p) => p.slug);
for (const s of EXPECTED_SLUGS) {
  if (!slugs.includes(s)) problems.push(`Produit manquant : ${s}`);
}
for (const { title, count } of EXPECTED_TITLES) {
  const found = after.filter((p) => p.title?.trim() === title).length;
  if (found < count) problems.push(`« ${title} » : ${found} trouvé(s) sur ${count}`);
}
for (const p of after) {
  if (!p.category || !categoryIds.has(p.category)) problems.push(`Sans rubrique : ${p.title}`);
  if (!p.slug || !SLUG_PATTERN.test(p.slug)) problems.push(`Slug non conforme : ${p.title} (${JSON.stringify(p.slug)})`);
}
const dupes = slugs.filter((s, i) => s && slugs.indexOf(s) !== i);
for (const s of new Set(dupes)) problems.push(`Slug en double : ${s}`);

log("");
log("Inventaire publié :");
for (const r of RUBRIQUES) {
  const items = after.filter((p) => p.category === r._id);
  log(`  ${r.title} (${items.length})`);
  for (const p of items) log(`    - ${p.title}  /produit/${p.slug}`);
}
const others = after.filter((p) => !RUBRIQUES.some((r) => r._id === p.category));
if (others.length) {
  log(`  Autres rubriques ou sans rubrique (${others.length})`);
  for (const p of others) log(`    - ${p.title}`);
}
log(`Total publié : ${after.length} (attendu au moins ${EXPECTED_TOTAL}).`);

if (problems.length) {
  console.error("[classer-boutique] ÉCHEC de la vérification :");
  for (const pb of problems) console.error(`  - ${pb}`);
  process.exit(1);
}
log("Vérification OK : tout l'inventaire est présent et rangé.");
