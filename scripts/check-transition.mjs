#!/usr/bin/env node
// Structural transition checks only; not a claim of educational validity.
import {readFileSync, existsSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
export function check(root) {
  const errors=[];
  const read=p=>{try{return readFileSync(resolve(root,p),'utf8')}catch{errors.push(`Missing ${p}`);return ''}};
  const requireText=(path, text)=>{if(!read(path).includes(text)) errors.push(`${path}: missing ${text}`)};
  for(const heading of ['## 1. What is OMBS?', '## 2. Maker practices','## 3. Growth over time','## 4. Report structure','## 5. Authorship and support','## 6. Research basis','## 7. Selected bibliography']) requireText('v0.4.0/STANDARD.md',heading);
  requireText('v0.4.0/STANDARD.md','**Version:** 0.4.0');
  requireText('v0.4.0/STANDARD.md','Draft for community review');
  for(const f of ['standards.json','crosswalks.json']) {
    if(existsSync(resolve(root,'v0.4.0',f))) errors.push(`Unexpected v0.4.0/${f}: revise the prose-only transition contract before introducing a schema`);
    try {
      const legacy=read(`v0.3.0/${f}`), published=read(`docs/${f}`);
      if(JSON.parse(legacy)[f==='standards.json' ? 'version' : 'ombsVersion']!=='0.3.0') errors.push(`${f}: legacy version must stay 0.3.0`);
      if(legacy!==published) errors.push(`${f}: docs and legacy copies differ`);
    } catch {errors.push(`${f}: invalid legacy JSON`)}
  }
  for(const f of ['index.html','docs/index.html','docs/demo/index.html']) {
    requireText(f,'Frozen at v0.3.0.');
    requireText(f,'https://github.com/sunnypatneedi/ombs/blob/main/v0.4.0/STANDARD.md');
  }
  requireText('server.js',"const DATA_DIR = 'v0.3.0';");
  requireText('README.md','[v0.4.0/STANDARD.md](v0.4.0/STANDARD.md)');
  requireText('README.md','No v0.4.0 machine-readable schema');
  for(const f of ['v0.4.0-draft/STANDARD.md','proposals/0001-building-under-uncertainty.md']) requireText(f,'Historical proposal, not the current v0.4.0 core.');
  return errors;
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const errors=check(resolve(dirname(fileURLToPath(import.meta.url)),'..'));
  for(const e of errors) console.error(e);
  if(errors.length) process.exitCode=1;
  else console.log('Transition checks passed (structure and labels only; no v0.4.0 schema or release approval).');
}
