"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Camera,
  Maximize2,
} from "lucide-react";
import type { PortfolioMediaItem } from "@/types/models";

interface VipPortfolioGalleryProps {
  mediaItems: PortfolioMediaItem[];
  modelName: string;
}

export function VipPortfolioGallery({
  mediaItems,
  modelName,
}: VipPortfolioGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const isOpen = selectedIndex !== null;

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null || mediaItems.length === 0) return null;
      return (prev - 1 + mediaItems.length) % mediaItems.length;
    });
  }, [mediaItems.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null || mediaItems.length === 0) return null;
      return (prev + 1) % mediaItems.length;
    });
  }, [mediaItems.length]);

  // Navegación con teclado (Flechas izquierda/derecha y Escape) + bloqueo de scroll del body
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, handleClose, handlePrev, handleNext]);

  // Soporte táctil de Swipe (Deslizar a izquierda / derecha en móvil)
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const deltaX = endX - touchStartX.current;

    // Umbral de 45px para detectar el gesto de deslizar
    if (deltaX > 45) {
      handlePrev();
    } else if (deltaX < -45) {
      handleNext();
    }
    touchStartX.current = null;
  }

  if (mediaItems.length === 0) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-xs text-zinc-400">
        Sin fotos publicadas aún.
      </p>
    );
  }

  const activeItem =
    selectedIndex !== null ? mediaItems[selectedIndex] : null;

  return (
    <>
      {/* Cuadrícula Interactiva */}
      <div className="grid grid-cols-2 gap-3">
        {mediaItems.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedIndex(idx)}
            className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 text-left focus:outline-none focus:ring-2 focus:ring-white/40 active:scale-[0.98] transition-transform"
          >
            {item.type === "video" ? (
              <video
                src={item.media_url}
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.media_url}
                alt={`${modelName} · ${idx + 1}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}

            {/* Indicador de tipo / ampliar */}
            <div className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs">
              {item.type === "video" ? (
                <Play className="h-3.5 w-3.5 fill-white" />
              ) : (
                <Camera className="h-3.5 w-3.5" />
              )}
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 pt-8 opacity-90 transition-opacity group-hover:opacity-100">
              <span className="text-[11px] font-medium text-zinc-200">
                {idx + 1} / {mediaItems.length}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
                <Maximize2 className="h-2.5 w-2.5" />
                Ampliar
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Visor Lightbox Pantalla Completa con Swipe y Carrusel */}
      {isOpen && activeItem && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visor de portafolio a pantalla completa"
          className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 text-white backdrop-blur-xl select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Barra Superior del Lightbox */}
          <div className="flex items-center justify-between px-4 py-4 sm:px-6">
            <div>
              <p className="text-xs font-semibold text-white">{modelName}</p>
              <p className="text-[11px] text-zinc-400">
                Archivo {selectedIndex + 1} de {mediaItems.length} · Desliza
                para navegar
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 active:scale-95"
              aria-label="Cerrar visor"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Área Central de Imagen / Video con Botones Anterior y Siguiente */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-2 sm:px-14">
            {mediaItems.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition-transform hover:bg-white/20 active:scale-95"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            <div className="flex max-h-[75dvh] w-full max-w-2xl items-center justify-center">
              {activeItem.type === "video" ? (
                <video
                  key={activeItem.id}
                  src={activeItem.media_url}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[75dvh] max-w-full rounded-2xl object-contain shadow-2xl"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={activeItem.id}
                  src={activeItem.media_url}
                  alt={`${modelName} · ${selectedIndex + 1}`}
                  className="max-h-[75dvh] max-w-full rounded-2xl object-contain shadow-2xl transition-all duration-200"
                />
              )}
            </div>

            {mediaItems.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition-transform hover:bg-white/20 active:scale-95"
                aria-label="Siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Tira Inferior de Miniaturas Scrollable */}
          <div className="border-t border-white/10 bg-zinc-950/80 px-4 py-3">
            <div className="mx-auto flex max-w-md items-center justify-center gap-2 overflow-x-auto py-1">
              {mediaItems.map((thumb, idx) => {
                const isCurrent = idx === selectedIndex;
                return (
                  <button
                    key={thumb.id}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`relative h-12 w-10 shrink-0 overflow-hidden rounded-lg transition-all ${
                      isCurrent
                        ? "ring-2 ring-white scale-105 opacity-100"
                        : "opacity-45 hover:opacity-80"
                    }`}
                  >
                    {thumb.type === "video" ? (
                      <video
                        src={thumb.media_url}
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumb.media_url}
                        alt={`Miniatura ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
