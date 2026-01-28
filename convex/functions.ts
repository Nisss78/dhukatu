import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

// === 企業関連 ===

// 企業一覧取得
export const getCompanies = query({
  args: {
    industry: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let companiesQuery = ctx.db.query("companies");

    if (args.industry) {
      // industryでのフィルタリングはインデックスがないので全件取得後フィルタ
      const all = await companiesQuery.collect();
      return all.filter((c) => c.industry === args.industry);
    }

    if (args.limit) {
      const all = await companiesQuery.collect();
      return all.slice(0, args.limit);
    }

    return companiesQuery.collect();
  },
});

// 企業詳細取得
export const getCompany = query({
  args: { id: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// 企業作成/更新
export const upsertCompany = mutation({
  args: {
    name: v.string(),
    industry: v.optional(v.string()),
    website: v.optional(v.string()),
    logo_url: v.optional(v.string()),
    description: v.optional(v.string()),
    locations: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // 既存企業を名前で検索
    const existing = await ctx.db
      .query("companies")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (existing) {
      // 更新
      await ctx.db.patch(existing._id, {
        industry: args.industry,
        website: args.website,
        logo_url: args.logo_url,
        description: args.description,
        locations: args.locations,
      });
      return existing._id;
    }

    // 新規作成
    const companyId = await ctx.db.insert("companies", {
      ...args,
      created_at: Date.now(),
    });
    return companyId;
  },
});

// === 締切関連 ===

// 締切一覧取得
export const getDeadlines = query({
  args: {
    type: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let deadlinesQuery = ctx.db.query("deadlines");

    const deadlines = await deadlinesQuery.collect();

    let filtered = deadlines;

    // フィルタリング
    if (args.type) {
      filtered = filtered.filter((d) => d.type === args.type);
    }
    if (args.startDate) {
      filtered = filtered.filter((d) => d.deadline_date >= args.startDate);
    }
    if (args.endDate) {
      filtered = filtered.filter((d) => d.deadline_date <= args.endDate);
    }

    // 締切日順にソート
    filtered.sort((a, b) => a.deadline_date.localeCompare(b.deadline_date));

    if (args.limit) {
      return filtered.slice(0, args.limit);
    }

    return filtered;
  },
});

// 企業の締切取得
export const getCompanyDeadlines = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const deadlines = await ctx.db
      .query("deadlines")
      .withIndex("by_company", (q) => q.eq("company_id", args.companyId))
      .collect();

    return deadlines.sort((a, b) => a.deadline_date.localeCompare(b.deadline_date));
  },
});

// 締切作成
export const createDeadline = mutation({
  args: {
    company_id: v.id("companies"),
    company_name: v.string(),
    type: v.string(),
    deadline_date: v.string(),
    description: v.optional(v.string()),
    link: v.optional(v.string()),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    const deadlineId = await ctx.db.insert("deadlines", {
      ...args,
      created_at: Date.now(),
    });
    return deadlineId;
  },
});

// 締切削除
export const deleteDeadline = mutation({
  args: { id: v.id("deadlines") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// === テストセンター関連 ===

// テストセンター一覧取得
export const getTestCenters = query({
  args: {
    companyId: v.optional(v.id("companies")),
  },
  handler: async (ctx, args) => {
    if (args.companyId) {
      return await ctx.db
        .query("test_centers")
        .withIndex("by_company", (q) => q.eq("company_id", args.companyId))
        .collect();
    }
    return ctx.db.query("test_centers").collect();
  },
});

// テストセンター作成
export const createTestCenter = mutation({
  args: {
    company_id: v.id("companies"),
    company_name: v.string(),
    type: v.string(),
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const testCenterId = await ctx.db.insert("test_centers", {
      ...args,
      created_at: Date.now(),
    });
    return testCenterId;
  },
});
