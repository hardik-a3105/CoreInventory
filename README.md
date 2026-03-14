# CoreInventory — Frontend v2

React.js + Tailwind CSS + React Router v6 + Zustand + Vite

## What changed in v2
- Each section (Receipts, Deliveries, Transfers, Adjustments) is now a separate tab — no more information overload
- Reduced color palette — only purple primary, with semantic green/amber/red for status
- Bigger font sizes throughout
- No emojis — replaced with clean SVG icons
- Professional table layouts for every section
- Staff dashboard also fully tabbed (Pick List / Transfers / Shelving / Stock Count / My Activity)

## Project Structure
```
src/
├── pages/
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── RoleSelectPage.jsx
│   ├── ManagerDashboard.jsx   ← tabbed: Dashboard/Products/Receipts/Deliveries/Transfers/Adjustments
│   └── StaffDashboard.jsx     ← tabbed: All Tasks/Pick List/Transfers/Shelving/Stock Count/My Activity
├── components/
│   ├── ui/         Blobs, Badge
│   ├── layout/     ManagerNav, StaffNav
│   ├── manager/    OverviewTab, ProductsTab, ReceiptsTab, DeliveriesTab, TransfersTab, AdjustmentsTab
│   └── staff/      StaffProgress, StaffTaskCards, PickList, TransferTasks, ShelvingCounting, ActivityTeam
└── store/
    ├── authStore.js
    └── inventoryStore.js
```

## How to Run Locally

1. Install Node.js (v18+) from https://nodejs.org
2. Unzip and open terminal in folder:
   cd coreinventory
3. Install dependencies:
   npm install
4. Start dev server:
   npm run dev
5. Open browser: http://localhost:5173

## Routes
/ → /login
/login        Login
/signup       Sign up
/select-role  Choose role
/manager      Manager dashboard (protected)
/staff        Staff dashboard (protected)

## Connecting to Backend
Replace mock setTimeout in LoginPage.jsx / SignupPage.jsx with:
  const res = await axios.post('/api/auth/login', { email, password })
  login(res.data)
