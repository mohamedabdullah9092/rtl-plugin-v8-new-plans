// A local dictionary for common UX terms to provide instant, high-quality translations for them.
// The structure supports multiple target languages, with English as the source of truth.
const uxDictionary = {
    "Arabic": {
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
            key.trim().replace(/\s+/g, ' ').toLowerCase(),
            value
        ])
    );

    // Target Language -> English (e.g., langToEnLookup['ar'] = { "الاعدادات": "Settings", ... })
    langToEnLookup[langCode] = Object.fromEntries(
        Object.entries(translations).map(([key, value]) => {
            let lookupKey = value.trim().replace(/\s+/g, ' ').toLowerCase();
            // Apply language-specific normalization for the lookup key
            if (langCode === 'ar') {
                lookupKey = normalizeArabic(lookupKey);
            }
            return [lookupKey, key];
        })
    );
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

        await postJson(endpoint, {
            eventType,
            figmaUserId: currentFigmaUser ? currentFigmaUser.id : null,
            figmaUserName: currentFigmaUser ? currentFigmaUser.name || '' : '',
            plan: isPro ? 'pro' : 'free',
            trialCount: typeof trialCount === 'number' ? trialCount : null,
            ...details
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
                figma.ui.postMessage({ type: 'user-status', payload: { isPro: true, trialCount } });
                return true;
            }
        }

        const gumroadData = await verifyLicenseWithGumroad(storedKey, false);
        if (isGumroadPurchaseActive(gumroadData)) {
            await figma.clientStorage.setAsync('isPro', true);
            await figma.clientStorage.setAsync('licenseKey', storedKey.trim());
            await figma.clientStorage.setAsync('activatedFigmaUserId', currentFigmaUser.id);
            figma.ui.postMessage({ type: 'user-status', payload: { isPro: true, trialCount } });
            return true;
        }
    } catch (error) {
        console.warn('Silent Pro restoration failed', error);
    }

    return false;
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

    return `Plugin Error: ${rawMessage}`;
}

figma.showUI(__html__, { width: 400, height: 650, title: "RTL Master" });

