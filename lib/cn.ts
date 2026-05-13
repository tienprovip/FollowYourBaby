/**
 * Merges Tailwind/NativeWind className strings, filtering falsy values.
 * Implements a lightweight version of clsx + tailwind-merge behaviour
 * without external dependencies. Later-declared classes win on conflict.
 */

type ClassValue = string | undefined | null | false | ClassValue[];

function flattenClasses(values: ClassValue[]): string[] {
  const result: string[] = [];
  for (const v of values) {
    if (!v) continue;
    if (Array.isArray(v)) {
      result.push(...flattenClasses(v));
    } else {
      result.push(...v.split(/\s+/).filter(Boolean));
    }
  }
  return result;
}

/**
 * Extracts the Tailwind utility prefix (everything before the last `-` segment
 * that isn't a variant prefix) so later classes override earlier ones.
 * E.g. "bg-rose-500" → "bg", "text-sm" → "text", "px-4" → "px".
 */
function getPrefix(cls: string): string {
  // Strip variant prefixes like "hover:", "dark:", "md:", etc.
  const withoutVariant = cls.replace(/^[a-z]+:/, '');
  // The Tailwind prefix is the first segment before `-`
  const dashIdx = withoutVariant.indexOf('-');
  return dashIdx === -1 ? withoutVariant : withoutVariant.slice(0, dashIdx);
}

/**
 * Groups that should be deduplicated — maps a class to a dedup key so that
 * later values replace earlier ones for the same property.
 */
type DedupKey = string | ((s: string) => string);

const DEDUP_PATTERNS: Array<[RegExp, DedupKey]> = [
  [/^(bg)-/, 'bg'],
  [/^(text)-/, 'text-color'],
  [/^(text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl))$/, 'text-size'],
  [/^(font)-/, 'font'],
  [/^(p|px|py|pt|pb|pl|pr)-/, (m: string) => m],
  [/^(m|mx|my|mt|mb|ml|mr)-/, (m: string) => m],
  [/^(w)-/, 'w'],
  [/^(h)-/, 'h'],
  [/^(rounded)(-|$)/, 'rounded'],
  [/^(border)(-|$)/, 'border'],
  [/^(opacity)-/, 'opacity'],
  [/^(flex)(-|$)/, 'flex'],
  [/^(items)-/, 'items'],
  [/^(justify)-/, 'justify'],
];

function dedupKey(cls: string): string {
  const withoutVariant = cls.replace(/^[a-z]+:/, '');
  for (const [pattern, key] of DEDUP_PATTERNS) {
    if (pattern.test(withoutVariant)) {
      return typeof key === 'function' ? key(withoutVariant) : key;
    }
  }
  return cls;
}

export function cn(...inputs: ClassValue[]): string {
  const classes = flattenClasses(inputs);
  // Later classes win — iterate in reverse, track seen dedup keys
  const seen = new Set<string>();
  const result: string[] = [];
  for (let i = classes.length - 1; i >= 0; i--) {
    const cls = classes[i];
    const key = dedupKey(cls);
    if (!seen.has(key)) {
      seen.add(key);
      result.unshift(cls);
    }
  }
  return result.join(' ');
}
