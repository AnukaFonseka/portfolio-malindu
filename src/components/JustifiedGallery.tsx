"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

type ImageItem = {
  type: "image";
  id: number;
  src: string;
  title: string;
  category: string;
  year: string;
};

type VideoItem = {
  type: "video";
  id: number;
  src: string;
  title: string;
};

type GalleryItem = ImageItem | VideoItem;

const galleryItems: GalleryItem[] = [
  { type: "image", id: 6,  src: "/Brawler.png",       title: "Brawler",       category: "Character Concept",   year: "2025" },
  { type: "image", id: 7,  src: "/slasher.png",        title: "Slasher",       category: "Character Concept",   year: "2025" },
  { type: "image", id: 8,  src: "/ODA base 1.jpeg",    title: "ODA Base I",    category: "Character Concept",   year: "2025" },
  { type: "image", id: 9,  src: "/ODA base 2.jpg",     title: "ODA Base II",   category: "Character Concept",   year: "2025" },
  { type: "image", id: 10, src: "/ODA base 3.jpg",     title: "ODA Base III",  category: "Character Concept",   year: "2025" },
  { type: "video", id: 100, src: "/videos/0001-0108 (2).mkv", title: "Motion Reel" },
  { type: "image", id: 11, src: "/berserker 1.jpg",    title: "Berserker I",   category: "Character Concept",   year: "2025" },
  { type: "image", id: 12, src: "/berserker 2.png",    title: "Berserker II",  category: "Character Concept",   year: "2025" },
  { type: "image", id: 13, src: "/weapon.png",         title: "Weapon",        category: "Prop Design",         year: "2025" },
  { type: "image", id: 14, src: "/sentry.jpg",         title: "Sentry",        category: "Character Concept",   year: "2025" },
  // { type: "image", id: 1,  src: "/1.jpeg",             title: "Vessel",        category: "Environment Design",  year: "2024" },
  { type: "image", id: 2,  src: "/4.jpeg",             title: "Iron Journey",  category: "Vehicle Concept",     year: "2024" },
  { type: "image", id: 3,  src: "/5.jpeg",             title: "The Awakening", category: "Environment Design",  year: "2025" },
  { type: "image", id: 4,  src: "/6.jpeg",             title: "Ember Realm",   category: "Environment Design",  year: "2025" },
  { type: "image", id: 5,  src: "/7.jpeg",             title: "Sovereign",     category: "Character Concept",   year: "2025" },
];

interface ImageItemWithRatio extends ImageItem {
  ratio: number;
}

interface RowImage extends ImageItemWithRatio {
  displayWidth: number;
  displayHeight: number;
}

type ImageRow = { type: "image"; images: RowImage[]; height: number };
type VideoRow = { type: "video"; id: number; src: string; title: string };
type GalleryRow = ImageRow | VideoRow;

const GAP = 10;
const MAX_ROW_HEIGHT = 520;
const VIDEO_STRIPE_HEIGHT = 210;

async function loadRatio(src: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(img.naturalWidth / img.naturalHeight);
    img.onerror = () => resolve(4 / 3);
    img.src = src;
  });
}

function flushImagePending(
  pending: (ImageItemWithRatio & { scaledWidth: number })[],
  pendingWidth: number,
  containerWidth: number,
  targetRowHeight: number,
  rows: GalleryRow[],
  forceStretch = false
) {
  if (pending.length === 0) return;
  const availableWidth = containerWidth - GAP * (pending.length - 1);
  if (forceStretch || pendingWidth >= availableWidth) {
    const scale = availableWidth / pendingWidth;
    const rowHeight = Math.min(targetRowHeight * scale, MAX_ROW_HEIGHT);
    const finalScale = rowHeight / targetRowHeight;
    rows.push({
      type: "image",
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
      type: "image",
      height: rowHeight,
      images: pending.map((p) => ({
        ...p,
        displayWidth: p.ratio * rowHeight,
        displayHeight: rowHeight,
      })),
    });
  }
}

