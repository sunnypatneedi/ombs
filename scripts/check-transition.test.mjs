import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,cpSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {check} from './check-transition.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
test('repository transition contract',()=>assert.deepEqual(check(root),[]));
const mutations=[
 ['README.md','No v0.4.0 machine-readable schema','Schema available'],
 ['v0.4.0/STANDARD.md','## 4. Report structure','## Removed'],
 ['docs/index.html','Frozen at v0.3.0.','Current v0.4.0'],
 ['docs/demo/index.html','Frozen at v0.3.0.','Current v0.4.0'],
 ['index.html','Frozen at v0.3.0.','Current v0.4.0'],
 ['server.js',"const DATA_DIR = 'v0.3.0';","const DATA_DIR = 'v0.4.0';"],
 ['proposals/0001-building-under-uncertainty.md','Historical proposal, not the current v0.4.0 core.','Current proposal'],
 ['docs/standards.json','"version": "0.3.0"','"version": "0.4.0"'],
];
for(const [file,from,to] of mutations) test(`reject drift: ${file}`,()=>{
 const dir=mkdtempSync(join(tmpdir(),'ombs-test-'));
 try {
  for(const name of ['README.md','server.js','v0.3.0','v0.4.0','v0.4.0-draft','proposals','docs','index.html']) cpSync(join(root,name),join(dir,name),{recursive:true});
  const path=join(dir,file),original=readFileSync(path,'utf8');
  assert.ok(original.includes(from),'mutation must apply');
  writeFileSync(path,original.replace(from,to));
  assert.ok(check(dir).length>0);
 } finally {rmSync(dir,{recursive:true,force:true})}
});
