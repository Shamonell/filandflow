#!/usr/bin/env node
/**
 * Corrige les identifiants des annonces créées avec un point.
 *
 *   node scripts/fix-announcement-ids.mjs            # simulation
 *   node scripts/fix-announcement-ids.mjs --write    # applique
 *
 * Pourquoi
 * --------
 * Les annonces avaient été créées avec des _id de la forme
 * `announcement.toussaint-2026-programme`. Or Sanity traite un identifiant
 * contenant un point comme un chemin privé : le document reste lisible avec un
 * jeton, mais invisible pour une requête publique. Le site interroge Sanity
 * sans jeton, donc la page Ateliers n'affichait aucune annonce.
 * Vérifié : 7 documents avec le jeton, 0 sans.
 *
 * Le correctif recopie chaque document sous un identifiant sans point et
 * supprime l'ancien. Les images ne sont pas re-téléversées : on réutilise la
 * même référence d'asset.
 */

import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

const WRITE = process.argv.includes("--write");

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

const docs = await client.fetch(`*[_type == "announcement"]`);
const broken = docs.filter((d) => d._id.includes("."));

console.log(`Dataset : ${dataset}`);
console.log(`Annonces : ${docs.length}, dont ${broken.length} avec un point dans l'identifiant\n`);

for (const d of broken) {
  console.log(`  ${d._id}`);
  console.log(`  -> ${d._id.replace(/\./g, "-")}`);
}

if (broken.length === 0) {
  console.log("Rien à corriger.");
  process.exit(0);
}

if (!WRITE) {
  console.log("\nSimulation. Relance avec --write pour appliquer.");
  process.exit(0);
}

console.log("\nRecréation sous un identifiant sans point...\n");

let tx = client.transaction();
for (const d of broken) {
  const { _id, _rev, _createdAt, _updatedAt, ...fields } = d;
  tx = tx.createIfNotExists({ ...fields, _id: _id.replace(/\./g, "-") });
}
for (const d of broken) {
  tx = tx.delete(d._id);
}

const res = await tx.commit();
console.log(`${broken.length} annonce(s) re-identifiée(s). Transaction ${res.transactionId}`);
