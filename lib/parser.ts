import { ParsedDeadline } from "./types";

/**
 * X投稿から締切情報を解析・抽出する
 */
export class TweetParser {
  private readonly ACCOUNTS = {
    syukatsurisu: "@syukatsurisu",
    InternGuide: "@InternGuide",
    gaishishukatsu: "@gaishishukatsu",
  };

  /**
   * 投稿テキストから締切情報を抽出
   */
  parseTweet(tweetText: string, source: string): ParsedDeadline | null {
    const lines = tweetText.split("\n").map((l) => l.trim());

    let companyName = "";
    let type: "es" | "honsenkou" | "test_center" | "internship" = "es";
    let deadlineDate = "";
    let description = "";
    let link = "";

    // タイプ判定
    if (tweetText.includes("ES") || tweetText.includes("エントリーシート")) {
      type = "es";
    } else if (tweetText.includes("本選考") || tweetText.includes("選考")) {
      type = "honsenkou";
    } else if (tweetText.includes("テストセンター") || tweetText.includes("Webテスト")) {
      type = "test_center";
    } else if (tweetText.includes("インターン")) {
      type = "internship";
    }

    // 企業名抽出（複数パターン対応）
    const companyPatterns = [
      /【(.+?)】.*?(?:ES|本選考|テストセンター|インターン|締切)/,
      /^(.+?)[:：].*?(?:ES|本選考|テストセンター|インターン|締切)/,
      /^(.+?)\s.*?(?:ES|本選考|テストセンター|インターン|締切)/,
    ];

    for (const pattern of companyPatterns) {
      const match = tweetText.match(pattern);
      if (match && match[1]) {
        companyName = match[1].replace(/【|】/g, "").trim();
        break;
      }
    }

    // 日付抽出（複数フォーマット対応）
    const datePatterns = [
      /(\d{1,2})\/(\d{1,2})[（(]([月火水木金土日])[）)]/,
      /(\d{1,2})月(\d{1,2})日[（(]([月火水木金土日])[）)]/,
      /(\d{4})\/(\d{1,2})\/(\d{1,2})/,
    ];

    for (const pattern of datePatterns) {
      const match = tweetText.match(pattern);
      if (match) {
        const [, m1, m2, dayOfWeek] = match;
        let month: string, day: string;

        if (m1.length === 4) {
          // YYYY/MM/DD format
          month = m2;
          day = match[3];
        } else {
          // M/D or MM/DD format
          month = m1;
          day = m2;
        }

        // 時刻抽出
        const timeMatch = tweetText.match(/(\d{1,2}):(\d{2})/);
        const hours = timeMatch ? timeMatch[1] : "23";
        const minutes = timeMatch ? timeMatch[2] : "59";

        // 年は現在の年を想定
        const currentYear = new Date().getFullYear();
        deadlineDate = `${currentYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hours}:${minutes}:00`;
        break;
      }
    }

    // URL抽出
    const urlMatch = tweetText.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      link = urlMatch[1];
    }

    // 説明文抽出
    const descPattern = /(?:説明|詳細|備考)[:：]\s*(.+)/;
    const descMatch = tweetText.match(descPattern);
    if (descMatch) {
      description = descMatch[1].trim();
    }

    // 必須項目チェック
    if (!companyName || !deadlineDate) {
      return null;
    }

    return {
      company_name: companyName,
      type,
      deadline_date: deadlineDate,
      description,
      link,
      source,
    };
  }

  /**
   * 複数の投稿から締切情報を一括抽出
   */
  parseTweets(tweets: { text: string; source: string }[]): ParsedDeadline[] {
    const results: ParsedDeadline[] = [];

    for (const tweet of tweets) {
      const parsed = this.parseTweet(tweet.text, tweet.source);
      if (parsed) {
        results.push(parsed);
      }
    }

    return results;
  }

  /**
   * 日付文字列の妥当性チェック
   */
  isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  /**
   * 会社名の正規化（全角半角統一、スペース削除等）
   */
  normalizeCompanyName(name: string): string {
    return name
      .trim()
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      .replace(/\s+/g, "")
      .replace(/株式会社|合名会社|合資会社|有限会社/g, "")
      .trim();
  }

  /**
   * 締切タイプの文字列からenum変換
   */
  parseType(typeStr: string): "es" | "honsenkou" | "test_center" | "internship" {
    const normalized = typeStr.toLowerCase();

    if (normalized.includes("es") || normalized.includes("エントリーシート")) {
      return "es";
    }
    if (normalized.includes("本選考") || normalized.includes("選考")) {
      return "honsenkou";
    }
    if (normalized.includes("テストセンター") || normalized.includes("webテスト")) {
      return "test_center";
    }
    if (normalized.includes("インターン")) {
      return "internship";
    }

    return "es"; // デフォルト
  }
}

export const tweetParser = new TweetParser();
