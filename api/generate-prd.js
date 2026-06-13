export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not set in Vercel environment variables" });

  try {
    let body = req.body;
    if (typeof body === "string") body = JSON.parse(body);

    // ── Two-call strategy: Part 1 (sections 1-8) then Part 2 (sections 9-19) ──
    const { system, messages } = body;
    const userContent = messages?.[0]?.content || "";

    const PART1_SYSTEM = system + `

IMPORTANT: Generate ONLY sections 1 through 8. Stop after section 8. Do not generate sections 9-19.
Be thorough and detailed for each section. Use proper markdown tables.`;

    const PART2_SYSTEM = system + `

IMPORTANT: Generate ONLY sections 9 through 19. Start directly with ## 9. Assumptions & Dependencies.
Be thorough and detailed for each section. Use proper markdown tables.
Sections to generate:
9. Assumptions & Dependencies
10. Milestones & Phased Delivery
11. Personas and Usage Scenarios
12. Detailed Requirements Table (minimum 8 requirements)
13. Non-Functional Requirements
14. Migration Requirements
15. Release Readiness Requirements
16. Risks & Mitigation (minimum 5 risks)
17. Quantitative Insights
18. Out of Scope
19. Reference Links`;

    // Call 1 — sections 1-8
    const res1 = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 4000,
        system: PART1_SYSTEM,
        messages: [{ role: "user", content: userContent }],
      }),
    });

    const data1 = await res1.json();
    if (!res1.ok) {
      console.error("Part 1 error:", JSON.stringify(data1));
      return res.status(res1.status).json({ error: data1?.error?.message || "API error in Part 1" });
    }
    const part1 = (data1.content || []).map(b => b.text || "").join("");

    // Call 2 — sections 9-19
    const res2 = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 4000,
        system: PART2_SYSTEM,
        messages: [{ role: "user", content: userContent }],
      }),
    });

    const data2 = await res2.json();
    if (!res2.ok) {
      console.error("Part 2 error:", JSON.stringify(data2));
      return res.status(res2.status).json({ error: data2?.error?.message || "API error in Part 2" });
    }
    const part2 = (data2.content || []).map(b => b.text || "").join("");

    // Merge both parts into one complete PRD
    const fullPRD = part1.trim() + "\n\n" + part2.trim();

    // Return in same format as single-call so frontend works unchanged
    return res.status(200).json({
      content: [{ type: "text", text: fullPRD }]
    });

  } catch (error) {
    console.error("Handler error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
