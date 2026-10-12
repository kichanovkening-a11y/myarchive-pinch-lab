(function(root){'use strict';
 const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
 const gap=d=>d<=6?2:d>=20?0:d<=12?2-(d-6)/6:1-(d-12)/8;
 function layout(width,height,count,d){const columns=Math.round(clamp(d,1,30)),g=gap(d),size=(width-g*(columns-1))/columns;return {width,height,columns,gap:g,size,step:size+g,canvas:columns>=10,maxScroll:Math.max(0,Math.ceil(count/columns)*(size+g)-height)}}
 function rect(l,s,i){return {x:i%l.columns*l.step,y:Math.floor(i/l.columns)*l.step-s,width:l.size,height:l.size}}
 function visible(l,s,count){const first=Math.max(0,Math.floor(s/l.step)-1)*l.columns,end=Math.min(count,(Math.ceil((s+l.height)/l.step)+2)*l.columns);return Array.from({length:Math.max(0,end-first)},(_,k)=>first+k)}
 function hit(l,s,x,y,count){const col=Math.floor(x/l.step),row=Math.floor((y+s)/l.step),i=row*l.columns+col;return col>=0&&col<l.columns&&row>=0&&i<count&&x-col*l.step<l.size&&y+s-row*l.step<l.size?i:-1}
 function zoom(g,dist,mx,my,w,h){const scale=clamp(g.scale*dist/g.dist,1,30),ratio=scale/g.scale,cx=g.mx-w/2,cy=g.my-h/2;return {scale,x:(g.x-cx)*ratio+cx+mx-g.mx,y:(g.y-cy)*ratio+cy+my-g.my}}
 function book(dx,w){const p=clamp(Math.abs(dx)/w,0,1),direction=dx<0?1:-1;return {direction,opacity:p*.95,nextX:-direction*(1-p)*w*.24,nextScale:.96+p*.04,x:dx*.72,rotate:-dx/w*36}}
 const api={clamp,gap,layout,rect,visible,hit,zoom,book,contentCount:(loaded,total)=>Math.max(loaded,Number(total)||0),gestureScroll:(scroll,w,h,count,from,to)=>clamp(scroll,0,layout(w,h,count,to).maxScroll),advance:(items,id,delta)=>items.findIndex(f=>Number(f.id)===Number(id))+delta,density:(d,start,current)=>clamp(d*Math.pow(start/Math.max(1,current),1.55),1,30),anchorScroll:(l,i,v,y)=>clamp(Math.floor(i/l.columns)*l.step+v*l.size-y,0,l.maxScroll),next:(i,d,n)=>clamp(i+d,0,n-1)};
 if(typeof module!=='undefined')module.exports=api;else root.FavoritModel=api;
})(globalThis);
