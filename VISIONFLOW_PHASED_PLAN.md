## VisionFlow remediation plan (phased)

We will address the previously identified VisionFlow gaps in small, incremental phases to avoid large, risky drops:

### Status and checkpoints
- **Current status:** Phase 6 complete with folder service hierarchy, breadcrumb, duplicate-name, move, and rename guardrails covered by automated tests. Folder update validations (self-descendant, cross-org, duplicate names, invalid names) are enforced before Supabase writes.
- **Next up:** Run the final navigation smoke pass for folders (real or mocked Supabase) and then close out the remediation effort; confirm UI affordances (breadcrumbs, move modal, and document counts) align with the hardened service behaviors.
- **Completion signal:** A phase is considered done when its acceptance criteria below are met, automated tests cover the new behavior, and the relevant manual validation steps have been executed.

### Phase 1 – Read-only stability (this change)
- Load VisionFlow tasks and task detail pages from the Supabase-backed service when configured.
- Provide resilient demo fallbacks (seed data + clear messaging) when the database is not available so UX is no longer empty or error-only.
- Add UI tests to keep the pages rendering with data and guard against regressions.

### Phase 2 – CRUD wiring and UX polish
- Enable create/update/delete/comment actions on tasks using `visionflowService` mutations with optimistic UI states and error handling.
- Add success/error toasts and disable buttons during mutation to prevent duplicate submissions.
- Expand tests to cover the new mutations and navigation after delete.

### Phase 3 – Catalog and dashboard actions
- Replace placeholder CTA handlers on the applications catalog and main dashboard with real navigation/modals.
- Add tests to verify modal open/close and routing behaviors.

### Phase 4 – Files bulk move
- Swap the `prompt`-based bulk move with a folder-selection modal, including validation and progress feedback.
- Cover with UI tests for valid/invalid selections.

### Phase 5 – Document parsing
- Replace placeholder parsing with real PDF/DOCX extraction, with graceful failures and fixtures-based unit tests.

### Phase 6 – Folder service coverage
- Add unit coverage for folder hierarchy operations (tree building, breadcrumb paths) to protect navigation scenarios.
- Validate duplicate-name prevention and authenticated creation logic with Supabase mocks.
- Ensure mappings between database rows and domain models stay stable.

Each phase ships independently with targeted tests to reduce blast radius while steadily closing the gaps.

### Validation per phase
- **Automated**: Add or extend unit/UI tests that assert the new behaviors (data loads, CRUD mutations, modal routing, bulk move flows, and parsing outputs) and keep existing regressions covered.
- **Manual**: Run a quick smoke pass for the affected screens immediately after implementation (e.g., load tasks list/detail, run CRUD actions, open catalog/dashboard CTAs, execute a bulk move via modal, and parse sample PDF/DOCX files).
- **Exit criteria**: Both automated and manual checks pass, and there are no TODOs/console placeholders left for that phase.
