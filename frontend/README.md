# Code Genie

> **Turn Your Ideas Into Code**
> An AI-powered developer assistant for generating, explaining and transforming code.

Code Genie is a modern, responsive SaaS-style web application that helps developers generate code
from plain English, understand existing code, convert voice instructions into code, extract source
code from handwritten images, and scaffold complete project structures.

---

## ✨ Features

| Tool | What it does |
| --- | --- |
| **AI Code Generator** | Describe what you want to build and get code in 10 languages (Python, JavaScript, Java, C, C++, C#, HTML, CSS, SQL, PHP). |
| **Code Explanation** | Paste any snippet and get a plain-English summary, step-by-step breakdown, key functions, I/O and improvement tips. |
| **Voice to Code** | Speak your idea (uses the browser speech engine when available) and convert the transcript into code. |
| **Handwritten OCR** | Upload a photo of handwritten code and extract editable source code. |
| **Project Generator** | Generate a full project tree plus starter files, downloadable as a real `.zip`. |
| **Settings** | Profile, light/dark appearance, default language & AI response style, security actions. |

Plus: protected routes, toasts, loading / empty / error states, form validation, a dark mode, and a
fully responsive layout (desktop sidebar → collapsible sidebar → mobile drawer).

---

## 🛠 Tech stack

- **React 18** + **Vite 5** (JavaScript / JSX)
- **Tailwind CSS 3** (no separate CSS files — utility classes + a small `@layer` layer)
- **React Router 6** (public routes, protected app shell, 404)
- **Lucide React** icons
- **JSZip** for real project downloads
- Component-driven architecture, ready for a live AI API

---

## 🚀 Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

Production build & preview:

```bash
npm run build
npm run preview    # http://localhost:4173
```

Quality checks:

```bash
npm run test:render      # renders every route server-side and fails on render errors
npm run test:ui          # Playwright: 39 end-to-end assertions (auth, all tools, modals, nav)
npm run test:responsive  # 11 routes x 4 viewports: overflow + console/page error sweep
npm run shots            # Playwright: screenshots + console errors + horizontal-scroll check
```

---

## 🔌 AI integration (ready, but safe by default)

All AI calls live in one place: [`src/services/ai.js`](src/services/ai.js).

```js
generateCode({ language, requirement })
explainCode({ language, code })
generateFromVoice({ transcript, language })
extractCodeFromImage({ imageDataUrl, language, fileName })
generateProject({ projectType, projectName, technology, description, features })
```

Configure the provider through environment variables (see [`.env.example`](.env.example)):

```bash
VITE_AI_API_BASE_URL=      # your backend/proxy that talks to the AI provider
VITE_AI_API_KEY=           # optional public client token issued by YOUR backend
VITE_AI_MODEL=code-genie-default
```

**Security note:** anything prefixed with `VITE_` is embedded in the browser bundle and is public.
Never put a provider secret key in the frontend — point `VITE_AI_API_BASE_URL` at your own server
route that holds the real key and forwards requests.

When no base URL is configured the app runs in **demo mode**: every tool returns realistic sample
responses after a short delay (a “Demo mode” badge appears in the app header), so the whole product
is explorable without any credentials.

---

## 📁 Project structure

```
code-genie/
├── index.html
├── tailwind.config.js          # palette, typography, shadows, animations
├── vite.config.js
├── .env.example
├── scripts/
│   ├── smoke.jsx               # route render smoke test
│   ├── dom-stub.js             # minimal browser globals for Node
│   ├── interactions.mjs        # end-to-end interaction assertions (test:ui)
│   ├── responsive-check.mjs    # multi-viewport overflow/error sweep
│   └── shots.mjs               # Playwright screenshots & checks
└── src/
    ├── main.jsx                # providers: theme → toast → auth → router
    ├── App.jsx                 # routes
    ├── index.css               # @tailwind layers + shared component classes
    ├── components/
    │   ├── Logo.jsx            # robot mark + “Code Genie” lockup
    │   ├── Navbar.jsx          # landing header (desktop + mobile menu)
    │   ├── Footer.jsx          # value props, link columns, copyright bar
    │   ├── Sidebar.jsx         # app navigation (collapsible)
    │   ├── UserProfile.jsx     # avatar + dropdown menu
    │   ├── AuthPanel.jsx       # shared left panel for login/signup
    │   ├── PageHeader.jsx
    │   ├── ProtectedRoute.jsx
    │   └── ui/                 # Button, Input, Textarea, Select, Card,
    │                           # StatCard, FeatureCard, CodeEditor, Modal,
    │                           # LoadingSpinner, FileUploader, MicrophoneButton
    ├── context/                # AuthContext, ThemeContext, ToastContext
    ├── layouts/DashboardLayout.jsx
    ├── pages/                  # Landing, Login, Signup, Dashboard,
    │                           # CodeGenerator, CodeExplanation, VoiceToCode,
    │                           # HandwrittenOCR, ProjectGenerator, Settings, NotFound
    ├── services/               # ai.js (API layer) + demoData.js (offline responses)
    └── utils/                  # helpers.js, highlight.js (syntax tokenizer)
```

---

## 🧭 Routes

| Route | Access | Screen |
| --- | --- | --- |
| `/` | Public | Landing page |
| `/login` | Public | Login |
| `/signup` | Public | Sign up |
| `/dashboard` | Protected | Dashboard with stats, welcome card, quick actions |
| `/code-generator` | Protected | Natural language → code workspace |
| `/code-explanation` | Protected | Code → beginner-friendly explanation |
| `/voice-to-code` | Protected | Voice recorder → transcript → code |
| `/handwritten-ocr` | Protected | Image upload → extracted code |
| `/project-generator` | Protected | Form → project tree + downloadable zip |
| `/settings` | Protected | Profile, appearance, preferences, security |
| `*` | Public | 404 |

Protected routes redirect unauthenticated visitors to `/login` and return them to the page they
requested after signing in.

---

## 🎨 Design system

Defined once in `tailwind.config.js` and used everywhere:

| Token | Value | Usage |
| --- | --- | --- |
| `genie-off` | `#EDF7F6` | App background |
| `genie-blue` / `brand-*` | `#168DF5` | Primary actions, accents, active nav |
| `genie-navy` / `ink-*` | `#173B63` | Headings, sidebar, hero & CTA panels |
| `genie-white` | `#FFFFFF` | Cards |
| `genie-light` | `#F1F5F9` | Muted surfaces |

Typography: **Plus Jakarta Sans** (display/headings), **Inter** (UI), **JetBrains Mono** (code).
Shadows (`soft`, `card`, `lift`, `glow`) and a small set of animations (`fade-up`, `pulse-ring`,
`bounce-slow`) keep the interface calm but alive — nothing loops aggressively.

---

## ✅ Quality checklist

- Responsive at 1440px, 1024px, 768px and 390px — **no horizontal scrolling**
- Every form has labels, validation and inline error messages
- Loading, empty and error states for all five AI tools
- Toast notifications for success/error/info feedback
- Keyboard-accessible controls (`aria-*`, focus rings, Escape closes modals)
- Dark mode across the app
- Reusable, documented components — no duplicated markup

---

Made with ♥ for **Developers**.
