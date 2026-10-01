# Security policy

## Reporting a vulnerability

Please report security issues privately to **security@finstory.ai**, or as described at https://finstory.ai/security#report. Do not open a public GitHub issue for a security problem.

Include what you found, the steps to reproduce it, and the version of the plugin (from `.claude-plugin/plugin.json`). We acknowledge reports and keep you informed while we investigate and fix them.

## Scope

- **This repository**: the plugin manifest, the connector configuration in `.mcp.json`, and the skill instructions under `skills/`. The plugin contains only text; it runs no code and stores no data. The `scripts/` folder is maintainer tooling that checks the skills; Claude does not load it.
- **The finstory data admin connector** at `https://mcp.finstory.ai/mcp-data-admin` and its sign-in flow on `app.finstory.ai`: report issues through the same channels.

## Supported versions

Security fixes are made in the latest released version of the plugin. Update to the latest version to receive them.
