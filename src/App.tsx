import React, {
  JSX,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import "./index.css";
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

        <section className="mt-2 border-t border-slate-200 bg-white/90 pb-2 pt-3 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur rounded-2xl sm:border sm:bg-white sm:p-4 lg:hidden">
          <div className="mt-3 space-y-2 px-2 sm:px-0">
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
        </section>
      </div>
    </div>
  );
}

export default App;
