# longRunDemo

**Project Overview**
- **Description:** This React + Vite project displays a paginated list of products (inventory) with server-side filtering, sorting, and pagination.
- **Backend:** Uses Supabase as the data backend (Postgres) for queries and counts.
- **Styling/UI:** Tailwind CSS with Material Tailwind components available in `@material-tailwind/react`.

**Features**
- **Filtering:** Search by name, filter by category, price range, and in-stock status — all executed server-side.
- **Sorting:** Sort by `name`, `price`, `stock_quantity`, `created_at`, `category` (asc/desc).
- **Pagination:** Server-side page range queries with total count for UI pagination.
- **Supabase:** Queries built with Supabase client in `src/hooks/useProducts.ts`.

**Important Files**
- `src/pages/ProductsPage.tsx`: Main products list page and UI controls.
- `src/hooks/useProducts.ts`: Server-side query builder (filters, sort, pagination).
- `tailwind.config.cjs`, `postcss.config.cjs`: Tailwind + PostCSS config.
- `src/index.css`: Tailwind directives and global styles.

**Local Setup**
- Prerequisites: `node` (LTS) and `npm` installed.
- Install deps:
```powershell
npm install
```
- Run dev server:
```powershell
npm run dev
```

**Links**
The default page can be viewed via below link on local server- 
http://localhost:5173/productPage

Vercel server link is as below-
https://long-run-demo.vercel.app/productPage

**Supabase Setup (brief)**
- Create a Supabase project and a `products` table with columns matching `ProductDetails` used in the app (e.g., `id`, `name`, `category`, `price`, `stock_quantity`, `created_at`).
- Add your Supabase keys to a local `.env` file (do NOT commit):
```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...yourAnonKey
```
- The app reads `src/lib/supabase.ts` to initialize the client using `import.meta.env.VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

**How filtering/sorting/pagination works**
- The UI manages filter/sort state in `ProductsPage` and calls `fetchProducts()` in `src/hooks/useProducts.ts`.
- `fetchProducts()` constructs a Supabase query that applies the filters (`ilike`, `eq`, `gte`, `lte`), `order()` for sorting, and `.range(from, to)` for pagination, returning `{ rows, total }`.