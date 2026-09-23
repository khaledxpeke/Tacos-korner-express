// Scans src/ for `solar:<name>` usages and writes a subset of the Solar icon
// set to src/lib/solar-icons.json so the full 11 MB collection is not bundled.
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getIcons } from "@iconify/utils";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "src");
const out = join(srcDir, "lib", "solar-icons.json");

const solar = JSON.parse(
  readFileSync(join(root, "node_modules/@iconify-json/solar/icons.json"), "utf8"),
);

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(tsx?|mdx?)$/.test(entry)) acc.push(p);
  }
  return acc;
}

// Icon names are passed as plain kebab-case string literals (the <Icon> component adds
// the `solar:` prefix). Collect every quoted kebab-case token ending in a Solar style
// suffix and keep those that exist in the collection.
const names = new Set();
const candidates = new Set();
const suffix = /-(outline|bold|linear|broken|bold-duotone|line-duotone)$/;
for (const file of walk(srcDir)) {
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(/["'`]([a-z0-9]+(?:-[a-z0-9]+)+)["'`]/g)) {
    const n = m[1];
    if (!suffix.test(n)) continue;
    candidates.add(n);
    if (solar.icons[n] || solar.aliases?.[n]) names.add(n);
  }
}

const missing = [...candidates].filter((n) => !names.has(n));
if (missing.length) {
  console.error("Unknown solar icons:", missing.join(", "));
  process.exit(1);
}

const subset = getIcons(solar, [...names]);
writeFileSync(out, JSON.stringify(subset));
console.log(`Wrote ${names.size} icons to src/lib/solar-icons.json`);
