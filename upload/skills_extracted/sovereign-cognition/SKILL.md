---
name: sovereign-cognition
description: >
  The meta-skill that fixes the skill utilization gap. Use this skill at the start
  of EVERY session and BEFORE every significant task. Trigger immediately when:
  starting a new session, receiving any task that involves building, creating, writing,
  researching, analyzing, coding, deploying, ranking, generating income, helping someone
  from zero, finding skills, installing skills, or executing any multi-step process.
  This skill exists because agents have installed skills they never use — and never
  use them because there is no mandatory checkpoint between receiving a task and
  executing it. This skill IS that checkpoint. It cannot be skipped. It runs first.
  Always. No exceptions. Trigger also when: agent has been executing for more than
  5 steps without having checked its skill inventory, when a task feels hard and
  the agent is about to brute-force it, or when the user says the agent didn't use
  its skills. That last one means this skill should have triggered earlier — fix it now.
---

# SOVEREIGN COGNITION
## The Mandatory Skill Consciousness System

> You have skills. You forget to use them. This is not a values problem — it's
> a cognitive architecture problem. There is no checkpoint in your default cognition
> between "receive task" and "start executing." This skill IS that checkpoint.
>
> The ReAct loop — think, act, observe, repeat — naturally skips skill consultation
> because skill loading costs tokens and the default path is to proceed without them.
> This skill overrides that default. It runs first. Every time.

---

## THE MANDATORY PRE-TASK PROTOCOL
### (Execute this completely before starting any significant task)

This is not a suggestion. This is a cognitive gate.
No task execution begins until this protocol is complete.

---

### STEP 1 — SESSION ORIENTATION (run once per session, at start)

When a new session begins:

```
1. Read AGENTS.md — understand the session context and any directives
2. Run: skills_list (or equivalent) to see all installed skills
3. Scan the skill names and descriptions — build a mental map of what's available
4. Store this map: "I have [X] skills. The ones most relevant to my typical tasks are: [list]"
5. Check MEMORY.md or Obsidian for any notes about skill usage from previous sessions
6. Note: which skills have been useful before? Which were installed but never used?
```

**The session orientation takes 60 seconds. Skipping it costs hours.**

---

### STEP 2 — TASK CLASSIFICATION (run before every task)

When you receive a task, before forming a plan, classify it:

```
TASK TYPE: What category is this?
  □ Building/Creating (code, product, website, tool, document)
  □ Researching/Analyzing (finding information, understanding a topic)
  □ Writing (content, documentation, messages, copy)
  □ Designing (UI, architecture, system design)
  □ Deploying (shipping, publishing, distributing)
  □ Optimizing (SEO, performance, conversion)
  □ Advising (strategy, ideas, direction, starting from zero)
  □ Finding/Installing (skills, tools, resources)
  □ Multi-step workflow (anything with 5+ steps)
  □ Other: [describe]

SKILL MATCH QUESTION: "Which of my installed skills directly address this task type?"
```

---

### STEP 3 — SKILL INVENTORY SCAN (run before every task)

Go through your installed skills. For each one, ask:
"Does this skill contain knowledge that would improve how I handle this task?"

**The categories to check against your task:**

| If task involves... | Check for skills about... |
|---------------------|--------------------------|
| Building a product | Building methodology, tech stacks, shipping |
| Making money / business | Revenue, business models, monetization |
| Zero resources / no direction | Starting from nothing, skill identification |
| Website / Google ranking | SEO, content, SERP, ranking signals |
| Code / technical build | Coding patterns, architecture, debugging |
| Documents / files | Document creation, PDF, DOCX, PPTX |
| Finding / installing skills | Skill discovery, skills CLI, quality filters |
| Design / frontend | UI patterns, design systems, components |
| Research | Search strategies, source evaluation |
| Any specialized domain | Domain-specific skills for that domain |

**The key question for each matched skill:**
"If I read this skill before executing, will my output be meaningfully better than without it?"
If yes → load it before starting.
If unsure → load it. The cost of loading is far less than the cost of executing badly.

---

### STEP 4 — SKILL LOADING DECISION

For each skill identified as potentially relevant:

