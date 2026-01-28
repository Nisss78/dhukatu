import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/calendar
 * カレンダー用の締切データを取得
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start") || undefined;
    const endDate = searchParams.get("end") || undefined;
    const type = searchParams.get("type") || undefined;

    // TODO: Convex からデータを取得
    // 現在はサンプルデータを返す
    const deadlines = [
      {
        id: "1",
        title: "楽天 - ES締切",
        start: new Date().toISOString().split("T")[0],
        backgroundColor: "#3b82f6",
        extendedProps: {
          company_name: "楽天",
          type: "es",
          link: "https://example.com/rakuten",
        },
      },
      {
        id: "2",
        title: "ソフトバンク - 本選考",
        start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        backgroundColor: "#ef4444",
        extendedProps: {
          company_name: "ソフトバンク",
          type: "honsenkou",
          link: "https://example.com/softbank",
        },
      },
      {
        id: "3",
        title: "キヤノン - インターン",
        start: new Date(Date.now() + 172800000).toISOString().split("T")[0],
        backgroundColor: "#f59e0b",
        extendedProps: {
          company_name: "キヤノン",
          type: "internship",
          link: "https://example.com/canon",
        },
      },
    ];

    let filtered = deadlines;

    // 日付フィルタ
    if (startDate) {
      filtered = filtered.filter((d) => d.start >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((d) => d.start <= endDate);
    }

    // タイプフィルタ
    if (type) {
      filtered = filtered.filter((d) => d.extendedProps.type === type);
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error("Calendar API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
