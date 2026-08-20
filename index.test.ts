import { describe, expect, test } from "bun:test";
import { greet, parseName } from "./index";

describe("greet", () => {
  test("wraps a name in a greeting", () => {
    expect(greet("Ada")).toBe("hello, Ada!");
  });
});

describe("parseName", () => {
  test("defaults to world with no --name flag", () => {
    expect(parseName([])).toBe("world");
  });

  test("reads the value after --name", () => {
    expect(parseName(["--name", "Ada"])).toBe("Ada");
  });
});

describe("CLI", () => {
  test("prints the greeting for the given name, run directly with no build step", () => {
    const result = Bun.spawnSync(["bun", "run", "index.ts", "--name", "Ada"], {
      cwd: import.meta.dir,
    });
    expect(result.stdout.toString().trim()).toBe("hello, Ada!");
  });
});
