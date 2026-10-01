# The skeleton: outline, names and signs

Propose the whole structure as an outline before anything is created, so the user approves its shape while it is still empty.

## The outline

A root, a few groups, and the lines that accounts will attach to. Show the indentation, the account type and the sign on every line, and say how many accounts you expect under each line:

```
Total Assets                        Asset      +
  Total Current Assets              Asset      +
    <current asset line>            Asset      +    12 accounts
    <current asset line>            Asset      +     3 accounts
  Total Other Assets                Asset      +
    <other asset line>              Asset      +     1 account
Total Liabilities & Equity          Liability  -
  Total Current Liabilities         Liability  +
    <current liability line>        Liability  +     8 accounts
  Total Equity                      Equity     +
    <equity line>                   Equity     +     2 accounts
```

The layout and names come from the user's mapping, not from this example. A line may carry a single account, and several usually do. A line that ends up with none is a gap in the mapping, not a design choice: ask about it.

## Names

- Use one code prefix for every new subtotal, so they are easy to tell from the workspace's own accounts, and give the root a display name. Both are the owner's call; propose, then let them write their own.
- Name the groups in between "Total ...". A group called "Total Other Assets" would otherwise collide with the "Other Assets" line inside it, and a mapping's own subtotal rows usually use exactly these names.
- Names appear in every report built on the structure. Read the finished outline back to the user in their own words before building anything on it.

## Signs

- Every subtotal carries a sign that says how it rolls into its parent: "+" adds it, "-" subtracts it, and "~" leaves it out of the roll-up entirely (for a memo line or a ratio). "+" is the default and is silently wrong for a cost or a contra line, so state the sign on every line of the outline and have the user confirm it.
- A subtotal can't be re-signed once it exists, so the signs have to be right before anything is created. The account's own link also carries a sign for that parent, so the same account can add in one structure and subtract in another.
- Copy the convention the workspace already uses. Read an existing structure of the same kind (a balance sheet root, a P&L root) with `get_alternate_structure` and mirror the signs it carries, rather than assuming one.
- On a balance sheet the liabilities-and-equity group usually carries "-" so that the root reads zero when the sheet balances. Check what the existing balance sheet root does, and do the same.

## Account types

Each subtotal on the accounts has a type: Asset, Liability, Equity, Revenue, Expense, or Balance (a level such as headcount, never added up over months). Match the spelling `get_alternate_structure` shows for the workspace's existing subtotals, and follow the statement: asset, liability and equity lines on a balance sheet. If a line's type is not obvious, ask.
