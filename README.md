# Tracker App

A web application for tracking personal expenses.

## Tech Stack

![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?logo=vuedotjs&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-state-ffd859?logo=vuedotjs&logoColor=white)
![VueUse](https://img.shields.io/badge/VueUse-composables-4FC08D?logo=vuedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?logo=sass&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)

## Features

- Add expenses with description, amount, and category
- Delete expenses
- Filter by category
- Expense statistics
- Persistent storage via localStorage
- Dark / light theme toggle

## Project Structure

```
src/
├── components/
│   ├── icons/          # Icon components (Sun, Moon, ArrowDown)
│   ├── AddExpense.vue
│   ├── BaseButton.vue
│   ├── BaseContainer.vue
│   ├── BaseInput.vue
│   ├── BaseSelect.vue
│   ├── CategoryFilter.vue
│   ├── EmptyState.vue
│   ├── ExpenseItem.vue
│   ├── ExpenseList.vue
│   ├── ExpenseStatistics.vue
│   ├── ExpenseTrackerApp.vue
│   └── ThemeToggle.vue
├── composables/
│   └── useDropdown.js  # Dropdown open/close logic
├── constants/          # Shared constants (categories, etc.)
├── stores/
│   ├── expenses.js     # Expense state (Pinia)
│   └── theme.js        # Theme state (Pinia)
└── styles/             # Global SCSS styles
```

## Getting Started

```bash
npm install
npm run dev
```

## Testing

Unit tests are written with [Vitest](https://vitest.dev/) and [@vue/test-utils](https://test-utils.vuejs.org/).

```
tests/
├── components/   # 12 component tests
└── stores/       # 2 store tests (expenses, theme)
```

```bash
npm test           # run all tests
npm run test:ui    # run with Vitest UI
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run unit tests |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run lint` | Lint and auto-fix with ESLint |
| `npm run format` | Format source files with Prettier |
