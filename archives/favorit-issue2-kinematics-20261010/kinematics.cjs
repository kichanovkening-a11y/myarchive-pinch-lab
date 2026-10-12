/* Executes the protected reference's FIRST script, not a rewritten formula. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const M=require('./favorit-model.js');
const prefix=fs.readFileSync(__dirname+'/parity.test.cjs','utf8').split("test('cancel completes")[0];
const integrationContext={require:x=>x.startsWith('./')?require(__dirname+'/'+x):require(x),__dirname,console,AbortController};
vm.createContext(integrationContext);vm.runInContext(prefix+';globalThis.makeRuntime=runtime',integrationContext);
function reference(count){let serial=0,now=0;const pending=new Map(),draws=[];
 class Node{constructor(){this.style={};this.dataset={};this.clientWidth=390;this.clientHeight=710;this.classList={remove(){},add(){}};this.events={};this.offsetWidth=390}append(){}insertBefore(){}addEventListener(k,f){this.events[k]=f}getContext(){return {setTransform(){},fillRect(...a){draws.push(a)},drawImage(){}}}}
 const stage=new Node(),slider=new Node(),read=new Node();
 const c={console,Math,Image:class{complete=false;naturalWidth=0},devicePixelRatio:1,performance:{now:()=>now},document:{querySelector:q=>q==='#stage'?stage:q==='#slider'?slider:read,createElement:()=>new Node()},window:{addEventListener(){}},requestAnimationFrame:f=>{pending.set(++serial,f);return serial},cancelAnimationFrame:i=>pending.delete(i),setTimeout:()=>0,clearTimeout(){}};
 vm.createContext(c);let source=fs.readFileSync(__dirname+'/reference.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
 assert.ok(source.includes('N=20000'));source=source.replace('N=20000','N='+count);vm.runInContext(source,c);
 vm.runInContext('globalThis.probe={set,render,tiles,stage,canvas,get density(){return density},get scroll(){return scroll},set scroll(s){scroll=s},get columns(){return Math.round(density)}}',c);
 return {c,p:c.probe,draws,frame(t){now=t;const a=[...pending.values()];pending.clear();a.forEach(f=>f(t))}};
}
function positionsRef(r){const p=r.p;if(p.columns>=10){const sz=(390-M.gap(p.density)*(p.columns-1))/p.columns;return r.draws.filter(a=>Math.abs(a[2]-sz)<1e-8).map(a=>({i:Math.round((a[1]+p.scroll)/(sz+M.gap(p.density)))*p.columns+Math.round(a[0]/(sz+M.gap(p.density))),r:a}))}return Array.from(p.tiles).filter(n=>n.style.display!=='none').map(n=>{const a=n.style.transform.match(/translate3d\(([^p]+)px,([^p]+)px/);return {i:+n.dataset.idx,r:[+a[1],+a[2],parseFloat(n.style.width),parseFloat(n.style.height)]}})}
const report={kind:'Node renderer execution, not browser/iPhone paint',width:390,height:710,referenceCountAdaptedOnly:true,cases:[],seams:[]};
for(const count of [13,146])for(const initialScroll of [0,100]){
 const r=reference(count),t=integrationContext.makeRuntime();t.context.galleryItems.splice(count);t.c.total=count;t.c.refreshData();t.c.width=390;t.c.height=710;t.c.scroll=initialScroll;r.p.scroll=initialScroll;
 let maxError=0,compared=0,maxJump=0,holdJump=0,previous=new Map(),crossings=[];
 const event=d=>({touches:[{clientX:195-d/2,clientY:355},{clientX:195+d/2,clientY:355}],preventDefault(){}});
 r.p.set(3);r.frame(-16);t.c.set(3);t.frame(-16);r.p.stage.events.touchstart(event(180));t.c.begin(event(180));
 const path=[...Array.from({length:421},(_,i)=>3+i/60),...Array(30).fill(10),...Array.from({length:420},(_,i)=>10-(i+1)/60),...Array(30).fill(3)];
 for(let frame=0;frame<path.length;frame++){const d=path[frame],e=event(180*Math.pow(3/d,1/1.55));r.draws.length=0;r.p.stage.events.touchmove(e);r.frame(frame*1000/60);let draws=[];t.c.ctx.fillRect=(...a)=>draws.push(a);t.c.move(e);t.frame(frame*1000/60);
 const a=positionsRef(r),b=t.c.l.canvas?draws.map(a=>({i:Math.round((a[1]+t.c.scroll)/t.c.l.step)*t.c.l.columns+Math.round(a[0]/t.c.l.step),r:a})):Array.from(t.c.pool).filter(n=>n.style.display!=='none').map(n=>{const a=n.style.transform.match(/translate3d\(([^p]+)px,([^p]+)px/);return {i:n.__favoritIndex,r:[+a[1],+a[2],parseFloat(n.style.width),parseFloat(n.style.height)]}});
 const bMap=new Map(b.map(n=>[n.i,n.r]));for(const n of a){const other=bMap.get(n.i);if(!other)continue;for(let j=0;j<4;j++)maxError=Math.max(maxError,Math.abs(n.r[j]-other[j]));compared++}
 let jump=0;for(const n of b){const old=previous.get(n.i);if(old)jump=Math.max(jump,Math.hypot(n.r[0]-old[0],n.r[1]-old[1]))}maxJump=Math.max(maxJump,jump);if(frame&&d===path[frame-1])holdJump=Math.max(holdJump,jump);if(frame&&Math.round(d)!==Math.round(path[frame-1]))crossings.push({frame,d,columns:Math.round(d),maxItemJump:jump,scroll:t.c.scroll});previous=bMap;
 assert.equal(t.c.scroll,r.p.scroll);assert.equal(t.c.density,r.p.density);
 }
 assert.ok(maxError<1e-9);assert.equal(holdJump,0);
 const end={touches:[],preventDefault(){}};r.p.stage.events.touchend(end);t.c.end(end);for(let k=0;k<22;k++){const time=path.length*1000/60+k*1000/60;r.frame(time);t.frame(time);assert.equal(t.c.density,r.p.density)}
 report.cases.push({count,initialScroll,frames:path.length,compared,maxRendererCoordinateDifference:maxError,maxFrameItemJump:maxJump,holdJump,releaseDensity:t.c.density,crossings});
}
for(let n=3;n<10;n++){const a=M.layout(390,710,146,n+.5-1e-7),b=M.layout(390,710,146,n+.5+1e-7),rA=M.rect(a,0,n),rB=M.rect(b,0,n);report.seams.push({density:n+.5,idIndex:n,from:rA,to:rB,jump:Math.hypot(rB.x-rA.x,rB.y-rA.y),sizeChange:rB.width-rA.width})}
console.log(JSON.stringify(report,null,2));
