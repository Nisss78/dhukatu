import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/companies
 * 企業一覧を取得
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get("industry") || undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const search = searchParams.get("search") || undefined;

    // TODO: Convex からデータを取得
    // 現在はサンプルデータを返す
    const companies = [
      {
        id: "1",
        name: "楽天",
        industry: "IT・インターネット",
        website: "https://www.rakuten.co.jp/",
        description: "インターネットサービス企業",
        locations: ["東京", "大阪"],
      },
      {
        id: "2",
        name: "ソフトバンク",
        industry: "IT・インターネット",
        website: "https://www.softbank.co.jp/",
        description: "情報通信業",
        locations: ["東京"],
      },
      {
        id: "3",
        name: "キヤノンマーケティングジャパン",
        industry: "製造",
        website: "https://www.canon.co.jp/",
        description: "映像機器メーカー",
        locations: ["東京"],
      },
    ];

    let filtered = companies;

    // 業界フィルタ
    if (industry) {
      filtered = filtered.filter((c) => c.industry === industry);
    }

    // 検索フィルタ
    if (search) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 件数制限
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error("Companies API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
