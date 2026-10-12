const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const path=__dirname+'/folder-move-state.js';
const rows=[{id:1,name:'Поделки',parent_id:null},{id:2,name:'Шкатулки',parent_id:1},{id:3,name:'Внутри',parent_id:2},{id:4,name:'Гаспар',parent_id:null}];
function model(){assert.ok(fs.existsSync(path),'Destination rules are not implemented');return require(path)}
test('excludes source, descendants and current parent',()=>{assert.deepEqual(model().destinations(rows,2,'').map(f=>f.id),[4])});
test('search uses prefix and ignores Cyrillic case',()=>{assert.deepEqual(model().destinations(rows,1,'ГаС').map(f=>f.id),[4]);assert.deepEqual(model().destinations(rows,1,'спар'),[])});
test('never displays more than six folders',()=>{const many=Array.from({length:20},(_,i)=>({id:i+10,name:'Папка '+i,parent_id:null}));assert.equal(model().destinations([...rows,...many],2,'Папка').length,6)});
test('cannot send mutations to production endpoints',()=>{const {mutationAllowed}=model();assert.equal(mutationAllowed('https://archive.vip-teatre.ru:8443/api/files/batch','POST','https://archive.vip-teatre.ru:8443'),false);assert.equal(mutationAllowed('https://other.example/archive-folder-move-test-20261012/api/folders/2/move','PUT','https://archive.vip-teatre.ru:8443'),false);assert.equal(mutationAllowed('https://archive.vip-teatre.ru:8443/archive-folder-move-test-20261012/api/folders/2/move','PUT','https://archive.vip-teatre.ru:8443'),true)});
test('early guard blocks writes even when the destination helper fails to load',async()=>{
  const guard=__dirname+'/folder-move-guard.js';assert.ok(fs.existsSync(guard),'Early guard is not implemented');
  const vm=require('node:vm'),calls=[],context={URL,Error,Promise,location:{origin:'https://archive.vip-teatre.ru:8443',href:'https://archive.vip-teatre.ru:8443/archive-folder-move-test-20261012/'},window:{fetch:async(...args)=>calls.push(args)},navigator:{sendBeacon:()=>true}};
  vm.runInNewContext(fs.readFileSync(guard,'utf8'),context);
  await assert.rejects(context.window.fetch('/api/upload',{method:'POST'}));assert.equal(calls.length,0);
  await context.window.fetch('/api/folders');assert.equal(calls.length,1);assert.equal(context.navigator.sendBeacon('/api/runtime-diagnostics','x'),false);
});
test('relocated folder routes follow the new ancestry',()=>{
  const updated=rows.map(f=>f.id===2?{...f,parent_id:4}:f),fn=model().folderRoutes;
  assert.equal(typeof fn,'function','Browser route rebuilding is not implemented');
  const routes=fn(updated,3);assert.deepEqual(routes.map(r=>r.folderId),[null,4,2,3]);assert.deepEqual(routes.map(r=>r.stack),[[],[null],[null,4],[null,4,2]]);
});
test('later pages expose folders beyond the first six without duplicates',()=>{
  const many=Array.from({length:14},(_,i)=>({id:i+10,name:'Папка '+String(i).padStart(2,'0'),parent_id:null}));
  const all=[...rows,...many],fn=model().destinations;
  const a=fn(all,2,'Папка',0),b=fn(all,2,'Папка',6),c=fn(all,2,'Папка',12);
  assert.deepEqual([...a,...b,...c].map(f=>f.id),many.map(f=>f.id));assert.equal(c.length,2);
});
test('destination count includes all matching eligible folders',()=>{
  const fn=model().destinationCount;assert.equal(typeof fn,'function','Full destination count is missing');
  assert.equal(fn(rows,2,''),1);assert.equal(fn(rows,2,'ГаС'),1);assert.equal(fn(rows,2,'Внутри'),0);
});