figma.ui.onmessage = async (msg) => {
    try {
        switch (msg.type) {
            case 'get-user-status':
                {
                    let isPro = await figma.clientStorage.getAsync('isPro');
                    let trialCount = await figma.clientStorage.getAsync('trialCount');
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
                    figma.ui.postMessage({ type: 'user-status', payload: { isPro: !!isPro, trialCount } });
                    if (!hasRecordedPluginOpen) {
                        hasRecordedPluginOpen = true;
                        void sendTelemetryEvent('plugin_opened');
                    }

                    // --- Background Re-verification (fire and forget) ---
                    // If a backend is configured, trust it as the source of truth across devices.
                    (async function backgroundVerify() {
                        try {
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
                                    figma.ui.postMessage({ type: 'user-status', payload: { isPro: true, trialCount } });
                                } else {
                                    const keyBelongsToCurrentUser = storedKey && (!activatedFigmaUserId || activatedFigmaUserId === currentFigmaUserId);
                                    const restored = keyBelongsToCurrentUser
                                        ? await restoreProAccessFromStoredLicense(storedKey, currentFigmaUser, trialCount)
                                        : false;

                                    if (!restored && serverCheckSucceeded) {
                                        await figma.clientStorage.setAsync('isPro', false);
                                        figma.ui.postMessage({ type: 'user-status', payload: { isPro: false, trialCount } });
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
                                    figma.ui.postMessage({ type: 'user-status', payload: { isPro: true, trialCount } });
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
            case 'get-onboarding-status':
                {
                    const hasCompleted = await figma.clientStorage.getAsync('hasCompletedOnboarding');
                    figma.ui.postMessage({ type: 'onboarding-status', payload: { hasCompleted: !!hasCompleted } });
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
                            figma.ui.postMessage({
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
                                await figma.clientStorage.setAsync('licenseKey', licenseKey.trim());
                                await figma.clientStorage.setAsync('activatedFigmaUserId', currentFigmaUserId);
                                void sendTelemetryEvent('license_activation_success', { success: true });
                                figma.ui.postMessage({ type: 'license-verified' });
                            } else {
                                const reason = (serverResult && serverResult.message) ? serverResult.message : 'Activation failed.';
                                void sendTelemetryEvent('license_activation_failed', { success: false, errorCode: 'server_activation_failed', message: reason });
                                figma.ui.postMessage({ type: 'license-invalid', payload: { message: reason } });
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
                                // Store the key AND the Figma user ID to bind license to this account
                                await figma.clientStorage.setAsync('licenseKey', licenseKey.trim());
                                const figmaUserId = currentFigmaUserId;
                                if (figmaUserId) {
                                    await figma.clientStorage.setAsync('activatedFigmaUserId', figmaUserId);
                                }
                                void sendTelemetryEvent('license_activation_success', { success: true });
                                figma.ui.postMessage({ type: 'license-verified' });
                            } else {
                                void sendTelemetryEvent('license_activation_failed', { success: false, errorCode: 'inactive_subscription', message: 'Subscription ended or failed' });
                                figma.ui.postMessage({ type: 'license-invalid', payload: { message: 'Your subscription has ended or failed. Please renew your subscription.' } });
                            }
                        } else {
                            const reason = data.message || 'Invalid license key or an issue with the purchase.';
                            void sendTelemetryEvent('license_activation_failed', { success: false, errorCode: 'invalid_license', message: reason });
                            figma.ui.postMessage({ type: 'license-invalid', payload: { message: reason } });
                        }
                    } catch (error) {
                        console.error('Gumroad API verification error:', error);
                        if (ACTIVATION_SERVER_BASE_URL) {
                            const healthcheck = await pingActivationServer();
                            const diagnostic = healthcheck.ok
                                ? (error instanceof Error ? error.message : 'Activation request failed.')
                                : (healthcheck.reason || 'Activation server is unreachable from the plugin.');
                            void sendTelemetryEvent('license_activation_failed', { success: false, errorCode: 'activation_server_error', message: diagnostic });
                            figma.ui.postMessage({ type: 'license-invalid', payload: { message: `Activation server error: ${diagnostic}` } });
                        } else {
                            void sendTelemetryEvent('license_activation_failed', { success: false, errorCode: 'activation_network_error', message: 'Could not connect to the activation server' });
                            figma.ui.postMessage({ type: 'license-invalid', payload: { message: 'Could not connect to the activation server. Please try again.' } });
                        }
                    }
                    break;
                }
            case 'unsubscribe':
                {
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
                    let trialCountToRestore = await figma.clientStorage.getAsync('trialCountBeforePro');
                    if (typeof trialCountToRestore !== 'number') {
                        trialCountToRestore = FREE_TRIAL_LIMIT;
                    } else if (trialCountToRestore > FREE_TRIAL_LIMIT) {
                        trialCountToRestore = FREE_TRIAL_LIMIT;
                    }
                    await figma.clientStorage.setAsync('trialCount', trialCountToRestore);

                    figma.notify('You have successfully unsubscribed from PRO.');
                    figma.ui.postMessage({
                        type: 'unsubscribe-success',
                        payload: { isPro: false, trialCount: trialCountToRestore }
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
                    figma.ui.postMessage({ type: 'api-keys', payload: { gemini: geminiApiKey || null, openai: openaiApiKey || null } });
                    break;
                }
            case 'set-api-keys':
                {
                    await Promise.all([
                        figma.clientStorage.setAsync('geminiApiKey', msg.payload.gemini),
                        figma.clientStorage.setAsync('openaiApiKey', msg.payload.openai)
                    ]);
                    figma.ui.postMessage({ type: 'api-keys-set' });
                    break;
                }
            case 'run-action':
                {
                    const isPro = await figma.clientStorage.getAsync('isPro');
                    const feature = getActionFeature(msg.payload);
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
                            figma.ui.postMessage({ type: 'user-status-updated', payload: { trialCount } });
                            void sendTelemetryEvent('trial_used', { feature, trialCount, ...selectionTelemetry });
                        } else {
                            void sendTelemetryEvent('trial_exhausted', { feature, trialCount, ...selectionTelemetry, success: false });
                            figma.ui.postMessage({ type: 'plugin-error', payload: { message: 'Trial expired. Please upgrade to Pro.' } });
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
                    figma.ui.postMessage({ type: 'available-fonts', payload: { fonts } });
                    break;
                }
            case 'get-font-styles':
                {
                    const { fontFamily } = msg.payload;
                    const styles = await getFontStyles(fontFamily);
                    figma.ui.postMessage({ type: 'font-styles', payload: { styles } });
                    break;
                }
            case 'count-text-layers':
                {
                    const count = await countTextLayersInSelection();
                    figma.ui.postMessage({ type: 'text-layers-count', payload: { count } });
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
                            figma.ui.postMessage({ type: 'user-status-updated', payload: { trialCount } });
                            void sendTelemetryEvent('trial_used', { feature, trialCount, ...selectionTelemetry });
                        } else {
                            // Should be caught by UI, but double check
                            void sendTelemetryEvent('trial_exhausted', { feature, trialCount, ...selectionTelemetry, success: false });
                            figma.ui.postMessage({ type: 'plugin-error', payload: { message: 'Trial expired. Please upgrade to Pro.' } });
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
                    figma.ui.postMessage({ type: 'recent-fonts', payload: { fonts: recentFonts } });
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
        figma.ui.postMessage({ type: 'plugin-error', payload: { message: userFacingMessage } });
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

async function processTextNodesForTranslation(textNodes, fromLanguage, toLanguage) {
    const textsForApi = [];
    const translationsFromDict = [];

    for (const node of textNodes) {
        const originalText = node.characters;
        let lookupKey = originalText.trim().replace(/\s+/g, ' ').toLowerCase();
        let dictionaryTranslation = undefined;

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

        if (dictionaryTranslation) {
            translationsFromDict.push({ id: node.id, newCharacters: dictionaryTranslation });
        } else {
            textsForApi.push({ id: node.id, characters: originalText });
        }
    }

    if (translationsFromDict.length > 0) {
        const { successCount, failedCount, missingFonts, fontReplacements } = await applyTranslationsToNodes(translationsFromDict, null);
        let notif = `Translated ${successCount} text layer(s) from dictionary.`;
        if (failedCount > 0) notif += ` ${failedCount} failed.`;
        figma.notify(notif);

        if (fontReplacements.size > 0) {
            const replacementsList = Array.from(fontReplacements.entries()).map(([m, f]) => `${m} → ${f}`).join('; ');
            figma.notify(`Substituted missing fonts: ${replacementsList}`, { timeout: 8000 });
        }
        if (missingFonts.size > 0) {
            const fontList = Array.from(missingFonts).join(', ');
            figma.notify(`Could not find fallback for: ${fontList}. Please install.`, { error: true, timeout: 8000 });
        }
    }

    if (textsForApi.length > 0) {
        figma.ui.postMessage({ type: 'text-nodes-found', payload: { texts: textsForApi, fromLanguage, toLanguage } });
    } else {
        if (!pendingVariantCreation) {
            figma.ui.postMessage({ type: 'action-complete' });
            finishActiveFeatureTelemetry();
        } else {
            await completeVariantCreation();
            finishActiveFeatureTelemetry();
        }
    }
}

async function processNodesInPlace(payload, shouldMirror) {
    const { fromLanguage, toLanguage, translateText, mirrorInstances } = payload;
    const selection = figma.currentPage.selection;
    const mirrorContext = createMirrorContext({ fromLanguage, toLanguage, translateText });

    if (selection.length === 0) {
        figma.ui.postMessage({ type: 'plugin-error', payload: { message: 'Please select at least one item to process.' } });
        return;
    }

    if (shouldMirror) {
        figma.notify('Mirroring selection...');
        for (const node of selection) {
            await mirrorNode(node, false, mirrorContext, mirrorInstances);
        }
    }

    if (translateText) {
        const nodesForTranslation = [...selection];
        if (mirrorInstances) {
            nodesForTranslation.push(...mirrorContext.createdVariants.values());
        }

        const textNodes = findTextNodes(nodesForTranslation);
        if (textNodes.length === 0) {
            figma.notify(shouldMirror ? 'Selection mirrored. No text found to translate.' : 'No text layers found in selection.');
            figma.ui.postMessage({ type: 'action-complete' });
            return;
        }
        await processTextNodesForTranslation(textNodes, fromLanguage, toLanguage);
    } else {
        if (shouldMirror) figma.notify('Selection mirrored successfully!');
        figma.ui.postMessage({ type: 'action-complete' });
    }
}

function createMirrorContext(options = {}) {
    return {
        targetVariants: new Map(),
        createdVariants: new Map(),
        options
    };
}

async function handleCreateVariant(payload) {
    const { fromLanguage, toLanguage, translateText, mirrorInstances, shouldMirror } = payload;
    const selection = figma.currentPage.selection;

    if (selection.length !== 1) {
        figma.notify('Please select a single Component, Component Set, or Instance.', { error: true });
        figma.ui.postMessage({ type: 'action-complete' });
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
        figma.ui.postMessage({ type: 'action-complete' });
        return;
    }

    if (!sourceComponentOrSet || sourceComponentOrSet.remote) {
        figma.notify('Cannot create a variant for a remote component.', { error: true });
        figma.ui.postMessage({ type: 'action-complete' });
        return;
    }

    const originalInstanceId = selectedNode.type === 'INSTANCE' ? selectedNode.id : null;
    const sourceParent = sourceComponentOrSet.type === 'COMPONENT'
        ? await getComponentParentAsync(sourceComponentOrSet)
        : sourceComponentOrSet.parent;

    if (!sourceParent) {
        figma.notify('Cannot create variants because this main component no longer has a local parent in the file.', { error: true });
        figma.ui.postMessage({ type: 'action-complete' });
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

        componentSet = figma.combineAsVariants([sourceComponentOrSet, newVariant], sourceParent);
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

    const mirrorContext = createMirrorContext({ fromLanguage, toLanguage, translateText });
    if (shouldMirror !== false) {
        for (const newVariant of newVariants) {
            await mirrorNode(newVariant, false, mirrorContext, mirrorInstances);
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
        const translationRoots = newVariants.concat(Array.from(mirrorContext.createdVariants.values()));
        const seenTextNodeIds = new Set();
        for (const root of translationRoots) {
            for (const textNode of findTextNodes([root])) {
                if (!seenTextNodeIds.has(textNode.id)) {
                    seenTextNodeIds.add(textNode.id);
                    textNodes.push(textNode);
                }
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
        figma.ui.postMessage({ type: 'action-complete' });
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
    figma.ui.postMessage({ type: 'action-complete' });
}


// A cache for available fonts to avoid calling the async function repeatedly during a single action.
let availableFontsCache = null;
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

    const fontsInFamily = availableFontsCache.filter(f => f.fontName.family === family);
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
            const found = fontsInFamily.find(f => f.fontName.style.toLowerCase() === style.toLowerCase());
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

async function applyTranslationsToNodes(translations, onProgress) {
    let successCount = 0;
    let failedCount = 0;
    const total = translations.length;
    const missingFonts = new Set();
    const fontReplacements = new Map();

    // Ensure the font cache is available for this operation.
    if (!availableFontsCache) {
        try {
            availableFontsCache = await figma.listAvailableFontsAsync();
        } catch (e) {
            console.error("Could not list available fonts:", e);
            availableFontsCache = [];
        }
    }

    for (let i = 0; i < total; i++) {
        const item = translations[i];
        const node = await figma.getNodeByIdAsync(item.id);

        if (node && node.type === 'TEXT' && !node.removed) {
            try {
                const originalSegments = node.getStyledTextSegments(['fontName', 'fills']);
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

                node.characters = item.newCharacters;

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
                successCount++;
            } catch (e) {
                failedCount++;
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
    availableFontsCache = null; // Clear cache after the operation completes.
    fontLoadStatusCache.clear();
    fallbackFontCache.clear();
    fontsByFamilyCache.clear();
    return { successCount, failedCount, missingFonts, fontReplacements };
}


async function handleApplyTranslations(payload) {
    const onProgress = (processed, total) => {
        figma.ui.postMessage({
            type: 'translation-progress',
            payload: { processed, total }
        });
    };
    const { successCount, failedCount, missingFonts, fontReplacements } = await applyTranslationsToNodes(payload.translations, onProgress);

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

    if (!pendingVariantCreation) {
        figma.ui.postMessage({ type: 'action-complete' });
    }
}

function findTextNodes(nodes) {
    let textNodes = [];
    for (const node of nodes) {
        if (node.type === 'TEXT') {
            textNodes.push(node);
        } else if ('children' in node) {
            textNodes = textNodes.concat(findTextNodes(node.children));
        }
    }
    return textNodes;
}

function isAtomicIllustration(node) {
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

async function mirrorNode(node, isInsideInstance = false, mirrorContext = createMirrorContext(), mirrorInstances = false, isInsideFlippedContainer = false) {
    const isIllustration = isAtomicIllustration(node);
    const nodeNameLower = node.name.toLowerCase();

    if (node.type === 'INSTANCE' && mirrorInstances) {
        try {
            const mainComponent = await node.getMainComponentAsync();
            if (mainComponent && !mainComponent.remote) {
                const targetVariant = await ensureTargetVariant(mainComponent, mirrorContext);
                if (targetVariant && targetVariant.id !== mainComponent.id) {
                    node.swapComponent(targetVariant);
                }

                // The target component owns the mirrored layout. Continuing through this
                // instance would apply a second mirror as overrides.
                return;
            }
        } catch (error) {
            console.warn(`Could not create or swap the target variant for instance "${node.name}": ${error.message}`);
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
    } catch (e) {
        console.warn(`Skipping property modification for node "${node.name}" (${node.id}) due to a read-only error: ${e.message}`);
    }

    if ('children' in node && !isIllustration) {
        if (!isFlippedNow && !isInsideFlippedContainer) {
            try {
                // These layout property changes are safe to run on instances themselves as overrides.
                if (node.layoutMode === 'HORIZONTAL') {
                    if (node.primaryAxisAlignItems === 'MIN') {
                        node.primaryAxisAlignItems = 'MAX';
                    } else if (node.primaryAxisAlignItems === 'MAX') {
                        node.primaryAxisAlignItems = 'MIN';
                    }
                } else if (node.layoutMode === 'VERTICAL') {
                    if (node.counterAxisAlignItems === 'MIN') {
                        node.counterAxisAlignItems = 'MAX';
                    } else if (node.counterAxisAlignItems === 'MAX') {
                        node.counterAxisAlignItems = 'MIN';
                    }
                }

                // These operations modify the children themselves (reordering/repositioning).
                // They are NOT safe inside an instance, so we only run them on regular frames/groups.
                if (!isInsideInstance && node.type !== 'INSTANCE') {
                    if (node.layoutMode === 'HORIZONTAL') {
                        const reversedChildren = node.children.slice().reverse();
                        reversedChildren.forEach((child, index) => {
                            node.insertChild(index, child);
                        });
                    } else if (node.layoutMode === 'NONE' || typeof node.layoutMode === 'undefined') {
                        const parentWidth = node.width;
                        for (const child of node.children) {
                            if (isLikelyBackground(child) || isFixedUIElement(child)) {
                                continue;
                            }
                            if ('x' in child && 'width' in child) {
                                child.x = parentWidth - (child.x + child.width);
                            }
                            if ('constraints' in child) {
                                const { horizontal, vertical } = child.constraints;
                                if (horizontal === 'LEFT') {
                                    child.constraints = { horizontal: 'RIGHT', vertical };
                                } else if (horizontal === 'RIGHT') {
                                    child.constraints = { horizontal: 'LEFT', vertical };
                                }
                            }
                        }
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
        const fonts = await figma.listAvailableFontsAsync();
        const styles = fonts
            .filter(font => font.fontName.family === fontFamily)
            .map(font => font.fontName.style);
        return [...new Set(styles)].sort();
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
        figma.ui.postMessage({ type: 'font-change-error', payload: { message } });
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
            figma.ui.postMessage({ type: 'font-change-error', payload: { message } });
            return { success: false, errorCode: 'no_text_layers', message };
        }

        // Get all available styles for the target font
        const availableFonts = await figma.listAvailableFontsAsync();
        const targetFontStyles = availableFonts.filter(font => font.fontName.family === fontFamily);

        if (targetFontStyles.length === 0) {
            const message = `Font family "${fontFamily}" not found.`;
            figma.ui.postMessage({ type: 'font-change-error', payload: { message } });
            return { success: false, errorCode: 'font_not_found', message };
        }

        const total = textNodes.length;
        let changedCount = 0;
        let processed = 0;

        for (const node of textNodes) {
            processed++;
            // Send progress every 5 nodes or so to avoid flooding, but enough to feel smooth
            if (processed % 5 === 0 || processed === total) {
                figma.ui.postMessage({
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
                const rangeFont = node.getRangeFontName(0, 1);
                currentStyle = rangeFont.style;
            } else {
                currentStyle = node.fontName.style;
            }

            // If no specific style requested, use smart matching
            if (!targetStyle || targetStyle === 'Auto Match') {
                targetStyle = findBestWeightMatch(currentStyle, targetFontStyles);
            }

            // Verify the target style exists
            if (!targetFontStyles.some(f => f.fontName.style === targetStyle)) {
                // Fallback if specific requested style not found (shouldn't happen if UI is correct, but safety first)
                targetStyle = findBestWeightMatch(currentStyle, targetFontStyles);
            }

            const targetFontName = { family: fontFamily, style: targetStyle };

            try {
                await figma.loadFontAsync(targetFontName);
                node.fontName = targetFontName;

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

        figma.ui.postMessage({
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
        figma.ui.postMessage({ type: 'font-change-error', payload: { message } });
        return { success: false, errorCode: 'font_change_exception', message };
    }
}

function findBestWeightMatch(currentStyle, availableFontStyles) {
    const styleMap = availableFontStyles.map(f => f.fontName.style);

    // 1. Exact match
    if (styleMap.includes(currentStyle)) return currentStyle;

    // 2. Weight-based matching
    const lowerStyle = currentStyle.toLowerCase();

    // Define priorities for common weights
    if (lowerStyle.includes('bold')) {
        if (styleMap.some(s => s.toLowerCase().includes('bold'))) return styleMap.find(s => s.toLowerCase().includes('bold'));
        if (styleMap.some(s => s.toLowerCase().includes('black'))) return styleMap.find(s => s.toLowerCase().includes('black'));
        if (styleMap.some(s => s.toLowerCase().includes('heavy'))) return styleMap.find(s => s.toLowerCase().includes('heavy'));
        if (styleMap.some(s => s.toLowerCase().includes('sembold'))) return styleMap.find(s => s.toLowerCase().includes('semibold'));
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
    return styleMap[0];
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
async function ensureTargetVariant(mainComponent, mirrorContext) {
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
            await ensureTargetVariantIsMirrored(existingTarget, mirrorContext, mainComponent.id);
            return existingTarget;
        }
    } else if (
        sourceProps.RTL === targetProps.RTL &&
        sourceProps.Language === targetProps.Language
    ) {
        mirrorContext.targetVariants.set(mainComponent.id, mainComponent);
        await ensureTargetVariantIsMirrored(mainComponent, mirrorContext, mainComponent.id);
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
            targetComponentSet = figma.combineAsVariants([mainComponent, newVariant], componentParent);
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

    await ensureTargetVariantIsMirrored(newVariant, mirrorContext, mainComponent.id);
    fitComponentSetToChildren(targetComponentSet);
    return newVariant;
}
