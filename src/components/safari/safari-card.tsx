import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, TrendingUp, ArrowUpRight } from "lucide-react";
import { HoverCard } from "@/components/motion/hover-card";
import { formatPrice, categoryLabel, difficultyLabel } from "@/lib/utils";
import type { TripCard } from "@/lib/types";

interface SafariCardProps {
  trip: TripCard;
}

export function SafariCard({ trip }: SafariCardProps) {
  const imageUrl = trip.heroImage?.asset?.url ?? null;

  return (
    <HoverCard lift={5} className="h-full">
      <Link
        href={`/safari-reizen/${trip.slug}`}
        className="flex flex-col h-full group"
      >
        <article
          className="flex flex-col h-full rounded-3xl overflow-hidden transition-all duration-500 ease-out border border-[var(--border-subtle)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_20px_80px_-15px_rgba(0,0,0,0.15)] group-hover:-translate-y-1"
          style={{ background: "var(--card-strip-bg)" }}
        >
          {/* ── Image zone ────────────────────────────── */}
          <div className="relative h-56 shrink-0 overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={trip.heroImage?.alt ?? trip.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div
                className="h-full w-full"
                style={{ background: "rgba(26,15,5,0.8)" }}
              />
            )}

            {/* Subtle vignette — only top corners + bottom edge */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 35%, rgba(0,0,0,0.18) 100%)",
              }}
            />

            {/* Badges — hidden by default, slide in on group hover */}
            <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2 pointer-events-none group-hover:pointer-events-auto opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
              {trip.category && (
                <span
                  className="rounded-full px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] backdrop-blur-xl bg-black/40 text-white/95 border border-white/10 shadow-sm"
                >
                  {categoryLabel(trip.category)}
                </span>
              )}
              {trip.featured && (
                <span
                  className="rounded-full px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] backdrop-blur-xl bg-gold/80 text-white border border-white/20 shadow-sm ml-auto"
                >
                  Aanbevolen
                </span>
              )}
            </div>
          </div>

          {/* ── Content zone ────────────────────────── */}
          <div className="flex flex-col grow">
            {/* Gold accent line */}
            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(to right, rgba(42,125,88,0.6), rgba(42,125,88,0.15) 65%, transparent)",
              }}
            />

            {/* Main content */}
            <div className="flex flex-col grow px-4 pt-3 pb-0">
              {trip.destination && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <MapPin
                    className="h-3 w-3 shrink-0"
                    style={{ color: "#5aad7e" }}
                  />
                  <span
                    className="text-[10px] font-semibold uppercase tracking-[0.13em]"
                    style={{ color: "#5aad7e" }}
                  >
                    {trip.destination.name}, {trip.destination.country}
                  </span>
                </div>
              )}

              <h3
                className="font-serif text-[0.95rem] font-semibold leading-snug mb-2"
                style={{ color: "var(--card-strip-text)" }}
              >
                {trip.title}
              </h3>

              {/* Meta pills */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span
                  className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    background: "rgba(42,125,88,0.1)",
                    color: "var(--card-strip-muted)",
                    border: "1px solid rgba(42,125,88,0.14)",
                  }}
                >
                  <Clock className="h-2.5 w-2.5" />
                  {trip.duration}
                </span>
                {trip.difficulty && (
                  <span
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      background: "rgba(42,125,88,0.1)",
                      color: "var(--card-strip-muted)",
                      border: "1px solid rgba(42,125,88,0.14)",
                    }}
                  >
                    <TrendingUp className="h-2.5 w-2.5" />
                    {difficultyLabel(trip.difficulty)}
                  </span>
                )}
              </div>

              {/* Spacer pushes price to bottom */}
              <div className="grow" />
            </div>

            {/* Price + CTA — pinned to bottom */}
            <div className="px-4 pb-4 pt-2">
              <div
                style={{
                  height: "1px",
                  background: "var(--card-strip-border)",
                }}
                className="mb-3"
              />
              <div className="flex items-end justify-between">
                <div>
                  <p
                    className="text-[9px] font-semibold uppercase tracking-[0.18em] mb-0.5"
                    style={{ color: "var(--card-strip-muted)" }}
                  >
                    Vanaf
                  </p>
                  <p
                    className="text-[1.3rem] font-bold leading-none"
                    style={{ color: "#2a7d58" }}
                  >
                    {formatPrice(trip.price)}
                  </p>
                  <p
                    className="text-[9px] mt-0.5"
                    style={{ color: "var(--card-strip-muted)" }}
                  >
                    {trip.priceType === "per_group"
                      ? "per groep"
                      : "per persoon"}
                  </p>
                </div>

                <div
                  className="flex items-center gap-1.5 rounded-full px-4 py-2 border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] backdrop-blur-md transition-all duration-500 ease-out group-hover:bg-gold group-hover:border-transparent group-hover:shadow-[0_8px_20px_rgba(42,125,88,0.25)] text-gold group-hover:text-white"
                >
                  <span className="text-[11px] font-semibold">Bekijk</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-all duration-500 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </HoverCard>
  );
}
