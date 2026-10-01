---
name: build-model
description: Builds a new finstory model from a source system such as Adaptive or NetSuite, from its structure to its first report, through the finstory data admin connector. Creates the model, connects the source (the user types its first login themselves), previews and runs the sync and the loads, creates the scenarios, checks the figures, adds subtotals and defaults, and can set up a schedule that keeps the model current. Use when the user wants to set up, connect, sync, reload or schedule a model from a source system, or to keep last month's actuals loaded on set days. Loading numbers from a file, restating accounts, questions about the numbers, reports and board stories are covered by the load-data, restate-structure, financial-questions, report-builder and board-story skills.
---

# finstory: building a model from a source system

Fill a new finstory model from a source system such as Adaptive or NetSuite, from its structure to its first report, and keep it current on a schedule if the user wants. Several steps replace accounts or figures, so each one is previewed and confirmed first.

This skill needs the finstory data admin connector, which comes with this plugin. If the finstory data admin tools are not available, tell the user to connect finstory data admin from the plugin's Connectors tab (or from Claude's connector settings) and sign in with their finstory login. Checking the figures and building the first report use the finstory connector, which comes with the finstory plugin.

## Before you start

- **Who can do what.** A tool that needs a role the user doesn't have says so. Tell the user in one line what is missing and who can do it (an administrator), and stop; don't look for a way round.
- **The login is the user's.** The first login of a source is always typed by the user, at the login link a tool returns. Never ask for credentials in the conversation and never put them in a tool argument.
- **The model is the user's decision.** Never create a model on your own initiative. Agree its name first.

## The sequence

`list_models` returns the procedure for building a model from a source, in the order that works. Follow what it returns; where it differs from the summary here, it wins.

1. **Model.** Agree the new model's name with the user, then `create_model` (blank).
2. **Breakdowns.** `configure_dimensions`: give the breakdowns the source brings their names, put them in use, make them visible, and set the default to "top".
3. **Connection.** Find an existing connection of the same source type whose login can be reused (`list_connectors`, then `get_connector` for the shape of its settings and what it offers). If there is none, `create_connector` without a login to reuse creates the connection awaiting its login and returns the login link; once the user has typed it in, `sync_connector` and `list_connector_accounts` follow. Details: [references/connectors-and-logins.md](references/connectors-and-logins.md).
4. **Accounts.** `list_connector_accounts`: choose the accounts that load (never a linked account: take its source instead) and confirm the list with the user. Then `create_connector` or `update_connector` with the model, the login, the chosen accounts and the mappings.
5. **Sync.** `sync_connector`: preview, confirm, run. The first job fixes the connection's model and mode.
6. **Load.** `run_connector_load`: one version per job, because large loads can run out of memory. The preview names the scenario it replaces; confirm; then follow the job with `get_connector_job`.
7. **Scenarios, checks, subtotals, defaults.** `ensure_dimension_members` creates the scenario each version loads into (a load never does); check the per-account totals; add subtotals where the source's totals don't equal their lines; give every breakdown in use a default. [references/checks-and-defaults.md](references/checks-and-defaults.md)
8. **Reports.** Build the first report with the finstory plugin's report-builder skill.
9. **Schedule (optional).** Keep the model current unattended, such as last month's actuals on the third working day. [references/schedules.md](references/schedules.md)

## Rules that never bend

- **Preview, confirm, then run.** Every sync, load and schedule shows what it will replace before it does: accounts for a sync, a whole month or year of figures for a load. Put that in plain words, with the amounts and months, and run it only after the user says yes.
- **Report what the job reports.** After a sync or a load, say what `get_connector_job` returned, not your own count, and say plainly when it didn't finish or didn't match.
- **Never invent names.** A scenario, account or entity name is the user's to give: propose with your reasons and let them decide.
- **One version per load**, each confirmed on its own.

## Talking to the user

The user is a finance controller. Say "connection", "source", "login", "accounts", "scenario" and "model", describe what you are doing ("syncing the accounts from NetSuite") rather than naming tools, and keep away from storage vocabulary such as dimension, member, handle or POV.

## When the job changes

To load figures from a file, the load-data skill applies. To read accounts under another structure, restate-structure. For questions about the numbers and for reports and board stories, the financial-questions, report-builder and board-story skills of the finstory plugin.

## References

- [references/connectors-and-logins.md](references/connectors-and-logins.md): finding or creating the connection, the login, accounts, sync and loads.
- [references/checks-and-defaults.md](references/checks-and-defaults.md): scenarios, checking the figures, subtotals and defaults.
- [references/schedules.md](references/schedules.md): keeping a model current on set days.
