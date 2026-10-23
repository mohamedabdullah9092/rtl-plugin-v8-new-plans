const fs=require('fs'),vm=require('vm');let s=fs.readFileSync('index.html','utf8');const start=s.indexOf('const ARABIC_UI = '),end=s.indexOf("let currentUiLanguage = 'en';",start);const dict=vm.runInNewContext(s.slice(start,end)+'\nARABIC_UI');Object.assign(dict,{
'Smart Switch Components':'اختيار Component حسب اللغة',
'Use the language variants you already designed.':'استخدم Variants التي جهّزتها لكل لغة.',
'Switch to a variant matching your target language while keeping the instance linked.':'تختار الإضافة Variant المناسب للغة مع الحفاظ على ارتباط Instance بـ Main Component.',
'Keep size, state, and compatible text and icon overrides.':'تحافظ على المقاس والحالة، وعلى Overrides للنصوص والأيقونات متى كانت متوافقة.',
'About Smart Switch Components':'كيف تختار الإضافة Component المناسب للغة؟',
'Switch components to a matching variant in the target language when available, while keeping their component connection.':'تستخدم Variant المناسب للغة، إن كان متاحًا، مع الحفاظ على ارتباط Instance بـ Main Component.',
'Mirror Main Components':'عكس Main Components',
'Create or reuse a mirrored target variant, arrange it beside its source, then swap the local nested instance to it.':'تنشئ Variant معكوسًا أو تستخدم واحدًا موجودًا، وتضعه بجانب Main Component، ثم تربط به Instance داخل التصميم.',
'Create as Variant':'إنشاء Variant جديد',
'Creates a new variant instead of modifying the selection. Select a single component or instance to use this.':'تحفظ النتيجة في Variant جديد بدل تعديل التصميم الحالي. لاستخدام هذا الخيار، حدّد Component واحدًا أو Instance واحدًا.',
'No frame selected':'لم تحدّد أي Frame',
'Select a frame or layer to mirror layouts and translate text.':'حدّد Frame أو Layer في Figma لبدء عكس التصميم وترجمة النصوص.',
'Unlimited mirrors, AI translations & smart variants.':'اعكس التصاميم بلا حدود، وترجم بالذكاء الاصطناعي، واستخدم Variants المناسبة للغة.',
'Smart Variants':'Variants المناسبة للغة',
'This is your primary action. It mirrors the layout of your selected frames and translates the text using powerful AI.':'اضغط هنا لعكس اتجاه Frames المحدّدة وترجمة النصوص داخلها.',
'Instead of modifying your design, you can create a new component variant with the mirrored and translated content. Perfect for component libraries!':'يمكنك حفظ النتيجة في Variant جديد بدل تعديل التصميم الأصلي. يفيدك ذلك عند تجهيز مكتبة Components بأكثر من لغة.',
"You're ready to master RTL design. Select a frame and give it a try!":'حدّد Frame في Figma وجرّب الإضافة.',
'Variables':'Variables','Variable':'Variable','Component':'Component','Components':'Components','Variant':'Variant','Variants':'Variants','Instance':'Instance','Instances':'Instances','Frame':'Frame','Frames':'Frames','Layer':'Layer','Layers':'Layers','Auto Layout':'Auto Layout','Component Set':'Component Set','Text Styles':'Text Styles','Overrides':'Overrides'
});s=s.slice(0,start)+'const ARABIC_UI = '+JSON.stringify(dict,null,2)+';\n'+s.slice(end);
// Isolate established Figma terms so mixed Arabic/English phrases keep their reading order.
s=s.replace("function uiText(value) { return currentUiLanguage === 'ar' && typeof value === 'string' ? (ARABIC_UI[value] ?? value.replace(/^Translating (\\d+)\\/(\\d+)\\.\\.\\.$/, 'جارٍ الترجمة: $1 من $2')) : value; }",`function uiText(value) {\n  if (currentUiLanguage !== 'ar' || typeof value !== 'string') return value;\n  const text = ARABIC_UI[value] ?? value.replace(/^Translating (\\d+)\\/(\\d+)\\.\\.\\.$/, 'جارٍ الترجمة: $1 من $2');\n  return text.replace(/\\b(?:Main Components?|Component Set|Auto Layout|Text Styles|Variables?|Components?|Variants?|Instances?|Frames?|Layers?|Overrides)\\b/g, term => '\\u2066' + term + '\\u2069');\n}`);
s=s.replace("function changeUiLanguage(language, persist = true) {",`let uiDirectionResetFrame;\nfunction changeUiLanguage(language, persist = true) {\n  // Direction changes must never sweep the off-canvas drawer through the viewport.\n  cancelAnimationFrame(uiDirectionResetFrame);\n  document.documentElement.classList.add('ui-direction-changing');`);
s=s.replace("document.documentElement.dir = currentUiLanguage === 'ar' ? 'rtl' : 'ltr';",`document.documentElement.dir = currentUiLanguage === 'ar' ? 'rtl' : 'ltr';\n  uiDirectionResetFrame = requestAnimationFrame(() => {\n    void document.documentElement.offsetWidth;\n    uiDirectionResetFrame = requestAnimationFrame(() => document.documentElement.classList.remove('ui-direction-changing'));\n  });`);
s=s.replace('</style>',`    /* Suppress only direction-change motion; normal drawer open/close still animates. */\n    html.ui-direction-changing .app-menu-drawer { transition: none !important; }\n    html.ui-direction-changing .app-menu-drawer[data-state="closed"] { visibility: hidden !important; }\n    @media (prefers-reduced-motion: reduce) { .app-menu-drawer { transition: none !important; } }\n</style>`);
fs.writeFileSync('index.html',s);require('esbuild').transformSync(s.match(/<script type="text\/babel"[^>]*>([\s\S]*?)<\/script>/)[1],{loader:'jsx'});console.log('Updated terminology and direction transition; syntax OK');
