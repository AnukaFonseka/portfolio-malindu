import type { Metadata } from "next";
import ContactLinks from "@/components/ContactLinks";

export const metadata: Metadata = {
  title: "Contact — Malindu",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-28 pb-24 px-8 md:px-16 max-w-[1200px] mx-auto">
      {/* Page label */}
      <p
        className="text-[10px] tracking-[0.4em] uppercase mb-16"
        style={{ color: "#3a3a3a", fontFamily: "var(--font-body)" }}
      >
        Contact
      </p>

      {/* Heading */}
      <h1
        className="text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] mb-20 max-w-2xl"
        style={{
          fontFamily: "var(--font-display)",
          color: "#ede8e0",
          letterSpacing: "0.02em",
        }}
      >
        Let&apos;s build something{" "}
        <em className="italic font-normal" style={{ color: "#c8a97e" }}>
          extraordinary.
        </em>
      </h1>

      <ContactLinks />

      {/* Footer note */}
      <p
        className="mt-16 text-[10px] tracking-[0.25em] uppercase"
        style={{ color: "#252525", fontFamily: "var(--font-body)" }}
      >
        © {new Date().getFullYear()} Malindu. All rights reserved.
      </p>
    </main>
  );
}
