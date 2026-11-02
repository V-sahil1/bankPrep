// Exercises the real SDK call with only the HTTP layer stubbed: no key or network needed.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { callGemini } from "@/services/ai-generation";

const context = { examName: "IBPS PO", subjectName: "Quant", topicName: "Percentage", difficulty: "EASY" as const, count: 1, avoid: ["Old question?"] };

function reply(text: string, finishReason = "STOP", extra: Record<string, unknown> = {}) {
  return new Response(
    JSON.stringify({ candidates: [{ content: { role: "model", parts: [{ text }] }, finishReason }], ...extra }),
    { headers: { "content-type": "application/json" } },
  );
}

let requests: { url: string; body: Record<string, unknown>; headers: Headers }[];

function stubFetch(response: () => Response) {
  vi.stubGlobal("fetch", async (url: string | URL, init: RequestInit) => {
    requests.push({ url: String(url), body: JSON.parse(String(init.body)), headers: new Headers(init.headers) });
    return response();
  });
}

beforeEach(() => {
  requests = [];
  process.env.GEMINI_API_KEY = "test-key";
  delete process.env.AI_MODEL;
});
afterEach(() => {
  vi.unstubAllGlobals();
  process.env.GEMINI_API_KEY = "";
});

describe("callGemini", () => {
  it("sends a well-formed structured-output request and returns the questions", async () => {
    const questions = [{ questionText: "What is 10% of 50?", options: ["1", "5", "10", "50"], correctIndex: 1, explanation: "One tenth of 50 is 5.", tags: ["percent"] }];
    stubFetch(() => reply(JSON.stringify({ questions })));

    const result = await callGemini(context);
    expect(result.raw).toEqual(questions);
    expect(result.model).toBe("gemini-2.5-flash");

    const [{ url, body, headers }] = requests;
    expect(url).toContain("models/gemini-2.5-flash:generateContent");
    expect(headers.get("x-goog-api-key")).toBe("test-key");
    // The key belongs in a header, never in a URL that could reach logs.
    expect(url).not.toContain("test-key");

    const config = body.generationConfig as { responseMimeType: string; responseJsonSchema: Record<string, unknown> };
    expect(config.responseMimeType).toBe("application/json");
    expect(config.responseJsonSchema).not.toHaveProperty("$schema");
    expect(config.responseJsonSchema.properties).toHaveProperty("questions");

    const prompt = JSON.stringify(body.contents);
    expect(prompt).toContain("Percentage");
    expect(prompt).toContain("Old question?");
    expect(JSON.stringify(body.systemInstruction)).toMatch(/never say or imply that a question appeared in a past paper/);
  });

  it("uses the model named in AI_MODEL", async () => {
    process.env.AI_MODEL = "gemini-2.5-pro";
    stubFetch(() => reply(JSON.stringify({ questions: [] })));
    expect((await callGemini(context)).model).toBe("gemini-2.5-pro");
    expect(requests[0].url).toContain("models/gemini-2.5-pro:generateContent");
  });

  it("explains a safety block and a truncated response instead of parsing them", async () => {
    stubFetch(() => reply("", "SAFETY"));
    await expect(callGemini(context)).rejects.toThrow(/declined/);
    stubFetch(() => reply('{"questions":[', "MAX_TOKENS"));
    await expect(callGemini(context)).rejects.toThrow(/cut off/);
    stubFetch(() => new Response(JSON.stringify({ promptFeedback: { blockReason: "SAFETY" } }), { headers: { "content-type": "application/json" } }));
    await expect(callGemini(context)).rejects.toThrow(/declined/);
  });

  it("rejects JSON that does not match the schema", async () => {
    stubFetch(() => reply(JSON.stringify({ nope: true })));
    await expect(callGemini(context)).rejects.toThrow(/expected format/);
  });
});
