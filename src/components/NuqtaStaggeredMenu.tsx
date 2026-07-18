"use client";

import { StaggeredMenu } from "@/components/StaggeredMenu";

const CAL_LINK = "https://cal.com/hadu-wfspde/intro-call-with-haad";

const items = [
  { label: "Home", ariaLabel: "Go to home page", link: "/" },
  { label: "About", ariaLabel: "About the studio", link: "/about" },
  { label: "Work", ariaLabel: "View our work", link: "/#work" },
  { label: "Services", ariaLabel: "View our services", link: "/#services" },
  { label: "Process", ariaLabel: "Our process", link: "/#process" },
];

const socialItems = [
  { label: "Instagram", link: "https://www.instagram.com/studionuqtaa/" },
  { label: "Book a call", link: CAL_LINK },
];

/**
 * StaggeredMenu themed for nuqta: off-white panel, charcoal type, warm-gray
 * accent (brand is charcoal + off-white — no default red/purple). The style
 * block out-specifies the component's `.sm-scope` styles via the extra
 * `.nuqta-sm` ancestor, so StaggeredMenu.tsx stays an untouched registry
 * copy and can be re-pulled safely.
 *
 * The wrapper uses display:contents so it generates no box of its own (the
 * menu's root is already position:fixed via isFixed) while still acting as
 * the CSS scope ancestor. The fixed root gets pointer-events:none so the
 * page stays clickable; the header controls and panel re-enable their own
 * pointer events internally.
 */
export function NuqtaStaggeredMenu() {
  return (
    <div className="nuqta-sm contents">
      <StaggeredMenu
        position="right"
        isFixed
        items={items}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering
        logoUrl="/icon-192.png"
        colors={["#2b2b28", "#454540"]}
        accentColor="#8a8a80"
        menuButtonColor="#e8e8e3"
        openMenuButtonColor="#e8e8e3"
        changeMenuColorOnOpen
      />
      <style>{`
        .nuqta-sm .sm-scope {
          pointer-events: none;
        }
        .nuqta-sm .sm-scope .staggered-menu-panel {
          background: #080807;
        }
        .nuqta-sm .sm-scope .sm-panel-item {
          color: #4d4d47;
          font-family: "Khteka", Arial, sans-serif;
        }
        .nuqta-sm .sm-scope .sm-panel-item:hover {
          color: #e8e8e3;
        }
        .nuqta-sm .sm-scope .sm-socials-link {
          color: #4d4d47;
          font-family: "Khteka", Arial, sans-serif;
        }
        .nuqta-sm .sm-scope .sm-socials-link:hover {
          color: #e8e8e3;
        }
        .nuqta-sm .sm-scope .sm-socials-title {
          font-family: "Suisse Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .nuqta-sm .sm-scope .sm-toggle {
          font-family: "Khteka", Arial, sans-serif;
        }
        /* Dark panel now — don't invert the logo when the menu is open on mobile */
        .nuqta-sm .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-img {
          filter: none;
        }
      `}</style>
    </div>
  );
}
