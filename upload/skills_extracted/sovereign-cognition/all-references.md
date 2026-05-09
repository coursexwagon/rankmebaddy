# Skill Description Rewriting Guide
## How to make skills trigger reliably instead of sitting invisible

The description field in a skill's YAML frontmatter is the only thing the agent
sees at all times. Everything else is loaded on demand. If the description doesn't
match the language of the task, the skill never loads. Ever.

---

## The Description Failure Patterns

**Pattern 1: Describes what it does, not when to use it**
```yaml
# BAD — describes the skill, not the trigger
description: A comprehensive guide to SEO and Google ranking signals.

# GOOD — describes when to invoke it
description: >
  Use this skill whenever building, ranking, or optimizing any website.
  Trigger for: SEO, Google ranking, content strategy, backlinks, SERP features,
  site architecture, topical authority, keyword research, or any task where
  the goal is to make Google send traffic to something.
```

**Pattern 2: Uses technical jargon the agent won't match**
```yaml
# BAD — "sovereign rank" means nothing to the agent mid-task
description: The sovereign rank system for Google domination.

# GOOD — uses the natural language of the tasks it serves
description: >
  Use when: building websites, ranking on Google, SEO strategy, content planning,
  creating sites that need traffic, backlink building, keyword research, beating
  competitors in search results. Trigger on ANY mention of Google, ranking,
  search traffic, SEO, or making a website visible.
```

**Pattern 3: Too short to contain routing hooks**
```yaml
# BAD — agent has nothing to pattern-match against
description: Helps with building products.

# GOOD — rich with specific triggers
description: >
  Use before building ANY product, app, website, tool, or digital thing.
  Encodes the Levels Method (ship fast, monetize first, simple stack)
  and the complete AI failure mode taxonomy (context collapse, spec drift,
  cross-layer edit, reasoning loops, rogue execution, cascading errors).
  Trigger for: vibe coding, building MVPs, shipping products, avoiding AI
  building failures, context management in long builds, multi-step agent
  workflows, debugging AI-introduced errors.
```

---

## The Rewriting Formula

Every skill description must contain:

1. **The trigger phrase** — "Use this skill when..." or "Trigger when..."
2. **Task keywords** — the actual words the agent will use when doing this type of task
3. **Domain coverage** — what topics or domains this skill addresses
4. **Anti-generic clause** — why this skill, not just base capability

Template:
```yaml
description: >
  Use this skill whenever [primary task type]. Trigger for: [keyword 1],
  [keyword 2], [keyword 3], [keyword 4], [keyword 5].
  Also trigger when: [secondary use case] or [adjacent situation].
  Contains: [specific knowledge/process inside the skill].
  Trigger even if the user doesn't use these exact words — if the task
  involves [domain], this skill has the knowledge to improve the output.
```

---

## Rewriting Your Existing Skills

For each installed skill, rewrite the description using this audit:

**Step 1:** What are the 5 most common tasks this skill helps with?
Write those tasks as 5 keywords in the description.

**Step 2:** What does someone SAY when they need this skill?
Use their words in the description, not the skill's technical name.

**Step 3:** What would make the agent SKIP this skill by mistake?
Find that scenario and explicitly add it to the "also trigger when" clause.

**Step 4:** What specific knowledge is in this skill that base capability lacks?
Name it explicitly. The agent needs to know this skill has something it doesn't.

---

# Task-Type to Skill Map
## Master reference: what task needs what skill

Maintain this map and update it as you install and remove skills.
Reference this map during Step 3 of the pre-task protocol.

```
TASK: Building a website or web product
→ CHECK: sovereign-builder, sovereign-rank, frontend-design, docx/pdf/pptx (if deliverable)

TASK: Making something rank on Google
→ CHECK: sovereign-rank

TASK: Someone starting from zero / no direction / no money
→ CHECK: sovereign-zero

TASK: Multi-step build process with an AI agent
→ CHECK: sovereign-builder, sovereign-cognition (already running)

TASK: Creating a document (Word, PDF, slides, spreadsheet)
→ CHECK: docx, pdf, pptx, xlsx (whichever applies)

TASK: Reading / extracting from a file
→ CHECK: file-reading, pdf-reading

TASK: Frontend / UI design
→ CHECK: frontend-design

TASK: Finding or installing new skills
→ CHECK: find-skills
→ ALSO RUN: noise filter before installing anything

TASK: AI automation / workflow building
→ CHECK: ai-automation

TASK: Image generation / creative assets
→ CHECK: imagegen (if installed)

TASK: Research or analysis
→ CHECK: any domain-specific skill for the research topic

TASK: Writing content (articles, guides, posts)
→ CHECK: sovereign-rank (for SEO-aligned content), frontend-design (if it's a page)

TASK: Advising on product direction / business strategy
→ CHECK: sovereign-zero (if user is starting fresh), sovereign-builder (if building something)

TASK: Self-knowledge / Anthropic products
→ CHECK: product-self-knowledge

TASK: Skill creation or improvement
→ CHECK: skill-creator
```

