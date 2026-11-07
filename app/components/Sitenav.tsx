"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LANGS } from "../lib/dictionary";
import { useLang } from "../lib/i18n";

const linkIds = ["about", "skills", "projects", "experience"] as const;

const observed = ["home", ...linkIds, "contact"];

export default function SiteNav() {
  const navRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState("");
  const { lang, setLang, t } = useLang();

  // Scroll progress + "scrolled" state. Written straight to the DOM so the
  // page does not re-render on every scroll event.
  useEffect(() => {
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const nav = navRef.current;
        if (!nav) return;
        const max =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        nav.style.setProperty("--progress", String(progress));
        nav.dataset.scrolled = String(window.scrollY > 24);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Highlight the link of the section currently in the middle of the screen.
  useEffect(() => {
    const sections = observed
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="nav" ref={navRef} data-scrolled="false">
      <div className="container nav-inner">
        <Link href="/" className="brand">
          {t.nav.brand}
        </Link>

        <div className="nav-links">
          {linkIds.map((id) => (
            <Link
              key={id}
              href={`/#${id}`}
              className="nav-link"
              aria-current={active === id ? "true" : undefined}
            >
              {t.nav[id]}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <div className="lang-switch" role="group" aria-label={t.nav.language}>
            {LANGS.map((code) => (
              <button
                key={code}
                type="button"
                className="lang-option"
                lang={code}
                aria-pressed={lang === code}
                onClick={() => setLang(code)}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>

          <Link href="/#contact" className="button button-small">
            {t.nav.contact} <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>

      <div className="progress" aria-hidden="true" />
    </nav>
  );
}