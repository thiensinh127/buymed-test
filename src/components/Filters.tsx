import React, { JSX, useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "../types";

type FiltersProps = {
  products: Product[];
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
};

const FiltersComponent = function Filters({
  products,
  search,
  onSearchChange,
  category,
  onCategoryChange,
}: FiltersProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const filteredCategories = useMemo(() => {
    const q = categorySearch.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) =>
      (c === "all" ? "all categories" : c).toLowerCase().includes(q)
    );
  }, [categories, categorySearch]);

  const handleSelectCategory = (value: string) => {
    onCategoryChange(value);
    setIsOpen(false);
  };

  const selectedLabel = category === "all" ? "All categories" : category;

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex-1">
        <label className="block text-xs font-medium text-slate-600">
          Search by name
        </label>
        <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 focus-within:border-primary-400 focus-within:ring-1 focus-within:ring-primary-400">
          <span className="text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Paracetamol, Vitamin C..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full border-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      <div className="relative sm:w-60">
        <label className="block text-xs font-medium text-slate-600">
          Category
        </label>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="mt-1 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-800 hover:border-primary-200 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 cursor-pointer"
        >
          <span className="truncate">{selectedLabel}</span>
          <span className="ml-2 text-xs text-slate-400">
            {isOpen ? "▲" : "▼"}
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
            <div className="border-b border-slate-100 bg-slate-50 px-3 py-2">
              <input
                type="text"
                autoFocus
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Search category..."
                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
              />
            </div>
            <ul className="max-h-52 overflow-y-auto py-1 text-sm">
              {filteredCategories.length === 0 ? (
                <li className="px-3 py-2 text-xs text-slate-400">
                  No categories found
                </li>
              ) : (
                filteredCategories.map((cat) => {
                  const label = cat === "all" ? "All categories" : cat;
                  const isActive = category === cat;
                  return (
                    <li key={cat}>
                      <button
                        type="button"
                        onClick={() => handleSelectCategory(cat)}
                        className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs sm:text-sm ${
                          isActive
                            ? "bg-primary-50 text-primary-700"
                            : "text-slate-700 hover:bg-slate-50"
                        } cursor-pointer`}
                      >
                        <span className="truncate">{label}</span>
                        {isActive && (
                          <span className="ml-2 text-[10px] font-semibold text-primary-600">
                            Selected
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export const Filters = React.memo(FiltersComponent);
export default FiltersComponent;
