/* Prevent a release click from falling through a disappearing overlay. */
(function(){
  let suppressUntil=0;
  const arm=()=>{suppressUntil=Date.now()+700};
  document.addEventListener('pointerdown',()=>{suppressUntil=0},true);
  document.addEventListener('touchstart',()=>{suppressUntil=0},{capture:true,passive:true});
  document.addEventListener('click',event=>{
    if(Date.now()>=suppressUntil)return;
    suppressUntil=0;event.preventDefault();event.stopImmediatePropagation();
  },true);
  const previousMenuClose=closeContextMenu;
  closeContextMenu=function(){if(activeContextMenu)arm();return previousMenuClose.apply(this,arguments)};
  const previousClose=close;
  close=function(){if(document.body.classList.contains('modal-open'))arm();return previousClose.apply(this,arguments)};
})();
