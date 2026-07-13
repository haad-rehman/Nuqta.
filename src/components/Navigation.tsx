"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const CAL_LINK = "https://cal.com/hadu-wfspde/intro-call-with-haad";

// Slide-up hover text — two stacked spans, container clips on overflow
function HoverLink({
  href,
  children,
  onClick,
  isButton,
  "aria-haspopup": ariaHasPopup,
}: {
  href?: string;
  children: string;
  onClick?: () => void;
  isButton?: boolean;
  "aria-haspopup"?: React.AriaAttributes["aria-haspopup"];
}) {
  const inner = (
    <span
      style={{
        display: "block",
        overflow: "hidden",
        lineHeight: "15.9px",
        height: "15.9px",
      }}
    >
      <span
        className="nav-slide-text"
        style={{ display: "block", transition: "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
      >
        {children}
      </span>
      <span
        className="nav-slide-text-dup"
        aria-hidden="true"
        style={{
          display: "block",
          transform: "translateY(100%)",
          transition: "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {children}
      </span>
    </span>
  );

  const sharedStyle: React.CSSProperties = {
    fontFamily: '"Khteka", Arial, sans-serif',
    fontSize: "15.9px",
    fontWeight: 500,
    letterSpacing: "normal",
    color: "rgb(232, 232, 227)",
    background: "none",
    border: "none",
    padding: "0.5rem 0.5rem",
    cursor: "pointer",
    display: "inline-block",
    lineHeight: 1,
  };

  const hoverClass = "nav-hover-link";

  if (isButton) {
    return (
      <button onClick={onClick} aria-haspopup={ariaHasPopup} style={sharedStyle} className={hoverClass}>
        {inner}
      </button>
    );
  }
  return (
    <a href={href} style={sharedStyle} className={hoverClass}>
      {inner}
    </a>
  );
}

function NavLogo() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: "6px",
        fontFamily: '"Khteka", Arial, sans-serif',
        fontWeight: 500,
        fontSize: "17.9px",
        letterSpacing: "normal",
        color: "rgb(250, 250, 249)",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: "6px",
          height: "6px",
          background: "rgb(250, 250, 249)",
          borderRadius: "50%",
          flexShrink: 0,
          marginBottom: "2px",
        }}
      />
      nuqta
    </span>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  const lineBase: React.CSSProperties = {
    display: "block",
    width: "22px",
    height: "1.5px",
    background: "rgb(232, 232, 227)",
    transformOrigin: "center",
    transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.2s ease",
  };
  return (
    <span
      aria-hidden="true"
      style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "center" }}
    >
      <span
        style={{
          ...lineBase,
          transform: open ? "rotate(45deg) translate(3.5px, 3.5px)" : "none",
        }}
      />
      <span
        style={{
          ...lineBase,
          opacity: open ? 0 : 1,
        }}
      />
      <span
        style={{
          ...lineBase,
          transform: open ? "rotate(-45deg) translate(3.5px, -3.5px)" : "none",
        }}
      />
    </span>
  );
}

