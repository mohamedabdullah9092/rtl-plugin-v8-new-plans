const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
 const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const page = await browser.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1});
 await page.setContent('<html><body style="margin:0;background:#0c0c0c"><canvas width="1280" height="720"></canvas></body></html>');
 await page.exposeFunction('saveVideo', data => fs.writeFileSync(path.join(__dirname,'RTL-Master-promo.webm'),Buffer.from(data,'base64')));
 await page.evaluate(async () => {
  await document.fonts.ready;
  const c=document.querySelector('canvas'),x=c.getContext('2d');
  const scenes=[['RTL MASTER','تصميمك. بلغات أكثر.','أدوات التعريب داخل Figma'],['MIRROR & TRANSLATE','من اليسار إلى اليمين؟ اعكسها.','اعكس التصميم وترجم النصوص في خطوة واحدة'],['TRANSLATE ONLY','ترجم النصوص','اختر لغة المصدر واللغة المطلوبة'],['MIRROR ONLY','غيّر الاتجاه','اعكس التخطيط مع الاحتفاظ بالنصوص'],['SMART SWITCH','مكوّنات تناسب اللغة','استخدم الـVariant الموافق للغة عند توفره'],['CREATE AS VARIANT','احتفظ بالأصل','أنشئ Variant للتصميم بالاتجاه الجديد'],['FONT CHANGER','الخط المناسب يصنع الفرق','غيّر الخطوط واضبط الأوزان'],['RTL MASTER','جاهز لتصميمك القادم؟','جرّب RTL Master داخل Figma']];
  function round(a,b,w,h,r,color){x.fillStyle=color;x.beginPath();x.roundRect(a,b,w,h,r);x.fill();}
  function text(s,a,b,size,color='#f5f5f5',align='right'){x.font=`600 ${size}px "Segoe UI",Arial`;x.textAlign=align;x.fillStyle=color;x.fillText(s,a,b);}
  function draw(t){
   const i=Math.min(7,Math.floor(t/5)),p=(t%5)/5,sc=scenes[i];x.globalAlpha=1;x.fillStyle='#0c0c0c';x.fillRect(0,0,1280,720);
   const glow=x.createRadialGradient(230,450,10,230,450,640);glow.addColorStop(0,'#123b2c');glow.addColorStop(1,'#0c0c0c');x.fillStyle=glow;x.fillRect(0,0,1280,720);
   text('RTL / MASTER',64,62,22,'#14f195','left');text('FIGMA PLUGIN',1216,62,14,'#8a8a8a');
   x.globalAlpha=Math.min(1,p*9,(1-p)*12);text(sc[0],1210,200,18,'#14f195');text(sc[1],1210,268,42);text(sc[2],1210,325,23,'#a9b3ad');
   round(62,153,510,410,24,'#171b19');round(82,173,470,43,12,'#242b27');text(i===0||i===7?'RTL Master':'Design workspace',104,201,16,'#cad5ce','left');
   const rtl=i!==0&&i!==3&&(p>.30||i>3),a=rtl?522:112,align=rtl?'right':'left';
   round(rtl?470:112,244,52,52,16,'#14f195');text('↔',rtl?496:138,278,29,'#0c0c0c','center');
   text(rtl?'مرحبًا بتصميمك القادم':'Your next great design',a,346,27,'#ffffff',align);
   text(rtl?'تجربة أجمل. تفاصيل أوضح.':'Better experiences. Thoughtful details.',a,383,17,'#9aaba1',align);
   round(rtl?362:112,421,160,44,22,'#14f195');text(rtl?'ابدأ الآن':'Get started',rtl?442:192,450,18,'#0c0c0c','center');
   round(112,499,410,8,4,'#303a34');round(112,521,310,8,4,'#303a34');
   if(i===4){round(680,385,530,95,18,'#18241d');text('Language = Arabic',1185,443,27,'#14f195');}
   if(i===5){round(680,385,250,95,18,'#202420');round(950,385,260,95,18,'#183b29');text('Original',805,441,23,'#bfc8c2','center');text('RTL Variant',1080,441,23,'#14f195','center');}
   if(i===6){text('Aa → أبجد',1190,445,48,'#14f195');}
   if(i===7){round(680,390,530,70,35,'#14f195');text('mohamed9092.gumroad.com/l/rtl',945,435,23,'#0c0c0c','center');}
   x.globalAlpha=1;text('عرض توضيحي متحرك للوظائف',64,633,14,'#79857d','left');text(`${i+1} / 8`,1210,633,16,'#8a9a90');round(64,674,1152,3,2,'#26332b');round(64,674,1152*Math.min(t/40,1),3,2,'#14f195');
  }
  draw(0.8);
  window.draw=draw;
  const stream=c.captureStream(30),type=MediaRecorder.isTypeSupported('video/webm;codecs=vp9')?'video/webm;codecs=vp9':'video/webm';
  const recorder=new MediaRecorder(stream,{mimeType:type,videoBitsPerSecond:6000000}),chunks=[];
  recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
  window.finished=new Promise(resolve=>{recorder.onstop=async()=>{const blob=new Blob(chunks,{type});const reader=new FileReader();reader.onload=async()=>{await window.saveVideo(reader.result.split(',')[1]);resolve(true)};reader.readAsDataURL(blob)};});
  recorder.start();const start=performance.now();const timer=setInterval(()=>{const t=(performance.now()-start)/1000;draw(Math.min(t,39.8));if(t>=40){clearInterval(timer);recorder.stop();}},1000/30);
 });
 await page.waitForTimeout(1800);
 await page.screenshot({path:path.join(__dirname,'preview.png')});
 await page.evaluate(()=>window.finished);
 await browser.close();console.log('Video saved: outputs/promo/RTL-Master-promo.webm');
})().catch(e=>{console.error(e);process.exitCode=1});
