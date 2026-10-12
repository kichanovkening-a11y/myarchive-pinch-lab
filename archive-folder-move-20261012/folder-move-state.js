(function(root){
  const base='/archive-folder-move-test-20261012';
  const normalized=s=>(s||'').normalize('NFKC').toLocaleLowerCase('ru').replaceAll('ё','е');
  function candidates(rows,sourceId,query){
    const source=rows.find(f=>Number(f.id)===Number(sourceId)),blocked=new Set([Number(sourceId)]),queue=[Number(sourceId)];
    while(queue.length){const id=queue.pop();for(const f of rows)if(Number(f.parent_id)===id&&!blocked.has(Number(f.id))){blocked.add(Number(f.id));queue.push(Number(f.id))}}
    const q=normalized(query.trim());
    return rows.filter(f=>!blocked.has(Number(f.id))&&Number(f.id)!==Number(source?.parent_id)&&normalized(f.name).startsWith(q)).sort((a,b)=>a.name.localeCompare(b.name,'ru',{sensitivity:'base'})||Number(a.id)-Number(b.id));
  }
  function destinations(rows,sourceId,query,offset=0){const start=Math.max(0,Math.trunc(Number(offset)||0));return candidates(rows,sourceId,query).slice(start,start+6)}
  function destinationCount(rows,sourceId,query){return candidates(rows,sourceId,query).length}
  function mutationAllowed(url,method,origin){
    if(['GET','HEAD'].includes(method))return true;
    const target=new URL(url,origin);
    return target.origin===origin&&method==='PUT'&&new RegExp('^'+base+'/api/folders/[0-9]+/move$').test(target.pathname);
  }
  function folderRoutes(rows,currentId){
    const root={kind:'root',folderId:null,stack:[]};if(currentId===null)return[root];
    const byId=new Map(rows.map(f=>[Number(f.id),f])),ids=[],seen=new Set();let id=Number(currentId);
    while(id){if(seen.has(id)||!byId.has(id))throw Error('Некорректная структура папок');seen.add(id);ids.unshift(id);id=Number(byId.get(id).parent_id)}
    return[root,...ids.map((folderId,index)=>({kind:'folder',folderId,stack:[null,...ids.slice(0,index)]}))];
  }
  const api={destinations,destinationCount,mutationAllowed,folderRoutes};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.ArchiveFolderMove=api;
})(typeof globalThis!=='undefined'?globalThis:this);