export function Navigation() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeAboutRef = useRef<HTMLButtonElement>(null);
  const closeMobileRef = useRef<HTMLButtonElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const aboutTriggerRef = useRef<HTMLButtonElement>(null);

  // Focus close button when modals open
  useEffect(() => {
    if (aboutOpen) {
      setTimeout(() => closeAboutRef.current?.focus(), 50);
    }
  }, [aboutOpen]);

  useEffect(() => {
    if (mobileOpen) {
      setTimeout(() => closeMobileRef.current?.focus(), 50);
    } else {
      hamburgerRef.current?.focus();
    }
  }, [mobileOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAboutOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Focus trap for about modal
  const trapFocus = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const focusable = e.currentTarget.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }, []);

  const navLinks = [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
  ];

  const mobileNavLinks = [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
  ];

  return (
    <>
      <style>{`
        .nav-hover-link:hover .nav-slide-text {
          transform: translateY(-100%);
        }
        .nav-hover-link:hover .nav-slide-text-dup {
          transform: translateY(0%);
        }
        @keyframes mobile-menu-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-menu-enter {
          animation: mobile-menu-in 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "transparent",
        }}
        aria-label="Main navigation"
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            padding: "27.2px 27.2px",
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ justifySelf: "start", textDecoration: "none" }}>
            <NavLogo />
          </Link>

          {/* Center links — desktop only */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: "0" }}>
            <HoverLink
              isButton
              aria-haspopup="dialog"
              onClick={() => {
                setAboutOpen(true);
              }}
            >
              About
            </HoverLink>
            {navLinks.map((l) => (
              <HoverLink key={l.label} href={l.href}>{l.label}</HoverLink>
            ))}
          </div>

          {/* Right side */}
          <div style={{ justifySelf: "end" }} className="flex items-center gap-3">
            {/* Desktop CTA */}
            <a
              href={CAL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex"
              style={{
                fontFamily: '"Khteka", Arial, sans-serif',
                fontSize: "15.9px",
                fontWeight: 500,
                letterSpacing: "normal",
                color: "rgb(8, 8, 7)",
                background: "rgb(232, 232, 227)",
                padding: "4.5px 4.5px 4.5px 8px",
                borderRadius: "2.4px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Start a project&nbsp;↗
            </a>

            {/* Hamburger — mobile only */}
            <button
              ref={hamburgerRef}
              className="flex md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-menu"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0",
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile full-screen menu ── */}
      {mobileOpen && (
        <div
          id="mobile-nav-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          onKeyDown={trapFocus}
          className="mobile-menu-enter"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 150,
            background: "#0a0a0a",
            display: "flex",
            flexDirection: "column",
            padding: "0 24px 40px",
          }}
        >
          {/* Top bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "80px",
              borderBottom: "1px solid #1a1a1a",
              marginBottom: "48px",
            }}
          >
            <Link
              href="/"
              style={{ textDecoration: "none" }}
              onClick={() => setMobileOpen(false)}
            >
              <NavLogo />
            </Link>
            <button
              ref={closeMobileRef}
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgb(232, 232, 227)",
                fontFamily: '"Suisse Mono", monospace',
                fontSize: "11px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 0",
                width: "44px",
                height: "44px",
                justifyContent: "flex-end",
              }}
            >
              ✕
            </button>
          </div>

          {/* Nav links */}
          <nav style={{ flex: 1 }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ borderBottom: "1px solid #1a1a1a" }}>
                <button
                  ref={aboutTriggerRef}
                  onClick={() => {
                    setMobileOpen(false);
                    setAboutOpen(true);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px 0",
                    fontFamily: '"Khteka", Arial, sans-serif',
                    fontSize: "clamp(2rem, 10vw, 3rem)",
                    fontWeight: 500,
                    color: "rgb(245, 240, 235)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  About
                  <span style={{ fontSize: "1.2rem", opacity: 0.4 }}>↗</span>
                </button>
              </li>
              {mobileNavLinks.map((l) => (
                <li key={l.label} style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <a
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "20px 0",
                      fontFamily: '"Khteka", Arial, sans-serif',
                      fontSize: "clamp(2rem, 10vw, 3rem)",
                      fontWeight: 500,
                      color: "rgb(245, 240, 235)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                      textDecoration: "none",
                    }}
                  >
                    {l.label}
                    <span style={{ fontSize: "1.2rem", opacity: 0.4 }}>↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile CTA */}
          <div style={{ paddingTop: "32px" }}>
            <a
              href={CAL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontFamily: '"Khteka", Arial, sans-serif',
                fontSize: "15px",
                fontWeight: 500,
                color: "rgb(8, 8, 7)",
                background: "rgb(232, 232, 227)",
                padding: "12px 16px",
                borderRadius: "2.4px",
                textDecoration: "none",
              }}
            >
              Start a project&nbsp;↗
            </a>
          </div>
        </div>
      )}

      {/* ── About modal ── */}
      {aboutOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-modal-title"
          onKeyDown={trapFocus}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(10,10,10,0.97)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setAboutOpen(false); }}
        >
          <div style={{ maxWidth: "672px", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px" }}>
              <span
                id="about-modal-title"
                style={{
                  color: "#888880",
                  fontSize: "10px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontFamily: '"Suisse Mono", monospace',
                }}
              >
                About the studio
              </span>
              <button
                ref={closeAboutRef}
                onClick={() => setAboutOpen(false)}
                style={{
                  color: "#888880",
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: '"Suisse Mono", monospace',
                  minWidth: "44px",
                  minHeight: "44px",
                  justifyContent: "flex-end",
                }}
              >
                Close <kbd style={{ border: "1px solid #2a2a2a", color: "#888880", padding: "2px 6px", fontSize: "9px" }}>esc</kbd>
              </button>
            </div>
            <h2 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 300, color: "#f5f0eb", lineHeight: 1.1, marginBottom: "32px", fontFamily: '"Khteka"' }}>
              About the studio
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", color: "#888880", fontSize: "14px", lineHeight: 1.7, fontFamily: '"Khteka"' }}>
              <p>Nuqta was founded after watching exceptional founders stay invisible because their presence never caught up to who they&apos;d become.</p>
              <p>We&apos;re a brand and web design studio built for established, founder-led B2B brands whose digital presence hasn&apos;t matched their real-world impact — yet.</p>
              <p>Our thinking has reached over <span style={{ color: "#f5f0eb" }}>1,000 creatives</span>.</p>
            </div>
            <div style={{ marginTop: "40px", display: "flex", gap: "32px", fontSize: "10px", color: "#888880", letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: '"Suisse Mono", monospace' }}>
              <span>EST 2024</span><span>Doha, Qatar</span>
            </div>
            <div style={{ marginTop: "32px", display: "flex", flexWrap: "wrap", gap: "24px 32px", alignItems: "center" }}>
              <Link
                href="/about"
                onClick={() => setAboutOpen(false)}
                style={{
                  color: "#f5f0eb",
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  borderBottom: "1px solid rgba(245,240,235,0.3)",
                  paddingBottom: "2px",
                  textDecoration: "none",
                  fontFamily: '"Khteka"',
                }}
              >
                Read Haad&apos;s full profile →
              </Link>
              <a
                href={CAL_LINK}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#888880",
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  borderBottom: "1px solid rgba(136,136,128,0.3)",
                  paddingBottom: "2px",
                  textDecoration: "none",
                  fontFamily: '"Khteka"',
                }}
              >
                Book a call with Haad →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
