---
title: "About"
category: About
date: 2026-04-15 00:00:00
tags: [LLM, Wiki, Knowledge Graph, AI, Claude]
summary: "LLM Wiki — Multimodal Knowledge Graph Skill running inside Claude Code"
---

> LLM writes and maintains the wiki; humans read and ask questions.

![LLM Wiki](/images/llm-wiki.svg)

`llm-wiki-skill` is a Skill running inside Claude Code that ingests raw documents of any format (PDF, DOCX, PPTX, XLSX, Markdown, images) into a structured Wiki and automatically builds an interactive knowledge graph (`graph.html`).

It implements the knowledge management philosophy proposed by Karpathy: **knowledge is synthesized at ingest time, not query time**. Every time a new document is added, the LLM automatically extracts key points, establishes cross-references, flags contradictions, and updates the synthesis summary — making the knowledge base compound-grow with each ingest.

The core difference from RAG: RAG dumps raw documents into a vector store and assembles answers on-the-fly at query time; `llm-wiki` compiles knowledge into durable wiki pages at ingest time, so queries read already-synthesized conclusions.

---

## Directory Structure

```
<wiki-root>/
  raw/                  # Raw documents (never modified)
    <topic>/            # Organized by topic, one-level subdirectories
  wiki/
    index.md            # Table of contents for all pages (partitioned by topic)
    overview.md         # Living synthesis across all sources
    log.md              # Append-only operation log
    sources/            # Summary page for each raw document
    entities/           # People / companies / projects / products
    concepts/           # Concepts / frameworks / methodologies
    syntheses/          # Archived query answers
    archive/            # Archived outdated pages
  graph/
    graph.json          # Nodes + edges data
    graph.html          # Self-contained visualization based on vis.js
```

---

## Command Reference

- `wiki-config workspace <path>` — Set the wiki workspace path
- `wiki-config show` — View current config and directory status
- `wiki-input <path> [--topic <slug>]` — Ingest any file path, auto-archives to `raw/<topic>/`
- `wiki-ingest <file>` — Ingest a file already in `raw/`
- `wiki-query: <question>` — Query the knowledge base, synthesize answer
- `wiki-lint` — Check for orphan pages, broken links, contradictions
- `wiki-graph` — Build the interactive knowledge graph (`graph.html`)

Recommended for daily use: `wiki-input` — accepts local or remote paths, automatically copies to `raw/<topic>/` before ingesting. No manual management of the `raw/` directory needed.

---

## Workflow

### Ingest

When ingesting a document, the LLM executes in sequence:

1. Multimodal content extraction (PDF/DOCX/PPTX/XLSX/images → Markdown)
2. Write `wiki/sources/<slug>.md` (summary, key points, key quotes)
3. Update `wiki/index.md` and `wiki/overview.md`
4. Create or update `wiki/entities/` and `wiki/concepts/` pages
5. Flag contradictions with existing content
6. Append operation log to `wiki/log.md`

### Query

Reads `wiki/index.md` to identify relevant pages, synthesizes an answer with inline `[[PageName]]` references. Optionally archives the answer as `wiki/syntheses/<slug>.md`.

### Knowledge Graph

Extracts explicit wikilinks (`EXTRACTED`) and AI-inferred semantic associations (`INFERRED`, confidence ≥ 0.5) between pages, generating a zero-dependency self-contained `graph.html` with node-type coloring and community grouping.

---

## Supported Formats

- `.md` `.txt` — Direct read
- `.pdf` — pdfplumber (text + tables)
- `.docx` — python-docx (body + headings + tables)
- `.pptx` — python-pptx (titles + body + notes)
- `.xlsx` `.csv` — pandas (converted to Markdown tables)
- `.png` `.jpg` `.jpeg` `.webp` `.gif` `.bmp` — Claude vision (multimodal)

---

## Multimodal Support

`llm-wiki` uses Claude's native multimodal capability to understand image content — not just OCR, but full semantic comprehension of diagrams, charts, and screenshots.

Pass any image file directly to `wiki-input` or `wiki-ingest`. Claude reads the image and converts its content to structured Markdown before the standard Ingest workflow runs:

```bash
wiki-input ~/screenshots/architecture-diagram.png --topic system-design
wiki-input ~/photos/whiteboard-session.jpg --topic meetings
```

What Claude extracts from images:

- Charts & graphs — data series, axis labels, trends, and numerical values
- Diagrams & flowcharts — nodes, edges, relationships, and flow direction
- Screenshots — UI structure, visible text, and layout context
- Handwritten notes / whiteboards — transcribed text and drawn structures
- Tables in images — reconstructed as Markdown tables
- Mixed content — documents photographed or scanned with both text and figures

---

## Quick Start

```bash
# 1. Set the wiki workspace
wiki-config workspace ~/my-wiki

# 2. Ingest the first document
wiki-input ~/Downloads/paper.pdf --topic papers

# 3. Query
wiki-query: What is the core contribution of this paper?

# 4. Build the knowledge graph
wiki-graph
```

---

## References

- [llmrix/llm-wiki-skill](https://github.com/llmrix/llm-wiki-skill) — Source repository
