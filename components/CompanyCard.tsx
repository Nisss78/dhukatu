"use client";

import Link from "next/link";

export interface CompanyCardProps {
  id: string;
  name: string;
  type: string;
  deadlineDate: string;
  description?: string;
  link?: string;
  source?: string;
}

export function CompanyCard({
  id,
  name,
  type,
  deadlineDate,
  description,
  link,
  source,
}: CompanyCardProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "es":
        return "ES";
      case "honsenkou":
        return "本選考";
      case "test_center":
        return "テストセンター";
      case "internship":
        return "インターン";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "es":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "honsenkou":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "test_center":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "internship":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()} (${["日", "月", "火", "水", "木", "金", "土"][date.getDay()]})`;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
        <span className={`px-2 py-1 text-xs rounded ${getTypeColor(type)}`}>
          {getTypeLabel(type)}
        </span>
      </div>

      {description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {description}
        </p>
      )}

      <div className="flex items-center gap-2 mb-4">
        <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
          締切: {formatDate(deadlineDate)} {formatTime(deadlineDate)}
        </span>
      </div>

      <div className="flex gap-2">
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
          >
            応募ページ
          </a>
        )}
        <Link
          href={`/company/${id}`}
          className="flex-1 text-center px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm rounded transition-colors"
        >
          詳細
        </Link>
      </div>

      {source && (
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
          ソース: {source}
        </div>
      )}
    </div>
  );
}
