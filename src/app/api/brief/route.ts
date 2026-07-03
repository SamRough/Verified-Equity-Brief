import { NextRequest, NextResponse } from "next/server";
import { generateBrief } from "@/lib/research";
import type { BriefLanguage, TimeRange } from "@/lib/types";

const ranges = new Set<TimeRange>(["today", "week", "last7", "last30"]);
const languages = new Set<BriefLanguage>(["en", "zh"]);

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { query?: unknown; range?: unknown; language?: unknown };
    const query = typeof body.query === "string" && body.query.trim() ? body.query.trim() : "Tencent";
    const range = ranges.has(body.range as TimeRange) ? (body.range as TimeRange) : "last7";
    const language = languages.has(body.language as BriefLanguage) ? (body.language as BriefLanguage) : "en";
    const brief = await generateBrief(query, range, language);

    return NextResponse.json(brief);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate brief.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
