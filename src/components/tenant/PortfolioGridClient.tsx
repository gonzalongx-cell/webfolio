"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Play,
  Camera,
  Film,
  Upload,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  uploadPortfolioMediaAction,
  deletePortfolioMediaAction,
} from "@/app/(tenant)/app/actions";
import type { MediaType, PortfolioMediaItem } from "@/types/models";

interface PortfolioGridClientProps {
  mediaItems: PortfolioMediaItem[];
}

export function PortfolioGridClient({ mediaItems }: PortfolioGridClientProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | MediaType>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4500);
  }

  const filteredMedia =
    filter === "all"
      ? mediaItems
      : mediaItems.filter((item) => item.type === filter);

  async function handleUploadSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await uploadPortfolioMediaAction(formData);
      if (!res.success) {
        showToast("error", res.message);
      } else {
        showToast("success", res.message);
        setSelectedFile(null);
        setIsModalOpen(false);
        router.refresh();
      }
    } catch {
      showToast("error", "Error de red al subir el archivo.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (deletingId) return;
    setDeletingId(id);
    const res = await deletePortfolioMediaAction(id);
    if (!res.success) {
      showToast("error", res.message);
    } else {
      showToast("success", res.message);
      router.refresh();
    }
    setDeletingId(null);
  }

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
          onClick={() => setIsModalOpen(true)}
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
            No tienes archivos en esta categoría todavía.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-medium text-white"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Subir primera foto o video</span>
          </button>
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
                {item.type === "video" ? (
                  <video
                    src={item.media_url}
                    className="h-full w-full object-cover"
                    controls
                    playsInline
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.media_url}
                    alt={`Media ${item.id.slice(0, 6)}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}

                {/* Botón Eliminar */}
                <button
                  type="button"
                  disabled={deletingId === item.id}
                  onClick={() => handleDelete(item.id)}
                  title="Eliminar archivo"
                  className="absolute top-2.5 left-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-950/65 text-white backdrop-blur-xs hover:bg-rose-600"
                >
                  {deletingId === item.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </button>

                {/* Badge de Tipo (photo / video) */}
                <div className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-950/65 text-white backdrop-blur-xs">
                  {item.type === "video" ? (
                    <Play className="h-3.5 w-3.5 fill-white" />
                  ) : (
                    <Camera className="h-3.5 w-3.5" />
                  )}
                </div>

                {/* Pie con metadatos reales */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-3 pt-8">
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

      {/* Modal Móvil de Subida a Supabase Storage (`portfolio-media`) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/50 p-4 backdrop-blur-xs sm:items-center">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-zinc-200">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-sm font-semibold text-zinc-900">
                Subir Foto o Video al Book
              </h3>
              <button
                type="button"
                disabled={isUploading}
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-center transition-colors hover:border-zinc-900">
                <Upload className="h-6 w-6 text-zinc-500" />
                <span className="mt-2 text-xs font-semibold text-zinc-800">
                  {selectedFile
                    ? selectedFile.name
                    : "Toca para elegir foto o video"}
                </span>
                <span className="mt-1 text-[11px] text-zinc-400">
                  Bucket: `portfolio-media` (JPG, PNG, WEBP, MP4)
                </span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) =>
                    setSelectedFile(e.target.files?.[0] ?? null)
                  }
                />
              </label>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 flex-1 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-zinc-900 text-xs font-semibold text-white disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Subiendo...</span>
                    </>
                  ) : (
                    <span>Publicar en Book</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-20 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-2.5 rounded-xl border p-3.5 shadow-lg ${
            toast.type === "error"
              ? "border-rose-200 bg-rose-50 text-rose-900"
              : "border-emerald-200 bg-white text-zinc-900"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          ) : (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          )}
          <p className="flex-1 text-xs font-medium">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
