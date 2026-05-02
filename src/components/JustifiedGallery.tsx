"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

const artworks = [
  { id: 1, src: "/1.jpeg", title: "Vessel", category: "Environment Design", year: "2024" },
  { id: 2, src: "/4.jpeg", title: "Iron Journey", category: "Vehicle Concept", year: "2024" },
  { id: 3, src: "/5.jpeg", title: "The Awakening", category: "Environment Design", year: "2025" },
  { id: 4, src: "/6.jpeg", title: "Ember Realm", category: "Environment Design", year: "2025" },
  { id: 5, src: "/7.jpeg", title: "Sovereign", category: "Character Concept", year: "2025" },
];

type Artwork = (typeof artworks)[0];

interface ArtworkWithRatio extends Artwork {
  ratio: number;
}

interface RowImage extends ArtworkWithRatio {
  displayWidth: number;
  displayHeight: number;
}

interface Row {
  images: RowImage[];
  height: number;
}

const GAP = 10;
const MAX_ROW_HEIGHT = 520;

async function loadRatio(src: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(img.naturalWidth / img.naturalHeight);
    img.onerror = () => resolve(4 / 3);
    img.src = src;
  });
}

function computeRows(
  images: ArtworkWithRatio[],
  containerWidth: number,
  targetRowHeight: number
): Row[] {
  const rows: Row[] = [];
  let pending: (ArtworkWithRatio & { scaledWidth: number })[] = [];
  let pendingWidth = 0;

  for (const img of images) {
    const scaledWidth = targetRowHeight * img.ratio;
    pending.push({ ...img, scaledWidth });
    pendingWidth += scaledWidth;

    const availableWidth = containerWidth - GAP * (pending.length - 1);

    if (pendingWidth >= availableWidth) {
      const scale = availableWidth / pendingWidth;
      const rowHeight = Math.min(targetRowHeight * scale, MAX_ROW_HEIGHT);
      const finalScale = rowHeight / targetRowHeight;
      rows.push({
        height: rowHeight,
        images: pending.map((p) => ({
          ...p,
          displayWidth: p.scaledWidth * finalScale,
          displayHeight: rowHeight,
        })),
      });
      pending = [];
      pendingWidth = 0;
    }
  }

  if (pending.length > 0) {
    const availableWidth = containerWidth - GAP * (pending.length - 1);
    if (pendingWidth >= availableWidth) {
      const scale = availableWidth / pendingWidth;
      const rowHeight = Math.min(targetRowHeight * scale, MAX_ROW_HEIGHT);
      const finalScale = rowHeight / targetRowHeight;
      rows.push({
        height: rowHeight,
        images: pending.map((p) => ({
          ...p,
          displayWidth: p.scaledWidth * finalScale,
          displayHeight: rowHeight,
        })),
      });
    } else {
      const rowHeight = Math.min(targetRowHeight, MAX_ROW_HEIGHT);
      rows.push({
        height: rowHeight,
        images: pending.map((p) => ({
          ...p,
          displayWidth: p.ratio * rowHeight,
          displayHeight: rowHeight,
        })),
      });
    }
  }

  return rows;
}

function GalleryImage({ img }: { img: RowImage }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden shrink-0"
      style={{ width: img.displayWidth, height: img.displayHeight }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={img.src}
        alt={img.title}
        fill
        sizes="50vw"
        quality={85}
        className="object-contain"
        style={{
          transform: hovered ? "scale(1.03)" : "scale(1)",
          transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      />

      <div
        className="absolute inset-0 flex flex-col justify-end p-5"
        style={{
          background: hovered
            ? "linear-gradient(to top, rgba(10,10,10,0.78) 0%, rgba(10,10,10,0.18) 55%, transparent 100%)"
            : "transparent",
          transition: "background 0.45s ease",
        }}
      >
        <div
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.35s ease, transform 0.35s ease",
          }}
        >
          <p
            className="text-[9px] tracking-[0.3em] uppercase mb-1"
            style={{ color: "#c8a97e", fontFamily: "var(--font-body)" }}
          >
            {img.category}
          </p>
          <p
            className="text-lg font-normal leading-tight"
            style={{
              color: "#ede8e0",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.05em",
            }}
          >
            {img.title}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function JustifiedGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [ready, setReady] = useState(false);
  const ratiosRef = useRef<ArtworkWithRatio[] | null>(null);

  const recompute = useCallback((artworksWithRatios: ArtworkWithRatio[]) => {
    if (!containerRef.current) return;
    const w = containerRef.current.offsetWidth;
    const targetHeight = Math.min(Math.max(window.innerHeight * 0.38, 220), MAX_ROW_HEIGHT);
    setRows(computeRows(artworksWithRatios, w, targetHeight));
    setReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all(artworks.map(async (a) => ({ ...a, ratio: await loadRatio(a.src) }))).then(
      (withRatios) => {
        if (cancelled) return;
        ratiosRef.current = withRatios;
        recompute(withRatios);
      }
    );
    return () => { cancelled = true; };
  }, [recompute]);

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (ratiosRef.current) recompute(ratiosRef.current);
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [recompute]);

  return (
    <div ref={containerRef} className="w-full" style={{ padding: "32px 40px 40px" }}>
      {ready &&
        rows.map((row, ri) => (
          <div
            key={ri}
            className="flex overflow-hidden"
            style={{
              height: row.height,
              gap: GAP,
              marginBottom: ri < rows.length - 1 ? GAP : 0,
            }}
          >
            {row.images.map((img) => (
              <GalleryImage key={img.id} img={img} />
            ))}
          </div>
        ))}
    </div>
  );
}
