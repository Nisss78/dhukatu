"use client";

import { CompanyCard } from "@/components/CompanyCard";
import { FilterPanel, FilterOptions } from "@/components/FilterPanel";
import Link from "next/link";
import { useState, useEffect } from "react";

interface DeadlineData {
  _id: string;
  company_name: string;
  type: string;
  deadline_date: string;
  description?: string;
  link?: string;
  source: string;
}

export default function HomePage() {
  const [filters, setFilters] = useState<FilterOptions>({
    type: "",
    industry: "",
    dateFrom: "",
    dateTo: "",
    search: "",
  });
  const [deadlines, setDeadlines] = useState<DeadlineData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeadlines() {
      try {
        const params = new URLSearchParams();
        if (filters.type) params.append("type", filters.type);
        if (filters.dateFrom) params.append("start", filters.dateFrom);
        if (filters.dateTo) params.append("end", filters.dateTo);

        const response = await fetch(`/api/calendar?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setDeadlines(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch deadlines:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDeadlines();
  }, [filters]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">就活締切管理</h1>
              <p className="text-blue-100 mt-2">ES・選考締切一覧サイト</p>
            </div>
            <Link
              href="/calendar"
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
            >
              カレンダー表示
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <FilterPanel onFilterChange={handleFilterChange} />

        <div className="mb-4 text-gray-600 dark:text-gray-400 text-sm">
          {loading ? "読み込み中..." : `${deadlines.length} 件の締切情報`}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {deadlines.map((deadline) => (
            <CompanyCard
              key={deadline._id}
              id={deadline._id}
              name={deadline.company_name}
              type={deadline.type as any}
              deadlineDate={deadline.deadline_date}
              description={deadline.description}
              link={deadline.link}
              source={deadline.source}
            />
          ))}
        </div>

        {!loading && deadlines.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            該当する締切情報がありません
          </div>
        )}
      </main>

      <footer className="bg-gray-100 dark:bg-gray-900 mt-12 py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>データソース: @syukatsurisu, @InternGuide, @gaishishukatsu, 就活市場, ラク就活</p>
        </div>
      </footer>
    </div>
  );
}
