# خطوات التشغيل والنشر على GitHub

## 📋 الخطوات السريعة

### 1. التحضير
```bash
# الانتقال للمجلد
cd "C:\Users\user\Desktop\mustafa-emrish---personal-portfolio (1)\mustafa-emrish---personal-portfolio (1)\mustafa-emrish---personal-portfolio"

# تثبيت التبعيات
npm install
```

### 2. التشغيل
```bash
npm run dev
```

سيفتح الموقع على: http://localhost:3000

### 3. البناء للإنتاج
```bash
npm run build
```

سيتم إنشاء المجلد `dist` الذي يحتوي على الملفات الجاهزة للنشر.

### 4. النشر على GitHub

#### أ. إنشاء مستودع جديد على GitHub
1. اذهب إلى https://github.com/new
2. املأ البيانات:
   - Repository name: `mustafa-emrish-portfolio`
   - Description: `Personal Portfolio for Mustafa Amerish`
   - اختر Public
   - لا تضع README (لأن لدينا واحد)
3. انقر Create repository

#### ب. ضع الملفات على GitHub
```bash
# تهيئة Git (إذا لم تفعل ذلك بعد)
git init

# إضافة الملفات
git add .

# إنشاء Commit
git commit -m "Initial commit: Personal Portfolio"

# إضافة Remote Repository
git remote add origin https://github.com/YOUR_USERNAME/mustafa-emrish-portfolio.git

# رفع الملفات
git push -u origin main
```

#### ج. نشر على Netlify أو Vercel

**Netlify:**
1. اذهب إلى https://www.netlify.com
2. سجل دخول بحساب GitHub
3. انقر "Add new site" → "Import an existing project"
4. اختر المستودع الخاص بك
5. Build command: `npm run build`
6. Publish directory: `dist`
7. انقر "Deploy site"

**Vercel:**
1. اذهب إلى https://vercel.com
2. سجل دخول بحساب GitHub
3. انقر "Add New Project"
4. اختر المستودع الخاص بك
5. Framework Preset: Vite
6. انقر "Deploy"

## 📝 ملاحظات مهمة

- لا ترفع `node_modules` على GitHub (موجود في .gitignore)
- لا ترفع `.env` أو المفاتيح السرية
- الملفات النهائية فقط في مجلد `dist`

## ✅ الملفات الجاهزة للنشر

- ✅ `index.html` - الصفحة الرئيسية
- ✅ `package.json` - إعدادات المشروع
- ✅ `vite.config.ts` - إعدادات Vite
- ✅ `tsconfig.json` - إعدادات TypeScript
- ✅ `.gitignore` - ملفات مستثناة من Git
- ✅ `README.md` - توثيق المشروع
- ✅ جميع ملفات `components/` - المكونات
- ✅ جميع ملفات `public/` - الموارد العامة

## 🎉 جاهز للنشر!

المشروع الآن نظيف وجاهز للنشر على GitHub والإنترنت! 🚀
