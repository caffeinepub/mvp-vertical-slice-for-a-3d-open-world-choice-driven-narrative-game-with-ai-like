# Specification

## Summary
**Goal:** Deliver an MVP vertical slice of a **3D game**: a small open-world neighborhood with third-person controls, interactable NPCs, branching dialogue/quests, deterministic “AI-like” NPC behaviors, and persistent player/world state for logged-in users—wrapped in a cohesive, mature dramatic UI theme with original, compliant content.

**Planned changes:**
- Add a playable 3D neighborhood scene in-browser with third-person movement/camera, collisions/boundaries, and at least 3 interactable NPCs.
- Implement a character creation flow (name, appearance presets, and at least 3 traits) and persist the configuration per authenticated user; make traits affect at least one in-game outcome.
- Build a structured branching dialogue system with choices, conditional availability (traits/flags/relationships), and consequences that update persistent game state; show relationship/affinity in UI.
- Implement deterministic NPC behavior state machines (idle/wander/talk/busy), including schedule/time-of-day or quest-flag-based relocation and relationship-driven dialogue availability.
- Add quest infrastructure (definitions/objectives/branching outcomes) plus a quest journal UI with 1 main quest and 2 side quests; persist quest progress/outcomes.
- Implement backend (single Motoko actor) persistence for user profile, character config, world/quest flags, NPC relationship values, and last known player location; expose load/save methods keyed by Internet Identity principal.
- Apply a cohesive, intentionally art-directed UI theme (palette/typography/layout) across title screen, character creator, in-game HUD/dialogue, and quest journal; avoid blue/purple as primary colors.
- Add content/compliance guardrails: all-original characters/locations, no explicit sexual content, and a brief disclaimer stating the game is an original work inspired by soap-opera drama (generic phrasing).

**User-visible outcome:** Users can create a protagonist, enter a small 3D neighborhood, talk to multiple NPCs via a dialogue UI with branching choices, complete quests that change world/NPC state, see relationship values and a quest journal, and return later to the same saved progress and location after refresh/login.
