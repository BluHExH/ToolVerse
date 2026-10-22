"use client";

import { useMemo, useState } from "react";
import { Eraser, FileText, Type } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { WORDS_PER_MINUTE, getTextStats } from "@/lib/text-stats";
import { CopyButton } from "./copy-button";
import { JsonTextArea } from "./json-fields";
import { ResultBar, StepBlock, Workspace } from "./workspace";

const SAMPLE =
  "ToolVerse keeps everyday work simple. Paste a paragraph, and the counts update as you type. Words, characters, sentences, and paragraphs are all counted locally.";

export default function WordCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => getTextStats(text), [text]);

  return (
    <Workspace
      title="Count words and characters"
      icon={<Type size={16} aria-hidden="true" />}
      actions={
        <>
          <button type="button" className="btn btn--quiet btn--sm" onClick={() => setText(SAMPLE)}>
            <FileText size={15} aria-hidden="true" /> Load sample
          </button>
          <button type="button" className="btn btn--quiet btn--sm" onClick={() => setText("")} disabled={!text}>
            <Eraser size={15} aria-hidden="true" /> Clear
          </button>
        </>
      }
      footer={
        <>
          <span className="workspace__footer-note">
            Reading time assumes {WORDS_PER_MINUTE} words per minute.
          </span>
          <span className="workspace__footer-note" role="status" aria-live="polite">
            {formatNumber(stats.words)} words · {formatNumber(stats.characters)} characters
          </span>
        </>
      }
    >
      <StepBlock step="Step 01" title="Type or paste text">
        <JsonTextArea
          label="Your text"
          hint="Counts update as you type"
          value={text}
          onChange={setText}
          placeholder="Start typing, or paste text here…"
          rows={12}
        />
      </StepBlock>

      <StepBlock step="Step 02" title="Live counts">
        <div className="stat-grid">
          <ResultBar label="Words" value={formatNumber(stats.words)} />
          <ResultBar label="Characters" value={formatNumber(stats.characters)} hint="With spaces" />
          <ResultBar label="Characters" value={formatNumber(stats.charactersNoSpaces)} hint="Without spaces" />
          <ResultBar label="Sentences" value={formatNumber(stats.sentences)} />
          <ResultBar label="Paragraphs" value={formatNumber(stats.paragraphs)} hint="Non-empty lines" />
          <ResultBar
            label="Reading time"
            value={stats.readingMinutes === 0 ? "0 min" : `${formatNumber(stats.readingMinutes)} min`}
            hint={`At ${WORDS_PER_MINUTE} wpm`}
          />
        </div>
        <p className="muted" style={{ fontSize: "0.84rem" }}>
          Characters are counted as Unicode characters. Paragraphs are counted as non-empty lines. Words and sentences
          use the browser&apos;s Unicode-aware text segmentation when available.
        </p>
      </StepBlock>

      <StepBlock
        step="Step 03"
        title="Use the text"
        actions={
          <>
            <CopyButton text={text} label="Copy text" className="btn btn--secondary" />
          </>
        }
      >
        <p className="muted" style={{ fontSize: "0.87rem" }}>
          {text.trim()
            ? "The text stays in this tab. Copy it when you are ready to use it elsewhere."
            : "Paste text above to see counts. Nothing is uploaded or stored."}
        </p>
      </StepBlock>
    </Workspace>
  );
}
