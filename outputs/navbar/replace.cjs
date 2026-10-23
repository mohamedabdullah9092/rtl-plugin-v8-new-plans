const fs=require('fs');
let h=fs.readFileSync('index.html','utf8');
h=h.replace(/    #root \.top-icon-button \{\r?\n[\s\S]*?(?=    #root \.user-controls \{\r?\n)/,`    /* Figma nabv 1083:6981: native 257 x 44 geometry. */
    #root .plugin-header-card { position: relative; align-self: flex-end; display: flex; flex-direction: row; align-items: center; justify-content: space-between; flex: 0 0 auto; width: 257px; max-width: calc(100% - 16px); height: 44px; margin: 16px 8px 0; direction: ltr; border-radius: 60px !important; corner-shape: round; padding: 4px; box-sizing: border-box; background: #161616; border: 0; overflow: visible; }
    #root .plugin-header-card > .flex:first-child { position: static; z-index: 2; }
    #root .plugin-account-status:empty { display: none; }
    #root .relative > .brand-mark { display: none !important; }
    #root .brand-mark { corner-shape: round !important; width: 36px; height: 36px; overflow: hidden; display: flex; align-items: center; justify-content: center; flex: none; background: #202020; border-radius: 100px; }
    #root .plugin-header-card .top-icon-button { color: #CCCCCC; cursor: pointer; }
    #root .plugin-header-card .top-icon-button:disabled { cursor: default; }
    #root .plugin-header-card .navbar-icon { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; flex: none; }
    #root .plugin-header-card .navbar-icon-menu { transform: scaleX(-1); }
`);
for(const [name,file,w,ht,cls] of [['LanguageIcon','language',17.9167,17.9167,''],['FigmaSettingsIcon','settings',17.9162,17.9162,''],['FigmaInboxIcon','menu',14.584,12.916,' navbar-icon-menu']]){
 const uri='data:image/svg+xml;base64,'+fs.readFileSync('assets/navbar/'+file+'.svg').toString('base64');
 const replacement=`const ${name} = () => React.createElement("span", { className: "navbar-icon${cls}", "aria-hidden": "true" }, React.createElement("img", { src: ${JSON.stringify(uri)}, width: ${w}, height: ${ht}, alt: "", className: "block", style: { flexShrink: 0 } }));`;
 h=h.replace(new RegExp('const '+name+' = [^\\r\\n]*'),replacement);
}
h=h.replace('plugin-header-card flex items-center justify-between gap-3 mx-2 mt-4 p-4 bg-brand-surface rounded-xl border border-brand-border flex-shrink-0','plugin-header-card');
fs.writeFileSync('index.html',h);
const js=h.match(/<script type="text\/babel"[^>]*>([\s\S]*?)<\/script>/)[1];
require('esbuild').transformSync(js,{loader:'js'});
console.log('Navbar updated; application JavaScript syntax valid.');