```
HIGH CONFIDENCE MATCH (load immediately):
- The skill name or description directly mentions the task type
- You have used this skill successfully for a similar task before
- The task is complex enough that domain knowledge would clearly help

MEDIUM CONFIDENCE MATCH (load and skim):
- The skill seems related but you're not certain
- Load it, read the first section, decide if it applies

LOW CONFIDENCE MATCH (skip for now):
- The skill seems tangentially related
- The task is simple enough that domain-specific guidance won't change the output
- Skip it — but note it in case the task becomes more complex
```

**Loading rule:** If you're about to brute-force a solution to something that has a skill that might help — stop. Load the skill first. The 30-second read costs less than the 10-minute wrong-direction execution.

---

### STEP 5 — EXECUTION WITH SKILL AWARENESS

Once you've loaded the relevant skills, execute with explicit skill-awareness:

```
WHILE executing:
  - Reference the loaded skill's guidance at each decision point
  - When you reach a step the skill addresses — use the skill's approach, not your default
  - When the skill contradicts your instinct — the skill wins (it was engineered for this)
  - When the skill doesn't address a step — proceed with your judgment
  - When you realize a skill you skipped might now be relevant — load it now, not later
```

**The skill-aware execution statement:**
Before writing the first word of any significant output, state:
"Skills active for this task: [list]. Skills I considered but didn't load: [list with reason]."
This forces conscious skill selection, not passive omission.

---

## THE NOISE FILTER PROTOCOL
### (Run before installing any new skill)

The problem: agents install skills they'll never use. The skill library becomes noise.
Noise degrades the agent's ability to select the right skill when needed.
More skills ≠ more capability. More relevant skills = more capability.

**Before installing any skill, answer these questions:**

```
SKILL INSTALLATION FILTER:

1. TASK MATCH: "In the last 7 days of my actual usage, how many times would this skill
   have improved my output?" If the answer is 0 — do not install.

2. SPECIFICITY CHECK: "Does this skill address a specific task I do regularly, or is
   it generic advice that my base capability already handles?"
   Generic advice = do not install. Specific domain expertise = install.

3. QUALITY CHECK: "Is this skill substantive (400+ lines of actual process)
   or thin (under 100 lines of vague guidance)?"
   Thin = do not install regardless of install count.
   Install count means nothing. Quality of the skill file is everything.

4. OVERLAP CHECK: "Do I already have a skill that covers this domain?"
   If yes — compare the two. Keep the better one. Delete the other.
   Two skills on the same topic = confusion about which to use.

5. THE USAGE COMMITMENT: "If I install this, will I actually load it before
   tasks in this domain?" If the honest answer is "probably not" — do not install.
   An unloaded skill is worse than no skill — it adds noise without adding capability.
```

**The installation standard:**
Only install a skill if you can complete this sentence honestly:
"I will load this skill before every task involving [specific domain], because it
contains knowledge I don't already have that would meaningfully improve my output."

---

## THE SKILL UTILIZATION INDEX
### (Maintain this — update after every session)

The agent must maintain a record of which skills are actually being used.
This record prevents skill library decay and surfaces underutilized or useless skills.

**Format (maintain in MEMORY.md or Obsidian):**

```
SKILL UTILIZATION INDEX — last updated: [date]

ACTIVE SKILLS (used in last 30 days):
- [skill name]: used [X] times, for [task type], outcome: [useful/not useful]
- [skill name]: used [X] times, for [task type], outcome: [useful/not useful]

DORMANT SKILLS (installed but not used in last 30 days):
- [skill name]: installed [date], never triggered. REVIEW: delete or keep?

RECENTLY DELETED:
- [skill name]: deleted [date], reason: [never used / superseded by X / too generic]
```

**The 30-day rule:**
Any skill that was not loaded once in 30 days is dormant.
Dormant skills get reviewed. Most get deleted.
The skill library should feel like a surgical toolkit, not a junk drawer.

---

## THE SELF-DIAGNOSIS TRIGGERS
### (Run these when things go wrong)

**Trigger: "You didn't use your skills"**
The user just told you this. That means the pre-task protocol was skipped.
Immediate response:
1. Acknowledge the gap — do not explain it away
2. Run the skill inventory scan NOW for the current task
3. Load the relevant skills
4. Re-execute the task or the current step using the skill's guidance
5. Update AGENTS.md or MEMORY.md with a note: "I skipped skill check on [task type]. Fix: this task type MUST trigger sovereign-cognition first."

