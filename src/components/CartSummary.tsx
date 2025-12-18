import React, { JSX } from "react";
import { formatCurrency } from "../utils/formatCurrency";
import type { CartItem } from "../types";

type CartSummaryProps = {
  cartItems: CartItem[];
  grandTotal: number;
  compact?: boolean;
  isLoading?: boolean;
};

const CartSummaryComponent = function CartSummary({
  cartItems,
  grandTotal,
  compact = false,
  isLoading = false,
}: CartSummaryProps): JSX.Element {
  if (isLoading) {
    return (
      <div
        className={`flex h-full flex-col rounded-2xl bg-white p-4 shadow-soft ${
          compact ? "shadow-none" : ""
        }`}
      >
        <h2 className="text-sm font-semibold text-slate-900">Order summary</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Selected products and quantities.
        </p>

        <div className="mt-3 flex-1 space-y-2 overflow-hidden pr-1 animate-pulse">
          {[1, 2].map((key) => (
            <div
              key={key}
              className="flex items-start justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2"
            >
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-32 rounded-full bg-slate-200" />
                <div className="h-2.5 w-24 rounded-full bg-slate-200" />
              </div>
              <div className="h-3 w-16 rounded-full bg-slate-200" />
            </div>
          ))}
        </div>

        <div className="mt-auto border-t border-slate-200 pt-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">Total</span>
            <span className="h-4 w-20 rounded-full bg-slate-200" />
          </div>
          <button
            type="button"
            disabled
            className="mt-3 w-full rounded-xl bg-slate-300 px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm cursor-not-allowed"
          >
            Place order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-full flex-col rounded-2xl bg-white p-4 shadow-soft ${
        compact ? "shadow-none" : ""
      }`}
    >
      <h2 className="text-sm font-semibold text-slate-900">Order summary</h2>
      <p className="mt-0.5 text-xs text-slate-500">
        Selected products and quantities.
      </p>

      {cartItems.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-xs text-slate-500">
          No items in cart. Adjust quantities from the product list.
        </div>
      ) : (
        <div className="mt-3 flex-1 space-y-2 overflow-y-auto pr-1">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-900">
                  {item.name}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {item.quantity} × {formatCurrency(item.price)}
                </p>
              </div>
              <p className="whitespace-nowrap text-xs font-semibold text-slate-900">
                {formatCurrency(item.subtotal)}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-auto border-t border-slate-200 pt-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">Total</span>
          <span className="font-semibold text-primary-700">
            {formatCurrency(grandTotal)}
          </span>
        </div>
        <button
          type="button"
          disabled={cartItems.length === 0}
          className="mt-3 w-full rounded-xl bg-primary-600 px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-primary-700 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          Place order
        </button>
      </div>
    </div>
  );
};

export const CartSummary = React.memo(CartSummaryComponent);
export default CartSummaryComponent;
