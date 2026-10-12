(function(root){
  function createSearchState(fetchPage,onResult,onError=()=>{}){
    let generation=0,controller=null,query='',filters={},items=[],next=null,busy=false;
    function clear(){generation++;controller?.abort();controller=null;query='';filters={};items=[];next=null;busy=false}
    async function run(offset,append){
      if(busy)return;busy=true;const token=generation;controller=new AbortController();
      try{
        const data=await fetchPage(query,offset,controller.signal,filters);
        if(token!==generation)return;
        items=append?items.concat(data.items):data.items;next=data.has_more?data.next_offset:null;
        onResult({...data,items:items.slice()});
      }catch(error){if(token===generation&&error.name!=='AbortError')onError(error)}
      finally{if(token===generation)busy=false}
    }
    return {clear,search(q,dateFilters={}){clear();query=q.trim();filters={...dateFilters};return query||filters.dateFrom||filters.dateTo?run(0,false):Promise.resolve()},more(){return next!==null?run(next,true):Promise.resolve()}};
  }
  if(typeof module==='object'&&module.exports)module.exports={createSearchState};
  else root.ArchiveSearchState={createSearchState};
})(typeof globalThis!=='undefined'?globalThis:this);
