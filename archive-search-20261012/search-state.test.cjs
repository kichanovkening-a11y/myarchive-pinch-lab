const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const path=__dirname+'/search-state.js';
test('a late old query never replaces newer results',async()=>{
  assert.ok(fs.existsSync(path),'Search state is not implemented');
  const {createSearchState}=require(path),pending=[],received=[];
  const state=createSearchState((q,offset,signal)=>new Promise(resolve=>pending.push({q,resolve})),data=>received.push(data));
  const old=state.search('шка'),fresh=state.search('гас');
  pending[1].resolve({items:[{id:2}],has_more:false});await fresh;
  pending[0].resolve({items:[{id:1}],has_more:false});await old;
  assert.deepEqual(received.map(x=>x.items),[[{id:2}]]);
});
test('clear prevents a pending result from appearing',async()=>{
  assert.ok(fs.existsSync(path),'Search state is not implemented');
  const {createSearchState}=require(path);let resolve;const received=[];
  const state=createSearchState(()=>new Promise(r=>resolve=r),d=>received.push(d));
  const pending=state.search('шка');state.clear();resolve({items:[{id:1}]});await pending;
  assert.equal(received.length,0);
});
test('loading the next page appends results',async()=>{
  assert.ok(fs.existsSync(path),'Search state is not implemented');
  const {createSearchState}=require(path),received=[];
  const state=createSearchState(async(q,offset)=>({items:[{id:offset+1}],has_more:offset===0,next_offset:1}),d=>received.push(d));
  await state.search('шка');await state.more();assert.deepEqual(received.at(-1).items,[{id:1},{id:2}]);
});
test('transport errors reach the interface',async()=>{
  assert.ok(fs.existsSync(path),'Search state is not implemented');
  const {createSearchState}=require(path);let message;
  const state=createSearchState(async()=>{throw Error('offline')},()=>{},e=>message=e.message);
  await state.search('шка');assert.equal(message,'offline');
});
