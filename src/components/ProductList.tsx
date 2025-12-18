import React, { JSX } from "react";
import { formatCurrency } from "../utils/formatCurrency";
import type { Product } from "../types";

type QuantitiesState = Record<number, number | "">;

type ProductListProps = {
  products: Product[];
  quantities: QuantitiesState;
  isLoading: boolean;
  onChangeQuantity: (productId: number, rawValue: string | number) => void;
};

const ProductListComponent = function ProductList({
  products,
  quantities,
  isLoading,
  onChangeQuantity,
}: ProductListProps): JSX.Element {
  if (isLoading) {
    return (
      <div className="space-y-2 animate-pulse">
        {[1, 2, 3, 4].map((key) => (
          <div
            key={key}
            className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2.5"
          >
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3.5 w-40 rounded-full bg-slate-200" />
              <div className="flex items-center gap-2">
                <span className="h-3 w-16 rounded-full bg-slate-200" />
                <span className="h-3 w-14 rounded-full bg-slate-200" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-8 w-8 rounded-full bg-slate-200" />
              <span className="h-8 w-14 rounded-xl bg-slate-200" />
              <span className="h-8 w-8 rounded-full bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
        <div className="mb-2 text-3xl">🔎</div>
        <p className="text-sm font-medium text-slate-700">No products found</p>
        <p className="mt-1 text-xs text-slate-500">
          Try adjusting your search or selecting a different category.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {products.map((product) => {
        const rawQty = quantities[product.id];
        const numericQty =
          typeof rawQty === "number" ? rawQty : parseInt(rawQty ?? "0", 10);
        const safeQty =
          Number.isFinite(numericQty) && numericQty >= 0 ? numericQty : 0;
        const displayValue = rawQty === "" ? "" : safeQty;
        const disabled = isLoading;

        return (
          <article
            key={product.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2.5 transition hover:border-primary-100 hover:bg-white"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="truncate text-sm font-semibold text-slate-900">
                  {product.name}
                </h3>
                {product.isPrescription && (
                  <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-600">
                    Rx
                  </span>
                )}
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                <span className="rounded-full bg-slate-100 px-2 py-0.5">
                  {product.category}
                </span>
                <span className="font-semibold text-primary-700">
                  {formatCurrency(product.price)}
                </span>
              </div>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={disabled || safeQty <= 0}
                onClick={() => onChangeQuantity(product.id, (safeQty || 0) - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
              >
                -
              </button>

              <input
                type="number"
                min={0}
                max={99}
                value={displayValue}
                disabled={disabled}
                onChange={(e) => onChangeQuantity(product.id, e.target.value)}
                className="h-8 w-14 rounded-xl border border-slate-200 bg-white text-center text-sm font-medium text-slate-900 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 disabled:bg-slate-100"
              />

              <button
                type="button"
                disabled={disabled || safeQty >= 99}
                onClick={() => onChangeQuantity(product.id, (safeQty || 0) + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export const ProductList = React.memo(ProductListComponent);
export default ProductListComponent;
