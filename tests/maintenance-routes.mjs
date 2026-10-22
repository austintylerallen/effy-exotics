import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const base = process.env.TEST_BASE_URL || 'http://localhost:3107';
for (const [path, marker] of [['/', 'Just a little'], ['/las-cruces/shop?dtche=menu', '66b662a0d91b92addb39e11a'], ['/alamogordo/shop?dtche=menu', '688904f4ca54c616139353b0']]) {
  const res = await fetch(base + path, {redirect:'manual'});
  assert.equal(res.status, 200, path);
  assert.match(await res.text(), new RegExp(marker));
  assert.match(res.headers.get('cache-control'), /no-store/);
}
const build = (await readFile('.next/BUILD_ID','utf8')).trim();
for (const path of ['/las-cruces','/alamogordo','/las-cruces/about','/alamogordo/faq','/login','/account','/admin/analytics','/coming-soon','/complete-profile','/unlisted','/maintenance/index.html','/maintenance/las-cruces.html','/sitemap-0.xml',`/_next/data/${build}/las-cruces/about.json`]) {
  const res = await fetch(base + path, {redirect:'manual',headers:{Cookie:'ageVerified=true; ee_city=las-cruces'}});
  assert.equal(res.status,307,path);
  assert.equal(new URL(res.headers.get('location'), base).pathname,'/',path);
}
for (const path of ['/api/hello','/api/hours','/_next/static/anything.js']) {
  assert.equal((await fetch(base+path,{redirect:'manual'})).status,404,path);
}
for (const path of ['/maintenance/maintenance.css','/maintenance/age-gate.js','/maintenance/ordering.js','/maintenance/cloud-atlas.js','/maintenance/cloud-shader.js','/maintenance/assets/effy-logo.svg','/robots.txt','/sitemap.xml']) {
  assert.equal((await fetch(base+path,{redirect:'manual'})).status,200,path);
}
console.log('Maintenance routes passed: home, both ordering pages, legacy redirects, data/API blocking, assets.');

const hours = await fetch(base+'/api/store-hours');
assert.equal(hours.status,200);
assert.equal((await hours.json()).locations.length,2);
assert.equal((await fetch(base+'/api/store-hours',{method:'POST'})).status,405);
