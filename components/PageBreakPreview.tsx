"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { CvExperienceItem } from "@/lib/resumeData";

const BLOCK_SELECTOR = "header, p, li";

function getTextNodes(root: Node): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.textContent?.trim()
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });
  const nodes: Text[] = [];
  let current = walker.nextNode();
  while (current) {
    nodes.push(current as Text);
    current = walker.nextNode();
  }
  return nodes;
}

function getClosestBlockAncestor(node: Node, root: HTMLElement): HTMLElement | null {
  let el: Node | null = node;
  while (el && el !== root) {
    if (el.nodeType === Node.ELEMENT_NODE) {
      const tag = (el as HTMLElement).tagName.toLowerCase();
      if (tag === "header" || tag === "p" || tag === "li") return el as HTMLElement;
    }
    el = el.parentNode;
  }
  return null;
}

type Props = {
  items: CvExperienceItem[];
  guessHeightPx?: number;
};

export function PageBreakPreview({ items, guessHeightPx = 500 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const recalc = () => {
      const textNodes = getTextNodes(root);
      if (!textNodes.length) return;

      const rootTop = root.getBoundingClientRect().top + window.scrollY;
      const blocks = Array.from(root.querySelectorAll<HTMLElement>(BLOCK_SELECTOR));

      let blockIndex: number | null = null;

      for (let i = 0; i < textNodes.length; i++) {
        const range = document.createRange();
        range.selectNodeContents(textNodes[i]);
        const rect = range.getBoundingClientRect();
        const bottom = rect.bottom + window.scrollY - rootTop;

        if (bottom >= guessHeightPx) {
          const block = getClosestBlockAncestor(textNodes[i], root);
          if (block) {
            const idx = blocks.indexOf(block);
            if (idx !== -1) blockIndex = idx + 1;
          }
          break;
        }
      }

      setInsertIndex(blockIndex);
    };

    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [guessHeightPx]);

  const Spacer = () => (
    <div className="resume-page-break-preview">
      <div className="resume-page-break-preview-margin" />
      <div className="resume-page-break-preview-line" />
      <div className="resume-page-break-preview-margin" />
    </div>
  );

  const cumulative: number[] = [0];
  for (let i = 0; i < items.length; i++) {
    const prev = cumulative[i];
    const item = items[i];
    let leaves = 1 + (item.location ? 1 : 0);
    if (item.projects && item.projects.length > 0) {
      for (const p of item.projects) {
        leaves += 1 + p.highlights.length;
      }
    } else {
      leaves += item.highlights?.length ?? 0;
    }
    cumulative.push(prev + leaves);
  }

  const getNextBlockIndex = (itemIdx: number) => {
    let idx = cumulative[itemIdx];
    return () => idx++;
  };

  return (
    <div ref={containerRef} className="space-y-3">
      {items.map((item, itemIdx) => {
        const nextIdx = getNextBlockIndex(itemIdx);
        const headerIdx = nextIdx();
        const locationIdx = item.location ? nextIdx() : null;
        return (
          <article key={`${item.company}-${item.position}`}>
            <Fragment>
              <header className="flex flex-wrap justify-between gap-1 text-sm font-medium text-zinc-900">
                <span>
                  {item.position} • {item.company}
                </span>
                <span className="text-xs font-normal text-zinc-600">
                  {item.start_date} – {item.end_date ?? "Present"}
                </span>
              </header>
              {insertIndex !== null && headerIdx + 1 === insertIndex && (
                <Spacer />
              )}
            </Fragment>
            {item.location ? (
              <Fragment>
                <p className="text-xs text-zinc-600">
                  {item.location}
                </p>
                {insertIndex !== null &&
                  locationIdx !== null &&
                  locationIdx + 1 === insertIndex && <Spacer />}
              </Fragment>
            ) : null}

            <ul className="mt-1 list-disc space-y-1 pl-5 text-xs leading-relaxed text-zinc-700">
              {item.projects && item.projects.length > 0 ? (
                item.projects.map((project) => {
                  const nameIdx = nextIdx();
                  return (
                    <li key={project.name} className="font-semibold text-zinc-800">
                      {project.name}
                      {insertIndex !== null && nameIdx + 1 === insertIndex && (
                        <Spacer />
                      )}
                      <ul className="mt-1 list-disc space-y-1 pl-5 font-normal text-zinc-700">
                        {project.highlights.map((h) => {
                          const highlightIdx = nextIdx();
                          return (
                            <Fragment key={h}>
                              <li>{h}</li>
                              {insertIndex !== null &&
                                highlightIdx + 1 === insertIndex && (
                                  <Spacer />
                                )}
                            </Fragment>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })
              ) : (
                (item.highlights ?? []).map((h) => {
                  const highlightIdx = nextIdx();
                  return (
                    <Fragment key={h}>
                      <li>{h}</li>
                      {insertIndex !== null &&
                        highlightIdx + 1 === insertIndex && <Spacer />}
                    </Fragment>
                  );
                })
              )}
            </ul>
          </article>
        );
      })}
    </div>
  );
}

