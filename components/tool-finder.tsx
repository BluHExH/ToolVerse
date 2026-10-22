"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { CornerDownLeft, Search, X } from "lucide-react";
import { getCategory } from "@/lib/categories";
import { searchTools } from "@/lib/search";
import { tools } from "@/lib/tools";
import { ToolIcon } from "./icons";

interface ToolFinderProps {
  placeholder?: string;
  label?: string;
  variant?: "popover" | "inline";
  autoFocus?: boolean;
  onNavigate?: () => void;
  initialQuery?: string;
  limit?: number;
  idPrefix?: string;
}

export function ToolFinder({
  placeholder = "Search tools…",
  label = "Find a tool",
  variant = "popover",
  autoFocus = false,
  onNavigate,
  initialQuery = "",
  limit = 7,
  idPrefix,
}: ToolFinderProps) {
  const router = useRouter();
  const generatedId = useId();
  const baseId = idPrefix ?? generatedId.replace(/:/g, "");
  const listboxId = `${baseId}-listbox`;
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(variant === "inline" ? false : initialQuery.length > 0);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (query.trim()) {
      return searchTools(query, tools).slice(0, limit);
    }
    return variant === "inline" ? tools.slice(0, limit) : [];
  }, [query, limit, variant]);
  const isVisible = variant === "inline" ? true : open && query.trim().length > 0;
  const activeResult = results[activeIndex];

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isVisible) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isVisible]);

  const openResult = useCallback(
    (href: string) => {
      setOpen(false);
      onNavigate?.();
      router.push(href);
    },
    [onNavigate, router],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => (results.length ? (current + 1) % results.length : 0));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (results.length ? (current - 1 + results.length) % results.length : 0));
      return;
    }
    if (event.key === "Enter" && activeResult) {
      event.preventDefault();
      openResult(activeResult.href);
      return;
    }
    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const showEmpty = isVisible && results.length === 0;

  return (
    <div className={`finder ${variant === "inline" ? "finder--inline" : ""}`} ref={containerRef}>
      {label ? (
        <label className="finder__label" htmlFor={`${baseId}-input`}>
          {label}
        </label>
      ) : null}
      <div className="finder__control">
        <Search size={18} aria-hidden="true" className="finder__icon" />
        <input
          ref={inputRef}
          id={`${baseId}-input`}
          className="finder__input"
          type="text"
          role="combobox"
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          value={query}
          autoFocus={autoFocus}
          aria-expanded={isVisible}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={isVisible && activeResult ? `${baseId}-option-${activeIndex}` : undefined}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query ? (
          <button
            type="button"
            className="icon-btn finder__clear"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setOpen(false);
              inputRef.current?.focus();
            }}
          >
            <X size={16} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <span className="sr-only" role="status" aria-live="polite">
        {isVisible ? `${results.length} tool${results.length === 1 ? "" : "s"} found` : ""}
      </span>

      {isVisible ? (
        <ul className="finder__results" id={listboxId} role="listbox" aria-label="Matching tools">
          {results.map((tool, index) => {
            const category = getCategory(tool.category);
            return (
              <li key={tool.slug} role="option" aria-selected={index === activeIndex} id={`${baseId}-option-${index}`}>
                <Link
                  href={tool.href}
                  className="finder__item"
                  data-active={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                >
                  <span className="finder__item-icon">
                    <ToolIcon name={tool.icon} size={17} />
                  </span>
                  <span>
                    <span className="finder__item-name">{tool.name}</span>
                    <span className="finder__item-summary">
                      {category?.name} · {tool.summary}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
          {showEmpty ? (
            <li className="finder__empty">
              No tools match “{query.trim()}”. Try “pdf”, “image”, “json”, or “qr”.
            </li>
          ) : null}
          {!showEmpty ? (
            <li className="finder__hint" aria-hidden="true">
              <CornerDownLeft size={12} style={{ display: "inline", verticalAlign: "-2px" }} /> to open · ↑↓ to
              browse · Esc to close
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
