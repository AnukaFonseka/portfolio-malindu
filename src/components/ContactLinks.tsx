"use client";

const contactLinks = [
  {
    label: "ArtStation",
    description: "View full portfolio",
    href: "https://artstation.com",
  },
  {
    label: "Instagram",
    description: "Work in progress & studies",
    href: "https://instagram.com",
  },
  {
    label: "Email",
    description: "hello@malindu.art",
    href: "mailto:hello@malindu.art",
  },
];

export default function ContactLinks() {
  return (
    <ul style={{ borderTop: "1px solid #1a1a1a" }}>
      {contactLinks.map((link, i) => (
        <li key={i} style={{ borderBottom: "1px solid #1a1a1a" }}>
          <a
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={
              link.href.startsWith("http") ? "noopener noreferrer" : undefined
            }
            className="flex items-center justify-between py-7 md:py-8 group"
            style={{ textDecoration: "none" }}
          >
            <div className="flex flex-col gap-1">
              <span
                className="text-2xl md:text-4xl font-normal transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "#1e1e1e",
                  letterSpacing: "0.03em",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#ede8e0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#1e1e1e")
                }
              >
                {link.label}
              </span>
              <span
                className="text-[10px] tracking-[0.25em] uppercase"
                style={{
                  color: "#333333",
                  fontFamily: "var(--font-body)",
                }}
              >
                {link.description}
              </span>
            </div>

            <svg
              className="w-5 h-5 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              style={{ color: "#252525" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 17L17 7M17 7H7M17 7v10"
              />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
