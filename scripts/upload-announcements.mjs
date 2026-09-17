#!/usr/bin/env node
/**
 * Téléverse les affiches d'Elisabeth dans Sanity et crée les annonces.
 *
 *   node scripts/upload-announcements.mjs <dossier>            # simulation
 *   node scripts/upload-announcements.mjs <dossier> --write    # applique
 *
 * Idempotent : chaque annonce a un _id fixe et `createIfNotExists` ; relancer
 * le script ne crée pas de doublon et n'écrase pas les retouches faites depuis
 * le Studio. L'image, elle, n'est téléversée que si l'annonce n'existe pas.
 *
 * Les identifiants n'utilisent QUE des tirets, jamais de point : Sanity traite
 * un _id contenant un point comme un chemin privé, lisible avec un jeton mais
 * invisible pour une requête publique. Le site interroge Sanity sans jeton, et
 * les annonces n'apparaissaient donc nulle part.
 *
 * Les titres et dates ci-dessous ont été relevés sur les affiches elles-mêmes.
 * Les dates sont en 2026 : le 19 octobre 2026 tombe bien un lundi, ce qui
 * correspond aux jours annoncés.
 */

import { readFileSync, existsSync } from "node:fs";
import { basename, join } from "node:path";
import { createClient } from "@sanity/client";

const WRITE = process.argv.includes("--write");
const dir = process.argv[2];

if (!dir || dir.startsWith("--")) {
  console.error("Usage : node scripts/upload-announcements.mjs <dossier> [--write]");
  process.exit(1);
}

const ANNOUNCEMENTS = [
  {
    _id: "announcement-toussaint-2026-programme",
    file: "1.png",
    title: "Programme des vacances de la Toussaint",
    summary:
      "Une semaine d'ateliers créatifs dès 8 ans, du lundi 19 au vendredi 23 octobre, de 14h à 16h. 35 € la séance de 2h, 150 € la semaine complète. Matériel et fournitures compris, places limitées.",
    dateStart: "2026-10-19",
    dateEnd: "2026-10-23",
  },
  {
    _id: "announcement-toussaint-2026-lundi-macrame",
    file: "2.png",
    title: "Lundi 19 octobre — J'apprends le macramé",
    summary:
      "De 14h à 16h : réalisation de feuilles en macramé et confection d'une décoration. Dès 8 ans, matériel compris.",
    dateStart: "2026-10-19",
    dateEnd: "2026-10-19",
  },
  {
    _id: "announcement-toussaint-2026-mardi-pochon",
    file: "3.png",
    title: "Mardi 20 octobre — Je couds mon pochon d'Halloween",
    summary: "De 14h à 16h. Dès 8 ans, matériel et fournitures compris.",
    dateStart: "2026-10-20",
    dateEnd: "2026-10-20",
  },
  {
    _id: "announcement-toussaint-2026-mercredi-argile",
    file: "4.png",
    title: "Mercredi 21 octobre — Je m'exerce à l'argile autodurcissante",
    summary:
      "De 14h à 16h : guidé pas à pas, chacun réalise ce qui lui plaît. Dès 8 ans, matériel compris.",
    dateStart: "2026-10-21",
    dateEnd: "2026-10-21",
  },
  {
    _id: "announcement-toussaint-2026-jeudi-tote-bag",
    file: "5.png",
    title: "Jeudi 22 octobre — Je reproduis un dessin et je peins mon tote bag",
    summary: "De 14h à 16h. Dès 8 ans, matériel et fournitures compris.",
    dateStart: "2026-10-22",
    dateEnd: "2026-10-22",
  },
  {
    _id: "announcement-toussaint-2026-vendredi-citrouille",
    file: "6.png",
    title: "Vendredi 23 octobre — Je couds ma citrouille d'Halloween",
    summary:
      "De 14h à 16h : points de base de la couture machine, rembourrage et couture main. Dès 8 ans, matériel compris.",
    dateStart: "2026-10-23",
    dateEnd: "2026-10-23",
  },
  {
    _id: "announcement-automne-2026-julianesse",
    file: "C’est l’automne.png",
    title: "C'est l'automne chez Juli'ânesse",
    summary:
      "Les 17 et 18 octobre, ateliers sur le thème de l'automne : citrouille en tissu et peinture sur tote bag. Dès 8 ans, 15 € matériel inclus. Renseignements et réservation au 06 47 10 30 28.",
    dateStart: "2026-10-17",
    dateEnd: "2026-10-18",
  },
];

// La classe \p{Diacritic} evite d'ecrire une plage de caracteres combinants en
// clair dans le source : une reecriture du fichier par un outil externe peut en
// alterer l'encodage sans que rien ne casse visiblement.
function slugify(input) {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96)
    .replace(/-+$/g, "");
}

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

const existing = await client.fetch(`*[_type == "announcement"]{_id}`);
const existingIds = new Set(existing.map((d) => d._id));

console.log(`Dataset : ${dataset}`);
console.log(`Dossier : ${dir}`);
console.log(`Annonces déjà présentes : ${existing.length}\n`);

const plan = [];
let missingFile = false;

for (const a of ANNOUNCEMENTS) {
  const path = join(dir, a.file);
  const fileExists = existsSync(path);
  if (!fileExists) missingFile = true;

  const state = existingIds.has(a._id)
    ? "existe déjà"
    : fileExists
      ? "à créer"
      : "FICHIER INTROUVABLE";

  console.log(`${state.padEnd(20)} ${a.title}`);
  console.log(`                     ${a.dateStart} → ${a.dateEnd}  ·  ${a.file}`);

  if (!existingIds.has(a._id) && fileExists) plan.push({ ...a, path });
}

console.log(`\nÀ créer : ${plan.length} sur ${ANNOUNCEMENTS.length}`);

if (missingFile) {
  console.log("\nAttention : au moins un fichier est introuvable, il sera ignoré.");
}

if (!WRITE) {
  console.log("\nSimulation. Relance avec --write pour appliquer.");
  process.exit(0);
}

if (plan.length === 0) {
  console.log("Rien à faire.");
  process.exit(0);
}

console.log("\nTéléversement des images...\n");

for (const a of plan) {
  const buffer = readFileSync(a.path);
  const asset = await client.assets.upload("image", buffer, {
    filename: basename(a.path),
    contentType: "image/png",
  });
  console.log(`  image ok  ${a.file}  ->  ${asset._id}`);

  await client.createIfNotExists({
    _id: a._id,
    _type: "announcement",
    title: a.title,
    slug: { _type: "slug", current: slugify(a.title) },
    summary: a.summary,
    dateStart: a.dateStart,
    dateEnd: a.dateEnd,
    isActive: true,
    image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
  });
  console.log(`  annonce   ${a.title}`);
}

console.log(`\n${plan.length} annonce(s) créée(s).`);
console.log("Visibles dans /admin sous « Annonce (affiche) » et sur la page Ateliers.");
