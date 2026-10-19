# Helpdesk – מערכת לניהול פניות תמיכה

אפליקציית React לניהול פניות תמיכה (טיקטים). לקוחות פותחים פניות, נציגים מטפלים בהן, ומנהל מקצה אותן ועוקב אחרי כל המערכת.
האפליקציה עובדת מול השרת [helpdesk-api](https://github.com/sarataber/helpdesk-api), עם התחברות מבוססת JWT.

## מה המערכת עושה

| תפקיד | יכולות |
|---|---|
| **Customer** (לקוח) | הרשמה והתחברות, פתיחת טיקט חדש, צפייה בטיקטים שלו, הוספת תגובות |
| **Agent** (נציג) | צפייה בטיקטים שהוקצו אליו, עדכון סטטוס, הוספת תגובות |
| **Admin** (מנהל) | צפייה בכל הטיקטים, עדכון סטטוס, הקצאת טיקטים לנציגים, הוספת תגובות |

### מסלולים

| מסלול | תוכן | גישה |
|---|---|---|
| `/login`, `/register` | התחברות והרשמה | אורחים בלבד |
| `/dashboard` | לוח בקרה עם סטטיסטיקות וטיקטים אחרונים, לפי התפקיד | משתמש מחובר |
| `/tickets` | רשימת טיקטים עם סינון לפי סטטוס | משתמש מחובר |
| `/tickets/:id` | פרטי טיקט, תגובות, עדכון סטטוס והקצאה | משתמש מחובר |
| `/tickets/new` | פתיחת טיקט חדש | לקוח בלבד |
| `*` | עמוד 404 | כולם |

**Route Guards:**
- משתמש שלא מחובר מועבר ל-`/login`, ואחרי ההתחברות חוזר לעמוד שביקש.
- משתמש שהתפקיד שלו לא מורשה לעמוד מועבר ל-`/dashboard` עם הודעה.
- משתמש מחובר שנכנס ל-`/login` מועבר ל-`/dashboard`.

### חוויית משתמש
- **טעינה, שגיאות ו"אין נתונים":** בכל עמוד יש מצב טעינה (ספינר), הודעת שגיאה ומסך "אין נתונים".
- **שגיאות ברורות:** הודעות השרת מוצגות בעברית, כולל "אין חיבור לשרת".
- **התנתקות אוטומטית** כשה-token פג (תשובת 401 מהשרת).
- **עיצוב:** רספונסיבי, מימין לשמאל (RTL), עם פונט Heebo.

## ספריות וטכנולוגיות

| ספרייה | שימוש |
|---|---|
| **React 18** | בניית הממשק |
| **Vite 4** | שרת פיתוח ובנייה. ה-proxy שלו מפנה את `/api` לשרת |
| **React Router 6** | ניתובים ו-Route Guards |
| **Redux Toolkit** + **react-redux** | ניהול state גלובלי |
| **Axios** | קריאות לשרת. interceptor מוסיף את ה-token ומטפל ב-401 |
| CSS עם משתנים | עיצוב, בלי ספריית UI |

### ניהול State (Redux Toolkit)
- **`authSlice`:**
  - התחברות, הרשמה והתנתקות.
  - ה-token ופרטי המשתמש, שנשמרים גם ב-localStorage.
  - מצב טעינה ושגיאה.
- **`ticketsSlice`:**
  - רשימת הטיקטים והטיקט הנבחר עם התגובות שלו.
  - יצירה, עדכון ותגובה.
  - סטטוסים, עדיפויות ורשימת נציגים.
  - מצבי טעינה ושגיאה לכל פעולה.

## מבנה הפרויקט

```
src/
  api/          axios.js (הגדרות + interceptors), authApi, ticketsApi, usersApi
  store/        store.js, authSlice.js, ticketsSlice.js
  routes/       ProtectedRoute, RoleRoute, GuestRoute
  components/   Layout, Navbar, Logo, TicketCard, StatusBadge, CommentList,
                CommentForm, TicketManagePanel, Loader, ErrorMessage, EmptyState
  pages/        Login, Register, Dashboard, TicketsList, TicketDetails, NewTicket, NotFound
  utils/        labels.js (תרגום ערכים לעברית ועיצוב תאריכים)
  App.jsx       הגדרת המסלולים
  main.jsx      Provider של Redux + Router
  index.css     העיצוב
```

## הוראות הרצה

**דרישות:** Node.js 16 ומעלה.

### 1. הרצת השרת

```bash
git clone https://github.com/sarataber/helpdesk-api.git
cd helpdesk-api
npm install
npm run dev
```

השרת עולה על `http://localhost:4000`, ותיעוד Swagger זמין ב-`http://localhost:4000/docs`.

### 2. הרצת האפליקציה (בטרמינל נפרד)

```bash
cd "project react"
npm install
npm run dev
```

אחר כך פותחים בדפדפן את `http://localhost:5173`.

### משתמשים לדוגמה

הסיסמה של כולם היא `password`.

| תפקיד | אימייל |
|---|---|
| Admin | `admin@example.com` |
| Agent | `agent@example.com` |
| Customer | `customer@example.com` |

אפשר גם להירשם דרך `/register`. נרשמים חדשים מקבלים תמיד תפקיד לקוח.

### בנייה לפרודקשן

```bash
npm run build
```
