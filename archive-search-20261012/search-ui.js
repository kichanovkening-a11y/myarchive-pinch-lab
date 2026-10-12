/* Add-on for the isolated production copy. Viewer / pinch implementations stay intact. */
(function(){
  const content=document.querySelector('.content');
  const form=document.createElement('form');form.className='archive-search-form';form.setAttribute('role','search');
  form.innerHTML='<label class="archive-search-label" for="archiveSearchInput">Поиск по архиву</label><div class="archive-search-row"><input id="archiveSearchInput" type="search" maxlength="200" placeholder="Папка или подпись фото…" autocomplete="off" enterkeyhint="search"><button type="button" id="archiveSearchClear" aria-label="Очистить поиск">✕</button></div>';
  const panel=document.createElement('section');panel.className='archive-search-panel';panel.hidden=true;
  panel.innerHTML='<div id="archiveSearchStatus" role="status" aria-live="polite"></div><div id="archiveSearchResults" class="archive-search-results"></div><button id="archiveSearchMore" type="button" hidden>Показать ещё</button>';
  content.insertBefore(form,document.getElementById('folders'));form.after(panel);
  const input=document.getElementById('archiveSearchInput'),status=document.getElementById('archiveSearchStatus'),results=document.getElementById('archiveSearchResults'),more=document.getElementById('archiveSearchMore');
  let timer=null,lastData=null;
  const state=ArchiveSearchState.createSearchState(async(q,offset,signal)=>{
    const headers={};if(tg?.initData)headers['X-Telegram-Init-Data']=tg.initData;
    const response=await fetch('./api/search?q='+encodeURIComponent(q)+'&offset='+offset,{headers,signal});
    const data=await response.json();if(!response.ok)throw Error(data.error||'Не удалось выполнить поиск');return data;
  },data=>{lastData=data;paint(data)},error=>{
    status.textContent=error.message;more.hidden=true;
    const retry=document.createElement('button');retry.type='button';retry.textContent='Повторить';retry.onclick=()=>submit();status.append(' ',retry);
  });
  function setVisibility(){
    const atRoot=currentId===null,active=atRoot&&!!input.value.trim();
    form.hidden=!atRoot;panel.hidden=!active;
    document.getElementById('folders').hidden=active;
    document.getElementById('archiveSearchClear').hidden=!input.value;
  }
  function clear(){clearTimeout(timer);state.clear();lastData=null;input.value='';results.replaceChildren();status.textContent='';more.hidden=true;setVisibility()}
  function paint(data){
    status.textContent=data.total?'Найдено: '+data.total:'Ничего не найдено. Попробуйте другое слово.';
    results.replaceChildren();
    const media=data.items.filter(item=>item.kind==='file');
    data.items.forEach(item=>{
      const card=document.createElement('button');card.type='button';card.className='archive-search-card';card.dataset.resultKind=item.kind;card.dataset.resultId=item.id;
      const label=document.createElement('span');label.className='archive-search-caption';
      if(item.kind==='folder'){
        const folder=folders.find(f=>Number(f.id)===Number(item.id)),cover=appearanceForFolder(item.id).cover_file_id||folder?.folder_cover_file_id;
        if(cover){const img=document.createElement('img');img.src='/api/files/'+cover+'/preview';img.loading='lazy';img.alt='';card.append(img)}else{const icon=document.createElement('span');icon.className='archive-search-folder-icon';icon.textContent='📁';card.append(icon)}
        label.textContent=item.name;card.append(label);const kind=document.createElement('small');kind.textContent='Папка';card.append(kind);
        card.onclick=()=>{clear();input.blur();openFolder(item.id)};
      }else{
        const img=document.createElement('img');img.src='/api/files/'+item.id+'/preview';img.loading='lazy';img.alt='';card.append(img);
        label.textContent=item.caption||(item.file_type==='video'?'Видео':'Фото');card.append(label);
        const folder=document.createElement('small');folder.textContent=(item.file_type==='video'?'Видео · ':'')+(folders.find(f=>Number(f.id)===Number(item.folder_id))?.name||'');card.append(folder);
        card.onclick=()=>{input.blur();viewer(media,media.findIndex(f=>Number(f.id)===Number(item.id)))};
      }
      results.append(card);
    });
    more.hidden=!data.has_more;more.disabled=false;more.textContent='Показать ещё';
  }
  function submit(){
    clearTimeout(timer);setVisibility();if(!input.value.trim()){state.clear();lastData=null;results.replaceChildren();status.textContent='';return}
    results.replaceChildren();lastData=null;status.textContent='Ищем…';more.hidden=true;state.search(input.value);
  }
  input.addEventListener('input',()=>{
    clearTimeout(timer);state.clear();setVisibility();results.replaceChildren();lastData=null;more.hidden=true;
    if(!input.value.trim()){status.textContent='';return}status.textContent='Ищем…';timer=setTimeout(submit,250);
  });
  form.addEventListener('submit',event=>{event.preventDefault();input.blur();submit()});
  document.getElementById('archiveSearchClear').onclick=()=>{clear();input.focus()};
  more.onclick=()=>{more.disabled=true;more.textContent='Загружаем…';state.more()};
  const originalRender=render;render=function(){originalRender();setVisibility()};
  setVisibility();
})();