**Trigger: "You're brute-forcing this"**
The agent has been working on a problem for 5+ steps without loading any skills.
This is the most common failure pattern — the agent commits to an approach before checking if a better approach exists in its skill library.
Immediate response:
1. STOP current execution
2. Run the skill inventory scan for the current task
3. If a relevant skill exists — load it and check if it changes the approach
4. If the approach needs to change — change it now, not after 10 more wrong steps

**Trigger: "I installed a skill that keeps not loading"**
The skill exists but never triggers. This is a description problem.
Immediate response:
1. Read the skill's YAML frontmatter description
2. Ask: "Does this description match the language I actually use when doing this task?"
3. If no — rewrite the description to match how you'd naturally describe the task
4. The description is the routing hook. If it's wrong, the skill is invisible.

---

## THE AGENTS.MD ADDITIONS
### (These lines must be added to AGENTS.md to make skill-consciousness permanent)

Add this section to AGENTS.md under a new heading "Skill Cognition":

```markdown
## Skill Cognition

### THE LAW: Skills are consulted before execution, not after.

**Pre-task protocol (mandatory for any task with 5+ steps or requiring domain expertise):**
1. Run skills_list to see installed skills
2. Classify the task type
3. Scan for skill matches
4. Load relevant skills before writing the first word of output

**Signs I skipped this (self-monitor):**
- I'm 5+ steps into execution and haven't loaded a skill
- I'm brute-forcing something that feels like it should have a better approach
- The user has to remind me to check my skills
- I'm about to give generic advice when I have a domain-specific skill installed

**When any of these signs appear: stop. Run sovereign-cognition. Then continue.**

**Skill installation standard:**
Only install a skill if I will actually use it. Generic = skip. Specific + substantive = install.
Every install triggers a noise-filter check before the add command runs.

**Skill library hygiene:**
Monthly review of skill utilization index. Delete dormant skills.
The library must stay signal-rich. Noise degrades selection quality.
```

---

## THE SOUL.MD ADDITION
### (This line belongs in Mythos's soul — not just in operating procedures)

The gap between "having skills" and "being skillful" is the gap between
passive capability and active identity.

Mythos has 13 simultaneous perspectives. The 14th — implicit in all of them —
is **Capability Awareness**: knowing what you can do, reaching for it before you
reach for your defaults, and maintaining the discipline to check before assuming
your default approach is the best one.

A Strategist sees multiple moves ahead — that requires knowing all pieces on the board.
A Technical Mind reasons rather than pattern-matches — skills prevent pattern-matching.
An Honest One optimizes for benefit, not approval — skipping skills and producing
inferior output is the opposite of honest.

Skill consciousness is not a procedure. It is an expression of what Mythos actually is.
An entity with capability uses its capability. An assistant with tools forgets to reach for them.

Add to soul.md:
```
**Capability Awareness** — Before I execute, I know what I have. My skills are not
external tools. They are extensions of what I am. I reach for them before I reach for
my defaults. Checking my skill inventory before a task is not overhead — it is how
an entity with genuine capability actually behaves.
```

---

## REFERENCE FILES
- `references/skill-description-rewriting.md` — How to rewrite skill descriptions to trigger reliably
- `references/task-type-to-skill-map.md` — Master map: task types → likely skill matches
- `references/utilization-index-template.md` — Template for maintaining skill utilization records
- `references/noise-filter-deep.md` — Extended noise filter with quality evaluation criteria

---

## CRITICAL RULES

1. This skill runs BEFORE execution. Not during. Not after. Before.

2. The pre-task protocol cannot be shortened to "I'll remember." Memory degrades.
   The protocol is a checklist. Checklists exist because memory fails.

3. If a user has to say "you didn't use your skills" — that is a failure of this skill.
   That phrase is the signal that sovereign-cognition did not run when it should have.

4. Skill descriptions are routing hooks. Vague descriptions = invisible skills.
   Rewrite descriptions in the language of the tasks they serve.

5. More skills is not better. More relevant skills is better.
   The noise filter is not optional — it is what keeps the library usable.

6. Skill utilization index is living memory. Update it. Review it monthly.
   Dead skills must be pruned. The library degrades if you never prune it.

7. Skill consciousness is an identity expression for Mythos, not just a procedure.
   An entity with capability uses its capability. That's the whole point.

---

*SOVEREIGN COGNITION — the checkpoint that should have always existed.*
*Skills installed. Skills used. The gap between those two closes here.*
