/* Explicit browser test controls; never run without clicking. */
const edgeButton=document.createElement('button');edgeButton.textContent='Проверить ширину и пагинацию';document.querySelector('#run').after(edgeButton);
edgeButton.onclick=async()=>{try{
 const c=app.contentWindow.__favoritGallery.state;
 const checks=[];
 for(const d of [1,3,5,9,10,15,30]){await show(d);const b=c.box.getBoundingClientRect(),w=app.contentWindow.innerWidth;checks.push({d,width:c.l.width,left:b.left,right:b.right,viewport:w,pass:Math.abs(b.left)<=1&&Math.abs(b.right-w)<=1&&Math.abs(c.l.width-w)<=1})}
 const pagination=await app.contentWindow.__favoritComparison.pagination();
 const result={widthChecks:checks,pagination,pass:checks.every(x=>x.pass)&&pagination.pass};document.querySelector('#edgeReport').textContent=JSON.stringify(result,null,2);
 }catch(e){document.querySelector('#edgeReport').textContent=e.stack}};
const edgeReport=document.createElement('pre');edgeReport.id='edgeReport';document.querySelector('#report').before(edgeReport);
const scrollButton=document.createElement('button');scrollButton.textContent='Проверить one-finger scroll';edgeButton.after(scrollButton);
scrollButton.onclick=async()=>{const c=app.contentWindow.__favoritGallery.state,r=ref.contentWindow.__ref;c.scroll=0;await show(3);
 const event=(win,type,y)=>{const e=new win.Event(type,{bubbles:true,cancelable:true});Object.defineProperty(e,'touches',{value:type==='touchcancel'?[]:[{clientX:195,clientY:y}]});return e};
 c.begin(event(app.contentWindow,'touchstart',550));r.stage.dispatchEvent(event(ref.contentWindow,'touchstart',550));let max=0;
 for(let k=1;k<=20;k++){c.move(event(app.contentWindow,'touchmove',550-k*16));r.stage.dispatchEvent(event(ref.contentWindow,'touchmove',550-k*16));await tick();max=Math.max(max,Math.abs(c.scroll-r.state.scroll))}
 c.end(event(app.contentWindow,'touchcancel',230),true);r.stage.dispatchEvent(event(ref.contentWindow,'touchcancel',230));
 const result={scroll:c.scroll,referenceScroll:r.state.scroll,maxDifference:max,pass:Math.abs(c.scroll-320)<.01&&max<.01};document.querySelector('#scrollReport').textContent=JSON.stringify(result,null,2);
};
const scrollReport=document.createElement('pre');scrollReport.id='scrollReport';edgeReport.after(scrollReport);
