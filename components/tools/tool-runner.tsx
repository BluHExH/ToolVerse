"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { ToolSlug } from "@/lib/tools";
import { ToolLoading } from "./workspace";

const loaders: Record<ToolSlug, ComponentType> = {
  "pdf-merger": dynamic(() => import("./pdf-merger"), { loading: () => <ToolLoading /> }),
  "pdf-splitter": dynamic(() => import("./pdf-splitter"), { loading: () => <ToolLoading /> }),
  "image-compressor": dynamic(() => import("./image-compressor"), { loading: () => <ToolLoading /> }),
  "image-resizer": dynamic(() => import("./image-resizer"), { loading: () => <ToolLoading /> }),
  "jpg-to-png": dynamic(() => import("./jpg-to-png"), { loading: () => <ToolLoading /> }),
  "json-formatter": dynamic(() => import("./json-formatter"), { loading: () => <ToolLoading /> }),
  "json-validator": dynamic(() => import("./json-validator"), { loading: () => <ToolLoading /> }),
  "base64-encoder": dynamic(() => import("./base64-encoder"), { loading: () => <ToolLoading /> }),
  "qr-code-generator": dynamic(() => import("./qr-code-generator"), { loading: () => <ToolLoading /> }),
  "word-counter": dynamic(() => import("./word-counter"), { loading: () => <ToolLoading /> }),
  "case-converter": dynamic(() => import("./case-converter"), { loading: () => <ToolLoading /> }),
  "uuid-password-generator": dynamic(() => import("./uuid-password-generator"), { loading: () => <ToolLoading /> }),
  "color-converter": dynamic(() => import("./color-converter"), { loading: () => <ToolLoading /> }),
  "markdown-preview": dynamic(() => import("./markdown-preview"), { loading: () => <ToolLoading /> }),
  "csv-json-converter": dynamic(() => import("./csv-json-converter"), { loading: () => <ToolLoading /> }),
};

export function ToolRunner({ slug }: { slug: ToolSlug }) {
  const Tool = loaders[slug];
  if (!Tool) {
    return null;
  }
  return <Tool />;
}
