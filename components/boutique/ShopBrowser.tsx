"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ShopCategory, ShopItem, ProductStatus } from "@/lib/shop";

/** Durée pendant laquelle une pièce porte la pastille « Nouveau ». */
const NEW_FOR_MS = 21 * 24 * 60 * 60 * 1000;

type Sort = "recent" | "asc" | "desc";

const STATUS_STYLE: Record<ProductStatus, { label: string; className: string }> = {
  disponible: { label: "disponible", className: "bg-green-100 text-green-800" },
  "en demande": { label: "en demande", className: "bg-amber-100 text-amber-800" },
  réservé: { label: "réservé", className: "bg-yellow-100 text-yellow-800" },
  vendu: { label: "adoptée", className: "bg-gray-100 text-gray-700" },
};

interface ShopBrowserProps {
  items: ShopItem[];
  categories: ShopCategory[];
  /** Rubrique ouverte au chargement (page /boutique/[rubrique]), sinon « Tout voir ». */
  initialSlug: string | null;
  /** Horodatage du rendu serveur, pour un calcul « Nouveau » identique au serveur et au navigateur. */
  now: number;
}

function slugFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/boutique\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function plural(n: number, one: string, many: string) {
  return `${n} ${n > 1 ? many : one}`;
}

export default function ShopBrowser({ items, categories, initialSlug, now }: ShopBrowserProps) {
  const [current, setCurrent] = useState<string | null>(initialSlug);
  const [showSold, setShowSold] = useState(false);
  const [sort, setSort] = useState<Sort>("recent");

  // Bouton « retour » du navigateur : on suit l'adresse.
  useEffect(() => {
    const onPop = () => setCurrent(slugFromPath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const select = (slug: string | null) => {
    if (slug === current) return;
    setCurrent(slug);
    window.history.pushState(null, "", slug ? `/boutique/${slug}` : "/boutique");
  };

  const active = categories.find((c) => c.slug === current) ?? null;

  // Une rubrique vide n'a pas d'étiquette, sauf si on arrive directement dessus.
  const menu = categories.filter((c) => c.available > 0 || c.slug === current);
  const totalAvailable = items.filter((i) => i.status !== "vendu").length;

  const { shown, availableCount, soldCount } = useMemo(() => {
    const inScope = active ? items.filter((i) => i.categoryId === active.id) : items;
    const available = inScope.filter((i) => i.status !== "vendu");
    const sold = inScope.filter((i) => i.status === "vendu");
    const time = (i: ShopItem) => (i.createdAt ? Date.parse(i.createdAt) : 0);
    const compare = {
      recent: (a: ShopItem, b: ShopItem) => time(b) - time(a),
      asc: (a: ShopItem, b: ShopItem) => a.price - b.price,
      desc: (a: ShopItem, b: ShopItem) => b.price - a.price,
    }[sort];
    return {
      shown: [...available].sort(compare).concat(showSold ? [...sold].sort(compare) : []),
      availableCount: available.length,
      soldCount: sold.length,
    };
  }, [items, active, sort, showSold]);

  return (
    <div className="grid grid-cols-1 gap-6">
      {menu.length > 0 && (
        <nav aria-label="Rubriques de la boutique">
          <ul className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
            <li className="shrink-0">
              <CategoryTag
                label="Tout voir"
                count={totalAvailable}
                pressed={current === null}
                onClick={() => select(null)}
              />
            </li>
            {menu.map((c) => (
              <li key={c.id} className="shrink-0">
                <CategoryTag
                  label={c.title}
                  count={c.available}
                  thumbUrl={c.thumbUrl}
                  pressed={current === c.slug}
                  onClick={() => select(c.slug)}
                />
              </li>
            ))}
          </ul>
        </nav>
      )}

      {active?.word && (
        <figure className="flex items-center gap-4 rounded-2xl bg-[#EEF4EE] px-5 py-4">
          <Image
            src="/elisabeth-portrait.webp"
            alt="Elisabeth"
            width={52}
            height={52}
            className="h-[52px] w-[52px] shrink-0 rounded-full border-2 border-white object-cover"
          />
          <div>
            <blockquote className="font-serif text-lg italic leading-snug text-[#5C3A21]">
              « {active.word} »
            </blockquote>
            <figcaption className="mt-1 text-sm text-[#5F6C72]">
              Elisabeth, à l&apos;atelier de Chabeuil
            </figcaption>
          </div>
        </figure>
      )}

      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-b border-beige-200 pb-3 text-sm text-[#5F6C72]">
        <p className="tabular-nums" aria-live="polite">
          {plural(availableCount, "pièce disponible", "pièces disponibles")}
          {soldCount > 0 && !showSold && (
            <> · {plural(soldCount, "adoptée masquée", "adoptées masquées")}</>
          )}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {soldCount > 0 && (
            <label htmlFor="boutique-adoptees" className="inline-flex cursor-pointer items-center gap-2">
              <input
                id="boutique-adoptees"
                type="checkbox"
                checked={showSold}
                onChange={(e) => setShowSold(e.target.checked)}
                className="h-4 w-4 accent-[#6F8F72]"
              />
              Voir aussi les pièces adoptées
            </label>
          )}
          <label htmlFor="boutique-tri" className="inline-flex items-center gap-2">
            Trier
            <select
              id="boutique-tri"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-lg border border-beige-200 bg-white px-2 py-1 text-[#1F2933]"
            >
              <option value="recent">Les plus récentes</option>
              <option value="asc">Prix croissant</option>
              <option value="desc">Prix décroissant</option>
            </select>
          </label>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="rounded-2xl bg-[#EEF4EE] p-10 text-center">
          <p className="text-lg text-[#5F6C72]">
            {soldCount > 0
              ? "Toutes les pièces de cette rubrique ont trouvé preneur."
              : "Aucune pièce dans cette rubrique pour le moment."}
          </p>
          <p className="mt-3 text-[#5F6C72]">
            N&apos;hésitez pas à me contacter pour découvrir les prochaines créations.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {shown.map((item) => (
            <ShopCard
              key={item.id}
              item={item}
              isNew={
                item.status !== "vendu" &&
                !!item.createdAt &&
                now - Date.parse(item.createdAt) < NEW_FOR_MS
              }
              categoryLabel={
                current === null
                  ? categories.find((c) => c.id === item.categoryId)?.title ?? null
                  : null
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryTag({
  label,
  count,
  thumbUrl,
  pressed,
  onClick,
}: {
  label: string;
  count: number;
  thumbUrl?: string | null;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        // La bordure en pointillés intérieure rappelle une étiquette cousue.
        "relative inline-flex items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-4 transition-all duration-200 hover:-translate-y-px",
        "after:pointer-events-none after:absolute after:inset-[3px] after:rounded-full after:border after:border-dashed after:content-['']",
        pressed
          ? "border-[#6F8F72] bg-[#6F8F72] text-white after:border-white/50"
          : "border-beige-200 bg-white text-[#5C3A21] after:border-[#5C3A21]/25"
      )}
    >
      {thumbUrl ? (
        <Image
          src={thumbUrl}
          alt=""
          width={34}
          height={34}
          className="h-[34px] w-[34px] shrink-0 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            "grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full text-sm",
            pressed ? "bg-white/20 text-white" : "bg-[#EEF4EE] text-[#6F8F72]"
          )}
        >
          ✦
        </span>
      )}
      <span className="whitespace-nowrap text-[0.92rem] font-medium">{label}</span>
      <span className={cn("text-xs tabular-nums", pressed ? "text-white/85" : "text-[#5F6C72]")}>
        {count}
      </span>
    </button>
  );
}

function ShopCard({
  item,
  isNew,
  categoryLabel,
}: {
  item: ShopItem;
  isNew: boolean;
  categoryLabel: string | null;
}) {
  const status = STATUS_STYLE[item.status] ?? STATUS_STYLE.disponible;
  const sold = item.status === "vendu";
  return (
    <Link href={`/produit/${item.slug}`}>
      <div className="group h-full overflow-hidden rounded-2xl border border-beige-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
        <div className="relative aspect-square overflow-hidden bg-[#EEF4EE]">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className={cn(
                "object-cover transition-transform duration-500 group-hover:scale-105",
                sold && "opacity-90 saturate-[.35]"
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[#5F6C72]">
              Aucune image
            </div>
          )}
          {isNew && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-[#C76B3A] px-2 py-0.5 text-xs font-medium text-white">
              Nouveau
            </span>
          )}
        </div>
        <div className="p-3 sm:p-5">
          <div className="mb-1.5 flex flex-col items-start gap-1.5 sm:flex-row sm:justify-between sm:gap-2">
            <h3 className="line-clamp-2 text-sm font-medium text-[#5C3A21] sm:text-lg">
              {item.title}
            </h3>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-1 text-xs font-medium",
                status.className
              )}
            >
              {status.label}
            </span>
          </div>
          {categoryLabel && <p className="mb-1 text-xs text-[#5F6C72]">{categoryLabel}</p>}
          <p className="text-base font-semibold text-[#6F8F72] sm:text-xl">
            {item.price.toFixed(2)} €
          </p>
        </div>
      </div>
    </Link>
  );
}
