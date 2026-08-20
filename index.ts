// The one thing this template does: greet a name back. It exists so the
// whole chain — a script, its tests, the hooks, CI — has something real to
// run against. Replace this with your first real command.
//
// No build step: `bun run index.ts` runs this file as it is.

export function greet(name: string): string {
  return `hello, ${name}!`;
}

export function parseName(argv: string[]): string {
  const flagIndex = argv.indexOf("--name");
  const value = flagIndex !== -1 ? argv[flagIndex + 1] : undefined;
  return value ?? "world";
}

if (import.meta.main) {
  console.log(greet(parseName(process.argv.slice(2))));
}
