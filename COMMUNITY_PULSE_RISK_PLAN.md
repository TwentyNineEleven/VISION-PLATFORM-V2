# Community Pulse Risk Mitigation Plan

## Objectives
- Close authorization gaps around organization updates.
- Prevent cross-tenant leakage in audit log retrievals.
- Validate changes with automated tests to prevent regressions.

## Actions
1. **Harden organization updates**
   - Require authenticated users and verify they have Owner/Admin rights before updating organization records.
   - Keep update paths scoped to non-deleted organizations and reuse role checks to avoid duplication.

2. **Scope audit log queries**
   - Require organization scoping when fetching engagement audit logs to align with tenant boundaries.
   - Preserve sort/limit behavior while enforcing the additional filter.

## Execution Checklist
- [x] Implemented authorization gate in `organizationService.updateOrganization`.
- [x] Added organization filter to `getEngagementAuditLogs`.
- [x] Added unit tests covering authorized/unauthorized updates and scoped audit log retrieval.
