# Reading the mapping and checking the result

## Reading the mapping

The mapping is usually a workbook with one row per account and a column saying which line of the other statement the account belongs to, sometimes with a balance column at a stated date. Before proposing a skeleton, read it and report back what is in it: how many accounts, how many distinct lines, and anything odd.

**Codes that are not what they look like.** Some rows carry a label in the account column instead of a code, and have to be resolved by hand. Use the bare account code, looked up with the finstory connector's `company_find_members` tool. That search will often prefer a calculated line whose display name starts with the same words as the account; those are calculated lines, not the accounts. The shapes that recur:

| What the row says | What it resolves to |
| --- | --- |
| a code followed by a long description | the bare code; the description is discarded |
| a "do not remove" clearing account with its purpose in the label | a code that repeats its own label exactly, casing included |
| a statement line name such as "Retained Earnings" | a numeric account code that looks nothing like the label |
| the P&L root's own name | the P&L root itself, linked under equity as current-year earnings, which is what makes a balance sheet balance |

Every other row usually carries a source prefix that the workspace doesn't (a `GL_` in front of the number, say): strip it. Ask when a row fits none of these.

**Decisions that belong to the owner.** Put them to the user with the evidence, and record the answer with its reason:

- *A balance the source system files in the opposite bucket* (current against long term) from the financial package: the package wins, but say so per line. That is only safe when the mis-filed portion is immaterial or nil, so check the ratio first and quote it ("99% long term", "29 of 30 accounts current", "nothing either way"). Anything closer is the owner's to decide.
- *A section-header row that carries a mapping value by accident*: leave it out entirely. A header row with no balance changes no total, so this is the cheapest decision of the three.

## Checking the result

Before building, count the links the mapping implies and subtract the rows you left out. Hold that number: it is what the finished structure must contain.

After linking, read the structure back with `get_alternate_structure` (the root, and each major group at depth two) and check the totals against the mapping's own, at its stated date:

- On a balance sheet, the assets side must equal the liabilities-and-equity side, and both must equal the mapping workbook's own total for that side. Nothing is unmapped and nothing is counted twice.
- On a P&L or another statement, each subtotal you can see in the mapping's source must match the structure's.

Say which totals you checked and what they came to. Don't call the structure done on a link count alone.

If a total doesn't tie, find the gap line by line: which accounts the mapping lists that the structure doesn't contain, and which appear twice. A missing link is never an error, only a subtotal that reads light. Don't fix a mismatch by changing a sign or a subtotal; show the user the gap and let the owner decide.

## When a read looks wrong

A read taken while a batch of links is still being written can show a link twice. That is not damage: nothing is duplicated in the store. Read again once the write has finished, and compare that read with the mapping before deciding anything is wrong.
