# Project K — Interview Module Frontend

Next.js 14 (App Router) · Python FastAPI · JavaScript · Tailwind CSS

---

## Quick Start

```bash
# Install dependencies
npm install

# Copy env and fill in values
cp .env.local.example .env.local

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/
│   ├── auth/           # Login, Signup, Forgot Password (public)
│   ├── main/           # Authenticated pages (dashboard, interview, reports, etc.)
│   ├── pricing/        # Public pricing page
│   └── score-card/     # Public shareable score card
├── components/
│   ├── ui/             # shadcn primitives
│   ├── shared/         # App-wide reusable components
│   ├── auth/           # Auth-specific components
│   ├── dashboard/      # Dashboard widgets
│   ├── interview/      # Interview setup & session components
│   ├── reports/        # Report detail components
│   └── pricing/        # Pricing plan cards
├── hooks/              # Custom React hooks
├── store/              # Redux Toolkit store + slices
├── lib/
│   ├── api/            # All Axios API call functions
│   ├── axios.js        # Axios instance + silent refresh interceptor
│   ├── queryClient.js  # TanStack Query client
│   ├── validations.js  # Zod schemas
│   └── utils.js        # Utility helpers
└── middleware.js        # Next.js Edge Middleware (auth guard)
```

---

## Auth Strategy

- **JWT stored in httpOnly Secure SameSite=Strict cookies** — never in localStorage or JS memory
- Access token: 15 min TTL
- Refresh token: 7 days, path-restricted to `/api/v1/auth/refresh`
- Silent refresh via Axios interceptor on 401
- Edge Middleware guards all authenticated routes

---

## Implemented Pages

| Route | Description |
|-------|-------------|
| `/auth/login` | Login with email + password |
| `/auth/signup` | Registration with WhatsApp OTP |
| `/auth/forgot-password` | Send reset email |
| `/pricing` | Plan selection + Razorpay checkout |
| `/main/dashboard` | Stats, trend chart, skills, recent interviews |
| `/main/start-interview` | Configure and launch interview session |
| `/main/interview/[sessionId]` | Live WebRTC avatar session |
| `/main/reports` | Paginated reports list |
| `/main/reports/[reportId]` | Full report with plan-gating |
| `/main/profile-setup` | Onboarding profile form |
| `/main/jobs` | Premium job board |
| `/score-card/[id]` | Public shareable score card |

---

## Plan Gating

Uses `BlurredSection` component to blur premium content:

```jsx
<BlurredSection unlockPlan="premium">
  <QuestionFeedbackTable questions={report.questions} />
</BlurredSection>
```

---

## State Management

| State | Tool | Reason |
|-------|------|--------|
| Auth user metadata | Redux authSlice | Needed app-wide |
| JWT tokens | httpOnly Cookie ONLY | Security |
| Interview config | Redux interviewSlice | Shared across pages |
| API response data | TanStack Query | Server-owned, needs caching |
| Form state | React Hook Form | Local to form |

---

## API Base URL

Set in `.env.local`:
```
NEXT_PUBLIC_API_URL=https://api.projectk.io/api/v1
```

See `.env.local.example` for all required environment variables.

---

## Tech Stack

- **Next.js 14** (App Router)
- **JavaScript** (ES2022+, no TypeScript)
- **Tailwind CSS** + custom CSS variables
- **Redux Toolkit** (client state)
- **TanStack Query v5** (server state)
- **React Hook Form + Zod** (form validation)
- **Axios** (HTTP client + silent refresh interceptor)
- **Recharts** (performance trend chart)
- **Framer Motion** (page transitions)
- **LiveKit** (WebRTC for live sessions)
- **Razorpay** (payments)
- **react-hot-toast** (notifications)

---

*Version 1.0 · April 2026 · Confidential — Project K*
