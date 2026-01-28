"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CalendarPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">カレンダー</h1>
              <p className="text-blue-100 mt-2">締切日をカレンダーで確認</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
            >
              一覧に戻る
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {loading ? (
            <div className="flex items-center justify-center h-96 text-gray-500">
              カレンダーを読み込み中...
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              カレンダーは現在準備中です
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
