import { XApiTweet } from "./types";

/**
 * X API v2 クライアント
 * 環境変数にAPIキー等を設定する必要があります
 */
export class XApiClient {
  private readonly bearerToken: string;
  private readonly apiBaseUrl = "https://api.twitter.com/2";

  constructor() {
    this.bearerToken = process.env.X_BEARER_TOKEN || "";
    if (!this.bearerToken) {
      console.warn("X_BEARER_TOKEN is not set");
    }
  }

  /**
   * 特定ユーザーのタイムラインを取得
   */
  async getUserTimeline(
    username: string,
    maxResults: number = 100
  ): Promise<XApiTweet[]> {
    if (!this.bearerToken) {
      throw new Error("X_BEARER_TOKEN is not configured");
    }

    try {
      // ユーザーIDを取得
      const userId = await this.getUserId(username);
      if (!userId) {
        throw new Error(`User ${username} not found`);
      }

      // タイムライン取得
      const response = await fetch(
        `${this.apiBaseUrl}/users/${userId}/tweets?max_results=${maxResults}&tweet.fields=created_at,author_id`,
        {
          headers: {
            Authorization: `Bearer ${this.bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`X API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return (data.data || []).map((tweet: any) => ({
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at,
        author_id: tweet.author_id,
      }));
    } catch (error) {
      console.error(`Error fetching timeline for ${username}:`, error);
      return [];
    }
  }

  /**
   * ユーザーIDを取得
   */
  private async getUserId(username: string): Promise<string | null> {
    if (!this.bearerToken) return null;

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/users/by/username/${username.replace("@", "")}`,
        {
          headers: {
            Authorization: `Bearer ${this.bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.data?.id || null;
    } catch {
      return null;
    }
  }

  /**
   * 複数アカウントのタイムラインを一括取得
   */
  async getMultipleTimelines(
    usernames: string[],
    maxResults: number = 100
  ): Promise<Map<string, XApiTweet[]>> {
    const results = new Map<string, XApiTweet[]>();

    await Promise.all(
      usernames.map(async (username) => {
        const tweets = await this.getUserTimeline(username, maxResults);
        results.set(username, tweets);
      })
    );

    return results;
  }

  /**
   * キーワード検索（基本実装）
   */
  async searchTweets(
    query: string,
    maxResults: number = 100
  ): Promise<XApiTweet[]> {
    if (!this.bearerToken) {
      throw new Error("X_BEARER_TOKEN is not configured");
    }

    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(
        `${this.apiBaseUrl}/tweets/search/recent?query=${encodedQuery}&max_results=${maxResults}&tweet.fields=created_at,author_id`,
        {
          headers: {
            Authorization: `Bearer ${this.bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`X API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return (data.data || []).map((tweet: any) => ({
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at,
        author_id: tweet.author_id,
      }));
    } catch (error) {
      console.error("Error searching tweets:", error);
      return [];
    }
  }
}

// シングルトンインスタンス
export const xApiClient = new XApiClient();

/**
 * 環境変数から対象アカウントリストを取得
 */
export function getTargetAccounts(): string[] {
  const accountsEnv = process.env.TARGET_X_ACCOUNTS || "";
  const defaultAccounts = ["syukatsurisu", "InternGuide", "gaishishukatsu"];

  if (!accountsEnv) {
    return defaultAccounts;
  }

  return accountsEnv.split(",").map((a) => a.trim());
}
