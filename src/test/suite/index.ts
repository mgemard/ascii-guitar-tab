import * as path from "path";
import Mocha from "mocha";
import { glob } from "glob";

export async function run(): Promise<void> {
  const mocha = new Mocha({ ui: "tdd", color: true });
  const testsRoot = path.resolve(__dirname);

  // find all compiled test JS files
  const files = await glob("**/*.test.js", { cwd: testsRoot });
  files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

  return new Promise((resolve, reject) => {
    mocha.run((failures) => {
      if (failures > 0) { reject(new Error(`${failures} test(s) failed.`)); }
      else { resolve(); }
    });
  });
}

// automatically run if imported by runTest.ts
if (require.main !== module) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}