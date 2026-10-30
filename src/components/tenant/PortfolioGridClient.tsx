"use client";

import React, { useState } from "react";
import { Plus, Play, Camera, Film } from "lucide-react";
import type { MediaType, PortfolioMediaItem } from "@/types/models";

interface PortfolioGridClientProps {
  mediaItems: PortfolioMediaItem[];
}

export function PortfolioGridClient({ mediaItems }: PortfolioGridClientProps) {
  const [filter, setFilter] = useState<"all" | MediaType>("all");

  const filteredMedia =
    filter === "all"
      ? mediaItems
      : mediaItems.filter((item) => item.type === filter);

  return (
    <div className="space-y-4">
      {/* Cabecera de Sección */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-zinc-900">
            Mi Portafolio
          </h2>
          <p className="text-xs text-zinc-500">
            Gestiona las fotos y reels de tu book privado.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3 py-2 text-xs font-medium text-white shadow-xs transition-transform active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Subir</span>
        </button>
      </div>

      {/* Filtros Táctiles */}
      <div className="flex items-center gap-2">
        {[
          { key: "all", label: `Todos (${mediaItems.length})` },
          {
            key: "photo",
            label: `Fotos (${mediaItems.filter((m) => m.type === "photo").length})`,
          },
          {
            key: "video",
            label: `Videos (${mediaItems.filter((m) => m.type === "video").length})`,
          },
        ].map((tab) => {
          const active = filter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key as "all" | MediaType)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-200 bg-white text-zinc-600"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid Móvil de Medios (`portfolio_media`) */}
      {filteredMedia.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
          <p className="text-xs font-medium text-zinc-600">
            No se encontraron archivos en `portfolio_media`.
          </p>
          <p className="mt-1 text-[11px] text-zinc-400">
            En el próximo sprint conectaremos Supabase Storage para subir nuevas fotos y videos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredMedia.map((item) => {
            const formattedDate = new Date(item.created_at).toLocaleDateString(
              "es-ES",
              {
                day: "2-digit",
                month: "short",
              }
            );

            return (
              <div
                key={item.id}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-200 shadow-2xs"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.media_url}
                  alt={item.caption ?? `Media ${item.id.slice(0, 6)}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Badge de Tipo (photo / video) */}
                <div className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-950/65 text-white backdrop-blur-xs">
                  {item.type === "video" ? (
                    <Play className="h-3.5 w-3.5 fill-white" />
                  ) : (
                    <Camera className="h-3.5 w-3.5" />
                  )}
                </div>

                {/* Pie con metadatos reales */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-3 pt-8">
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-zinc-300">
                    {item.type === "video" ? (
                      <>
                        <Film className="h-2.5 w-2.5" /> Video
                      </>
                    ) : (
                      <>
                        <Camera className="h-2.5 w-2.5" /> Foto
                      </>
                    )}
                  </span>
                  <p className="truncate text-xs font-medium text-white">
                    {item.caption ?? `Publicado · ${formattedDate}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
