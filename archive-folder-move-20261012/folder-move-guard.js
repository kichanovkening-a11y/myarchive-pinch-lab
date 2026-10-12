/* Embedded in HEAD before the unchanged production application starts. */
(function(){
  const nativeFetch=window.fetch.bind(window);
  window.fetch=function(input,init={}){
    const raw=typeof input==='string'||input instanceof URL?String(input):input.url;
    const url=new URL(raw,location.href),method=(init.method||input?.method||'GET').toUpperCase();
    if(!['GET','HEAD'].includes(method)&&!window.ArchiveFolderMove?.mutationAllowed(url.href,method,location.origin))return Promise.reject(Error('В этой тестовой версии доступен только перенос папок. Основной архив защищён.'));
    return nativeFetch(input,init);
  };
  if(navigator.sendBeacon){const nativeBeacon=navigator.sendBeacon.bind(navigator);navigator.sendBeacon=function(url,data){const target=new URL(url,location.href);if(target.origin===location.origin&&target.pathname.startsWith('/api/'))return false;return nativeBeacon(url,data)}}
})();
