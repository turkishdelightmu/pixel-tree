// @ts-check
// Run: TS_NODE_COMPILER_OPTIONS='{"module":"commonjs","moduleResolution":"node"}' node --require ts-node/register scripts/test-render.js
const { writeFileSync } = require('fs');
const { renderTree } = require('../lib/renderer');

const TREES = ['bare','sakura','willow','oak','redwood','crystal'];

async function main() {
  let failed = false;
  for (let tier = 0; tier < 6; tier++) {
    const out = `/tmp/test-tree-${tier}.png`;
    const buf = await renderTree(tier);
    writeFileSync(out, buf);
    if (buf.length > 1000) {
      console.log(`tier ${tier} (${TREES[tier]}): PASS  ${buf.length} bytes → ${out}`);
    } else {
      console.error(`tier ${tier} (${TREES[tier]}): FAIL  buffer too small (${buf.length} bytes)`);
      failed = true;
    }
  }
  if (failed) process.exit(1);
  console.log('\nAll 6 tiers rendered successfully.');
}

main().catch(e => { console.error(e); process.exit(1); });
