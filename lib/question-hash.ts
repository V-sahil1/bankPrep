import { createHash } from "node:crypto";

export function normalizeQuestionText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Identity of a question for duplicate checks. Stems like "Read the assertion and
 * the reason" repeat across different questions, so the structured content and any
 * linked passage are part of the identity when present.
 */
export function questionHash(text: string, ...identity: unknown[]): string {
  const extra = identity.filter((part) => part !== null && part !== undefined).map((part) => JSON.stringify(part));
  return createHash("sha256")
    .update(normalizeQuestionText([text, ...extra].join(" ")))
    .digest("hex");
}

/** Jaccard similarity of word sets, 0 to 1. Catches lightly reworded duplicates. */
export function textSimilarity(a: string, b: string): number {
  const wordsA = new Set(normalizeQuestionText(a).split(" ").filter(Boolean));
  const wordsB = new Set(normalizeQuestionText(b).split(" ").filter(Boolean));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let shared = 0;
  for (const word of wordsA) if (wordsB.has(word)) shared += 1;
  return shared / (wordsA.size + wordsB.size - shared);
}

export const NEAR_DUPLICATE_THRESHOLD = 0.85;
