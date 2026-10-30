"use client";

import React, { useState } from "react";
import { Plus, Play, Camera, Film } from "lucide-react";
import { MOCK_PORTFOLIO_MEDIA } from "@/lib/mock/tenant-data";
import type { MediaType } from "@/types/models";

export default function TenantPortfolioPage() {
  const [filter, setFilter] = useState<"all" | MediaType>("all");

  const filteredMedia =
    filter === "all"
      ? MOCK_PORTFOLIO_MEDIA
      : MOCK_PORTFOLIO_MEDIA.filter((item) => item.type === filter);

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
          { key: "all", label: "Todos" },
          { key: "photo", label: "Fotos" },
          { key: "video", label: "Videos" },
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
      <div className="grid grid-cols-2 gap-3">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-200 shadow-2xs"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.media_url}
              alt={item.caption ?? "Media del portafolio"}
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

            {/* Pie con Caption */}
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
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
