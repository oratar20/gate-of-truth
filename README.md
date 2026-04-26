# שער האמת - Gate of Truth

מענה רוחני מבוסס חכמת הקבלה והחסידות, מחובר לספריית Sefaria דרך RAG.

## מה בפרויקט

- **Next.js 14** - framework מלא עם App Router
- **Backend API routes** - `/api/chat` שעושה את כל הקסם בשרת:
  1. מחלץ מילות חיפוש בעברית קבלית מהשאלה
  2. מחפש ב-Sefaria בקטגוריות קבלה, חסידות, מחשבת ישראל, מוסר
  3. שולח את המקורות לקלוד עם הנחיות מפורטות
  4. מחזיר תשובה + רשימת מקורות עם קישורים
- **UI מלא בעברית** עם זרימה של 3 שלבים + צ'אט

---

## התקנה מקומית (לבדיקה לפני Deploy)

### 1. התקן Node.js
אם אין לך: הורד מ-https://nodejs.org (גרסה 18 ומעלה)

### 2. פתח טרמינל בתיקיית הפרויקט והתקן תלויות
```bash
npm install
```

### 3. צור קובץ `.env.local` עם מפתח ה-API שלך
```
ANTHROPIC_API_KEY=sk-ant-המפתח-שלך-כאן
```

השג מפתח מ-https://console.anthropic.com/

### 4. הרץ את השרת
```bash
npm run dev
```

פתח בדפדפן: http://localhost:3000

---

## פריסה ל-Vercel (לגרסה חיה באינטרנט)

### דרך 1: דרך GitHub (מומלץ)

1. **העלה את הפרויקט ל-GitHub**
   - צור repo חדש ב-github.com
   - העלה את כל הקבצים (חוץ מ-`node_modules` ו-`.env.local`)

2. **חבר ל-Vercel**
   - היכנס ל-https://vercel.com
   - לחץ "Add New → Project"
   - בחר את ה-repo שלך
   - Vercel יזהה אוטומטית שזה Next.js

3. **הוסף את מפתח ה-API**
   - לפני לחיצה על Deploy, לחץ "Environment Variables"
   - הוסף: `ANTHROPIC_API_KEY` = `sk-ant-המפתח-שלך`

4. **Deploy**
   - לחץ Deploy ותקבל URL כמו `https://gate-of-truth.vercel.app`

### דרך 2: דרך Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

כשהוא ישאל, תגדיר את משתנה הסביבה `ANTHROPIC_API_KEY`.

---

## מבנה הפרויקט

```
gate-of-truth/
├── app/
│   ├── layout.js           # Layout + פונטים + RTL
│   ├── page.js             # ה-UI הראשי (Client Component)
│   └── api/
│       ├── chat/route.js   # הלב: extract→search→answer
│       └── search/route.js # חיפוש Sefaria בלבד (עזר)
├── package.json
├── next.config.js
├── .env.example
└── .gitignore
```

---

## מה עובד עכשיו

✅ UI מלא בעברית עם זרימה של 3 שלבים
✅ חיפוש חי בספריית Sefaria (קבלה + חסידות + מחשבת ישראל + מוסר)
✅ תשובות מבוססות על המקורות האמיתיים שנמצאו
✅ הצגת מקורות עם קישורים ישירים ל-Sefaria
✅ שיחה מרובת־סבבים (המערכת זוכרת את כל השיחה)
✅ טיפול בשגיאות עם פרטים ברורים

## מה אפשר להוסיף בהמשך

- גרסה באנגלית
- שמירת שיחות (localStorage או DB)
- חיפוש סמנטי אמיתי עם vector DB (Pinecone)
- הוספת קולות קריינות (TTS)
- שיתוף תשובות ברשתות חברתיות
- מערכת חשבונות משתמשים

---

## עלויות משוערות

- **Vercel**: חינם (Hobby plan) לשימוש אישי/קהילתי
- **Anthropic API**: כ-$0.003-0.015 לשיחה ממוצעת (תלוי באורך)
- **Sefaria**: חינם, ללא הגבלה סבירה

## קרדיטים

- ספריית Sefaria - https://www.sefaria.org
- Claude API - https://www.anthropic.com
