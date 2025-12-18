import React, {
  JSX,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import "./index.css";
import { formatCurrency } from "./utils/formatCurrency";
import type { CartItem, Product } from "./types";

const Filters = React.lazy(() => import("./components/Filters"));
const ProductList = React.lazy(() => import("./components/ProductList"));
const CartSummary = React.lazy(() => import("./components/CartSummary"));

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    price: 15000,
    category: "Pain Relief",
    isPrescription: false,
  },
  {
    id: 2,
    name: "Amoxicillin 500mg",
    price: 45000,
    category: "Antibiotic",
    isPrescription: true,
  },
  {
    id: 3,
    name: "Vitamin C 1000mg",
    price: 30000,
    category: "Supplement",
    isPrescription: false,
  },
  {
    id: 4,
    name: "Cetirizine 10mg",
    price: 20000,
    category: "Allergy",
    isPrescription: false,
  },
];

type QuantitiesState = Record<number, number | "">;

function App(): JSX.Element {
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  const [quantities, setQuantities] = useState<QuantitiesState>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showMobileCart, setShowMobileCart] = useState<boolean>(false);

  const handleQuantityChange = useCallback(
    (productId: number, rawValue: string | number) => {
      if (rawValue === "") {
        setQuantities((prev) => ({
          ...prev,
          [productId]: "",
        }));
        return;
      }

      const numeric =
        typeof rawValue === "number" ? rawValue : parseInt(rawValue, 10);

      const safeValue = Math.max(
        0,
        Math.min(99, Number.isNaN(numeric) ? 0 : numeric)
      );

      setQuantities((prev) => ({
        ...prev,
        [productId]: safeValue,
      }));
    },
    []
  );

  const handleSimulateFetch = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo<Product[]>(() => {
    const lowerSearch = search.trim().toLowerCase();
    return SAMPLE_PRODUCTS.filter((product) => {
      const matchesName = product.name.toLowerCase().includes(lowerSearch);
      const matchesCategory =
        category === "all" || product.category === category;
      return matchesName && matchesCategory;
    });
  }, [search, category]);

  const cartItems = useMemo<CartItem[]>(() => {
    const toNumber = (value: number | "" | undefined): number => {
      if (typeof value === "number") return value > 0 ? value : 0;
      if (value === "" || value == null) return 0;
      const n = parseInt(String(value), 10);
      return Number.isFinite(n) && n > 0 ? n : 0;
    };

    return SAMPLE_PRODUCTS.map((p) => {
      const quantity = toNumber(quantities[p.id]);
      if (!quantity) return null;
      return {
        ...p,
        quantity,
        subtotal: quantity * p.price,
      };
    }).filter(Boolean) as CartItem[];
  }, [quantities]);

  const grandTotal = useMemo<number>(
    () => cartItems.reduce((sum, item) => sum + item.subtotal, 0),
    [cartItems]
  );

  const totalItems = useMemo<number>(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              Product Search &amp; Order
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Quickly search medicines and build an order.
            </p>
          </div>

          <button
            type="button"
            className="relative flex items-center gap-2 rounded-full bg-primary-600 px-3 py-1.5 text-xs font-medium text-slate-900 shadow-sm transition hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 sm:hidden cursor-pointer"
            onClick={() => setShowMobileCart((prev) => !prev)}
          >
            <span>Cart</span>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-3.5 w-3.5 text-slate-900"
              >
                <path
                  d="M3 4h2l1.5 11h11L19 8H7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="19" r="1" fill="currentColor" />
                <circle cx="16" cy="19" r="1" fill="currentColor" />
              </svg>
            </span>
          </button>
        </header>

        <Suspense
          fallback={
            <main className="flex flex-1 flex-col gap-4 pb-4 sm:pb-8 lg:flex-row">
              <section className="flex-1 rounded-2xl bg-white p-4 shadow-soft sm:p-5">
                <div className="animate-pulse space-y-3">
                  <div className="h-8 w-2/3 rounded-xl bg-slate-100" />
                  <div className="h-10 rounded-2xl bg-slate-100" />
                  <div className="h-24 rounded-2xl bg-slate-100" />
                </div>
              </section>
              <aside className="hidden w-full max-w-sm lg:block">
                <div className="h-full rounded-2xl bg-slate-100 shadow-soft animate-pulse" />
              </aside>
            </main>
          }
        >
          <main className="flex flex-1 flex-col gap-4 pb-4 sm:pb-8 lg:flex-row">
            <section className="flex-1 rounded-2xl bg-white p-4 shadow-soft sm:p-5">
              <Filters
                products={SAMPLE_PRODUCTS}
                search={search}
                onSearchChange={setSearch}
                category={category}
                onCategoryChange={setCategory}
              />

              <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Showing{" "}
                  <span className="font-semibold">
                    {filteredProducts.length}
                  </span>{" "}
                  result(s)
                </span>
                <button
                  type="button"
                  onClick={handleSimulateFetch}
                  className="ml-auto text-[11px] font-medium text-primary-600 hover:text-primary-700 cursor-pointer"
                >
                  Simulate API loading
                </button>
              </div>

              <ProductList
                products={filteredProducts}
                quantities={quantities}
                isLoading={isLoading}
                onChangeQuantity={handleQuantityChange}
              />
            </section>

            <aside className="hidden w-full max-w-sm lg:block">
              <CartSummary
                cartItems={cartItems}
                grandTotal={grandTotal}
                isLoading={isLoading}
              />
            </aside>
          </main>
        </Suspense>

        <section
          className={`mt-2 border-t border-slate-200 bg-white/90 pb-2 pt-3 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:rounded-2xl sm:border sm:bg-white sm:p-4 lg:hidden ${
            showMobileCart ? "" : "sm:max-h-17.5"
          }`}
        >
          <div className="flex items-center justify-between gap-2 px-2 sm:px-0">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Order summary
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {formatCurrency(grandTotal)}{" "}
                <span className="text-xs font-normal text-slate-500">
                  ({totalItems} item{totalItems !== 1 ? "s" : ""})
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowMobileCart((prev) => !prev)}
              className="rounded-full bg-primary-600 px-3 py-1.5 text-xs font-medium text-slate-900 shadow-sm hover:bg-primary-700 transition cursor-pointer"
            >
              {showMobileCart ? "Hide details" : "View details"}
            </button>
          </div>

          {showMobileCart && (
            <div className="mt-3 max-h-60 space-y-2 overflow-y-auto px-2 sm:px-0">
              <Suspense
                fallback={
                  <div className="h-32 rounded-2xl bg-slate-100 shadow-soft" />
                }
              >
                <CartSummary
                  cartItems={cartItems}
                  grandTotal={grandTotal}
                  compact
                  isLoading={isLoading}
                />
              </Suspense>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
