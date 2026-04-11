"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Portfolio", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="relative z-10 bg-[rgba(12,12,12,0.96)]">
      <nav className="px-10 mt-5">
        {/* Row 1: Name + Nav links */}
        <div className="flex items-center gap-10 h-full">
          <Link href="/" className="no-underline shrink-0">
            <span
              className="text-xl tracking-[0.14em] uppercase font-normal text-text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Malindu Samuditha
            </span>
          </Link>

          {/* Desktop nav — same row as name */}
          <ul className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-[11px] tracking-[0.22em] uppercase font-normal no-underline transition-colors duration-300 ${
                      active ? "text-text-primary" : "text-[#3d3d3d] hover:text-text-primary"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile hamburger — pushed to end */}
          <button
            className="md:hidden flex flex-col justify-center gap-[5px] p-2 -mr-2 ml-auto"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-px w-5 bg-text-primary transition-all duration-300"
                style={{
                  transform:
                    i === 0 && menuOpen
                      ? "rotate(45deg) translate(3.5px, 3.5px)"
                      : i === 2 && menuOpen
                      ? "rotate(-45deg) translate(3.5px, -3.5px)"
                      : "none",
                  opacity: i === 1 && menuOpen ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>

        {/* Row 2: Subtitle — sits under the name */}
        <div className="pb-1.5">
          <span
            className="text-[11px] tracking-[0.22em] uppercase text-[#3d3d3d]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Illustrator | Concept Artist
          </span>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden bg-[rgba(12,12,12,0.98)] transition-[max-height] duration-400 ease-in-out ${
          menuOpen ? "max-h-[200px] border-b border-[#181818]" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col pb-6 pt-2 gap-5 px-10">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-[11px] tracking-[0.25em] uppercase no-underline ${
                  pathname === link.href ? "text-[#ede8e0]" : "text-[#3d3d3d]"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}