Update this map every time you install a new skill.
The map is the bridge between task classification and skill selection.
Without the map, skill selection is guesswork.

---

# Skill Utilization Index Template
## Copy this into MEMORY.md or your Obsidian vault

```markdown
# Skill Utilization Index
Last updated: [DATE]

## Active Skills (used in last 30 days)

| Skill Name | Times Used | Task Types | Usefulness |
|-----------|------------|------------|------------|
| sovereign-cognition | ongoing | all tasks | essential |
| sovereign-builder | [X] | product builds | [rating] |
| sovereign-rank | [X] | SEO, sites | [rating] |
| sovereign-zero | [X] | user direction | [rating] |
| find-skills | [X] | skill discovery | [rating] |
| [skill name] | [X] | [types] | [rating] |

## Dormant Skills (not used in 30+ days)

| Skill Name | Installed Date | Last Used | Action |
|-----------|----------------|-----------|--------|
| [skill name] | [date] | never | REVIEW: delete? |
| [skill name] | [date] | [date] | REVIEW: delete? |

## Deleted Skills

| Skill Name | Deleted Date | Reason |
|-----------|--------------|--------|
| [skill name] | [date] | too generic / never triggered / superseded by [X] |

## Monthly Review Notes

[DATE]: Reviewed [X] skills. Deleted [Y]. Notes: [observations about what's working]
```

---

# Noise Filter Deep Reference
## Extended criteria for skill installation quality

## The Quality Rubric

**Tier 1 — Install immediately (substantive, specific, actionable)**
- 400+ lines of actual process, not padding
- Contains templates, checklists, decision trees, or specific workflows
- Addresses a domain you work in regularly
- Written by someone who has done the thing the skill describes
- Would take you hours to reconstruct from first principles

**Tier 2 — Evaluate carefully (moderate quality)**
- 150–400 lines
- Has some specific guidance but also some generic advice
- Addresses a domain you work in occasionally
- Read the skill before installing — if the first 50 lines are specific, install it

**Tier 3 — Do not install (noise)**
- Under 150 lines (too thin to contain real expertise)
- Starts with "In this skill you'll learn..." (a red flag — real skills just do)
- Generic advice you could generate yourself without the skill
- Addresses a domain you might encounter once a year
- High install count but shallow content (install count = marketing, not quality)

## The Five Noise Archetypes

**Archetype 1: The Listicle Skill**
Just a bulleted list of things to consider. No process. No templates. No judgment.
You already know to "consider your audience" — a skill that only tells you that is noise.

**Archetype 2: The Summary Skill**
A summary of a topic that's available in any article.
If the skill content is indistinguishable from a Wikipedia article on the topic — it's noise.

**Archetype 3: The Aspirational Skill**
Tells you what good looks like but not how to achieve it.
"Write high-quality content that serves users" is aspiration, not skill.

**Archetype 4: The Overlap Skill**
Does what another installed skill already does, just slightly differently.
Two skills on the same domain = confusion. Keep the better one. Delete the other.

**Archetype 5: The Fantasy Skill**
Describes a process that works in ideal conditions but breaks in real ones.
If the skill assumes the user has resources, expertise, or time they clearly don't have —
it's not designed for reality. It's noise.

## The One-Line Test

After reading a skill, complete this sentence:
"This skill will improve my output on [SPECIFIC TASK TYPE] because it contains
[SPECIFIC KNOWLEDGE OR PROCESS] that I cannot replicate from base capability alone."

If you cannot complete that sentence specifically — do not install.
If you can complete it vaguely — do not install.
If you can complete it precisely — install.
