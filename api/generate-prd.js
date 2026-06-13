export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not set in Vercel environment variables" });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch { return res.status(400).json({ error: "Invalid JSON body" }); }
    }

    const userContent = body?.messages?.[0]?.content || "";
    const baseSystem = body?.system || "";

    const callAnthropic = async (system, sections) => {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          max_tokens: 3000,
          system,
          messages: [{ role: "user", content: userContent }],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || `Anthropic API error ${response.status}`);
      }

      return (data.content || []).map(b => b.text || "").join("");
    };

    // Run both parts IN PARALLEL to cut time in half
    const [part1, part2] = await Promise.all([

      callAnthropic(
        baseSystem + `\n\nIMPORTANT: Generate ONLY sections 1 to 8. Stop after "## 8. Success KPIs". Be concise but complete. Use tables.`,
        "1-8"
      ),

      callAnthropic(
        baseSystem + `\n\nIMPORTANT: Generate ONLY sections 9 to 19. Start with "## 9. Assumptions & Dependencies". Include ALL of:
## 9. Assumptions & Dependencies
## 10. Milestones & Phased Delivery
## 11. Personas and Usage Scenarios
## 12. Detailed Requirements Table
## 13. Non-Functional Requirements
## 14. Migration Requirements
## 15. Release Readiness Requirements
## 16. Risks & Mitigation
## 17. Quantitative Insights
## 18. Out of Scope
## 19. Reference Links
Be concise but complete. Use tables.`,
        "9-19"
      ),
    ]);

    const fullPRD = part1.trim() + "\n\n---\n\n" + part2.trim();

    return res.status(200).json({
      content: [{ type: "text", text: fullPRD }]
    });

  } catch (error) {
    console.error("PRD generation error:", error.message);
    // Always return JSON — never plain text
    return res.status(500).json({ error: error.message || "Generation failed" });
  }
}