function computeRows(
  items: (ImageItemWithRatio | VideoItem)[],
  containerWidth: number,
  targetRowHeight: number
): GalleryRow[] {
  const rows: GalleryRow[] = [];
  let pending: (ImageItemWithRatio & { scaledWidth: number })[] = [];
  let pendingWidth = 0;

  for (const item of items) {
    if (item.type === "video") {
      flushImagePending(pending, pendingWidth, containerWidth, targetRowHeight, rows, true);
      pending = [];
      pendingWidth = 0;
      rows.push({ type: "video", id: item.id, src: item.src, title: item.title });
      continue;
    }

    const scaledWidth = targetRowHeight * item.ratio;
    pending.push({ ...item, scaledWidth });
    pendingWidth += scaledWidth;

    const availableWidth = containerWidth - GAP * (pending.length - 1);
    if (pendingWidth >= availableWidth) {
      const scale = availableWidth / pendingWidth;
      const rowHeight = Math.min(targetRowHeight * scale, MAX_ROW_HEIGHT);
      const finalScale = rowHeight / targetRowHeight;
      rows.push({
        type: "image",
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

  flushImagePending(pending, pendingWidth, containerWidth, targetRowHeight, rows);
  return rows;
}

function GalleryImage({ img }: { img: RowImage }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden shrink-0 rounded-xl"
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

function VideoStripe({ row }: { row: VideoRow }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let targetTime = 0;
    let rafId = 0;

    const getTargetTime = () => {
      if (!video.duration) return 0;
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      return progress * video.duration;
    };

    const tick = () => {
      const diff = targetTime - video.currentTime;
      // lerp: fast catch-up for large gaps, smooth easing for small ones
      if (Math.abs(diff) > 0.001) {
        video.currentTime += diff * 0.14;
      }
      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => { targetTime = getTargetTime(); };
    const onMetadata = () => { targetTime = getTargetTime(); };

    window.addEventListener("scroll", onScroll, { passive: true });
    video.addEventListener("loadedmetadata", onMetadata);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      video.removeEventListener("loadedmetadata", onMetadata);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl"
      style={{ height: VIDEO_STRIPE_HEIGHT }}
    >
      <video
        ref={videoRef}
        src={row.src}
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 flex items-end p-5"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,10,0.65) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      >
        <p
          className="text-[9px] tracking-[0.3em] uppercase"
          style={{ color: "#c8a97e", fontFamily: "var(--font-body)" }}
        >
          {row.title}
        </p>
      </div>
    </div>
  );
}

export default function JustifiedGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<GalleryRow[]>([]);
  const [ready, setReady] = useState(false);
  const ratiosRef = useRef<(ImageItemWithRatio | VideoItem)[] | null>(null);

  const recompute = useCallback((items: (ImageItemWithRatio | VideoItem)[]) => {
    if (!containerRef.current) return;
    const w = containerRef.current.offsetWidth;
    const targetHeight = Math.min(Math.max(window.innerHeight * 0.38, 220), MAX_ROW_HEIGHT);
    setRows(computeRows(items, w, targetHeight));
    setReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      galleryItems.map(async (item) => {
        if (item.type === "video") return item;
        return { ...item, ratio: await loadRatio(item.src) };
      })
    ).then((withRatios) => {
      if (cancelled) return;
      ratiosRef.current = withRatios as (ImageItemWithRatio | VideoItem)[];
      recompute(ratiosRef.current);
    });
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
        rows.map((row, ri) => {
          const mb = ri < rows.length - 1 ? GAP : 0;
          if (row.type === "video") {
            return (
              <div key={`v-${row.id}`} style={{ marginBottom: mb }}>
                <VideoStripe row={row} />
              </div>
            );
          }
          return (
            <div
              key={ri}
              className="flex overflow-hidden rounded-xl"
              style={{ height: row.height, gap: GAP, marginBottom: mb }}
            >
              {row.images.map((img) => (
                <GalleryImage key={img.id} img={img} />
              ))}
            </div>
          );
        })}
    </div>
  );
}
