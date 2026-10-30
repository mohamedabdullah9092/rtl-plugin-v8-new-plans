const PLUGIN_VERSION = 'tracking-2026-07-25';
let activeOperation = null;
let lastCompletedOperationId = null;
const operationMessages = new Set(['text-nodes-found', 'progress-update', 'translation-progress', 'action-complete', 'plugin-error']);
const SMART_SWITCH_ANNOUNCEMENT_KEY = 'rtl-master:announcement:smart-switch-components:v1';

// A local dictionary for common UX terms to provide instant, high-quality translations for them.
// The structure supports multiple target languages, with English as the source of truth.
const uxDictionary = {
    "Arabic": {
        // Standalone dashboard labels use natural Arabic noun phrases.
        // Keep complete phrases here; adding ال to arbitrary words breaks grammar.
        "Details": "التفاصيل",
        "Distance": "المسافة",
        "Altitude": "الارتفاع",
        "Progress": "التقدّم",
        "Waypoints": "نقاط المسار",
        "Departure Point": "نقطة الانطلاق",
        "Arrival Point": "نقطة الوصول",
        "Submit": "إرسال",
        "Cancel": "إلغاء",
        "Save": "حفظ",
        "Edit": "تعديل",
        "Delete": "حذف",
        "Next": "التالي",
        "Back": "رجوع",
        "Confirm": "تأكيد",
        "Apply": "تطبيق",
        "Close": "إغلاق",
        "OK": "موافق",
        "Learn More": "معرفة المزيد",
        "View All": "عرض الكل",
        "Create New": "إنشاء جديد",
        "Add to Cart": "إضافة إلى السلة",
        "Sign In": "تسجيل الدخول",
        "Sign Up": "التسجيل",
        "Log Out": "تسجيل الخروج",
        "Search": "بحث",
        "Filter": "تصفية",
        "Sort": "فرز",
        "Share": "مشاركة",
        "Print": "طباعة",
        "Download": "تنزيل",
        "Upload": "رفع",
        "Refresh": "تحديث",
        "Undo": "تراجع",
        "Redo": "إعادة",
        "Copy": "نسخ",
        "Paste": "لصق",
        "Cut": "قص",
        "Select All": "تحديد الكل",
        "Clear": "مسح",
        "Reset": "إعادة تعيين",
        "Help": "مساعدة",
        "Feedback": "ملاحظات",
        "Contact Us": "اتصل بنا",
        "Settings": "الإعدادات",
        "Preferences": "تفضيلات",
        "Account": "الحساب",
        "Profile": "الملف الشخصي",
        "Dashboard": "لوحة التحكم",
        "Home": "الرئيسية",
        "Notifications": "الإشعارات",
        "Messages": "الرسائل",
        "Favorites": "المفضلة",
        "Bookmark": "إشارة مرجعية",
        "Pin": "تثبيت",
        "Follow": "متابعة",
        "Unfollow": "إلغاء المتابعة",
        "Like": "إعجاب",
        "Unlike": "إلغاء الإعجاب",
        "Comment": "تعليق",
        "Reply": "رد",
        "Send": "إرسال",
        "Receive": "استلام",
        "Attach": "إرفاق",
        "Browse": "تصفح",
        "Explore": "استكشاف",
        "Discover": "اكتشاف",
        "Get Started": "ابدأ الآن",
        "Install": "تثبيت",
        "Uninstall": "إلغاء التثبيت",
        "Update": "تحديث",
        "Upgrade": "ترقية",
        "Downgrade": "تخفيض",
        "Activate": "تفعيل",
        "Deactivate": "إلغاء التفعيل",
        "Enable": "تمكين",
        "Disable": "تعطيل",
        "Toggle": "تبديل",
        "On": "تشغيل",
        "Off": "إيقاف",
        "Mute": "كتم الصوت",
        "Unmute": "إلغاء كتم الصوت",
        "Play": "تشغيل",
        "Pause": "إيقاف مؤقت",
        "Stop": "إيقاف",
        "Record": "تسجيل",
        "Fast Forward": "تقديم سريع",
        "Rewind": "إرجاع",
        "Skip": "تخطي",
        "Loop": "تكرار",
        "Shuffle": "خلط",
        "Repeat": "تكرار",
        "Volume Up": "رفع الصوت",
        "Volume Down": "خفض الصوت",
        "Maximize": "تكبير",
        "Minimize": "تصغير",
        "Restore Down": "استعادة للأسفل",
        "Close Window": "إغلاق النافذة",
        "Open": "فتح",
        "New": "جديد",
        "Save As": "حفظ باسم",
        "Print Preview": "معاينة الطباعة",
        "Exit": "خروج",
        "Quit": "إنهاء",
        "Menu": "قائمة",
        "Sidebar": "الشريط الجانبي",
        "Navbar": "شريط التنقل",
        "Footer": "تذييل",
        "Header": "رأس",
        "Breadcrumbs": "تتبع المسار",
        "Tab": "علامة تبويب",
        "Accordion": "قائمة منسدلة",
        "Carousel": "عرض دوار",
        "Pagination": "ترقيم الصفحات",
        "Scroll": "تمرير",
        "Expand": "توسيع",
        "Collapse": "طي",
        "Drag and Drop": "سحب وإفلات",
        "Resize": "تغيير الحجم",
        "Zoom In": "تكبير العرض",
        "Zoom Out": "تصغير العرض",
        "Full Screen": "ملء الشاشة",
        "Exit Full Screen": "الخروج من ملء الشاشة",
        "Group By": "تجميع حسب",
        "Sort By": "فرز حسب",
        "Filter By": "تصفية حسب",
        "Search Results": "نتائج البحث",
        "No Results Found": "لا توجد نتائج",
        "Loading...": "جاري التحميل...",
        "Please Wait": "الرجاء الانتظار",
        "Error": "خطأ",
        "Success": "نجاح",
        "Warning": "تحذير",
        "Info": "معلومات",
        "Danger": "خطر",
        "Primary": "أساسي",
        "Secondary": "ثانوي",
        "Default": "افتراضي",
        "Active": "نشط",
        "Inactive": "غير نشط",
        "Hover": "تحويم",
        "Focus": "تركيز",
        "Selected": "محدد",
        "Disabled": "معطل",
        "Read Only": "للقراءة فقط",
        "Required": "مطلوب",
        "Optional": "اختياري",
        "Placeholder": "نص توضيحي",
        "Label": "تسمية",
        "Hint": "تلميح",
        "Tooltip": "تلميح الأدوات",
        "Popover": "نافذة منبثقة",
        "Modal": "نافذة مشروطة",
        "Dialog": "مربع حوار",
        "Alert": "تنبيه",
        "Toast": "إشعار عابر",
        "Snackbar": "شريط إشعارات",
        "Progress Bar": "شريط التقدم",
        "Spinner": "مؤشر تحميل",
        "Skeleton Screen": "شاشة هيكلية",
        "Empty State": "حالة فارغة",
        "Offline": "غير متصل",
        "Online": "متصل",
        "Connected": "متصل",
        "Disconnected": "غير متصل",
        "Syncing": "تتم المزامنة",
        "Synced": "تمت المزامنة",
        "Out of Sync": "غير متزامن",
        "Pending": "قيد الانتظار",
        "Approved": "موافق عليه",
        "Rejected": "مرفوض",
        "Draft": "مسودة",
        "Published": "منشور",
        "Scheduled": "مجدول",
        "Archived": "مؤرشف",
        "Deleted": "محذوف",
        "Restored": "مستعاد",
        "Expired": "منتهي الصلاحية",
        "Valid": "صالح",
        "Invalid": "غير صالح",
        "Text Field": "حقل نص",
        "Password Field": "حقل كلمة المرور",
        "Email Field": "حقل البريد الإلكتروني",
        "Number Field": "حقل رقم",
        "Date Picker": "منتقي التاريخ",
        "Time Picker": "منتقي الوقت",
        "Dropdown": "قائمة منسدلة",
        "Select Box": "مربع اختيار",
        "Radio Button": "زر اختيار",
        "Checkbox": "مربع تحديد",
        "Slider": "شريط تمرير",
        "Stepper": "عداد",
        "Text Area": "منطقة نص",
        "File Upload": "تحميل ملف",
        "Captcha": "كابتشا",
        "Remember Me": "تذكرني",
        "Forgot Password": "هل نسيت كلمة المرور؟",
        "Confirm Password": "تأكيد كلمة المرور",
        "New Password": "كلمة مرور جديدة",
        "Current Password": "كلمة المرور الحالية",
        "Username": "اسم المستخدم",
        "Email Address": "عنوان البريد الإلكتروني",
        "Phone Number": "رقم الهاتف",
        "Address": "العنوان",
        "City": "المدينة",
        "State": "الولاية",
        "Zip Code": "الرمز البريدي",
        "Country": "البلد",
        "First Name": "الاسم الأول",
        "Last Name": "الاسم الأخير",
        "Full Name": "الاسم الكامل",
        "Company Name": "اسم الشركة",
        "Job Title": "المسمى الوظيفي",
        "Department": "القسم",
        "Website": "الموقع الإلكتروني",
        "URL": "رابط",
        "Bio": "نبذة",
        "Description": "وصف",
        "Subject": "الموضوع",
        "Message": "رسالة",
        "Quantity": "الكمية",
        "Price": "السعر",
        "Amount": "المبلغ",
        "Total": "الإجمالي",
        "Subtotal": "المجموع الفرعي",
        "Discount": "خصم",
        "Tax": "ضريبة",
        "Shipping": "الشحن",
        "Grand Total": "المجموع الكلي",
        "Coupon Code": "رمز الكوبون",
        "Promo Code": "رمز ترويجي",
        "Gift Card": "بطاقة هدية",
        "Payment Method": "طريقة الدفع",
        "Credit Card": "بطاقة ائتمان",
        "Debit Card": "بطاقة خصم",
        "PayPal": "باي بال",
        "Bank Transfer": "تحويل بنكي",
        "Cash on Delivery": "الدفع عند الاستلام",
        "Billing Address": "عنوان الفوترة",
        "Shipping Address": "عنوان الشحن",
        "Same as Billing": "نفس عنوان الفوترة",
        "Card Number": "رقم البطاقة",
        "Expiration Date": "تاريخ انتهاء الصلاحية",
        "CVV": "رمز CVV",
        "Cardholder Name": "اسم حامل البطاقة",
        "Security Code": "رمز الأمان",
        "Status": "الحالة",
        "Error Message": "رسالة خطأ",
        "Success Message": "رسالة نجاح",
        "Warning Message": "رسالة تحذير",
        "Info Message": "رسالة معلومات",
        "Loading Message": "رسالة تحميل",
        "Confirmation Message": "رسالة تأكيد",
        "Validation Message": "رسالة تحقق",
        "Required Field": "حقل مطلوب",
        "Invalid Input": "إدخال غير صالح",
        "Minimum Length": "الحد الأدنى للطول",
        "Maximum Length": "الحد الأقصى للطول",
        "Already Exists": "موجود بالفعل",
        "Not Found": "غير موجود",
        "Access Denied": "تم رفض الوصول",
        "Permission Denied": "تم رفض الإذن",
        "Session Expired": "انتهت الجلسة",
        "Network Error": "خطأ في الشبكة",
        "Server Error": "خطأ في الخادم",
        "Please Try Again": "يرجى المحاولة مرة أخرى",
        "Something Went Wrong": "حدث خطأ ما",
        "Your Changes Have Been Saved": "تم حفظ تغييراتك",
        "Item Added": "تم إضافة العنصر",
        "Item Removed": "تم إزالة العنصر",
        "Upload Complete": "اكتمل الرفع",
        "Download Complete": "اكتمل التنزيل",
        "Processing...": "جاري المعالجة...",
        "Connecting...": "جاري الاتصال...",
        "Updating...": "جاري التحديث...",
        "Deleting...": "جاري الحذف...",
        "Saving...": "جاري الحفظ...",
        "Sending...": "جاري الإرسال...",
        "Receiving...": "جاري الاستلام...",
        "Please Confirm": "يرجى التأكيد",
        "Are You Sure?": "هل أنت متأكد؟",
        "Unsaved Changes": "تغييرات غير محفوظة",
        "Data Lost": "فقدان البيانات",
        "Backup": "نسخة احتياطية",
        "Restore": "استعادة",
        "Export": "تصدير",
        "Import": "استيراد",
        "User Interface": "واجهة المستخدم",
        "User Experience": "تجربة المستخدم",
        "Usability": "سهولة الاستخدام",
        "Interaction Design": "تصميم التفاعل",
        "Information Architecture": "هندسة المعلومات",
        "Wireframe": "مخطط هيكلي",
        "Mockup": "نموذج وهمي",
        "Prototype": "نموذج أولي",
        "User Flow": "تدفق المستخدم",
        "Journey Map": "خريطة الرحلة",
        "Persona": "شخصية المستخدم",
        "User Story": "قصة المستخدم",
        "Use Case": "حالة الاستخدام",
        "A/B Testing": "اختبار أ/ب",
        "Heatmap": "خريطة حرارية",
        "Analytics": "تحليلات",
        "Metrics": "مقاييس",
        "KPI": "مؤشر الأداء الرئيسي",
        "Conversion Rate": "معدل التحويل",
        "Bounce Rate": "معدل الارتداد",
        "Session Duration": "مدة الجلسة",
        "Click-Through Rate": "نسبة النقر إلى الظهور",
        "Engagement": "التفاعل",
        "Retention": "الاستبقاء",
        "Onboarding": "الإعداد الأولي",
        "Offboarding": "إنهاء الخدمة",
        "Tutorial": "دليل إرشادي",
        "Walkthrough": "جولة توضيحية",
        "Guide": "دليل",
        "FAQ": "أسئلة متكررة",
        "Knowledge Base": "قاعدة المعرفة",
        "Support Center": "مركز الدعم",
        "Community Forum": "منتدى المجتمع",
        "Blog": "مدونة",
        "News": "أخبار",
        "Events": "فعاليات",
        "Terms of Service": "شروط الخدمة",
        "Copyright": "حقوق النشر",
        "Trademark": "علامة تجارية",
        "License": "ترخيص",
        "Version": "إصدار",
        "Build": "بناء",
        "Release Notes": "ملاحظات الإصدار",
        "Beta": "نسخة تجريبية",
        "Alpha": "نسخة أولية",
        "Stable": "مستقر",
        "Production": "الإنتاج",
        "Development": "تطوير",
        "Staging": "بيئة اختبار",
        "Local": "محلي",
        "Remote": "عن بعد",
        "Cloud": "سحابة",
        "On-Premise": "محلياً",
        "API": "واجهة برمجة التطبيقات",
        "SDK": "حزمة تطوير البرامج",
        "Plugin": "إضافة",
        "Extension": "امتداد",
        "Widget": "عنصر واجهة المستخدم",
        "Gadget": "أداة",
        "Theme": "سمة",
        "Skin": "مظهر",
        "Layout": "تخطيط",
        "Grid": "شبكة",
        "Flexbox": "صندوق مرن",
        "Responsive": "متجاوب",
        "Adaptive": "متكيف",
        "Mobile First": "الهاتف أولاً",
        "Desktop": "سطح المكتب",
        "Tablet": "جهاز لوحي",
        "Smartphone": "هاتف ذكي",
        "Wearable": "جهاز قابل للارتداء",
        "IoT": "إنترنت الأشياء",
        "VR": "الواقع الافتراضي",
        "AR": "الواقع المعزز",
        "AI": "الذكاء الاصطناعي",
        "Machine Learning": "تعلم الآلة",
        "Data": "بيانات",
        "Database": "قاعدة بيانات",
        "Server": "خادم",
        "Client": "عميل",
        "Frontend": "الواجهة الأمامية",
        "Backend": "الواجهة الخلفية",
        "Fullstack": "تطوير شامل",
        "DevOps": "ديف أوبس",
        "Agile": "رشيق",
        "Scrum": "سكروم",
        "Kanban": "كانبان",
        "Sprint": "سباق",
        "Standup": "اجتماع يومي",
        "Retrospective": "مراجعة",
        "Iteration": "تكرار",
        "Deployment": "نشر",
        "Rollback": "تراجع",
        "Bug": "خطأ برمجي",
        "Feature": "ميزة",
        "Enhancement": "تحسين",
        "Improvement": "تطوير",
        "Optimization": "تحسين الأداء",
        "Performance": "الأداء",
        "Scalability": "قابلية التوسع",
        "Security": "الأمان",
        "Reliability": "الموثوقية",
        "Maintenance": "صيانة",
        "Upgrade Path": "مسار الترقية",
        "Migration": "ترحيل",
        "Integration": "تكامل",
        "Customization": "تخصيص",
        "Personalization": "إضفاء الطابع الشخصي",
        "Configuration": "تكوين",
        "Options": "خيارات",
        "Defaults": "إعدادات افتراضية",
        "Advanced": "متقدم",
        "Basic": "أساسي",
        "Standard": "قياسي",
        "Premium": "مميز",
        "Shop Now": "تسوق الآن",
        "Checkout": "الدفع",
        "My Account": "حسابي",
        "View Details": "عرض التفاصيل",
        "Product Description": "وصف المنتج",
        "Continue Shopping": "متابعة التسوق",
        "Apply Coupon": "تطبيق الكوبون",
        "Remove Item": "إزالة المنتج",
        "Update Quantity": "تحديث الكمية",
        "Order Summary": "ملخص الطلب",
        "Place Order": "إتمام الطلب",
        "Secure Checkout": "دفع آمن",
        "Login": "تسجيل الدخول",
        "Register": "تسجيل",
        "My Orders": "طلباتي",
        "Address Book": "دفتر العناوين",
        "Change Password": "تغيير كلمة المرور",
        "Logout": "تسجيل الخروج",
        "Forgot Password?": "هل نسيت كلمة المرور؟",
        "Sale": "تخفيضات",
        "Limited Time Offer": "عرض لفترة محدودة",
        "Free Shipping": "شحن مجاني",
        "Bundle Deal": "صفقة حزمة",
        "Price Range": "نطاق السعر",
        "Brand": "الماركة",
        "Category": "الفئة",
        "Clear Filters": "مسح الفلاتر",
        "Apply Filters": "تطبيق الفلاتر",
        "Item Added to Cart": "تمت إضافة المنتج إلى السلة",
        "Order Confirmed": "تم تأكيد الطلب",
        "Shipping Update": "تحديث الشحن",
        "Welcome": "أهلاً وسهلاً",
        "Out of Stock": "نفد المخزون",
        "Low Stock": "مخزون قليل",
        "Write a Review": "اكتب مراجعة",
        "Submit Review": "إرسال المراجعة",
        "Customer Reviews": "مراجعات العملاء",
        "Star Rating": "تقييم بالنجوم",
        "Best Sellers": "الأكثر مبيعاً",
        "New Arrivals": "منتجات جديدة",
        "Featured Products": "منتجات مميزة",
        "Recommended for You": "موصى به لك",
        "Recently Viewed": "تمت مشاهدتها مؤخراً",
        "Quick View": "نظرة سريعة",
        "Shop by Category": "تسوق حسب الفئة",
        "Add to Wishlist": "أضف إلى قائمة الأمنيات",
        "Remove from Cart": "إزالة من السلة",
        "Proceed to Checkout": "المتابعة للدفع",
        "Order History": "سجل الطلبات",
        "Track Order": "تتبع الطلب",
        "Order Details": "تفاصيل الطلب",
        "Enter Promo Code": "أدخل الرمز الترويجي",
        "Create Account": "إنشاء حساب",
        "Edit Profile": "تعديل الملف الشخصي",
        "Manage Addresses": "إدارة العناوين",
        "Customer Support": "دعم العملاء",
        "Help Center": "مركز المساعدة",
        "About Us": "عنا",
        "Terms and Conditions": "الشروط والأحكام",
        "Privacy Policy": "سياسة الخصوصية",
        "Return Policy": "سياسة الإرجاع",
        "Size Guide": "دليل المقاسات",
        "Color Options": "خيارات الألوان",
        "Availability": "التوفر",
        "In Stock": "متوفر في المخزون",
        "Add to Favorites": "أضف إلى المفضلة",
        "My Wishlist": "قائمة أمنياتي",
        "Password": "كلمة المرور",
        "Last Name": "اسم العائلة",
        "Street Address": "عنوان الشارع",
        "State/Province": "الولاية/المقاطعة",
        "Zip/Postal Code": "الرمز البريدي",
        "Update Profile": "تحديث الملف الشخصي",
        "Save Changes": "حفظ التغييرات",
        "Back to Shop": "العودة إلى المتجر",
        "Continue": "متابعة",
        "Previous": "السابق",
        "Confirm Order": "تأكيد الطلب",
        "Order Placed Successfully": "تم تقديم الطلب بنجاح",
        "Thank You for Your Order": "شكراً لطلبك",
        "Your Order Number Is": "رقم طلبك هو",
        "Estimated Delivery": "التوصيل المتوقع",
        "Track Your Package": "تتبع شحنتك",
        "Return Item": "إرجاع المنتج",
        "Request Return": "طلب إرجاع",
        "Product Images": "صور المنتج",
        "Share Product": "مشاركة المنتج",
        "Similar Products": "منتجات مشابهة",
        "Customers Also Bought": "العملاء الذين اشتروا هذا اشتروا أيضاً",
        "Select Options": "اختر الخيارات",
        "Choose Size": "اختر المقاس",
        "Choose Color": "اختر اللون",
        "Availability Date": "تاريخ التوفر",
        "Pre-order": "طلب مسبق",
        "Backorder": "طلب مؤجل",
        "Add to Compare": "أضف للمقارنة",
        "Go to Cart": "اذهب إلى السلة",
        "Empty Cart": "سلة فارغة",
        "Your Cart is Empty": "سلتك فارغة",
        "Start Shopping": "ابدأ التسوق",
        "Popular Categories": "فئات شائعة",
        "All Categories": "جميع الفئات",
        "Featured Categories": "فئات مميزة",
        "Browse Products": "تصفح المنتجات",
        "Show More": "عرض المزيد",
        "Show Less": "عرض أقل",
        "Less Details": "تفاصيل أقل",
        "Download App": "تنزيل التطبيق",
        "Subscribe to Newsletter": "اشترك في النشرة الإخبارية",
        "Get Updates": "احصل على التحديثات",
        "Email Signup": "تسجيل البريد الإلكتروني",
        "Welcome Bonus": "مكافأة ترحيبية",
        "Exclusive Offers": "عروض حصرية",
        "Daily Deals": "عروض يومية",
        "Weekly Specials": "عروض أسبوعية خاصة",
        "Flash Sale": "تخفيضات سريعة",
        "Bestselling Products": "المنتجات الأكثر مبيعاً",
        "Clear Selection": "مسح التحديد",
        "Reset Filters": "إعادة تعيين الفلاتر",
        "Apply Changes": "تطبيق التغييرات",
        "Save for Later": "حفظ لوقت لاحق",
        "Continue as Guest": "المتابعة كضيف",
        "Guest Checkout": "الدفع كضيف",
        "Create an Account for Faster Checkout": "أنشئ حساباً لدفع أسرع",
        "Secure Payment": "دفع آمن",
        "Data Protection": "حماية البيانات",
        "Privacy Statement": "بيان الخصوصية",
        "Cookie Policy": "سياسة الكوكيز",
        "Site Map": "خريطة الموقع",
        "Language Selector": "محدد اللغة",
        "Currency Selector": "محدد العملة",
        "Region Selector": "محدد المنطقة",
        "Desktop Site": "موقع سطح المكتب",
        "Proceed to Payment": "المتابعة للدفع",
        "Edit Cart": "تعديل السلة",
        "Update Cart": "تحديث السلة",
        "Your Shopping Cart": "عربة التسوق الخاصة بك",
        "Items in Cart": "المنتجات في السلة",
        "Shipping Options": "خيارات الشحن",
        "Standard Shipping": "شحن عادي",
        "Express Shipping": "شحن سريع",
        "Free Standard Shipping": "شحن عادي مجاني",
        "Delivery Date": "تاريخ التسليم",
        "Recipient Name": "اسم المستلم",
        "Gift Message": "رسالة هدية",
        "Gift Wrapping": "تغليف الهدايا",
        "Add Gift Options": "إضافة خيارات الهدايا",
        "Remove Gift Options": "إزالة خيارات الهدايا",
        "Save Address": "حفظ العنوان",
        "Use This Address": "استخدام هذا العنوان",
        "New Address": "عنوان جديد",
        "Confirm Details": "تأكيد التفاصيل",
        "Payment Successful": "تم الدفع بنجاح",
        "Payment Failed": "فشل الدفع",
        "Try Again": "حاول مرة أخرى",
        "Contact Support": "اتصل بالدعم",
        "Return to Home": "العودة إلى الرئيسية",
        "Print Receipt": "طباعة الإيصال",
        "Download Invoice": "تنزيل الفاتورة",
        "Order Status": "حالة الطلب",
        "Processing": "قيد المعالجة",
        "Shipped": "تم الشحن",
        "Delivered": "تم التسليم",
        "Cancelled": "ملغى",
        "Refunded": "تم استرداد المبلغ",
        "Return Requested": "تم طلب الإرجاع",
        "Items Ordered": "المنتجات المطلوبة",
        "Shipping Information": "معلومات الشحن",
        "Billing Information": "معلومات الفوترة",
        "Payment Information": "معلومات الدفع",
        "Product ID": "معرف المنتج",
        "SKU": "رمز المنتج",
        "Availability Status": "حالة التوفر",
        "Ratings & Reviews": "التقييمات والمراجعات",
        "Write a Question": "اكتب سؤالاً",
        "Answer a Question": "أجب عن سؤال",
        "Ask the Community": "اسأل المجتمع",
        "Product Q&A": "أسئلة وأجوبة المنتج",
        "Share Your Experience": "شارك تجربتك",
        "Filter Reviews": "تصفية المراجعات",
        "Sort Reviews By": "فرز المراجعات حسب",
        "Most Recent": "الأحدث",
        "Highest Rated": "الأعلى تقييماً",
        "Lowest Rated": "الأقل تقييماً",
        "Helpful Reviews": "مراجعات مفيدة",
        "Verified Purchase": "شراء موثق",
        "Report Abuse": "الإبلاغ عن إساءة",
        "Was this review helpful?": "هل كانت هذه المراجعة مفيدة؟",
        "Yes": "نعم",
        "No": "لا",
        "Upload Photo": "تحميل صورة",
        "Add Video": "إضافة فيديو",
        "Your Review": "مراجعتك",
        "Overall Rating": "التقييم العام",
        "Nickname": "اسم مستعار",
        "Location": "الموقع",
        "Cancel Review": "إلغاء المراجعة",
        "My Reviews": "مراجعاتي",
        "Edit Review": "تعديل المراجعة",
        "Delete Review": "حذف المراجعة",
        "Recommended Products": "منتجات موصى بها",
        "Similar Items": "منتجات مشابهة",
        "Customers Who Bought This Also Bought": "العملاء الذين اشتروا هذا اشتروا أيضاً",
        "Frequently Bought Together": "غالباً ما يتم شراؤها معاً",
        "Product Specifications": "مواصفات المنتج",
        "Key Features": "الميزات الرئيسية",
        "Technical Details": "التفاصيل الفنية",
        "Dimensions": "الأبعاد",
        "Weight": "الوزن",
        "Material": "المادة",
        "Warranty": "الضمان",
        "User Manual": "دليل المستخدم",
        "Safety Information": "معلومات السلامة",
        "Care Instructions": "تعليمات العناية",
        "Product Origin": "منشأ المنتج",
        "Brand Story": "قصة العلامة التجارية",
        "About the Brand": "عن العلامة التجارية",
        "Shop by Brand": "تسوق حسب العلامة التجارية",
        "Brand Directory": "دليل العلامات التجارية",
        "Browse All Brands": "تصفح جميع العلامات التجارية",
        "Customer Service Chat": "دردشة خدمة العملاء",
        "Chat Now": "دردش الآن",
        "Send Message": "إرسال رسالة",
        "Message History": "سجل الرسائل",
        "My Messages": "رسائلي",
        "Notification Settings": "إعدادات الإشعارات",
        "SMS Notifications": "إشعارات الرسائل القصيرة",
        "Manage Notifications": "إدارة الإشعارات",
        "Email Subscription": "الاشتراك بالبريد الإلكتروني",
        "Newsletter Signup": "التسجيل في النشرة الإخبارية",
        "Get Our Newsletter": "احصل على نشرتنا الإخبارية",
        "Join Our Mailing List": "انضم إلى قائمتنا البريدية",
        "Follow Us": "تابعنا",
        "Social Media Links": "روابط وسائل التواصل الاجتماعي",
        "Facebook": "فيسبوك",
        "Instagram": "انستغرام",
        "Twitter": "تويتر",
        "Pinterest": "بينترست",
        "YouTube": "يوتيوب",
        "LinkedIn": "لينكد إن",
        "Read Our Blog": "اقرأ مدونتنا",
        "Latest Articles": "أحدث المقالات",
        "Browse Articles": "تصفح المقالات",
        "Gift Registry": "سجل الهدايا",
        "Create Registry": "إنشاء سجل",
        "Find Registry": "العثور على سجل",
        "Manage Registry": "إدارة السجل",
        "Add to Registry": "أضف إلى السجل",
        "Registry Details": "تفاصيل السجل",
        "Shipping to Registry": "الشحن إلى السجل",
        "Registry Settings": "إعدادات السجل",
        "Your Registries": "سجلاتك",
        "Gift Certificates": "شهادات الهدايا",
        "Balance Check": "التحقق من الرصيد",
        "Payment Options": "خيارات الدفع",
        "Saved Cards": "البطاقات المحفوظة",
        "Add New Card": "إضافة بطاقة جديدة",
        "Remove Card": "إزالة البطاقة",
        "Default Payment Method": "طريقة الدفع الافتراضية",
        "Card Holder Name": "اسم حامل البطاقة",
        "Installment Payments": "دفعات بالتقسيط",
        "Buy Now Pay Later": "اشترِ الآن وادفع لاحقاً",
        "Credit Limit": "حد الائتمان",
        "Available Credit": "الرصيد المتاح",
        "Payment History": "سجل الدفعات",
        "Statements": "كشوف الحساب",
        "Digital Wallet": "المحفظة الرقمية",
        "Apple Pay": "آبل باي",
        "Google Pay": "جوجل باي",
        "Samsung Pay": "سامسونج باي",
        "Click & Collect": "انقر واستلم",
        "Store Pickup": "الاستلام من المتجر",
        "Find a Store": "ابحث عن متجر",
        "Store Locator": "محدد مواقع المتاجر",
        "Pickup Location": "موقع الاستلام",
        "Pickup Time": "وقت الاستلام",
        "Ready for Pickup": "جاهز للاستلام",
        "Order Ready": "الطلب جاهز",
        "Collect Order": "استلم الطلب",
        "Pickup Instructions": "تعليمات الاستلام",
        "Return to Store": "الإرجاع إلى المتجر",
        "Exchange in Store": "الاستبدال في المتجر",
        "Loyalty Program": "برنامج الولاء",
        "Redeem Points": "استبدال النقاط",
        "My Rewards": "مكافآتي",
        "Loyalty Status": "حالة الولاء",
        "Membership Details": "تفاصيل العضوية",
        "Exclusive Member Benefits": "مزايا الأعضاء الحصرية",
        "Get a Referral Bonus": "احصل على مكافأة إحالة",
        "Your Referral Code": "رمز الإحالة الخاص بك",
        "Share Your Link": "شارك رابطك",
        "My Referrals": "إحالاتي",
        "Earn Rewards": "اكسب مكافآت",
        "Security Settings": "إعدادات الأمان",
        "Connected Accounts": "الحسابات المرتبطة",
        "Delete Account": "حذف الحساب",
        "Deactivate Account": "تعطيل الحساب",
        "Data & Privacy": "البيانات والخصوصية",
        "Download My Data": "تنزيل بياناتي",
        "Request Data Deletion": "طلب حذف البيانات",
        "Manage Preferences": "إدارة التفضيلات",
        "Cookie Preferences": "تفضيلات الكوكيز",
        "Personalization Settings": "إعدادات التخصيص",
        "Marketing Preferences": "تفضيلات التسويق",
        "Experience Survey": "استبيان التجربة",
        "Report a Bug": "الإبلاغ عن خطأ",
        "Suggest a Feature": "اقتراح ميزة",
        "Give Feedback": "قدم ملاحظاتك",
        "Tell Us What You Think": "أخبرنا رأيك",
        "Customer Satisfaction": "رضا العملاء",
        "Rate Your Experience": "قيّم تجربتك",
        "How Was Your Experience?": "كيف كانت تجربتك؟",
        "Submit Feedback": "إرسال الملاحظات",
        "Your Feedback Helps Us Improve": "ملاحظاتك تساعدنا على التحسين",
        "Troubleshooting": "استكشاف الأخطاء وإصلاحها",
        "System Status": "حالة النظام",
        "Maintenance Notice": "إشعار صيانة",
        "Scheduled Downtime": "وقت توقف مجدول",
        "Update Available": "تحديث متاح",
        "New Version": "إصدار جديد",
        "Get the Latest Version": "احصل على أحدث إصدار",
        "Compatible Devices": "الأجهزة المتوافقة",
        "Requirements": "المتطلبات",
        "Install Now": "تثبيت الآن",
        "Update Later": "تحديث لاحقاً",
        "About This App": "عن هذا التطبيق",
        "App Version": "إصدار التطبيق",
        "Licensing Information": "معلومات الترخيص",
        "Open Source Licenses": "تراخيص المصدر المفتوح",
        "Developer Contact": "اتصال المطور",
        "Report a Problem": "الإبلاغ عن مشكلة",
        "Send Logs": "إرسال السجلات",
        "Clear Cache": "مسح ذاكرة التخزين المؤقت",
        "Reset App": "إعادة تعيين التطبيق",
        "Restore Defaults": "استعادة الإعدادات الافتراضية",
        "Backup Data": "نسخ البيانات احتياطياً",
        "Sync Data": "مزامنة البيانات",
        "Theme Settings": "إعدادات المظهر",
        "Display Settings": "إعدادات العرض",
        "Accessibility Options": "خيارات الوصول",
        "High Contrast Mode": "وضع التباين العالي",
        "Voice Control": "التحكم الصوتي",
        "Magnifier": "المكبر",
        "Zoom Level": "مستوى التكبير",
        "Language & Region": "اللغة والمنطقة",
        "Select Language": "اختر اللغة",
        "Select Region": "اختر المنطقة",
        "Date Format": "تنسيق التاريخ",
        "Time Format": "تنسيق الوقت",
        "Number Format": "تنسيق الأرقام",
        "Measurement Units": "وحدات القياس",
        "Currency Symbol": "رمز العملة",
        "Decimal Separator": "فاصل عشري",
        "Thousand Separator": "فاصل الآلاف",
        "Default Country": "البلد الافتراضي",
        "Default Currency": "العملة الافتراضية",
        "Shipping Zones": "مناطق الشحن",
        "Delivery Options": "خيارات التوصيل",
        "International Shipping": "الشحن الدولي",
        "Domestic Shipping": "الشحن المحلي",
        "Expedited Shipping": "شحن معجل",
        "Same Day Delivery": "توصيل في نفس اليوم",
        "Next Day Delivery": "توصيل في اليوم التالي",
        "Delivery Window": "فترة التسليم",
        "Estimated Arrival": "وقت الوصول المتوقع",
        "Shipping Carrier": "شركة الشحن",
        "Tracking Number": "رقم التتبع",
        "Track Shipment": "تتبع الشحنة",
        "Delivery Status": "حالة التسليم",
        "Delivery Instructions": "تعليمات التسليم",
        "Leave at Door": "اتركها عند الباب",
        "Require Signature": "يتطلب توقيعاً",
        "Do Not Disturb": "عدم الإزعاج",
        "Safe Place": "مكان آمن",
        "Delivery Preferences": "تفضيلات التسليم",
        "Update Preferences": "تحديث التفضيلات",
        "Delivery Schedule": "جدول التسليم",
        "Change Delivery Date": "تغيير تاريخ التسليم",
        "Change Delivery Address": "تغيير عنوان التسليم",
        "Missed Delivery": "تسليم فائت",
        "Reschedule Delivery": "إعادة جدولة التسليم",
        "Parcel Locker": "خزانة الطرود",
        "Pickup Point": "نقطة استلام",
        "Collect from Store": "استلم من المتجر",
        "Returns & Exchanges": "الإرجاع والاستبدال",
        "Start a Return": "بدء عملية إرجاع",
        "Return Reason": "سبب الإرجاع",
        "Exchange Item": "استبدال المنتج",
        "Refund Options": "خيارات استرداد الأموال",
        "Store Credit": "رصيد المتجر",
        "Original Payment Method": "طريقة الدفع الأصلية",
        "Return Label": "ملصق الإرجاع",
        "Print Label": "طباعة الملصق",
        "Schedule Pickup": "جدولة الاستلام",
        "Drop Off Location": "موقع التسليم",
        "Return Status": "حالة الإرجاع",
        "Refund Processed": "تمت معالجة استرداد الأموال",
        "Exchange Shipped": "تم شحن الاستبدال",
        "Return Approved": "تمت الموافقة على الإرجاع",
        "Return Denied": "تم رفض الإرجاع",
        "Return Window": "فترة الإرجاع",
        "Eligibility for Return": "أهلية الإرجاع",
        "Non-Returnable Items": "المنتجات غير القابلة للإرجاع",
        "Final Sale": "البيع النهائي",
        "Warranty Information": "معلومات الضمان",
        "Product Support": "دعم المنتج",
        "Technical Assistance": "المساعدة الفنية",
        "Service Request": "طلب خدمة",
        "Repair Status": "حالة الإصلاح",
        "Parts & Accessories": "القطع والإكسسوارات",
        "Replacement Parts": "قطع الغيار",
        "Bundles": "حزم",
        "Complementary Products": "منتجات تكمeilية",
        "Cross-sell": "بيع متقاطع",
        "Up-sell": "بيع تكميلي",
        "Frequently Asked Questions": "الأسئلة المتكررة",
        "Popular Questions": "الأسئلة الشائعة",
        "Search FAQ": "البحث في الأسئلة الشائعة",
        "Browse Topics": "تصفح المواضيع",
        "Articles": "مقالات",
        "Tutorials": "دروس تعليمية",
        "Guides": "أدلة",
        "Video Guides": "أدلة فيديو",
        "User Forums": "منتديات المستخدمين",
        "Community Support": "دعم المجتمع",
        "Join the Community": "انضم إلى المجتمع",
        "Post a Question": "اطرح سؤالاً",
        "Browse Discussions": "تصفح المناقشات",
        "Top Contributors": "أبرز المساهمين",
        "Moderators": "المشرفون",
        "Report Post": "الإبلاغ عن مشاركة",
        "Privacy Settings": "إعدادات الخصوصية",
        "Data Sharing": "مشاركة البيانات",
        "Ad Preferences": "تفضيلات الإعلانات",
        "Personal Data": "البيانات الشخصية",
        "Right to Be Forgotten": "الحق في النسيان",
        "Data Access Request": "طلب الوصول إلى البيانات",
        "Data Rectification": "تصحيح البيانات",
        "Data Portability": "قابلية نقل البيانات",
        "Consent Management": "إدارة الموافقة",
        "Cookie Consent": "الموافقة على ملفات تعريف الارتباط",
        "Manage Cookies": "إدارة ملفات تعريف الارتباط",
        "Accept All Cookies": "قبول جميع ملفات تعريف الارتباط",
        "Reject All Cookies": "رفض جميع ملفات تعريف الارتباط",
        "Strictly Necessary Cookies": "ملفات تعريف الارتباط الضرورية جداً",
        "Performance Cookies": "ملفات تعريف الارتباط الخاصة بالأداء",
        "Functional Cookies": "ملفات تعريف الارتباط الوظيفية",
        "Targeting Cookies": "ملفات تعريف الارتباط للاستهداف",
        "Save Preferences": "حفظ التفضيلات",
        "About Cookies": "حول ملفات تعريف الارتباط",
        "Session Timeout": "انتهاء صلاحية الجلسة",
        "Keep Me Logged In": "ابقني مسجلاً للدخول",
        "Automatic Logout": "تسجيل الخروج التلقائي",
        "Idle Timeout": "مهلة الخمول",
        "Supported Browsers": "المتصفحات المدعومة",
        "Optimized for": "محسن لـ",
        "Best Viewed In": "أفضل عرض في",
        "Disable Ad Blocker": "تعطيل مانع الإعلانات",
        "Turn Off Ad Blocker": "أوقف تشغيل مانع الإعلانات",
        "Allow Pop-ups": "السماح بالنوافذ المنبثقة",
        "Enable JavaScript": "تمكين جافا سكريبت",
        "Clear Browser Data": "مسح بيانات المتصفح",
        "Empty Cache": "إفراغ ذاكرة التخزين المؤقت",
        "Reload Page": "إعادة تحميل الصفحة",
        "Go Back": "العودة",
        "Go Forward": "التقدم",
        "Print Page": "طباعة الصفحة",
        "Save Page": "حفظ الصفحة",
        "Bookmark Page": "وضع إشارة مرجعية للصفحة",
        "Share Page": "مشاركة الصفحة",
        "Copy Link": "نسخ الرابط",
        "Zoom In/Out": "تكبير/تصغير",
        "Text Size": "حجم النص",
        "Page Layout": "تخطيط الصفحة",
        "Mobile Friendly": "متوافق مع الجوال",
        "Desktop View": "عرض سطح المكتب",
        "Tablet View": "عرض الجهاز اللوحي",
        "Mobile View": "عرض الجوال",
        "Processing Request": "معالجة الطلب",
        "Redirecting...": "جاري إعادة التوجيه...",
        "Page Not Found": "الصفحة غير موجودة",
        "Error 404": "خطأ 404",
        "Internal Server Error": "خطأ في الخادم الداخلي",
        "Error 500": "خطأ 500",
        "Bad Request": "طلب غير صالح",
        "Error 400": "خطأ 400",
        "Unauthorized": "غير مصرح به",
        "Error 401": "خطأ 401",
        "Forbidden": "ممنوع",
        "Error 403": "خطأ 403",
        "Service Unavailable": "الخدمة غير متاحة",
        "Error 503": "خطأ 503",
        "Connection Lost": "تم فقدان الاتصال",
        "No Internet Connection": "لا يوجد اتصال بالإنترنت",
        "Try Again Later": "حاول مرة أخرى لاحقاً",
        "An Unexpected Error Occurred": "حدث خطأ غير متوقع",
        "Report This Issue": "الإبلاغ عن هذه المشكلة",
        "Go to Home Page": "اذهب إلى الصفحة الرئيسية",
        "Contact Administrator": "اتصل بالمسؤول",
        "Your Session Has Expired": "انتهت صلاحية جلستك",
        "For Security Reasons": "لأسباب أمنية",
        "You Have Been Logged Out": "تم تسجيل خروجك",
        "Please Refresh the Page": "الرجاء تحديث الصفحة",
        "Invalid Email Format": "تنسيق بريد إلكتروني غير صالح",
        "Password Mismatch": "عدم تطابق كلمة المرور",
        "Password Too Short": "كلمة المرور قصيرة جداً",
        "Password Must Contain": "يجب أن تحتوي كلمة المرور على",
        "Invalid Credentials": "بيانات اعتماد غير صالحة",
        "User Not Found": "المستخدم غير موجود",
        "Email Already Registered": "البريد الإلكتروني مسجل بالفعل",
        "Username Taken": "اسم المستخدم محجوز",
        "Invalid Phone Number": "رقم هاتف غير صالح",
        "Invalid Date": "تاريخ غير صالح",
        "Invalid Time": "وقت غير صالح",
        "Invalid Amount": "مبلغ غير صالح",
        "Maximum Quantity": "الحد الأقصى للكمية",
        "Please Select an Option": "الرجاء اختيار خيار",
        "Please Enter a Value": "الرجاء إدخال قيمة",
        "Value Out of Range": "القيمة خارج النطاق",
        "File Too Large": "الملف كبير جداً",
        "Invalid File Type": "نوع ملف غير صالح",
        "Upload Failed": "فشل التحميل",
        "Download Failed": "فشل التنزيل",
        "Confirm Action": "تأكيد الإجراء",
        "Delete Confirmation": "تأكيد الحذف",
        "Discard Changes": "تجاهل التغييرات",
        "Save Changes First": "احفظ التغييرات أولاً",
        "Information": "معلومات",
        "Caution": "تنبيه",
        "Tip": "نصيحة",
        "New Feature": "ميزة جديدة",
        "Important Notice": "إشعار هام",
        "Announcement": "إعلان",
        "Maintenance Mode": "وضع الصيانة",
        "Coming Soon": "قريباً",
        "Beta Feature": "ميزة تجريبية",
        "Experimental": "تجريبي",
        "Feedback Welcome": "نرحب بملاحظاتكم",
        "Start Tour": "ابدأ الجولة",
        "Skip Tour": "تخطي الجولة",
        "Next Step": "الخطوة التالية",
        "Previous Step": "الخطوة السابقة",
        "Finish": "إنهاء",
        "Done": "تم",
        "Complete": "اكتمل",
        "Dismiss": "رفض",
        "Hide": "إخفاء",
        "Show": "إظهار",
        "Activate": "تنشيط",
        "Deactivate": "إلغاء التنشيط",
        "Custom": "مخصص",
        "Yes, I'm Sure": "نعم، أنا متأكد",
        "No, Cancel": "لا، إلغاء",
        "Course Catalog": "فهرس الدورات",
        "Enrollment": "التسجيل",
        "Student Dashboard": "لوحة تحكم الطالب",
        "Learning Path": "مسار التعلم",
        "Quiz": "اختبار قصير",
        "Assignment Submission": "تقديم الواجب",
        "Gradebook": "سجل الدرجات",
        "Instructor Profile": "ملف تعريف المدرب",
        "Discussion Forum": "منتدى النقاش",
        "Lecture Notes": "ملاحظات المحاضرة",
        "Study Material": "المادة الدراسية",
        "Progress Tracker": "متتبع التقدم",
        "Certificate of Completion": "شهادة الإتمام",
        "Course Prerequisites": "متطلبات الدورة",
        "Learning Objectives": "أهداف التعلم",
        "Virtual Classroom": "الفصل الدراسي الافتراضي",
        "Peer Review": "مراجعة الأقران",
        "Resource Library": "مكتبة الموارد",
        "Academic Calendar": "التقويم الأكاديمي",
        "Exam Schedule": "جدول الامتحانات",
        "Study Group": "مجموعة دراسية",
        "Tutoring Services": "خدمات الدروس الخصوصية",
        "Online Course": "دورة عبر الإنترنت",
        "Blended Learning": "التعلم المدمج",
        "Self-Paced Learning": "التعلم الذاتي",
        "Live Session": "جلسة مباشرة",
        "Recorded Lecture": "محاضرة مسجلة",
        "Interactive Exercise": "تمرين تفاعلي",
        "Learning Analytics": "تحليلات التعلم",
        "Performance Metrics": "مقاييس الأداء",
        "Skill Development": "تطوير المهارات",
        "Career Guidance": "التوجيه المهني",
        "Alumni Network": "شبكة الخريجين",
        "Student Support": "دعم الطلاب",
        "Announcements": "الإعلانات",
        "Course Search": "بحث الدورة",
        "Filter Options": "خيارات التصفية",
        "Course Details": "تفاصيل الدورة",
        "Confirmation": "تأكيد",
        "My Courses": "دوراتي",
        "Completed Courses": "الدورات المكتملة",
        "Upcoming Courses": "الدورات القادمة",
        "Wishlist": "قائمة الرغبات",
        "Course Rating": "تقييم الدورة",
        "Review": "مراجعة",
        "Instructor Rating": "تقييم المدرب",
        "Course Material Download": "تحميل مواد الدورة",
        "Offline Access": "الوصول دون اتصال",
        "Desktop Version": "نسخة سطح المكتب",
        "Accessibility Settings": "إعدادات الوصول",
        "Language Selection": "اختيار اللغة",
        "Profile Picture": "صورة الملف الشخصي",
        "Password Reset": "إعادة تعيين كلمة المرور",
        "Email Preferences": "تفضيلات البريد الإلكتروني",
        "Course Progress Bar": "شريط تقدم الدورة",
        "Module Completion": "إكمال الوحدة",
        "Lesson Status": "حالة الدرس",
        "Activity Log": "سجل الأنشطة",
        "Due Date": "تاريخ الاستحقاق",
        "Submission Status": "حالة التسليم",
        "Grade History": "سجل الدرجات",
        "Feedback from Instructor": "ملاحظات من المدرب",
        "Peer Feedback": "ملاحظات الأقران",
        "Group Project": "مشروع جماعي",
        "Collaborative Tool": "أداة تعاونية",
        "Whiteboard": "السبورة البيضاء",
        "Screen Sharing": "مشاركة الشاشة",
        "Chat Function": "وظيفة الدرشة",
        "Raise Hand": "رفع اليد",
        "Mute/Unmute": "كتم/إلغاء كتم الصوت",
        "Video On/Off": "تشغيل/إيقاف الفيديو",
        "Breakout Rooms": "غرف المجموعات",
        "Polls": "الاستطلاعات",
        "Q&A Session": "جلسة أسئلة وأجوبة",
        "Attendance Tracking": "تتبع الحضور",
        "Course Enrollment Key": "مفتاح التسجيل في الدورة",
        "Free Trial": "تجربة مجانية",
        "Subscription Plan": "خطة الاشتراك",
        "Premium Content": "محتوى مميز",
        "Certification Exam": "امتحان الشهادة",
        "Proctoring": "المراقبة",
        "Digital Badge": "شارة رقمية",
        "Transcript": "كشف الدرجات",
        "Academic Record": "السجل الأكاديمي",
        "Course Syllabus": "منهج الدورة",
        "Learning Outcomes": "مخرجات التعلم",
        "Recommended Courses": "الدورات الموصى بها",
        "Related Topics": "مواضيع ذات صلة",
        "Prerequisites Met": "المتطلبات الأساسية مستوفاة",
        "Skills Gained": "المهارات المكتسبة",
        "Time Spent Learning": "الوقت المستغرق في التعلم",
        "Practice Questions": "أسئلة تدريبية",
        "Flashcards": "البطاقات التعليمية",
        "Glossary": "مسرد المصطلحات",
        "Index": "فهرس",
        "References": "المراجع",
        "External Resources": "الموارد الخارجية",
        "Bookmark Lesson": "إشارة مرجعية للدرس",
        "Print Notes": "طباعة الملاحظات",
        "Share Progress": "مشاركة التقدم",
        "Invite Friends": "دعوة الأصدقاء",
        "Referral Program": "برنامج الإحالة",
        "Course Bundle": "حزمة دورات",
        "Scholarship Application": "طلب منحة دراسية",
        "Financial Aid": "المساعدة المالية",
        "Grant Opportunities": "فرص المنح",
        "Student Loan": "قرض طلابي",
        "Payment Plan": "خطة الدفع",
        "Receipt": "إيصال",
        "Tax Documents": "وثائق ضريبية",
        "Refund Policy": "سياسة الاسترجاع",
        "Withdrawal Policy": "سياسة الانسحاب",
        "Academic Integrity": "النزاهة الأكاديمية",
        "Plagiarism Checker": "مدقق الانتحال",
        "Citation Tool": "أداة الاقتباس",
        "Research Paper": "ورقة بحثية",
        "Thesis Submission": "تقديم الأطروحة",
        "Dissertation": "رسالة دكتوراه",
        "Capstone Project": "المشروع الختامي",
        "Portfolio": "حافظة الأعمال",
        "Resume Builder": "بناء السيرة الذاتية",
        "Interview Prep": "التحضير للمقابلة",
        "Job Board": "لوحة الوظائف",
        "Internship Opportunities": "فرص التدريب",
        "Career Fair": "معرض التوظيف",
        "Mentorship Program": "برنامج الإرشاد",
        "Networking Events": "فعاليات التواصل",
        "Professional Development": "التطوير المهني",
        "Continuing Education": "التعليم المستمر",
        "Lifelong Learning": "التعلم مدى الحياة",
        "Skill Assessment": "تقييم المهارات",
        "Competency Framework": "إطار الكفاءات",
        "Learning Plan": "خطة التعلم",
        "Individual Development Plan (IDP)": "خطة التطوير الفردي (IDP)",
        "Personal Learning Environment (PLE)": "بيئة التعلم الشخصية (PLE)",
        "Open Educational Resources (OER)": "الموارد التعليمية المفتوحة (OER)",
        "Digital Storytelling": "السرد الرقمي للقصص",
        "Gamification Elements": "عناصر اللعب",
        "Leaderboard": "لوحة المتصدرين",
        "Badges": "شارات",
        "Points": "نقاط",
        "Rewards": "مكافآت",
        "Streaks": "سلاسل إنجاز",
        "Challenges": "تحديات",
        "Levels": "مستويات",
        "Progress Visualizer": "مصور التقدم",
        "Learning Dashboard": "لوحة تحكم التعلم",
        "Instructor Dashboard": "لوحة تحكم المدرب",
        "Admin Dashboard": "لوحة تحكم المسؤول",
        "Report Generator": "مولد التقارير",
        "Data Export": "تصدير البيانات",
        "User Management": "إدارة المستخدمين",
        "Course Management": "إدارة الدورات",
        "Content Management": "إدارة المحتوى",
        "Enrollment Management": "إدارة التسجيل",
        "Grade Management": "إدارة الدرجات",
        "Communication Tools": "أدوات التواصل",
        "Collaboration Tools": "أدوات التعاون",
        "Assessment Tools": "أدوات التقييم",
        "Analytics Tools": "أدوات التحليلات",
        "Reporting Tools": "أدوات إعداد التقارير",
        "Integration Settings": "إعدادات التكامل",
        "API Access": "الوصول إلى API",
        "Webhooks": "خطافات الويب",
        "Single Sign-On (SSO)": "تسجيل الدخول الموحد (SSO)",
        "LDAP Integration": "تكامل LDAP",
        "SCORM Compliance": "توافق SCORM",
        "LTI Integration": "تكامل LTI",
        "Accessibility Standards": "معايير الوصول",
        "WCAG Compliance": "توافق WCAG",
        "Section 508 Compliance": "توافق القسم 508",
        "Data Encryption": "تشفير البيانات",
        "Secure Connection": "اتصال آمن",
        "Data Backup": "نسخ احتياطي للبيانات",
        "Disaster Recovery": "التعافي من الكوارث",
        "Uptime Guarantee": "ضمان وقت التشغيل",
        "Service Level Agreement (SLA)": "اتفاقية مستوى الخدمة (SLA)",
        "Terms of Use": "شروط الاستخدام",
        "Privacy Shield": "درع الخصوصية",
        "GDPR Compliance": "توافق اللائحة العامة لحماية البيانات (GDPR)",
        "FERPA Compliance": "توافق FERPA",
        "Student Data Privacy": "خصوصية بيانات الطلاب",
        "User Consent": "موافقة المستخدم",
        "Opt-in/Opt-out": "موافقة/إلغاء الاشتراك",
        "Manage Subscriptions": "إدارة الاشتراكات",
        "Sound Effects": "المؤثرات الصوتية",
        "Haptic Feedback": "الاستجابة اللمسية",
        "Visual Cues": "إشارات مرئية",
        "Loading Indicator": "مؤشر التحميل",
        "Progress Spinner": "مؤشر التقدم الدوار",
        "Placeholder Text": "نص العنصر النائب",
        "Modal Dialog": "مربع حوار مشروط",
        "Context Menu": "قائمة السياق",
        "Card View": "عرض البطاقات",
        "List View": "عرض القائمة",
        "Gallery View": "عرض المعرض",
        "Dark Theme": "السمة الداكنة",
        "Light Theme": "السمة الفاتحة",
        "Custom Theme": "سمة مخصصة",
        "Branding Options": "خيارات العلامة التجارية",
        "Logo Upload": "تحميل الشعار",
        "Color Palette": "لوحة الألوان",
        "Font Selection": "اختيار الخط",
        "Layout Options": "خيارات التخطيط",
        "Widget Settings": "إعدادات الودجت",
        "Dashboard Customization": "تخصيص لوحة التحكم",
        "Personalize Experience": "تخصيص التجربة",
        "Frequently Viewed": "شوهد بكثرة",
        "Recently Added": "أضيف مؤخراً",
        "Popular Courses": "الدورات الشائعة",
        "Trending Topics": "المواضيع الرائجة",
        "Editor's Pick": "اختيار المحرر",
        "Featured Courses": "الدورات المميزة",
        "Student Favorites": "مفضلات الطلاب",
        "Instructor Favorites": "مفضلات المدربين",
        "Course Collections": "مجموعات الدورات",
        "Skill Tracks": "مسارات المهارات",
        "Certification Programs": "برامج الشهادات",
        "Degree Programs": "برامج الدرجات العلمية",
        "Diploma Programs": "برامج الدبلوم",
        "Executive Education": "التعليم التنفيذي",
        "Corporate Training": "تدريب الشركات",
        "Professional Development Units (PDUs)": "وحدات التطوير المهني (PDUs)",
        "Continuing Professional Development (CPD)": "التطوير المهني المستمر (CPD)",
        "Mandatory Training": "تدريب إلزامي",
        "Compliance Training": "تدريب الامتثال",
        "Onboarding Training": "تدريب التأهيل",
        "Employee Training": "تدريب الموظفين",
        "Leadership Development": "تطوير القيادات",
        "Management Training": "تدريب الإدارة",
        "Sales Training": "تدريب المبيعات",
        "Technical Training": "تدريب تقني",
        "Software Training": "تدريب البرمجيات",
        "Product Training": "تدريب المنتج",
        "Customer Service Training": "تدريب خدمة العملاء",
        "Safety Training": "تدريب السلامة",
        "Health and Wellness Programs": "برامج الصحة والعافية",
        "Diversity and Inclusion Training": "تدريب التنوع والشمول",
        "Ethics Training": "تدريب الأخلاقيات",
        "Cybersecurity Awareness": "الوعي بالأمن السيبراني",
        "Data Protection Training": "تدريب حماية البيانات",
        "Remote Learning Best Practices": "أفضل ممارسات التعلم عن بعد",
        "Online Etiquette": "آداب التعامل عبر الإنترنت",
        "Digital Citizenship": "المواطنة الرقمية",
        "Media Literacy": "محو الأمية الإعلامية",
        "Information Literacy": "محو الأمية المعلوماتية",
        "Critical Thinking Skills": "مهارات التفكير النقدي",
        "Problem Solving Skills": "مهارات حل المشكلات",
        "Communication Skills": "مهارات التواصل",
        "Collaboration Skills": "مهارات التعاون",
        "Creativity Skills": "مهارات الإبداع",
        "Innovation Skills": "مهارات الابتكار",
        "Adaptability Skills": "مهارات التكيف",
        "Resilience Skills": "مهارات المرونة",
        "Time Management Skills": "مهارات إدارة الوقت",
        "Self-Discipline": "الانضباط الذاتي",
        "Motivation": "التحفيز",
        "Goal Setting": "تحديد الأهداف",
        "Study Habits": "عادات الدراسة",
        "Test-Taking Strategies": "استراتيجيات اجتياز الاختبارات",
        "Note-Taking Techniques": "تقنيات تدوين الملاحظات",
        "Active Listening": "الاستماع النشط",
        "Public Speaking": "الخطابة العامة",
        "Presentation Skills": "مهارات العرض التقديمي",
        "Research Skills": "مهارات البحث",
        "Data Analysis": "تحليل البيانات",
        "Report Writing": "كتابة التقارير",
        "Academic Writing": "الكتابة الأكاديمية",
        "Grant Writing": "كتابة طلبات المنح",
        "Proposal Writing": "كتابة المقترحات",
        "Technical Writing": "الكتابة التقنية",
        "Creative Writing": "الكتابة الإبداعية",
        "Storytelling": "سرد القصص",
        "Digital Marketing": "التسويق الرقمي",
        "Social Media Management": "إدارة وسائل التواصل الاجتماعي",
        "Content Creation": "إنشاء المحتوى",
        "Web Development": "تطوير الويب",
        "Mobile App Development": "تطوير تطبيقات الجوال",
        "Data Science": "علم البيانات",
        "Cloud Computing": "الحوسبة السحابية",
        "Cybersecurity": "الأمن السيبراني",
        "Project Management": "إدارة المشاريع",
        "Business Analytics": "تحليلات الأعمال",
        "Financial Modeling": "النمذجة المالية",
        "Entrepreneurship": "ريادة الأعمال",
        "Leadership": "القيادة",
        "Strategic Planning": "التخطيط الاستراتيجي",
        "Operations Management": "إدارة العمليات",
        "Human Resources": "الموارد البشرية",
        "Marketing Strategy": "استراتيجية التسويق",
        "Sales Management": "إدارة المبيعات",
        "Customer Relationship Management (CRM)": "إدارة علاقات العملاء (CRM)",
        "Supply Chain Management": "إدارة سلسلة التوريد",
        "Quality Assurance": "ضمان الجودة",
        "Risk Management": "إدارة المخاطر",
        "Change Management": "إدارة التغيير",
        "Organizational Development": "التطوير التنظيمي",
        "Conflict Resolution": "حل النزاعات",
        "Negotiation Skills": "مهارات التفاوض",
        "Team Building": "بناء الفريق",
        "Cross-Cultural Communication": "التواصل بين الثقافات",
        "Global Awareness": "الوعي العالمي",
        "Environmental Sustainability": "الاستدامة البيئية",
        "Social Responsibility": "المسؤولية الاجتماعية",
        "Ethical Decision Making": "اتخاذ القرارات الأخلاقية",
        "Equity": "المساواة",
        "Diversity": "التنوع",
        "Inclusion": "الشمول",
        "Universal Design for Learning (UDL)": "التصميم الشامل للتعلم (UDL)",
        "Assistive Technology": "التكنولوجيا المساعدة",
        "Dictation": "الإملاء",
        "Text-to-Speech": "تحويل النص إلى كلام",
        "Speech-to-Text": "تحويل الكلام إلى نص",
        "Alternative Text": "النص البديل",
        "Audio Descriptions": "وصف الصوت",
        "Sign Language Interpretation": "ترجمة لغة الإشارة",
        "Braille Output": "إخراج بطريقة برايل",
        "Tactile Graphics": "رسومات لمسية",
        "Large Print": "طباعة بخط كبير",
        "Color Contrast": "تباين الألوان",
        "Dyslexia-Friendly Fonts": "خطوط صديقة لعسر القراءة",
        "Readability Score": "درجة قابلية القراءة",
        "Read Aloud": "القراءة بصوت عالٍ",
        "Highlight Text": "تمييز النص",
        "Note Taking Tool": "أداة تدوين الملاحظات",
        "Annotation Tool": "أداة التعليقات التوضيحية",
        "Dictionary Lookup": "البحث في القاموس",
        "Thesaurus": "قاموس المرادفات",
        "Translation Tool": "أداة الترجمة",
        "Spell Checker": "مدقق إملائي",
        "Grammar Checker": "مدقق نحوي",
        "Citation Generator": "مولد الاقتباسات",
        "Reference Manager": "مدير المراجع",
        "Bibliography Builder": "باني المراجع",
        "Outline Generator": "مولد المخططات",
        "Mind Mapping Tool": "أداة رسم الخرائط الذهنية",
        "Concept Mapping Tool": "أداة رسم الخرائط المفاهيمية",
        "Diagramming Tool": "أداة الرسم التخطيطي",
        "Flowchart Maker": "صانع المخططات الانسيابية",
        "Presentation Software": "برنامج العروض التقديمية",
        "Spreadsheet Software": "برنامج جداول البيانات",
        "Word Processor": "معالج النصوص",
        "Database Management": "إدارة قواعد البيانات",
        "Statistical Software": "برنامج الإحصاء",
        "Coding Editor": "محرر الأكواد",
        "Integrated Development Environment (IDE)": "بيئة التطوير المتكاملة (IDE)",
        "Version Control System": "نظام التحكم في الإصدارات",
        "Project Management Software": "برنامج إدارة المشاريع",
        "Communication Platform": "منصة التواصل",
        "Video Conferencing Tool": "أداة مؤتمرات الفيديو",
        "Online Whiteboard": "السبورة البيضاء عبر الإنترنت",
        "File Sharing Service": "خدمة مشاركة الملفات",
        "Cloud Storage Service": "خدمة التخزين السحابي",
        "Learning Analytics Dashboard": "لوحة تحكم تحليلات التعلم",
        "Student Performance Report": "تقرير أداء الطالب",
        "Instructor Performance Report": "تقرير أداء المدرب",
        "Course Engagement Metrics": "مقاييس تفاعل الدورة",
        "Completion Rates": "معدلات الإكمال",
        "Drop-out Rates": "معدلات التسرب",
        "Retention Rates": "معدلات الاستبقاء",
        "Success Rates": "معدلات النجاح",
        "Learning Gains": "مكاسب التعلم",
        "Skill Proficiency Levels": "مستويات إتقان المهارة",
        "Competency Scores": "درجات الكفاءة",
        "Assessment Scores": "درجات التقييم",
        "Survey Results": "نتائج الاستبيان",
        "Feedback Analysis": "تحليل الملاحظات",
        "Sentiment Analysis": "تحليل المشاعر",
        "User Behavior Analytics": "تحليلات سلوك المستخدم",
        "Clickstream Data": "بيانات تدفق النقرات",
        "Heatmaps": "خرائط الحرارة",
        "User Testing": "اختبار المستخدم",
        "Usability Testing": "اختبار قابلية الاستخدام",
        "Accessibility Audit": "تدقيق إمكانية الوصول",
        "Security Audit": "تدقيق أمني",
        "Performance Audit": "تدقيق الأداء",
        "System Monitoring": "مراقبة النظام",
        "Error Logs": "سجلات الأخطاء",
        "Bug Reports": "تقارير الأخطاء",
        "Feature Requests": "طلبات الميزات",
        "User Stories": "قصص المستخدم",
        "Use Cases": "حالات الاستخدام",
        "Wireframes": "النماذج الهيكلية",
        "Mockups": "النماذج الأولية",
        "Prototypes": "النماذج التجريبية",
        "User Flows": "تدفقات المستخدم",
        "Content Strategy": "استراتيجية المحتوى",
        "UX Writing": "كتابة تجربة المستخدم",
        "Microcopy": "النص المصغر",
        "Call to Action (CTA)": "دعوة إلى اتخاذ إجراء (CTA)",
        "Navigation Menu": "قائمة التنقل",
        "Main Content Area": "منطقة المحتوى الرئيسية",
        "Hero Section": "قسم البطل",
        "Banner": "لافتة",
        "Tabs": "علامات التبويب",
        "Cards": "بطاقات",
        "List Items": "عناصر القائمة",
        "Table": "جدول",
        "Chart": "رسم بياني",
        "Graph": "مخطط",
        "Infographic": "رسم معلوماتي",
        "Illustration": "توضيح",
        "Iconography": "علم الأيقونات",
        "Typography": "فن الطباعة",
        "Color Scheme": "نظام الألوان",
        "Imagery": "الصور",
        "Animation": "الرسوم المتحركة",
        "Microinteractions": "التفاعلات الدقيقة",
        "Transitions": "الانتقالات",
        "Gestures": "الإيماءات",
        "Swiping": "التمرير",
        "Tapping": "النقر",
        "Pinching": "الضغط",
        "Zooming": "التكبير/التصغير",
        "Scrolling": "التمرير",
        "Dragging": "السحب",
        "Dropping": "الإفلات",
        "Hover State": "حالة التحويم",
        "Active State": "الحالة النشطة",
        "Focus State": "حالة التركيز",
        "Disabled State": "الحالة المعطلة",
        "Loading State": "حالة التحميل",
        "Empty State": "الحالة الفارغة",
        "Error State": "حالة الخطأ",
        "Success State": "حالة النجاح",
        "Warning State": "حالة التحذير",
        "Confirmation Dialog": "مربع حوار التأكيد",
        "Alert Message": "رسالة تنبيه",
        "Toast Notification": "إشعار توست",
        "Step Indicator": "مؤشر الخطوة",
        "Wizard": "معالج",
        "Onboarding Tour": "جولة تعريفية",
        "Hamburger Menu": "قائمة هامبرغر",
        "Mega Menu": "قائمة ميجا",
        "Sticky Header": "رأس ثابت",
        "Fixed Footer": "تذييل ثابت",
        "Scroll to Top": "العودة للأعلى",
        "Back Button": "زر الرجوع",
        "Forward Button": "زر التقديم",
        "Refresh Button": "زر التحديث",
        "Home Button": "زر الصفحة الرئيسية",
        "Search Button": "زر البحث",
        "Filter Button": "زر التصفية",
        "Sort Button": "زر الفرز",
        "Add Button": "زر الإضافة",
        "Edit Button": "زر التعديل",
        "Delete Button": "زر الحذف",
        "Save Button": "زر الحفظ",
        "Cancel Button": "زر الإلغاء",
        "Submit Button": "زر الإرسال",
        "Apply Button": "زر التطبيق",
        "Reset Button": "زر إعادة التعيين",
        "Clear Button": "زر المسح",
        "View Button": "زر العرض",
        "Print Button": "زر الطباعة",
        "Share Button": "زر المشاركة",
        "Download Button": "زر التنزيل",
        "Upload Button": "زر التحميل",
        "Export Button": "زر التصدير",
        "Import Button": "زر الاستيراد",
        "Copy Button": "زر النسخ",
        "Paste Button": "زر اللصق",
        "Cut Button": "زر القص",
        "Undo Button": "زر التراجع",
        "Redo Button": "زر الإعادة",
        "Play Button": "زر التشغيل",
        "Pause Button": "زر الإيقاف المؤقت",
        "Stop Button": "زر الإيقاف",
        "Next Button": "زر التالي",
        "Previous Button": "زر السابق",
        "Mute Button": "زر كتم الصوت",
        "Unmute Button": "زر إلغاء كتم الصوت",
        "Settings Button": "زر الإعدادات",
        "Help Button": "زر المساعدة",
        "Info Button": "زر المعلومات",
        "Close Button": "زر الإغلاق",
        "Dismiss Button": "زر الرفض",
        "OK Button": "زر موافق",
        "Yes Button": "زر نعم",
        "No Button": "زر لا",
        "Confirm Button": "زر التأكيد",
        "Reject Button": "زر الرفض",
        "Accept Button": "زر القبول",
        "Decline Button": "زر الرفض",
        "Proceed Button": "زر المتابعة",
        "Back to Top": "العودة إلى الأعلى",
        "Go to Dashboard": "اذهب إلى لوحة التحكم",
        "View Profile": "عرض الملف الشخصي",
        "Edit Settings": "تعديل الإعدادات",
        "Manage Account": "إدارة الحساب",
        "My Learning": "تعلمي",
        "My Progress": "تقدمي",
        "My Grades": "درجاتي",
        "My Assignments": "واجباتي",
        "My Quizzes": "اختباراتي القصيرة",
        "My Discussions": "مناقشاتي",
        "My Resources": "مواردي",
        "My Calendar": "تقويمي",
        "My Notifications": "إشعاراتي",
        "My Certificates": "شهاداتي",
        "My Badges": "شاراتي",
        "My Skills": "مهاراتي",
        "My Portfolio": "حافظة أعمالي",
        "My Applications": "طلباتي",
        "My Interviews": "مقابلاتي",
        "My Network": "شبكتي",
        "My Mentors": "مرشدي",
        "My Favorites": "مفضلاتي",
        "My Cart": "سلتي",
        "My Payments": "مدفوعاتي",
        "My Subscriptions": "اشتراكاتي",
        "My Activity Log": "سجل نشاطي",
        "Delivery Address": "عنوان التوصيل",
        "Search Restaurants": "البحث عن مطاعم",
        "Browse Menu": "تصفح القائمة",
        "Cuisine Type": "نوع المطبخ",
        "Restaurant Rating": "تقييم المطعم",
        "Delivery Time": "وقت التوصيل",
        "Special Instructions": "تعليمات خاصة",
        "Total Amount": "المبلغ الإجمالي",
        "Preparing Your Order": "جارٍ تحضير طلبك",
        "Out for Delivery": "في طريق التوصيل",
        "Rate Your Experience": "قيم تجربتك",
        "Leave a Review": "اترك تقييمًا",
        "Dietary Preferences": "التفضيلات الغذائية",
        "Vegetarian Options": "خيارات نباتية",
        "Vegan Options": "خيارات نباتية صرفة",
        "Gluten-Free": "خالي من الجلوتين",
        "Allergens": "مسببات الحساسية",
        "Contactless Delivery": "توصيل بدون تلامس",
        "Promotions": "عروض ترويجية",
        "Reorder": "إعادة الطلب",
        "Edit Order": "تعديل الطلب",
        "Cancel Order": "إلغاء الطلب",
        "Help & Support": "المساعدة والدعم",
        "Terms & Conditions": "الشروط والأحكام",
        "Change Location": "تغيير الموقع",
        "Current Location": "الموقع الحالي",
        "Popular Dishes": "أطباق شعبية",
        "Set as Default": "تعيين كافتراضي",
        "Add New Address": "إضافة عنوان جديد",
        "Customer Service": "خدمة العملاء",
        "Language": "اللغة",
        "Currency": "العملة",
        "Back to Home": "العودة إلى الصفحة الرئيسية",
        "Credit/Debit Card": "بطاقة ائتمان/خصم",
        "Delivery Fee": "رسوم التوصيل",
        "Service Fee": "رسوم الخدمة",
        "Discount Applied": "تم تطبيق الخصم",
        "Driver Details": "تفاصيل السائق",
        "Call Driver": "اتصل بالسائق",
        "Message Driver": "راسل السائق",
        "Need Assistance?": "هل تحتاج مساعدة؟",
        "Report an Issue": "الإبلاغ عن مشكلة",
        "View All Reviews": "عرض جميع التقييمات",
        "Filter by Rating": "التصفية حسب التقييم",
        "Sort by Popularity": "الترتيب حسب الشهرة",
        "Sort by Price": "الترتيب حسب السعر",
        "Sort by Delivery Time": "الترتيب حسب وقت التوصيل",
        "Remove from Favorites": "إزالة من المفضلة",
        "Share Restaurant": "مشاركة المطعم",
        "View Map": "عرض الخريطة",
        "Directions": "الاتجاهات",
        "Opening Hours": "ساعات العمل",
        "Closed Now": "مغلق الآن",
        "Open Now": "مفتوح الآن",
        "Preorder": "طلب مسبق",
        "Schedule Delivery": "جدولة التوصيل",
        "Pickup Options": "خيارات الاستلام",
        "Self-Pickup": "الاستلام الذاتي",
        "Table Booking": "حجز طاولة",
        "Book a Table": "احجز طاولة",
        "Select Date": "اختر التاريخ",
        "Select Time": "اختر الوقت",
        "Number of Guests": "عدد الضيوف",
        "Confirm Booking": "تأكيد الحجز",
        "Booking Confirmed": "تم تأكيد الحجز",
        "My Bookings": "حجوزاتي",
        "Cancel Booking": "إلغاء الحجز",
        "Modify Booking": "تعديل الحجز",
        "Restaurant Information": "معلومات المطعم",
        "Menu Categories": "فئات القائمة",
        "Add to Order": "أضف إلى الطلب",
        "Remove from Order": "إزالة من الطلب",
        "Item Quantity": "كمية العنصر",
        "Customize Item": "تخصيص العنصر",
        "Choose Your Sides": "اختر أطباقك الجانبية",
        "Extra Sauce": "صلصة إضافية",
        "No Onion": "بدون بصل",
        "Spicy Level": "مستوى الحرارة",
        "Mild": "معتدل",
        "Medium": "متوسط",
        "Hot": "حار",
        "Very Hot": "حار جداً",
        "Ingredient List": "قائمة المكونات",
        "Nutritional Information": "المعلومات الغذائية",
        "Calorie Count": "عدد السعرات الحرارية",
        "Popular Restaurants": "مطاعم شعبية",
        "New Restaurants": "مطاعم جديدة",
        "Restaurants Near Me": "مطاعم قريبة مني",
        "Filter by Price Range": "التصفية حسب النطاق السعري",
        "Filter by Cuisine": "التصفية حسب المطبخ",
        "Filter by Dietary Needs": "التصفية حسب الاحتياجات الغذائية",
        "Restaurant Details": "تفاصيل المطعم",
        "View Gallery": "عرض الصور",
        "Read Reviews": "قراءة التقييمات",
        "Submit Review": "إرسال التقييم",
        "Food Quality": "جودة الطعام",
        "Service Quality": "جودة الخدمة",
        "Delivery Quality": "جودة التوصيل",
        "Ambience": "الأجواء",
        "Report Review": "الإبلاغ عن تقييم",
        "Default Address": "العنوان الافتراضي",
        "Work Address": "عنوان العمل",
        "Home Address": "عنوان المنزل",
        "Add New Payment Method": "إضافة طريقة دفع جديدة",
        "Manage Payment Methods": "إدارة طرق الدفع",
        "Delete Card": "حذف البطاقة",
        "Set as Primary": "تعيين كأساسي",
        "Past Orders": "الطلبات السابقة",
        "Upcoming Orders": "الطلبات القادمة",
        "Order Again": "اطلب مرة أخرى",
        "View Receipt": "عرض الفاتورة",
        "Download Receipt": "تنزيل الفاتورة",
        "My Wallet": "محفظتي",
        "Top Up Wallet": "شحن المحفظة",
        "Transaction History": "سجل المعاملات",
        "Vouchers & Coupons": "قسائم وكوبونات",
        "Redeem Voucher": "استبدال قسيمة",
        "Referral Code": "رمز الإحالة",
        "Enter Code": "أدخل الرمز",
        "Invalid Code": "رمز غير صالح",
        "Successful": "ناجح",
        "Something went wrong": "حدث خطأ ما",
        "Retry": "إعادة المحاولة",
        "Mandatory Field": "حقل إلزامي",
        "Password Strength": "قوة كلمة المرور",
        "Weak": "ضعيف",
        "Good": "جيد",
        "Strong": "قوي",
        "Stay Logged In": "البقاء مسجلاً للدخول",
        "Update App": "تحديث التطبيق",
        "New Version Available": "يتوفر إصدار جديد",
        "Show Less": "إظهار أقل",
        "Back to Top": "العودة للأعلى",
        "Scroll Down": "مرر للأسفل",
        "Swipe Left": "اسحب لليسار",
        "Swipe Right": "اسحب لليمين",
        "Tap to Select": "اضغط للاختيار",
        "Long Press": "الضغط المطول",
        "Clear All": "مسح الكل",
        "Home": "الرئيسية",
        "About": "حول",
        "Contact": "اتصال",
        "Privacy": "الخصوصية",
        "Terms": "الشروط",
        "FAQ's": "الأسئلة الشائعة",
        "Support": "الدعم",
        "Log In": "تسجيل الدخول",
        "Guest User": "مستخدم ضيف",
        "enralled courses": "الدورات الملتحق بها",
        "Hello": "مرحباً",
        "Good Morning": "صباح الخير",
        "Good Afternoon": "مساء الخير",
        "Good Evening": "مساء الخير",
        "Are you sure?": "هل أنت متأكد؟",
        "Success!": "نجاح!",
        "Popular": "شائع",
        "Trending": "رائج",
        "Featured": "مميز",
        "On Sale": "تخفيضات",
        "Exclusive": "حصري",
        "Free Delivery": "توصيل مجاني",
        "Min. Order": "الحد الأدنى للطلب",
        "Delivery Fee Applies": "تطبق رسوم التوصيل",
        "Pickup Available": "الاستلام متاح",
        "Dine-in Available": "تناول الطعام في المطعم متاح",
        "Table Service": "خدمة الطاولة",
        "Self-Service": "خدمة ذاتية",
        "Takeaway": "طلبات خارجية",
        "Reservations Recommended": "ينصح بالحجز المسبق",
        "Walk-ins Welcome": "نرحب بالزوار بدون حجز",
        "Outdoor Seating": "مقاعد خارجية",
        "Indoor Seating": "مقاعد داخلية",
        "Pet Friendly": "صديق للحيوانات الأليفة",
        "Wheelchair Accessible": "يمكن الوصول إليه بالكراسي المتحركة",
        "Wi-Fi Available": "الواي فاي متاح",
        "Parking Available": "موقف سيارات متاح",
        "Kids Menu": "قائمة الأطفال",
        "Happy Hour": "ساعة السعادة",
        "Special Events": "مناسبات خاصة",
        "Catering Services": "خدمات الضيافة",
        "Gift Cards": "بطاقات الهدايا",
        "Purchase Gift Card": "شراء بطاقة هدية",
        "Check Balance": "التحقق من الرصيد",
        "Redeem Gift Card": "استبدال بطاقة الهدية",
        "My Points": "نقاطي",
        "Membership": "العضوية",
        "Upgrade Membership": "ترقية العضوية",
        "Manage Subscription": "إدارة الاشتراك",
        "Stay Connected": "ابق على اتصال",
        "Find Us On": "تجدنا على",
        "Social Media": "وسائل التواصل الاجتماعي",
        "TikTok": "تيك توك",
        "Add to Calendar": "أضف إلى التقويم",
        "Set Reminder": "تعيين تذكير",
        "Get Directions": "احصل على الاتجاهات",
        "Call Now": "اتصل الآن",
        "Email Us": "راسلنا بالبريد الإلكتروني",
        "View More": "عرض المزيد",
        "View Less": "عرض أقل",
        "Load More": "تحميل المزيد",
        "Try a Different Search": "جرب بحثًا مختلفًا",
        "Adjust Filters": "تعديل الفلاتر",
        "Refresh Page": "تحديث الصفحة",
        "Report Bug": "الإبلاغ عن خطأ",
        "How can we improve?": "كيف يمكننا التحسين؟",
        "Your Opinion Matters": "رأيك يهمنا",
        "Thank You": "شكراً لك",
        "Enjoy Your Meal": "استمتع بوجبتك",
        "Bon Appétit": "شهية طيبة",
        "Have a Great Day": "أتمنى لك يوماً رائعاً",
        "See You Soon": "نراك قريباً",
        "Come Back Soon": "عد قريباً",
        "Best Deals": "أفضل الصفقات",
        "Limited Stock": "كمية محدودة",
        "Sold Out": "نفدت الكمية",
        "Available Soon": "متوفر قريباً",
        "Pre-order Now": "اطلب مسبقاً الآن",
        "Your Wishlist": "قائمة أمنياتك",
        "Related Products": "منتجات ذات صلة",
        "Compare Items": "مقارنة العناصر",
        "Remove from Compare": "إزالة من المقارنة",
        "Compare Now": "قارن الآن",
        "Quantity Updated": "تم تحديث الكمية",
        "Price Updated": "تم تحديث السعر",
        "Choose an Option": "اختر خياراً",
        "Select Size": "اختر الحجم",
        "Select Color": "اختر اللون",
        "Choose Toppings": "اختر الإضافات",
        "Select Dressing": "اختر الصلصة",
        "Make it a Combo": "اجعلها وجبة",
        "Add Drink": "أضف مشروباً",
        "Add Side": "أضف طبقاً جانبياً",
        "Meal Deals": "عروض الوجبات",
        "Family Packs": "وجبات عائلية",
        "Party Platters": "أطباق الحفلات",
        "Catering Menu": "قائمة الضيافة",
        "Build Your Own": "اصنع وجبتك الخاصة",
        "Custom Order": "طلب مخصص",
        "Request a Quote": "طلب عرض سعر",
        "Get a Price": "احصل على السعر",
        "Estimated Cost": "التكلفة التقديرية",
        "Final Price": "السعر النهائي",
        "Inclusive of Taxes": "شامل الضرائب",
        "Exclusive of Taxes": "غير شامل الضرائب",
        "Taxes & Fees": "الضرائب والرسوم",
        "Payment Gateway": "بوابة الدفع",
        "Encrypted Connection": "اتصال مشفر",
        "Privacy Guarantee": "ضمان الخصوصية",
        "Verified by Visa": "تم التحقق بواسطة فيزا",
        "MasterCard SecureCode": "ماستركارد سكيور كود",
        "OTP Verification": "التحقق بكلمة المرور لمرة واحدة",
        "Enter OTP": "أدخل كلمة المرور لمرة واحدة",
        "Resend OTP": "إعادة إرسال كلمة المرور لمرة واحدة",
        "OTP Sent": "تم إرسال كلمة المرور لمرة واحدة",
        "Invalid OTP": "كلمة مرور لمرة واحدة غير صالحة",
        "Expiration Year": "سنة انتهاء الصلاحية",
        "Expiration Month": "شهر انتهاء الصلاحية",
        "Card Type": "نوع البطاقة",
        "Prepaid Card": "بطاقة مسبقة الدفع",
        "Voucher": "قسيمة",
        "Coupon": "كوبون",
        "Referral Bonus": "مكافأة إحالة",
        "Loyalty Points": "نقاط الولاء",
        "Points Balance": "رصيد النقاط",
        "Earn More Points": "اكسب المزيد من النقاط",
        "Membership Level": "مستوى العضوية",
        "Premium Member": "عضو مميز",
        "VIP Access": "وصول كبار الشخصيات",
        "Personalized Recommendations": "توصيات مخصصة",
        "My Preferences": "تفضيلاتي",
        "Manage Profile": "إدارة الملف الشخصي",
        "Reset Password": "إعادة تعيين كلمة المرور",
        "Verify Account": "التحقق من الحساب",
        "Account Verified": "تم التحقق من الحساب",
        "Verification Required": "التحقق مطلوب",
        "Send Verification Code": "إرسال رمز التحقق",
        "Enter Verification Code": "أدخل رمز التحقق",
        "Email Verification": "التحقق من البريد الإلكتروني",
        "Phone Verification": "التحقق من الهاتف",
        "Enable 2FA": "تفعيل المصادقة الثنائية",
        "Disable 2FA": "تعطيل المصادقة الثنائية",
        "Security Questions": "أسئلة الأمان",
        "Answer Security Question": "أجب عن سؤال الأمان",
        "Change Security Question": "تغيير سؤال الأمان",
        "Device Management": "إدارة الأجهزة",
        "Logged In Devices": "الأجهزة المسجلة للدخول",
        "Remove Device": "إزالة الجهاز",
        "Auto Log Out": "تسجيل الخروج التلقائي",
        "Keep Me Logged In": "أبقني مسجلاً للدخول",
        "Manage Notifications": "إدارة الإشعارات",
        "Enable Notifications": "تفعيل الإشعارات",
        "Disable Notifications": "تعطيل الإشعارات",
        "Notification Sound": "صوت الإشعار",
        "Vibration": "اهتزاز",
        "Mute Notifications": "كتم الإشعارات",
        "Unmute Notifications": "إلغاء كتم الإشعارات",
        "App Permissions": "أذونات التطبيق",
        "Grant Permission": "منح الإذن",
        "Deny Permission": "رفض الإذن",
        "Location Access": "الوصول إلى الموقع",
        "Camera Access": "الوصول إلى الكاميرا",
        "Microphone Access": "الوصول إلى الميكروفون",
        "Storage Access": "الوصول إلى التخزين",
        "Contacts Access": "الوصول إلى جهات الاتصال",
        "Manage Permissions": "إدارة الأذونات",
        "Review Permissions": "مراجعة الأذونات",
        "Permission Granted": "تم منح الإذن"
    }
};
// Remove presentation-only wrappers so dictionary lookup works for labels such
// as "صلاة الجماعة", (صلاة الجماعة), and “صلاة الجماعة”.
function normalizeDictionaryWrapper(text) {
    if (typeof text !== 'string') return '';
    let value = text.trim().replace(/\s+/g, ' ');
    const pairs = [['"', '"'], ["'", "'"], ['“', '”'], ['‘', '’'], ['(', ')'], ['[', ']'], ['{', '}'], ['<', '>']];
    let changed = true;
    while (changed && value.length > 1) {
        changed = false;
        const withoutOuterPunctuation = value.replace(/^[.,!?؛،؟:;]+|[.,!?؛،؟:;]+$/g, '').trim();
        if (withoutOuterPunctuation !== value) {
            value = withoutOuterPunctuation;
            changed = true;
            continue;
        }
        for (const [open, close] of pairs) {
            if (value.startsWith(open) && value.endsWith(close)) {
                value = value.slice(open.length, value.length - close.length).trim();
                changed = true;
                break;
            }
        }
    }
    return value.toLowerCase();
}

// Normalizes Arabic text to handle common script variations for more robust matching.
function normalizeArabic(text) {
    if (typeof text !== 'string') return '';

    // Step 1: Pre-process the entire string to remove punctuation.
    const textWithoutPunctuation = text.replace(/[.,/#!$%^&*;:{}=\-_`~()?؟،]/g, '');


    const normalizeWord = (word) => {
        // Step 2: Perform character-level normalization.
        let normalizedWord = word
            // Remove diacritics (Tashkeel)
            .replace(/[\u064B-\u0652]/g, '')
            // Remove Tatweel (letter elongation)
            .replace(/\u0640/g, '')
            // Standardize Alef forms (أ, إ, آ -> ا)
            .replace(/[أإآ]/g, 'ا')
            // Standardize Hamza on carriers (ؤ -> و, ئ -> ي)
            .replace(/ؤ/g, 'و')
            .replace(/ئ/g, 'ي')
            // Standardize Ta Marbuta (ة -> ه)
            .replace(/ة/g, 'ه')
            // Standardize Alef Maqsura (ى -> ي)
            .replace(/ى/g, 'ي');

        // Step 3: Prefix stripping.
        if (normalizedWord.startsWith('وال')) {
            normalizedWord = normalizedWord.substring(3);
        } else if (normalizedWord.startsWith('فال')) {
            normalizedWord = normalizedWord.substring(3);
        } else if (normalizedWord.startsWith('ال')) {
            normalizedWord = normalizedWord.substring(2);
        }

        // Step 4: Suffix stripping.
        const suffixes = ['كم', 'هم', 'ها', 'نا', 'ك', 'ه', 'ي'];
        for (const suffix of suffixes) {
            if (normalizedWord.endsWith(suffix)) {
                const stem = normalizedWord.slice(0, -suffix.length);
                if (stem.length >= 2) {
                    normalizedWord = stem;
                    break;
                }
            }
        }
        return normalizedWord;
    };

    // Step 5: Process each word in the cleaned text.
    return textWithoutPunctuation.split(/\s+/).map(normalizeWord).join(' ');
}


function getDictionaryHints(text, fromLanguage, toLanguage) {
    if (typeof text !== 'string' || fromLanguage !== 'en' || !enToLangLookup[toLanguage]) return [];
    const normalizedText = text.trim().replace(/\s+/g, ' ').toLowerCase();
    const hints = [];
    for (const [source, translation] of Object.entries(enToLangLookup[toLanguage])) {
        if (source.length < 3 || source === normalizedText) continue;
        const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (new RegExp(`(^|\\s|[.,!?():-])${escaped}(?=$|\\s|[.,!?():-])`, 'i').test(normalizedText)) {
            hints.push(`${source} → ${translation}`);
            if (hints.length >= 8) break;
        }
    }
    return hints;
}

// BEGIN GENERATED EXTRA DICTIONARY
// Generated from ux-dictionary-extra.json; run npm run build:dictionary.
const extraUxDictionary = {
  "Arabic": {
    "Design System": "نظام التصميم",
    "Design Tokens": "رموز التصميم",
    "Design Principles": "مبادئ التصميم",
    "Foundations": "الأسس",
    "Component Library": "مكتبة المكونات",
    "Components": "المكونات",
    "Component": "المكوّن",
    "Variants": "الحالات البديلة",
    "Properties": "الخصائص",
    "Documentation": "التوثيق",
    "Guidelines": "الإرشادات",
    "Getting Started": "البدء",
    "Usage": "الاستخدام",
    "Examples": "أمثلة",
    "Best Practices": "أفضل الممارسات",
    "Accessibility": "إمكانية الوصول",
    "Keyboard Navigation": "التنقل بلوحة المفاتيح",
    "Screen Reader": "قارئ الشاشة",
    "Focus Indicator": "مؤشر التركيز",
    "Color Contrast": "تباين الألوان",
    "Typography": "الطباعة",
    "Font Family": "عائلة الخط",
    "Font Size": "حجم الخط",
    "Font Weight": "وزن الخط",
    "Line Height": "ارتفاع السطر",
    "Letter Spacing": "تباعد الأحرف",
    "Text Alignment": "محاذاة النص",
    "Heading": "عنوان",
    "Subheading": "عنوان فرعي",
    "Body Text": "النص الأساسي",
    "Caption": "نص توضيحي",
    "Placeholder": "نص إرشادي",
    "Helper Text": "نص مساعد",
    "Error Message": "رسالة خطأ",
    "Color Palette": "لوحة الألوان",
    "Primary Color": "اللون الأساسي",
    "Secondary Color": "اللون الثانوي",
    "Accent Color": "لون التمييز",
    "Background Color": "لون الخلفية",
    "Text Color": "لون النص",
    "Border Color": "لون الحدود",
    "Surface": "السطح",
    "Light Mode": "الوضع الفاتح",
    "Dark Mode": "الوضع الداكن",
    "System Default": "الإعداد الافتراضي للنظام",
    "Spacing": "التباعد",
    "Padding": "المسافة الداخلية",
    "Margin": "المسافة الخارجية",
    "Gap": "الفاصل",
    "Layout": "التخطيط",
    "Grid": "الشبكة",
    "Columns": "الأعمدة",
    "Rows": "الصفوف",
    "Container": "الحاوية",
    "Breakpoint": "نقطة التحول",
    "Responsive": "متجاوب",
    "Border Radius": "نصف قطر الزوايا",
    "Border Width": "سُمك الحدود",
    "Shadow": "الظل",
    "Elevation": "مستوى الارتفاع",
    "Opacity": "العتامة",
    "Iconography": "نظام الأيقونات",
    "Icon Size": "حجم الأيقونة",
    "Animation": "الرسوم المتحركة",
    "Transition": "الانتقال",
    "Duration": "المدة",
    "Default": "افتراضي",
    "Hover": "مرور المؤشر",
    "Pressed": "مضغوط",
    "Focused": "في حالة تركيز",
    "Disabled": "معطّل",
    "Enabled": "مفعّل",
    "Selected": "محدّد",
    "Unselected": "غير محدّد",
    "Checked": "مؤشّر عليه",
    "Unchecked": "غير مؤشّر عليه",
    "Indeterminate": "تحديد جزئي",
    "Read Only": "للقراءة فقط",
    "Required": "مطلوب",
    "Optional": "اختياري",
    "Small": "صغير",
    "Medium": "متوسط",
    "Large": "كبير",
    "Extra Small": "صغير جدًا",
    "Extra Large": "كبير جدًا",
    "Button": "الزر",
    "Primary Button": "الزر الأساسي",
    "Secondary Button": "الزر الثانوي",
    "Icon Button": "زر أيقونة",
    "Text Field": "حقل نصي",
    "Text Area": "حقل نص متعدد الأسطر",
    "Checkbox": "مربع اختيار",
    "Radio Button": "زر اختيار",
    "Toggle": "مفتاح تبديل",
    "Dropdown": "قائمة منسدلة",
    "Combobox": "حقل اختيار قابل للبحث",
    "Date Picker": "منتقي التاريخ",
    "Time Picker": "منتقي الوقت",
    "Slider": "شريط تمرير",
    "Range Slider": "شريط تحديد نطاق",
    "Stepper": "مؤشر الخطوات",
    "Tabs": "علامات التبويب",
    "Accordion": "قائمة قابلة للطي",
    "Tooltip": "تلميح",
    "Popover": "نافذة عائمة",
    "Modal": "نافذة منبثقة",
    "Drawer": "لوحة جانبية",
    "Toast": "إشعار سريع",
    "Banner": "شريط تنبيه",
    "Badge": "شارة",
    "Avatar": "الصورة الرمزية",
    "Breadcrumbs": "مسار التنقل",
    "Pagination": "ترقيم الصفحات",
    "Progress Bar": "شريط التقدم",
    "Loading Spinner": "مؤشر التحميل",
    "Skeleton": "عنصر مؤقت للتحميل",
    "Empty State": "حالة فارغة",
    "Data Table": "جدول بيانات",
    "Navigation Menu": "قائمة التنقل",
    "Sidebar": "الشريط الجانبي",
    "Toolbar": "شريط الأدوات",
    "Dashboard": "لوحة التحكم",
    "Overview": "نظرة عامة",
    "Analytics": "التحليلات",
    "Insights": "الرؤى",
    "Reports": "التقارير",
    "Activity": "النشاط",
    "Recent Activity": "النشاط الأخير",
    "Activity Log": "سجل النشاط",
    "Audit Log": "سجل التدقيق",
    "Notifications": "الإشعارات",
    "Messages": "الرسائل",
    "Inbox": "صندوق الوارد",
    "Favorites": "المفضلة",
    "Quick Actions": "الإجراءات السريعة",
    "Shortcuts": "الاختصارات",
    "Settings": "الإعدادات",
    "Preferences": "التفضيلات",
    "Workspace": "مساحة العمل",
    "Organization": "المؤسسة",
    "Team": "الفريق",
    "Members": "الأعضاء",
    "Invite Members": "دعوة أعضاء",
    "Pending Invitations": "الدعوات المعلّقة",
    "Roles": "الأدوار",
    "Permissions": "الصلاحيات",
    "Access Control": "التحكم في الوصول",
    "Administrator": "المسؤول",
    "Owner": "المالك",
    "Editor": "محرر",
    "Viewer": "مشاهد",
    "Account Settings": "إعدادات الحساب",
    "Profile Settings": "إعدادات الملف الشخصي",
    "Security": "الأمان",
    "Privacy": "الخصوصية",
    "Two-Factor Authentication": "المصادقة الثنائية",
    "Connected Accounts": "الحسابات المرتبطة",
    "Active Sessions": "الجلسات النشطة",
    "Integrations": "التكاملات",
    "API Keys": "مفاتيح API",
    "Billing": "الفوترة",
    "Subscription": "الاشتراك",
    "Current Plan": "الباقة الحالية",
    "Billing Cycle": "دورة الفوترة",
    "Payment Method": "طريقة الدفع",
    "Billing History": "سجل الفواتير",
    "Invoices": "الفواتير",
    "Invoice Number": "رقم الفاتورة",
    "Due Date": "تاريخ الاستحقاق",
    "Subtotal": "المجموع الفرعي",
    "Tax": "الضريبة",
    "Discount": "الخصم",
    "Total Amount": "المبلغ الإجمالي",
    "Amount Due": "المبلغ المستحق",
    "Paid": "مدفوع",
    "Unpaid": "غير مدفوع",
    "Overdue": "متأخر عن السداد",
    "Refunded": "تم استرداد المبلغ",
    "Transactions": "المعاملات",
    "Transaction ID": "معرّف المعاملة",
    "Revenue": "الإيرادات",
    "Total Revenue": "إجمالي الإيرادات",
    "Recurring Revenue": "الإيرادات المتكررة",
    "Monthly Recurring Revenue": "الإيرادات الشهرية المتكررة",
    "Annual Recurring Revenue": "الإيرادات السنوية المتكررة",
    "Net Profit": "صافي الربح",
    "Gross Profit": "إجمالي الربح",
    "Profit Margin": "هامش الربح",
    "Expenses": "المصروفات",
    "Budget": "الميزانية",
    "Cash Flow": "التدفق النقدي",
    "Sales": "المبيعات",
    "Total Sales": "إجمالي المبيعات",
    "Orders": "الطلبات",
    "Average Order Value": "متوسط قيمة الطلب",
    "Customers": "العملاء",
    "New Customers": "العملاء الجدد",
    "Returning Customers": "العملاء العائدون",
    "Customer Retention": "الاحتفاظ بالعملاء",
    "Churn Rate": "معدل فقد العملاء",
    "Customer Lifetime Value": "القيمة الدائمة للعميل",
    "Acquisition Cost": "تكلفة الاستحواذ",
    "Conversion Rate": "معدل التحويل",
    "Growth Rate": "معدل النمو",
    "Active Users": "المستخدمون النشطون",
    "New Users": "المستخدمون الجدد",
    "Total Users": "إجمالي المستخدمين",
    "Sessions": "الجلسات",
    "Page Views": "مشاهدات الصفحة",
    "Unique Visitors": "الزوار الفريدون",
    "Bounce Rate": "معدل الارتداد",
    "Engagement Rate": "معدل التفاعل",
    "Average Session Duration": "متوسط مدة الجلسة",
    "Traffic Sources": "مصادر الزيارات",
    "Organic Search": "البحث المجاني",
    "Direct Traffic": "الزيارات المباشرة",
    "Referral Traffic": "زيارات الإحالة",
    "Campaigns": "الحملات",
    "Impressions": "مرات الظهور",
    "Clicks": "النقرات",
    "Click-Through Rate": "نسبة النقر إلى الظهور",
    "Cost Per Click": "تكلفة النقرة",
    "Return on Ad Spend": "العائد على الإنفاق الإعلاني",
    "Performance": "الأداء",
    "Key Metrics": "المؤشرات الرئيسية",
    "Key Performance Indicators": "مؤشرات الأداء الرئيسية",
    "Target": "الهدف",
    "Actual": "الفعلي",
    "Forecast": "التوقعات",
    "Trend": "الاتجاه العام",
    "Comparison": "المقارنة",
    "Compared to Previous Period": "مقارنة بالفترة السابقة",
    "Previous Period": "الفترة السابقة",
    "Current Period": "الفترة الحالية",
    "Date Range": "النطاق الزمني",
    "Custom Range": "نطاق مخصص",
    "Today": "اليوم",
    "Yesterday": "أمس",
    "This Week": "هذا الأسبوع",
    "Last Week": "الأسبوع الماضي",
    "This Month": "هذا الشهر",
    "Last Month": "الشهر الماضي",
    "This Quarter": "هذا الربع",
    "This Year": "هذا العام",
    "Last Year": "العام الماضي",
    "Last 7 Days": "آخر 7 أيام",
    "Last 30 Days": "آخر 30 يومًا",
    "All Time": "كل الفترات",
    "Start Date": "تاريخ البدء",
    "End Date": "تاريخ الانتهاء",
    "Daily": "يوميًا",
    "Weekly": "أسبوعيًا",
    "Monthly": "شهريًا",
    "Yearly": "سنويًا",
    "Time Zone": "المنطقة الزمنية",
    "Line Chart": "مخطط خطي",
    "Bar Chart": "مخطط أعمدة",
    "Area Chart": "مخطط مساحي",
    "Pie Chart": "مخطط دائري",
    "Donut Chart": "مخطط حلقي",
    "Heatmap": "خريطة حرارية",
    "Legend": "مفتاح المخطط",
    "Breakdown": "التوزيع التفصيلي",
    "By Country": "حسب البلد",
    "By Device": "حسب الجهاز",
    "By Channel": "حسب القناة",
    "Top Products": "أفضل المنتجات",
    "Top Pages": "أبرز الصفحات",
    "Projects": "المشاريع",
    "Tasks": "المهام",
    "Assigned To": "مسندة إلى",
    "Created By": "أنشأه",
    "Created At": "تاريخ الإنشاء",
    "Updated At": "تاريخ التحديث",
    "Last Updated": "آخر تحديث",
    "Priority": "الأولوية",
    "High Priority": "أولوية عالية",
    "Low Priority": "أولوية منخفضة",
    "Status": "الحالة",
    "To Do": "للتنفيذ",
    "In Progress": "قيد التنفيذ",
    "In Review": "قيد المراجعة",
    "Completed": "مكتمل",
    "Pending": "قيد الانتظار",
    "Approved": "تمت الموافقة",
    "Rejected": "مرفوض",
    "Archived": "مؤرشف",
    "Draft": "مسودة",
    "Published": "منشور",
    "Scheduled": "مجدول",
    "Cancelled": "ملغى",
    "Active": "نشط",
    "Inactive": "غير نشط",
    "Inventory": "المخزون",
    "Stock Level": "مستوى المخزون",
    "In Stock": "متوفر في المخزون",
    "Out of Stock": "نفد من المخزون",
    "Low Stock": "المخزون منخفض",
    "SKU": "رمز المنتج",
    "Categories": "الفئات",
    "Tags": "الوسوم",
    "Filters": "عوامل التصفية",
    "Add Filter": "إضافة عامل تصفية",
    "Clear Filters": "مسح عوامل التصفية",
    "Reset Filters": "إعادة ضبط عوامل التصفية",
    "Apply Filters": "تطبيق عوامل التصفية",
    "Sort By": "ترتيب حسب",
    "Ascending": "تصاعدي",
    "Descending": "تنازلي",
    "Newest First": "الأحدث أولًا",
    "Oldest First": "الأقدم أولًا",
    "Group By": "تجميع حسب",
    "Show Columns": "إظهار الأعمدة",
    "Hide Columns": "إخفاء الأعمدة",
    "Select All": "تحديد الكل",
    "Deselect All": "إلغاء تحديد الكل",
    "Bulk Actions": "إجراءات جماعية",
    "Items Per Page": "عدد العناصر في الصفحة",
    "Load More": "تحميل المزيد",
    "No Results Found": "لم يتم العثور على نتائج",
    "No Data Available": "لا توجد بيانات متاحة",
    "No Notifications": "لا توجد إشعارات",
    "No Recent Activity": "لا يوجد نشاط حديث",
    "Try a Different Search": "جرّب البحث بكلمات أخرى",
    "Search by Name": "البحث بالاسم",
    "Search Anything": "ابحث عن أي شيء",
    "Export Data": "تصدير البيانات",
    "Import Data": "استيراد البيانات",
    "Download Report": "تنزيل التقرير",
    "Schedule Report": "جدولة التقرير",
    "Save Changes": "حفظ التغييرات",
    "Discard Changes": "تجاهل التغييرات",
    "Unsaved Changes": "تغييرات غير محفوظة",
    "Changes Saved": "تم حفظ التغييرات",
    "Are You Sure?": "هل أنت متأكد؟",
    "This Action Cannot Be Undone": "لا يمكن التراجع عن هذا الإجراء",
    "Delete Permanently": "حذف نهائي",
    "Move to Trash": "نقل إلى سلة المهملات",
    "Restore": "استعادة",
    "Duplicate": "تكرار",
    "Rename": "إعادة تسمية",
    "Copy Link": "نسخ الرابط",
    "Link Copied": "تم نسخ الرابط",
    "Mark as Read": "تحديد كمقروء",
    "Mark All as Read": "وضع علامة على الكل كمقروء",
    "Something Went Wrong": "حدث خطأ ما",
    "Try Again": "حاول مرة أخرى",
    "Connection Lost": "انقطع الاتصال",
    "Reconnecting": "جارٍ إعادة الاتصال",
    "Loading Data": "جارٍ تحميل البيانات",
    "Processing": "قيد المعالجة",
    "Uploading": "جارٍ الرفع",
    "Download Complete": "اكتمل التنزيل",
    "Upload Complete": "اكتمل الرفع",
    "Sync Now": "مزامنة الآن",
    "Last Synced": "آخر مزامنة",
    "All Changes Saved": "تم حفظ جميع التغييرات",
    "Quran": "القرآن",
    "Quran Kareem": "القرآن الكريم",
    "Surah": "السورة",
    "Ayah": "الآية",
    "Juz": "الجزء",
    "Hizb": "الحزب",
    "Page": "الصفحة",
    "Tafsir": "التفسير",
    "Translation": "الترجمة",
    "Recitation": "التلاوة",
    "Reciter": "القارئ",
    "Hadith": "الحديث",
    "Hadiths": "الأحاديث",
    "Sunnah": "السنة",
    "Dua": "الدعاء",
    "Duas": "الأدعية",
    "Dhikr": "الذكر",
    "Adhkar": "الأذكار",
    "Tasbih": "التسبيح",
    "Prayer": "الصلاة",
    "Community Prayer": "صلاة الجماعة",
    "community prayer": "صلاة الجماعة",
    "Prayers": "الصلوات",
    "Prayer Times": "مواقيت الصلاة",
    "Fajr": "الفجر",
    "Sunrise": "الشروق",
    "Dhuhr": "الظهر",
    "Asr": "العصر",
    "Maghrib": "المغرب",
    "Isha": "العشاء",
    "Qibla": "القبلة",
    "Qibla Direction": "اتجاه القبلة",
    "Mosque": "المسجد",
    "Masjid": "المسجد",
    "Imam": "الإمام",
    "Muezzin": "المؤذن",
    "Wudu": "الوضوء",
    "Ablution": "الوضوء",
    "Fasting": "الصيام",
    "Fast": "الصوم",
    "Ramadan": "رمضان",
    "Suhoor": "السحور",
    "Iftar": "الإفطار",
    "Zakat": "الزكاة",
    "Charity": "الصدقة",
    "Sadaqah": "الصدقة",
    "Hajj": "الحج",
    "Umrah": "العمرة",
    "Makkah": "مكة المكرمة",
    "Madinah": "المدينة المنورة",
    "Kaaba": "الكعبة",
    "Kabah": "الكعبة",
    "Ihram": "الإحرام",
    "Tawaf": "الطواف",
    "Sa'i": "السعي",
    "Safa and Marwah": "الصفا والمروة",
    "Arafah": "عرفة",
    "Eid": "العيد",
    "Eid al-Fitr": "عيد الفطر",
    "Eid al-Adha": "عيد الأضحى",
    "Islamic Calendar": "التقويم الهجري",
    "Hijri Date": "التاريخ الهجري",
    "Next Prayer": "الصلاة القادمة",
    "Time Remaining": "الوقت المتبقي",
    "Enable Notifications": "تفعيل الإشعارات",
    "Prayer Notifications": "إشعارات الصلاة",
    "Reminder": "تذكير",
    "Reminders": "التذكيرات",
    "Morning Adhkar": "أذكار الصباح",
    "Evening Adhkar": "أذكار المساء",
    "Daily Verse": "آية اليوم",
    "Daily Hadith": "حديث اليوم",
    "Listen": "استماع",
    "Read": "قراءة",
    "Bookmark": "إشارة مرجعية",
    "Bookmarks": "الإشارات المرجعية",
    "Share": "مشاركة",
    "Download Audio": "تنزيل الصوت",
    "Offline Mode": "الوضع غير المتصل",
    "Language": "اللغة",
    "Arabic": "العربية",
    "English": "الإنجليزية",
    "Location": "الموقع",
    "Select Location": "اختر الموقع",
    "Calculation Method": "طريقة الحساب",
    "Madhhab": "المذهب",
    "About": "حول التطبيق",
    "Contact Us": "تواصل معنا",
    "Privacy Policy": "سياسة الخصوصية",
    "Terms and Conditions": "الشروط والأحكام",
    "Faith": "الإيمان",
    "Belief": "العقيدة",
    "Islam": "الإسلام",
    "Muslim": "المسلم",
    "Muslims": "المسلمون",
    "Allah": "الله",
    "Prophet": "النبي",
    "Messenger": "الرسول",
    "Prophets": "الأنبياء",
    "Companion": "الصحابي",
    "Companions": "الصحابة",
    "Sahabah": "الصحابة",
    "Biography": "السيرة",
    "Seerah": "السيرة النبوية",
    "Islamic History": "التاريخ الإسلامي",
    "Scholar": "العالِم",
    "Scholars": "العلماء",
    "Sheikh": "الشيخ",
    "Fatwa": "الفتوى",
    "Fatawa": "الفتاوى",
    "Ruling": "الحكم الشرعي",
    "Halal": "حلال",
    "Haram": "حرام",
    "Permissible": "مباح",
    "Recommended": "مستحب",
    "Obligatory": "واجب",
    "Sunnah Act": "سنة",
    "Intention": "النية",
    "Niyyah": "النية",
    "Worship": "العبادة",
    "Worships": "العبادات",
    "Good Deeds": "الأعمال الصالحة",
    "Repentance": "التوبة",
    "Forgiveness": "المغفرة",
    "Mercy": "الرحمة",
    "Blessing": "البركة",
    "Patience": "الصبر",
    "Gratitude": "الشكر",
    "Trust in Allah": "التوكل على الله",
    "Aqidah": "العقيدة",
    "Tawheed": "التوحيد",
    "Shahada": "الشهادة",
    "Testimony of Faith": "الشهادتان",
    "Five Pillars": "أركان الإسلام",
    "Six Articles of Faith": "أركان الإيمان",
    "Pillar": "الركن",
    "Pillars": "الأركان",
    "Prayer Time": "وقت الصلاة",
    "Prayer Schedule": "جدول الصلاة",
    "Prayer Calendar": "تقويم الصلاة",
    "Adhan": "الأذان",
    "Athan": "الأذان",
    "Iqamah": "الإقامة",
    "Call to Prayer": "الأذان",
    "Congregational Prayer": "صلاة الجماعة",
    "Jamaah": "الجماعة",
    "Friday Prayer": "صلاة الجمعة",
    "Jumu'ah": "الجمعة",
    "Tahajjud": "التهجد",
    "Tarawih": "التراويح",
    "Witr": "الوتر",
    "Duha": "الضحى",
    "Janazah Prayer": "صلاة الجنازة",
    "Missed Prayer": "الصلاة الفائتة",
    "Make Up Prayer": "قضاء الصلاة",
    "Prayer Direction": "اتجاه الصلاة",
    "Prayer Method": "طريقة الصلاة",
    "Rak'ah": "ركعة",
    "Rakaat": "ركعات",
    "Sujud": "السجود",
    "Ruku": "الركوع",
    "Qiyam": "القيام",
    "Tashahhud": "التشهد",
    "Takbir": "التكبير",
    "Salam": "السلام",
    "Salah": "الصلاة",
    "Cleanliness": "النظافة",
    "Purification": "الطهارة",
    "Ghusl": "الغسل",
    "Tayammum": "التيمم",
    "Wudu Guide": "دليل الوضوء",
    "Breaks Wudu": "نواقض الوضوء",
    "Prayer Mat": "سجادة الصلاة",
    "Prayer Beads": "المسبحة",
    "Fasting Schedule": "جدول الصيام",
    "Fasting Times": "أوقات الصيام",
    "Imsak": "الإمساك",
    "Iftar Time": "وقت الإفطار",
    "Suhoor Time": "وقت السحور",
    "Laylat al-Qadr": "ليلة القدر",
    "Night of Power": "ليلة القدر",
    "Last Ten Nights": "العشر الأواخر",
    "Voluntary Fast": "الصيام التطوعي",
    "Fasting Days": "أيام الصيام",
    "Zakat Calculator": "حاسبة الزكاة",
    "Zakat Al-Fitr": "زكاة الفطر",
    "Nisab": "النصاب",
    "Donations": "التبرعات",
    "Donate": "تبرع",
    "Donor": "المتبرع",
    "Endowment": "الوقف",
    "Waqf": "الوقف",
    "Charity Campaign": "حملة خيرية",
    "Hajj Guide": "دليل الحج",
    "Umrah Guide": "دليل العمرة",
    "Hajj Steps": "خطوات الحج",
    "Umrah Steps": "خطوات العمرة",
    "Pilgrimage": "الحج",
    "Pilgrim": "الحاج",
    "Miqat": "الميقات",
    "Mina": "منى",
    "Muzdalifah": "مزدلفة",
    "Mount Arafat": "جبل عرفات",
    "Black Stone": "الحجر الأسود",
    "Zamzam": "زمزم",
    "Tawaf Al-Qudum": "طواف القدوم",
    "Tawaf Al-Ifadah": "طواف الإفاضة",
    "Farewell Tawaf": "طواف الوداع",
    "Ramadan Calendar": "تقويم رمضان",
    "Ramadan Mubarak": "رمضان مبارك",
    "Eid Mubarak": "عيد مبارك",
    "Eid Prayer": "صلاة العيد",
    "Takbeerat Al-Eid": "تكبيرات العيد",
    "Crescent Moon": "الهلال",
    "New Moon": "الهلال الجديد",
    "Islamic Month": "الشهر الهجري",
    "Muharram": "محرم",
    "Safar": "صفر",
    "Rabi al-Awwal": "ربيع الأول",
    "Rabi al-Thani": "ربيع الآخر",
    "Jumada al-Awwal": "جمادى الأولى",
    "Jumada al-Thani": "جمادى الآخرة",
    "Rajab": "رجب",
    "Sha'ban": "شعبان",
    "Shawwal": "شوال",
    "Dhul Qidah": "ذو القعدة",
    "Dhul Hijjah": "ذو الحجة",
    "Morning": "الصباح",
    "Evening": "المساء",
    "Before Sleep": "قبل النوم",
    "After Prayer": "بعد الصلاة",
    "Upon Waking": "عند الاستيقاظ",
    "Travel Dua": "دعاء السفر",
    "Protection Dua": "دعاء التحصين",
    "Istikhara": "الاستخارة",
    "Istighfar": "الاستغفار",
    "Salawat": "الصلاة على النبي",
    "Count": "العدد",
    "Counter": "العداد",
    "Target Count": "العدد المستهدف",
    "Progress": "التقدم",
    "Repeat": "تكرار",
    "Play Audio": "تشغيل الصوت",
    "Pause Audio": "إيقاف الصوت مؤقتًا",
    "Playback Speed": "سرعة التشغيل",
    "Audio Settings": "إعدادات الصوت",
    "Auto Play": "تشغيل تلقائي",
    "Text Size": "حجم النص",
    "Font Style": "نمط الخط",
    "Translation Language": "لغة الترجمة",
    "Show Translation": "إظهار الترجمة",
    "Hide Translation": "إخفاء الترجمة",
    "Show Transliteration": "إظهار النطق اللاتيني",
    "Transliteration": "النطق اللاتيني",
    "Copy Verse": "نسخ الآية",
    "Copy Hadith": "نسخ الحديث",
    "Add Bookmark": "إضافة إشارة مرجعية",
    "Remove Bookmark": "إزالة الإشارة المرجعية",
    "Search Quran": "البحث في القرآن",
    "Search Hadith": "البحث في الأحاديث",
    "Search Results": "نتائج البحث",
    "No Results": "لا توجد نتائج",
    "Chapter": "الفصل",
    "Chapters": "الفصول",
    "Verse Number": "رقم الآية",
    "Hadith Collection": "مجموعة الأحاديث",
    "Narrator": "الراوي",
    "Chain of Narration": "سند الحديث",
    "Authenticity": "درجة الحديث",
    "Sahih": "صحيح",
    "Hasan": "حسن",
    "Daif": "ضعيف",
    "Volume": "المجلد",
    "Book": "الكتاب",
    "Author": "المؤلف",
    "Explanation": "الشرح",
    "Notes": "الملاحظات",
    "Add Note": "إضافة ملاحظة",
    "My Notes": "ملاحظاتي",
    "Recently Read": "قُرئ مؤخرًا",
    "Continue Reading": "متابعة القراءة",
    "Reading History": "سجل القراءة",
    "Daily Goal": "الهدف اليومي",
    "Weekly Goal": "الهدف الأسبوعي",
    "Reading Streak": "سلسلة القراءة",
    "Share App": "مشاركة التطبيق",
    "Rate App": "قيّم التطبيق",
    "Report a Problem": "الإبلاغ عن مشكلة",
    "Feedback": "الملاحظات",
    "Data Sources": "مصادر البيانات",
    "Calculation Settings": "إعدادات الحساب",
    "High Latitude Adjustment": "ضبط خطوط العرض العالية",
    "Time Format": "تنسيق الوقت",
    "12 Hour Format": "تنسيق 12 ساعة",
    "24 Hour Format": "تنسيق 24 ساعة",
    "Use Current Location": "استخدام الموقع الحالي",
    "Change Location": "تغيير الموقع",
    "Select City": "اختر المدينة",
    "Allow Location Access": "السماح بالوصول إلى الموقع",
    "Location Permission": "إذن الموقع",
    "Next": "التالي",
    "Previous": "السابق",
    "Done": "مكتملة",
    "Save": "حفظ",
    "Cancel": "إلغاء",
    "Close": "إغلاق",
    "Back": "رجوع",
    "More": "المزيد",
    "Learn More": "معرفة المزيد",
    "View All": "عرض الكل",
    "View Details": "عرض التفاصيل",
    "Loading": "جارٍ التحميل",
    "No Internet Connection": "لا يوجد اتصال بالإنترنت",
    "Home": "الرئيسية",
    "Top Bar": "الشريط العلوي",
    "Tab Bar": "شريط علامات التبويب",
    "Command Menu": "قائمة الأوامر",
    "Keyboard Shortcuts": "اختصارات لوحة المفاتيح",
    "Filter By": "تصفية حسب",
    "Advanced Filters": "عوامل التصفية المتقدمة",
    "Search Field": "حقل البحث",
    "Search Suggestions": "اقتراحات البحث",
    "Recent Searches": "عمليات البحث الأخيرة",
    "No Recent Searches": "لا توجد عمليات بحث حديثة",
    "Select an Option": "اختر خيارًا",
    "Choose File": "اختر ملفًا",
    "Drag and Drop": "السحب والإفلات",
    "Drop Files Here": "أفلت الملفات هنا",
    "File Upload": "رفع ملف",
    "File Name": "اسم الملف",
    "File Type": "نوع الملف",
    "File Size": "حجم الملف",
    "Attachment": "مرفق",
    "Attachments": "المرفقات",
    "Form": "النموذج",
    "Form Fields": "حقول النموذج",
    "Required Field": "حقل مطلوب",
    "Optional Field": "حقل اختياري",
    "Field Label": "تسمية الحقل",
    "Validation": "التحقق من صحة البيانات",
    "Invalid Value": "قيمة غير صالحة",
    "Password": "كلمة المرور",
    "Confirm Password": "تأكيد كلمة المرور",
    "Show Password": "إظهار كلمة المرور",
    "Hide Password": "إخفاء كلمة المرور",
    "Email Address": "عنوان البريد الإلكتروني",
    "Phone Number": "رقم الهاتف",
    "Verification Code": "رمز التحقق",
    "Sign In": "تسجيل الدخول",
    "Sign Up": "إنشاء حساب",
    "Sign Out": "تسجيل الخروج",
    "Log In": "تسجيل الدخول",
    "Log Out": "تسجيل الخروج",
    "Forgot Password": "نسيت كلمة المرور",
    "Reset Password": "إعادة تعيين كلمة المرور",
    "Create Account": "إنشاء حساب",
    "Personal Information": "المعلومات الشخصية",
    "Display Name": "اسم العرض",
    "Username": "اسم المستخدم",
    "Profile Picture": "صورة الملف الشخصي",
    "Online": "متصل",
    "Offline": "غير متصل",
    "Active Now": "نشط الآن",
    "Last Seen": "آخر ظهور",
    "Invite Member": "دعوة عضو",
    "Team Members": "أعضاء الفريق",
    "Role": "الدور",
    "Permission": "الصلاحية",
    "Private": "خاص",
    "Public": "عام",
    "Shared": "مشترك",
    "Invite Link": "رابط الدعوة",
    "Remove Member": "إزالة العضو",
    "Leave Workspace": "مغادرة مساحة العمل",
    "Create New": "إنشاء جديد",
    "Add New": "إضافة جديد",
    "Edit Item": "تعديل العنصر",
    "View Item": "عرض العنصر",
    "Move To": "نقل إلى",
    "Archive": "أرشفة",
    "Undo Changes": "التراجع عن التغييرات",
    "Redo Changes": "إعادة التغييرات",
    "Saved Successfully": "تم الحفظ بنجاح",
    "Confirm Deletion": "تأكيد الحذف",
    "Delete Item": "حذف العنصر",
    "No Data": "لا توجد بيانات",
    "No Items Found": "لم يتم العثور على عناصر",
    "Nothing Here Yet": "لا يوجد شيء هنا بعد",
    "Get Started": "ابدأ الآن",
    "Welcome Back": "مرحبًا بعودتك",
    "Coming Soon": "قريبًا",
    "Under Maintenance": "قيد الصيانة",
    "Error": "خطأ",
    "Warning": "تحذير",
    "Success": "نجاح",
    "Info": "معلومات",
    "Attention": "تنبيه",
    "Notice": "إشعار",
    "Try Again Later": "حاول مرة أخرى لاحقًا",
    "Contact Support": "تواصل مع الدعم",
    "Help Center": "مركز المساعدة",
    "Guide": "الدليل",
    "Tutorial": "البرنامج التعليمي",
    "Feedback Form": "نموذج الملاحظات",
    "Report Bug": "الإبلاغ عن خطأ",
    "Feature Request": "طلب ميزة",
    "Expired": "منتهي الصلاحية",
    "Date Created": "تاريخ الإنشاء",
    "Date Modified": "تاريخ التعديل",
    "Time": "الوقت",
    "Date": "التاريخ",
    "Tomorrow": "غدًا",
    "Report": "التقرير",
    "Metrics": "المقاييس",
    "KPI": "مؤشر الأداء الرئيسي",
    "Engagement": "التفاعل",
    "Retention": "الاحتفاظ بالمستخدمين",
    "Profit": "الربح",
    "Users": "المستخدمون",
    "Traffic": "الازدحام المروري",
    "Print": "طباعة",
    "Refresh Data": "تحديث البيانات",
    "Live Data": "بيانات مباشرة",
    "Payment": "الدفع",
    "Payments": "المدفوعات",
    "Invoice": "الفاتورة",
    "Receipt": "الإيصال",
    "Price": "السعر",
    "Amount": "المبلغ",
    "Total": "الإجمالي",
    "Currency": "العملة",
    "Credit Card": "بطاقة ائتمان",
    "Order Summary": "ملخص الطلب",
    "Checkout": "إتمام الشراء",
    "Cart": "سلة التسوق",
    "Add to Cart": "إضافة إلى السلة",
    "Buy Now": "اشترِ الآن",
    "Subscribe": "اشترك",
    "Plan": "الخطة",
    "Plans": "الخطط",
    "Upgrade Plan": "ترقية الخطة",
    "Cancel Subscription": "إلغاء الاشتراك",
    "Free Trial": "تجربة مجانية",
    "Order Status": "حالة الطلب",
    "Order Number": "رقم الطلب",
    "Shipping Address": "عنوان الشحن",
    "Billing Address": "عنوان الفوترة",
    "Delivery": "التوصيل",
    "Tracking Number": "رقم التتبع",
    "Coupon Code": "رمز القسيمة",
    "Apply Coupon": "تطبيق القسيمة",
    "Design": "التصميم",
    "Prototype": "النموذج الأولي",
    "Wireframe": "المخطط الهيكلي",
    "User Flow": "تدفق المستخدم",
    "User Journey": "رحلة المستخدم",
    "User Persona": "شخصية المستخدم",
    "User Research": "بحث المستخدمين",
    "Usability Testing": "اختبار قابلية الاستخدام",
    "Responsive Design": "التصميم المتجاوب",
    "Mobile First": "تصميم الجوال أولًا",
    "Design Review": "مراجعة التصميم",
    "Design Handoff": "تسليم التصميم",
    "Variant": "النسخة",
    "Pattern": "النمط",
    "Template": "القالب",
    "Color": "اللون",
    "Colors": "الألوان",
    "Icon": "الأيقونة",
    "Icons": "الأيقونات",
    "Dialog": "مربع حوار",
    "Chip": "وسم",
    "Card": "البطاقة",
    "Table": "جدول",
    "List": "قائمة",
    "Loading State": "حالة التحميل",
    "Skeleton Loader": "هيكل التحميل",
    "Error State": "حالة الخطأ",
    "Success State": "حالة النجاح",
    "Hover State": "حالة التحويم",
    "Focus State": "حالة التركيز",
    "Disabled State": "حالة التعطيل",
    "Active State": "الحالة النشطة",
    "Healthcare": "الرعاية الصحية",
    "Medical": "طبي",
    "Medicine": "الطب",
    "Medical Care": "الرعاية الطبية",
    "Patient": "المريض",
    "Patients": "المرضى",
    "Patient Profile": "ملف المريض",
    "Patient ID": "معرّف المريض",
    "Medical Record": "السجل الطبي",
    "Medical Records": "السجلات الطبية",
    "Electronic Health Record": "السجل الصحي الإلكتروني",
    "Health History": "التاريخ الصحي",
    "Medical History": "التاريخ الطبي",
    "Family History": "التاريخ العائلي المرضي",
    "Allergies": "الحساسيات",
    "Allergy": "حساسية",
    "Drug Allergy": "حساسية دوائية",
    "Chronic Conditions": "الأمراض المزمنة",
    "Existing Conditions": "الحالات المرضية الحالية",
    "Diagnosis": "التشخيص",
    "Diagnoses": "التشخيصات",
    "Symptom": "العَرَض",
    "Symptoms": "الأعراض",
    "Chief Complaint": "الشكوى الرئيسية",
    "Medical Assessment": "التقييم الطبي",
    "Clinical Notes": "الملاحظات السريرية",
    "Doctor Notes": "ملاحظات الطبيب",
    "Treatment Plan": "خطة العلاج",
    "Care Plan": "خطة الرعاية",
    "Follow-up": "المتابعة",
    "Follow-up Appointment": "موعد المتابعة",
    "Referral": "إحالة",
    "Referral Letter": "خطاب الإحالة",
    "Specialist": "طبيب أخصائي",
    "Primary Care": "الرعاية الأولية",
    "General Practitioner": "طبيب عام",
    "Doctor": "الطبيب",
    "Physician": "الطبيب",
    "Nurse": "الممرض",
    "Nursing Staff": "طاقم التمريض",
    "Pharmacist": "الصيدلي",
    "Therapist": "المعالج",
    "Healthcare Provider": "مقدم الرعاية الصحية",
    "Clinic": "العيادة",
    "Hospital": "المستشفى",
    "Department": "القسم",
    "Medical Department": "القسم الطبي",
    "Emergency Department": "قسم الطوارئ",
    "Outpatient": "العيادات الخارجية",
    "Inpatient": "مريض منوّم",
    "Room Number": "رقم الغرفة",
    "Bed Number": "رقم السرير",
    "Appointment": "موعد",
    "Appointments": "المواعيد",
    "Book Appointment": "حجز موعد",
    "Reschedule Appointment": "إعادة جدولة الموعد",
    "Cancel Appointment": "إلغاء الموعد",
    "Appointment Details": "تفاصيل الموعد",
    "Appointment Type": "نوع الموعد",
    "Appointment Date": "تاريخ الموعد",
    "Appointment Time": "وقت الموعد",
    "Available Time Slots": "المواعيد المتاحة",
    "No Available Appointments": "لا توجد مواعيد متاحة",
    "Check-in": "تسجيل الوصول",
    "Check-out": "تسجيل المغادرة",
    "Waiting Room": "غرفة الانتظار",
    "Queue Number": "رقم الدور",
    "Telehealth": "الرعاية الصحية عن بُعد",
    "Video Consultation": "استشارة عبر الفيديو",
    "Online Consultation": "استشارة عبر الإنترنت",
    "Start Consultation": "بدء الاستشارة",
    "End Consultation": "إنهاء الاستشارة",
    "Join Call": "الانضمام إلى المكالمة",
    "Prescription": "الوصفة الطبية",
    "Prescriptions": "الوصفات الطبية",
    "Prescription Details": "تفاصيل الوصفة الطبية",
    "E-Prescription": "وصفة طبية إلكترونية",
    "Medication": "الدواء",
    "Medications": "الأدوية",
    "Medication List": "قائمة الأدوية",
    "Current Medications": "الأدوية الحالية",
    "Medication Name": "اسم الدواء",
    "Generic Name": "الاسم العلمي",
    "Brand Name": "الاسم التجاري",
    "Active Ingredient": "المادة الفعالة",
    "Dosage": "الجرعة",
    "Dose": "الجرعة",
    "Dosage Form": "الشكل الدوائي",
    "Route of Administration": "طريقة الاستخدام",
    "Frequency": "التكرار",
    "Start Medication": "بدء الدواء",
    "Stop Medication": "إيقاف الدواء",
    "Refill": "إعادة صرف",
    "Refill Request": "طلب إعادة صرف",
    "Refills Remaining": "مرات الصرف المتبقية",
    "Medication Reminder": "تذكير الدواء",
    "Medication Schedule": "جدول الأدوية",
    "Take with Food": "يُؤخذ مع الطعام",
    "Take on an Empty Stomach": "يُؤخذ على معدة فارغة",
    "As Needed": "عند الحاجة",
    "Once Daily": "مرة يوميًا",
    "Twice Daily": "مرتين يوميًا",
    "Three Times Daily": "ثلاث مرات يوميًا",
    "Before Meals": "قبل الوجبات",
    "After Meals": "بعد الوجبات",
    "Morning Dose": "جرعة الصباح",
    "Evening Dose": "جرعة المساء",
    "Missed Dose": "جرعة فائتة",
    "Side Effects": "الآثار الجانبية",
    "Drug Interactions": "التداخلات الدوائية",
    "Contraindications": "موانع الاستعمال",
    "Warnings": "التحذيرات",
    "Precautions": "الاحتياطات",
    "Overdose": "الجرعة الزائدة",
    "Adverse Reaction": "تفاعل ضار",
    "Pharmacy": "الصيدلية",
    "Pharmacies": "الصيدليات",
    "Pharmacy Locator": "محدد الصيدليات",
    "Nearby Pharmacy": "صيدلية قريبة",
    "Prescription Upload": "رفع الوصفة الطبية",
    "Prescription Status": "حالة الوصفة الطبية",
    "Ready for Pickup": "جاهز للاستلام",
    "Pickup": "الاستلام",
    "Delivery Address": "عنوان التوصيل",
    "Lab Test": "فحص مخبري",
    "Laboratory": "المختبر",
    "Lab Results": "نتائج المختبر",
    "Test Results": "نتائج الفحوصات",
    "Test Name": "اسم الفحص",
    "Test Date": "تاريخ الفحص",
    "Result": "النتيجة",
    "Reference Range": "المعدل المرجعي",
    "Normal Range": "المعدل الطبيعي",
    "Abnormal": "غير طبيعي",
    "Positive": "إيجابي",
    "Negative": "سلبي",
    "Pending Results": "النتائج قيد الانتظار",
    "Upload Results": "رفع النتائج",
    "Download Results": "تنزيل النتائج",
    "Blood Test": "تحليل الدم",
    "Urine Test": "تحليل البول",
    "Blood Type": "فصيلة الدم",
    "Blood Pressure": "ضغط الدم",
    "Heart Rate": "معدل ضربات القلب",
    "Body Temperature": "درجة حرارة الجسم",
    "Oxygen Saturation": "نسبة تشبع الأكسجين",
    "Respiratory Rate": "معدل التنفس",
    "Weight": "الوزن",
    "Height": "الطول",
    "BMI": "مؤشر كتلة الجسم",
    "Vital Signs": "العلامات الحيوية",
    "Health Metrics": "المؤشرات الصحية",
    "Blood Glucose": "نسبة سكر الدم",
    "Cholesterol": "الكوليسترول",
    "Heart Rate Monitor": "مراقب معدل ضربات القلب",
    "Imaging": "التصوير الطبي",
    "X-Ray": "الأشعة السينية",
    "MRI Scan": "تصوير الرنين المغناطيسي",
    "CT Scan": "التصوير المقطعي",
    "Ultrasound": "الموجات فوق الصوتية",
    "Scan Results": "نتائج التصوير",
    "Procedure": "الإجراء الطبي",
    "Procedures": "الإجراءات الطبية",
    "Surgery": "الجراحة",
    "Operation": "العملية الجراحية",
    "Pre-Operative": "قبل العملية",
    "Post-Operative": "بعد العملية",
    "Discharge": "الخروج من المستشفى",
    "Discharge Summary": "ملخص الخروج",
    "Admission": "الدخول إلى المستشفى",
    "Medical Certificate": "شهادة طبية",
    "Sick Leave": "إجازة مرضية",
    "Emergency": "طوارئ",
    "Emergency Contact": "جهة اتصال للطوارئ",
    "Call Emergency Services": "اتصل بخدمات الطوارئ",
    "Ambulance": "سيارة الإسعاف",
    "First Aid": "الإسعافات الأولية",
    "Urgent": "عاجل",
    "Critical": "حرج",
    "Stable": "مستقر",
    "Insurance": "التأمين",
    "Health Insurance": "التأمين الصحي",
    "Insurance Provider": "شركة التأمين",
    "Policy Number": "رقم الوثيقة",
    "Insurance Card": "بطاقة التأمين",
    "Coverage": "التغطية التأمينية",
    "Claim": "مطالبة تأمينية",
    "Claims": "المطالبات التأمينية",
    "Copay": "المساهمة في الدفع",
    "Deductible": "المبلغ المقتطع",
    "Approved by Insurance": "تمت الموافقة من التأمين",
    "Not Covered": "غير مشمول بالتغطية",
    "Privacy Consent": "الموافقة على الخصوصية",
    "Medical Consent": "الموافقة الطبية",
    "Consent Form": "نموذج الموافقة",
    "Data Privacy": "خصوصية البيانات",
    "Health Data": "البيانات الصحية",
    "Share Medical Records": "مشاركة السجلات الطبية",
    "Download Medical Record": "تنزيل السجل الطبي",
    "Access History": "سجل الوصول",
    "Authorized Access": "وصول مصرح به",
    "Accessibility Settings": "إعدادات إمكانية الوصول",
    "Large Text": "نص كبير",
    "High Contrast": "تباين عالٍ",
    "Quran App": "تطبيق القرآن",
    "Quran Library": "مكتبة القرآن",
    "Quran Reader": "قارئ القرآن",
    "Read Quran": "قراءة القرآن",
    "Listen to Quran": "الاستماع إلى القرآن",
    "Continue Recitation": "متابعة التلاوة",
    "Resume Reading": "متابعة القراءة",
    "Reading Mode": "وضع القراءة",
    "Mushaf Mode": "وضع المصحف",
    "Translation Mode": "وضع الترجمة",
    "Tafsir Mode": "وضع التفسير",
    "Verse by Verse": "آية بآية",
    "Repeat Verse": "تكرار الآية",
    "Repeat Range": "تكرار المقطع",
    "Repeat Count": "عدد مرات التكرار",
    "Memorization Mode": "وضع الحفظ",
    "Memorization Plan": "خطة الحفظ",
    "Memorization Progress": "تقدم الحفظ",
    "Revision Plan": "خطة المراجعة",
    "Revision Schedule": "جدول المراجعة",
    "Daily Quran Goal": "الهدف القرآني اليومي",
    "Verses Read": "الآيات المقروءة",
    "Verses Memorized": "الآيات المحفوظة",
    "Reading Minutes": "دقائق القراءة",
    "Reading Progress": "تقدم القراءة",
    "Last Read": "آخر قراءة",
    "Continue from Here": "المتابعة من هنا",
    "Mark as Unread": "تحديد كغير مقروء",
    "Add to Favorites": "إضافة إلى المفضلة",
    "Remove from Favorites": "إزالة من المفضلة",
    "Save for Later": "حفظ لوقت لاحق",
    "Saved Verses": "الآيات المحفوظة",
    "Bookmarked Verses": "الآيات ذات الإشارة المرجعية",
    "Shared Verse": "الآية المشتركة",
    "Copy Arabic Text": "نسخ النص العربي",
    "Copy Translation": "نسخ الترجمة",
    "Copy Verse Link": "نسخ رابط الآية",
    "Verse Reference": "مرجع الآية",
    "Surah Index": "فهرس السور",
    "Juz Index": "فهرس الأجزاء",
    "Hizb Index": "فهرس الأحزاب",
    "Revelation Order": "ترتيب النزول",
    "Meccan Surah": "سورة مكية",
    "Medinan Surah": "سورة مدنية",
    "Number of Verses": "عدد الآيات",
    "Surah Introduction": "مقدمة السورة",
    "Recitation Audio": "صوت التلاوة",
    "Choose Reciter": "اختر القارئ",
    "Reciter Settings": "إعدادات القارئ",
    "Download Recitation": "تنزيل التلاوة",
    "Downloaded Recitations": "التلاوات المنزلة",
    "Audio Quality": "جودة الصوت",
    "High Quality Audio": "صوت عالي الجودة",
    "Low Data Mode": "وضع استهلاك البيانات المنخفض",
    "Wi-Fi Only": "شبكة Wi-Fi فقط",
    "Auto Download": "تنزيل تلقائي",
    "Play in Background": "التشغيل في الخلفية",
    "Sleep Timer": "مؤقت النوم",
    "Stop After Surah": "التوقف بعد السورة",
    "Translation Source": "مصدر الترجمة",
    "Choose Translation": "اختر الترجمة",
    "Available Translations": "الترجمات المتاحة",
    "Tafsir Source": "مصدر التفسير",
    "Choose Tafsir": "اختر التفسير",
    "Arabic Font": "الخط العربي",
    "Font Size Settings": "إعدادات حجم الخط",
    "Line Spacing": "تباعد الأسطر",
    "Page Theme": "نمط الصفحة",
    "Sepia Theme": "النمط البني",
    "Night Reading": "القراءة الليلية",
    "Prayer App": "تطبيق الصلاة",
    "Prayer Times Today": "مواقيت الصلاة اليوم",
    "Prayer Time Settings": "إعدادات مواقيت الصلاة",
    "Juristic Method": "الطريقة الفقهية",
    "Asr Calculation": "حساب وقت العصر",
    "Midnight Calculation": "حساب منتصف الليل",
    "Adjust Prayer Times": "ضبط مواقيت الصلاة",
    "Manual Adjustment": "ضبط يدوي",
    "Prayer Time Adjustment": "تعديل وقت الصلاة",
    "Use Astronomical Twilight": "استخدام الشفق الفلكي",
    "Next Prayer Countdown": "العد التنازلي للصلاة القادمة",
    "Prayer Time Passed": "انتهى وقت الصلاة",
    "Prayer Time Now": "وقت الصلاة الآن",
    "Time Until Prayer": "الوقت المتبقي للصلاة",
    "Time Since Prayer": "الوقت منذ الصلاة",
    "Prayer Completed": "تمت الصلاة",
    "Mark Prayer as Complete": "تحديد الصلاة كمكتملة",
    "Prayer Tracker": "متابعة الصلوات",
    "Prayer History": "سجل الصلوات",
    "Missed Prayers": "الصلوات الفائتة",
    "Prayer Streak": "سلسلة الصلوات",
    "Adhan Notifications": "إشعارات الأذان",
    "Adhan Sound": "صوت الأذان",
    "Choose Adhan": "اختر الأذان",
    "Mute Adhan": "كتم الأذان",
    "Silent Mode": "الوضع الصامت",
    "Vibrate on Adhan": "الاهتزاز عند الأذان",
    "Before Prayer Reminder": "تذكير قبل الصلاة",
    "After Prayer Reminder": "تذكير بعد الصلاة",
    "Qibla Finder": "محدد القبلة",
    "Find Qibla": "تحديد القبلة",
    "Qibla Compass": "بوصلة القبلة",
    "Calibrate Compass": "معايرة البوصلة",
    "Compass Calibration": "معايرة البوصلة",
    "Qibla Found": "تم تحديد القبلة",
    "Point Your Phone": "وجّه هاتفك",
    "Location Required": "الموقع مطلوب",
    "Enable Location": "تفعيل الموقع",
    "Location Accuracy": "دقة الموقع",
    "Facing Qibla": "الاتجاه نحو القبلة",
    "Distance to Kaaba": "المسافة إلى الكعبة",
    "Islamic Calendar App": "تطبيق التقويم الهجري",
    "Hijri Calendar": "التقويم الهجري",
    "Gregorian Calendar": "التقويم الميلادي",
    "Convert Date": "تحويل التاريخ",
    "Hijri Date Converter": "محول التاريخ الهجري",
    "Islamic Events": "المناسبات الإسلامية",
    "Islamic Holidays": "العطلات الإسلامية",
    "Important Dates": "التواريخ المهمة",
    "Moon Sighting": "رؤية الهلال",
    "Ramadan Mode": "وضع رمضان",
    "Ramadan Settings": "إعدادات رمضان",
    "Ramadan Countdown": "العد التنازلي لرمضان",
    "Days Until Ramadan": "الأيام المتبقية لرمضان",
    "Fasting Tracker": "متابعة الصيام",
    "Fasting Reminder": "تذكير الصيام",
    "Fasting Intention": "نية الصيام",
    "Voluntary Fasting": "الصيام التطوعي",
    "Recommended Fasting": "الصيام المستحب",
    "Fasting Calendar": "تقويم الصيام",
    "Suhur Reminder": "تذكير السحور",
    "Iftar Reminder": "تذكير الإفطار",
    "Iftar Countdown": "العد التنازلي للإفطار",
    "Iftar Dua": "دعاء الإفطار",
    "Ramadan Planner": "مخطط رمضان",
    "Ramadan Goals": "أهداف رمضان",
    "Khatm Plan": "خطة ختم القرآن",
    "Khatm Progress": "تقدم الختمة",
    "Khatm Completed": "اكتملت الختمة",
    "Night Prayer Reminder": "تذكير صلاة الليل",
    "Laylat Al-Qadr Guide": "دليل ليلة القدر",
    "Eid Countdown": "العد التنازلي للعيد",
    "Eid Guide": "دليل العيد",
    "Eid Takbeer": "تكبير العيد",
    "Zakat App": "تطبيق الزكاة",
    "Calculate Zakat": "حساب الزكاة",
    "Zakatable Assets": "الأموال الخاضعة للزكاة",
    "Cash and Savings": "النقد والمدخرات",
    "Gold and Silver": "الذهب والفضة",
    "Business Assets": "أصول التجارة",
    "Zakat Due": "الزكاة المستحقة",
    "Zakat Amount": "مقدار الزكاة",
    "Zakat Eligibility": "استحقاق الزكاة",
    "Eligible Recipients": "مصارف الزكاة",
    "Charity App": "تطبيق الصدقة",
    "Donate Now": "تبرع الآن",
    "Donation History": "سجل التبرعات",
    "Recurring Donation": "تبرع دوري",
    "Anonymous Donation": "تبرع مجهول",
    "Donation Receipt": "إيصال التبرع",
    "Hajj App": "تطبيق الحج",
    "Hajj Planner": "مخطط الحج",
    "Hajj Checklist": "قائمة تجهيزات الحج",
    "Umrah Planner": "مخطط العمرة",
    "Umrah Checklist": "قائمة تجهيزات العمرة",
    "Manasik": "المناسك",
    "Manasik Guide": "دليل المناسك",
    "Ihram Guide": "دليل الإحرام",
    "Tawaf Counter": "عداد الطواف",
    "Tawaf Laps": "أشواط الطواف",
    "Sa'i Counter": "عداد السعي",
    "Sa'i Laps": "أشواط السعي",
    "Hajj Locations": "مواقع الحج",
    "Mina Map": "خريطة منى",
    "Arafat Map": "خريطة عرفات",
    "Muzdalifah Map": "خريطة مزدلفة",
    "Travel Mode": "وضع السفر",
    "Offline Maps": "خرائط دون اتصال",
    "Islamic Knowledge": "المعرفة الإسلامية",
    "Learn Islam": "تعلم الإسلام",
    "Islamic Lessons": "الدروس الإسلامية",
    "Lessons": "الدروس",
    "Quiz": "اختبار قصير",
    "Quizzes": "الاختبارات القصيرة",
    "Question of the Day": "سؤال اليوم",
    "Daily Reminder": "التذكير اليومي",
    "Islamic Quote": "اقتباس إسلامي",
    "Daily Wisdom": "حكمة اليوم",
    "Audio Lesson": "درس صوتي",
    "Video Lesson": "درس مرئي",
    "Ask a Scholar": "اسأل عالمًا",
    "Verified Content": "محتوى موثوق",
    "Source Reference": "مرجع المصدر",
    "Report Incorrect Content": "الإبلاغ عن محتوى غير صحيح",
    "Notification Schedule": "جدول الإشعارات",
    "Reminder Settings": "إعدادات التذكيرات",
    "Daily Notifications": "الإشعارات اليومية",
    "Weekly Notifications": "الإشعارات الأسبوعية",
    "Notification Sound": "صوت الإشعار",
    "Quiet Hours": "ساعات الهدوء",
    "Do Not Disturb": "عدم الإزعاج",
    "Home Screen Widget": "أداة الشاشة الرئيسية",
    "Lock Screen Widget": "أداة شاشة القفل",
    "App Language": "لغة التطبيق",
    "Arabic Interface": "واجهة عربية",
    "RTL Layout": "تخطيط من اليمين إلى اليسار",
    "Content Language": "لغة المحتوى",
    "Choose Region": "اختر المنطقة",
    "Privacy Settings": "إعدادات الخصوصية",
    "Data Sync": "مزامنة البيانات",
    "Backup Data": "نسخ البيانات احتياطيًا",
    "Restore Data": "استعادة البيانات",
    "Delete Account": "حذف الحساب",
    "Banking": "الخدمات المصرفية",
    "Bank": "البنك",
    "Bank Account": "الحساب البنكي",
    "Bank Accounts": "الحسابات البنكية",
    "Account Balance": "رصيد الحساب",
    "Available Balance": "الرصيد المتاح",
    "Current Balance": "الرصيد الحالي",
    "Pending Balance": "الرصيد المعلق",
    "Opening Balance": "الرصيد الافتتاحي",
    "Account Number": "رقم الحساب",
    "IBAN": "رقم الحساب المصرفي الدولي",
    "IBAN Number": "رقم الآيبان",
    "SWIFT Code": "رمز سويفت",
    "BIC": "رمز البنك",
    "Sort Code": "رمز الفرع المصرفي",
    "Routing Number": "رقم التوجيه المصرفي",
    "Bank Name": "اسم البنك",
    "Branch": "الفرع",
    "Branch Name": "اسم الفرع",
    "Branch Address": "عنوان الفرع",
    "Open Account": "فتح حساب",
    "Close Account": "إغلاق الحساب",
    "Add Bank Account": "إضافة حساب بنكي",
    "Link Bank Account": "ربط حساب بنكي",
    "Linked Accounts": "الحسابات المرتبطة",
    "Primary Account": "الحساب الأساسي",
    "Savings Account": "حساب التوفير",
    "Checking Account": "الحساب الجاري",
    "Business Account": "حساب الأعمال",
    "Joint Account": "حساب مشترك",
    "Wallet": "المحفظة",
    "Digital Wallet": "المحفظة الرقمية",
    "Mobile Wallet": "محفظة الهاتف المحمول",
    "Wallet Balance": "رصيد المحفظة",
    "Cash Balance": "الرصيد النقدي",
    "Top Up": "شحن الرصيد",
    "Add Money": "إضافة أموال",
    "Withdraw Money": "سحب الأموال",
    "Cash Out": "سحب نقدي",
    "Deposit": "إيداع",
    "Withdrawal": "سحب",
    "Transfer": "تحويل",
    "Transfers": "التحويلات",
    "Bank Transfer": "تحويل بنكي",
    "Internal Transfer": "تحويل داخلي",
    "Local Transfer": "تحويل محلي",
    "International Transfer": "تحويل دولي",
    "International Payments": "المدفوعات الدولية",
    "Wire Transfer": "حوالة مصرفية",
    "Instant Transfer": "تحويل فوري",
    "Scheduled Transfer": "تحويل مجدول",
    "Recurring Transfer": "تحويل متكرر",
    "Transfer Money": "تحويل الأموال",
    "Send Money": "إرسال الأموال",
    "Receive Money": "استلام الأموال",
    "Request Money": "طلب الأموال",
    "Split Payment": "تقسيم الدفع",
    "Transfer Recipient": "مستلم التحويل",
    "Beneficiary": "المستفيد",
    "Beneficiaries": "المستفيدون",
    "Add Beneficiary": "إضافة مستفيد",
    "Manage Beneficiaries": "إدارة المستفيدين",
    "Recipient Name": "اسم المستلم",
    "Recipient Account": "حساب المستلم",
    "Recipient Bank": "بنك المستلم",
    "Recipient Address": "عنوان المستلم",
    "Transfer Reference": "مرجع التحويل",
    "Payment Reference": "مرجع الدفع",
    "Transfer Purpose": "غرض التحويل",
    "Transfer Amount": "مبلغ التحويل",
    "Transfer Date": "تاريخ التحويل",
    "Transfer Fee": "رسوم التحويل",
    "Exchange Rate": "سعر الصرف",
    "Converted Amount": "المبلغ المحول",
    "Send Currency": "عملة الإرسال",
    "Receive Currency": "عملة الاستلام",
    "Supported Currencies": "العملات المدعومة",
    "Base Currency": "العملة الأساسية",
    "Foreign Currency": "العملة الأجنبية",
    "Currency Exchange": "صرف العملات",
    "Exchange": "الصرافة",
    "Recipient Gets": "يستلم المستفيد",
    "You Pay": "المبلغ الذي ستدفعه",
    "Estimated Arrival": "وقت الوصول المتوقع",
    "Transfer Status": "حالة التحويل",
    "Transfer Successful": "تم التحويل بنجاح",
    "Transfer Failed": "فشل التحويل",
    "Transfer Pending": "التحويل قيد الانتظار",
    "Transfer Canceled": "تم إلغاء التحويل",
    "Transfer Reversed": "تم عكس التحويل",
    "Cancel Transfer": "إلغاء التحويل",
    "Track Transfer": "تتبع التحويل",
    "Transaction": "المعاملة",
    "Transaction History": "سجل المعاملات",
    "Transaction Details": "تفاصيل المعاملة",
    "Transaction Date": "تاريخ المعاملة",
    "Transaction Type": "نوع المعاملة",
    "Debit": "مدين",
    "Credit": "دائن",
    "Incoming": "وارد",
    "Outgoing": "صادر",
    "Money In": "أموال واردة",
    "Money Out": "أموال صادرة",
    "Card Payment": "دفع بالبطاقة",
    "Cash Withdrawal": "سحب نقدي",
    "Bank Fee": "رسوم بنكية",
    "Refund": "استرداد المبلغ",
    "Dispute Transaction": "الاعتراض على المعاملة",
    "Report Transaction": "الإبلاغ عن المعاملة",
    "Download Statement": "تنزيل كشف الحساب",
    "Bank Statement": "كشف الحساب البنكي",
    "Account Statement": "كشف الحساب",
    "Statement Period": "فترة كشف الحساب",
    "Statement Date": "تاريخ كشف الحساب",
    "Monthly Statement": "كشف حساب شهري",
    "Account Activity": "نشاط الحساب",
    "Balance History": "سجل الرصيد",
    "Cards": "البطاقات",
    "Debit Card": "بطاقة الخصم المباشر",
    "Prepaid Card": "بطاقة مسبقة الدفع",
    "Virtual Card": "بطاقة افتراضية",
    "Physical Card": "بطاقة فعلية",
    "Card Number": "رقم البطاقة",
    "Cardholder Name": "اسم حامل البطاقة",
    "Expiry Date": "تاريخ الانتهاء",
    "CVV": "رمز الأمان CVV",
    "PIN": "الرقم السري",
    "Change PIN": "تغيير الرقم السري",
    "Reset PIN": "إعادة تعيين الرقم السري",
    "Activate Card": "تفعيل البطاقة",
    "Freeze Card": "تجميد البطاقة",
    "Unfreeze Card": "إلغاء تجميد البطاقة",
    "Block Card": "حظر البطاقة",
    "Unblock Card": "إلغاء حظر البطاقة",
    "Replace Card": "استبدال البطاقة",
    "Order a Card": "طلب بطاقة",
    "Card Delivery": "توصيل البطاقة",
    "Card Limit": "حد البطاقة",
    "Spending Limit": "حد الإنفاق",
    "Daily Limit": "الحد اليومي",
    "Monthly Limit": "الحد الشهري",
    "ATM": "الصراف الآلي",
    "Find an ATM": "العثور على صراف آلي",
    "Nearby ATMs": "أجهزة الصراف القريبة",
    "Contactless Payment": "الدفع بدون تلامس",
    "Online Payments": "المدفوعات الإلكترونية",
    "Merchant": "التاجر",
    "Merchant Name": "اسم التاجر",
    "Cashback": "استرداد نقدي",
    "Rewards": "المكافآت",
    "Reward Points": "نقاط المكافآت",
    "Redeem Points": "استبدال النقاط",
    "Offers": "العروض",
    "Promotions": "العروض الترويجية",
    "Personal Finance": "التمويل الشخصي",
    "Financial Overview": "نظرة عامة مالية",
    "Income": "الدخل",
    "Spending": "الإنفاق",
    "Spending Breakdown": "تفصيل الإنفاق",
    "Spending Categories": "فئات الإنفاق",
    "Budgets": "الميزانيات",
    "Create Budget": "إنشاء ميزانية",
    "Budget Limit": "حد الميزانية",
    "Budget Progress": "تقدم الميزانية",
    "Over Budget": "تجاوز الميزانية",
    "Savings Goal": "هدف الادخار",
    "Savings Goals": "أهداف الادخار",
    "Set a Goal": "تحديد هدف",
    "Goal Progress": "تقدم الهدف",
    "Financial Goals": "الأهداف المالية",
    "Net Worth": "صافي الثروة",
    "Investments": "الاستثمارات",
    "Investment Portfolio": "محفظة الاستثمار",
    "Portfolio Value": "قيمة المحفظة",
    "Stocks": "الأسهم",
    "Stock Price": "سعر السهم",
    "Shares": "الأسهم المملوكة",
    "Bonds": "السندات",
    "Mutual Funds": "صناديق الاستثمار المشتركة",
    "Crypto": "العملات الرقمية",
    "Cryptocurrency": "العملة الرقمية",
    "Market Value": "القيمة السوقية",
    "Buy Investment": "شراء استثمار",
    "Sell Investment": "بيع استثمار",
    "Buy Order": "أمر شراء",
    "Sell Order": "أمر بيع",
    "Market Order": "أمر سوق",
    "Limit Order": "أمر محدد السعر",
    "Order History": "سجل الطلبات",
    "Investment Return": "عائد الاستثمار",
    "Profit and Loss": "الأرباح والخسائر",
    "Risk Level": "مستوى المخاطر",
    "Low Risk": "مخاطر منخفضة",
    "Medium Risk": "مخاطر متوسطة",
    "High Risk": "مخاطر مرتفعة",
    "Loan": "قرض",
    "Loans": "القروض",
    "Personal Loan": "قرض شخصي",
    "Home Loan": "قرض سكني",
    "Auto Loan": "قرض سيارة",
    "Loan Amount": "مبلغ القرض",
    "Loan Term": "مدة القرض",
    "Interest Rate": "سعر الفائدة",
    "Annual Percentage Rate": "النسبة المئوية السنوية",
    "Monthly Payment": "القسط الشهري",
    "Loan Eligibility": "أهلية القرض",
    "Apply for a Loan": "التقدم بطلب قرض",
    "Loan Application": "طلب القرض",
    "Application Status": "حالة الطلب",
    "Repayment": "السداد",
    "Payment Due": "موعد استحقاق الدفع",
    "Due Amount": "المبلغ المستحق",
    "Make a Payment": "إجراء دفعة",
    "Early Repayment": "السداد المبكر",
    "Financial Reports": "التقارير المالية",
    "Balance Sheet": "الميزانية العمومية",
    "Financial Summary": "الملخص المالي",
    "Fees": "الرسوم",
    "Service Fee": "رسوم الخدمة",
    "Processing Fee": "رسوم المعالجة",
    "No Fees": "بدون رسوم",
    "Fee Breakdown": "تفصيل الرسوم",
    "Security Settings": "إعدادات الأمان",
    "Security Alert": "تنبيه أمني",
    "Suspicious Activity": "نشاط مشبوه",
    "Fraud Alert": "تنبيه احتيال",
    "Secure Login": "تسجيل دخول آمن",
    "Biometric Login": "تسجيل الدخول بالبصمة",
    "Face ID": "التعرف على الوجه",
    "Fingerprint ID": "بصمة الإصبع",
    "Trusted Device": "جهاز موثوق",
    "Verification": "التحقق",
    "Verify Identity": "التحقق من الهوية",
    "Identity Verification": "التحقق من الهوية",
    "National ID": "الهوية الوطنية",
    "Identity Document": "وثيقة الهوية",
    "Proof of Address": "إثبات العنوان",
    "One-Time Password": "رمز مرور لمرة واحدة",
    "OTP": "رمز التحقق لمرة واحدة",
    "Resend Code": "إعادة إرسال الرمز",
    "Code Expired": "انتهت صلاحية الرمز",
    "Secure Your Account": "أمّن حسابك",
    "Privacy and Security": "الخصوصية والأمان",
    "Login History": "سجل تسجيل الدخول",
    "Sign Out All Devices": "تسجيل الخروج من جميع الأجهزة",
    "E-Commerce": "التجارة الإلكترونية",
    "Online Store": "المتجر الإلكتروني",
    "Marketplace": "السوق الإلكتروني",
    "Shop": "المتجر",
    "Shopping": "التسوق",
    "Shop Now": "تسوق الآن",
    "Browse Products": "تصفح المنتجات",
    "Product": "المنتج",
    "Products": "المنتجات",
    "Product Details": "تفاصيل المنتج",
    "Product Description": "وصف المنتج",
    "Product Information": "معلومات المنتج",
    "Product Images": "صور المنتج",
    "Product Video": "فيديو المنتج",
    "Product Code": "رمز المنتج",
    "Barcode": "الباركود",
    "Brand": "العلامة التجارية",
    "Brands": "العلامات التجارية",
    "Category": "الفئة",
    "Subcategory": "الفئة الفرعية",
    "Collection": "المجموعة",
    "Collections": "المجموعات",
    "New Arrivals": "وصل حديثًا",
    "Best Sellers": "الأكثر مبيعًا",
    "Featured Products": "منتجات مميزة",
    "Recommended Products": "منتجات موصى بها",
    "Related Products": "منتجات ذات صلة",
    "Recently Viewed": "شوهد مؤخرًا",
    "Popular Products": "المنتجات الشائعة",
    "Trending": "الأكثر رواجًا",
    "Limited Edition": "إصدار محدود",
    "Exclusive": "حصري",
    "Pre-Order": "طلب مسبق",
    "Search Products": "البحث عن المنتجات",
    "Search Store": "البحث في المتجر",
    "Search by Brand": "البحث حسب العلامة التجارية",
    "Search by Category": "البحث حسب الفئة",
    "No Products Found": "لم يتم العثور على منتجات",
    "Filter Products": "تصفية المنتجات",
    "Filter by Price": "تصفية حسب السعر",
    "Filter by Brand": "تصفية حسب العلامة التجارية",
    "Filter by Rating": "تصفية حسب التقييم",
    "Filter by Availability": "تصفية حسب التوفر",
    "Price Range": "نطاق السعر",
    "Minimum Price": "الحد الأدنى للسعر",
    "Maximum Price": "الحد الأقصى للسعر",
    "Lowest Price": "الأقل سعرًا",
    "Highest Price": "الأعلى سعرًا",
    "Price Drop": "انخفاض السعر",
    "On Sale": "ضمن التخفيضات",
    "Sale Price": "سعر التخفيض",
    "Original Price": "السعر الأصلي",
    "Compare Prices": "مقارنة الأسعار",
    "Add to Wishlist": "إضافة إلى قائمة الرغبات",
    "Remove from Wishlist": "إزالة من قائمة الرغبات",
    "Wishlist": "قائمة الرغبات",
    "Wishlists": "قوائم الرغبات",
    "Notify Me": "أبلغني",
    "Notify When Available": "أبلغني عند التوفر",
    "Back in Stock": "عاد إلى المخزون",
    "Available": "متوفر",
    "Unavailable": "غير متوفر",
    "Quantity": "الكمية",
    "Increase Quantity": "زيادة الكمية",
    "Decrease Quantity": "تقليل الكمية",
    "Remove Item": "إزالة العنصر",
    "Update Cart": "تحديث السلة",
    "Shopping Cart": "سلة التسوق",
    "Cart Summary": "ملخص السلة",
    "Your Cart Is Empty": "سلة التسوق فارغة",
    "Continue Shopping": "متابعة التسوق",
    "Proceed to Checkout": "المتابعة إلى الدفع",
    "Secure Checkout": "دفع آمن",
    "Checkout Details": "تفاصيل الدفع",
    "Guest Checkout": "الدفع كزائر",
    "Express Checkout": "الدفع السريع",
    "Contact Information": "معلومات التواصل",
    "Shipping Information": "معلومات الشحن",
    "Shipping Method": "طريقة الشحن",
    "Shipping Options": "خيارات الشحن",
    "Standard Shipping": "الشحن العادي",
    "Express Shipping": "الشحن السريع",
    "Free Shipping": "شحن مجاني",
    "Same-Day Delivery": "توصيل في نفس اليوم",
    "Next-Day Delivery": "توصيل في اليوم التالي",
    "Estimated Delivery": "التوصيل المتوقع",
    "Delivery Date": "تاريخ التوصيل",
    "Delivery Time": "وقت التوصيل",
    "Delivery Window": "الفترة الزمنية للتوصيل",
    "Shipping Cost": "تكلفة الشحن",
    "Use Same Address": "استخدام العنوان نفسه",
    "Add New Address": "إضافة عنوان جديد",
    "Saved Addresses": "العناوين المحفوظة",
    "Default Address": "العنوان الافتراضي",
    "Apartment Number": "رقم الشقة",
    "Building Number": "رقم المبنى",
    "Street Address": "عنوان الشارع",
    "Postal Code": "الرمز البريدي",
    "City": "المدينة",
    "State": "المنطقة",
    "Country": "الدولة",
    "Delivery Instructions": "تعليمات التوصيل",
    "Leave at Door": "اترك الطلب عند الباب",
    "Contactless Delivery": "توصيل بدون تلامس",
    "Order": "الطلب",
    "Place Order": "تأكيد الطلب",
    "Order Confirmation": "تأكيد الطلب",
    "Order Confirmed": "تم تأكيد الطلب",
    "Order Details": "تفاصيل الطلب",
    "Order Total": "إجمالي الطلب",
    "Order Date": "تاريخ الطلب",
    "Track Order": "تتبع الطلب",
    "Track Shipment": "تتبع الشحنة",
    "Shipment": "الشحنة",
    "Shipments": "الشحنات",
    "Shipment Number": "رقم الشحنة",
    "Tracking Link": "رابط التتبع",
    "Courier": "مندوب التوصيل",
    "Delivery Driver": "مندوب التوصيل",
    "Preparing Order": "جاري تجهيز الطلب",
    "Order Processing": "جاري معالجة الطلب",
    "Ready for Shipment": "جاهز للشحن",
    "Shipped": "تم الشحن",
    "Out for Delivery": "خرج للتوصيل",
    "Delivered": "تم التوصيل",
    "Delivery Attempted": "تمت محاولة التوصيل",
    "Delayed": "متأخر",
    "Canceled": "ملغى",
    "Partially Shipped": "تم شحن جزء من الطلب",
    "Payment Failed": "فشل الدفع",
    "Payment Successful": "تم الدفع بنجاح",
    "Payment Pending": "الدفع قيد الانتظار",
    "Choose Payment Method": "اختر طريقة الدفع",
    "Cash on Delivery": "الدفع عند التوصيل",
    "Pay Now": "ادفع الآن",
    "Pay Later": "ادفع لاحقًا",
    "Save Payment Method": "حفظ طريقة الدفع",
    "Apply Discount": "تطبيق الخصم",
    "Discount Code": "رمز الخصم",
    "Promo Code": "الرمز الترويجي",
    "Enter Promo Code": "أدخل الرمز الترويجي",
    "Promo Applied": "تم تطبيق الرمز الترويجي",
    "Invalid Promo Code": "الرمز الترويجي غير صالح",
    "Expired Coupon": "القسيمة منتهية الصلاحية",
    "Minimum Order": "الحد الأدنى للطلب",
    "Offer Ends Soon": "ينتهي العرض قريبًا",
    "Flash Sale": "تخفيضات سريعة",
    "Daily Deals": "عروض يومية",
    "Deal of the Day": "عرض اليوم",
    "Bundle": "حزمة",
    "Bundles": "الحزم",
    "Buy One Get One": "اشترِ واحدًا واحصل على الآخر",
    "Gift Card": "بطاقة هدية",
    "Gift Cards": "بطاقات الهدايا",
    "Gift Wrap": "تغليف الهدايا",
    "Gift Message": "رسالة الهدية",
    "Reviews": "المراجعات",
    "Review": "مراجعة",
    "Customer Reviews": "مراجعات العملاء",
    "Write a Review": "اكتب مراجعة",
    "Your Review": "مراجعتك",
    "Verified Purchase": "شراء موثق",
    "Helpful": "مفيد",
    "Was This Helpful?": "هل كان هذا مفيدًا؟",
    "Customer Rating": "تقييم العملاء",
    "Average Rating": "متوسط التقييم",
    "Ratings and Reviews": "التقييمات والمراجعات",
    "Questions and Answers": "الأسئلة والأجوبة",
    "Ask a Question": "طرح سؤال",
    "Seller": "البائع",
    "Sellers": "البائعون",
    "Sold By": "يباع بواسطة",
    "Seller Information": "معلومات البائع",
    "Seller Rating": "تقييم البائع",
    "Contact Seller": "تواصل مع البائع",
    "Become a Seller": "كن بائعًا",
    "Seller Dashboard": "لوحة تحكم البائع",
    "Manage Products": "إدارة المنتجات",
    "Add Product": "إضافة منتج",
    "Edit Product": "تعديل المنتج",
    "Product Variants": "خيارات المنتج",
    "Product Options": "خيارات المنتج",
    "Size": "المقاس",
    "Color Options": "خيارات اللون",
    "Inventory Management": "إدارة المخزون",
    "Restock": "إعادة التخزين",
    "Low Stock Alert": "تنبيه انخفاض المخزون",
    "Warehouse": "المستودع",
    "Returns": "المرتجعات",
    "Return Item": "إرجاع المنتج",
    "Return Request": "طلب إرجاع",
    "Return Policy": "سياسة الإرجاع",
    "Return Reason": "سبب الإرجاع",
    "Refund Status": "حالة الاسترداد",
    "Exchange Item": "استبدال المنتج",
    "Exchange Request": "طلب استبدال",
    "Customer Support": "دعم العملاء",
    "Help with an Order": "المساعدة بشأن طلب",
    "Live Chat": "محادثة مباشرة",
    "Chat with Support": "الدردشة مع الدعم",
    "Frequently Asked Questions": "الأسئلة الشائعة",
    "Store Policies": "سياسات المتجر",
    "Shipping Policy": "سياسة الشحن",
    "Terms of Sale": "شروط البيع",
    "Education": "التعليم",
    "Learning": "التعلم",
    "E-Learning": "التعلم الإلكتروني",
    "Online Learning": "التعلم عبر الإنترنت",
    "Learning Platform": "منصة التعلم",
    "Learning Dashboard": "لوحة التعلم",
    "Student": "الطالب",
    "Students": "الطلاب",
    "Teacher": "المعلم",
    "Teachers": "المعلمون",
    "Instructor": "المدرس",
    "Instructors": "المدرسون",
    "Tutor": "المدرس الخصوصي",
    "Parent": "ولي الأمر",
    "Parents": "أولياء الأمور",
    "School": "المدرسة",
    "Schools": "المدارس",
    "University": "الجامعة",
    "College": "الكلية",
    "Academy": "الأكاديمية",
    "Classroom": "الفصل الدراسي",
    "Classrooms": "الفصول الدراسية",
    "Class": "الصف",
    "Course": "الدورة",
    "Courses": "الدورات",
    "My Courses": "دوراتي",
    "Course Catalog": "دليل الدورات",
    "Course Overview": "نظرة عامة على الدورة",
    "Course Description": "وصف الدورة",
    "Course Content": "محتوى الدورة",
    "Course Curriculum": "منهج الدورة",
    "Course Instructor": "مدرس الدورة",
    "Course Level": "مستوى الدورة",
    "Beginner": "مبتدئ",
    "Intermediate": "متوسط",
    "Advanced": "متقدم",
    "All Levels": "جميع المستويات",
    "Subject": "المادة",
    "Subjects": "المواد",
    "Lesson": "الدرس",
    "Module": "الوحدة",
    "Modules": "الوحدات",
    "Topic": "الموضوع",
    "Topics": "المواضيع",
    "Learning Path": "مسار التعلم",
    "Learning Plan": "خطة التعلم",
    "Study Plan": "خطة الدراسة",
    "Study Schedule": "جدول الدراسة",
    "Learning Goals": "أهداف التعلم",
    "Learning Objectives": "أهداف التعلم",
    "Skills": "المهارات",
    "Skill Level": "مستوى المهارة",
    "Prerequisites": "المتطلبات السابقة",
    "Enrollment": "التسجيل",
    "Enroll Now": "سجل الآن",
    "Enrolled": "مسجل",
    "Enrollment Date": "تاريخ التسجيل",
    "Start Learning": "ابدأ التعلم",
    "Continue Learning": "متابعة التعلم",
    "Resume Course": "متابعة الدورة",
    "Course Progress": "تقدم الدورة",
    "Learning Progress": "تقدم التعلم",
    "Progress Percentage": "نسبة التقدم",
    "Completed Lessons": "الدروس المكتملة",
    "Remaining Lessons": "الدروس المتبقية",
    "Mark as Complete": "تحديد كمكتمل",
    "Not Started": "لم يبدأ",
    "Locked": "مقفل",
    "Unlocked": "مفتوح",
    "Video Lecture": "محاضرة فيديو",
    "Lecture": "محاضرة",
    "Live Class": "حصة مباشرة",
    "Virtual Classroom": "فصل افتراضي",
    "Join Class": "الانضمام إلى الفصل",
    "Start Class": "بدء الفصل",
    "Class Schedule": "جدول الحصص",
    "Office Hours": "ساعات العمل",
    "Live Session": "جلسة مباشرة",
    "Upcoming Sessions": "الجلسات القادمة",
    "Recorded Lesson": "درس مسجل",
    "Playback": "التشغيل",
    "Video Progress": "تقدم الفيديو",
    "Transcript": "النص المكتوب",
    "Captions": "الترجمة النصية",
    "Subtitles": "الترجمة",
    "Download Lesson": "تنزيل الدرس",
    "Offline Learning": "التعلم دون اتصال",
    "Resources": "المصادر",
    "Learning Materials": "المواد التعليمية",
    "Study Materials": "المواد الدراسية",
    "Reading Material": "المادة القرائية",
    "Reference Material": "المادة المرجعية",
    "Download Resources": "تنزيل المصادر",
    "Open Resource": "فتح المصدر",
    "Assignment": "الواجب",
    "Assignments": "الواجبات",
    "Homework": "الواجب المنزلي",
    "Submit Assignment": "تسليم الواجب",
    "Assignment Details": "تفاصيل الواجب",
    "Assignment Due Date": "موعد تسليم الواجب",
    "Due Soon": "يستحق قريبًا",
    "Late Submission": "تسليم متأخر",
    "Submitted": "تم التسليم",
    "Not Submitted": "لم يتم التسليم",
    "Draft Submission": "مسودة التسليم",
    "Attach File": "إرفاق ملف",
    "Upload Assignment": "رفع الواجب",
    "Teacher Feedback": "ملاحظات المعلم",
    "Instructor Feedback": "ملاحظات المدرس",
    "Feedback Comments": "تعليقات الملاحظات",
    "Revision Required": "تحتاج إلى مراجعة",
    "Test": "اختبار",
    "Tests": "الاختبارات",
    "Exam": "امتحان",
    "Exams": "الامتحانات",
    "Practice Test": "اختبار تدريبي",
    "Final Exam": "الامتحان النهائي",
    "Midterm Exam": "امتحان منتصف الفصل",
    "Take Quiz": "بدء الاختبار القصير",
    "Start Exam": "بدء الامتحان",
    "Submit Quiz": "تسليم الاختبار",
    "Submit Exam": "تسليم الامتحان",
    "Quiz Instructions": "تعليمات الاختبار",
    "Exam Instructions": "تعليمات الامتحان",
    "Time Limit": "الوقت المحدد",
    "Question": "السؤال",
    "Questions": "الأسئلة",
    "Multiple Choice": "اختيار من متعدد",
    "Single Choice": "اختيار واحد",
    "True or False": "صح أو خطأ",
    "Short Answer": "إجابة قصيرة",
    "Essay Question": "سؤال مقالي",
    "Answer": "الإجابة",
    "Your Answer": "إجابتك",
    "Correct Answer": "الإجابة الصحيحة",
    "Answer Explanation": "شرح الإجابة",
    "Retry Quiz": "إعادة الاختبار",
    "Quiz Results": "نتائج الاختبار",
    "Exam Results": "نتائج الامتحان",
    "Score": "الدرجة",
    "Grade": "التقدير",
    "Grades": "الدرجات",
    "Marks": "العلامات",
    "Percentage": "النسبة المئوية",
    "Passing Score": "درجة النجاح",
    "Passed": "ناجح",
    "Failed": "راسب",
    "Your Result": "نتيجتك",
    "Class Average": "متوسط الفصل",
    "Leaderboard": "لوحة المتصدرين",
    "Rank": "الترتيب",
    "Certificate": "الشهادة",
    "Certificates": "الشهادات",
    "Certificate of Completion": "شهادة إتمام",
    "Earned Certificate": "الشهادة المكتسبة",
    "Download Certificate": "تنزيل الشهادة",
    "Share Certificate": "مشاركة الشهادة",
    "Issue Certificate": "إصدار الشهادة",
    "Certificate ID": "معرّف الشهادة",
    "Attendance": "الحضور",
    "Attendance Record": "سجل الحضور",
    "Present": "حاضر",
    "Absent": "غائب",
    "Late": "متأخر",
    "Excused Absence": "غياب بعذر",
    "Attendance Rate": "نسبة الحضور",
    "Calendar": "التقويم",
    "Academic Calendar": "التقويم الدراسي",
    "Semester": "الفصل الدراسي",
    "Term": "الفصل الدراسي",
    "Academic Year": "السنة الدراسية",
    "Schedule": "الجدول",
    "Timetable": "الجدول الدراسي",
    "Today’s Classes": "حصص اليوم",
    "Upcoming": "القادم",
    "Announcements": "الإعلانات",
    "Announcement": "إعلان",
    "Notice Board": "لوحة الإعلانات",
    "Discussion": "النقاش",
    "Discussions": "النقاشات",
    "Discussion Board": "لوحة النقاش",
    "Forum": "المنتدى",
    "Forums": "المنتديات",
    "Reply": "الرد",
    "Replies": "الردود",
    "Study Group": "مجموعة دراسية",
    "Classmates": "زملاء الدراسة",
    "Direct Message": "رسالة مباشرة",
    "Send Message": "إرسال رسالة",
    "Learning Reminder": "تذكير بالتعلم",
    "Study Reminder": "تذكير بالدراسة",
    "Daily Streak": "سلسلة يومية",
    "Study Streak": "سلسلة الدراسة",
    "Study Time": "وقت الدراسة",
    "Learning Statistics": "إحصاءات التعلم",
    "Time Spent Learning": "الوقت المستغرق في التعلم",
    "Achievements": "الإنجازات",
    "Badges": "الشارات",
    "Earned Badges": "الشارات المكتسبة",
    "Points": "النقاط",
    "XP": "نقاط الخبرة",
    "Level Up": "الارتقاء بالمستوى",
    "Education Settings": "إعدادات التعليم",
    "Language of Instruction": "لغة التدريس",
    "Learning Preferences": "تفضيلات التعلم",
    "Accessibility Tools": "أدوات إمكانية الوصول",
    "Text-to-Speech": "تحويل النص إلى كلام",
    "Speech-to-Text": "تحويل الكلام إلى نص",
    "Ask the Instructor": "اسأل المدرس",
    "Contact Instructor": "التواصل مع المدرس",
    "Manage Students": "إدارة الطلاب",
    "Manage Classes": "إدارة الفصول",
    "Create Course": "إنشاء دورة",
    "Edit Course": "تعديل الدورة",
    "Publish Course": "نشر الدورة",
    "Unpublish Course": "إلغاء نشر الدورة",
    "Course Analytics": "تحليلات الدورة",
    "Student Progress": "تقدم الطالب",
    "Gradebook": "دفتر الدرجات",
    "Enter Grades": "إدخال الدرجات",
    "Export Grades": "تصدير الدرجات",
    "Parent Portal": "بوابة ولي الأمر",
    "Student Portal": "بوابة الطالب",
    "Teacher Portal": "بوابة المعلم",
    "Artificial Intelligence": "الذكاء الاصطناعي",
    "AI": "الذكاء الاصطناعي",
    "AI Assistant": "مساعد الذكاء الاصطناعي",
    "AI App": "تطبيق الذكاء الاصطناعي",
    "AI Tools": "أدوات الذكاء الاصطناعي",
    "AI Workspace": "مساحة عمل الذكاء الاصطناعي",
    "AI Model": "نموذج الذكاء الاصطناعي",
    "AI Models": "نماذج الذكاء الاصطناعي",
    "Model": "النموذج",
    "Models": "النماذج",
    "Language Model": "النموذج اللغوي",
    "Large Language Model": "نموذج لغوي كبير",
    "Foundation Model": "النموذج الأساسي",
    "Multimodal Model": "نموذج متعدد الوسائط",
    "Open Source Model": "نموذج مفتوح المصدر",
    "Model Provider": "مزود النموذج",
    "Model Version": "إصدار النموذج",
    "Select Model": "اختر النموذج",
    "Default Model": "النموذج الافتراضي",
    "Recommended Model": "النموذج الموصى به",
    "Model Settings": "إعدادات النموذج",
    "Model Parameters": "معلمات النموذج",
    "Temperature": "درجة العشوائية",
    "Top P": "قيمة Top P",
    "Max Tokens": "الحد الأقصى للرموز",
    "Context Window": "نافذة السياق",
    "Context Length": "طول السياق",
    "Reasoning Effort": "جهد الاستدلال",
    "Response Length": "طول الاستجابة",
    "Creativity": "الإبداع",
    "Accuracy": "الدقة",
    "Latency": "زمن الاستجابة",
    "Prompt": "المطالبة",
    "Prompts": "المطالبات",
    "Prompt Library": "مكتبة المطالبات",
    "Prompt Template": "قالب المطالبة",
    "Prompt Builder": "منشئ المطالبات",
    "System Prompt": "المطالبة النظامية",
    "User Prompt": "مطالبة المستخدم",
    "Prompt History": "سجل المطالبات",
    "Prompt Version": "إصدار المطالبة",
    "Prompt Variables": "متغيرات المطالبة",
    "Prompt Engineering": "هندسة المطالبات",
    "Prompt Instructions": "تعليمات المطالبة",
    "Conversation": "المحادثة",
    "Conversations": "المحادثات",
    "New Conversation": "محادثة جديدة",
    "Chat History": "سجل المحادثات",
    "Chat Assistant": "مساعد المحادثة",
    "AI Chat": "محادثة الذكاء الاصطناعي",
    "Start Chat": "بدء المحادثة",
    "Continue Chat": "متابعة المحادثة",
    "Regenerate Response": "إعادة إنشاء الاستجابة",
    "Regenerate": "إعادة الإنشاء",
    "Stop Generating": "إيقاف الإنشاء",
    "New Response": "استجابة جديدة",
    "Copy Response": "نسخ الاستجابة",
    "Good Response": "استجابة جيدة",
    "Bad Response": "استجابة غير جيدة",
    "Helpful Response": "استجابة مفيدة",
    "Not Helpful": "غير مفيد",
    "Rate Response": "تقييم الاستجابة",
    "Share Conversation": "مشاركة المحادثة",
    "Rename Conversation": "إعادة تسمية المحادثة",
    "Delete Conversation": "حذف المحادثة",
    "Clear Conversation": "مسح المحادثة",
    "Ask Anything": "اسأل أي شيء",
    "Type a Message": "اكتب رسالة",
    "Enter Your Prompt": "أدخل مطالبتك",
    "Attach an Image": "إرفاق صورة",
    "Attach a File": "إرفاق ملف",
    "Upload File": "رفع ملف",
    "Uploaded Files": "الملفات المرفوعة",
    "File Analysis": "تحليل الملف",
    "Document Analysis": "تحليل المستند",
    "Image Analysis": "تحليل الصورة",
    "Vision": "الرؤية الحاسوبية",
    "Computer Vision": "الرؤية الحاسوبية",
    "OCR": "التعرف الضوئي على الحروف",
    "Extract Text": "استخراج النص",
    "Summarize": "تلخيص",
    "Summary": "الملخص",
    "Summarize Document": "تلخيص المستند",
    "Rewrite": "إعادة الصياغة",
    "Paraphrase": "إعادة صياغة",
    "Expand Text": "توسيع النص",
    "Shorten Text": "اختصار النص",
    "Proofread": "تدقيق لغوي",
    "Improve Writing": "تحسين الكتابة",
    "Translate with AI": "الترجمة بالذكاء الاصطناعي",
    "Generate Text": "إنشاء نص",
    "Text Generation": "توليد النصوص",
    "Content Generator": "منشئ المحتوى",
    "Generate Ideas": "إنشاء أفكار",
    "Brainstorm": "العصف الذهني",
    "Write for Me": "اكتب لي",
    "Complete the Text": "إكمال النص",
    "Continue Writing": "متابعة الكتابة",
    "Tone": "نبرة الكتابة",
    "Professional Tone": "نبرة احترافية",
    "Friendly Tone": "نبرة ودية",
    "Formal Tone": "نبرة رسمية",
    "Creative Tone": "نبرة إبداعية",
    "Image Generation": "توليد الصور",
    "Generate Image": "إنشاء صورة",
    "Image Generator": "منشئ الصور",
    "Image Prompt": "مطالبة الصورة",
    "Image Style": "نمط الصورة",
    "Art Style": "الأسلوب الفني",
    "Image Size": "حجم الصورة",
    "Aspect Ratio": "نسبة العرض إلى الارتفاع",
    "Portrait": "عمودي",
    "Landscape": "أفقي",
    "Square": "مربع",
    "Upscale": "تحسين الدقة",
    "Enhance Image": "تحسين الصورة",
    "Remove Background": "إزالة الخلفية",
    "Replace Background": "استبدال الخلفية",
    "Image Editor": "محرر الصور",
    "Edit Image": "تعديل الصورة",
    "Image Variations": "تنويعات الصورة",
    "Reference Image": "صورة مرجعية",
    "Negative Prompt": "المطالبة السلبية",
    "Generate Variations": "إنشاء تنويعات",
    "Video Generation": "توليد الفيديو",
    "Generate Video": "إنشاء فيديو",
    "Video Prompt": "مطالبة الفيديو",
    "Video Duration": "مدة الفيديو",
    "Frame Rate": "معدل الإطارات",
    "Motion": "الحركة",
    "Text to Video": "تحويل النص إلى فيديو",
    "Image to Video": "تحويل الصورة إلى فيديو",
    "Audio Generation": "توليد الصوت",
    "Voice Generation": "توليد الصوت البشري",
    "Text to Speech": "تحويل النص إلى كلام",
    "Speech to Text": "تحويل الكلام إلى نص",
    "Voice Input": "الإدخال الصوتي",
    "Voice Output": "الإخراج الصوتي",
    "Select Voice": "اختر الصوت",
    "Voice Settings": "إعدادات الصوت",
    "Voice Cloning": "استنساخ الصوت",
    "Transcription": "التفريغ الصوتي",
    "Audio Transcription": "تفريغ الصوت",
    "Real-Time Transcription": "التفريغ الفوري",
    "Noise Cancellation": "إلغاء الضوضاء",
    "Music Generation": "توليد الموسيقى",
    "Sound Effects": "المؤثرات الصوتية",
    "Code Generation": "توليد الكود",
    "Code Assistant": "مساعد البرمجة",
    "Code Completion": "إكمال الكود",
    "Generate Code": "إنشاء كود",
    "Explain Code": "شرح الكود",
    "Fix Code": "إصلاح الكود",
    "Debug Code": "تصحيح أخطاء الكود",
    "Refactor Code": "إعادة هيكلة الكود",
    "Run Code": "تشغيل الكود",
    "Preview Code": "معاينة الكود",
    "API Key": "مفتاح API",
    "API Usage": "استخدام API",
    "API Request": "طلب API",
    "API Response": "استجابة API",
    "Webhook": "خطاف الويب",
    "Integration": "تكامل",
    "Connect Provider": "ربط المزود",
    "Knowledge Base": "قاعدة المعرفة",
    "Knowledge Bases": "قواعد المعرفة",
    "Add Knowledge": "إضافة معرفة",
    "Train Model": "تدريب النموذج",
    "Fine-Tuning": "الضبط الدقيق",
    "Fine-Tuned Model": "نموذج مضبوط بدقة",
    "Training Data": "بيانات التدريب",
    "Dataset": "مجموعة البيانات",
    "Datasets": "مجموعات البيانات",
    "Data Source": "مصدر البيانات",
    "Retrieval": "الاسترجاع",
    "Semantic Search": "البحث الدلالي",
    "Vector Search": "البحث المتجهي",
    "Embeddings": "التضمينات",
    "RAG": "التوليد المعزز بالاسترجاع",
    "Grounded Response": "استجابة مستندة إلى المصادر",
    "Citations": "المراجع",
    "Sources": "المصادر",
    "Source Documents": "المستندات المصدرية",
    "Agent": "الوكيل الذكي",
    "AI Agent": "وكيل الذكاء الاصطناعي",
    "Agents": "الوكلاء الأذكياء",
    "Agent Workflow": "سير عمل الوكيل",
    "Agent Instructions": "تعليمات الوكيل",
    "Tools": "الأدوات",
    "Tool Calling": "استدعاء الأدوات",
    "Actions": "الإجراءات",
    "Automations": "الأتمتة",
    "Workflow": "سير العمل",
    "Workflows": "سير العمل",
    "Trigger": "المشغل",
    "Triggers": "المشغلات",
    "Task": "المهمة",
    "Run Agent": "تشغيل الوكيل",
    "Agent Memory": "ذاكرة الوكيل",
    "Short-Term Memory": "الذاكرة قصيرة المدى",
    "Long-Term Memory": "الذاكرة طويلة المدى",
    "Human Review": "مراجعة بشرية",
    "Approval Required": "الموافقة مطلوبة",
    "Safety": "الأمان والسلامة",
    "Content Safety": "سلامة المحتوى",
    "Safety Settings": "إعدادات السلامة",
    "Moderation": "الإشراف على المحتوى",
    "Content Filter": "مرشح المحتوى",
    "Blocked Content": "محتوى محظور",
    "Responsible AI": "الذكاء الاصطناعي المسؤول",
    "Bias": "التحيز",
    "Hallucination": "هلوسة النموذج",
    "Fact Check": "التحقق من الحقائق",
    "Verify Information": "التحقق من المعلومات",
    "AI Privacy": "خصوصية الذكاء الاصطناعي",
    "Data Retention": "الاحتفاظ بالبيانات",
    "Use Data for Training": "استخدام البيانات للتدريب",
    "Opt Out": "إلغاء الاشتراك",
    "Delete Data": "حذف البيانات",
    "Usage Limits": "حدود الاستخدام",
    "Usage Analytics": "تحليلات الاستخدام",
    "Credits": "الأرصدة",
    "Credit Balance": "رصيد الأرصدة",
    "Buy Credits": "شراء أرصدة",
    "Free Credits": "أرصدة مجانية",
    "Tokens Used": "الرموز المستخدمة",
    "Token Usage": "استخدام الرموز",
    "Cost Estimate": "تقدير التكلفة",
    "Generating": "جارٍ الإنشاء",
    "Thinking": "جارٍ التفكير",
    "Analyzing": "جارٍ التحليل",
    "AI is Thinking": "الذكاء الاصطناعي يفكر",
    "Generation Complete": "اكتمل الإنشاء",
    "Generation Failed": "فشل الإنشاء",
    "Try a Different Prompt": "جرب مطالبة مختلفة",
    "Project Management": "إدارة المشاريع",
    "Project": "المشروع",
    "My Projects": "مشاريعي",
    "Project Overview": "نظرة عامة على المشروع",
    "Project Details": "تفاصيل المشروع",
    "Project Status": "حالة المشروع",
    "Project Owner": "مالك المشروع",
    "Project Manager": "مدير المشروع",
    "Project Team": "فريق المشروع",
    "Project Members": "أعضاء المشروع",
    "Create Project": "إنشاء مشروع",
    "Edit Project": "تعديل المشروع",
    "Archive Project": "أرشفة المشروع",
    "Project Settings": "إعدادات المشروع",
    "Project Template": "قالب المشروع",
    "Project Type": "نوع المشروع",
    "Project Code": "رمز المشروع",
    "Project Timeline": "الجدول الزمني للمشروع",
    "Project Budget": "ميزانية المشروع",
    "Project Health": "حالة المشروع العامة",
    "On Track": "يسير حسب الخطة",
    "At Risk": "معرض للخطر",
    "Off Track": "خارج الخطة",
    "My Tasks": "مهامي",
    "Task List": "قائمة المهام",
    "Task Details": "تفاصيل المهمة",
    "Task Title": "عنوان المهمة",
    "Task Description": "وصف المهمة",
    "Create Task": "إنشاء مهمة",
    "Edit Task": "تعديل المهمة",
    "Delete Task": "حذف المهمة",
    "Duplicate Task": "تكرار المهمة",
    "Assign Task": "إسناد المهمة",
    "Unassigned": "غير مسندة",
    "Task Owner": "مالك المهمة",
    "Task Type": "نوع المهمة",
    "Task Priority": "أولوية المهمة",
    "Urgent Priority": "أولوية عاجلة",
    "Medium Priority": "أولوية متوسطة",
    "Task Status": "حالة المهمة",
    "Blocked": "متوقفة",
    "Completed Tasks": "المهام المكتملة",
    "Open Tasks": "المهام المفتوحة",
    "Overdue Tasks": "المهام المتأخرة",
    "Due Today": "مستحقة اليوم",
    "Due This Week": "مستحقة هذا الأسبوع",
    "Start Task": "بدء المهمة",
    "Complete Task": "إكمال المهمة",
    "Reopen Task": "إعادة فتح المهمة",
    "Mark as Done": "تحديد كمكتملة",
    "Task Dependencies": "اعتماديات المهام",
    "Depends On": "يعتمد على",
    "Subtask": "مهمة فرعية",
    "Subtasks": "المهام الفرعية",
    "Parent Task": "المهمة الرئيسية",
    "Checklist": "قائمة التحقق",
    "Checklist Item": "عنصر في قائمة التحقق",
    "Milestone": "مرحلة رئيسية",
    "Milestones": "المراحل الرئيسية",
    "Deliverable": "المخرج المطلوب",
    "Deliverables": "المخرجات المطلوبة",
    "Epic": "مهمة كبرى",
    "User Story": "قصة المستخدم",
    "Issue": "مشكلة",
    "Issues": "المشكلات",
    "Bug": "خلل برمجي",
    "Bugs": "الأخطاء البرمجية",
    "Feature": "ميزة",
    "Backlog": "قائمة الأعمال المتراكمة",
    "Product Backlog": "قائمة أعمال المنتج",
    "Sprint": "الدورة التطويرية",
    "Sprint Planning": "تخطيط الدورة التطويرية",
    "Sprint Review": "مراجعة الدورة التطويرية",
    "Daily Standup": "الاجتماع اليومي",
    "Kanban Board": "لوحة كانبان",
    "Board View": "عرض اللوحة",
    "List View": "عرض القائمة",
    "Timeline View": "عرض الجدول الزمني",
    "Calendar View": "عرض التقويم",
    "Gantt Chart": "مخطط جانت",
    "Roadmap": "خارطة الطريق",
    "Product Roadmap": "خارطة طريق المنتج",
    "Timeline": "الجدول الزمني",
    "Estimated Time": "الوقت المقدر",
    "Time Tracking": "تتبع الوقت",
    "Time Spent": "الوقت المستغرق",
    "Log Time": "تسجيل الوقت",
    "Workload": "عبء العمل",
    "Capacity": "القدرة الاستيعابية",
    "Team Workload": "عبء عمل الفريق",
    "Resource Planning": "تخطيط الموارد",
    "Resource Allocation": "توزيع الموارد",
    "Time Estimate": "تقدير الوقت",
    "Hours Remaining": "الساعات المتبقية",
    "Budget Tracking": "تتبع الميزانية",
    "Cost Tracking": "تتبع التكلفة",
    "Dependencies": "الاعتماديات",
    "Risk": "المخاطر",
    "Risks": "المخاطر",
    "Risk Register": "سجل المخاطر",
    "Risk Owner": "مسؤول المخاطر",
    "Project Reports": "تقارير المشاريع",
    "Progress Report": "تقرير التقدم",
    "Status Report": "تقرير الحالة",
    "Team Performance": "أداء الفريق",
    "Activity Feed": "موجز النشاط",
    "Comments": "التعليقات",
    "Comment on Task": "التعليق على المهمة",
    "Mention": "إشارة",
    "Mentions": "الإشارات",
    "Watch Task": "متابعة المهمة",
    "Following": "المتابعة",
    "Followers": "المتابعون",
    "Teams": "الفرق",
    "Workspace Members": "أعضاء مساحة العمل",
    "Invite to Project": "دعوة إلى المشروع",
    "Team Permissions": "صلاحيات الفريق",
    "CRM": "إدارة علاقات العملاء",
    "Customer Relationship Management": "إدارة علاقات العملاء",
    "Customer": "العميل",
    "Contact": "جهة الاتصال",
    "Contacts": "جهات الاتصال",
    "Lead": "عميل محتمل",
    "Leads": "العملاء المحتملون",
    "Prospect": "عميل مرتقب",
    "Prospects": "العملاء المرتقبون",
    "Account": "حساب العميل",
    "Accounts": "حسابات العملاء",
    "Opportunity": "فرصة مبيعات",
    "Opportunities": "فرص المبيعات",
    "Deal": "عرض",
    "Deals": "الصفقات",
    "Pipeline": "مسار المبيعات",
    "Sales Pipeline": "مسار المبيعات",
    "Sales Funnel": "قمع المبيعات",
    "Sales Stage": "مرحلة المبيعات",
    "Deal Stage": "مرحلة الصفقة",
    "New Lead": "عميل محتمل جديد",
    "Qualified Lead": "عميل محتمل مؤهل",
    "Unqualified Lead": "عميل محتمل غير مؤهل",
    "Lead Source": "مصدر العميل المحتمل",
    "Lead Status": "حالة العميل المحتمل",
    "Lead Score": "درجة العميل المحتمل",
    "Lead Owner": "مسؤول العميل المحتمل",
    "Convert Lead": "تحويل العميل المحتمل",
    "Contact Owner": "مسؤول جهة الاتصال",
    "Company": "الشركة",
    "Companies": "الشركات",
    "Job Title": "المسمى الوظيفي",
    "Industry": "المجال",
    "Customer Profile": "ملف العميل",
    "Customer Details": "تفاصيل العميل",
    "Customer Segments": "شرائح العملاء",
    "Customer Tag": "وسم العميل",
    "Customer Notes": "ملاحظات العميل",
    "Customer Timeline": "الخط الزمني للعميل",
    "Customer Activity": "نشاط العميل",
    "Interaction": "تفاعل",
    "Interactions": "التفاعلات",
    "Call Log": "سجل المكالمات",
    "Email Log": "سجل البريد الإلكتروني",
    "Meeting": "اجتماع",
    "Meetings": "الاجتماعات",
    "Schedule Meeting": "جدولة اجتماع",
    "Follow Up": "متابعة",
    "Follow-Up Date": "تاريخ المتابعة",
    "Next Action": "الإجراء التالي",
    "Task Reminder": "تذكير بالمهمة",
    "Sales Activity": "نشاط المبيعات",
    "Sales Representative": "مندوب المبيعات",
    "Account Manager": "مدير الحساب",
    "Sales Manager": "مدير المبيعات",
    "Sales Forecast": "توقعات المبيعات",
    "Forecast Value": "قيمة التوقعات",
    "Expected Revenue": "الإيرادات المتوقعة",
    "Win Rate": "معدل الفوز",
    "Close Date": "تاريخ الإغلاق",
    "Won": "تم الفوز",
    "Lost": "خاسرة",
    "Lost Reason": "سبب الخسارة",
    "Deal Value": "قيمة الصفقة",
    "Proposal": "عرض تجاري",
    "Quote": "عرض سعر",
    "Quotes": "عروض الأسعار",
    "Contract": "العقد",
    "Contracts": "العقود",
    "Renewal": "التجديد",
    "Renewals": "التجديدات",
    "Customer Support Ticket": "تذكرة دعم العميل",
    "Support Tickets": "تذاكر الدعم",
    "Ticket Status": "حالة التذكرة",
    "Ticket Priority": "أولوية التذكرة",
    "Open Ticket": "تذكرة مفتوحة",
    "Resolve Ticket": "حل التذكرة",
    "Escalate Ticket": "تصعيد التذكرة",
    "Response Time": "وقت الاستجابة",
    "SLA": "اتفاقية مستوى الخدمة",
    "Customer Satisfaction": "رضا العملاء",
    "CSAT": "رضا العملاء",
    "NPS": "صافي نقاط الترويج",
    "Customer Feedback": "ملاحظات العملاء",
    "CRM Reports": "تقارير إدارة العملاء",
    "Sales Reports": "تقارير المبيعات",
    "Customer Analytics": "تحليلات العملاء",
    "Hospitality": "الضيافة",
    "Hotel": "الفندق",
    "Hotels": "الفنادق",
    "Resort": "المنتجع",
    "Resorts": "المنتجعات",
    "Accommodation": "الإقامة",
    "Accommodations": "أماكن الإقامة",
    "Stay": "الإقامة",
    "Stays": "الإقامات",
    "Book a Hotel": "احجز فندقًا",
    "Hotel Booking": "حجز فندق",
    "Hotel Bookings": "حجوزات الفنادق",
    "Find a Hotel": "العثور على فندق",
    "Search Hotels": "البحث عن الفنادق",
    "Search Destinations": "البحث عن الوجهات",
    "Destination": "الوجهة",
    "Destinations": "الوجهات",
    "Where Are You Going?": "إلى أين تذهب؟",
    "Check-in Date": "تاريخ تسجيل الوصول",
    "Check-out Date": "تاريخ تسجيل المغادرة",
    "Check-in Time": "وقت تسجيل الوصول",
    "Check-out Time": "وقت تسجيل المغادرة",
    "Guests": "الضيوف",
    "Guest": "ضيف",
    "Adults": "البالغون",
    "Children": "الأطفال",
    "Infants": "الرضع",
    "Rooms": "الغرف",
    "Room": "الغرفة",
    "Number of Rooms": "عدد الغرف",
    "Number of Guests": "عدد الضيوف",
    "Guests and Rooms": "الضيوف والغرف",
    "Search Availability": "البحث عن التوفر",
    "Available Rooms": "الغرف المتاحة",
    "No Availability": "لا يوجد توفر",
    "Fully Booked": "محجوز بالكامل",
    "Room Type": "نوع الغرفة",
    "Standard Room": "غرفة قياسية",
    "Deluxe Room": "غرفة فاخرة",
    "Superior Room": "غرفة سوبيريور",
    "Family Room": "غرفة عائلية",
    "Single Room": "غرفة فردية",
    "Double Room": "غرفة مزدوجة",
    "Twin Room": "غرفة بسريرين منفصلين",
    "Triple Room": "غرفة ثلاثية",
    "Suite": "جناح",
    "Junior Suite": "جناح جونيور",
    "Presidential Suite": "جناح رئاسي",
    "Connecting Rooms": "غرف متصلة",
    "Accessible Room": "غرفة مهيأة لذوي الإعاقة",
    "Room View": "إطلالة الغرفة",
    "Sea View": "إطلالة بحرية",
    "City View": "إطلالة على المدينة",
    "Garden View": "إطلالة على الحديقة",
    "Pool View": "إطلالة على المسبح",
    "Mountain View": "إطلالة جبلية",
    "Room Size": "مساحة الغرفة",
    "Bed Type": "نوع السرير",
    "King Bed": "سرير كينج",
    "Queen Bed": "سرير كوين",
    "Single Bed": "سرير فردي",
    "Extra Bed": "سرير إضافي",
    "Crib": "سرير أطفال",
    "Breakfast Included": "يشمل الإفطار",
    "Breakfast Not Included": "لا يشمل الإفطار",
    "Free Breakfast": "إفطار مجاني",
    "Half Board": "نصف إقامة",
    "Full Board": "إقامة كاملة",
    "All Inclusive": "شامل جميع الخدمات",
    "Room Only": "الغرفة فقط",
    "Price per Night": "السعر لكل ليلة",
    "Price per Room": "السعر لكل غرفة",
    "Total Price": "السعر الإجمالي",
    "Taxes and Fees": "الضرائب والرسوم",
    "Resort Fee": "رسوم المنتجع",
    "Tourism Tax": "ضريبة السياحة",
    "Service Charge": "رسوم الخدمة",
    "Price Details": "تفاصيل السعر",
    "Lowest Price Guaranteed": "ضمان أقل سعر",
    "Special Offer": "عرض خاص",
    "Early Booking Deal": "عرض الحجز المبكر",
    "Last Minute Deal": "عرض اللحظة الأخيرة",
    "Member Price": "سعر الأعضاء",
    "Flexible Rate": "سعر مرن",
    "Non-Refundable Rate": "سعر غير قابل للاسترداد",
    "Free Cancellation": "إلغاء مجاني",
    "Cancellation Policy": "سياسة الإلغاء",
    "Cancellation Fee": "رسوم الإلغاء",
    "Modify Booking": "تعديل الحجز",
    "Cancel Booking": "إلغاء الحجز",
    "Confirm Booking": "تأكيد الحجز",
    "Book Now": "احجز الآن",
    "Reserve Now": "احجز الآن",
    "Reservation": "الحجز",
    "Reservations": "الحجوزات",
    "Reservation Details": "تفاصيل الحجز",
    "Reservation Number": "رقم الحجز",
    "Booking Reference": "مرجع الحجز",
    "Confirmation Number": "رقم التأكيد",
    "Booking Confirmed": "تم تأكيد الحجز",
    "Booking Pending": "الحجز قيد الانتظار",
    "Booking Canceled": "تم إلغاء الحجز",
    "Booking Failed": "فشل الحجز",
    "Booking History": "سجل الحجوزات",
    "Upcoming Bookings": "الحجوزات القادمة",
    "Past Bookings": "الحجوزات السابقة",
    "Manage Booking": "إدارة الحجز",
    "View Booking": "عرض الحجز",
    "Download Confirmation": "تنزيل تأكيد الحجز",
    "Email Confirmation": "إرسال التأكيد بالبريد الإلكتروني",
    "Add to Calendar": "إضافة إلى التقويم",
    "Hotel Address": "عنوان الفندق",
    "Get Directions": "الحصول على الاتجاهات",
    "Distance from Center": "المسافة من المركز",
    "Nearby Attractions": "المعالم القريبة",
    "Location Map": "خريطة الموقع",
    "Hotel Information": "معلومات الفندق",
    "About the Hotel": "نبذة عن الفندق",
    "Hotel Facilities": "مرافق الفندق",
    "Amenities": "وسائل الراحة",
    "Free Wi-Fi": "واي فاي مجاني",
    "Wi-Fi Available": "واي فاي متوفر",
    "Swimming Pool": "مسبح",
    "Fitness Center": "مركز لياقة بدنية",
    "Spa": "منتجع صحي",
    "Restaurant": "المطعم",
    "Restaurants": "المطاعم",
    "Room Service": "خدمة الغرف",
    "Parking": "موقف سيارات",
    "Free Parking": "موقف سيارات مجاني",
    "Airport Shuttle": "خدمة نقل من وإلى المطار",
    "24-Hour Front Desk": "مكتب استقبال يعمل على مدار الساعة",
    "Pet Friendly": "يسمح بالحيوانات الأليفة",
    "Non-Smoking": "لغير المدخنين",
    "Smoking Allowed": "يسمح بالتدخين",
    "Air Conditioning": "تكييف الهواء",
    "Laundry Service": "خدمة غسيل الملابس",
    "Business Center": "مركز أعمال",
    "Meeting Rooms": "غرف اجتماعات",
    "Accessibility Features": "ميزات إمكانية الوصول",
    "Reviews and Ratings": "المراجعات والتقييمات",
    "Guest Reviews": "مراجعات الضيوف",
    "Hotel Rating": "تقييم الفندق",
    "Star Rating": "تصنيف النجوم",
    "Location Rating": "تقييم الموقع",
    "Service Rating": "تقييم الخدمة",
    "Value for Money": "القيمة مقابل المال",
    "Sort by Rating": "ترتيب حسب التقييم",
    "Sort by Price": "ترتيب حسب السعر",
    "Sort by Distance": "ترتيب حسب المسافة",
    "Recommended for You": "موصى به لك",
    "Popular Nearby": "شائع بالقرب منك",
    "Payment at Property": "الدفع في مكان الإقامة",
    "Pay at Hotel": "الدفع في الفندق",
    "Pay Online": "الدفع عبر الإنترنت",
    "Credit Card Required": "بطاقة ائتمان مطلوبة",
    "No Payment Needed": "لا حاجة للدفع الآن",
    "Deposit Required": "يتطلب دفعة مقدمة",
    "Secure Payment": "دفع آمن",
    "Guest Details": "بيانات الضيف",
    "Lead Guest": "الضيف الرئيسي",
    "Special Requests": "طلبات خاصة",
    "Accessibility Request": "طلب تسهيلات الوصول",
    "Late Check-in": "تسجيل وصول متأخر",
    "Early Check-in": "تسجيل وصول مبكر",
    "Late Check-out": "تسجيل مغادرة متأخر",
    "Contact Property": "التواصل مع مكان الإقامة",
    "Message Property": "إرسال رسالة إلى مكان الإقامة",
    "Hotel Support": "دعم الفندق",
    "Travel Support": "دعم السفر",
    "Travelers": "المسافرون",
    "Trips": "الرحلات",
    "My Trips": "رحلاتي",
    "Trip Details": "تفاصيل الرحلة",
    "Travel Dates": "تواريخ السفر",
    "Travel Insurance": "تأمين السفر",
    "Passport Details": "بيانات جواز السفر",
    "Guest Information": "معلومات الضيوف",
    "Add Guest": "إضافة ضيف",
    "Remove Guest": "إزالة ضيف",
    "Room Preferences": "تفضيلات الغرفة",
    "Quiet Room": "غرفة هادئة",
    "High Floor": "طابق مرتفع",
    "Near Elevator": "بالقرب من المصعد",
    "Extra Towels": "مناشف إضافية",
    "Special Occasion": "مناسبة خاصة",
    "Honeymoon": "شهر العسل",
    "Family Friendly": "مناسب للعائلات",
    "Business Travel": "رحلة عمل",
    "Government Services": "الخدمات الحكومية",
    "Government Portal": "البوابة الحكومية",
    "Public Services": "الخدمات العامة",
    "Citizen Services": "خدمات المواطنين",
    "Resident Services": "خدمات المقيمين",
    "Service Directory": "دليل الخدمات",
    "Services Directory": "دليل الخدمات",
    "Popular Services": "الخدمات الأكثر استخدامًا",
    "Featured Services": "الخدمات المميزة",
    "Digital Government": "الحكومة الرقمية",
    "E-Government": "الحكومة الإلكترونية",
    "Citizen": "المواطن",
    "Resident": "المقيم",
    "Applicant": "مقدم الطلب",
    "Government Account": "الحساب الحكومي",
    "National Identity": "الهوية الوطنية",
    "National ID Card": "بطاقة الهوية الوطنية",
    "Identity Number": "رقم الهوية",
    "Civil ID": "الرقم المدني",
    "Resident ID": "هوية المقيم",
    "Passport": "جواز السفر",
    "Passport Number": "رقم جواز السفر",
    "Driving License": "رخصة القيادة",
    "Driver License": "رخصة السائق",
    "Vehicle Registration": "تسجيل المركبة",
    "Vehicle License": "رخصة المركبة",
    "Birth Certificate": "شهادة الميلاد",
    "Marriage Certificate": "شهادة الزواج",
    "Death Certificate": "شهادة الوفاة",
    "Family Record": "سجل الأسرة",
    "Personal Data": "البيانات الشخصية",
    "Update Personal Information": "تحديث المعلومات الشخصية",
    "Digital Identity": "الهوية الرقمية",
    "Digital Signature": "التوقيع الرقمي",
    "Electronic Signature": "التوقيع الإلكتروني",
    "Required Documents": "المستندات المطلوبة",
    "Supporting Documents": "المستندات الداعمة",
    "Official Document": "وثيقة رسمية",
    "Document Number": "رقم الوثيقة",
    "Document Expiry": "انتهاء صلاحية الوثيقة",
    "Document Status": "حالة الوثيقة",
    "Upload Document": "رفع مستند",
    "Upload Documents": "رفع المستندات",
    "Scan Document": "مسح المستند ضوئيًا",
    "Download Document": "تنزيل المستند",
    "Issue Document": "إصدار الوثيقة",
    "Renew Document": "تجديد الوثيقة",
    "Replace Document": "استبدال الوثيقة",
    "Document Issued": "تم إصدار الوثيقة",
    "Document Verified": "تم التحقق من الوثيقة",
    "Document Rejected": "تم رفض الوثيقة",
    "Application": "الطلب",
    "Applications": "الطلبات",
    "Online Application": "طلب إلكتروني",
    "New Application": "طلب جديد",
    "Application Form": "نموذج الطلب",
    "Application Number": "رقم الطلب",
    "Application Reference": "مرجع الطلب",
    "Application Date": "تاريخ الطلب",
    "Application Type": "نوع الطلب",
    "Application Details": "تفاصيل الطلب",
    "Submit Application": "تقديم الطلب",
    "Save Application": "حفظ الطلب",
    "Withdraw Application": "سحب الطلب",
    "Track Application": "تتبع الطلب",
    "Application Submitted": "تم تقديم الطلب",
    "Application Received": "تم استلام الطلب",
    "Under Review": "قيد المراجعة",
    "Additional Information Required": "معلومات إضافية مطلوبة",
    "Returned for Correction": "أعيد للتصحيح",
    "Service Request": "طلب خدمة",
    "Service Requests": "طلبات الخدمات",
    "Request Status": "حالة الطلب",
    "Request Details": "تفاصيل الطلب",
    "Request Submitted": "تم تقديم الطلب",
    "Request Number": "رقم الطلب",
    "Appointment Booking": "حجز موعد",
    "Book an Appointment": "احجز موعدًا",
    "Government Appointment": "موعد حكومي",
    "Appointments Available": "المواعيد المتاحة",
    "Select Date and Time": "اختر التاريخ والوقت",
    "Appointment Confirmation": "تأكيد الموعد",
    "Appointment Reference": "مرجع الموعد",
    "Virtual Appointment": "موعد افتراضي",
    "Service Center": "مركز الخدمة",
    "Service Centers": "مراكز الخدمة",
    "Find a Service Center": "العثور على مركز خدمة",
    "Nearest Center": "أقرب مركز",
    "Working Hours": "ساعات العمل",
    "Location and Directions": "الموقع والاتجاهات",
    "Take a Number": "خذ رقمًا",
    "Waiting Time": "وقت الانتظار",
    "Taxes": "الضرائب",
    "Tax Services": "الخدمات الضريبية",
    "Taxpayer": "المكلف بالضريبة",
    "Tax Number": "الرقم الضريبي",
    "Tax Registration": "التسجيل الضريبي",
    "Tax Return": "الإقرار الضريبي",
    "Submit Tax Return": "تقديم الإقرار الضريبي",
    "Tax Certificate": "الشهادة الضريبية",
    "Tax Payment": "دفع الضريبة",
    "Tax Refund": "استرداد الضريبة",
    "VAT": "ضريبة القيمة المضافة",
    "Customs": "الجمارك",
    "Customs Declaration": "الإقرار الجمركي",
    "Fines": "المخالفات",
    "Fine": "المخالفة",
    "Traffic Fine": "المخالفة المرورية",
    "Pay Fine": "دفع المخالفة",
    "Fine Number": "رقم المخالفة",
    "Dispute Fine": "الاعتراض على المخالفة",
    "Traffic Services": "الخدمات المرورية",
    "Vehicle Services": "خدمات المركبات",
    "Vehicle Owner": "مالك المركبة",
    "Vehicle Plate Number": "رقم لوحة المركبة",
    "License Renewal": "تجديد الرخصة",
    "Vehicle Inspection": "فحص المركبة",
    "Inspection Appointment": "موعد الفحص",
    "Parking Permit": "تصريح موقف السيارات",
    "Public Transport": "النقل العام",
    "Transportation Card": "بطاقة النقل",
    "Business Services": "خدمات الأعمال",
    "Business License": "الرخصة التجارية",
    "Commercial Registration": "السجل التجاري",
    "Company Registration": "تسجيل الشركة",
    "Business Permit": "تصريح الأعمال",
    "Trade License": "الرخصة التجارية",
    "Professional License": "الرخصة المهنية",
    "Renew License": "تجديد الرخصة",
    "License Expiry": "انتهاء صلاحية الرخصة",
    "Employer Services": "خدمات أصحاب العمل",
    "Employee Services": "خدمات الموظفين",
    "Work Permit": "تصريح العمل",
    "Work Visa": "تأشيرة العمل",
    "Visa Application": "طلب التأشيرة",
    "Visa Status": "حالة التأشيرة",
    "Residency Permit": "تصريح الإقامة",
    "Residency Renewal": "تجديد الإقامة",
    "Exit and Re-Entry Visa": "تأشيرة خروج وعودة",
    "Social Insurance": "التأمينات الاجتماعية",
    "Social Security": "الضمان الاجتماعي",
    "Pension": "المعاش التقاعدي",
    "Retirement": "التقاعد",
    "Benefits": "المنافع",
    "Benefit Eligibility": "استحقاق المنفعة",
    "Housing Services": "خدمات الإسكان",
    "Housing Application": "طلب الإسكان",
    "Land Registry": "السجل العقاري",
    "Property Registration": "تسجيل العقار",
    "Utility Services": "خدمات المرافق",
    "Electricity": "الكهرباء",
    "Water Services": "خدمات المياه",
    "Utility Bill": "فاتورة المرافق",
    "Pay Utility Bill": "دفع فاتورة المرافق",
    "Healthcare Services": "الخدمات الصحية",
    "Education Services": "الخدمات التعليمية",
    "Scholarship": "المنحة الدراسية",
    "School Registration": "تسجيل المدرسة",
    "Complaints": "الشكاوى",
    "Complaint": "شكوى",
    "Submit Complaint": "تقديم شكوى",
    "Complaint Number": "رقم الشكوى",
    "Complaint Status": "حالة الشكوى",
    "Suggestions": "الاقتراحات",
    "Report an Issue": "الإبلاغ عن مشكلة",
    "Report Fraud": "الإبلاغ عن احتيال",
    "Report Lost Document": "الإبلاغ عن فقدان وثيقة",
    "Emergency Services": "خدمات الطوارئ",
    "Helpline": "خط المساعدة",
    "Contact Government": "التواصل مع الحكومة",
    "Frequently Used Services": "الخدمات الأكثر استخدامًا",
    "Recently Used Services": "الخدمات المستخدمة مؤخرًا",
    "My Requests": "طلباتي",
    "My Documents": "مستنداتي",
    "My Appointments": "مواعيدي",
    "My Payments": "مدفوعاتي",
    "Payment Receipt": "إيصال الدفع",
    "Government Payment": "الدفع الحكومي",
    "Notifications Center": "مركز الإشعارات",
    "Official Notification": "إشعار رسمي",
    "Important Notice": "إشعار مهم",
    "Terms of Service": "شروط الخدمة",
    "Privacy Notice": "إشعار الخصوصية",
    "Consent": "الموافقة",
    "Give Consent": "منح الموافقة",
    "Accessibility Services": "خدمات إمكانية الوصول",
    "Language Services": "خدمات اللغة",
    "Arabic Language": "اللغة العربية",
    "English Language": "اللغة الإنجليزية",
    "Food Delivery": "توصيل الطعام",
    "Food Ordering": "طلب الطعام",
    "Restaurant App": "تطبيق المطاعم",
    "Find Restaurants": "العثور على المطاعم",
    "Nearby Restaurants": "المطاعم القريبة",
    "Restaurants Near You": "مطاعم بالقرب منك",
    "Open Now": "مفتوح الآن",
    "Closed Now": "مغلق الآن",
    "Opening Soon": "يفتح قريبًا",
    "Restaurant Details": "تفاصيل المطعم",
    "Restaurant Information": "معلومات المطعم",
    "Restaurant Location": "موقع المطعم",
    "Restaurant Hours": "ساعات عمل المطعم",
    "Delivery Fee": "رسوم التوصيل",
    "Minimum Order Amount": "الحد الأدنى لقيمة الطلب",
    "Free Delivery": "توصيل مجاني",
    "Dine In": "تناول الطعام في المطعم",
    "Takeaway": "سفري",
    "Order for Later": "اطلب لوقت لاحق",
    "Order Now": "اطلب الآن",
    "Schedule Order": "جدولة الطلب",
    "Scheduled Delivery": "توصيل مجدول",
    "Browse Menu": "تصفح القائمة",
    "Menu": "القائمة",
    "Menus": "القوائم",
    "Full Menu": "القائمة الكاملة",
    "Popular Items": "الأصناف الشائعة",
    "Featured Items": "الأصناف المميزة",
    "New Items": "أصناف جديدة",
    "Offers and Deals": "العروض والصفقات",
    "Meal": "الوجبة",
    "Meals": "الوجبات",
    "Dish": "الطبق",
    "Dishes": "الأطباق",
    "Food Item": "الصنف",
    "Food Items": "الأصناف",
    "Item Details": "تفاصيل الصنف",
    "Item Description": "وصف الصنف",
    "Ingredients": "المكونات",
    "Nutrition Information": "المعلومات الغذائية",
    "Calories": "السعرات الحرارية",
    "Allergens": "مسببات الحساسية",
    "Allergen Information": "معلومات مسببات الحساسية",
    "Vegetarian": "نباتي",
    "Vegan": "نباتي صرف",
    "Halal Food": "طعام حلال",
    "Gluten Free": "خالٍ من الغلوتين",
    "Dairy Free": "خالٍ من منتجات الألبان",
    "Spicy": "حار",
    "Mild": "خفيف",
    "Extra Spicy": "حار جدًا",
    "Breakfast": "الإفطار",
    "Lunch": "الغداء",
    "Dinner": "العشاء",
    "Snacks": "الوجبات الخفيفة",
    "Appetizers": "المقبلات",
    "Main Courses": "الأطباق الرئيسية",
    "Side Dishes": "الأطباق الجانبية",
    "Desserts": "الحلويات",
    "Drinks": "المشروبات",
    "Beverages": "المشروبات",
    "Coffee": "القهوة",
    "Tea": "الشاي",
    "Juice": "العصير",
    "Water": "الماء",
    "Pizza": "البيتزا",
    "Burgers": "البرغر",
    "Sandwiches": "السندويشات",
    "Chicken": "الدجاج",
    "Beef": "اللحم البقري",
    "Seafood": "المأكولات البحرية",
    "Rice": "الأرز",
    "Pasta": "المعكرونة",
    "Soup": "الشوربة",
    "Salad": "السلطة",
    "Add to Order": "إضافة إلى الطلب",
    "Customize": "تخصيص",
    "Customize Your Order": "خصص طلبك",
    "Choose Your Size": "اختر الحجم",
    "Choose a Side": "اختر طبقًا جانبيًا",
    "Choose a Sauce": "اختر الصلصة",
    "Choose Toppings": "اختر الإضافات",
    "Add Toppings": "إضافة الإضافات",
    "Extra Cheese": "جبنة إضافية",
    "No Onions": "بدون بصل",
    "No Tomatoes": "بدون طماطم",
    "Extra Sauce": "صلصة إضافية",
    "Special Instructions": "تعليمات خاصة",
    "Add a Note": "إضافة ملاحظة",
    "Add Another Item": "إضافة صنف آخر",
    "View Cart": "عرض السلة",
    "Your Cart": "سلتك",
    "Cart Is Empty": "السلة فارغة",
    "Cart Subtotal": "المجموع الفرعي للسلة",
    "Change Address": "تغيير العنوان",
    "Add Delivery Address": "إضافة عنوان توصيل",
    "Call on Arrival": "الاتصال عند الوصول",
    "Meet at Door": "التسليم عند الباب",
    "Deliver to Reception": "التوصيل إلى الاستقبال",
    "Review Order": "مراجعة الطلب",
    "Confirm Order": "تأكيد الطلب",
    "Order Received": "تم استلام الطلب",
    "Order Accepted": "تم قبول الطلب",
    "Restaurant Is Preparing": "المطعم يجهز الطلب",
    "Preparing Your Order": "جاري تجهيز طلبك",
    "Order Ready": "الطلب جاهز",
    "Courier Assigned": "تم تعيين مندوب التوصيل",
    "Courier Is on the Way": "مندوب التوصيل في الطريق",
    "Arriving Soon": "سيصل قريبًا",
    "Order Delivered": "تم توصيل الطلب",
    "Order Canceled": "تم إلغاء الطلب",
    "Order Delayed": "الطلب متأخر",
    "Order Issue": "مشكلة في الطلب",
    "Track Your Order": "تتبع طلبك",
    "Live Order Tracking": "تتبع الطلب مباشرة",
    "Delivery Partner": "شريك التوصيل",
    "Contact Courier": "التواصل مع مندوب التوصيل",
    "Call Restaurant": "الاتصال بالمطعم",
    "Message Restaurant": "مراسلة المطعم",
    "Pay with Card": "الدفع بالبطاقة",
    "Cash Payment": "الدفع نقدًا",
    "Wallet Payment": "الدفع بالمحفظة",
    "Apply Promo Code": "تطبيق الرمز الترويجي",
    "Delivery Discount": "خصم التوصيل",
    "Small Order Fee": "رسوم الطلب الصغير",
    "Tip": "البقشيش",
    "Add a Tip": "إضافة بقشيش",
    "Tip for Courier": "بقشيش لمندوب التوصيل",
    "Total Due": "الإجمالي المستحق",
    "Refund Issued": "تم إصدار الاسترداد",
    "Reorder": "إعادة الطلب",
    "Repeat Order": "تكرار الطلب",
    "Favorite Restaurants": "المطاعم المفضلة",
    "Saved Meals": "الوجبات المحفوظة",
    "Restaurant Rating": "تقييم المطعم",
    "Food Rating": "تقييم الطعام",
    "Delivery Rating": "تقييم التوصيل",
    "Rate Your Order": "قيّم طلبك",
    "Rate the Restaurant": "قيّم المطعم",
    "Rate the Courier": "قيّم مندوب التوصيل",
    "Missing Item": "صنف مفقود",
    "Wrong Item": "صنف غير صحيح",
    "Damaged Item": "صنف تالف",
    "Cold Food": "طعام بارد",
    "Late Delivery": "توصيل متأخر",
    "Request Refund": "طلب استرداد",
    "Help with Order": "المساعدة بشأن الطلب",
    "Food Offers": "عروض الطعام",
    "Free Delivery Offer": "عرض توصيل مجاني",
    "First Order Discount": "خصم الطلب الأول",
    "Combo Meal": "وجبة كومبو",
    "Family Meal": "وجبة عائلية",
    "Meal Deal": "عرض وجبة",
    "Loyalty Points": "نقاط الولاء",
    "Earn Points": "اكسب النقاط",
    "Redeem Rewards": "استبدال المكافآت",
    "Invite Friends": "دعوة الأصدقاء",
    "Restaurant Partner": "شريك المطعم",
    "Restaurant Dashboard": "لوحة تحكم المطعم",
    "Manage Menu": "إدارة القائمة",
    "Add Menu Item": "إضافة صنف للقائمة",
    "Edit Menu Item": "تعديل صنف القائمة",
    "Item Availability": "توفر الصنف",
    "Mark as Unavailable": "تحديد كغير متوفر",
    "Accept Orders": "قبول الطلبات",
    "Pause Orders": "إيقاف الطلبات مؤقتًا",
    "Estimated Preparation Time": "وقت التحضير المتوقع",
    "Restaurant Analytics": "تحليلات المطعم",
    "Daily Orders": "الطلبات اليومية",
    "Maps": "الخرائط",
    "Map": "الخريطة",
    "Explore Map": "استكشاف الخريطة",
    "Map View": "عرض الخريطة",
    "Satellite View": "عرض القمر الصناعي",
    "Street View": "عرض الشوارع",
    "Terrain View": "عرض التضاريس",
    "Current Location": "الموقع الحالي",
    "My Location": "موقعي",
    "Live Location": "الموقع المباشر",
    "Share Location": "مشاركة الموقع",
    "Send Location": "إرسال الموقع",
    "Location Sharing": "مشاركة الموقع",
    "Drop a Pin": "وضع دبوس",
    "Pinned Location": "الموقع المحدد",
    "Save Location": "حفظ الموقع",
    "Saved Places": "الأماكن المحفوظة",
    "Favorite Places": "الأماكن المفضلة",
    "Home Address": "عنوان المنزل",
    "Work Address": "عنوان العمل",
    "Add a Place": "إضافة مكان",
    "Place Details": "تفاصيل المكان",
    "Place Name": "اسم المكان",
    "Nearby Places": "الأماكن القريبة",
    "Nearby": "بالقرب منك",
    "Search Nearby": "البحث بالقرب منك",
    "Search This Area": "البحث في هذه المنطقة",
    "Search on Map": "البحث على الخريطة",
    "Search Destination": "البحث عن وجهة",
    "Starting Point": "نقطة البداية",
    "End Point": "نقطة النهاية",
    "From": "من",
    "To": "إلى",
    "Directions": "الاتجاهات",
    "Route": "المسار",
    "Routes": "المسارات",
    "Best Route": "أفضل مسار",
    "Alternative Routes": "مسارات بديلة",
    "Shortest Route": "أقصر مسار",
    "Fastest Route": "أسرع مسار",
    "Avoid Tolls": "تجنب الطرق ذات الرسوم",
    "Avoid Highways": "تجنب الطرق السريعة",
    "Avoid Ferries": "تجنب العبارات",
    "Avoid Traffic": "تجنب الازدحام",
    "Navigation": "الملاحة",
    "Start Navigation": "بدء الملاحة",
    "Stop Navigation": "إيقاف الملاحة",
    "Voice Navigation": "الملاحة الصوتية",
    "Mute Navigation": "كتم صوت الملاحة",
    "Turn-by-Turn Directions": "اتجاهات خطوة بخطوة",
    "Next Turn": "المنعطف التالي",
    "Turn Left": "انعطف يسارًا",
    "Turn Right": "انعطف يمينًا",
    "Make a U-Turn": "قم بالدوران للخلف",
    "Continue Straight": "تابع مستقيمًا",
    "Recalculating Route": "إعادة حساب المسار",
    "Arrived at Destination": "وصلت إلى وجهتك",
    "Estimated Time of Arrival": "الوقت المتوقع للوصول",
    "ETA": "الوقت المتوقع للوصول",
    "Distance": "المسافة",
    "Travel Time": "وقت الرحلة",
    "Traffic Conditions": "حالة المرور",
    "Light Traffic": "ازدحام خفيف",
    "Moderate Traffic": "ازدحام متوسط",
    "Heavy Traffic": "ازدحام شديد",
    "Road Closure": "إغلاق الطريق",
    "Roadworks": "أعمال الطرق",
    "Accident Ahead": "حادث أمامك",
    "Speed Limit": "حد السرعة",
    "Trip": "الرحلة",
    "Plan a Trip": "خطط لرحلة",
    "Trip Planner": "مخطط الرحلات",
    "Trip History": "سجل الرحلات",
    "Recent Destinations": "الوجهات الأخيرة",
    "Transportation": "المواصلات",
    "Transport Options": "خيارات المواصلات",
    "Public Transportation": "النقل العام",
    "Public Transit": "المواصلات العامة",
    "Transit Map": "خريطة المواصلات",
    "Bus": "الحافلة",
    "Buses": "الحافلات",
    "Bus Stop": "موقف الحافلة",
    "Bus Station": "محطة الحافلات",
    "Train": "القطار",
    "Trains": "القطارات",
    "Train Station": "محطة القطار",
    "Metro": "المترو",
    "Metro Station": "محطة المترو",
    "Tram": "الترام",
    "Subway": "قطار الأنفاق",
    "Ferry": "العبّارة",
    "Airport": "المطار",
    "Airport Terminal": "صالة المطار",
    "Flight": "الرحلة الجوية",
    "Flights": "الرحلات الجوية",
    "Departure": "المغادرة",
    "Arrival": "الوصول",
    "Departure Time": "وقت المغادرة",
    "Arrival Time": "وقت الوصول",
    "Platform": "الرصيف",
    "Gate": "البوابة",
    "Line": "الخط",
    "Transit Line": "خط المواصلات",
    "Next Departure": "المغادرة التالية",
    "Service Disruption": "تعطل الخدمة",
    "Transport Schedule": "جدول المواصلات",
    "Fare": "الأجرة",
    "Ticket": "التذكرة",
    "Tickets": "التذاكر",
    "Transit Card": "بطاقة المواصلات",
    "Taxi": "سيارة أجرة",
    "Taxis": "سيارات الأجرة",
    "Ride": "الرحلة",
    "Rides": "الرحلات",
    "Ride Hailing": "طلب سيارة",
    "Book a Ride": "حجز رحلة",
    "Request a Ride": "طلب رحلة",
    "Choose a Ride": "اختر سيارة",
    "Ride Type": "نوع الرحلة",
    "Economy Ride": "رحلة اقتصادية",
    "Premium Ride": "رحلة مميزة",
    "Shared Ride": "رحلة مشتركة",
    "Private Ride": "رحلة خاصة",
    "Scheduled Ride": "رحلة مجدولة",
    "Pickup Location": "موقع الالتقاط",
    "Drop-off Location": "موقع التوصيل",
    "Pickup Time": "وقت الالتقاط",
    "Driver": "السائق",
    "Drivers": "السائقون",
    "Driver Details": "تفاصيل السائق",
    "Driver Rating": "تقييم السائق",
    "Vehicle": "المركبة",
    "Vehicle Details": "تفاصيل المركبة",
    "Vehicle Number": "رقم المركبة",
    "License Plate": "لوحة المركبة",
    "Arriving in": "الوصول خلال",
    "Driver Arrived": "وصل السائق",
    "Start Ride": "بدء الرحلة",
    "End Ride": "إنهاء الرحلة",
    "Cancel Ride": "إلغاء الرحلة",
    "Ride Canceled": "تم إلغاء الرحلة",
    "Ride Completed": "اكتملت الرحلة",
    "Ride Fare": "أجرة الرحلة",
    "Estimated Fare": "الأجرة المتوقعة",
    "Surge Pricing": "التسعير المرتفع",
    "Promo for Ride": "عرض الرحلة",
    "Tip Driver": "إكرامية للسائق",
    "Report Driver": "الإبلاغ عن السائق",
    "Safety Center": "مركز الأمان",
    "Emergency Button": "زر الطوارئ",
    "Share Trip Status": "مشاركة حالة الرحلة",
    "Trusted Contacts": "جهات الاتصال الموثوقة",
    "Delivery Services": "خدمات التوصيل",
    "Package Delivery": "توصيل الطرود",
    "Courier Service": "خدمة الشحن السريع",
    "Parcel": "الطرد",
    "Parcels": "الطرود",
    "Package": "الحزمة",
    "Packages": "الحزم",
    "Shipment Tracking": "تتبع الشحنة",
    "Track Package": "تتبع الطرد",
    "Package Number": "رقم الطرد",
    "Tracking ID": "معرّف التتبع",
    "Sender": "المرسل",
    "Receiver": "المستلم",
    "Sender Address": "عنوان المرسل",
    "Receiver Address": "عنوان المستلم",
    "Pickup Request": "طلب الالتقاط",
    "Schedule Pickup": "جدولة الالتقاط",
    "Pickup Point": "نقطة الالتقاط",
    "Drop-off Point": "نقطة التسليم",
    "Delivery Status": "حالة التوصيل",
    "Preparing for Shipment": "جارٍ التجهيز للشحن",
    "Picked Up": "تم الالتقاط",
    "In Transit": "قيد النقل",
    "At Distribution Center": "في مركز التوزيع",
    "Delivered Successfully": "تم التوصيل بنجاح",
    "Delivery Attempt Failed": "فشلت محاولة التوصيل",
    "Delivery Rescheduled": "تمت إعادة جدولة التوصيل",
    "Delivery Exception": "مشكلة في التوصيل",
    "Proof of Delivery": "إثبات التوصيل",
    "Delivery Signature": "توقيع الاستلام",
    "Contact Delivery Partner": "التواصل مع مندوب التوصيل",
    "Fragile": "قابل للكسر",
    "Handle with Care": "يرجى التعامل بحذر",
    "Express Delivery": "توصيل سريع",
    "Same Day Delivery": "توصيل في نفس اليوم",
    "Tracking Notifications": "إشعارات التتبع",
    "Map Settings": "إعدادات الخريطة",
    "Location Permissions": "أذونات الموقع",
    "Enable GPS": "تفعيل نظام GPS",
    "Improve Location Accuracy": "تحسين دقة الموقع",
    "Download Map": "تنزيل الخريطة",
    "Map Language": "لغة الخريطة",
    "Map Labels": "تسميات الخريطة",
    "Dark Map": "خريطة داكنة",
    "Report a Map Error": "الإبلاغ عن خطأ في الخريطة",
    "Add Missing Place": "إضافة مكان مفقود",
    "Edit Place Information": "تعديل معلومات المكان",
    "Special Offers": "عروض خاصة",
    "Latest Offers": "أحدث العروض",
    "Exclusive Offers": "عروض حصرية",
    "Limited Time Offer": "عرض لفترة محدودة",
    "Offer Details": "تفاصيل العرض",
    "Offer Terms": "شروط العرض",
    "Weekly Deals": "عروض أسبوعية",
    "Flash Deals": "عروض خاطفة",
    "Seasonal Offers": "عروض موسمية",
    "Holiday Offers": "عروض الأعياد",
    "Welcome Offer": "عرض الترحيب",
    "First Order Offer": "عرض الطلب الأول",
    "Loyalty Offer": "عرض الولاء",
    "Member Exclusive": "حصري للأعضاء",
    "Early Access": "وصول مبكر",
    "Buy More Save More": "اشترِ أكثر ووفر أكثر",
    "Buy One Get One Free": "اشترِ واحدًا واحصل على الآخر مجانًا",
    "Free Item": "منتج مجاني",
    "Free Gift": "هدية مجانية",
    "Free Sample": "عينة مجانية",
    "Free Upgrade": "ترقية مجانية",
    "Free Shipping Offer": "عرض شحن مجاني",
    "Discount Offer": "عرض الخصم",
    "Discount Amount": "قيمة الخصم",
    "Discount Percentage": "نسبة الخصم",
    "Percentage Discount": "خصم بنسبة مئوية",
    "Fixed Amount Discount": "خصم بقيمة ثابتة",
    "Order Discount": "خصم على الطلب",
    "Product Discount": "خصم على المنتج",
    "Category Discount": "خصم على الفئة",
    "Shipping Discount": "خصم الشحن",
    "Student Discount": "خصم الطلاب",
    "Member Discount": "خصم الأعضاء",
    "Referral Discount": "خصم الإحالة",
    "Discount Applied": "تم تطبيق الخصم",
    "Discount Removed": "تمت إزالة الخصم",
    "Invalid Discount Code": "رمز الخصم غير صالح",
    "Expired Discount Code": "رمز الخصم منتهي الصلاحية",
    "Minimum Spend": "الحد الأدنى للإنفاق",
    "Maximum Discount": "الحد الأقصى للخصم",
    "Cannot Be Combined": "لا يمكن دمجه مع عروض أخرى",
    "One Offer per Customer": "عرض واحد لكل عميل",
    "Promo Codes": "الرموز الترويجية",
    "Redeem Code": "استبدال الرمز",
    "Redeem Offer": "استبدال العرض",
    "Claim Offer": "الحصول على العرض",
    "Activate Offer": "تفعيل العرض",
    "Save Offer": "حفظ العرض",
    "Share Offer": "مشاركة العرض",
    "Copy Promo Code": "نسخ الرمز الترويجي",
    "View All Offers": "عرض جميع العروض",
    "Available Coupons": "القسائم المتاحة",
    "Coupon Wallet": "محفظة القسائم",
    "Coupon Saved": "تم حفظ القسيمة",
    "Coupon Redeemed": "تم استبدال القسيمة",
    "Coupon Expired": "انتهت صلاحية القسيمة",
    "Gift Offer": "عرض الهدية",
    "Gift with Purchase": "هدية مع الشراء",
    "Digital Gift Card": "بطاقة هدية رقمية",
    "Gift Card Balance": "رصيد بطاقة الهدية",
    "Buy a Gift Card": "شراء بطاقة هدية",
    "Send a Gift Card": "إرسال بطاقة هدية",
    "Gift Card Recipient": "مستلم بطاقة الهدية",
    "Gift Card Message": "رسالة بطاقة الهدية",
    "Gift Card Amount": "قيمة بطاقة الهدية",
    "Redeem Gift Card": "استبدال بطاقة الهدية",
    "Gift Card Expiry": "انتهاء صلاحية بطاقة الهدية",
    "Gift Wrapping": "تغليف الهدية",
    "Gift Wrap Available": "تغليف الهدية متاح",
    "Choose Your Gift": "اختر هديتك",
    "Send as a Gift": "إرسال كهدية",
    "Gift Recipient": "مستلم الهدية",
    "Surprise Gift": "هدية مفاجئة",
    "Birthday Gift": "هدية عيد الميلاد",
    "Wedding Gift": "هدية زفاف",
    "Referral Program": "برنامج الإحالة",
    "Refer a Friend": "ادعُ صديقًا",
    "Invite and Earn": "ادعُ واكسب",
    "Referral Link": "رابط الإحالة",
    "Referral Reward": "مكافأة الإحالة",
    "Rewards Balance": "رصيد المكافآت",
    "Earn Rewards": "اكسب المكافآت",
    "Reward Available": "مكافأة متاحة",
    "Double Points": "نقاط مضاعفة",
    "Bonus Points": "نقاط إضافية",
    "Limited Quantity": "كمية محدودة",
    "While Supplies Last": "حتى نفاد الكمية",
    "Last Chance": "الفرصة الأخيرة",
    "Almost Sold Out": "شارف على النفاد",
    "Deal Alert": "تنبيه عرض",
    "Offer Notifications": "إشعارات العروض",
    "Subscribe for Offers": "اشترك للحصول على العروض",
    "Exclusive Member Benefits": "مزايا حصرية للأعضاء"
  }
};
for (const [language, entries] of Object.entries(extraUxDictionary)) {
    uxDictionary[language] = Object.assign({}, uxDictionary[language] || {}, entries);
}
// END GENERATED EXTRA DICTIONARY

// --- Dynamically create lookup tables from the multi-language dictionary ---
const langCodeMap = { "Arabic": "ar", "French": "fr" };
const enToLangLookup = {};
const langToEnLookup = {};

for (const [langName, translations] of Object.entries(uxDictionary)) {
    const langCode = langCodeMap[langName];
    if (!langCode) continue;

    // English -> Target Language (e.g., enToLangLookup['ar'] = { "settings": "الإعدادات", ... })
    enToLangLookup[langCode] = Object.fromEntries(
        Object.entries(translations).map(([key, value]) => [
            normalizeDictionaryWrapper(key),
            value
        ])
    );

    // Target Language -> English (e.g., langToEnLookup['ar'] = { "الاعدادات": "Settings", ... })
    langToEnLookup[langCode] = Object.fromEntries(
        Object.entries(translations).map(([key, value]) => {
            let lookupKey = normalizeDictionaryWrapper(value);
            // Apply language-specific normalization for the lookup key
            if (langCode === 'ar') {
                lookupKey = normalizeArabic(lookupKey);
            }
            return [lookupKey, key];
        })
    );
}
// Extra dictionary entries are the final authority, including when a key
// already exists in the original dictionary.
for (const [language, entries] of Object.entries(extraUxDictionary)) {
    const langCode = langCodeMap[language];
    if (!langCode) continue;
    enToLangLookup[langCode] ||= {};
    langToEnLookup[langCode] ||= {};
    for (const [key, value] of Object.entries(entries)) {
        const normalizedKey = normalizeDictionaryWrapper(key);
        enToLangLookup[langCode][normalizedKey] = value;
        let reverseKey = normalizeDictionaryWrapper(value);
        if (langCode === 'ar') reverseKey = normalizeArabic(reverseKey);
        langToEnLookup[langCode][reverseKey] = key;
    }
}
// --- End of dynamic lookup table creation ---

// For use in the backend logic
const LANGUAGES = [
    { code: 'auto', name: 'Auto Detect' }, { code: 'en', name: 'English' }, { code: 'ar', name: 'Arabic' }, { code: 'es', name: 'Spanish' }, { code: 'fr', name: 'French' }, { code: 'de', name: 'German' }, { code: 'ja', name: 'Japanese' }, { code: 'ko', name: 'Korean' }, { code: 'pt', name: 'Portuguese' }, { code: 'ru', name: 'Russian' }, { code: 'zh', name: 'Chinese' }, { code: 'tr', name: 'Turkish' },
];

// Global state for the asynchronous variant creation flow
let pendingVariantCreation = null;
let activeFeatureTelemetry = null;
// Set this to your deployed backend URL to sync licenses across devices.
const ACTIVATION_SERVER_BASE_URL = 'https://rtl-master-activation.mohamedabdullah9092.workers.dev';
const GUMROAD_NEW_PRODUCT_ID = 'xjW3twDEIx4LJQrkpgz4fQ==';
const GUMROAD_OLD_PRODUCT_ID = 'dK0Er2rZ-4VFBT6KD-VTYw==';
const FREE_TRIAL_LIMIT = 10;
let hasRecordedPluginOpen = false;

function getCurrentFigmaUser() {
    return figma.currentUser && figma.currentUser.id ? figma.currentUser : null;
}

function getActivationServerEndpoint(path) {
    if (!ACTIVATION_SERVER_BASE_URL) return null;
    return `${ACTIVATION_SERVER_BASE_URL.replace(/\/+$/, '')}${path}`;
}

async function postJson(url, payload) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return response.json();
}

async function sendTelemetryEvent(eventType, details = {}) {
    const endpoint = getActivationServerEndpoint('/api/telemetry');
    if (!endpoint) return;

    try {
        const currentFigmaUser = getCurrentFigmaUser();
        const [isPro, trialCount] = await Promise.all([
            figma.clientStorage.getAsync('isPro'),
            figma.clientStorage.getAsync('trialCount')
        ]);

        const metadata = {
            pluginVersion: PLUGIN_VERSION,
            ...(details && details.metadata && typeof details.metadata === 'object' ? details.metadata : {})
        };

        await postJson(endpoint, {
            eventType,
            figmaUserId: currentFigmaUser ? currentFigmaUser.id : null,
            figmaUserName: currentFigmaUser ? currentFigmaUser.name || '' : '',
            plan: isPro ? 'pro' : 'free',
            trialCount: typeof trialCount === 'number' ? trialCount : null,
            ...details,
            metadata
        });
    } catch (error) {
        console.warn('Could not send telemetry event', error);
    }
}

function getActionFeature(payload) {
    if (!payload) return 'unknown';
    if (payload.actionType === 'create-variant' || payload.createVariant) return 'create-variant';
    if (payload.actionType === 'translate-only') return 'translate-only';
    if (payload.actionType === 'mirror-translate' && payload.translateText) return 'mirror-translate';
    if (payload.actionType === 'mirror-translate') return 'mirror-only';
    return payload.actionType || 'unknown';
}

async function getSelectionTelemetry() {
    return {
        selectionCount: figma.currentPage.selection.length,
        textLayerCount: await countTextLayersInSelection()
    };
}

function finishActiveFeatureTelemetry(eventType = 'feature_completed', details = {}) {
    if (!activeFeatureTelemetry) return;

    const telemetry = activeFeatureTelemetry;
    activeFeatureTelemetry = null;

    void sendTelemetryEvent(eventType, {
        feature: telemetry.feature,
        fromLanguage: telemetry.fromLanguage,
        toLanguage: telemetry.toLanguage,
        durationMs: Date.now() - telemetry.startedAt,
        ...telemetry.selectionTelemetry,
        metadata: telemetry.metadata,
        ...details
    });
}

async function pingActivationServer() {
    const endpoint = getActivationServerEndpoint('/api/license-status');
    if (!endpoint) return { ok: false, reason: 'Activation server URL is not configured.' };

    try {
        const result = await postJson(endpoint, { figmaUserId: 'healthcheck-user' });
        return { ok: !!(result && result.success) };
    } catch (error) {
        return {
            ok: false,
            reason: error instanceof Error ? error.message : 'Unknown activation server error.'
        };
    }
}

async function verifyLicenseWithGumroad(licenseKey, shouldIncrement) {
    let response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            product_id: GUMROAD_NEW_PRODUCT_ID,
            license_key: licenseKey.trim(),
            increment_uses_count: shouldIncrement
        })
    });

    let data = await response.json();

    if (!data.success) {
        response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_id: GUMROAD_OLD_PRODUCT_ID,
                license_key: licenseKey.trim(),
                increment_uses_count: shouldIncrement
            })
        });
        data = await response.json();
    }

    return data;
}

function isGumroadPurchaseActive(data) {
    return !!(
        data &&
        data.success &&
        data.purchase &&
        !data.purchase.chargebacked &&
        !data.purchase.refunded &&
        !data.purchase.subscription_failed_at &&
        !data.purchase.subscription_ended_at
    );
}

async function fetchServerLicenseStatus(figmaUserId) {
    const endpoint = getActivationServerEndpoint('/api/license-status');
    if (!endpoint) return null;
    return postJson(endpoint, { figmaUserId });
}

async function activateLicenseOnServer(licenseKey, figmaUser) {
    const endpoint = getActivationServerEndpoint('/api/activate-license');
    if (!endpoint) return null;
    return postJson(endpoint, {
        figmaUserId: figmaUser.id,
        figmaUserName: figmaUser.name || '',
        licenseKey: licenseKey.trim()
    });
}

async function unlinkLicenseOnServer(figmaUserId) {
    const endpoint = getActivationServerEndpoint('/api/unlink-license');
    if (!endpoint) return null;
    return postJson(endpoint, { figmaUserId });
}

async function restoreProAccessFromStoredLicense(storedKey, currentFigmaUser, trialCount) {
    if (!storedKey || !currentFigmaUser) return false;

    try {
        if (ACTIVATION_SERVER_BASE_URL) {
            const serverResult = await activateLicenseOnServer(storedKey, currentFigmaUser);
            if (serverResult && serverResult.success && serverResult.isPro) {
                await figma.clientStorage.setAsync('isPro', true);
                await figma.clientStorage.setAsync('licenseKey', storedKey.trim());
                await figma.clientStorage.setAsync('activatedFigmaUserId', currentFigmaUser.id);
                sendUIMessage({ type: 'user-status', payload: { isPro: true, trialCount } });
                return true;
            }
        }

        const gumroadData = await verifyLicenseWithGumroad(storedKey, false);
        if (isGumroadPurchaseActive(gumroadData)) {
            await figma.clientStorage.setAsync('isPro', true);
            await figma.clientStorage.setAsync('licenseKey', storedKey.trim());
            await figma.clientStorage.setAsync('activatedFigmaUserId', currentFigmaUser.id);
            sendUIMessage({ type: 'user-status', payload: { isPro: true, trialCount } });
            return true;
        }
    } catch (error) {
        console.warn('Silent Pro restoration failed', error);
    }

    return false;
}

function isInvalidVariantError(error) {
    const message = String(error && error.message || '').toLowerCase();
    return message.includes('component set for node has existing errors') ||
        message.includes('variant set with invalid properties') ||
        message.includes('component set has invalid variant properties') ||
        message.includes('broken or invalid variants');
}

function markInvalidComponentSkipped(node, context, error) {
    console.warn(`Skipping broken component "${node.name}" (${node.id}): ${error.message}`);
    // Protect the whole subtree, including descendants selected independently.
    const pending = [node];
    while (pending.length) {
        const current = pending.pop();
        context.smartSwitchedNodeIds.add(current.id);
        if ('children' in current) pending.push(...current.children);
    }
}

async function skipInvalidComponent(node, context) {
    if (context.smartSwitchedNodeIds.has(node.id)) return true;
    try {
        let component = node;
        if (node.type === 'INSTANCE') {
            void node.componentProperties;
            component = await node.getMainComponentAsync();
        }
        if (component && component.type === 'COMPONENT') {
            void component.variantProperties;
            const parent = await getComponentParentAsync(component);
            if (parent && parent.type === 'COMPONENT_SET') void parent.componentPropertyDefinitions;
        } else if (component && component.type === 'COMPONENT_SET') {
            void component.componentPropertyDefinitions;
        }
        return false;
    } catch (error) {
        if (!isInvalidVariantError(error)) throw error;
        markInvalidComponentSkipped(node, context, error);
        return true;
    }
}

function formatUserFacingPluginError(error) {
    const fallbackMessage = 'Something went wrong while processing the selection. Please try again.';
    if (!(error instanceof Error)) return fallbackMessage;

    const rawMessage = error.message || '';
    const normalizedMessage = rawMessage.toLowerCase();

    if (
        normalizedMessage.includes('component set for node has existing errors') ||
        normalizedMessage.includes('variant set with invalid properties')
    ) {
        return 'This component set has broken or invalid variants in Figma. Please fix or recreate the variant set, then try again.';
    }

    if (normalizedMessage.includes('must be in the same page as the parent')) {
        return 'Could not group the new variant because the components are on different Figma pages. Please move the component to the current page and try again.';
    }

    return `Plugin Error: ${rawMessage}`;
}

figma.showUI(__html__, { width: 400, height: 650, title: "RTL Master" });
function postSelectionState() {
    sendUIMessage({
        type: 'selection-state',
        payload: { hasSelection: figma.currentPage.selection.length > 0 }
    });
}

figma.on('selectionchange', postSelectionState);
postSelectionState();

// Warm the expensive font list while the user is still reading the UI, so the
// first action doesn't pay listAvailableFontsAsync() latency up front.
// setTimeout(0) so the caches exist by the time this actually runs.
setTimeout(() => {
    void (async () => {
        try {
            if (!availableFontsCache) {
                availableFontsCache = await figma.listAvailableFontsAsync();
                console.log(`Warmed font cache (${availableFontsCache.length} fonts).`);
            }
        } catch (e) {
            console.warn('Font cache warm-up failed:', e && e.message);
        }
    })();
}, 0);

function postOperationMessage(message) {
    figma.ui.postMessage(message);
}
function sendUIMessage(message) {
    const operation = activeOperation;
    if (!operation || !operationMessages.has(message.type)) return postOperationMessage(message);
    if (operation.cancelled) return;
    const tagged = { ...message, operationId: operation.id };
    if (message.type === 'action-complete' || message.type === 'plugin-error') {
        operation.terminalMessage = tagged;
        return;
    }
    postOperationMessage(tagged);
};

function checkOperationCancelled() {
    if (activeOperation && activeOperation.cancelled) throw new Error('Operation cancelled');
}

function finishOperation(operation) {
    if (activeOperation !== operation || operation.running) return;
    if (operation.cancelled) {
        // Wait until the writer has stopped before undoing; no pending writer
        // may mutate the document after this boundary.
        pendingVariantCreation = null;
        activeFeatureTelemetry = null;
        if (operation.marker && !operation.marker.removed) {
            try {
                figma.triggerUndo();
                figma.currentPage.selection = operation.selection.filter(node => !node.removed);
            } catch (error) {
                activeOperation = null;
                postOperationMessage({ type: 'plugin-error', operationId: operation.id,
                    payload: { message: 'Cancellation stopped the operation, but automatic undo failed. Please use Undo in Figma.' } });
                return;
            }
        }
        activeOperation = null;
        postOperationMessage({ type: 'action-cancelled', operationId: operation.id });
    } else if (operation.terminalMessage) {
        if (operation.marker && !operation.marker.removed) operation.marker.remove();
        if (typeof figma.commitUndo === 'function') figma.commitUndo();
        lastCompletedOperationId = operation.id;
        activeOperation = null;
        postOperationMessage(operation.terminalMessage);
    }
}

figma.ui.onmessage = async msg => {
    if (msg.type === 'cancel-action') {
        const operation = activeOperation;
        if (!operation || msg.payload?.operationId !== operation.id) {
            if (!operation && msg.payload?.operationId === lastCompletedOperationId) {
                postOperationMessage({ type: 'action-cancel-too-late', operationId: lastCompletedOperationId });
            }
            return;
        }
        operation.cancelled = true;
        finishOperation(operation);
        return;
    }
    if (msg.type !== 'run-action' && msg.type !== 'apply-translations') return handlePluginMessage(msg);
    if (msg.type === 'run-action') {
        if (activeOperation) return;
        const operation = { id: msg.payload.operationId || `operation-${Date.now()}`, running: false, cancelled: false,
            selection: [...figma.currentPage.selection] };
        if (typeof figma.commitUndo === 'function' && typeof figma.triggerUndo === 'function') {
            figma.commitUndo();
            // A real, temporary document change guarantees cancelling before
            // the first edit cannot undo an earlier successful operation.
            operation.marker = figma.createFrame();
            operation.marker.name = 'RTL Master — operation checkpoint';
            operation.marker.visible = false;
        }
        activeOperation = operation;
    } else if (!activeOperation || activeOperation.cancelled || msg.payload.operationId !== activeOperation.id) {
        return; // Ignore a late translator response, including one from an older run.
    }
    const operation = activeOperation;
    if (operation.running) return;
    operation.running = true;
    try {
        await handlePluginMessage(msg);
    } finally {
        operation.running = false;
        finishOperation(operation);
    }
};

async function handlePluginMessage(msg) {
    try {
        switch (msg.type) {
            case 'get-ui-language': {
                const language = await figma.clientStorage.getAsync('uiLanguage');
                sendUIMessage({ type: 'ui-language', payload: { language: language === 'ar' ? 'ar' : 'en' } });
                return;
            }
            case 'set-ui-language': {
                const language = msg.payload?.language === 'ar' ? 'ar' : 'en';
                await figma.clientStorage.setAsync('uiLanguage', language);
                return;
            }
            case 'get-user-status':
                {
                    let isPro = await figma.clientStorage.getAsync('isPro');
                    let trialCount = await figma.clientStorage.getAsync('trialCount');
                    const licenseRevoked = await figma.clientStorage.getAsync('licenseRevoked');
                    const currentFigmaUser = getCurrentFigmaUser();
                    const currentFigmaUserId = currentFigmaUser ? currentFigmaUser.id : null;
                    const storedKey = await figma.clientStorage.getAsync('licenseKey');
                    const activatedFigmaUserId = await figma.clientStorage.getAsync('activatedFigmaUserId');

                    if (isPro === undefined && trialCount === undefined) {
                        isPro = false;
                        trialCount = FREE_TRIAL_LIMIT;
                        await figma.clientStorage.setAsync('isPro', isPro);
                        await figma.clientStorage.setAsync('trialCount', trialCount);
                    } else if (typeof trialCount === 'number' && trialCount > FREE_TRIAL_LIMIT) {
                        trialCount = FREE_TRIAL_LIMIT;
                        await figma.clientStorage.setAsync('trialCount', trialCount);
                    }

                    if (licenseRevoked) {
                        isPro = false;
                        await figma.clientStorage.setAsync('isPro', false);
                    }

                    // --- Figma User ID Binding Check ---
                    // If isPro is stored, make sure it belongs to the current Figma user
                    if (isPro) {
                        if (activatedFigmaUserId && currentFigmaUserId && activatedFigmaUserId !== currentFigmaUserId) {
                            // Different Figma user on this device → revoke Pro silently
                            isPro = false;
                            await figma.clientStorage.setAsync('isPro', false);
                        }
                    }

                    // Send status to UI immediately — do NOT block on network calls
                    sendUIMessage({ type: 'user-status', payload: { isPro: !!isPro, trialCount } });
                    if (!hasRecordedPluginOpen) {
                        hasRecordedPluginOpen = true;
                        void sendTelemetryEvent('plugin_opened');
                    }

                    // --- Background Re-verification (fire and forget) ---
                    // If a backend is configured, trust it as the source of truth across devices.
                    (async function backgroundVerify() {
                        try {
                            if (licenseRevoked) return;
                            if (currentFigmaUserId && ACTIVATION_SERVER_BASE_URL) {
                                const serverStatus = await fetchServerLicenseStatus(currentFigmaUserId);
                                const serverCheckSucceeded = !!(serverStatus && serverStatus.success);
                                const serverIsPro = !!(serverCheckSucceeded && serverStatus.isPro);

                                if (serverIsPro) {
                                    await figma.clientStorage.setAsync('isPro', true);
                                    await figma.clientStorage.setAsync('activatedFigmaUserId', currentFigmaUserId);
                                    if (storedKey) {
                                        await figma.clientStorage.setAsync('licenseKey', storedKey.trim());
                                    }
                                    sendUIMessage({ type: 'user-status', payload: { isPro: true, trialCount } });
                                } else {
                                    const keyBelongsToCurrentUser = storedKey && (!activatedFigmaUserId || activatedFigmaUserId === currentFigmaUserId);
                                    const restored = keyBelongsToCurrentUser
                                        ? await restoreProAccessFromStoredLicense(storedKey, currentFigmaUser, trialCount)
                                        : false;

                                    if (!restored && serverCheckSucceeded) {
                                        await figma.clientStorage.setAsync('isPro', false);
                                        sendUIMessage({ type: 'user-status', payload: { isPro: false, trialCount } });
                                    }
                                }
                                return;
                            }

                            // Fallback to local-only behavior when no backend is configured.
                            const keyBelongsToCurrentUser = storedKey && (!activatedFigmaUserId || activatedFigmaUserId === currentFigmaUserId);
                            if (!isPro && keyBelongsToCurrentUser) {
                                const data = await verifyLicenseWithGumroad(storedKey, false);
                                if (isGumroadPurchaseActive(data)) {
                                    await figma.clientStorage.setAsync('isPro', true);
                                    if (!activatedFigmaUserId && currentFigmaUserId) {
                                        await figma.clientStorage.setAsync('activatedFigmaUserId', currentFigmaUserId);
                                    }
                                    // Update UI silently to Pro
                                    sendUIMessage({ type: 'user-status', payload: { isPro: true, trialCount } });
                                } else {
                                    await figma.clientStorage.setAsync('isPro', false);
                                }
                            }
                        } catch (e) {
                            // Network error — keep existing state
                        }
                    })();

                    break;
                }
            case 'get-smart-switch-announcement-status':
                {
                    try {
                        const seen = await figma.clientStorage.getAsync(SMART_SWITCH_ANNOUNCEMENT_KEY);
                        sendUIMessage({ type: 'smart-switch-announcement-status', payload: { seen: !!seen } });
                    } catch (error) {
                        console.warn('Could not read Smart Switch announcement status:', error.message);
                    }
                    break;
                }
            case 'dismiss-smart-switch-announcement':
                {
                    try {
                        await figma.clientStorage.setAsync(SMART_SWITCH_ANNOUNCEMENT_KEY, true);
                    } catch (error) {
                        console.warn('Could not save Smart Switch announcement status:', error.message);
                    }
                    break;
                }
            case 'get-onboarding-status':
                {
                    const hasCompleted = await figma.clientStorage.getAsync('hasCompletedOnboarding');
                    sendUIMessage({ type: 'onboarding-status', payload: { hasCompleted: !!hasCompleted } });
                    break;
                }
            case 'set-onboarding-status':
                {
                    await figma.clientStorage.setAsync('hasCompletedOnboarding', msg.payload.completed);
                    break;
                }
            case 'verify-license':
                {
                    const { licenseKey } = msg.payload;

                    try {
                        const currentFigmaUser = getCurrentFigmaUser();
                        const currentFigmaUserId = currentFigmaUser ? currentFigmaUser.id : null;

                        if (ACTIVATION_SERVER_BASE_URL && !currentFigmaUser) {
                            sendUIMessage({
                                type: 'license-invalid',
                                payload: { message: 'Figma user account is unavailable inside the plugin. Please close and reopen Figma, then try again.' }
                            });
                            break;
                        }

                        if (ACTIVATION_SERVER_BASE_URL && currentFigmaUser) {
                            const serverResult = await activateLicenseOnServer(licenseKey, currentFigmaUser);

                            if (serverResult && serverResult.success && serverResult.isPro) {
                                const currentTrialCount = await figma.clientStorage.getAsync('trialCount');
                                if (typeof currentTrialCount === 'number') {
                                    await figma.clientStorage.setAsync('trialCountBeforePro', currentTrialCount);
                                }
                                await figma.clientStorage.setAsync('isPro', true);
                                await figma.clientStorage.deleteAsync('licenseRevoked');
                                await figma.clientStorage.setAsync('licenseKey', licenseKey.trim());
                                await figma.clientStorage.setAsync('activatedFigmaUserId', currentFigmaUserId);
                                void sendTelemetryEvent('license_activation_success', { success: true });
                                sendUIMessage({ type: 'license-verified' });
                            } else {
                                const reason = (serverResult && serverResult.message) ? serverResult.message : 'Activation failed.';
                                void sendTelemetryEvent('license_activation_failed', { success: false, errorCode: 'server_activation_failed', message: reason });
                                sendUIMessage({ type: 'license-invalid', payload: { message: reason } });
                            }
                            break;
                        }

                        // Check if this key was already activated on another device by the same user
                        // If so, re-verify without incrementing (device transfer scenario)
                        const storedKey = await figma.clientStorage.getAsync('licenseKey');
                        const isReVerification = (storedKey === licenseKey.trim());
                        const shouldIncrement = !isReVerification;

                        const data = await verifyLicenseWithGumroad(licenseKey, shouldIncrement);

                        if (data.success && !data.purchase.chargebacked && !data.purchase.refunded) {
                            let isActive = true;
                            // For subscriptions, ensure they haven't failed or ended
                            if (data.purchase.subscription_failed_at || data.purchase.subscription_ended_at) {
                                isActive = false;
                            }

                            if (isActive) {
                                const currentTrialCount = await figma.clientStorage.getAsync('trialCount');
                                if (typeof currentTrialCount === 'number') {
                                    await figma.clientStorage.setAsync('trialCountBeforePro', currentTrialCount);
                                }
                                await figma.clientStorage.setAsync('isPro', true);
                                await figma.clientStorage.deleteAsync('licenseRevoked');
                                // Store the key AND the Figma user ID to bind license to this account
                                await figma.clientStorage.setAsync('licenseKey', licenseKey.trim());
                                const figmaUserId = currentFigmaUserId;
                                if (figmaUserId) {
                                    await figma.clientStorage.setAsync('activatedFigmaUserId', figmaUserId);
                                }
                                void sendTelemetryEvent('license_activation_success', { success: true });
                                sendUIMessage({ type: 'license-verified' });
                            } else {
                                void sendTelemetryEvent('license_activation_failed', { success: false, errorCode: 'inactive_subscription', message: 'Subscription ended or failed' });
                                sendUIMessage({ type: 'license-invalid', payload: { message: 'Your subscription has ended or failed. Please renew your subscription.' } });
                            }
                        } else {
                            const reason = data.message || 'Invalid license key or an issue with the purchase.';
                            void sendTelemetryEvent('license_activation_failed', { success: false, errorCode: 'invalid_license', message: reason });
                            sendUIMessage({ type: 'license-invalid', payload: { message: reason } });
                        }
                    } catch (error) {
                        console.error('Gumroad API verification error:', error);
                        if (ACTIVATION_SERVER_BASE_URL) {
                            const healthcheck = await pingActivationServer();
                            const diagnostic = healthcheck.ok
                                ? (error instanceof Error ? error.message : 'Activation request failed.')
                                : (healthcheck.reason || 'Activation server is unreachable from the plugin.');
                            void sendTelemetryEvent('license_activation_failed', { success: false, errorCode: 'activation_server_error', message: diagnostic });
                            sendUIMessage({ type: 'license-invalid', payload: { message: `Activation server error: ${diagnostic}` } });
                        } else {
                            void sendTelemetryEvent('license_activation_failed', { success: false, errorCode: 'activation_network_error', message: 'Could not connect to the activation server' });
                            sendUIMessage({ type: 'license-invalid', payload: { message: 'Could not connect to the activation server. Please try again.' } });
                        }
                    }
                    break;
                }
            case 'unsubscribe':
                {
                    // Lock cancellation before network cleanup to prevent a
                    // delayed verification from restoring the old license.
                    await figma.clientStorage.setAsync('licenseRevoked', true);
                    await figma.clientStorage.setAsync('isPro', false);
                    // Clear license binding data
                    await figma.clientStorage.deleteAsync('licenseKey');
                    await figma.clientStorage.deleteAsync('activatedFigmaUserId');
                    const currentFigmaUser = getCurrentFigmaUser();
                    if (ACTIVATION_SERVER_BASE_URL && currentFigmaUser) {
                        try {
                            await unlinkLicenseOnServer(currentFigmaUser.id);
                        } catch (e) {
                            console.warn('Failed to unlink license on activation server', e);
                        }
                    }
                    // Cancellation must not replenish trial usage. Keep the
                    // exact remaining count, clamped only for data safety.
                    let trialCountAfterCancel = await figma.clientStorage.getAsync('trialCount');
                    if (typeof trialCountAfterCancel !== 'number') trialCountAfterCancel = 0;
                    trialCountAfterCancel = Math.max(0, Math.min(FREE_TRIAL_LIMIT, trialCountAfterCancel));
                    await figma.clientStorage.setAsync('trialCount', trialCountAfterCancel);
                    await figma.clientStorage.deleteAsync('trialCountBeforePro');

                    figma.notify('You have successfully unsubscribed from PRO.');
                    sendUIMessage({
                        type: 'unsubscribe-success',
                        payload: { isPro: false, trialCount: trialCountAfterCancel }
                    });
                    break;
                }
            case 'open-url':
                {
                    const url = String(msg.payload && msg.payload.url || '');
                    if (url.includes('gumroad.com')) {
                        void sendTelemetryEvent('gumroad_clicked', { metadata: { source: 'upgrade_screen' } });
                    } else if (url.includes('wa.me')) {
                        void sendTelemetryEvent('support_clicked', { metadata: { source: 'upgrade_screen' } });
                    }
                    figma.openExternal(msg.payload.url);
                    break;
                }
            case 'telemetry':
                {
                    const payload = msg.payload || {};
                    if (payload.eventType) {
                        if (payload.eventType === 'feature_failed' && activeFeatureTelemetry) {
                            finishActiveFeatureTelemetry('feature_failed', {
                                success: false,
                                ...(payload.details || {})
                            });
                        } else {
                            void sendTelemetryEvent(payload.eventType, payload.details || {});
                        }
                    }
                    break;
                }
            case 'get-api-keys':
                {
                    const [geminiApiKey, openaiApiKey] = await Promise.all([
                        figma.clientStorage.getAsync('geminiApiKey'),
                        figma.clientStorage.getAsync('openaiApiKey')
                    ]);
                    sendUIMessage({ type: 'api-keys', payload: { gemini: geminiApiKey || null, openai: openaiApiKey || null } });
                    break;
                }
            case 'set-api-keys':
                {
                    await Promise.all([
                        figma.clientStorage.setAsync('geminiApiKey', msg.payload.gemini),
                        figma.clientStorage.setAsync('openaiApiKey', msg.payload.openai)
                    ]);
                    sendUIMessage({ type: 'api-keys-set' });
                    break;
                }
            case 'run-action':
                {
                    const [storedIsPro, licenseRevoked] = await Promise.all([
                        figma.clientStorage.getAsync('isPro'),
                        figma.clientStorage.getAsync('licenseRevoked')
                    ]);
                    const isPro = !!storedIsPro && !licenseRevoked;
                    const feature = getActionFeature(msg.payload);
                    const startedAt = Date.now();
                    const selectionTelemetry = await getSelectionTelemetry();
                    if (!isPro) {
                        let trialCount = await figma.clientStorage.getAsync('trialCount');
                        if (typeof trialCount !== 'number') {
                            trialCount = licenseRevoked ? 0 : FREE_TRIAL_LIMIT;
                            await figma.clientStorage.setAsync('trialCount', trialCount);
                        }
                        if (trialCount > 0) {
                            trialCount--;
                            await figma.clientStorage.setAsync('trialCount', trialCount);
                            sendUIMessage({ type: 'user-status-updated', payload: { trialCount } });
                            void sendTelemetryEvent('trial_used', { feature, trialCount, ...selectionTelemetry });
                        } else {
                            void sendTelemetryEvent('trial_exhausted', { feature, trialCount, ...selectionTelemetry, success: false });
                            sendUIMessage({ type: 'plugin-error', payload: { message: 'Trial expired. Please upgrade to Pro.' } });
                            return;
                        }
                    }
                    void sendTelemetryEvent('feature_started', {
                        feature,
                        fromLanguage: msg.payload.fromLanguage,
                        toLanguage: msg.payload.toLanguage,
                        ...selectionTelemetry,
                        metadata: {
                            translateText: !!msg.payload.translateText,
                            mirrorInstances: !!msg.payload.mirrorInstances,
                            createVariant: !!msg.payload.createVariant,
                            shouldMirror: !!msg.payload.shouldMirror
                        }
                    });
                    activeFeatureTelemetry = {
                        feature,
                        startedAt,
                        fromLanguage: msg.payload.fromLanguage,
                        toLanguage: msg.payload.toLanguage,
                        selectionTelemetry,
                        metadata: {
                            translateText: !!msg.payload.translateText,
                            mirrorInstances: !!msg.payload.mirrorInstances,
                            createVariant: !!msg.payload.createVariant,
                            shouldMirror: !!msg.payload.shouldMirror
                        }
                    };
                    try {
                        await handleRunAction(msg.payload);
                        if (!msg.payload.translateText || selectionTelemetry.textLayerCount === 0) {
                            finishActiveFeatureTelemetry();
                        }
                    } catch (error) {
                        finishActiveFeatureTelemetry('feature_failed', {
                            success: false,
                            errorCode: 'feature_exception',
                            message: error instanceof Error ? error.message : 'Feature failed'
                        });
                        throw error;
                    }
                    break;
                }
            case 'apply-translations':
                try {
                    await handleApplyTranslations(msg.payload);
                    if (pendingVariantCreation) {
                        await completeVariantCreation();
                    }
                    finishActiveFeatureTelemetry();
                } catch (error) {
                    finishActiveFeatureTelemetry('feature_failed', {
                        success: false,
                        errorCode: 'apply_translations_failed',
                        message: error instanceof Error ? error.message : 'Translation apply failed'
                    });
                    throw error;
                }
                break;

            // --- Font Changer Handlers ---
            case 'get-available-fonts':
                {
                    const fonts = await getAvailableFonts();
                    sendUIMessage({ type: 'available-fonts', payload: { fonts } });
                    break;
                }
            case 'get-font-styles':
                {
                    const { fontFamily } = msg.payload;
                    const styles = await getFontStyles(fontFamily);
                    sendUIMessage({ type: 'font-styles', payload: { styles } });
                    break;
                }
            case 'get-available-fonts-for-translate':
                {
                    try {
                        if (!availableFontsCache) {
                            availableFontsCache = await figma.listAvailableFontsAsync();
                        }
                        const families = new Map();
                        for (const f of availableFontsCache) {
                            if (!families.has(f.fontName.family)) {
                                families.set(f.fontName.family, []);
                            }
                            families.get(f.fontName.family).push(f.fontName.style);
                        }
                        const result = Array.from(families.entries()).map(([family, styles]) => ({
                            family,
                            styles,
                        }));
                        sendUIMessage({ type: 'available-fonts-for-translate', payload: { fonts: result } });
                    } catch (e) {
                        console.warn('Failed to list fonts:', e);
                        sendUIMessage({ type: 'available-fonts-for-translate', payload: { fonts: [] } });
                    }
                    break;
                }
            case 'get-variable-modes':
                {
                    try {
                        const collections = await figma.variables.getLocalVariableCollectionsAsync();
                        const allModes = [];
                        const seen = new Set();
                        for (const col of collections) {
                            for (const mode of col.modes) {
                                const fonts = [];
                                for (const vid of col.variableIds) {
                                    try {
                                        const v = figma.variables.getVariableById(vid);
                                        if (!v) continue;
                                        const raw = v.valuesByMode[mode.modeId];
                                        // Only collect string values that look like font family names.
                                        if (typeof raw === 'string' && raw.trim().length > 0) {
                                            fonts.push(raw);
                                        }
                                    } catch (e) { /* skip */ }
                                }
                                const key = `${col.name}::${mode.name}`;
                                if (seen.has(key)) continue;
                                seen.add(key);
                                allModes.push({
                                    collectionName: col.name,
                                    modeId: mode.modeId,
                                    modeName: mode.name,
                                    fonts: [...new Set(fonts)],
                                });
                            }
                        }
                        sendUIMessage({ type: 'variable-modes', payload: { modes: allModes } });
                    } catch (e) {
                        console.warn('Failed to get variable modes:', e);
                        sendUIMessage({ type: 'variable-modes', payload: { modes: [] } });
                    }
                    break;
                }
            case 'count-text-layers':
                {
                    const count = await countTextLayersInSelection();
                    sendUIMessage({ type: 'text-layers-count', payload: { count } });
                    break;
                }
            case 'change-font':
                {
                    const isPro = await figma.clientStorage.getAsync('isPro');
                    const feature = 'change-font';
                    const startedAt = Date.now();
                    const selectionTelemetry = await getSelectionTelemetry();
                    if (!isPro) {
                        let trialCount = await figma.clientStorage.getAsync('trialCount');
                        if (typeof trialCount !== 'number') {
                            trialCount = FREE_TRIAL_LIMIT;
                            await figma.clientStorage.setAsync('trialCount', trialCount);
                        }
                        if (trialCount > 0) {
                            trialCount--;
                            await figma.clientStorage.setAsync('trialCount', trialCount);
                            sendUIMessage({ type: 'user-status-updated', payload: { trialCount } });
                            void sendTelemetryEvent('trial_used', { feature, trialCount, ...selectionTelemetry });
                        } else {
                            // Should be caught by UI, but double check
                            void sendTelemetryEvent('trial_exhausted', { feature, trialCount, ...selectionTelemetry, success: false });
                            sendUIMessage({ type: 'plugin-error', payload: { message: 'Trial expired. Please upgrade to Pro.' } });
                            return;
                        }
                    }
                    void sendTelemetryEvent('feature_started', {
                        feature,
                        ...selectionTelemetry,
                        metadata: { autoFit: !!msg.payload.autoFit }
                    });
                    const fontResult = await handleChangeFont(msg.payload);
                    void sendTelemetryEvent(fontResult && fontResult.success ? 'feature_completed' : 'feature_failed', {
                        feature,
                        durationMs: Date.now() - startedAt,
                        ...selectionTelemetry,
                        success: !!(fontResult && fontResult.success),
                        errorCode: fontResult && fontResult.errorCode,
                        message: fontResult && fontResult.message,
                        metadata: { autoFit: !!msg.payload.autoFit }
                    });
                    break;
                }
            case 'get-recent-fonts':
                {
                    const recentFonts = await figma.clientStorage.getAsync('recentFonts') || [];
                    sendUIMessage({ type: 'recent-fonts', payload: { fonts: recentFonts } });
                    break;
                }
            case 'save-recent-fonts':
                {
                    await figma.clientStorage.setAsync('recentFonts', msg.payload.fonts);
                    break;
                }
        }
    } catch (error) {
        const technicalMessage = error instanceof Error ? `Plugin Error: ${error.message}` : 'An unexpected error occurred in the plugin.';
        const userFacingMessage = formatUserFacingPluginError(error);
        console.error(technicalMessage, error);
        sendUIMessage({ type: 'plugin-error', payload: { message: userFacingMessage } });
        pendingVariantCreation = null; // Reset state on error
    }
};

async function handleRunAction(payload) {
    const { actionType } = payload;
    switch (actionType) {
        case 'create-variant':
            await handleCreateVariant(payload);
            break;
        case 'mirror-translate':
            await processNodesInPlace(payload, true);
            break;
        case 'translate-only':
            await processNodesInPlace(payload, false);
            break;
    }
}

function getTranslationScreen(node) {
    let screen = node;
    for (let depth = 0; screen && screen.parent && depth < 40; depth++) {
        if (screen.parent.type === 'PAGE' || screen.parent.type === 'SECTION') break;
        screen = screen.parent;
    }
    return screen || node;
}

function analyzePageForTranslation(textNodes) {
    const started = Date.now();
    const maxNodes = 2500;
    const maxCharacters = 9000;
    const summary = { page: String(figma.currentPage.name || '').slice(0, 120), screens: [],
        pageSamples: [], truncated: false, scannedNodes: 0 };
    const roots = new Map();
    for (const node of textNodes) {
        const screen = getTranslationScreen(node);
        if (!roots.has(screen.id) && roots.size < 6) roots.set(screen.id, screen);
    }
    const visited = new Set();
    let characters = 0;
    function sample(rootNodes, output, limit) {
        const pending = rootNodes.slice(0, maxNodes).reverse();
        const unique = new Set();
        while (pending.length && output.length < limit) {
            if (visited.size >= maxNodes || characters >= maxCharacters || Date.now() - started >= 120) {
                summary.truncated = true;
                break;
            }
            const node = pending.pop();
            if (!node || visited.has(node.id) || node.visible === false) continue;
            visited.add(node.id);
            if (node.type === 'TEXT') {
                const value = String(node.characters || '').trim().replace(/\s+/g, ' ').slice(0, Math.min(180, maxCharacters - characters));
                if (value && !unique.has(value)) {
                    unique.add(value);
                    output.push(value);
                    characters += value.length;
                }
            } else if ('children' in node) {
                const children = node.children;
                const remaining = Math.max(0, maxNodes - visited.size - pending.length);
                if (children.length > remaining) summary.truncated = true;
                pending.push(...children.slice(0, remaining).reverse());
            }
        }
        if (pending.length) summary.truncated = true;
    }
    // Prefer the selected screen over unrelated screens elsewhere on the page.
    for (const [id, root] of roots) {
        const screen = { id, name: String(root.name || '').slice(0, 100), texts: [] };
        sample([root], screen.texts, 28);
        summary.screens.push(screen);
    }
    const pageChildren = figma.currentPage.children || [];
    if (pageChildren.length > maxNodes) summary.truncated = true;
    sample(pageChildren.slice(0, maxNodes), summary.pageSamples, 32);
    summary.scannedNodes = visited.size;
    return summary;
}

function getTranslationContext(node) {
    const path = [];
    for (let parent = node.parent; parent && path.length < 3; parent = parent.parent) {
        if (parent.type === 'PAGE' || parent.type === 'DOCUMENT') break;
        path.push(String(parent.name || '').slice(0, 80));
    }
    const nearby = [];
    const pending = node.parent && 'children' in node.parent ? [...node.parent.children] : [];
    let visited = 0;
    while (pending.length && nearby.length < 8 && visited++ < 80) {
        const sibling = pending.shift();
        if (sibling.id === node.id) continue;
        if (sibling.type === 'TEXT') nearby.push(String(sibling.characters || '').slice(0, 160));
        else if ('children' in sibling) pending.push(...sibling.children);
    }
    return { layer: String(node.name || '').slice(0, 80), screenId: getTranslationScreen(node).id, containers: path, nearby };
}

async function processTextNodesForTranslation(textNodes, fromLanguage, toLanguage, currentStep, totalSteps) {
    const textsForApi = [];
    sendProgress(currentStep, 'Analyzing page context', 0, 1, 'Reading screen content and nearby labels...', totalSteps);
    const pageContext = analyzePageForTranslation(textNodes);
    let dictionaryMatches = 0;
    // Every sendProgress() serialises a message and forces a re-render in the
    // UI, so only emit one when the label could actually have changed (~8/s).
    let lastProgressAt = 0;

    for (let i = 0; i < textNodes.length; i++) {
        const node = textNodes[i];
        const originalText = node.characters;
        let lookupKey = normalizeDictionaryWrapper(originalText);
        let dictionaryTranslation = undefined;
        let dictionaryHints = [];

        const now = Date.now();
        if (i === 0 || i === textNodes.length - 1 || now - lastProgressAt > 120) {
            lastProgressAt = now;
            sendProgress(currentStep, 'Checking dictionary', i + 1, textNodes.length, `Checking text ${i + 1} of ${textNodes.length}...`, totalSteps);
        }

        if (fromLanguage === 'auto') {
            if (enToLangLookup[toLanguage] && enToLangLookup[toLanguage][lookupKey]) {
                dictionaryTranslation = enToLangLookup[toLanguage][lookupKey];
            } else if (toLanguage === 'en') {
                for (const [langCode, dict] of Object.entries(langToEnLookup)) {
                    let keyToCheck = lookupKey;
                    if (langCode === 'ar') { keyToCheck = normalizeArabic(lookupKey); }
                    if (dict[keyToCheck]) {
                        dictionaryTranslation = dict[keyToCheck];
                        break;
                    }
                }
            }
        } else {
            if (fromLanguage === 'en' && enToLangLookup[toLanguage]) {
                dictionaryTranslation = enToLangLookup[toLanguage][lookupKey];
            } else if (toLanguage === 'en' && langToEnLookup[fromLanguage]) {
                if (fromLanguage === 'ar') { lookupKey = normalizeArabic(lookupKey); }
                dictionaryTranslation = langToEnLookup[fromLanguage][lookupKey];
            }
        }

        // Longer strings can contain known terms alongside ordinary words.
        // Keep those terms as glossary hints for the AI instead of replacing
        // the whole sentence with a partial dictionary result.
        if (!dictionaryTranslation) {
            dictionaryHints = getDictionaryHints(originalText, fromLanguage, toLanguage);
        }

        if (dictionaryTranslation || dictionaryHints.length) dictionaryMatches++;
        // Dictionary entries are suggestions. AI must be able to override an
        // ambiguous word using the page's domain rather than receiving it too late.
        textsForApi.push({ id: node.id, characters: originalText,
            context: { ...getTranslationContext(node), dictionaryTranslation, dictionaryHints } });
    }

    sendProgress(currentStep, 'Checking dictionary', textNodes.length, textNodes.length, `${dictionaryMatches} terminology suggestions; page context ready`, totalSteps);

    if (textsForApi.length > 0) {
        sendUIMessage({ type: 'text-nodes-found', payload: { texts: textsForApi, pageContext, fromLanguage, toLanguage, currentStep, totalSteps } });
    } else {
        if (!pendingVariantCreation) {
            sendUIMessage({ type: 'action-complete' });
            finishActiveFeatureTelemetry();
        } else {
            await completeVariantCreation();
            finishActiveFeatureTelemetry();
        }
    }
}

function restoreTranslatedTextSegmentStyles(node, originalText, translatedText, segments, preserveTypography = false) {
    if (!node || !segments || segments.length === 0 || !originalText || !translatedText) return;

    const originalLength = originalText.length;
    const translatedLength = translatedText.length;
    const originalLineStarts = [0];
    const translatedLineStarts = [0];
    for (let i = 0; i < originalText.length; i++) {
        if (originalText[i] === '\n') originalLineStarts.push(i + 1);
    }
    for (let i = 0; i < translatedText.length; i++) {
        if (translatedText[i] === '\n') translatedLineStarts.push(i + 1);
    }
    const lineIndexAt = (starts, offset) => {
        let low = 0;
        let high = starts.length - 1;
        while (low <= high) {
            const middle = Math.floor((low + high) / 2);
            if (starts[middle] <= offset) low = middle + 1;
            else high = middle - 1;
        }
        return Math.max(0, high);
    };
    for (const segment of segments) {
        const originalStartLine = lineIndexAt(originalLineStarts, segment.start);
        const originalEndLine = lineIndexAt(originalLineStarts, Math.max(segment.start, segment.end - 1));
        const startLine = Math.min(originalStartLine, translatedLineStarts.length - 1);
        const endLine = Math.min(originalEndLine, translatedLineStarts.length - 1);
        const lineStartOffset = translatedLineStarts[startLine];
        const lineEndOffset = endLine + 1 < translatedLineStarts.length
            ? translatedLineStarts[endLine + 1] - 1
            : translatedLength;
        const start = originalLineStarts.length > 1
            ? lineStartOffset
            : Math.max(0, Math.min(translatedLength, Math.round((segment.start / originalLength) * translatedLength)));
        const end = originalLineStarts.length > 1
            ? Math.max(start, lineEndOffset)
            : Math.max(start, Math.min(translatedLength, Math.round((segment.end / originalLength) * translatedLength)));
        if (end <= start) continue;

        try {
            if (!preserveTypography && segment.fontSize && segment.fontSize !== figma.mixed) node.setRangeFontSize(start, end, segment.fontSize);
            if (!preserveTypography && segment.fontName && segment.fontName !== figma.mixed) node.setRangeFontName(start, end, segment.fontName);
            // Apply fills last. Figma can reset range fills when a font range
            // is changed after the paint range was applied.
            if (segment.fills && Array.isArray(segment.fills)) node.setRangeFills(start, end, segment.fills);
        } catch (error) {
            console.warn(`Could not restore translated text styling for "${node.name}": ${error.message}`);
        }
    }
}

function sendProgress(step, stepLabel, processed, total, substep, totalSteps) {
    checkOperationCancelled();
    sendUIMessage({ type: 'progress-update', payload: { step, stepLabel, processed, total, substep, totalSteps } });
}

function countTotalSteps(shouldMirror, translateText) {
    let steps = 0;
    if (shouldMirror) steps++;
    if (translateText) steps += 3;
    return steps;
}

async function processNodesInPlace(payload, shouldMirror) {
    const { fromLanguage, toLanguage, translateText, mirrorInstances, smartSwitchComponents, forceMirror } = payload;
    const selection = figma.currentPage.selection;
    const mirrorContext = createMirrorContext({ fromLanguage, toLanguage, translateText, smartSwitchComponents, forceMirror });

    if (selection.length === 0) {
        sendUIMessage({ type: 'plugin-error', payload: { message: 'Please select at least one item to process.' } });
        return;
    }

    const totalSteps = countTotalSteps(shouldMirror, translateText);
    let currentStep = 0;
    await applyLocalePropertiesToNodes(selection, toLanguage, mirrorContext, shouldMirror);

    if (shouldMirror) {
        currentStep++;
        sendProgress(currentStep, 'Mirroring layout', 0, selection.length, `Processing ${selection.length} node(s)...`, totalSteps);
        for (let i = 0; i < selection.length; i++) {
            await mirrorNode(resolveDetachedNode(selection[i], mirrorContext), false, mirrorContext, mirrorInstances);
            sendProgress(currentStep, 'Mirroring layout', i + 1, selection.length, `Mirroring node ${i + 1} of ${selection.length}`, totalSteps);
        }
    } else {
        if (forceMirror) {
            for (const node of selection) {
                if (node.type === 'INSTANCE' && !isIconInstance(node)) detachInstanceForForceMirror(node, mirrorContext);
                else detachForceMirrorInstancesInTree(node, mirrorContext);
            }
        }
        // Translate Only still needs a locale variant for nested component
        // instances. Their text is owned by the nested main component and
        // cannot be reliably edited through the parent instance. Prepare the
        // connected target variants without mirroring the surrounding layout.
        for (const node of selection) {
            if (forceMirror) continue;
            await prepareNestedVariantsForTranslation(resolveDetachedNode(node, mirrorContext), mirrorContext);
        }
    }

    if (translateText) {
        const nodesForTranslation = selection.map(node => resolveDetachedNode(node, mirrorContext));
        nodesForTranslation.push(...mirrorContext.createdVariants.values());
        nodesForTranslation.push(...mirrorContext.targetVariants.values());

        currentStep++;
        sendProgress(currentStep, 'Finding text layers', 0, 0, 'Scanning selected nodes...', totalSteps);
        const textNodes = findTextNodes(nodesForTranslation, mirrorContext.smartSwitchedNodeIds);
        for (const textNode of mirrorContext.smartSwitchTranslationNodes) {
            if (!textNodes.some(node => node.id === textNode.id)) textNodes.push(textNode);
        }
        if (textNodes.length === 0) {
            figma.notify(shouldMirror ? 'Selection mirrored. No text found to translate.' : 'No text layers found in selection.');
            sendUIMessage({ type: 'action-complete' });
            return;
        }
        sendProgress(currentStep, 'Finding text layers', textNodes.length, textNodes.length, `Found ${textNodes.length} text layer(s)`, totalSteps);

        await processTextNodesForTranslation(textNodes, fromLanguage, toLanguage, currentStep, totalSteps);
    } else {
        if (shouldMirror) figma.notify('Selection mirrored successfully!');
        sendUIMessage({ type: 'action-complete' });
    }
}

async function prepareNestedVariantsForTranslation(root, mirrorContext) {
    if (!root || !('children' in root)) return;

    const children = Array.from(root.children);
    for (const child of children) {
        if (child.type === 'INSTANCE') {
            try {
                const mainComponent = await child.getMainComponentAsync();
                if (mainComponent && !mainComponent.remote) {
                    const targetVariant = await ensureTargetVariant(mainComponent, mirrorContext, false);
                    if (targetVariant && targetVariant.id !== mainComponent.id) {
                        const originalSizing = captureInstanceSizing(child);
                        child.swapComponent(targetVariant);
                        restoreInstanceSizing(child, originalSizing);
                    }
                    continue;
                }
            } catch (error) {
                console.warn(`Could not prepare nested translation variant for "${child.name}": ${error.message}`);
            }
        }
        await prepareNestedVariantsForTranslation(child, mirrorContext);
    }
}

function createMirrorContext(options = {}) {
    return {
        targetVariants: new Map(),
        createdVariants: new Map(),
        smartSwitchAttempts: new Set(),
        smartSwitchedNodeIds: new Set(),
        smartSwitchTranslationNodes: [],
        detachedNodeReplacements: new Map(),
        forceDetachedSubtreeIds: new Set(),
        options
    };
}

function resolveDetachedNode(node, mirrorContext) {
    if (!node || !mirrorContext?.detachedNodeReplacements) return node;
    return mirrorContext.detachedNodeReplacements.get(node.id) || node;
}

function isInsideForceDetachedSubtree(node, mirrorContext) {
    for (let current = node?.parent; current; current = current.parent) {
        if (mirrorContext.forceDetachedSubtreeIds.has(current.id)) return true;
    }
    return false;
}

function isIconInstance(node) {
    if (!node || node.type !== 'INSTANCE') return false;
    // Do not depend on layer names: library icons can be named anything.
    // An instance without text is treated as a graphic/icon and stays linked.
    return findTextNodes([node]).length === 0;
}

function detachInstanceForForceMirror(node, mirrorContext) {
    if (!node || node.type !== 'INSTANCE') return node;
    if (isInsideForceDetachedSubtree(node, mirrorContext)) return node;
    if (typeof node.detachInstance !== 'function') {
        throw new Error(`Cannot force mirror instance "${node.name}": detachInstance is unavailable.`);
    }
    const originalId = node.id;
    const detachedNode = node.detachInstance();
    if (!detachedNode || !detachedNode.id) {
        throw new Error(`Could not detach instance "${node.name}" for force mirror.`);
    }
    mirrorContext.detachedNodeReplacements.set(originalId, detachedNode);
    mirrorContext.forceDetachedSubtreeIds.add(detachedNode.id);
    return detachedNode;
}

function detachForceMirrorInstancesInTree(root, mirrorContext) {
    if (!root || !('children' in root)) return;
    const pending = Array.from(root.children);
    while (pending.length) {
        const node = pending.pop();
        if (!node) continue;
        if (node.type === 'INSTANCE') {
            if (!isIconInstance(node) && !isInsideForceDetachedSubtree(node, mirrorContext)) detachInstanceForForceMirror(node, mirrorContext);
            continue;
        }
        if ('children' in node) pending.push(...node.children);
    }
}

async function handleCreateVariant(payload) {
    const context = createMirrorContext();
    for (const node of figma.currentPage.selection) {
        if (await skipInvalidComponent(node, context)) {
            figma.notify('Skipped component with broken or invalid variants.');
            sendUIMessage({ type: 'action-complete' });
            return;
        }
    }
    try {
        await handleCreateVariantUnchecked(payload);
    } catch (error) {
        if (!isInvalidVariantError(error)) throw error;
        console.warn('Skipped invalid component variant creation:', error.message);
        pendingVariantCreation = null;
        figma.notify('Skipped component with broken or invalid variants.');
        sendUIMessage({ type: 'action-complete' });
    }
}

async function handleCreateVariantUnchecked(payload) {
    const { fromLanguage, toLanguage, translateText, mirrorInstances, shouldMirror, smartSwitchComponents, forceMirror } = payload;
    const selection = figma.currentPage.selection;

    if (selection.length !== 1) {
        figma.notify('Please select a single Component, Component Set, or Instance.', { error: true });
        sendUIMessage({ type: 'action-complete' });
        return;
    }
    const selectedNode = selection[0];
    let sourceComponentOrSet;

    if (selectedNode.type === 'COMPONENT_SET') {
        sourceComponentOrSet = selectedNode;
    } else if (selectedNode.type === 'COMPONENT') {
        sourceComponentOrSet = selectedNode;
    } else if (selectedNode.type === 'INSTANCE') {
        const mainComponent = await selectedNode.getMainComponentAsync();
        if (mainComponent) {
            sourceComponentOrSet = mainComponent;
        }
    } else {
        figma.notify('Please select a component or an instance.', { error: true });
        sendUIMessage({ type: 'action-complete' });
        return;
    }

    if (!sourceComponentOrSet || sourceComponentOrSet.remote) {
        figma.notify('Cannot create a variant for a remote component.', { error: true });
        sendUIMessage({ type: 'action-complete' });
        return;
    }

    const originalInstanceId = selectedNode.type === 'INSTANCE' ? selectedNode.id : null;
    const sourceParent = sourceComponentOrSet.type === 'COMPONENT'
        ? await getComponentParentAsync(sourceComponentOrSet)
        : sourceComponentOrSet.parent;

    if (!sourceParent) {
        figma.notify('Cannot create variants because this main component no longer has a local parent in the file.', { error: true });
        sendUIMessage({ type: 'action-complete' });
        return;
    }

    let originalVariants = [];
    let isExistingSet = false;
    let componentSet = null;
    let hasShownCreationNotification = false;

    if (sourceComponentOrSet.type === 'COMPONENT_SET') {
        originalVariants = Array.from(sourceComponentOrSet.children);
        isExistingSet = true;
        componentSet = sourceComponentOrSet;
    } else {
        originalVariants = [sourceComponentOrSet];
        if (sourceComponentOrSet.parent && sourceComponentOrSet.parent.type === 'COMPONENT_SET') {
            isExistingSet = true;
            componentSet = sourceComponentOrSet.parent;
        }
    }

    const getPropsMapTemp = (name) => {
        const properties = new Map();
        name.split(',').forEach(part => {
            const [key, value] = part.split('=').map(s => s.trim());
            if (key && value) properties.set(key, value);
        });
        return properties;
    };

    if (isExistingSet && selectedNode.type === 'COMPONENT') {
        const baseLang = getPropsMapTemp(selectedNode.name).get('Language');
        if (baseLang) {
            originalVariants = originalVariants.filter(v => getPropsMapTemp(v.name).get('Language') === baseLang);
        } else {
            originalVariants = [selectedNode];
        }
    } else if (isExistingSet) {
        // If they selected the ComponentSet, use the first variant's language as the base
        const baseLang = getPropsMapTemp(originalVariants[0].name).get('Language');
        if (baseLang) {
            originalVariants = originalVariants.filter(v => getPropsMapTemp(v.name).get('Language') === baseLang);
        }
    }

    let newVariants = [];

    const langNames = {
        'auto': 'Auto Detect', 'en': 'English', 'ar': 'Arabic', 'es': 'Spanish', 'fr': 'French',
        'de': 'German', 'ja': 'Japanese', 'ko': 'Korean', 'pt': 'Portuguese', 'ru': 'Russian',
        'zh': 'Chinese', 'tr': 'Turkish'
    };

    let sourceIsRtl = false;
    if (fromLanguage === 'auto') {
        const sourceLanguageProbeNode = selectedNode.type === 'COMPONENT_SET'
            ? (originalVariants[0] || sourceComponentOrSet)
            : sourceComponentOrSet;
        const textNodes = findTextNodes([sourceLanguageProbeNode]);
        const allText = textNodes.map(n => n.characters).join(' ');
        const rtlRegex = /[\u0600-\u06FF]/;
        if (rtlRegex.test(allText)) sourceIsRtl = true;
    } else {
        sourceIsRtl = fromLanguage === 'ar';
    }

    const toIsRtl = toLanguage === 'ar';

    const fromLangName = (fromLanguage === 'auto')
        ? (sourceIsRtl ? 'Arabic' : 'English')
        : (langNames[fromLanguage] || fromLanguage);
    const sourceDirectionText = sourceIsRtl ? 'RTL' : 'LTR';

    const toLangName = langNames[toLanguage] || toLanguage;
    const targetDirectionText = toIsRtl ? 'RTL' : 'LTR';

    const getPropsMap = (name) => {
        const properties = new Map();
        name.split(',').forEach(part => {
            const [key, value] = part.split('=').map(s => s.trim());
            if (key && value) properties.set(key, value);
        });
        return properties;
    };

    const setPropsString = (propsMap) => {
        return Array.from(propsMap.entries()).map(([k, v]) => `${k}=${v}`).join(', ');
    };

    if (componentSet) {
        normalizeComponentSetVariantProps(componentSet, fromLangName, sourceIsRtl);
    }

    if (!isExistingSet) {
        const originalNodeName = sourceComponentOrSet.name;
        const hasVariantsAlready = originalNodeName.includes('=');

        let originalPropsMap = new Map();
        if (hasVariantsAlready) {
            originalPropsMap = getPropsMap(originalNodeName);
        }

        originalPropsMap.set('RTL', sourceDirectionText === 'RTL' ? 'True' : 'False');
        if (!originalPropsMap.has('Language')) originalPropsMap.set('Language', fromLangName);
        sourceComponentOrSet.name = setPropsString(originalPropsMap);

        const sourcePropsObject = Object.fromEntries(originalPropsMap);
        const targetPropsObject = Object.assign({}, sourcePropsObject, {
            RTL: targetDirectionText === 'RTL' ? 'True' : 'False',
            Language: toLangName
        });

        if (
            sourcePropsObject.RTL === targetPropsObject.RTL &&
            sourcePropsObject.Language === targetPropsObject.Language
        ) {
            targetPropsObject.Language = `${toLangName} 2`;
        }

        figma.notify('Creating new variants...');
        hasShownCreationNotification = true;
        const newVariant = sourceComponentOrSet.clone();
        resetMirrorMarker(newVariant);
        newVariant.name = variantPropsToName(targetPropsObject);

        const parentAfterPlace = placeCloneForVariantCombine(sourceComponentOrSet, newVariant, sourceParent);
        componentSet = figma.combineAsVariants([sourceComponentOrSet, newVariant], parentAfterPlace);
        componentSet.layoutMode = 'NONE';

        if (!hasVariantsAlready) componentSet.name = originalNodeName;
        newVariants.push(newVariant);

        sourceComponentOrSet.x = 24;
        sourceComponentOrSet.y = 24;
        newVariant.x = sourceComponentOrSet.x + sourceComponentOrSet.width + 100;
        newVariant.y = 24;
    } else {
        componentSet.layoutMode = 'NONE';

        for (const variant of originalVariants) {
            const propsMap = getPropsMap(variant.name);
            if (!propsMap.has('RTL')) propsMap.set('RTL', sourceDirectionText === 'RTL' ? 'True' : 'False');
            if (!propsMap.has('Language')) propsMap.set('Language', fromLangName);
            variant.name = setPropsString(propsMap);
        }

        // Calculate global shift variables
        let baseMinX = Infinity;
        let origMaxX = -Infinity;
        for (const variant of originalVariants) {
            baseMinX = Math.min(baseMinX, variant.x);
            origMaxX = Math.max(origMaxX, variant.x + variant.width);
        }

        let maxSetX = -Infinity;
        for (const child of componentSet.children) {
            maxSetX = Math.max(maxSetX, child.x + child.width);
        }
        const shiftStartX = maxSetX + 150; // extra padding to ensure no overlaps
        for (const originalVariant of originalVariants) {
            const propsMap = getPropsMapTemp(originalVariant.name);
            propsMap.set('RTL', targetDirectionText === 'RTL' ? 'True' : 'False');
            propsMap.set('Language', toLangName);
            const targetPropsObject = Object.fromEntries(propsMap);
            targetPropsObject.Language = getUniqueVariantLanguageValue(componentSet, targetPropsObject, toLangName);

            if (!hasShownCreationNotification) {
                figma.notify('Creating new variants...');
                hasShownCreationNotification = true;
            }
            const newVariant = originalVariant.clone();
            resetMirrorMarker(newVariant);
            newVariant.name = variantPropsToName(targetPropsObject);

            componentSet.appendChild(newVariant);
            newVariants.push(newVariant);

            // Reverse the relative X distance using mathematical shift
            newVariant.x = shiftStartX + (origMaxX - (originalVariant.x + originalVariant.width));
            newVariant.y = originalVariant.y;
        }
    }

    if (!isExistingSet) {
        componentSet.clipsContent = true;
        componentSet.cornerRadius = 5;
        componentSet.strokes = [{
            type: 'SOLID',
            color: { r: 0x8A / 255, g: 0x38 / 255, b: 0xF5 / 255 }
        }];
        componentSet.strokeWeight = 1;
        componentSet.strokeAlign = 'INSIDE';
    }

    // Compute bounding box manually to fit all variants since resizeToFit is not a Figma API method on ComponentSetNode
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    for (const child of componentSet.children) {
        minX = Math.min(minX, child.x);
        minY = Math.min(minY, child.y);
        maxX = Math.max(maxX, child.x + child.width);
        maxY = Math.max(maxY, child.y + child.height);
    }

    if (minX !== Infinity) {
        const padding = 24;
        const newWidth = (maxX - minX) + (padding * 2);
        const newHeight = (maxY - minY) + (padding * 2);

        componentSet.resize(Math.max(1, newWidth), Math.max(1, newHeight));

        for (const child of componentSet.children) {
            child.x = (child.x - minX) + padding;
            child.y = (child.y - minY) + padding;
        }
    }

    pendingVariantCreation = {
        newVariantIds: newVariants.map(v => v.id),
        componentSetId: componentSet.id,
        fromLanguage,
        toLanguage,
        originalInstanceId
    };

    const mirrorContext = createMirrorContext({ fromLanguage, toLanguage, translateText, smartSwitchComponents, forceMirror });
    if (shouldMirror !== false) {
        for (const newVariant of newVariants) {
            await mirrorNode(newVariant, false, mirrorContext, mirrorInstances);
        }
    } else {
        // Create Variant + Translate Only must still localize nested component
        // instances. The parent variant is cloned, so prepare and swap its
        // nested locale variants without mirroring the parent layout.
        for (const newVariant of newVariants) {
            await prepareNestedVariantsForTranslation(newVariant, mirrorContext);
        }
    }
    pendingVariantCreation.nestedComponentSetIds = Array.from(new Set(
        Array.from(mirrorContext.createdVariants.values())
            .map(variant => variant.parent)
            .filter(parent => parent && parent.type === 'COMPONENT_SET')
            .map(parent => parent.id)
    ));

    if (translateText) {
        const textNodes = [];
        const translationRoots = newVariants.concat(
            Array.from(mirrorContext.createdVariants.values()),
            Array.from(mirrorContext.targetVariants.values())
        );
        const seenTextNodeIds = new Set();
        for (const root of translationRoots) {
            for (const textNode of findTextNodes([root], mirrorContext.smartSwitchedNodeIds)) {
                if (!seenTextNodeIds.has(textNode.id)) {
                    seenTextNodeIds.add(textNode.id);
                    textNodes.push(textNode);
                }
            }
        }
        for (const textNode of mirrorContext.smartSwitchTranslationNodes) {
            if (!seenTextNodeIds.has(textNode.id)) {
                seenTextNodeIds.add(textNode.id);
                textNodes.push(textNode);
            }
        }

        if (textNodes.length === 0) {
            figma.notify((shouldMirror !== false) ? 'New variants mirrored. No text found to translate.' : 'New variants created. No text found to translate.');
            await completeVariantCreation();
        } else {
            await processTextNodesForTranslation(textNodes, fromLanguage, toLanguage);
        }
    } else {
        await completeVariantCreation();
    }
}

async function completeVariantCreation() {
    if (!pendingVariantCreation) return;

    const { newVariantIds, componentSetId, originalInstanceId, nestedComponentSetIds = [] } = pendingVariantCreation;

    pendingVariantCreation = null;

    const componentSet = await figma.getNodeByIdAsync(componentSetId);
    if (!componentSet || componentSet.removed) {
        figma.notify('Component set not found. Variant creation failed.', { error: true });
        sendUIMessage({ type: 'action-complete' });
        return;
    }

    // Translation can change text and auto-layout dimensions, so fit both the selected
    // set and every nested set again after all asynchronous translation work finishes.
    fitComponentSetToChildren(componentSet);
    for (const nestedSetId of nestedComponentSetIds) {
        const nestedSet = await figma.getNodeByIdAsync(nestedSetId);
        if (nestedSet && !nestedSet.removed && nestedSet.type === 'COMPONENT_SET') {
            fitComponentSetToChildren(nestedSet);
        }
    }

    let selectionTargets = [];
    if (originalInstanceId) {
        try {
            const originalInstance = await figma.getNodeByIdAsync(originalInstanceId);
            if (originalInstance && !originalInstance.removed) {
                selectionTargets = [originalInstance];
            } else {
                selectionTargets = [componentSet];
            }
        } catch (e) {
            selectionTargets = [componentSet];
        }
    } else {
        selectionTargets = [componentSet];
    }

    figma.currentPage.selection = selectionTargets;
    figma.notify('Variant pairs created successfully.');
    sendUIMessage({ type: 'action-complete' });
}


// A cache for available fonts to avoid calling the async function repeatedly during a single action.
let availableFontsCache = null;
const fontStylesCache = new Map();
const fontLoadStatusCache = new Map();
const fallbackFontCache = new Map();
const fontsByFamilyCache = new Map();

function getFontCacheKey(fontName) {
    if (!fontName || fontName === figma.mixed) return null;
    return `${fontName.family}::${fontName.style}`;
}

async function ensureFontLoaded(fontName) {
    const cacheKey = getFontCacheKey(fontName);
    if (!cacheKey) return false;

    if (fontLoadStatusCache.has(cacheKey)) {
        return fontLoadStatusCache.get(cacheKey);
    }

    try {
        await figma.loadFontAsync(fontName);
        fontLoadStatusCache.set(cacheKey, true);
        return true;
    } catch (error) {
        fontLoadStatusCache.set(cacheKey, false);
        return false;
    }
}

function getFontsInFamily(family) {
    if (fontsByFamilyCache.has(family)) {
        return fontsByFamilyCache.get(family);
    }

    const fontsInFamily = availableFontsCache ? availableFontsCache.filter(f => f.fontName.family === family) : [];
    fontsByFamilyCache.set(family, fontsInFamily);
    return fontsInFamily;
}

async function findBestFallbackFont(missingFont) {
    const cacheKey = getFontCacheKey(missingFont);
    if (cacheKey && fallbackFontCache.has(cacheKey)) {
        return fallbackFontCache.get(cacheKey);
    }

    if (!availableFontsCache) {
        try {
            availableFontsCache = await figma.listAvailableFontsAsync();
        } catch (e) {
            console.error("Could not list available fonts:", e);
            availableFontsCache = []; // Avoid retrying on subsequent calls
            return null;
        }
    }

    // Strategy: Find another style in the same family.
    const fontsInFamily = getFontsInFamily(missingFont.family);

    if (fontsInFamily.length > 0) {
        // Prefer common styles if available.
        const stylePreferences = [
            'Regular', 'Normal', 'Book', 'Roman',
            'Medium', 'SemiBold', 'Semibold', 'Bold',
            'Italic'
        ];
        for (const style of stylePreferences) {
            const found = fontsInFamily.find(f => normalizeName(f && f.fontName && f.fontName.style) === normalizeName(style));
            if (found) {
                if (cacheKey) fallbackFontCache.set(cacheKey, found.fontName);
                return found.fontName;
            }
        }
        // If no preferred style is found, return the first available style for that family.
        if (cacheKey) fallbackFontCache.set(cacheKey, fontsInFamily[0].fontName);
        return fontsInFamily[0].fontName;
    }

    if (cacheKey) fallbackFontCache.set(cacheKey, null);
    return null; // No fallback found in the same family.
}

function normalizeName(value) {
    return String(value || '').trim().toLowerCase().replace(/[\s_-]+/g, ' ');
}

function getLanguageModeNames(languageCode) {
    const namesByCode = {
        ar: ['arabic', 'ar'],
        en: ['english', 'en'],
        es: ['spanish', 'es'],
        fr: ['french', 'fr'],
        de: ['german', 'de'],
        ja: ['japanese', 'ja'],
        ko: ['korean', 'ko'],
        pt: ['portuguese', 'pt'],
        ru: ['russian', 'ru'],
        zh: ['chinese', 'zh'],
        tr: ['turkish', 'tr']
    };
    return namesByCode[languageCode] || [languageCode];
}

function getTypographyModeLanguages(modeName) {
    const aliases = {
        ar: ['arabic', 'ara', 'ar', 'عربي', 'عربى', 'عربية', 'العربي', 'العربى', 'العربية'],
        en: ['english', 'eng', 'en', 'انجليزي', 'انجليزية', 'الانجليزي', 'الانجليزية', 'انكليزي', 'انكليزية', 'الانكليزية'],
        es: ['spanish', 'espanol', 'castellano', 'spa', 'es', 'اسباني', 'الاسبانية'],
        fr: ['french', 'francais', 'francaise', 'fra', 'fre', 'fr', 'فرنسي', 'الفرنسية'],
        de: ['german', 'deutsch', 'deu', 'ger', 'de', 'الماني', 'الالمانية'],
        ja: ['japanese', 'jpn', 'ja', '日本語', 'ياباني', 'اليابانية'],
        ko: ['korean', 'kor', 'ko', '한국어', '조선말', 'كوري', 'الكورية'],
        pt: ['portuguese', 'portugues', 'por', 'pt', 'برتغالي', 'البرتغالية'],
        ru: ['russian', 'russkiy', 'rus', 'ru', 'русский', 'русскии', 'روسي', 'الروسية'],
        zh: ['chinese', 'mandarin', 'zho', 'chi', 'zh', '中文', '汉语', '漢語', '简体中文', '繁體中文', 'صيني', 'الصينية'],
        tr: ['turkish', 'turkce', 'tur', 'tr', 'تركي', 'التركية']
    };
    const normalize = value => String(value || '').normalize('NFKD')
        .replace(/\p{M}/gu, '').replace(/ـ/g, '').toLowerCase();
    // Split CamelCase before lowercasing; separate script and digit boundaries.
    let name = String(modeName || '').normalize('NFKC')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
        .replace(/([\p{L}])(\p{N})|(\p{N})([\p{L}])/gu, '$1$3 $2$4')
        .replace(/([A-Za-z])(\p{Script=Arabic})|(\p{Script=Arabic})([A-Za-z])/gu, '$1$3 $2$4');
    // Consume locale subtags as a unit: the AR region in en-AR is Argentina,
    // not another Arabic-language marker. Slash-separated languages stay distinct.
    name = name.replace(/(^|[^A-Za-z])(ar|en|es|fr|de|ja|ko|pt|ru|zh|tr)[-_](?:[A-Za-z]{4}[-_])?(?:[A-Za-z]{2}|\d{3})(?=$|[^A-Za-z])/gi, '$1$2');
    const words = new Set(normalize(name).split(/[^\p{L}\p{N}]+/u).filter(Boolean));
    return Object.keys(aliases).filter(code => aliases[code].some(alias => words.has(normalize(alias))));
}

async function getTextStyleName(node) {
    try {
        if (!node || node.textStyleId === figma.mixed || !node.textStyleId) return '';
        const style = await figma.getStyleByIdAsync(node.textStyleId);
        return style && style.name ? style.name : '';
    } catch (e) {
        return '';
    }
}

async function getLocaleFontVariables(languageCode) {
    if (!languageCode || languageCode === 'auto') return [];

    const targetModeNames = getLanguageModeNames(languageCode).map(normalizeName);
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const entries = [];

    for (const collection of collections) {
        const targetMode = collection.modes.find((mode) => targetModeNames.includes(normalizeName(mode.name)));
        if (!targetMode) continue;

        for (const variableId of collection.variableIds) {
            try {
                const variable = figma.variables.getVariableById(variableId);
                if (!variable || variable.resolvedType !== 'STRING') continue;

                const rawFontFamily = variable.valuesByMode[targetMode.modeId];
                if (typeof rawFontFamily !== 'string' || !rawFontFamily.trim()) continue;

                entries.push({
                    collectionName: collection.name,
                    variableName: variable.name,
                    fontFamily: rawFontFamily.trim()
                });
            } catch (e) {
                // Skip malformed or inaccessible variables and keep the translation flow running.
            }
        }
    }

    return entries;
}

function resolveAvailableFontFamily(fontFamily) {
    if (!availableFontsCache) return '';
    const normalized = normalizeName(fontFamily);
    const match = availableFontsCache.find((font) => normalizeName(font.fontName.family) === normalized);
    return match ? match.fontName.family : '';
}

function findFontStyleForFamily(fontFamily, preferredStyle) {
    const fontsInFamily = getFontsInFamily(fontFamily);
    if (!fontsInFamily.length) return null;

    const preferredStyles = [
        preferredStyle,
        'Regular',
        'Normal',
        'Book',
        'Medium',
        'SemiBold',
        'Semibold',
        'Bold'
    ].filter(Boolean);

    for (const style of preferredStyles) {
        const match = fontsInFamily.find((font) => normalizeName(font.fontName.style) === normalizeName(style));
        if (match) return match.fontName;
    }

    return fontsInFamily[0].fontName;
}

async function pickLocaleFontVariable(node, localeFontVariables, originalSegments) {
    if (!localeFontVariables.length) return null;

    const nodeHints = [
        node.name,
        await getTextStyleName(node)
    ].map(normalizeName).filter(Boolean);

    for (const hint of nodeHints) {
        const directMatch = localeFontVariables.find((entry) => {
            const variableName = normalizeName(entry.variableName);
            return hint === variableName || hint.includes(variableName) || variableName.includes(hint);
        });
        if (directMatch) return directMatch;
    }

    if (localeFontVariables.length === 1) return localeFontVariables[0];

    const sizes = originalSegments
        .map((segment) => typeof segment.fontSize === 'number' ? segment.fontSize : null)
        .filter((size) => size !== null);
    const largestSize = sizes.length ? Math.max(...sizes) : 0;
    const wantsHeading = largestSize >= 24 || nodeHints.some((hint) => /heading|title|headline|h[1-6]\b/.test(hint));
    const preferredNames = wantsHeading
        ? ['heading', 'title', 'headline', 'h1', 'h2']
        : ['paragraph', 'body', 'text', 'label'];

    for (const preferredName of preferredNames) {
        const match = localeFontVariables.find((entry) => normalizeName(entry.variableName).includes(preferredName));
        if (match) return match;
    }

    return localeFontVariables[0];
}

async function applyLocaleFontVariableToNode(node, localeFontVariables, originalSegments) {
    const localeFontVariable = await pickLocaleFontVariable(node, localeFontVariables, originalSegments);
    if (!localeFontVariable) return false;

    const resolvedFamily = resolveAvailableFontFamily(localeFontVariable.fontFamily);
    if (!resolvedFamily) return false;

    const currentFontName = originalSegments[0] && originalSegments[0].fontName && originalSegments[0].fontName !== figma.mixed
        ? originalSegments[0].fontName
        : { style: 'Regular' };
    const targetFontName = findFontStyleForFamily(resolvedFamily, currentFontName.style);
    if (!targetFontName) return false;

    const loaded = await ensureFontLoaded(targetFontName);
    if (!loaded) return false;

    node.fontName = targetFontName;
    node.setPluginData('rtl-master-locale-font-variable', `${localeFontVariable.collectionName}/${localeFontVariable.variableName}`);
    node.setPluginData('rtl-master-locale-font-family', targetFontName.family);
    return true;
}

// Set modes on the text node only. Never edit a shared style or its variables.
async function prepareTextStyleLanguageMode(node, languageCode) {
    const segments = node.characters.length
        ? node.getStyledTextSegments(['textStyleId', 'fontName', 'fontSize']) : [];
    const aliases = [];
    const addAliases = value => {
        for (const alias of (Array.isArray(value) ? value : [value])) {
            if (alias && alias.type === 'VARIABLE_ALIAS') aliases.push(alias);
        }
    };
    for (const field of ['fontFamily', 'fontStyle', 'fontWeight']) {
        addAliases(node.boundVariables && node.boundVariables[field]);
    }
    const styleIds = new Set(segments.map(segment => segment.textStyleId).filter(id => typeof id === 'string' && id));
    if (!segments.length && typeof node.textStyleId === 'string' && node.textStyleId) styleIds.add(node.textStyleId);
    for (const id of styleIds) {
        const style = await figma.getStyleByIdAsync(id);
        for (const field of ['fontFamily', 'fontStyle', 'fontWeight']) {
            addAliases(style && style.boundVariables && style.boundVariables[field]);
        }
    }
    if (!aliases.length) return { protected: false, changed: false };
    // Replacing characters cannot reliably map independent typography runs.
    // Leave such layers intact rather than flatten their style bindings.
    const typography = new Set(segments.map(segment => JSON.stringify([segment.textStyleId, segment.fontName, segment.fontSize])));
    if (typography.size > 1) throw new Error('Mixed typography with variable bindings requires manual translation to preserve its ranges.');
    const targets = new Map();
    const visited = new Set();
    const visiting = new Set();
    async function visit(alias) {
        const id = alias.id || alias.variableId;
        if (!id) throw new Error('Invalid typography variable alias.');
        if (visiting.has(id)) throw new Error('Circular typography variable alias.');
        if (visited.has(id)) return;
        visiting.add(id);
        const variable = await figma.variables.getVariableByIdAsync(id);
        if (!variable) throw new Error('A typography variable is unavailable.');
        const collection = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
        if (!collection) throw new Error('A typography variable collection is unavailable.');
        const matches = collection.modes.filter(mode => {
            const languages = getTypographyModeLanguages(mode.name);
            if (!languages.includes(languageCode)) return false;
            if (languages.length > 1) throw new Error(`Ambiguous languages in mode ${mode.name}.`);
            return true;
        });
        if (matches.length > 1) throw new Error(`Ambiguous language modes in ${collection.name}.`);
        const modeId = matches.length ? matches[0].modeId
            : (node.resolvedVariableModes || {})[collection.id] || collection.defaultModeId;
        if (matches.length) targets.set(collection.id, { collection, modeId });
        const value = variable.valuesByMode[modeId];
        if (value && value.type === 'VARIABLE_ALIAS') await visit(value);
        visiting.delete(id);
        visited.add(id);
    }
    for (const alias of aliases) await visit(alias);
    const previous = new Map();
    try {
        for (const [id, { collection, modeId }] of targets) {
            previous.set(id, (node.explicitVariableModes || {})[id]);
            node.setExplicitVariableModeForCollection(collection, modeId);
        }
        const fonts = node.characters.length ? node.getRangeAllFontNames(0, node.characters.length) : [node.fontName];
        for (const font of fonts) {
            if (!await ensureFontLoaded(font)) throw new Error(`Unavailable typography font: ${font.family} ${font.style}`);
        }
    } catch (error) {
        for (const [id, modeId] of previous) {
            const { collection } = targets.get(id);
            if (modeId) node.setExplicitVariableModeForCollection(collection, modeId);
            else node.clearExplicitVariableModeForCollection(collection);
        }
        throw error;
    }
    return { protected: true, changed: targets.size > 0 };
}

async function applyTranslationsToNodes(translations, onProgress, options = {}) {
    let successCount = 0;
    let failedCount = 0;
    let localeFontChanges = 0;
    const total = translations.length;
    const missingFonts = new Set();
    const fontReplacements = new Map();
    const typographyIssues = [];

    // Ensure the font cache is available for this operation.
    if (!availableFontsCache) {
        try {
            availableFontsCache = await figma.listAvailableFontsAsync();
        } catch (e) {
            console.error("Could not list available fonts:", e);
            availableFontsCache = [];
        }
    }

    let localeFontVariables = [];
    try {
        localeFontVariables = await getLocaleFontVariables(options.toLanguage);
    } catch (e) {
        console.warn('Could not read locale font variables:', e && e.message);
    }

    for (let i = 0; i < total; i++) {
        checkOperationCancelled();
        const item = translations[i];
        const node = await figma.getNodeByIdAsync(item.id);

        if (node && node.type === 'TEXT' && !node.removed) {
            try {
                const originalCharacters = node.characters;
                const modeResult = options.smartSwitchTextStyles === true
                    ? await prepareTextStyleLanguageMode(node, options.toLanguage) : { protected: false, changed: false };
                if (modeResult.changed) localeFontChanges++;
                if (modeResult.protected && !modeResult.changed) typographyIssues.push(`${node.name}: no matching typography language mode; binding preserved.`);
                const originalSegments = node.getStyledTextSegments(['fontName', 'fontSize', 'fills']);
                const nodeFontFallbacks = new Map(); // Map from missing FontName object to fallback FontName object

                // Pass 1: Identify all missing fonts in the node and find fallbacks.
                for (const segment of originalSegments) {
                    const { fontName } = segment;
                    const fontKey = getFontCacheKey(fontName);
                    if (fontKey && nodeFontFallbacks.has(fontKey)) continue; // Already processed this font style

                    const fontLoaded = await ensureFontLoaded(fontName);
                    if (!fontLoaded) {
                        // Font is missing. Try to find a fallback.
                        // Strategy 1: Find another style in the same family.
                        let fallbackFont = await findBestFallbackFont(fontName);

                        // Strategy 2: If no same-family font, use a universal fallback (Poppins).
                        if (!fallbackFont) {
                            const universalFallbackFamily = 'Poppins';
                            // Prioritize original style, then common styles.
                            const stylesToTry = [fontName.style, 'Regular', 'Medium', 'SemiBold', 'Bold', 'Italic'];
                            const uniqueStylesToTry = [...new Set(stylesToTry)];
                            const universalFonts = getFontsInFamily(universalFallbackFamily);

                            for (const style of uniqueStylesToTry) {
                                // Check if this Poppins variant exists in our cached list of available fonts.
                                const found = universalFonts.find(f => f.fontName.style === style);
                                if (found) {
                                    fallbackFont = found.fontName;
                                    break; // Found a suitable Poppins style, stop searching.
                                }
                            }
                        }

                        if (fontKey) {
                            nodeFontFallbacks.set(fontKey, fallbackFont); // Can be null if no fallback is found at all.
                        }
                    }
                }

                // Pass 2: Apply the found fallbacks to the text ranges.
                for (const segment of originalSegments) {
                    const { fontName, start, end } = segment;
                    const fontKey = getFontCacheKey(fontName);
                    const fallbackFont = fontKey ? nodeFontFallbacks.get(fontKey) : undefined;

                    if (fallbackFont !== undefined) { // A fallback was sought for this font
                        if (fallbackFont) { // A fallback was successfully found
                            await ensureFontLoaded(fallbackFont);
                            node.setRangeFontName(start, end, fallbackFont);

                            const missingFontStr = `'${fontName.family} ${fontName.style}'`;
                            const fallbackFontStr = `'${fallbackFont.family} ${fallbackFont.style}'`;
                            if (!fontReplacements.has(missingFontStr)) {
                                fontReplacements.set(missingFontStr, fallbackFontStr);
                            }
                        } else { // No fallback was found
                            const missingFontStr = `'${fontName.family} ${fontName.style}'`;
                            missingFonts.add(missingFontStr);
                        }
                    }
                }

                const numericStyles = new Map();
                const dominantFill = originalSegments.length > 0 ? JSON.stringify(originalSegments[0].fills) : null;

                if (dominantFill) {
                    for (const segment of originalSegments) {
                        const segmentChars = segment.characters.trim();
                        if (/^\d+$/.test(segmentChars) && JSON.stringify(segment.fills) !== dominantFill) {
                            numericStyles.set(segmentChars, segment.fills);
                        }
                    }
                }

                const translatedTextSegments = node.getStyledTextSegments(['fontName', 'fontSize', 'fills']);
                node.characters = item.newCharacters;
                restoreTranslatedTextSegmentStyles(node, originalCharacters, item.newCharacters, translatedTextSegments, modeResult.protected);
                if (localeFontVariables.length > 0 && !modeResult.protected) {
                    const changedLocaleFont = await applyLocaleFontVariableToNode(node, localeFontVariables, originalSegments);
                    if (changedLocaleFont) localeFontChanges++;
                }

                if (numericStyles.size > 0) {
                    for (const [numberStr, fillStyle] of numericStyles.entries()) {
                        let startIndex = -1;
                        while ((startIndex = node.characters.indexOf(numberStr, startIndex + 1)) !== -1) {
                            const endIndex = startIndex + numberStr.length;
                            const isStandalone =
                                (startIndex === 0 || !/\w/.test(node.characters[startIndex - 1])) &&
                                (endIndex === node.characters.length || !/\w/.test(node.characters[endIndex]));

                            if (isStandalone) {
                                node.setRangeFills(startIndex, endIndex, fillStyle);
                            }
                        }
                    }
                }
                // Font-variable and numeric-style passes may touch the text
                // ranges. Reapply the complete original segment palette last
                // so mixed-color paragraphs cannot collapse to one fill.
                restoreTranslatedTextSegmentStyles(node, originalCharacters, item.newCharacters, translatedTextSegments, modeResult.protected);
                successCount++;
            } catch (e) {
                failedCount++;
                if (options.smartSwitchTextStyles === true) typographyIssues.push(`${node.name}: ${e.message}`);
                console.error(`Could not update text for node ${item.id}: ${e.message}`);
            }
        } else {
            failedCount++;
            console.error(`Could not find or update node ${item.id}`);
        }

        if (onProgress) {
            onProgress(i + 1, total);
        }
    }

    // Deliberately keep every font cache warm for the rest of the session.
    // Clearing them here meant each action re-ran listAvailableFontsAsync()
    // (thousands of entries) and re-loaded fonts it had already loaded — the
    // dictionary pass and the apply pass each paid for it.
    return { successCount, failedCount, missingFonts, fontReplacements, localeFontChanges, typographyIssues };
}


async function handleApplyTranslations(payload) {
    const onProgress = (processed, total) => {
        sendUIMessage({
            type: 'translation-progress',
            payload: { processed, total }
        });
    };
    const { successCount, failedCount, missingFonts, fontReplacements, localeFontChanges, typographyIssues } = await applyTranslationsToNodes(payload.translations, onProgress, { toLanguage: payload.toLanguage, smartSwitchTextStyles: payload.smartSwitchTextStyles });
    if (typographyIssues.length) figma.notify(typographyIssues.slice(0, 3).join('\n'), { timeout: 9000 });

    let notificationMessage = `Translated ${successCount} text layer(s).`;
    if (failedCount > 0) {
        notificationMessage += ` ${failedCount} layer(s) failed to update.`;
    }
    figma.notify(notificationMessage, { error: failedCount > 0 });

    if (fontReplacements.size > 0) {
        const replacementsList = Array.from(fontReplacements.entries()).map(([m, f]) => `${m} → ${f}`).join('; ');
        figma.notify(`Substituted missing fonts: ${replacementsList}`, { timeout: 8000 });
    }

    if (missingFonts.size > 0) {
        const fontList = Array.from(missingFonts).join(', ');
        const message = `Could not find fallback for: ${fontList}. Please install.`;
        figma.notify(message, { error: true, timeout: 8000 });
    }

    if (localeFontChanges > 0) {
        figma.notify(`Applied locale font variables to ${localeFontChanges} text layer(s).`, { timeout: 5000 });
    }

    if (!pendingVariantCreation) {
        sendUIMessage({ type: 'action-complete' });
    }
}

function findTextNodes(nodes, excludedNodeIds = null) {
    let textNodes = [];
    for (const node of nodes) {
        if (excludedNodeIds && excludedNodeIds.has(node.id)) continue;
        if (node.type === 'TEXT') {
            textNodes.push(node);
        } else if ('children' in node) {
            textNodes = textNodes.concat(findTextNodes(node.children, excludedNodeIds));
        }
    }
    return textNodes;
}

function isAtomicIllustration(node) {
    if (isSpatialComposition(node)) return true;
    if (!('children' in node) || node.children.length === 0) {
        return false;
    }

    const stack = Array.from(node.children);
    while (stack.length > 0) {
        const child = stack.pop();
        if (child.type === 'TEXT') {
            return false;
        }
        // A nested instance can contain an editable label or input even when its
        // text descendants are not exposed on this traversal.
        if (child.type === 'INSTANCE') {
            return false;
        }
        if ('children' in child) {
            stack.push.apply(stack, child.children);
        }
    }

    return true;
}

// Maps/diagrams are a shared coordinate system, even when markers are instances.
// A large graphic anchor distinguishes these from ordinary rows of UI controls.
function isSpatialComposition(node) {
    if (!node || !('children' in node) || !node.children.length) return false;
    if (node.layoutMode && node.layoutMode !== 'NONE') return false;
    if (!(node.width > 0 && node.height > 0)) return false;
    let hasAnchor = false;
    let hasInstance = false;
    const pending = [...node.children];
    while (pending.length) {
        const child = pending.pop();
        // Text-bearing layouts need the regular localization path.
        if (child.type === 'TEXT') return false;
        if (child.type === 'INSTANCE') {
            hasInstance = true;
            // An unavailable instance subtree cannot safely be classified as artwork.
            if (!('children' in child) || !child.children.length) return false;
        }
        const isGraphic = ['VECTOR', 'BOOLEAN_OPERATION', 'LINE'].includes(child.type) ||
            (Array.isArray(child.fills) && child.fills.some(fill => fill.type === 'IMAGE'));
        if (isGraphic && child.width >= node.width * 0.4 && child.height >= node.height * 0.4) {
            hasAnchor = true;
        }
        if ('children' in child) pending.push(...child.children);
    }
    return hasAnchor && hasInstance;
}

function captureChildGeometry(node) {
    return Array.from(node.children || []).map(child => ({ child, x: child.x,
        y: child.y, width: child.width, height: child.height,
        skipManualMirror: isLikelyBackground(child) || isFixedUIElement(child),
        transform: child.relativeTransform ? child.relativeTransform.map(row => [...row]) : null }));
}

function mirrorAutoLayoutAlignment(node) {
    const property = node.layoutMode === 'HORIZONTAL' ? 'primaryAxisAlignItems' :
        node.layoutMode === 'VERTICAL' ? 'counterAxisAlignItems' : null;
    if (!property) return;
    if (node[property] === 'MIN') node[property] = 'MAX';
    else if (node[property] === 'MAX') node[property] = 'MIN';
}

function mirrorGradientFills(node) {
    if (!node || !Array.isArray(node.fills) || node.fills === figma.mixed) return;
    const gradients = node.fills.filter(fill => fill && fill.visible !== false &&
        typeof fill.type === 'string' && fill.type.startsWith('GRADIENT') &&
        Array.isArray(fill.gradientTransform));
    if (gradients.length === 0) return;

    const mirroredFills = node.fills.map(fill => {
        if (!fill || fill.visible === false || typeof fill.type !== 'string' ||
            !fill.type.startsWith('GRADIENT') || !Array.isArray(fill.gradientTransform)) return fill;
        const [[a, c, tx], [b, d, ty]] = fill.gradientTransform;
        return {
            ...fill,
            gradientTransform: [
                [-a, c, a + tx],
                [-b, d, b + ty]
            ]
        };
    });
    node.fills = mirroredFills;
}

function setChildPosition(child, x, y, parentTransform = null) {
    // Groups recalculate their origin after each child moves. Rebase each
    // planned position against the CURRENT origin, using the original axes.
    const current = child.parent && child.parent.absoluteTransform;
    if (parentTransform && current && child.relativeTransform) {
        const worldX = parentTransform[0][0] * x + parentTransform[0][1] * y + parentTransform[0][2];
        const worldY = parentTransform[1][0] * x + parentTransform[1][1] * y + parentTransform[1][2];
        const [[a, c, tx], [b, d, ty]] = current;
        const determinant = a * d - b * c;
        if (Math.abs(determinant) > 1e-8) {
            const transform = child.relativeTransform.map(row => [...row]);
            transform[0][2] = (d * (worldX - tx) - c * (worldY - ty)) / determinant;
            transform[1][2] = (-b * (worldX - tx) + a * (worldY - ty)) / determinant;
            child.relativeTransform = transform;
            return;
        }
    }
    child.x = x;
    child.y = y;
}

function mirrorChildGeometry(node, geometry, parentWidth, parentTransform, absoluteOnly) {
    for (const item of geometry) {
        const child = item.child;
        if (absoluteOnly ? child.layoutPositioning !== 'ABSOLUTE' : item.skipManualMirror) continue;
        if (!Number.isFinite(item.x) || !Number.isFinite(item.width)) continue;
        // Constraint changes can themselves reposition a layer. Set them first.
        if ('constraints' in child) {
            const { horizontal, vertical } = child.constraints;
            if (horizontal === 'LEFT' || horizontal === 'RIGHT') {
                child.constraints = { horizontal: horizontal === 'LEFT' ? 'RIGHT' : 'LEFT', vertical };
            }
        }
        setChildPosition(child, parentWidth - item.x - item.width, item.y, parentTransform);
    }
}

function getProgressFillGeometry(node, geometry) {
    const shapes = geometry.filter(item => ['RECTANGLE', 'FRAME', 'COMPONENT', 'INSTANCE'].includes(item.child.type) &&
        item.width > 0 && item.height > 0 && item.width >= item.height * 3 &&
        Math.abs(item.child.rotation || 0) < 0.01);
    const ownTrack = { child: node, x: 0, y: 0, width: node.width, height: node.height };
    const tracks = shapes.concat(
        node.type !== 'GROUP' && node.width >= node.height * 3 &&
        Array.isArray(node.fills) && node.fills.some(fill => fill.visible !== false && fill.type === 'SOLID')
            ? [ownTrack] : []);
    const pairs = [];
    for (const fill of shapes) {
        const candidates = tracks.filter(track => track.child !== fill.child && track.width > fill.width + 1 &&
            Math.abs(fill.height - track.height) <= Math.max(2, track.height * 0.25) &&
            Math.abs(fill.y + fill.height / 2 - track.y - track.height / 2) <= 2 &&
            fill.x >= track.x - 1 && fill.x + fill.width <= track.x + track.width + 1 &&
            Math.min(Math.abs(fill.x - track.x), Math.abs(track.x + track.width - fill.x - fill.width)) <= Math.max(4, track.height * 0.25));
        // An ambiguous overlap is not sufficient evidence of a progress bar.
        if (candidates.length === 1) pairs.push({ fill: fill.child, track: candidates[0].child,
            inset: fill.x - candidates[0].x, width: fill.width, yOffset: fill.y - candidates[0].y });
    }
    return pairs;
}

function restoreProgressFillGeometry(node, pairs) {
    for (const pair of pairs) {
        if ((node.layoutMode === 'HORIZONTAL' || node.layoutMode === 'VERTICAL') &&
            pair.fill.layoutPositioning !== 'ABSOLUTE') continue;
        const trackX = pair.track === node ? 0 : pair.track.x;
        const trackY = pair.track === node ? 0 : pair.track.y;
        const x = trackX + pair.track.width - pair.inset - pair.width;
        setChildPosition(pair.fill, x, trackY + pair.yOffset);
    }
}

function isLikelyBackground(node) {
    const parent = node.parent;
    if (!parent || !('children' in parent) || !('width' in parent) || !('width' in node)) {
        return false;
    }
    const isBottomLayer = parent.children[0].id === node.id;
    if (!isBottomLayer) {
        return false;
    }
    const isWideEnough = node.width >= parent.width * 0.95;
    const nodeNameLower = node.name.toLowerCase();
    if (nodeNameLower.includes('background') || nodeNameLower.includes('bg')) {
        return true;
    }
    return isWideEnough;
}

function isFixedUIElement(node) {
    if (!node || !('constraints' in node)) {
        return false;
    }
    const nodeNameLower = node.name.toLowerCase();
    const keywords = ['navbar', 'tabbar', 'header', 'footer', 'appbar', 'bottom navigation', 'top bar'];
    if (keywords.some(keyword => nodeNameLower.includes(keyword))) {
        return true;
    }

    const { horizontal, vertical } = node.constraints;
    const isPinnedVertically = vertical === 'TOP' || vertical === 'BOTTOM';
    const isStretchedHorizontally = horizontal === 'SCALE' || horizontal === 'LEFT_RIGHT';

    if (isPinnedVertically && isStretchedHorizontally) {
        return true;
    }

    const parent = node.parent;
    if (isPinnedVertically && parent && 'width' in parent && 'width' in node) {
        if (node.width >= parent.width * 0.8) {
            return true;
        }
    }

    return false;
}

function captureInstanceSizing(node) {
    if (!node || node.type !== 'INSTANCE') return null;
    const sizing = {};
    for (const key of ['layoutSizingHorizontal', 'layoutSizingVertical', 'layoutAlign', 'layoutGrow', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight']) {
        if (key in node) sizing[key] = node[key];
    }
    sizing.parentLayoutMode = node.parent && 'layoutMode' in node.parent ? node.parent.layoutMode : 'NONE';
    sizing.width = node.width;
    sizing.height = node.height;
    return sizing;
}

function restoreInstanceSizing(node, sizing) {
    if (!node || !sizing) return;
    try {
        for (const key of ['layoutAlign', 'layoutGrow', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight']) {
            if (key in sizing && key in node && sizing[key] !== undefined) node[key] = sizing[key];
        }
        // HUG can override an explicit resize, so restore the old geometry
        // before restoring the sizing modes. FILL is restored last because it
        // is controlled by the parent auto-layout frame.
        const parentUsesAutoLayout = sizing.parentLayoutMode === 'HORIZONTAL' || sizing.parentLayoutMode === 'VERTICAL';
        if (!parentUsesAutoLayout && typeof node.resizeWithoutConstraints === 'function') {
            // Outside Auto Layout there is no Fill/Hug sizing mode to restore;
            // preserve the actual instance geometry and leave Figma's state alone.
            node.resizeWithoutConstraints(sizing.width, sizing.height);
            return;
        }
        if (sizing.layoutSizingHorizontal === 'FILL' && 'layoutSizingHorizontal' in node) {
            node.layoutSizingHorizontal = 'FILL';
        } else if ('layoutSizingHorizontal' in node) {
            // A swapped HUG component recalculates its width from the new
            // language. Use FIXED temporarily so the old instance width wins.
            node.layoutSizingHorizontal = 'FIXED';
            if (typeof node.resizeWithoutConstraints === 'function') node.resizeWithoutConstraints(sizing.width, sizing.height);
        } else if (typeof node.resizeWithoutConstraints === 'function') {
            node.resizeWithoutConstraints(sizing.width, sizing.height);
        }
        if (sizing.layoutSizingVertical && sizing.layoutSizingVertical !== 'FILL' && 'layoutSizingVertical' in node) {
            node.layoutSizingVertical = sizing.layoutSizingVertical;
        }
    } catch (error) {
        console.warn(`Could not restore instance sizing for "${node.name}": ${error.message}`);
    }
}

async function mirrorNode(node, isInsideInstance = false, mirrorContext = createMirrorContext(), mirrorInstances = false, isInsideFlippedContainer = false) {
    checkOperationCancelled();
    if (isSpatialComposition(node)) return;
    if (await skipInvalidComponent(node, mirrorContext)) return;
    try {
        await mirrorNodeUnchecked(node, isInsideInstance, mirrorContext, mirrorInstances, isInsideFlippedContainer);
    } catch (error) {
        if (!isInvalidVariantError(error)) throw error;
        markInvalidComponentSkipped(node, mirrorContext, error);
    }
}

async function mirrorNodeUnchecked(node, isInsideInstance, mirrorContext, mirrorInstances, isInsideFlippedContainer) {
    if (node.type === 'INSTANCE' && !isIconInstance(node) && !isInsideInstance &&
        mirrorContext.options.forceMirror === true && !isInsideForceDetachedSubtree(node, mirrorContext)) {
        node = detachInstanceForForceMirror(node, mirrorContext);
        isInsideInstance = false;
    }
    if (mirrorContext.options.forceMirror !== true && await trySwitchToExistingLocaleVariant(node, mirrorContext)) return;

    const geometry = captureChildGeometry(node);
    const progressFills = getProgressFillGeometry(node, geometry);
    const isIllustration = progressFills.length === 0 && isAtomicIllustration(node);
    const originalWidth = node.width;
    const originalTransform = node.absoluteTransform ? node.absoluteTransform.map(row => [...row]) : null;
    const nodeNameLower = node.name.toLowerCase();

    if (node.type === 'INSTANCE' && mirrorInstances) {
        try {
            const originalSizing = captureInstanceSizing(node);
            const mainComponent = await node.getMainComponentAsync();
            if (mainComponent && !mainComponent.remote) {
                const targetVariant = await ensureTargetVariant(mainComponent, mirrorContext);
                if (targetVariant && targetVariant.id !== mainComponent.id) {
                    node.swapComponent(targetVariant);
                    restoreInstanceSizing(node, originalSizing);
                }

                // The target component owns the mirrored layout. Continuing through this
                // instance would apply a second mirror as overrides.
                return;
            }
        } catch (error) {
            console.warn(`Could not create or swap the target variant for instance "${node.name}": ${error.message}`);
            // Broken library icons must not abort the containing frame's conversion.
            // Leave this instance intact; the parent's traversal continues with siblings.
            if (isInvalidVariantError(error)) {
                markInvalidComponentSkipped(node, mirrorContext, error);
                return;
            }
            throw error;
        }
    }

    if (node.readOnly) {
        if ('children' in node && !isIllustration) {
            const currentlyInInstance = isInsideInstance || node.type === 'INSTANCE' || node.remote;
            for (const child of node.children) {
                await mirrorNode(child, currentlyInInstance, mirrorContext, mirrorInstances, isInsideFlippedContainer);
            }
        }
        return;
    }

    const flipKeywords = ['arrow', 'chevron', 'back', 'forward', 'next', 'previous', 'caret', 'angle'];
    const shouldFlip = flipKeywords.some(keyword => nodeNameLower.includes(keyword));
    let isFlippedNow = false;

    if (shouldFlip && !isInsideFlippedContainer && 'relativeTransform' in node && 'width' in node && node.width > 0) {
        try {
            const [
                [a, c, tx],
                [b, d, ty]
            ] = node.relativeTransform;
            const newTransform = [
                [-a, c, a * node.width + tx],
                [-b, d, b * node.width + ty]
            ];
            node.relativeTransform = newTransform;
            isFlippedNow = true;
        } catch (e) {
            console.warn(`Could not flip icon node "${node.name}" (${node.id}): ${e.message}`);
        }
    }

    if (node.type === 'TEXT') {
        try {
            const fonts = node.getRangeAllFontNames(0, node.characters.length);
            for (const font of fonts) {
                const fontLoaded = await ensureFontLoaded(font);
                if (!fontLoaded) {
                    console.warn(`Could not load font: ${font.family} ${font.style} for node "${node.name}". Figma will use a fallback font.`);
                }
            }
        } catch (e) {
            console.warn(`Could not get font names for node ${node.id}: ${e.message}`);
        }
    }

    try {
        if (node.type === 'TEXT' && 'textAlignHorizontal' in node) {
            if (node.textAlignHorizontal === 'LEFT') {
                node.textAlignHorizontal = 'RIGHT';
            } else if (node.textAlignHorizontal === 'RIGHT') {
                node.textAlignHorizontal = 'LEFT';
            }
        }

        if ('topLeftRadius' in node) {
            const { topLeftRadius, topRightRadius, bottomLeftRadius, bottomRightRadius } = node;
            node.topLeftRadius = topRightRadius;
            node.topRightRadius = topLeftRadius;
            node.bottomLeftRadius = bottomRightRadius;
            node.bottomRightRadius = bottomLeftRadius;
        }

        if ('paddingLeft' in node) {
            const { paddingLeft, paddingRight } = node;
            node.paddingLeft = paddingRight;
            node.paddingRight = paddingLeft;
        }

        if ('strokePerSide' in node && node.strokePerSide) {
            const { strokeLeftWeight, strokeRightWeight } = node;
            node.strokeLeftWeight = strokeRightWeight;
            node.strokeRightWeight = strokeLeftWeight;
        }

        // Mirror gradient direction together with the horizontal layout so the
        // visual flow does not remain anchored to the pre-mirror orientation.
        mirrorGradientFills(node);
    } catch (e) {
        console.warn(`Skipping property modification for node "${node.name}" (${node.id}) due to a read-only error: ${e.message}`);
    }

    // A graphical frame still owns layout alignment. Keep its artwork intact,
    // but mirror its horizontal Auto Layout alignment even with just one child.
    if ('children' in node && !isFlippedNow && !isInsideFlippedContainer) {
        try {
            mirrorAutoLayoutAlignment(node);
            if (isIllustration) {
                // Nested wrappers can be Fill width / Hug height while containing
                // only graphics. They need alignment too, without moving artwork.
                const pending = [...node.children];
                while (pending.length) {
                    const child = pending.pop();
                    try { mirrorAutoLayoutAlignment(child); }
                    catch (error) { console.warn(`Could not mirror nested alignment: ${error.message}`); }
                    if ('children' in child) pending.push(...child.children);
                }
            }
        } catch (error) {
            console.warn(`Could not mirror Auto Layout alignment for "${node.name}": ${error.message}`);
        }
    }

    if ('children' in node && !isIllustration) {
        if (!isFlippedNow && !isInsideFlippedContainer) {
            try {
                // These operations modify the children themselves (reordering/repositioning).
                // They are NOT safe inside an instance, so we only run them on regular frames/groups.
                if (!isInsideInstance && node.type !== 'INSTANCE') {
                    if (node.layoutMode === 'HORIZONTAL') {
                        const reversedChildren = node.children.slice().reverse();
                        reversedChildren.forEach((child, index) => {
                            node.insertChild(index, child);
                        });

                        mirrorChildGeometry(node, geometry, originalWidth, originalTransform, true);
                    } else if (node.layoutMode === 'VERTICAL') {
                        mirrorChildGeometry(node, geometry, originalWidth, originalTransform, true);
                    } else if (node.layoutMode === 'NONE' || typeof node.layoutMode === 'undefined') {
                        mirrorChildGeometry(node, geometry, originalWidth, originalTransform, false);
                    }
                }
            } catch (e) {
                console.warn(`Skipping layout modification for node "${node.name}" (${node.id}) due to an error: ${e.message}`);
            }
        }

        const currentlyInInstance = isInsideInstance || node.type === 'INSTANCE';
        for (const child of node.children) {
            await mirrorNode(child, currentlyInInstance, mirrorContext, mirrorInstances, isInsideFlippedContainer || isFlippedNow);
        }
        if (!isFlippedNow && !isInsideFlippedContainer && !node.readOnly && !isInsideInstance && node.type !== 'INSTANCE') {
            restoreProgressFillGeometry(node, progressFills);
        }
    }
}

// --- Font Changer Helper Functions ---

async function getAvailableFonts() {
    try {
        const fonts = await figma.listAvailableFontsAsync();
        const fontFamilies = new Set(fonts.map(font => font.fontName.family));
        return Array.from(fontFamilies).sort();
    } catch (error) {
        console.error('Error fetching fonts:', error);
        return [];
    }
}

async function getFontStyles(fontFamily) {
    try {
        if (fontStylesCache.has(fontFamily)) {
            return fontStylesCache.get(fontFamily);
        }
        if (!availableFontsCache) {
            availableFontsCache = await figma.listAvailableFontsAsync();
        }
        const fonts = availableFontsCache;
        const styles = fonts
            .filter(font => font.fontName.family === fontFamily)
            .map(font => font.fontName.style);
        const uniqueStyles = [...new Set(styles)].sort();
        fontStylesCache.set(fontFamily, uniqueStyles);
        return uniqueStyles;
    } catch (error) {
        console.error('Error fetching font styles:', error);
        return [];
    }
}

async function countTextLayersInSelection() {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) return 0;

    let count = 0;
    const countNodes = (nodes) => {
        for (const node of nodes) {
            if (node.type === 'TEXT') {
                count++;
            } else if ('children' in node) {
                countNodes(node.children);
            }
        }
    };

    countNodes(selection);
    return count;
}

async function handleChangeFont(payload) {
    const { fontFamily, fontStyle, autoFit } = payload;
    const selection = figma.currentPage.selection;

    if (selection.length === 0) {
        const message = 'Please select at least one item.';
        sendUIMessage({ type: 'font-change-error', payload: { message } });
        return { success: false, errorCode: 'no_selection', message };
    }

    try {
        const textNodes = [];
        const collectTextNodes = (nodes) => {
            for (const node of nodes) {
                if (node.type === 'TEXT') {
                    textNodes.push(node);
                } else if ('children' in node) {
                    collectTextNodes(node.children);
                }
            }
        };
        collectTextNodes(selection);

        if (textNodes.length === 0) {
            const message = 'No text layers found in selection.';
            sendUIMessage({ type: 'font-change-error', payload: { message } });
            return { success: false, errorCode: 'no_text_layers', message };
        }

        // Get all available styles for the target font
        const availableFonts = await figma.listAvailableFontsAsync();
        const targetFontStyles = availableFonts.filter(font => normalizeName(font && font.fontName && font.fontName.family) === normalizeName(fontFamily));

        if (targetFontStyles.length === 0) {
            const message = `Font family "${fontFamily}" not found.`;
            sendUIMessage({ type: 'font-change-error', payload: { message } });
            return { success: false, errorCode: 'font_not_found', message };
        }

        const total = textNodes.length;
        let changedCount = 0;
        let processed = 0;

        for (const node of textNodes) {
            processed++;
            // Send progress every 5 nodes or so to avoid flooding, but enough to feel smooth
            if (processed % 5 === 0 || processed === total) {
                sendUIMessage({
                    type: 'font-change-progress',
                    payload: { processed, total }
                });
            }

            // Handle mixed fonts or single font
            if (node.hasMissingFont) continue;

            let currentStyle = 'Regular';
            let targetStyle = fontStyle;

            // Simplified handling: use the font of the first character or the node itself
            // Handling mixed styles is complex, so we grab the style of the first character if mixed
            if (node.fontName === figma.mixed) {
                const rangeFont = node.characters.length > 0 ? node.getRangeFontName(0, 1) : null;
                currentStyle = rangeFont && rangeFont !== figma.mixed && rangeFont.style ? rangeFont.style : 'Regular';
            } else {
                currentStyle = node.fontName && node.fontName.style ? node.fontName.style : 'Regular';
            }

            // If no specific style requested, use smart matching
            if (!targetStyle || targetStyle === 'Auto Match') {
                targetStyle = findBestWeightMatch(currentStyle, targetFontStyles);
            }

            // Verify the target style exists
            if (!targetFontStyles.some(f => f && f.fontName && f.fontName.style === targetStyle)) {
                // Fallback if specific requested style not found (shouldn't happen if UI is correct, but safety first)
                targetStyle = findBestWeightMatch(currentStyle, targetFontStyles);
            }

            if (!targetStyle) targetStyle = 'Regular';
            const resolvedFontFamily = targetFontStyles[0] && targetFontStyles[0].fontName ? targetFontStyles[0].fontName.family : fontFamily;
            const targetFontName = { family: resolvedFontFamily, style: targetStyle };

            try {
                await figma.loadFontAsync(targetFontName);
                if (node.characters.length > 0 && node.fontName === figma.mixed) {
                    const segments = node.getStyledTextSegments(['fontName']);
                    for (const segment of segments) {
                        node.setRangeFontName(segment.start, segment.end, targetFontName);
                    }
                } else {
                    node.fontName = targetFontName;
                }

                // [NEW] Auto-Fit Text
                if (autoFit) {
                    // Using 'HEIGHT' ensures width is preserved but height adapts, preventing cut-off.
                    // For single line text that might need width expansion, this might not be enough, 
                    // but usually 'HEIGHT' is safer for UI layouts than 'WIDTH_AND_HEIGHT'.
                    // However, user asked for "fit size to new font", so let's try to be smart.
                    // If it was Fixed (NONE), make it HEIGHT.
                    if (node.textAutoResize === 'NONE') {
                        node.textAutoResize = 'HEIGHT';
                    }
                    // Also reset line height to AUTO as requested
                    node.lineHeight = { unit: 'AUTO' };
                }

                changedCount++;
            } catch (e) {
                console.error(`Failed to load or apply font ${fontFamily} ${targetStyle}`, e);
            }

            // Small delay for UI thread if batch is very large
            if (processed % 10 === 0) {
                await new Promise(r => setTimeout(r, 10));
            }
        }

        sendUIMessage({
            type: 'font-change-complete',
            payload: { message: `Successfully changed font for ${changedCount} text layer(s).` }
        });
        return {
            success: true,
            message: `Changed ${changedCount} of ${total} text layer(s).`
        };

    } catch (error) {
        console.error('Error changing font:', error);
        const message = `Error: ${error.message}`;
        sendUIMessage({ type: 'font-change-error', payload: { message } });
        return { success: false, errorCode: 'font_change_exception', message };
    }
}

function findBestWeightMatch(currentStyle, availableFontStyles) {
    const styleMap = (availableFontStyles || [])
        .map(f => f && f.fontName && f.fontName.style)
        .filter(style => typeof style === 'string' && style.trim().length > 0);

    // 1. Exact match
    const normalizedCurrentStyle = typeof currentStyle === 'string' && currentStyle.trim() ? currentStyle : 'Regular';
    if (styleMap.includes(normalizedCurrentStyle)) return normalizedCurrentStyle;

    // 2. Weight-based matching
    const lowerStyle = normalizedCurrentStyle.toLowerCase();

    // Define priorities for common weights
    if (lowerStyle.includes('bold')) {
        if (styleMap.some(s => s.toLowerCase().includes('bold'))) return styleMap.find(s => s.toLowerCase().includes('bold'));
        if (styleMap.some(s => s.toLowerCase().includes('black'))) return styleMap.find(s => s.toLowerCase().includes('black'));
        if (styleMap.some(s => s.toLowerCase().includes('heavy'))) return styleMap.find(s => s.toLowerCase().includes('heavy'));
        if (styleMap.some(s => s.toLowerCase().includes('semibold'))) return styleMap.find(s => s.toLowerCase().includes('semibold'));
    }

    if (lowerStyle.includes('light')) {
        if (styleMap.some(s => s.toLowerCase().includes('light'))) return styleMap.find(s => s.toLowerCase().includes('light'));
        if (styleMap.some(s => s.toLowerCase().includes('thin'))) return styleMap.find(s => s.toLowerCase().includes('thin'));
    }

    if (lowerStyle.includes('medium')) {
        if (styleMap.some(s => s.toLowerCase().includes('medium'))) return styleMap.find(s => s.toLowerCase().includes('medium'));
        if (styleMap.some(s => s.toLowerCase().includes('semibold'))) return styleMap.find(s => s.toLowerCase().includes('semibold'));
    }

    // 3. Fallback to Regular
    if (styleMap.includes('Regular')) return 'Regular';

    // 4. Fallback to first available
    return styleMap[0] || 'Regular';
}

/**
 * Finds a variant within a ComponentSetNode that matches a given set of properties.
 */
function findVariantByProps(componentSet, targetProps) {
    if (!componentSet || componentSet.type !== 'COMPONENT_SET') return null;

    return componentSet.children.find(variant => {
        const props = safeGetVariantProperties(variant);
        if (!props) return false;

        return Object.entries(targetProps).every(([key, value]) => {
            return props[key] === value;
        });
    }) || null;
}

function parseVariantNameToProps(name) {
    const props = {};
    if (!name || typeof name !== 'string') return props;

    name.split(',').forEach(part => {
        const [key, value] = part.split('=').map(s => s.trim());
        if (key && value) {
            props[key] = value;
        }
    });

    return props;
}

function safeGetVariantProperties(node) {
    if (!node || (node.type !== 'COMPONENT' && node.type !== 'INSTANCE')) return null;

    try {
        return node.variantProperties || parseVariantNameToProps(node.name);
    } catch (error) {
        const fallbackProps = parseVariantNameToProps(node.name);
        if (Object.keys(fallbackProps).length > 0) {
            console.warn(`Falling back to parsing variant name for "${node.name}" because Figma could not read variantProperties: ${error.message}`);
            return fallbackProps;
        }

        console.warn(`Skipping invalid variant node "${node.name}": ${error.message}`);
        return null;
    }
}

function getLanguageName(languageCode) {
    const languageNames = {
        auto: 'Auto Detect', en: 'English', ar: 'Arabic', es: 'Spanish', fr: 'French',
        de: 'German', ja: 'Japanese', ko: 'Korean', pt: 'Portuguese', ru: 'Russian',
        zh: 'Chinese', tr: 'Turkish'
    };
    return languageNames[languageCode] || languageCode;
}

function inferSourceIsRtl(component, fromLanguage) {
    if (fromLanguage && fromLanguage !== 'auto') return fromLanguage === 'ar';
    const text = findTextNodes([component]).map(node => node.characters).join(' ');
    return /[\u0600-\u06FF]/.test(text);
}

function variantPropsToName(props) {
    return Object.entries(props).map(([key, value]) => `${key}=${value}`).join(', ');
}

function getUniqueVariantLanguageValue(componentSet, targetProps, baseLanguage) {
    if (!componentSet || componentSet.type !== 'COMPONENT_SET') {
        return baseLanguage;
    }

    let candidateLanguage = baseLanguage;
    let suffix = 2;

    while (findVariantByProps(componentSet, Object.assign({}, targetProps, { Language: candidateLanguage }))) {
        candidateLanguage = `${baseLanguage} ${suffix}`;
        suffix++;
    }

    return candidateLanguage;
}

function inferVariantLanguageName(component, fallbackLanguageName = 'English') {
    return inferSourceIsRtl(component, 'auto') ? 'Arabic' : fallbackLanguageName;
}

function inferVariantRtlValue(component, languageName, fallbackIsRtl = false) {
    if (languageName === 'Arabic') return 'True';
    if (languageName && languageName !== 'Auto Detect') return 'False';
    return inferSourceIsRtl(component, 'auto') || fallbackIsRtl ? 'True' : 'False';
}

function getComponentPropertyKey(node, propertyName) {
    const properties = node && node.componentProperties ? node.componentProperties : null;
    if (!properties) return null;

    const targetName = normalizeName(propertyName);
    for (const key of Object.keys(properties)) {
        const baseName = key.split('#')[0];
        if (normalizeName(baseName) === targetName || normalizeName(key) === targetName) {
            return key;
        }
    }

    return null;
}

function componentPropertyValue(node, propertyKey, stringValue, booleanValue) {
    const definition = node && node.componentProperties ? node.componentProperties[propertyKey] : null;
    if (definition && definition.type === 'BOOLEAN') return booleanValue;
    return stringValue;
}

async function applyLocalePropertiesToNode(node, toLanguage) {
    if (!node || typeof node.setProperties !== 'function') return false;

    try {
        const languageName = getLanguageName(toLanguage);
        const props = {};
        const languageKey = getComponentPropertyKey(node, 'Language');
        const rtlKey = getComponentPropertyKey(node, 'RTL');

        if (languageKey) props[languageKey] = languageName;
        if (rtlKey) props[rtlKey] = componentPropertyValue(node, rtlKey, toLanguage === 'ar' ? 'True' : 'False', toLanguage === 'ar');

        if (Object.keys(props).length === 0) return false;

        node.setProperties(props);
        return true;
    } catch (error) {
        console.warn(`Could not update component locale properties for "${node.name}": ${error.message}`);
        return false;
    }
}

async function applyLocalePropertiesToNodes(nodes, toLanguage, mirrorContext = null, allowSmartSwitch = true) {
    mirrorContext = mirrorContext || createMirrorContext();
    const stack = Array.from(nodes || []);
    if (allowSmartSwitch && mirrorContext.options.smartSwitchComponents === true &&
        mirrorContext.options.forceMirror !== true) {
        // Match before locale updates can change the source variant. Inspect outer
        // instances first, but retain the original locale traversal for fallbacks.
        const selectedIds = new Set(stack.map(node => node.id));
        const pending = stack.filter(node => {
            for (let parent = node.parent; parent; parent = parent.parent) {
                if (selectedIds.has(parent.id)) return false;
            }
            return true;
        });
        while (pending.length > 0) {
            const node = pending.pop();
            if (isSpatialComposition(node)) continue;
            if (await skipInvalidComponent(node, mirrorContext)) continue;
            if (await trySwitchToExistingLocaleVariant(node, mirrorContext)) continue;
            if ('children' in node) pending.push(...node.children);
        }
    }
    const seen = new Set();

    while (stack.length > 0) {
        const node = stack.pop();
        if (!node || seen.has(node.id)) continue;
        seen.add(node.id);

        if (isSpatialComposition(node)) continue;
        if (await skipInvalidComponent(node, mirrorContext)) continue;
        if (mirrorContext && mirrorContext.smartSwitchedNodeIds.has(node.id)) continue;
        await applyLocalePropertiesToNode(node, toLanguage);

        if ('children' in node) {
            for (const child of node.children) {
                stack.push(child);
            }
        }
    }
}

// Only reuse a variant explicitly matching the target locale. Unmatched instances continue through
// the existing locale/mirror flow, including its optional variant generation.
function hasTextCharacterOverride(textNode) {
    for (let parent = textNode?.parent; parent; parent = parent.parent) {
        if (parent.type !== 'INSTANCE') continue;
        const overrides = Array.isArray(parent.overrides) ? parent.overrides : [];
        const override = overrides.find(item => item && item.id === textNode.id);
        if (override && Array.isArray(override.overriddenFields)) {
            if (override.overriddenFields.some(field => field === 'characters')) {
                return true;
            }
        }
    }
    return false;
}

async function trySwitchToExistingLocaleVariant(node, mirrorContext) {
    if (mirrorContext.options.smartSwitchComponents !== true) return false;
    if (mirrorContext.smartSwitchedNodeIds.has(node.id)) return true;
    const { toLanguage } = mirrorContext.options;
    if (!toLanguage || toLanguage === 'auto' || node.type !== 'INSTANCE') return false;
    if (mirrorContext.smartSwitchAttempts.has(node.id)) return false;
    // A failed match must not be retried after locale updates change the source.
    mirrorContext.smartSwitchAttempts.add(node.id);

    try {
        const mainComponent = await node.getMainComponentAsync();
        if (!mainComponent) return false;
        const componentSet = await getComponentParentAsync(mainComponent);
        if (!componentSet || componentSet.type !== 'COMPONENT_SET') return false;

        // Do not infer missing dimensions from names or other variants.
        const sourceProps = mainComponent.variantProperties;
        if (!sourceProps) return false;
        const keys = Object.keys(sourceProps);
        const languageKey = keys.find(key => normalizeName(key) === 'language');
        if (!languageKey) return false;
        const targetLanguageNames = getLanguageModeNames(toLanguage).map(normalizeName);
        // Use the same direction convention as the existing conversion flow.
        const targetIsRtl = toLanguage === 'ar';
        const matches = componentSet.children.filter(variant => {
            if (variant.type !== 'COMPONENT') return false;
            const props = variant.variantProperties;
            if (!props || Object.keys(props).length !== keys.length) return false;
            return keys.every(key => {
                if (!Object.prototype.hasOwnProperty.call(props, key)) return false;
                if (key === languageKey) return targetLanguageNames.includes(normalizeName(props[key]));
                if (normalizeName(key) === 'rtl') return normalizeName(props[key]) === (targetIsRtl ? 'true' : 'false');
                if (normalizeName(key) === 'direction') return normalizeName(props[key]) === (targetIsRtl ? 'rtl' : 'ltr');
                return props[key] === sourceProps[key];
            });
        });
        if (matches.length !== 1) return false;

        const sourceTextNodes = findTextNodes([node]);
        const sourceText = sourceTextNodes.map(textNode => ({
            characters: textNode.characters,
            hasOverride: hasTextCharacterOverride(textNode)
        }));
        const subtreeIds = [];
        const collectIds = root => {
            subtreeIds.push(root.id);
            if ('children' in root) root.children.forEach(collectIds);
        };
        collectIds(node);
        if (matches[0].id !== mainComponent.id) {
            // Native swapping preserves compatible overrides without copying source
            // defaults or restoring the old Language/RTL component properties.
            node.swapComponent(matches[0]);
        }
        const targetTextNodes = findTextNodes([node]);
        targetTextNodes.forEach((textNode, index) => {
            // Existing locale variants may already contain translated copy.
            // Requeue only cloned/source-equivalent text; this avoids sending
            // finished target-language content through translation again.
            const source = sourceText[index];
            if (source && !sourceTextNodes[index]?.userOverride && (source.hasOverride || textNode.characters === source.characters)) {
                mirrorContext.smartSwitchTranslationNodes.push(textNode);
            }
        });
        collectIds(node);
        // Include old descendant IDs: a swap can replace selected nested nodes.
        subtreeIds.forEach(id => mirrorContext.smartSwitchedNodeIds.add(id));
        return true;
    } catch (error) {
        console.warn(`Could not switch instance "${node.name}" to an existing ${getLanguageName(toLanguage)} variant: ${error.message}`);
        return false;
    }
}

function normalizeVariantNodeName(variant, fallbackLanguageName = 'English', fallbackIsRtl = false) {
    if (!variant || variant.type !== 'COMPONENT') return false;

    const propsMap = new Map(Object.entries(parseVariantNameToProps(variant.name)));
    const languageName = propsMap.get('Language') || inferVariantLanguageName(variant, fallbackLanguageName);
    const rtlValue = propsMap.get('RTL') || inferVariantRtlValue(variant, languageName, fallbackIsRtl);
    let changed = false;

    if (!propsMap.get('Language')) {
        propsMap.set('Language', languageName);
        changed = true;
    }

    if (!propsMap.get('RTL')) {
        propsMap.set('RTL', rtlValue);
        changed = true;
    }

    if (changed) {
        variant.name = variantPropsToName(Object.fromEntries(propsMap));
    }

    return changed;
}

function normalizeComponentSetVariantProps(componentSet, fallbackLanguageName = 'English', fallbackIsRtl = false) {
    if (!componentSet || componentSet.type !== 'COMPONENT_SET') return;

    for (const variant of componentSet.children) {
        normalizeVariantNodeName(variant, fallbackLanguageName, fallbackIsRtl);
    }
}

function completeVariantProps(componentSet, sourceProps) {
    const completeProps = Object.assign({}, sourceProps);

    for (const variant of componentSet.children) {
        const variantProps = safeGetVariantProperties(variant);
        if (!variantProps) continue;
        for (const [key, value] of Object.entries(variantProps)) {
            if (completeProps[key] === undefined) completeProps[key] = value;
        }
    }

    try {
        for (const [key, definition] of Object.entries(componentSet.componentPropertyDefinitions || {})) {
            if (definition.type === 'VARIANT' && completeProps[key] === undefined && definition.variantOptions?.length) {
                completeProps[key] = definition.variantOptions[0];
            }
        }
    } catch (error) {
        console.warn(`Could not read all variant properties for "${componentSet.name}": ${error.message}`);
    }

    return completeProps;
}

async function ensureTargetVariantIsMirrored(variant, mirrorContext, sourceComponentId = '') {
    const isMarkedMirrored = variant.getPluginData('rtl-master-mirrored') === 'true';
    const mirroredFromSourceId = variant.getPluginData('rtl-mirrored-source-id');

    if (isMarkedMirrored) {
        if (!sourceComponentId || mirroredFromSourceId === sourceComponentId) {
            return;
        }

        resetMirrorMarker(variant);
    }

    await mirrorNode(variant, false, mirrorContext, true, false);
    variant.setPluginData('rtl-master-mirrored', 'true');
    variant.setPluginData('rtl-mirrored-source-id', sourceComponentId || '');
}

function resetMirrorMarker(node) {
    if (!node || typeof node.setPluginData !== 'function') return;
    node.setPluginData('rtl-master-mirrored', '');
}

// Figma's combineAsVariants requires every grouped node to live on the same
// page as the destination parent. clone() can leave the new node on the
// page root (or another page), so move it next to the source node first.
function placeCloneForVariantCombine(sourceNode, cloneNode, parentNode) {
    if (!sourceNode || !cloneNode || !parentNode) return parentNode;
    const sourcePage = sourceNode.type === 'PAGE' ? sourceNode : getNodePage(sourceNode);
    const parentPage = parentNode.type === 'PAGE' ? parentNode : getNodePage(parentNode);
    const targetParent = (sourcePage && parentPage && sourcePage.id === parentPage.id)
        ? parentNode
        : (sourceNode.parent || parentNode);
    if (targetParent && cloneNode.parent !== targetParent && typeof targetParent.appendChild === 'function') {
        targetParent.appendChild(cloneNode);
    }
    return targetParent;
}

function getNodePage(node) {
    let current = node;
    while (current && current.type !== 'PAGE') {
        current = current.parent;
    }
    return current || null;
}

function fitComponentSetToChildren(componentSet, padding = 24) {
    if (!componentSet || componentSet.type !== 'COMPONENT_SET' || componentSet.children.length === 0) return;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const child of componentSet.children) {
        minX = Math.min(minX, child.x);
        minY = Math.min(minY, child.y);
        maxX = Math.max(maxX, child.x + child.width);
        maxY = Math.max(maxY, child.y + child.height);
    }

    componentSet.resize(
        Math.max(1, (maxX - minX) + (padding * 2)),
        Math.max(1, (maxY - minY) + (padding * 2))
    );

    for (const child of componentSet.children) {
        child.x = (child.x - minX) + padding;
        child.y = (child.y - minY) + padding;
    }
}

async function getComponentParentAsync(component) {
    if (component.parent) return component.parent;

    const refreshedNode = await figma.getNodeByIdAsync(component.id);
    if (refreshedNode && refreshedNode.type === 'COMPONENT') {
        return refreshedNode.parent;
    }

    return null;
}

/**
 * Gets or creates the target variant for a local nested instance. The source
 * properties are captured before cloning because a duplicate clone temporarily
 * puts a Figma component set into an invalid state.
 */
async function ensureTargetVariant(mainComponent, mirrorContext, mirrorLayout = true) {
    if (!mainComponent || mainComponent.type !== 'COMPONENT' || mainComponent.remote) {
        return null;
    }

    if (mirrorContext.targetVariants.has(mainComponent.id)) {
        return mirrorContext.targetVariants.get(mainComponent.id);
    }

    const { fromLanguage = 'auto', toLanguage = 'ar' } = mirrorContext.options || {};
    const componentParent = await getComponentParentAsync(mainComponent);
    const componentSet = componentParent && componentParent.type === 'COMPONENT_SET'
        ? componentParent
        : null;
    // Validate through Figma before renaming siblings or cloning into the set.
    // Name parsing can hide a broken set that Figma will reject on mutation.
    if (componentSet) void mainComponent.variantProperties;
    const rawSourceProps = safeGetVariantProperties(mainComponent) || parseVariantNameToProps(mainComponent.name);
    const sourceProps = componentSet
        ? completeVariantProps(componentSet, rawSourceProps)
        : rawSourceProps;

    if (componentSet && Object.keys(sourceProps).length === 0) {
        throw new Error(`Cannot create a target variant for "${mainComponent.name}" because its component set has invalid variant properties.`);
    }

    const sourceIsRtl = inferSourceIsRtl(mainComponent, fromLanguage);
    const sourceLanguage = fromLanguage === 'auto'
        ? (sourceIsRtl ? 'Arabic' : 'English')
        : getLanguageName(fromLanguage);

    if (componentSet) {
        normalizeComponentSetVariantProps(componentSet, sourceLanguage, sourceIsRtl);
    }

    const targetProps = Object.assign({}, sourceProps, {
        RTL: toLanguage === 'ar' ? 'True' : 'False',
        Language: getLanguageName(toLanguage)
    });

    if (componentSet) {
        const existingTarget = findVariantByProps(componentSet, targetProps);
        if (existingTarget) {
            mirrorContext.targetVariants.set(mainComponent.id, existingTarget);
            if (mirrorLayout) await ensureTargetVariantIsMirrored(existingTarget, mirrorContext, mainComponent.id);
            return existingTarget;
        }
    } else if (
        sourceProps.RTL === targetProps.RTL &&
        sourceProps.Language === targetProps.Language
    ) {
        mirrorContext.targetVariants.set(mainComponent.id, mainComponent);
        if (mirrorLayout) await ensureTargetVariantIsMirrored(mainComponent, mirrorContext, mainComponent.id);
        return mainComponent;
    }

    let newVariant;
    let targetComponentSet = componentSet;
    if (componentSet) {
        componentSet.layoutMode = 'NONE';
        const targetX = componentSet.children.reduce(
            (rightEdge, child) => Math.max(rightEdge, child.x + child.width),
            mainComponent.x + mainComponent.width
        ) + 100;
        const targetY = mainComponent.y;
        const targetName = variantPropsToName(targetProps);
        newVariant = mainComponent.clone();
        resetMirrorMarker(newVariant);
        try {
            // Do this immediately after clone; no variant getter is safe while names collide.
            newVariant.name = targetName;
            // clone() may place the component on the current page. Move it only after it has
            // unique variant properties so the source set never contains a duplicate pair.
            componentSet.appendChild(newVariant);
            // Reapply the name inside the set so Figma assigns every variant dimension.
            newVariant.name = targetName;
            newVariant.x = targetX;
            newVariant.y = targetY;
        } catch (error) {
            newVariant.remove();
            throw error;
        }
    } else {
        const originalName = mainComponent.name;
        const normalizedSourceProps = Object.assign({}, sourceProps);
        let sourceVariant = mainComponent;
        if (!normalizedSourceProps.RTL) normalizedSourceProps.RTL = sourceIsRtl ? 'True' : 'False';
        if (!normalizedSourceProps.Language) normalizedSourceProps.Language = sourceLanguage;

        if (componentParent) {
            mainComponent.name = variantPropsToName(normalizedSourceProps);
            newVariant = mainComponent.clone();
            resetMirrorMarker(newVariant);
            newVariant.name = variantPropsToName(targetProps);
            const parentAfterPlace = placeCloneForVariantCombine(mainComponent, newVariant, componentParent);
            targetComponentSet = figma.combineAsVariants([mainComponent, newVariant], parentAfterPlace);
        } else {
            // Figma can return a local main component with no exposed parent (for example,
            // a soft-deleted source). Keep that source untouched and create a usable pair
            // on the current page instead of passing null to combineAsVariants.
            const sourceCopy = mainComponent.clone();
            sourceCopy.name = variantPropsToName(normalizedSourceProps);
            sourceVariant = sourceCopy;
            newVariant = sourceCopy.clone();
            resetMirrorMarker(newVariant);
            newVariant.name = variantPropsToName(targetProps);
            targetComponentSet = figma.combineAsVariants([sourceCopy, newVariant], figma.currentPage);
        }

        targetComponentSet.name = originalName;
        targetComponentSet.layoutMode = 'NONE';

        sourceVariant.x = 24;
        sourceVariant.y = 24;
        newVariant.x = sourceVariant.x + sourceVariant.width + 100;
        newVariant.y = sourceVariant.y;
    }

    mirrorContext.targetVariants.set(mainComponent.id, newVariant);
    mirrorContext.createdVariants.set(newVariant.id, newVariant);

    if (mirrorLayout) await ensureTargetVariantIsMirrored(newVariant, mirrorContext, mainComponent.id);
    fitComponentSetToChildren(targetComponentSet);
    return newVariant;
}
