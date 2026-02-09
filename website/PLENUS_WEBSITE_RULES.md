# PLENUS_WEBSITE_RULES.md

## 1. Project Context

- **Client:** Plenus Obras
- **Industry:** High-end residential construction
- **Brand attributes:** premium, modern, clean, trustworthy, architectural
- **Target audience:** families and clients looking for land + construction solutions with real cost efficiency

---

## 2. Working Methodology (Mandatory)

- Work step by step, never multiple unrelated changes at once.
- Each step must be explicitly validated by the user before moving on.
- Never refactor, redesign, or "improve" sections that were not explicitly requested.
- If something is unclear or subjective, ask questions first before proposing or implementing.

---

## 3. Analysis Before Action (Mandatory)

Before any change:

1. Analyze the current state of the section.
2. Describe what exists visually and structurally.
3. Explain what will change.
4. Explain why the change improves clarity, usability, or brand perception.
5. Only then propose implementation.

**No exceptions.**

---

## 4. Approved Areas (Current State)

| Section | Status |
|---------|--------|
| Header | Approved |
| Hero section | Approved |

### Hero Section Notes:
- The Hero contains a liquid glass (glassmorphism) card
- This card is now considered a **design reference and standard**

**These areas must not be changed unless the user explicitly requests it.**

---

## 5. Liquid Glass Design System (Core Rule)

The liquid glass style used in the Hero card is a **global visual standard** and must be applied consistently when requested.

### Liquid glass characteristics:
- Semi-transparent background
- Backdrop blur (`backdrop-filter`)
- Subtle border and soft shadow
- High readability and accessibility
- Elegant and restrained (never flashy)

**Any new card or container using this style must visually align with the Hero card.**

---

## 6. Change Validation Rule

If a change involves:
- Visual style choices
- Motion intensity
- Alignment decisions
- Hover or interaction behavior
- Responsiveness assumptions

**You must ask clarifying questions before implementing.**

---

## 7. Current Active Task

### Step 1 – Cards Update

**Objective:**
- Convert informational cards (Mission, Vision, Essence) into liquid glass cards
- Centralize all content inside each card (icon, title, text)

**Rules for this step:**
- Only work on this section
- Do not introduce animations unless requested
- Do not change copy or wording
- Ask before deciding blur intensity, borders, or hover behavior

**Do not proceed to any other section until this step is approved.**

---

## 8. Change Log

| Date | Section | Change | Status |
|------|---------|--------|--------|
| 2026-02-02 | About (Cards) | Converted Mission, Vision, Essence to liquid glass style with centered content and hover glow | Approved |
| 2026-02-02 | Company Values | Refactored: removed glass, shortened text, flex layout with centered wrap, increased gap | Approved |
| 2026-02-02 | Section Order | New order: About → Map3D → Projects → Differentials | Approved |
| 2026-02-02 | Projects | Netflix-style horizontal scroll with liquid glass cards, navigation arrows, scroll snap, white background | Approved |

---

*This file must be read and followed before every modification to the website.*
