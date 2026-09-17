#!/usr/bin/env node
/**
 * Crée dans Sanity les quatre « Exemples d'ateliers proposés » de la page
 * /ateliers-chez-vous, qui étaient jusqu'ici écrits en dur dans le JSX.
 *
 *   node scripts/seed-home-workshops.mjs            # simulation
 *   node scripts/seed-home-workshops.mjs --write    # applique
 *
 * Idempotent : chaque document a un _id fixe, donc relancer le script ne crée
 * pas de doublon. `createIfNotExists` laisse intactes les modifications faites
 * depuis le Studio.
 *
 * Les identifiants n'utilisent QUE des tirets, jamais de point : Sanity traite
 * un _id contenant un point comme un chemin privé, lisible avec un jeton mais
 * invisible pour une requête publique. Les annonces créées avec un point
 * n'apparaissaient nulle part sur le site.
 *
 * Les documents sont créés SANS photo, volontairement : les fichiers
 * /public/ateliers-chez-vous/*.jpg référencés à l'origine n'ont jamais existé
 * dans le dépôt, et ces cartes affichent le dégradé de repli depuis toujours.
 * Elisabeth dépose la bonne photo sur chacune depuis le Studio ; le champ
 * image étant obligatoire, le Studio les signale tant que c'est à faire.
 */

import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

const WRITE = process.argv.includes("--write");

const WORKSHOPS = [
  {
    _id: "homeWorkshop-pochette-sac",
    title: "Pochette-sac",
    duration: "4h",
    price: 65,
    sortOrder: 1,
  },
  {
    _id: "homeWorkshop-pochette-chutes-de-tissus",
    title: "Pochette en chutes de tissus avec étiquette brodée",
    duration: "2h30",
    price: 50,
    sortOrder: 2,
  },
  {
    _id: "homeWorkshop-housse-de-coussin-patchwork-zippee",
    title: "Housse de coussin patchwork zippée",
    duration: "2h30",
    price: 40,
    sortOrder: 3,
  },
  {
    _id: "homeWorkshop-besace",
    title: "Besace",
    duration: "4h30",
    price: 65,
    sortOrder: 4,
  },
];

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
});

const existing = await client.fetch(
  `*[_type == "homeWorkshop"]{_id, title}`,
);
const existingIds = new Set(existing.map((d) => d._id));

console.log(`Dataset : ${dataset}`);
console.log(`Documents homeWorkshop déjà présents : ${existing.length}\n`);

for (const w of WORKSHOPS) {
  const state = existingIds.has(w._id) ? "existe déjà, ignoré" : "à créer";
  console.log(`${state.padEnd(20)} ${w.title}`);
  console.log(`                     ${w.duration} · ${w.price}€ · sans photo`);
}

const toCreate = WORKSHOPS.filter((w) => !existingIds.has(w._id));
console.log(`\nÀ créer : ${toCreate.length} sur ${WORKSHOPS.length}`);

if (!WRITE) {
  console.log("\nSimulation. Relance avec --write pour appliquer.");
  process.exit(0);
}

if (toCreate.length === 0) {
  console.log("Rien à faire.");
  process.exit(0);
}

let tx = client.transaction();
for (const w of toCreate) {
  tx = tx.createIfNotExists({
    _id: w._id,
    _type: "homeWorkshop",
    title: w.title,
    slug: { _type: "slug", current: w._id.replace("homeWorkshop-", "") },
    duration: w.duration,
    price: w.price,
    sortOrder: w.sortOrder,
    isActive: true,
  });
}

const res = await tx.commit();
console.log(`\n${toCreate.length} document(s) créé(s). Transaction ${res.transactionId}`);
console.log("Visibles dans /admin sous « Atelier chez vous (exemple) ».");
