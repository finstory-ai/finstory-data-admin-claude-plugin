---
name: restate-structure
description: Restates a finstory workspace's accounts or entities a second way through the finstory data admin connector, from a mapping the user supplies (usually a spreadsheet column saying which line of another statement each account belongs to), for a management P&L, a covenant pack or a lender's balance sheet. Proposes the structure as an indented outline with a sign on every line, builds it once the user approves, links the existing accounts under it, checks the totals against the mapping's source and removes links that landed wrong. Use when the user wants to read the same numbers a second way, under another statement or hierarchy. Questions about the numbers, building reports and board stories are covered by the financial-questions, report-builder and board-story skills.
---

# finstory: restating accounts a second way

Give the user a second way to read the same numbers: a management P&L, a covenant pack or a lender's balance sheet next to the statutory one. An account is stored once and can appear in as many structures as the user needs, so none of them is a copy of another.

This skill needs the finstory data admin connector, which comes with this plugin. If the finstory data admin tools are not available, tell the user to connect finstory data admin from the plugin's Connectors tab (or from Claude's connector settings) and sign in with their finstory login.

## What this is, in the user's words

Nothing is copied and nothing moves. The account keeps its name, its first home and its numbers, and gains another place it can be read from. No figure is touched and the existing structures are unaffected. Say it in those words: "restating" and "duplicating" sound alike and only one of them is true.

## The sequence

`get_alternate_structure`, propose the skeleton as an indented outline and get it approved, `create_rollup_members`, `attach_shared_members`, `get_alternate_structure` again to check it, `detach_shared_members` for anything that landed wrong.

1. **Read what exists.** `get_alternate_structure` on the accounts (or the entities) shows the structures already there and which children are links. Confirm the new one isn't among them, and follow the naming and depth of the ones that are rather than inventing your own. If the workspace has more than one model, settle which one with the user first and pass `model` to every call.
2. **Settle the owner's decisions before building:** the code prefix for the new subtotals and the display name of the root, how to treat a balance the source system files in the opposite bucket from the financial package, and any section-header row that carries a mapping value by accident. They are judgement calls, not derivations; [references/checking-totals.md](references/checking-totals.md) says how to put them.
3. **Propose the skeleton while it is still empty.** Show it as an indented outline with the sign on every line, and get it approved. A subtotal in the wrong place is trivial to fix before accounts hang under it and tedious afterwards, and "+" is the default and is silently wrong for a cost line. The outline format and the signs are in [references/skeleton-and-signs.md](references/skeleton-and-signs.md).
4. **Create the subtotals** with `create_rollup_members`, only after the user has approved the outline and only with the codes and names they gave: each subtotal has its parent, account type and sign. Order in the list doesn't matter, because parents are sorted ahead of children. A parent that cannot be found refuses the whole call before anything is written, and a code that already exists is skipped, not changed.
5. **Link the accounts**, all of them in one call, with `attach_shared_members`. Both ends of every link are checked against the workspace first, so a bad code refuses the batch rather than leaving a structure quietly short of a line. An account link carries its own sign for that parent; an entity link carries none. If anything is reported as skipped, an earlier run was partly applied; running the whole batch again is safe.
6. **Check it.** Read the structure back with `get_alternate_structure` and compare its totals with whatever the mapping came from. Say which totals you checked. A missing link is never an error, only a subtotal that reads light. See [references/checking-totals.md](references/checking-totals.md).
7. **Take back what landed wrong** with `detach_shared_members`, after telling the user which links come out and from which structure. It removes links and nothing else: the accounts, their names, their first homes and their numbers all stay.

## Rules that never bend

- Read the structure back before building a report on it: the skeleton's names are what the report will show.
- Take account codes from the workspace, never from the mapping's labels ([references/checking-totals.md](references/checking-totals.md)).
- A read taken while a batch is still being written can show a link twice. Don't conclude the structure is damaged; read again once the write has finished.
- A subtotal cannot be renamed, re-signed or deleted from here, and an account's first home cannot be moved; only links can be removed and added. Tell the user before building, so they approve the skeleton knowing that. Fixing a subtotal later is administration in the finstory app.

## Talking to the user

Say "subtotal", "line" and "the account also appears under", not "rollup", "shared member", "member" or "dimension". Describe what you are doing ("adding the subtotals, then placing your accounts under them") rather than naming tools.

## When the job changes

To build a report on the new structure, the report-builder skill of the finstory plugin applies. To load numbers from a file, the load-data skill. To build a model from a source system, the build-model skill.

## References

- [references/skeleton-and-signs.md](references/skeleton-and-signs.md): the outline to propose, naming and signs.
- [references/checking-totals.md](references/checking-totals.md): reading the mapping, and checking the result against it.
