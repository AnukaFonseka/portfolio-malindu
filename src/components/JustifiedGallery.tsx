"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

const artworks = [
  {
    id: 1,
    src: "/1.jpeg",
    title: "Vessel",
    category: "Environment Design",
    year: "2024",
    ratio: 4 / 3,
  },
  {
    id: 2,
    src: "/4.jpeg",
    title: "Iron Journey",
    category: "Vehicle Concept",
    year: "2024",
    ratio: 4 / 3,
  },
  {
    id: 3,
    src: "/5.jpeg",
    title: "The Awakening",
    category: "Environment Design",
    year: "2025",
    ratio: 16 / 9,
  },
  {
    id: 4,
    src: "/6.jpeg",
    title: "Ember Realm",
    category: "Environment Design",
    year: "2025",
    ratio: 16 / 9,
  },
  {
    id: 5,
    src: "/7.jpeg",
    title: "Sovereign",
    category: "Character Concept",
    year: "2025",
    ratio: 16 / 9,
  },
];

type Artwork = (typeof artworks)[0];

interface RowImage extends Artwork {
  displayWidth: number;
  displayHeight: number;
}

interface Row {
  images: RowImage[];
  height: number;
}

const GAP = 4; // px between images

function computeRows(
  images: Artwork[],
  containerWidth: number,
  targetRowHeight: number
): Row[] {
  const rows: Row[] = [];
  let pending: (Artwork & { scaledWidth: number })[] = [];
  let pendingWidth = 0;

  for (const img of images) {
    const scaledWidth = targetRowHeight * img.ratio;
    pending.push({ ...img, scaledWidth });
    pendingWidth += scaledWidth;

    // Available pixel width after accounting for gaps between images
    const availableWidth = containerWidth - GAP * (pending.length - 1);

    if (pendingWidth >= availableWidth) {
      const scale = availableWidth / pendingWidth;
      const rowHeight = targetRowHeight * scale;
      rows.push({
        height: rowHeight,
        images: pending.map((p) => ({
          ...p,
          displayWidth: p.scaledWidth * scale,
          displayHeight: rowHeight,
        })),
      });
      pending = [];
      pendingWidth = 0;
    }
  }

  // Last row — never stretch; keep images at natural targetRowHeight
  if (pending.length > 0) {
    const availableWidth = containerWidth - GAP * (pending.length - 1);
    if (pendingWidth >= availableWidth) {
      // Row is full or overflowing — scale down normally
      const scale = availableWidth / pendingWidth;
      const rowHeight = targetRowHeight * scale;
      rows.push({
        height: rowHeight,
        images: pending.map((p) => ({
          ...p,
          displayWidth: p.scaledWidth * scale,
          displayHeight: rowHeight,
        })),
      });
    } else {
      // Incomplete last row — render at natural size, left-aligned
      rows.push({
        height: targetRowHeight,
        images: pending.map((p) => ({
          ...p,
          displayWidth: p.scaledWidth,
          displayHeight: targetRowHeight,
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
      className="relative overflow-hidden flex-shrink-0"
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
        className="object-cover"
        style={{
          transform: hovered ? "scale(1.03)" : "scale(1)",
          transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      />

      {/* Hover overlay */}
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

  const recompute = useCallback(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.offsetWidth;
    // Target row height: 38% of viewport height, clamped
    const targetHeight = Math.min(Math.max(window.innerHeight * 0.38, 220), 520);
    setRows(computeRows(artworks, w, targetHeight));
    setReady(true);
  }, []);

  useEffect(() => {
    recompute();
    const ro = new ResizeObserver(recompute);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [recompute]);

  return (
    <div
      ref={containerRef}
      className="w-full"
      style={{ padding: "32px 40px 40px" }}
    >
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
