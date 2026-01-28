import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 企業テーブル
  companies: defineTable({
    name: v.string(),
    industry: v.optional(v.string()),
    website: v.optional(v.string()),
    logo_url: v.optional(v.string()),
    description: v.optional(v.string()),
    locations: v.optional(v.array(v.string())),
    created_at: v.number(),
  })
    .index("by_name", ["name"])
    .index("by_industry", ["industry"]),

  // 締切テーブル
  deadlines: defineTable({
    company_id: v.id("companies"),
    company_name: v.string(), // 検索用に非正規化
    type: v.string(), // "es" | "honsenkou" | "test_center" | "internship"
    deadline_date: v.string(), // ISO 8601 format
    description: v.optional(v.string()),
    link: v.optional(v.string()),
    source: v.string(), // データソース (@syukatsurisu, @InternGuide, etc.)
    created_at: v.number(),
  })
    .index("by_deadline", ["deadline_date"])
    .index("by_type", ["type"])
    .index("by_company", ["company_id"]),

  // テストセンターテーブル
  test_centers: defineTable({
    company_id: v.id("companies"),
    company_name: v.string(), // 検索用に非正規化
    type: v.string(), // "web" | "venue"
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
    created_at: v.number(),
  })
    .index("by_company", ["company_id"])
    .index("by_type", ["type"]),
});
