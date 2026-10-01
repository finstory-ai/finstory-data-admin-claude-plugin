# Changelog

All notable changes to the finstory data admin plugin are recorded here. The version is the one in `.claude-plugin/plugin.json`.

## 1.0.0 (2026-10-01)

First release.

- Bundles the finstory data admin connector (`https://mcp.finstory.ai/mcp-data-admin`) through `.mcp.json`.
- Adds the `load-data` skill: loads a budget, forecast, actuals or a one-period correction from a workbook or CSV, with every question asked and every load confirmed against measured figures.
- Adds the `restate-structure` skill: restates accounts or entities under a second structure from a mapping, with the outline approved while it is still empty and the totals checked against the mapping.
- Adds the `build-model` skill: builds a model from a source system such as Adaptive or NetSuite, with a preview and a confirmation before each sync, load and schedule.
- Checked against the Data Admin connector's 29 tools (`scripts/check-tools.mjs`).
