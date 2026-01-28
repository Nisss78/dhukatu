import { NextRequest, NextResponse } from "next/server";
import { tweetParser } from "@/lib/parser";
import { xApiClient, getTargetAccounts } from "@/lib/x-api";
import { ScrapeResult, ParsedDeadline } from "@/lib/types";

/**
 * POST /api/scrape
 * X API からデータを収集してデータベースに保存
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const result: ScrapeResult = {
    success: false,
    processed: 0,
    added: 0,
    updated: 0,
    errors: [],
  };

  try {
    const body = await request.json();
    const { source = "x" } = body;

    if (source === "x") {
      // X API からスクレイピング
      const accounts = getTargetAccounts();
      const timelines = await xApiClient.getMultipleTimelines(accounts, 100);

      for (const [account, tweets] of timelines.entries()) {
        console.log(`Processing ${tweets.length} tweets from @${account}`);

        for (const tweet of tweets) {
          result.processed++;

          const parsed = tweetParser.parseTweet(tweet.text, `@${account}`);
          if (parsed) {
            // TODO: Convex に保存（現在はログのみ）
            console.log("Parsed deadline:", parsed);
            result.added++;
          }
        }
      }
    }

    result.success = true;
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`Scrape completed in ${duration}s:`, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Scrape error:", error);
    result.errors.push(error instanceof Error ? error.message : "Unknown error");

    return NextResponse.json(result, { status: 500 });
  }
}

/**
 * GET /api/scrape
 * スクレイピングステータス確認
 */
export async function GET() {
  return NextResponse.json({
    status: "ready",
    target_accounts: getTargetAccounts(),
    timestamp: new Date().toISOString(),
  });
}
