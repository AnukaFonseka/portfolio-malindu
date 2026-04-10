import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Malindu",
};

const skills = [
  "Environment Design",
  "Vehicle Concept",
  "Character Concept",
  "World Building",
  "Digital Painting",
  "Photoshop",
  "Procreate",
  "Blender",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-28 pb-24 px-8 md:px-16 max-w-[1200px] mx-auto">
      {/* Page label */}
      <p
        className="text-[10px] tracking-[0.4em] uppercase mb-16"
        style={{ color: "#3a3a3a", fontFamily: "var(--font-body)" }}
      >
        About
      </p>

      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
        {/* Left: heading */}
        <div className="md:col-span-5">
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] mb-10"
            style={{
              fontFamily: "var(--font-display)",
              color: "#ede8e0",
              letterSpacing: "0.02em",
            }}
          >
            Crafting worlds
            <br />
            <em
              className="italic font-normal"
              style={{ color: "#c8a97e" }}
            >
              worth exploring.
            </em>
          </h1>

          {/* Divider */}
          <div
            className="w-12 h-px mb-10"
            style={{ backgroundColor: "#c8a97e", opacity: 0.5 }}
          />

          {/* Skills */}
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="text-[10px] tracking-[0.25em] uppercase"
                style={{ color: "#333333", fontFamily: "var(--font-body)" }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Right: bio text */}
        <div className="md:col-span-7 flex flex-col gap-6">
          <p
            className="text-sm leading-[1.95] font-light"
            style={{ color: "#555555", fontFamily: "var(--font-body)" }}
          >
            I&apos;m a concept artist focused on environment and vehicle
            design, creating visual narratives for games, film, and personal
            projects. My work explores the tension between the organic and the
            mechanical — worlds that feel heavy with history yet charged with
            possibility.
          </p>
          <p
            className="text-sm leading-[1.95] font-light"
            style={{ color: "#555555", fontFamily: "var(--font-body)" }}
          >
            With a background in traditional painting and digital
            illustration, I approach every piece by asking what story the
            environment itself tells — the wear on the metal, the quality of
            light, the sense of scale that makes the viewer feel small and
            awed in equal measure.
          </p>
          <p
            className="text-sm leading-[1.95] font-light"
            style={{ color: "#555555", fontFamily: "var(--font-body)" }}
          >
            Currently available for freelance projects and concept art
            commissions. I work closely with clients to develop visual
            languages that are both cohesive and unexpected.
          </p>

          {/* CTA */}
          <div
            className="pt-8 mt-4"
            style={{ borderTop: "1px solid #1a1a1a" }}
          >
            <a
              href="/contact"
              className="inline-flex items-center gap-3 group"
              style={{ textDecoration: "none" }}
            >
              <span
                className="text-xs tracking-[0.3em] uppercase"
                style={{
                  color: "#c8a97e",
                  fontFamily: "var(--font-body)",
                  transition: "color 0.3s",
                }}
              >
                Get in touch
              </span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c8a97e"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
