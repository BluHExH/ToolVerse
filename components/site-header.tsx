"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { categories } from "@/lib/categories";
import { BrandLockup } from "./brand-mark";
import { CategoryIcon } from "./icons";
import { ToolFinder } from "./tool-finder";

const navItems = [
  { href: "/tools", label: "Tools" },
  { href: "/categories", label: "Categories" },
  { href: "/blog", label: "Guides" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const paletteRef = useRef<HTMLDialogElement>(null);
  const menuRef = useRef<HTMLDialogElement>(null);
  const paletteTriggerRef = useRef<HTMLButtonElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  const isActive = useCallback(
    (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)),
    [pathname],
  );

  const openPalette = useCallback(() => {
    setMenuOpen(false);
    menuRef.current?.close();
    setPaletteOpen(true);
    paletteRef.current?.showModal();
  }, []);

  const closePalette = useCallback(() => {
    paletteRef.current?.close();
    setPaletteOpen(false);
    paletteTriggerRef.current?.focus();
  }, []);

  const openMenu = useCallback(() => {
    setMenuOpen(true);
    menuRef.current?.showModal();
  }, []);

  const closeMenu = useCallback(() => {
    menuRef.current?.close();
    setMenuOpen(false);
    menuTriggerRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (paletteRef.current?.open) {
          closePalette();
        } else {
          openPalette();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closePalette, openPalette]);

  useEffect(() => {
    closePalette();
    closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <BrandLockup />

        <nav className="nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav__link"
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="search-trigger"
            ref={paletteTriggerRef}
            onClick={openPalette}
            aria-haspopup="dialog"
            aria-expanded={paletteOpen}
          >
            <Search size={16} aria-hidden="true" />
            <span className="search-trigger__label">Search tools</span>
            <kbd>Ctrl K</kbd>
          </button>
          <Link href="/tools" className="btn btn--primary btn--sm">
            Browse tools
          </Link>
          <button
            type="button"
            className="icon-btn mobile-toggle"
            ref={menuTriggerRef}
            onClick={openMenu}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-label="Open menu"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      <dialog
        ref={paletteRef}
        className="dialog command-dialog"
        aria-label="Search tools"
        onClose={() => {
          setPaletteOpen(false);
          paletteTriggerRef.current?.focus();
        }}
      >
        <div className="command-dialog__head">
          <Search size={18} aria-hidden="true" className="muted" />
          <ToolFinder
            variant="inline"
            label=""
            idPrefix="command"
            placeholder="Search by name, task, or keyword…"
            autoFocus
            onNavigate={closePalette}
            limit={8}
          />
          <button type="button" className="icon-btn" onClick={closePalette} aria-label="Close search">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="command-dialog__foot" aria-hidden="true">
          <span>↑↓ browse</span>
          <span>Enter open</span>
          <span>Esc close</span>
        </div>
      </dialog>

      <dialog
        ref={menuRef}
        className="dialog mobile-menu"
        aria-label="Site menu"
        onClose={() => {
          setMenuOpen(false);
          menuTriggerRef.current?.focus();
        }}
      >
        <div className="mobile-menu__inner">
          <div className="mobile-menu__top">
            <BrandLockup onNavigate={closeMenu} />
            <button type="button" className="icon-btn" onClick={closeMenu} aria-label="Close menu">
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <ul className="mobile-menu__list">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={closeMenu} aria-current={isActive(item.href) ? "page" : undefined}>
                  {item.label}
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mobile-menu__section">
            <h2>Categories</h2>
            <div className="mobile-menu__chips">
              {categories.map((category) => (
                <Link key={category.slug} href={`/categories/${category.slug}`} onClick={closeMenu}>
                  <CategoryIcon slug={category.slug} size={15} /> {category.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="mobile-menu__section">
            <h2>More</h2>
            <div className="mobile-menu__chips">
              <Link href="/about" onClick={closeMenu}>
                About
              </Link>
              <Link href="/contact" onClick={closeMenu}>
                Contact
              </Link>
              <Link href="/privacy" onClick={closeMenu}>
                Privacy
              </Link>
              <Link href="/terms" onClick={closeMenu}>
                Terms
              </Link>
            </div>
          </div>
          <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
            <button type="button" className="btn btn--secondary btn--block" onClick={openPalette}>
              <Search size={16} aria-hidden="true" /> Search all tools
            </button>
          </div>
        </div>
      </dialog>
    </header>
  );
}
