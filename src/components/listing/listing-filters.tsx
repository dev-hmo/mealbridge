"use client";

import { Input } from "@/components/ui/input";
import { LISTING_CATEGORIES } from "@/lib/constants";

interface ListingFiltersProps {
  category: string;
  search: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (search: string) => void;
}

export function ListingFilters({
  category,
  search,
  onCategoryChange,
  onSearchChange,
}: ListingFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <Input
        placeholder="Search food listings..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
      />

      {/* Category filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange("all")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === "all"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {LISTING_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat.value
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
