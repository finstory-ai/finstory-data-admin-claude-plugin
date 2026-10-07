---
name: load-data
description: Loads numbers into a finstory workspace from a workbook or CSV through the finstory data admin connector, such as a budget, forecast, plan, re-forecast, restated actuals or a correction to one period. Reads and profiles the file on the user's own computer, matches it to the workspace's accounts, scenarios and entities, asks about everything the numbers cannot settle, shows what the load will replace or add to in rows and money, and loads only after the user confirms. Use when the user wants to load, upload, replace, reload, add to or correct figures in finstory from a file. Questions about the numbers, building reports and board stories are covered by the financial-questions, report-builder and board-story skills.
---

# finstory: loading numbers from a file

Load a budget, forecast, plan or other file of figures into finstory without loading anything the user has not seen. A load replaces a whole slice of the workspace's data, or adds to it, so each load is confirmed against figures finstory measured, and a copy of what a replace removes is kept first.

This skill needs the finstory data admin connector, which comes with this plugin. If the finstory data admin tools are not available, tell the user to connect finstory data admin from the plugin's Connectors tab (or from Claude's connector settings) and sign in with their finstory login.

## Before you start

- **Where it can run.** Claude reads the file on the user's own computer and sends the finished CSV to finstory itself, so the session needs local files, code execution and outbound web requests, as in Claude Code or Cowork. Where a session cannot send a web request, it can still check a file against the workspace, but it must not run `commit_data_load`: that deletes before the upload. Say so at the start.
- **Who can load.** Loading needs a finstory role that may load data. If a tool says a capability is missing, tell the user in one line and stop; don't look for another route.
- **Which model.** A workspace can hold more than one model, each with its own accounts, scenarios and data. Settle the model with the user first, name it as "name (code)", and pass `model` to every tool of the load. Never create a model unprompted: when the data belongs in one the workspace lacks, say so, and add it with `create_model` only once the user has agreed its name.

## The sequence

Call `get_data_model` first in every session (once per model). It returns what this workspace actually holds, the layout finstory loads, the limits and the procedure to run over the file. Where the procedure differs from the summary here, the procedure wins.

`get_data_model`, read the file and count, `profile_file`, `get_load_context`, put the questions to the user, `validate_load`, `ensure_dimension_members`, `validate_load` again. Then, once per load: rollback copy, `begin_data_load`, check the upload route, confirm, `commit_data_load`, upload the CSV, `get_load_status`.

1. **Count on the user's computer.** Read the workbook and compute the counts the procedure lists. Send `profile_file` those counts and the short samples of values the procedure asks for, never rows. The bytes stay on disk: write a CSV and upload it yourself, and never put file contents in a tool argument.
2. **Mirror what is already there.** `get_load_context` returns the existing data for the same scope: the real codes, the shape of a row, what the load would replace, and the rows to restore it from if they are all there ([references/confirmations.md](references/confirmations.md)). Map columns to that, never by header: a column called "Region" can hold labels where the workspace holds codes. When the scope is empty it falls back to a nearby one and says which; tell the user.
3. **Ask, with the numbers attached.** Every question `profile_file` raises blocks the load: none can be waived, none goes ahead on a warning, and there is no shortcut for an experienced user. A tedious prompt is recoverable; a load that quietly reads low is not. How to put the questions is in [references/conversation.md](references/conversation.md).
4. **Settle what the figures are.** Monthly or year to date, and layers or alternatives: [references/grain-and-layers.md](references/grain-and-layers.md). State the verdict and its evidence before anything is created, because a wrong one is silent.
5. **Validate before anything is deleted.** `validate_load` must come back clean. Accounts, entities, periods and scenarios it doesn't know are added with `ensure_dimension_members`, only with names the user gave (a new scenario also needs to know whether it stores monthly or year-to-date figures: ask), and then `validate_load` runs again. The load itself checks nothing, so an unchecked load can report success and read low for ever. A month goes under its quarter: the parent (usually the quarter) in `period_level1`, the month in `period_level2`. Codes in a breakdown with no list of its own, such as currency, aren't blockers because loading creates them; show them to the user anyway, since a typo creates a value that looks real.
6. **Replace or add.** A load replaces its slice unless the user wants to add to it: new accounts, entities or periods for figures already loaded. When the file only adds figures, or the user says add, ask which they want; adding is `mode` "append" on `begin_data_load`, and it deletes nothing ([references/confirmations.md](references/confirmations.md#adding-instead-of-replacing)).
7. **Load, one at a time.** A file can be several loads, and with several models they can go into different ones. Each gets its own rollback copy, its own `begin_data_load`, its own confirmation and its own `get_load_status`. What to show, what to do if the upload fails and how to report the result: [references/confirmations.md](references/confirmations.md).

## Rules that never bend

- Never invent a name: not an account, scenario or entity code, not a display name, and never one made by changing a source column. Propose with your reasons and let the user decide; a name outlives the file and appears in every report built on it.
- Never delete before a complete rollback copy is on disk and the user has been told where it is. A copy shorter than the scope is a sample: say so ([references/confirmations.md](references/confirmations.md)).
- Never add to a figure that is already there without the user's yes: adding the same row twice counts it twice.
- Never report your own count of inserted rows; report what `get_load_status` reconciled.
- Never send file rows to `profile_file` or any other tool.

## Talking to the user

The user is a finance controller. Describe what you are doing in their terms ("checking the file against your accounts"), not by tool name, and keep to the words in [references/conversation.md](references/conversation.md).

## When the job changes

To read the same accounts under another structure, the restate-structure skill applies. To build a model from a source system, the build-model skill. For questions about the numbers, reports and board stories, the financial-questions, report-builder and board-story skills of the finstory plugin.

## References

- [references/conversation.md](references/conversation.md): the words to use, and how to put a question.
- [references/grain-and-layers.md](references/grain-and-layers.md): monthly or year to date, and layers or alternatives.
- [references/confirmations.md](references/confirmations.md): confirming a load, the upload, and reporting the result.
