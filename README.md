# BuyMed Test – Product Search & Order (React + TS + Tailwind)

## How to run

```bash
npm install
npm run dev
# build & preview
npm run build
npm run preview
```

## Demo

Live demo: [`https://buymed-test.vercel.app/`](https://buymed-test.vercel.app/)

## Approach

- **Data in-code**: 4 sample products from the spec, typed via `Product`.
- **UI/UX**: mobile-first, 2-column on desktop; cart badge uses an icon; mobile bottom-sheet cart; clear disabled states; loading bar when simulating API.
- **State**: local `useState`; derived data with `useMemo` (filters/cart/totals); callbacks with `useCallback`; quantity input allows empty string so users can clear before typing new.
- **Error handling**: `ErrorBoundary` shows a friendly crash page with reload.
- **Performance**: `React.lazy` + `Suspense` for larger components; `React.memo` for children; lightweight loading fallbacks.

## Trade-offs

- No global store (Redux/Zustand) because the scope is small → simpler code.
- Quantity validation only clamps 0–99; no debounce since interactions and dataset are small.
- Simulated loading uses `setTimeout` (800 ms) just to illustrate feedback; no real API.

## Structure

```
src/
├── components/
│   ├── CartSummary.tsx    # Cart (desktop + mobile bottom-sheet)
│   ├── ErrorBoundary.tsx  # Crash guard + friendly UI
│   ├── Filters.tsx        # Search + category dropdown (searchable, click-outside)
│   └── ProductList.tsx    # Product rows + qty controls
├── utils/formatCurrency.ts
├── types.ts               # Product, CartItem
├── App.tsx                # Page shell, state, layout
└── main.tsx               # Entry, wraps with ErrorBoundary
```
