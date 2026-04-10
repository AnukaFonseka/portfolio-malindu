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
    <header
      className="relative z-10"
      style={{
        backgroundColor: "rgba(12,12,12,0.96)",
        borderBottom: "1px solid #181818",
      }}
    >
      <nav className="flex items-center justify-between h-16 md:h-17" style={{ paddingLeft: 40, paddingRight: 40 }}>
        {/* Name — Brandon Grotesque */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <span
            className="text-xl tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-display)",
              color: "#ede8e0",
              letterSpacing: "0.14em",
              fontWeight: 400,
            }}
          >
            Malindu
          </span>
        </Link>

        {/* Desktop nav — Europa */}
        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[11px] tracking-[0.22em] uppercase transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: active ? "#ede8e0" : "#3d3d3d",
                    textDecoration: "none",
                    fontWeight: 400,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#ede8e0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = active ? "#ede8e0" : "#3d3d3d")
                  }
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.25 p-2 -mr-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-px w-5"
              style={{
                backgroundColor: "#ede8e0",
                transition: "all 0.3s ease",
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
      </nav>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden"
        style={{
          maxHeight: menuOpen ? "200px" : "0",
          backgroundColor: "rgba(12,12,12,0.98)",
          transition: "max-height 0.4s ease",
          borderBottom: menuOpen ? "1px solid #181818" : "none",
        }}
      >
        <ul className="flex flex-col pb-6 pt-2 gap-5" style={{ paddingLeft: 40, paddingRight: 40 }}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-[11px] tracking-[0.25em] uppercase"
                style={{
                  fontFamily: "var(--font-body)",
                  color: pathname === link.href ? "#ede8e0" : "#3d3d3d",
                  textDecoration: "none",
                }}
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
