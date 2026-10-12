(function(){
  const base='/archive-folder-move-test-20261012';
  const originalApi=api;
  api=function(url,options={}){if(url==='/api/folders'&&(!options.method||options.method==='GET'))url=base+'/api/folders';return originalApi(url,options)};
  const note=document.createElement('div');note.className='folder-move-test-note';note.textContent='Тест переноса: изменения только в копии архива.';document.querySelector('.content').prepend(note);
  function fullPath(id){const parts=[],seen=new Set();let f=folders.find(x=>Number(x.id)===Number(id));while(f&&!seen.has(f.id)){seen.add(f.id);parts.unshift(f.name);f=folders.find(x=>Number(x.id)===Number(f.parent_id))}return parts.join(' / ')}
  function updateNavigation(){
    const routes=ArchiveFolderMove.folderRoutes(folders,currentId);
    folderNavigationStack=routes.at(-1).stack.slice();rememberFolderNavigation();
    if(archiveRouteSeeded)routes.forEach((route,index)=>writeArchiveRoute(index===0?'replace':'push',{...route,mediaId:null,scrollY:index===routes.length-1?window.scrollY:0}));
  }
  function toast(message){const node=document.createElement('div');node.className='folder-move-toast';node.setAttribute('role','status');node.textContent=message;document.body.append(node);setTimeout(()=>node.remove(),2400)}
  function confirmMove(source,target){
    show('<div class="folder-move-header"><h3>Переместить папку?</h3><button id="folderMoveCancel" type="button">Отмена</button></div><p id="folderMoveSummary"></p><div id="folderMoveError" role="alert"></div><div class="actions"><button id="folderMoveConfirm">Переместить</button></div>');$('modalbg').classList.add('compact-dialog-overlay');
    $('folderMoveSummary').textContent='«'+source.name+'» → '+(target?fullPath(target.id):'Главная страница')+'. Фото и подпапки сохранятся.';
    $('folderMoveCancel').onclick=close;
    $('folderMoveConfirm').onclick=async()=>{
      const button=$('folderMoveConfirm'),cancel=$('folderMoveCancel'),error=$('folderMoveError');button.disabled=true;cancel.disabled=true;button.textContent='Перемещаем…';error.textContent='';
      try{await api(base+'/api/folders/'+source.id+'/move',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({parent_id:target?.id??null})});close();await load();updateNavigation();toast('Папка перемещена в тестовой копии')}
      catch(e){if(error.isConnected){error.textContent=e.message;button.disabled=false;cancel.disabled=false;button.textContent='Переместить'}else toast(e.message)}
    };
    bindAction($('folderMoveCancel'));bindAction($('folderMoveConfirm'));
  }
  async function choose(source){
    closeContextMenu();
    show('<div class="folder-move-picker"><div class="folder-move-header"><h3>Переместить папку</h3><button id="folderMoveClose" type="button">Отмена</button></div><p id="folderMoveName"></p><input id="folderMoveSearch" type="search" placeholder="Поиск папки…" autocomplete="off"><button id="folderMoveRoot" type="button">На главную страницу</button><div class="folder-move-list-label">Все папки архива</div><div class="folder-move-pager"><button id="folderMovePrevious" type="button" aria-label="Предыдущие папки">←</button><span id="folderMovePage"></span><button id="folderMoveNext" type="button" aria-label="Следующие папки">→</button></div><div id="folderMoveTargets"></div><div id="folderMoveStatus" role="status"></div></div>');$('modalbg').classList.add('compact-dialog-overlay');
    $('folderMoveName').textContent='«'+source.name+'»';const input=$('folderMoveSearch'),box=$('folderMoveTargets'),status=$('folderMoveStatus'),rootButton=$('folderMoveRoot');
    rootButton.disabled=source.parent_id===null;rootButton.onclick=()=>confirmMove(source,null);$('folderMoveClose').onclick=close;bindAction(rootButton);bindAction($('folderMoveClose'));
    let offset=0;const previous=$('folderMovePrevious'),next=$('folderMoveNext'),page=$('folderMovePage');
    const paint=()=>{
      const total=ArchiveFolderMove.destinationCount(folders,source.id,input.value);offset=Math.min(offset,Math.max(0,(Math.ceil(total/6)-1)*6));
      box.replaceChildren();const shown=ArchiveFolderMove.destinations(folders,source.id,input.value,offset);
      page.textContent=total?(offset+1)+'–'+(offset+shown.length)+' из '+total:'0 папок';previous.disabled=offset===0;next.disabled=offset+6>=total;
      status.textContent=shown.length?'':'Подходящие папки не найдены';
      for(const folder of shown){
        const button=document.createElement('button');button.type='button';button.className='folder-move-target';button.dataset.targetFolderId=folder.id;
        const cover=appearanceForFolder(folder.id).cover_file_id||folder.folder_cover_file_id;
        if(cover){const image=document.createElement('img');image.src='/api/files/'+cover+'/preview';image.alt='';image.loading='lazy';button.append(image)}else{const icon=document.createElement('span');icon.className='folder-move-icon';icon.textContent='📁';button.append(icon)}
        const text=document.createElement('span'),name=document.createElement('strong'),path=document.createElement('small');name.textContent=folder.name;path.textContent=fullPath(folder.id);text.append(name,path);button.append(text);button.onclick=()=>confirmMove(source,folder);box.append(button);bindAction(button);
      }
    };previous.onclick=()=>{offset=Math.max(0,offset-6);paint()};next.onclick=()=>{offset+=6;paint()};bindAction(previous);bindAction(next);input.addEventListener('input',()=>{offset=0;paint()});paint();
  }
  function insertMove(menu,folder){
    if(!menu||menu.querySelector('#folderMoveInside'))return;
    const button=document.createElement('button');button.id='folderMoveInside';button.type='button';button.className='context-menu-item';button.textContent='Переместить папку';button.onclick=event=>{event.preventDefault();closeContextMenu();choose(folder)};menu.prepend(button);bindAction(button);
  }
  const oldFolderMenu=folderMenu;folderMenu=function(folder){oldFolderMenu(folder);insertMove(activeContextMenu?.menu,folder)};
  const oldInnerMenu=showInnerMenu;showInnerMenu=function(){oldInnerMenu();if(!selectionMode&&currentId!==null)insertMove(activeContextMenu?.menu,folders.find(f=>Number(f.id)===Number(currentId)))};
  window.addEventListener('popstate',event=>{
    const route=event.state?.[ARCHIVE_ROUTE_KEY];if(route?.kind!=='folder'||currentId===null)return;
    const canonical=ArchiveFolderMove.folderRoutes(folders,currentId).at(-1).stack;
    if(JSON.stringify(route.stack||[])!==JSON.stringify(canonical))updateNavigation();
  });
  load().catch(error=>toast(error.message));
})();
