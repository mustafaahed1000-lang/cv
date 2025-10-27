# دليل النشر على GitHub - مصطفى أمريش

## 📋 الملفات التي يجب رفعها على GitHub

### ✅ ملفات مهمة (يجب رفعها):
- `App.tsx` - المكون الرئيسي
- `components/` - جميع المكونات (About, Chatbot, Hero, etc.)
- `public/` - الصور والموارد
- `index.html` - الصفحة الرئيسية
- `index.tsx` - نقطة الدخول
- `index.css` - الأنماط
- `package.json` - إعدادات المشروع
- `package-lock.json` - تثبيت التبعيات
- `tsconfig.json` - إعدادات TypeScript
- `vite.config.ts` - إعدادات Vite
- `types.ts` - التعريفات
- `constants.ts` - الثوابت
- `README.md` - التوثيق
- `SETUP.md` - دليل الإعداد
- `.gitignore` - الملفات المستثناة
- `.gitattributes` - إعدادات Git

### ❌ ملفات لا يجب رفعها:
- `node_modules/` - التبعيات (مدرجة في .gitignore)
- `dist/` - ملفات البناء (مدرجة في .gitignore)
- `*.db`, `*.db-shm`, `*.db-wal` - قواعد البيانات
- `.env*` - المتغيرات السرية
- `api/` - قاعدة البيانات القديمة (غير مستخدمة)
- `data/` - الملفات الثانوية
- `scripts/` - الملفات الثانوية
- `services/server.cjs` - الخادم (لم يعد مطلوب)
- أي ملف README مكرر
- ملفات الصور الشخصية (شهادة.jpg، صورة واتساب)

## 🚀 خطوات النشر على GitHub

### الخطوة 1: إنشاء مستودع جديد على GitHub

1. اذهب إلى: https://github.com/new
2. املأ البيانات:
   - **Repository name**: `mustafa-emrish-portfolio`
   - **Description**: `Personal Portfolio for Mustafa Amerish - Web Developer & Cybersecurity Expert`
   - **Public** (للوصول المفتوح)
   - **لا تضع** README (لدينا واحد)
3. انقر **Create repository**

### الخطوة 2: إعداد Git محلياً

افتح Terminal في المجلد `C:\Users\user\Desktop\mustafa-emrish---personal-portfolio (1)\mustafa-emrish---personal-portfolio (1)\mustafa-emrish---personal-portfolio`

#### أ. تهيئة Git (إذا لم تفعل ذلك بعد):

```bash
git init
```

#### ب. إضافة الملفات:

```bash
git add .
```

#### ج. إنشاء Commit:

```bash
git commit -m "Initial commit: Personal Portfolio for Mustafa Amerish"
```

#### د. إضافة Remote Repository:

```bash
git remote add origin https://github.com/YOUR_USERNAME/mustafa-emrish-portfolio.git
```

**استبدل `YOUR_USERNAME` باسم المستخدم على GitHub**

#### هـ. رفع الملفات:

```bash
git push -u origin main
```

إذا طُلب منك اسم المستخدم وكلمة المرور، استخدم Personal Access Token

## 🌐 نشر الموقع على الإنترنت

### خيار 1: Netlify (موصى به)

1. اذهب إلى: https://www.netlify.com
2. سجل دخول بحساب GitHub
3. **Add new site** → **Import an existing project**
4. اختر المستودع
5. ضبطات البناء:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. انقر **Deploy site**

### خيار 2: Vercel

1. اذهب إلى: https://vercel.com
2. سجل دخول بحساب GitHub
3. **Add New Project**
4. اختر المستودع
5. Framework Preset: **Vite**
6. Build Settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. انقر **Deploy**

### خيار 3: GitHub Pages

1. في مستودع GitHub، اذهب إلى **Settings**
2. **Pages** من القائمة الجانبية
3. Source: **GitHub Actions**
4. سينشئ ملف `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 📝 ملاحظات مهمة

### الأمان:
- **لا ترفع** ملفات تحتوي على معلومات سرية
- **لا ترفع** `node_modules` (موجود في .gitignore)
- **لا ترفع** `.env` أو المفاتيح
- **لا ترفع** قواعد البيانات (.db)

### الأداء:
- لا ترفع ملفات كبيرة (>100MB)
- استخدم compressed images
- راجع `.gitignore` قبل الرفع

### التوثيق:
- `README.md` - وصف المشروع
- `SETUP.md` - دليل التشغيل
- تعليقات مفيدة في الكود

## ✅ التحقق قبل النشر

```bash
# تأكد من عدم وجود ملفات غير مرغوب بها
git status

# تأكد من محتويات .gitignore
cat .gitignore

# تأكد من أن الكود يعمل
npm run build
```

## 🎉 جاهز للنشر!

بعد اكتمال هذه الخطوات، سيكون موقعك متاحاً على الإنترنت! 🚀✨

