# Peralytics Documentation 📊

> Personal Gamified Finance Tracker
> Built with vanilla JavaScript + Tailwind v4
> Live at: https://peralytics.vercel.app

---

## What Is Peralytics?

Peralytics is a personal finance tracker with 
gamification elements. Track income, expenses, 
wallet balance, goals, debts, and receivables 
while earning XP, collecting badges, and 
pulling the Gacha system.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| HTML | App structure |
| Vanilla JavaScript | All logic |
| Tailwind v4 (CLI) | Styling |
| localStorage | Data storage |
| Vercel | Deployment |
| PWA | Mobile installable |

---

## File Structure

---

## CSS Variables

```css
--bg: #161618          /* Page background */
--bg2: #1e1e21         /* Card background */
--bg3: #26262b         /* Elevated cards */
--bg4: #2e2e35         /* Hover states */
--text: #f0f0f4        /* Primary text */
--text2: #9090a0       /* Muted text */
--text3: #58586a       /* Very muted */
--teal: #00d4aa        /* Primary accent */
--teal-d: #00a888      /* Dark teal */
--purple: #8b7cf8      /* Secondary accent */
--red: #ff6b6b         /* Danger/negative */
--amber: #ffa94d       /* Warning */
--green: #69db7c       /* Success/positive */
--gold: #FFD700        /* Gacha/XP */
--sidebar: 240px       /* Sidebar width */
```

---

## Navigation System

```javascript
// Main navigation function
function switchTab(name) {
  // Updates active state on sidebar buttons
  // Shows correct section
  // Calls render functions per tab
}

// All available tabs
const tabs = [
  'overview', 'board', 'income', 
  'expenses', 'wallet', 'goals', 
  'debts', 'receivables', 'tools', 
  'insights', 'arcade', 'faq', 'coach'
]
```

**Mobile navigation:**
- 5 tabs in floating bottom pill nav
- Class: `mobile-bottom-nav`
- Button class: `mobile-nav-btn`
- Active state synced via `data-tab` attribute

---

## Features

### 💰 Finance Features
- **Overview** — Monthly snapshot with 8 metrics and 4 charts
- **Budget Board** — YNAB style envelope budgeting
- **Income** — Track all income sources with frequency conversion
- **Expenses** — Log and categorize spending
- **Wallet** — Real time cash tracker with transactions
- **Goals** — Savings goals with progress tracking
- **Debts** — Loan and payment tracker
- **Receivables** — Track money others owe you
- **Tools** — Calculator, budget planner, bill splitter, emergency fund checker, receipt vault
- **Insights** — AI powered personalized financial advice

### 🎮 Gamification Features
- **XP System** — Earn XP for financial actions
- **Level System** — Level 1 to 10 with titles
- **Daily Quests** — 5 quests per day for bonus XP
- **Badges** — 17 badges to unlock
- **Gacha System** — 27 collectibles to pull
- **Streaks** — Daily login streak with XP bonus
- **Saving Milestones** — Bonus XP at ₱1K, ₱5K, ₱10K etc

### 🤖 AI Features
- **AI Coach** — Powered by Claude API
- Analyzes real financial data
- Personalized tips and advice

---

## Data Storage

All data stored in browser localStorage.
No server, no cloud, no accounts needed.

**Key prefixes:**
```javascript
pera_theme          // Dark/light mode
pera_expenses       // Expense records
pera_income         // Income sources
pera_wallet         // Wallet balance
pera_transactions   // Wallet transactions
pera_goals          // Savings goals
pera_debts          // Debt records
pera_receivables    // Money owed to user
pera_xp             // XP points
pera_level          // Current level
pera_badges         // Earned badges
pera_collection     // Gacha collection
pera_streak         // Login streak
pera_quests         // Daily quest status
```

⚠️ Warning: Clearing browser data deletes 
all Peralytics data permanently!

---

## Income Frequency Conversion

```javascript
function toMonthly(amount, frequency) {
  if (frequency === 'weekly')    return amount * 4.3
  if (frequency === 'biweekly')  return amount * 2
  if (frequency === 'annual')    return amount / 12
  return amount // monthly already
}
```

---

## XP System

| Action | XP |
|---|---|
| Daily login | +10 |
| Daily streak bonus | +10 × streak |
| Add income source | +15 |
| Add expense | +10 |
| Log wallet transaction | +5 |
| Create savings goal | +20 |
| Deposit to goal | +10 |
| Complete a goal | +200 |
| Hit saving milestone | +100 |
| Log debt payment | +15 |
| Clear debt fully | +150 |
| Earn a badge | +50 |
| Gacha pull common | +10 |
| Gacha pull rare | +25 |
| Gacha pull epic | +60 |
| Gacha pull legendary | +150 |

---

## Level System

| Level | Title |
|---|---|
| 1 | Budol Beginner |
| 2 | Saver Starter |
| 3 | Budget Aware |
| 4 | Money Conscious |
| 5 | Finance Focused |
| 6 | Wealth Builder |
| 7 | Smart Spender |
| 8 | Money Master |
| 9 | Finance Pro |
| 10 | Peralytics Legend |

---

## PWA Configuration

```json
{
  "name": "Peralytics",
  "short_name": "Peralytics",
  "display": "standalone",
  "theme_color": "#00d4aa",
  "background_color": "#161618",
  "start_url": "/index.html"
}
```

**Service worker strategy:** Cache first
**Cache name:** peralytics-v1

---

## How To Run Locally

```bash
# Watch CSS changes (run in terminal)
npm run watch

# Build CSS once
npm run build

# Open app
# Just open index.html in Chrome!
```

---

## How To Deploy

```bash
git add .
git commit -m "your message"
git push
# Vercel auto deploys!
```

**Vercel settings:**
- Build command: (empty)
- Output directory: .
- Framework: Other

---

## Mobile Navigation

**Bottom nav tabs:**
- Overview (ti ti-layout-dashboard)
- Expenses (ti ti-arrow-up-circle)
- Wallet (ti ti-wallet)
- Arcade (ti ti-device-gamepad-2)
- Tools (ti ti-tools)

**Active state synced via:**
```javascript
document.querySelectorAll('.mobile-nav-btn')
  .forEach(b => {
    b.classList.toggle('active', 
      b.dataset.tab === name)
  })
```

---

## Known Issues

- Icons folder needs proper PNG files
- localStorage clears if browser data cleared
- No multi device sync (localStorage only)
- No user accounts or authentication

---

## Future Plans

- [ ] Add proper PWA icons
- [ ] Add export/import backup feature
- [ ] Consider Supabase migration for cloud sync
- [ ] Rebuild with Vite + Tailwind v4 + Vue
- [ ] Add multi currency support
- [ ] Add bill reminder system

---

## Dependencies

```json
{
  "tailwindcss": "^4.3.1",
  "@tailwindcss/cli": "^4.3.1"
}
```

**External libraries (CDN):**
- Tabler Icons v3.2.0
- Chart.js (for charts)

---

## API Integration

**Claude AI Coach:**
- Uses Anthropic Claude API
- Reads localStorage data
- Provides personalized financial advice
- Prompts in the FAQ tab

---

*Last updated: June 2026*
*Built by Jabicodes*