import { useState, useRef, useEffect, useCallback } from "react";

// ─── Dynamic script loader (for jsPDF + docx CDN) ────────────────────────────
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ─── Brand tokens ────────────────────────────────────────────────────────────
const CW_BLUE  = "#003087";
const CW_RED   = "#E4002B";
const CW_LIGHT = "#f4f6fb";

// ─── ConnectWise Logo ────────────────────────────────────────────────────────
function CWLogo() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:0, flexShrink:0 }}>
      <svg width="58" height="52" viewBox="0 0 80 52" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink:0 }}>
        <path d="M22 5 C6 5 1 16 3 28 C5 35 9 40 14 43" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path d="M54 5 C70 5 75 16 73 28 C71 35 67 40 62 43" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path d="M22 5 C22 17 30 27 38 34" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path d="M54 5 C54 17 46 27 38 34" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path d="M29 24 L38 38 L47 24" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
      <div style={{ width:1, height:36, background:"rgba(255,255,255,0.25)", margin:"0 14px", flexShrink:0 }} />
      <span style={{ color:"white", fontFamily:"Arial, Helvetica, sans-serif", fontWeight:"700", fontSize:"18px", letterSpacing:"2px", whiteSpace:"nowrap", lineHeight:1 }}>
        CONNECTWISE<sup style={{ fontSize:"9px", letterSpacing:0, verticalAlign:"super", marginLeft:1 }}>®</sup>
      </span>
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PRODUCTS = [
  "Cybersecurity / MDR",
  "Cybersecurity / SIEM",
  "Cybersecurity / EDR",
  "Cybersecurity / AI SOC",
  "Cybersecurity / Vulnerability Management",
  "RMM",
  "PSA / ConnectWise Manage",
  "Other",
];

const SECTIONS = [
  "Executive Summary","PRD Summary Table","Objectives & Outcomes","Scope",
  "Partner Segmentation","Feature Comparison","Feature Gaps & Pain Points",
  "Success KPIs","Assumptions & Dependencies","Milestones & Phased Delivery",
  "Personas & Usage Scenarios","Detailed Requirements Table",
  "Non-Functional Requirements","Migration Requirements","Release Readiness",
  "Risks & Mitigation","Quantitative Insights","Out of Scope","Reference Links",
];

// ─── Prompts ──────────────────────────────────────────────────────────────────
const buildSystemPrompt = (pmName, product) => `You are a senior Product Manager at ConnectWise. ConnectWise serves MSPs (Managed Service Providers), MSSPs (Managed Security Service Providers), and TSPs (Technology Service Providers) — called "partners" — who use ConnectWise products to serve their end clients.

ConnectWise core products: RMM, PSA (ConnectWise Manage), Cybersecurity suite (MDR, SIEM, EDR, AI SOC, Vulnerability Management).

Generate a thorough, professional PRD in clean Markdown covering ALL 19 sections. Be specific, use tables where appropriate, infer reasonable assumptions (flag with [ASSUMPTION]), write from the perspective of a ConnectWise PM.

---

# PRD: [Derive a crisp title from the requirement]

**Document Version:** 1.0
**Date:** ${new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}
**Author:** ${pmName || "ConnectWise Product Management"}
**Product Area:** ${product}
**Status:** Draft

---

## 1. Executive Summary
3–5 sentences: what is being built, why it matters to ConnectWise partners, expected business impact.

---

## 2. PRD Summary Table

| Field | Details |
|---|---|
| Product Area | |
| Feature Name | |
| Priority | High / Medium / Low |
| Target Release | |
| PM Owner | |
| Engineering Team | |
| Key Stakeholders | |
| Partner Segments Affected | MSP / MSSP / TSP |
| Effort Estimate (Story Points) | |
| Business Value | |

---

## 3. Objectives & Outcomes

### Business Objectives
- (3–5 measurable objectives)

### Desired Outcomes
- (outcomes for partners and end clients)

### Why Now?
Explain urgency or strategic timing.

---

## 4. Scope

### In Scope
- List items explicitly included

### Out of Scope
- List items explicitly excluded (cross-ref Section 18)

---

## 5. Partner Segmentation

| Partner Type | Description | Key Need | Impact Level |
|---|---|---|---|
| MSP | | | |
| MSSP | | | |
| TSP | | | |

---

## 6. Feature Comparison Across Products

| Feature / Capability | Current State | Proposed State | Competitor Benchmark |
|---|---|---|---|

---

## 7. Feature Gaps and Pain Points

### Feature Gaps
- (current capability gaps)

### Migration Challenges
- (data, workflow, onboarding challenges)

### Display Issues
- (UI/UX issues in current state)

### Data Integrity Concerns
- (risks around data accuracy or loss)

---

## 8. Success KPIs

| KPI | Baseline | Target | Measurement Method |
|---|---|---|---|

---

## 9. Assumptions & Dependencies

### Assumptions
- (list all assumptions, prefix each with [ASSUMPTION])

### Dependencies
| Dependency | Type | Team / System | Risk if Delayed |
|---|---|---|---|

---

## 10. Milestones & Phased Delivery

| Phase | Milestone | Description | Target Date | Owner |
|---|---|---|---|---|
| Phase 1 | Alpha | | | |
| Phase 2 | Beta / Limited Availability | | | |
| Phase 3 | General Availability | | | |

---

## 11. Personas and Usage Scenarios

### Primary Persona
**Name:** **Role:** **Goals:** **Pain Points:**

### Other Personas
(2–3 additional personas briefly)

### Key Scenarios
- Scenario 1:
- Scenario 2:

### Step-by-Step Examples
(At least one end-to-end numbered walkthrough)

---

## 12. Detailed Requirements Table

| ID | Requirement | Priority | User Story | Acceptance Criteria | Notes |
|---|---|---|---|---|---|
| REQ-001 | | Must Have | As a [persona], I want... | | |

(Generate at least 8 requirements)

---

## 13. Non-Functional Requirements

| Category | Requirement | Target |
|---|---|---|
| Performance | | |
| Scalability | | |
| Security | | |
| Availability / SLA | | |
| Compliance | SOC 2 / GDPR / HIPAA | |
| Usability | | |
| Localization | | |

---

## 14. Migration Requirements
Data migration, partner migration, rollback strategy.

---

## 15. Release Readiness Requirements

### Enablement Requirements by Team

| Team | Requirements | Owner | Due Date |
|---|---|---|---|
| Sales | | | |
| Customer Success | | | |
| Support | | | |
| Marketing | | | |
| Engineering / QA | | | |
| Legal / Compliance | | | |

---

## 16. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation Strategy | Owner |
|---|---|---|---|---|

(At least 5 risks)

---

## 17. Quantitative Insights
Market size, partner count affected, potential ARR impact, support ticket volumes. Label estimates clearly.

---

## 18. Out of Scope
Items explicitly excluded with rationale.

---

## 19. Reference Links

| Resource | Link / Description |
|---|---|
| ConnectWise Product Docs | https://docs.connectwise.com |
| Internal Confluence | [Internal link] |
| Competitor Analysis | [To be added] |
| Customer Research | [To be added] |

---
*End of PRD — Generated by ConnectWise PRD Generator*`;

