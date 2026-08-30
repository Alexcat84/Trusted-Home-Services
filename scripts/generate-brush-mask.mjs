/**
 * Builds the hero mask from the brush artwork.
 *
 *   node scripts/generate-brush-mask.mjs
 *
 * The artwork in design/ is a ring: painted strokes around an empty middle. The
 * mask needs the whole patch solid, so everything the strokes enclose is flooded
 * in, while anything reachable from the outside stays transparent. That keeps the
 * bristles along the edge, which is the point of the effect.
 *
 * Output is a png rather than the source svg because the svg runs to 330 kb and
 * the flattened mask to about 60 kb, for a shape whose fine detail is never seen
 * at hero size anyway.
 *
 * Rerun this after replacing the artwork in design/. It is a one off tool, not
 * part of the build, and it needs a browser to rasterise the svg:
 *
 *   npm i --no-save playwright && npx playwright install chromium
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join(root, 'design', 'brush-frame.svg');
const TARGET = join(root, 'public', 'images', 'brush-mask.png');
const W = 2000;
const H = 1000;

const svg = readFileSync(SOURCE, 'utf8');
const dataUri = 'data:image/svg+xml;base64,' + Buffer.from(svg, 'utf8').toString('base64');

const browser = await chromium.launch();
const page = await browser.newPage();

const out = await page.evaluate(async ({ uri, W, H }) => {
  const img = new Image();
  img.src = uri;
  await img.decode();

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, W, H);

  const data = ctx.getImageData(0, 0, W, H).data;
  const n = W * H;
  const ink = new Uint8Array(n);
  for (let i = 0; i < n; i++) ink[i] = data[i * 4 + 3] > 110 ? 1 : 0;

  // Flood inwards from the edge of the canvas, across anything that is not ink.
  const outside = new Uint8Array(n);
  const stack = new Int32Array(n);
  let top = 0;
  const push = (i) => {
    if (!ink[i] && !outside[i]) {
      outside[i] = 1;
      stack[top++] = i;
    }
  };
  for (let x = 0; x < W; x++) {
    push(x);
    push((H - 1) * W + x);
  }
  for (let y = 0; y < H; y++) {
    push(y * W);
    push(y * W + W - 1);
  }
  while (top > 0) {
    const i = stack[--top];
    const x = i % W;
    const y = (i / W) | 0;
    if (x > 0) push(i - 1);
    if (x < W - 1) push(i + 1);
    if (y > 0) push(i - W);
    if (y < H - 1) push(i + W);
  }

  let enclosed = 0;
  const res = ctx.createImageData(W, H);
  for (let i = 0; i < n; i++) {
    if (!ink[i] && !outside[i]) enclosed++;
    res.data[i * 4 + 3] = ink[i] || !outside[i] ? 255 : 0;
  }
  ctx.putImageData(res, 0, 0);
  return { url: canvas.toDataURL('image/png'), enclosed, total: n };
}, { uri: dataUri, W, H });

const buffer = Buffer.from(out.url.split(',')[1], 'base64');
writeFileSync(TARGET, buffer);
console.log(`filled ${((out.enclosed / out.total) * 100).toFixed(1)}% of the canvas`);
console.log(`${TARGET}: ${buffer.length} bytes`);

await browser.close();
