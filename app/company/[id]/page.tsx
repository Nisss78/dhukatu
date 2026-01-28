"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params.id as string;

  // サンプルデータ（実際にはConvexから取得）
  const company = {
    name: "楽天",
    industry: "IT・インターネット",
    website: "https://www.rakuten.co.jp/",
    description: "インターネットサービス企業。イーコマース、 fintech、 モバイルなど幅広い事業を展開。",
    locations: ["東京", "大阪"],
    deadlines: [
      {
        id: "1",
        type: "es",
        deadlineDate: new Date(Date.now() + 86400000).toISOString(),
        description: "2025年度新卒採用ES",
        link: "https://example.com/rakuten",
      },
      {
        id: "2",
        type: "test_center",
        deadlineDate: new Date(Date.now() + 43200000).toISOString(),
        description: "Webテストセンター",
        link: "https://example.com/rakuten/test",
      },
    ],
    testCenters: [
      {
        id: "1",
        type: "web",
        location: "",
        notes: "自宅から受験可能",
      },
    ],
  };

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
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 (${["日", "月", "火", "水", "木", "金", "土"][date.getDay()]})`;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-blue-100 hover:text-white transition-colors"
              >
                ← 戻る
              </Link>
              <h1 className="text-3xl font-bold">{company.name}</h1>
            </div>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
              >
                企業サイト
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* 企業情報 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本情報 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">企業情報</h2>
              <dl className="space-y-3">
                {company.industry && (
                  <div className="flex">
                    <dt className="w-32 text-gray-600 dark:text-gray-400">業界</dt>
                    <dd className="text-gray-900 dark:text-white">{company.industry}</dd>
                  </div>
                )}
                {company.locations && company.locations.length > 0 && (
                  <div className="flex">
                    <dt className="w-32 text-gray-600 dark:text-gray-400">所在地</dt>
                    <dd className="text-gray-900 dark:text-white">{company.locations.join(", ")}</dd>
                  </div>
                )}
                {company.description && (
                  <div className="flex">
                    <dt className="w-32 text-gray-600 dark:text-gray-400">説明</dt>
                    <dd className="text-gray-900 dark:text-white flex-1">{company.description}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* ES/選考スケジュール */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">ES/選考スケジュール</h2>
              <div className="space-y-4">
                {company.deadlines.map((deadline) => (
                  <div key={deadline.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 text-xs rounded ${getTypeColor(deadline.type)}`}>
                        {getTypeLabel(deadline.type)}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {formatDate(deadline.deadlineDate)} {formatTime(deadline.deadlineDate)}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      {deadline.description}
                    </p>
                    {deadline.link && (
                      <a
                        href={deadline.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        応募ページ →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* テストセンター情報 */}
            {company.testCenters && company.testCenters.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">テストセンター情報</h2>
                <div className="space-y-4">
                  {company.testCenters.map((center) => (
                    <div key={center.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {center.type === "web" ? "Webテスト" : "会場テスト"}
                        </span>
                      </div>
                      {center.location && (
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">
                          場所: {center.location}
                        </p>
                      )}
                      {center.notes && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          備考: {center.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* カレンダーへ移動 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">カレンダーで確認</h3>
              <Link
                href="/calendar"
                className="block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                カレンダー表示
              </Link>
            </div>

            {/* 概要 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">締切概要</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">ES</span>
                  <span className="text-gray-900 dark:text-white">
                    {company.deadlines.filter((d) => d.type === "es").length} 件
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">本選考</span>
                  <span className="text-gray-900 dark:text-white">
                    {company.deadlines.filter((d) => d.type === "honsenkou").length} 件
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">テストセンター</span>
                  <span className="text-gray-900 dark:text-white">
                    {company.deadlines.filter((d) => d.type === "test_center").length} 件
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