const ENHANCE_SYSTEM = `You are a ConnectWise product manager assistant. Take a brief requirement and expand it into a richer brief (150–250 words) that will produce a higher-quality PRD. Add context about MSP/MSSP/TSP partner impact, business value, pain points, and scale. Return only the enhanced brief, no preamble or labels.`;

// ─── API helper ───────────────────────────────────────────────────────────────
const API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY || "";

async function callClaude({ system, userMsg, stream = false, onChunk }) {
  const res = await fetch("/api/generate-prd", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 4000,
      stream,
      system,
      messages: [{ role: "user", content: userMsg }],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${res.status}`);
  }
  if (!stream) {
    const data = await res.json();
    return data.content?.map(b => b.text || "").join("") || "";
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let acc = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const line of dec.decode(value).split("\n")) {
      if (!line.startsWith("data: ")) continue;
      const d = line.slice(6).trim();
      if (d === "[DONE]") break;
      try {
        const p = JSON.parse(d);
        if (p.type === "content_block_delta" && p.delta?.text) {
          acc += p.delta.text;
          onChunk?.(acc);
        }
      } catch {}
    }
  }
  return acc;
}

// ─── Markdown renderer ────────────────────────────────────────────────────────
function MDRenderer({ content }) {
  const renderInline = (text) =>
    text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[([^\]]+)\]\(([^)]+)\))/g).map((p, i) => {
      if (/^\*\*(.+)\*\*$/.test(p)) return <strong key={i}>{p.replace(/\*\*/g, "")}</strong>;
      if (/^`(.+)`$/.test(p)) return <code key={i} style={{ background:"#f0f4ff", padding:"1px 5px", borderRadius:3, fontSize:12, color:CW_BLUE }}>{p.replace(/`/g, "")}</code>;
      const link = p.match(/^\[(.+)\]\((.+)\)$/);
      if (link) return <a key={i} href={link[2]} target="_blank" rel="noreferrer" style={{ color:CW_BLUE }}>{link[1]}</a>;
      return p;
    });

  const lines = content.split("\n");
  const els = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^# /.test(line))   { els.push(<h1 key={i} style={{ fontSize:22, fontWeight:800, color:CW_BLUE, margin:"22px 0 8px", fontFamily:"Georgia,serif", borderBottom:`3px solid ${CW_RED}`, paddingBottom:6 }}>{line.slice(2)}</h1>); i++; continue; }
    if (/^## /.test(line))  { els.push(<h2 key={i} style={{ fontSize:16, fontWeight:700, color:CW_BLUE, margin:"22px 0 6px", borderLeft:`4px solid ${CW_RED}`, paddingLeft:10 }}>{line.slice(3)}</h2>); i++; continue; }
    if (/^### /.test(line)) { els.push(<h3 key={i} style={{ fontSize:14, fontWeight:700, color:"#333", margin:"14px 0 4px" }}>{line.slice(4)}</h3>); i++; continue; }
    if (/^---/.test(line))  { els.push(<hr key={i} style={{ border:"none", borderTop:"1px solid #e8ecf4", margin:"10px 0" }} />); i++; continue; }
    if (/^\| /.test(line) && i+1 < lines.length && /^\|[-| :]+\|/.test(lines[i+1])) {
      const tLines = [];
      while (i < lines.length && /^\|/.test(lines[i])) { tLines.push(lines[i]); i++; }
      const headers = tLines[0].split("|").slice(1,-1).map(c => c.trim());
      const rows = tLines.slice(2).map(r => r.split("|").slice(1,-1).map(c => c.trim())).filter(r => r.length && !r.every(c => /^[-:]+$/.test(c)));
      els.push(
        <div key={`t${i}`} style={{ overflowX:"auto", margin:"10px 0 14px" }}>
          <table style={{ borderCollapse:"collapse", width:"100%", fontSize:12.5 }}>
            <thead><tr style={{ background:CW_BLUE }}>{headers.map((h,hi)=><th key={hi} style={{ padding:"8px 12px", color:"white", textAlign:"left", whiteSpace:"nowrap", fontWeight:600 }}>{h}</th>)}</tr></thead>
            <tbody>{rows.map((row,ri)=><tr key={ri} style={{ background:ri%2===0?"#f8f9fd":"white" }}>{row.map((cell,ci)=><td key={ci} style={{ padding:"7px 12px", borderBottom:"1px solid #e8ecf4", verticalAlign:"top", lineHeight:1.5 }}>{renderInline(cell)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
      continue;
    }
    if (/^[-*] /.test(line))  { els.push(<li key={i} style={{ marginLeft:20, marginBottom:3, fontSize:13, lineHeight:1.6 }}>{renderInline(line.replace(/^[-*] /,""))}</li>); i++; continue; }
    if (/^\d+\. /.test(line)) { els.push(<li key={i} style={{ marginLeft:20, marginBottom:3, fontSize:13, lineHeight:1.6, listStyleType:"decimal" }}>{renderInline(line.replace(/^\d+\. /,""))}</li>); i++; continue; }
    if (line.trim()==="")     { els.push(<div key={i} style={{ height:5 }} />); i++; continue; }
    els.push(<p key={i} style={{ fontSize:13, margin:"3px 0", lineHeight:1.7, color:"#333" }}>{renderInline(line)}</p>);
    i++;
  }
  return <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", color:"#333" }}>{els}</div>;
}

// ─── Chip badge ───────────────────────────────────────────────────────────────
function Chip({ label, color = CW_BLUE }) {
  return (
    <span style={{ background:`${color}18`, color, border:`1px solid ${color}30`, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>
      {label}
    </span>
  );
}

// ─── Voice Button ─────────────────────────────────────────────────────────────
function VoiceButton({ onTranscript, disabled }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [error, setError] = useState("");
  const recogRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }
    const r = new SR();
    r.continuous = true; r.interimResults = true; r.lang = "en-US";
    let finalTranscript = "";
    r.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalTranscript += e.results[i][0].transcript + " ";
        else interim += e.results[i][0].transcript;
      }
      onTranscript(finalTranscript + interim, false);
    };
    r.onend = () => { setListening(false); onTranscript(finalTranscript.trim(), true); finalTranscript = ""; };
    r.onerror = (e) => { setListening(false); setError(e.error === "not-allowed" ? "Microphone access denied." : "Voice error."); setTimeout(() => setError(""), 3000); };
    recogRef.current = r;
  }, [onTranscript]);

  const toggle = () => {
    if (!supported) return;
    if (listening) { recogRef.current?.stop(); setListening(false); }
    else { recogRef.current?.start(); setListening(true); setError(""); }
  };

  if (!supported) return null;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:3 }}>
      <button onClick={toggle} disabled={disabled} title={listening ? "Stop recording" : "Speak your requirement"}
        style={{ width:40, height:40, borderRadius:"50%", border:"none", cursor:disabled?"not-allowed":"pointer", background:listening?CW_RED:`${CW_BLUE}15`, color:listening?"white":CW_BLUE, fontSize:17, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", boxShadow:listening?`0 0 0 4px ${CW_RED}30,0 0 0 8px ${CW_RED}15`:"none", animation:listening?"micPulse 1.2s ease-in-out infinite":"none", flexShrink:0 }}>
        {listening ? "⏹" : "🎤"}
      </button>
      {error && <span style={{ fontSize:11, color:CW_RED }}>{error}</span>}
    </div>
  );
}

// ─── Doc format icons ─────────────────────────────────────────────────────────
function WordIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4a2 2 0 012-2h8l6 6v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" stroke="white" strokeWidth="1.5" fill="none"/>
      <path d="M12 2v6h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 13l1.5 4 1.5-4 1.5 4L12 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function PdfIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4a2 2 0 012-2h8l6 6v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" stroke="white" strokeWidth="1.5" fill="none"/>
      <path d="M12 2v6h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <text x="4" y="20" fontFamily="Arial" fontWeight="bold" fontSize="7" fill="white">PDF</text>
    </svg>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]                   = useState("input");
  const [input, setInput]               = useState("");
  const [voiceInterim, setVoiceInterim] = useState("");
  const [pmName, setPmName]             = useState("");
  const [product, setProduct]           = useState(PRODUCTS[0]);
  const [priority, setPriority]         = useState("High");
  const [prdText, setPrdText]           = useState("");
  const [streaming, setStreaming]       = useState(false);
  const [enhancing, setEnhancing]       = useState(false);
  const [error, setError]               = useState("");
  const [history, setHistory]           = useState(() => {
    try { return JSON.parse(localStorage.getItem("cw_prd_history") || "[]"); } catch { return []; }
  });
  const [viewingHist, setViewingHist]   = useState(null);
  const [copied, setCopied]             = useState("");
  const [downloading, setDownloading]   = useState("");
  const outputRef                       = useRef(null);

  useEffect(() => {
    try { localStorage.setItem("cw_prd_history", JSON.stringify(history.slice(0,20))); } catch {}
  }, [history]);

  const completedSections = SECTIONS.filter((_, idx) => {
    const n = idx + 1;
    return prdText.includes(`## ${n}.`) || prdText.includes(`\n## ${n} `);
  }).length;

  const handleVoiceTranscript = useCallback((text, isFinal) => {
    if (isFinal) { setInput(t => (t + " " + text).trim()); setVoiceInterim(""); }
    else setVoiceInterim(text);
  }, []);

  // ── Generate PRD ────────────────────────────────────────────────────────────
  const generatePRD = useCallback(async () => {
    if (!input.trim()) { setError("Please describe your requirement."); return; }
    setError(""); setPrdText(""); setStreaming(true); setTab("output");
    try {
      await callClaude({
        system: buildSystemPrompt(pmName, product),
        userMsg: `Generate a complete ConnectWise PRD covering all 19 sections.\n\nProduct Area: ${product}\nPriority: ${priority}\nPM: ${pmName || "ConnectWise Product Management"}\n\nRequirement:\n${input}`,
        stream: true,
        onChunk: (text) => {
          setPrdText(text);
          if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
        },
      });
      setPrdText(prev => {
        const title = prev.match(/^# PRD: (.+)/m)?.[1] || `PRD — ${product}`;
        const entry = {
          id: Date.now(),
          title,
          product,
          priority,
          pmName,
          date: new Date().toLocaleDateString(),
          text: prev,
          prd: prev,
        };
        setHistory(h => [entry, ...h.slice(0, 19)]);
        return prev;
      });
    } catch (e) {
      setError(e.message || "Generation failed. Check your API key and try again.");
      setTab("input");
    } finally { setStreaming(false); }
  }, [input, pmName, product, priority]);

  // ── Enhance prompt ──────────────────────────────────────────────────────────
  const enhancePrompt = useCallback(async () => {
    if (!input.trim()) { setError("Write a brief requirement first."); return; }
    setEnhancing(true);
    try {
      const enhanced = await callClaude({ system: ENHANCE_SYSTEM, userMsg: `Product: ${product}\n\n${input}` });
      if (enhanced) setInput(enhanced);
    } catch (e) { setError(e.message || "Enhancement failed."); }
    setEnhancing(false);
  }, [input, product]);

  const doCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  // ── Download DOCX ───────────────────────────────────────────────────────────
  const downloadDocx = useCallback(async (mdText) => {
    if (!mdText) return;
    setDownloading("docx");
    try {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/docx/8.5.0/docx.umd.min.js");
      const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType, LevelFormat, PageNumber, Footer } = window.docx;
      const CW_BLUE_HEX = "003087"; const CW_RED_HEX = "E4002B";
      const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
      const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
      const parseInline = (text) => {
        const runs = [];
        for (const p of text.split(/(\*\*[^*]+\*\*)/g)) {
          if (/^\*\*(.+)\*\*$/.test(p)) runs.push(new TextRun({ text: p.replace(/\*\*/g,""), bold:true, font:"Arial" }));
          else if (p) runs.push(new TextRun({ text: p.replace(/`/g,""), font:"Arial" }));
        }
        return runs.length ? runs : [new TextRun({ text:"", font:"Arial" })];
      };
      const makeHeaderRow = (cells, colWidths) => new TableRow({ tableHeader:true, children: cells.map((c,i) => new TableCell({ borders:cellBorders, shading:{ fill:CW_BLUE_HEX, type:ShadingType.CLEAR }, width:{ size:colWidths[i]||2000, type:WidthType.DXA }, margins:{ top:80,bottom:80,left:120,right:120 }, children:[new Paragraph({ children:[new TextRun({ text:c, bold:true, color:"FFFFFF", font:"Arial", size:20 })] })] })) });
      const makeDataRow = (cells, colWidths, isEven) => new TableRow({ children: cells.map((c,i) => new TableCell({ borders:cellBorders, shading:{ fill:isEven?"F8F9FD":"FFFFFF", type:ShadingType.CLEAR }, width:{ size:colWidths[i]||2000, type:WidthType.DXA }, margins:{ top:80,bottom:80,left:120,right:120 }, children:[new Paragraph({ children:parseInline(c) })] })) });
      const children = [];
      const lines = mdText.split("\n");
      let i = 0;
      while (i < lines.length) {
        const line = lines[i];
        if (/^# /.test(line))  { children.push(new Paragraph({ heading:HeadingLevel.HEADING_1, children:[new TextRun({ text:line.slice(2), bold:true, color:CW_BLUE_HEX, font:"Arial", size:40 })], spacing:{ before:360, after:200 } })); i++; continue; }
        if (/^## /.test(line)) { children.push(new Paragraph({ heading:HeadingLevel.HEADING_2, children:[new TextRun({ text:line.slice(3), bold:true, color:CW_BLUE_HEX, font:"Arial", size:28 })], spacing:{ before:300, after:140 } })); i++; continue; }
        if (/^### /.test(line)){ children.push(new Paragraph({ heading:HeadingLevel.HEADING_3, children:[new TextRun({ text:line.slice(4), bold:true, font:"Arial", size:24 })], spacing:{ before:220, after:100 } })); i++; continue; }
        if (/^---/.test(line)) { children.push(new Paragraph({ children:[new TextRun("")], border:{ bottom:{ style:BorderStyle.SINGLE, size:2, color:"E8ECF4", space:1 } }, spacing:{ before:80, after:80 } })); i++; continue; }
        if (/^\| /.test(line) && i+1 < lines.length && /^\|[-| :]+\|/.test(lines[i+1])) {
          const tLines = [];
          while (i < lines.length && /^\|/.test(lines[i])) { tLines.push(lines[i]); i++; }
          const headers = tLines[0].split("|").slice(1,-1).map(c=>c.trim());
          const rows = tLines.slice(2).map(r=>r.split("|").slice(1,-1).map(c=>c.trim())).filter(r=>r.length&&!r.every(c=>/^[-:]+$/.test(c)));
          const totalWidth = 9360; const colW = Math.floor(totalWidth/headers.length);
          const colWidths = headers.map((_,ci) => ci===headers.length-1 ? totalWidth-colW*(headers.length-1) : colW);
          children.push(new Table({ width:{ size:totalWidth, type:WidthType.DXA }, columnWidths:colWidths, rows:[makeHeaderRow(headers,colWidths), ...rows.map((r,ri)=>makeDataRow(r,colWidths,ri%2===0))] }));
          children.push(new Paragraph({ children:[new TextRun("")], spacing:{ after:120 } }));
          continue;
        }
        if (/^[-*] /.test(line))  { children.push(new Paragraph({ numbering:{ reference:"bullets", level:0 }, children:parseInline(line.replace(/^[-*] /,"")), spacing:{ after:60 } })); i++; continue; }
        if (/^\d+\. /.test(line)) { children.push(new Paragraph({ numbering:{ reference:"numbers", level:0 }, children:parseInline(line.replace(/^\d+\. /,"")), spacing:{ after:60 } })); i++; continue; }
        if (!line.trim()) { children.push(new Paragraph({ children:[new TextRun("")], spacing:{ after:60 } })); i++; continue; }
        children.push(new Paragraph({ children:parseInline(line), spacing:{ after:80 } }));
        i++;
      }
      const title = mdText.match(/^# PRD: (.+)/m)?.[1] || "ConnectWise PRD";
      const doc = new Document({
        title,
        numbering: { config: [
          { reference:"bullets", levels:[{ level:0, format:LevelFormat.BULLET, text:"•", alignment:AlignmentType.LEFT, style:{ paragraph:{ indent:{ left:720, hanging:360 } } } }] },
          { reference:"numbers", levels:[{ level:0, format:LevelFormat.DECIMAL, text:"%1.", alignment:AlignmentType.LEFT, style:{ paragraph:{ indent:{ left:720, hanging:360 } } } }] },
        ]},
        styles: { default:{ document:{ run:{ font:"Arial", size:24 } } } },
        sections: [{ properties:{ page:{ size:{ width:12240, height:15840 }, margin:{ top:1440, right:1440, bottom:1440, left:1440 } } },
          footers: { default: new Footer({ children:[new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({ text:"ConnectWise PRD Generator  |  Page ", font:"Arial", size:18, color:"888888" }), new TextRun({ children:[PageNumber.CURRENT], font:"Arial", size:18, color:"888888" }), new TextRun({ text:" of ", font:"Arial", size:18, color:"888888" }), new TextRun({ children:[PageNumber.TOTAL_PAGES], font:"Arial", size:18, color:"888888" })] })] }) },
          children }],
      });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `${title.replace(/[^a-z0-9]/gi,"_")}.docx`; a.click();
      URL.revokeObjectURL(url);
    } catch (e) { console.error("DOCX error:", e); alert("DOCX export failed: " + e.message); }
    setDownloading("");
  }, []);

  // ── Download PDF ────────────────────────────────────────────────────────────
  const downloadPdf = useCallback(async (mdText) => {
    if (!mdText || !outputRef.current) return;
    setDownloading("pdf");
    try {
      await Promise.all([
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"),
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"),
      ]);
      const { jsPDF } = window.jspdf;
      const source = outputRef.current;
      const clone = source.cloneNode(true);
      clone.style.cssText = "position:fixed;top:0;left:0;width:900px;padding:40px;background:white;z-index:-9999;overflow:visible;max-height:none;font-family:'Segoe UI',Arial,sans-serif;";
      document.body.appendChild(clone);
      const canvas = await window.html2canvas(clone, { scale:2, useCORS:true, logging:false, backgroundColor:"#ffffff", width:900, windowWidth:900 });
      document.body.removeChild(clone);
      const pdf = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const margin = 10; const usableW = pdfW - margin * 2;
      const imgH = (canvas.height / canvas.width) * usableW;
      let remaining = imgH;
      while (remaining > 0) {
        const pageH = Math.min(pdfH - margin * 2, remaining);
        const srcY = (imgH - remaining) / imgH * canvas.height;
        const srcH = pageH / imgH * canvas.height;
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width; pageCanvas.height = srcH;
        pageCanvas.getContext("2d").drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
        pdf.addImage(pageCanvas.toDataURL("image/jpeg", 0.92), "JPEG", margin, margin, usableW, pageH);
        remaining -= pageH;
        if (remaining > 0) pdf.addPage();
      }
      const title = mdText.match(/^# PRD: (.+)/m)?.[1] || "ConnectWise_PRD";
      pdf.save(`${title.replace(/[^a-z0-9]/gi,"_")}.pdf`);
    } catch (e) { console.error("PDF error:", e); alert("PDF export failed: " + e.message); }
    setDownloading("");
  }, []);

  const wordCount = input.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div style={{ minHeight:"100vh", background:CW_LIGHT, fontFamily:"'Segoe UI',system-ui,sans-serif" }}>

      {/* ── Header ── */}
      <header style={{ background:`linear-gradient(135deg,${CW_BLUE} 0%,#00215e 100%)`, height:58, display:"flex", alignItems:"center", padding:"0 28px", boxShadow:"0 2px 16px rgba(0,0,80,.35)", position:"sticky", top:0, zIndex:100 }}>
        <CWLogo />
        <div style={{ width:1, height:28, background:"rgba(255,255,255,.18)", margin:"0 18px" }} />
        <span style={{ color:"rgba(255,255,255,.75)", fontSize:13, fontWeight:500, letterSpacing:.3 }}>PRD Generator · Product Management</span>
        <div style={{ marginLeft:"auto", display:"flex", gap:10, alignItems:"center" }}>
          {history.length > 0 && (
            <button onClick={()=>setTab("history")} style={{ background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.22)", color:"white", padding:"6px 14px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600 }}>
              📚 History ({history.length})
            </button>
          )}
        </div>
      </header>

      <div style={{ maxWidth:1160, margin:"0 auto", padding:"24px 20px" }}>

        {/* ── Tabs ── */}
        <div style={{ display:"flex", gap:4, marginBottom:22, background:"white", borderRadius:10, padding:4, width:"fit-content", boxShadow:"0 1px 4px rgba(0,0,0,.08)" }}>
          {[
            { id:"input",   label:"📝 Input" },
            { id:"output",  label:`📄 PRD${prdText ? ` · ${completedSections}/19` : ""}` },
            { id:"history", label:`📚 History${history.length ? ` (${history.length})` : ""}` },
          ].map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ padding:"8px 22px", border:"none", cursor:"pointer", borderRadius:8, fontWeight:600, fontSize:13, background:tab===t.id?CW_BLUE:"transparent", color:tab===t.id?"white":"#666", transition:"all .18s" }}>{t.label}</button>
          ))}
        </div>

        {/* ══ INPUT TAB ══ */}
        {tab === "input" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 310px", gap:20, alignItems:"start" }}>
            <div style={{ background:"white", borderRadius:14, padding:28, boxShadow:"0 1px 8px rgba(0,0,0,.08)" }}>
              <h2 style={{ margin:"0 0 4px", color:CW_BLUE, fontSize:19, fontWeight:800 }}>New PRD</h2>
              <p style={{ margin:"0 0 22px", color:"#888", fontSize:13 }}>Describe your requirement — or <strong>speak it</strong> using the mic.</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
                <label style={{ display:"flex", flexDirection:"column", gap:5 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:"#555", textTransform:"uppercase", letterSpacing:.6 }}>Product Area *</span>
                  <select value={product} onChange={e=>setProduct(e.target.value)} style={{ padding:"9px 11px", border:"1.5px solid #dde3f0", borderRadius:8, fontSize:13, background:"white", outline:"none" }}>
                    {PRODUCTS.map(p=><option key={p}>{p}</option>)}
                  </select>
                </label>
                <label style={{ display:"flex", flexDirection:"column", gap:5 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:"#555", textTransform:"uppercase", letterSpacing:.6 }}>Priority</span>
                  <select value={priority} onChange={e=>setPriority(e.target.value)} style={{ padding:"9px 11px", border:"1.5px solid #dde3f0", borderRadius:8, fontSize:13, background:"white", outline:"none" }}>
                    {["High","Medium","Low"].map(p=><option key={p}>{p}</option>)}
                  </select>
                </label>
              </div>
              <label style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:16 }}>
                <span style={{ fontSize:11, fontWeight:700, color:"#555", textTransform:"uppercase", letterSpacing:.6 }}>PM Name (optional)</span>
                <input value={pmName} onChange={e=>setPmName(e.target.value)} placeholder="e.g. Jane Smith" style={{ padding:"9px 11px", border:"1.5px solid #dde3f0", borderRadius:8, fontSize:13, outline:"none" }} />
              </label>
              <div style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:"#555", textTransform:"uppercase", letterSpacing:.6 }}>Requirement Description *</span>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:11, color:wordCount>20?"#2e7d32":"#bbb" }}>{wordCount} words</span>
                    <VoiceButton onTranscript={handleVoiceTranscript} disabled={streaming||enhancing} />
                  </div>
                </div>
                <div style={{ position:"relative" }}>
                  <textarea
                    value={input + (voiceInterim ? " " + voiceInterim : "")}
                    onChange={e=>{ setInput(e.target.value); setVoiceInterim(""); setError(""); }}
                    placeholder={"Example:\n\nWe need AI-powered alert triage in our MDR product. Currently SOC analysts manually review every alert causing fatigue. We want the system to auto-classify alerts by severity, suggest remediation steps, and suppress false positives. Target: MSP partners managing 50–500 endpoints per client..."}
                    rows={9}
                    style={{ width:"100%", padding:"11px 13px", border:`1.5px solid ${error?CW_RED:"#dde3f0"}`, borderRadius:8, fontSize:13, resize:"vertical", lineHeight:1.7, outline:"none", color:"#333", fontFamily:"inherit", boxSizing:"border-box", background:voiceInterim?"#fffbf0":"white" }}
                  />
                  {voiceInterim && <div style={{ position:"absolute", bottom:10, right:12, fontSize:11, color:CW_RED, display:"flex", alignItems:"center", gap:5 }}><span style={{ animation:"blink 1s infinite" }}>●</span> Listening...</div>}
                </div>
                {error && <div style={{ color:CW_RED, fontSize:12, marginTop:4 }}>⚠ {error}</div>}
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={enhancePrompt} disabled={enhancing||streaming} style={{ flex:1, padding:"11px", background:"white", border:`1.5px solid ${CW_BLUE}`, color:CW_BLUE, borderRadius:8, fontSize:13, fontWeight:600, cursor:enhancing?"wait":"pointer", opacity:enhancing?.6:1 }}>
                  {enhancing ? "✨ Enhancing..." : "✨ Enhance Prompt"}
                </button>
                <button onClick={generatePRD} disabled={streaming||enhancing} style={{ flex:2, padding:"11px", background:streaming?"#999":`linear-gradient(135deg,${CW_RED},#c00020)`, color:"white", border:"none", borderRadius:8, fontSize:14, fontWeight:700, cursor:streaming?"not-allowed":"pointer" }}>
                  {streaming ? "⚙️ Generating PRD..." : "🚀 Generate PRD"}
                </button>
              </div>
              {streaming && <div style={{ marginTop:14, padding:"10px 14px", background:"#f0f4ff", borderRadius:8, fontSize:12.5, color:CW_BLUE, display:"flex", alignItems:"center", gap:8 }}><span style={{ animation:"blink 1s infinite" }}>●</span> Streaming PRD live — all 19 sections appearing in real time...</div>}
            </div>

            {/* Sidebar */}
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ background:"white", borderRadius:12, padding:18, boxShadow:"0 1px 6px rgba(0,0,0,.08)" }}>
                <div style={{ fontSize:12, fontWeight:700, color:CW_BLUE, marginBottom:12, textTransform:"uppercase", letterSpacing:.6 }}>19 Sections Auto-Generated</div>
                {SECTIONS.map((s,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 0", borderBottom:i<18?"1px solid #f2f4f9":"none" }}>
                    <div style={{ width:20, height:20, background:`${CW_BLUE}0f`, border:`1px solid ${CW_BLUE}22`, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9.5, color:CW_BLUE, fontWeight:800, flexShrink:0 }}>{i+1}</div>
                    <span style={{ fontSize:11.5, color:"#555" }}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{ background:`linear-gradient(135deg,${CW_BLUE}0d,${CW_RED}08)`, border:`1px solid ${CW_BLUE}18`, borderRadius:12, padding:16 }}>
                <div style={{ fontSize:12, fontWeight:700, color:CW_BLUE, marginBottom:10, textTransform:"uppercase", letterSpacing:.6 }}>💡 Tips for quality PRDs</div>
                {["State partner type: MSP, MSSP, or TSP","Describe the pain & current workaround","Include scale: endpoints, partners, tickets","Mention related ConnectWise products","Add known compliance requirements","Use 🎤 voice to speak naturally","Hit ✨ Enhance Prompt for richer output"].map((tip,i)=>(
                  <div key={i} style={{ fontSize:12, color:"#444", padding:"4px 0", borderBottom:i<6?"1px solid rgba(0,0,80,.06)":"none", display:"flex", gap:6 }}><span style={{ color:CW_RED, flexShrink:0 }}>›</span>{tip}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ OUTPUT TAB ══ */}
        {tab === "output" && (
          <div>
            {prdText && (
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:10 }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                  <Chip label={`✅ ${completedSections}/19 sections`} color="#2e7d32" />
                  <Chip label={product} color={CW_BLUE} />
                  <Chip label={priority} color={priority==="High"?CW_RED:priority==="Medium"?"#e67e00":"#555"} />
                  {streaming && <Chip label="● Live stream" color={CW_RED} />}
                </div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  <button onClick={()=>doCopy(prdText,"md")} style={{ padding:"7px 15px", background:"white", border:`1.5px solid ${CW_BLUE}`, color:CW_BLUE, borderRadius:8, fontSize:12.5, fontWeight:600, cursor:"pointer" }}>
                    {copied==="md" ? "✅ Copied!" : "📋 Copy Markdown"}
                  </button>
                  <button onClick={()=>downloadDocx(prdText)} disabled={!!downloading||streaming} style={{ padding:"7px 15px", borderRadius:8, fontSize:12.5, fontWeight:700, cursor:downloading?"wait":"pointer", background:downloading==="docx"?"#ccc":CW_BLUE, color:"white", border:"none", display:"flex", alignItems:"center", gap:6 }}>
                    {downloading==="docx" ? "⏳ Building DOCX…" : <><WordIcon /> Download DOCX</>}
                  </button>
                  <button onClick={()=>downloadPdf(prdText)} disabled={!!downloading||streaming} style={{ padding:"7px 15px", borderRadius:8, fontSize:12.5, fontWeight:700, cursor:downloading?"wait":"pointer", background:downloading==="pdf"?"#ccc":CW_RED, color:"white", border:"none", display:"flex", alignItems:"center", gap:6 }}>
                    {downloading==="pdf" ? "⏳ Building PDF…" : <><PdfIcon /> Download PDF</>}
                  </button>
                  <button onClick={()=>{ setPrdText(""); setTab("input"); }} style={{ padding:"7px 15px", background:"white", border:"1.5px solid #ccc", color:"#555", borderRadius:8, fontSize:12.5, fontWeight:600, cursor:"pointer" }}>
                    + New PRD
                  </button>
                </div>
              </div>
            )}
            {(prdText || streaming) ? (
              <div ref={outputRef} style={{ background:"white", borderRadius:14, padding:36, boxShadow:"0 1px 8px rgba(0,0,0,.08)", maxHeight:"74vh", overflowY:"auto" }}>
                <MDRenderer content={prdText} />
                {streaming && <span style={{ display:"inline-block", width:8, height:16, background:CW_RED, borderRadius:2, animation:"blink .8s infinite", verticalAlign:"middle", marginLeft:4 }} />}
              </div>
            ) : (
              <div style={{ background:"white", borderRadius:14, padding:60, textAlign:"center", boxShadow:"0 1px 8px rgba(0,0,0,.08)" }}>
                <div style={{ fontSize:44, marginBottom:12 }}>📄</div>
                <div style={{ color:"#bbb", fontSize:15 }}>No PRD generated yet.</div>
                <button onClick={()=>setTab("input")} style={{ marginTop:16, padding:"9px 22px", background:CW_BLUE, color:"white", border:"none", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:13 }}>← Go to Input</button>
              </div>
            )}
          </div>
        )}

        {/* ══ HISTORY TAB ══ */}
        {tab === "history" && (
          <div>
            {viewingHist ? (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:10 }}>
                  <button onClick={()=>setViewingHist(null)} style={{ padding:"7px 16px", background:"white", border:"1.5px solid #ccc", color:"#333", borderRadius:8, fontSize:13, cursor:"pointer", fontWeight:600 }}>
                    ← Back to History
                  </button>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    <button onClick={()=>doCopy(viewingHist.prd || viewingHist.text || "", "hist_md")} style={{ padding:"7px 16px", background:"white", border:`1.5px solid ${CW_BLUE}`, color:CW_BLUE, borderRadius:8, fontSize:13, cursor:"pointer", fontWeight:600 }}>
                      {copied==="hist_md" ? "✅ Copied!" : "📋 Copy Markdown"}
                    </button>
                    <button onClick={()=>downloadDocx(viewingHist.prd || viewingHist.text || "")} disabled={!!downloading} style={{ padding:"7px 16px", background:downloading==="docx"?"#ccc":CW_BLUE, color:"white", border:"none", borderRadius:8, fontSize:13, cursor:downloading?"wait":"pointer", fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
                      {downloading==="docx" ? "⏳ Building…" : <><WordIcon /> DOCX</>}
                    </button>
                    <button onClick={()=>downloadPdf(viewingHist.prd || viewingHist.text || "")} disabled={!!downloading} style={{ padding:"7px 16px", background:downloading==="pdf"?"#ccc":CW_RED, color:"white", border:"none", borderRadius:8, fontSize:13, cursor:downloading?"wait":"pointer", fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
                      {downloading==="pdf" ? "⏳ Building…" : <><PdfIcon /> PDF</>}
                    </button>
                    <button onClick={()=>{ setPrdText(viewingHist.prd || viewingHist.text || ""); setTab("output"); setViewingHist(null); }} style={{ padding:"7px 16px", background:CW_BLUE, color:"white", border:"none", borderRadius:8, fontSize:13, cursor:"pointer", fontWeight:600 }}>
                      Open in PRD View →
                    </button>
                  </div>
                </div>
                <div style={{ background:"white", borderRadius:14, padding:36, boxShadow:"0 1px 8px rgba(0,0,0,.08)", maxHeight:"74vh", overflowY:"auto" }}>
                  <MDRenderer content={viewingHist.prd || viewingHist.text || ""} />
                </div>
              </div>
            ) : history.length === 0 ? (
              <div style={{ background:"white", borderRadius:14, padding:60, textAlign:"center", boxShadow:"0 1px 8px rgba(0,0,0,.08)" }}>
                <div style={{ fontSize:44, marginBottom:12 }}>📚</div>
                <div style={{ color:"#bbb", fontSize:15 }}>No PRD history yet. Generate your first PRD!</div>
              </div>
            ) : (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <span style={{ fontSize:14, fontWeight:600, color:"#555" }}>{history.length} saved PRD{history.length>1?"s":""}</span>
                  <button onClick={()=>{ if(window.confirm("Clear all history?")) setHistory([]); }} style={{ padding:"6px 14px", background:"white", border:"1.5px solid #f44", color:"#f44", borderRadius:8, fontSize:12, cursor:"pointer", fontWeight:600 }}>
                    🗑 Clear All
                  </button>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:14 }}>
                  {history.map(h => (
                    <div key={h.id} onClick={()=>setViewingHist(h)}
                      style={{ background:"white", borderRadius:12, padding:20, boxShadow:"0 1px 6px rgba(0,0,0,.08)", cursor:"pointer", border:"1.5px solid transparent", transition:"all .18s" }}
                      onMouseEnter={e=>{ e.currentTarget.style.borderColor=CW_BLUE; e.currentTarget.style.boxShadow=`0 4px 16px ${CW_BLUE}22`; }}
                      onMouseLeave={e=>{ e.currentTarget.style.borderColor="transparent"; e.currentTarget.style.boxShadow="0 1px 6px rgba(0,0,0,.08)"; }}>
                      <div style={{ fontSize:13.5, fontWeight:700, color:CW_BLUE, marginBottom:8, lineHeight:1.4 }}>{h.title}</div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
                        <Chip label={h.product} color={CW_BLUE} />
                        <Chip label={h.priority} color={h.priority==="High"?CW_RED:h.priority==="Medium"?"#e67e00":"#555"} />
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ fontSize:11.5, color:"#bbb" }}>{h.date}</span>
                        {h.pmName && <span style={{ fontSize:11.5, color:"#999" }}>by {h.pmName}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <style>{`
          @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.2} }
          @keyframes micPulse { 0%,100%{box-shadow:0 0 0 4px ${CW_RED}40,0 0 0 8px ${CW_RED}18} 50%{box-shadow:0 0 0 6px ${CW_RED}55,0 0 0 12px ${CW_RED}25} }
          textarea:focus, input:focus, select:focus { border-color: ${CW_BLUE} !important; }
          ::-webkit-scrollbar{width:6px;height:6px} ::-webkit-scrollbar-track{background:#f4f6fb} ::-webkit-scrollbar-thumb{background:#c8d0e0;border-radius:4px}
        `}</style>
      </div>
    </div>
  );
}
