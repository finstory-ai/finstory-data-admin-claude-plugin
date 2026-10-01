# Monthly or year to date, layers or alternatives

Two questions about every file. Settle both from the numbers, and state each verdict to the user with its evidence before anything is created: a wrong answer is silent, because the load succeeds and the figures read wrong for ever.

## How the file stores its figures

Each scenario stores its figures one of two ways, and the file has to match.

- **A monthly scenario** holds one value per month, never a running total. Nothing records which kind a row is, so a file of running totals loaded as it is overstates every month after the first, and the year by roughly six and a half times. Difference it first (each month minus the month before), and say that you did, with the evidence.
- **A year-to-date scenario** holds the figure so far this year at each month, and holds levels such as headcount or open pipeline. A file of running totals, or of levels, loads into it as it is. A file of monthly movements bound for one is a question for the user, never a guess: movements are added up to year to date first and loaded with `source_grain` set to cumulative, and levels load with `source_grain` set to stock.
- **Levels in a monthly scenario** (headcount, FTEs) load only into accounts of type Balance, which show their level in every view whatever the scenario stores. A file of levels bound for a monthly scenario is a question for the user: every account in it must be a Balance account in that model.
- **Several models.** Each scenario lists how it stores figures; where none is listed, load one value per month. Pass `source_grain` to `begin_data_load` on every load; with two or more models it is checked against each scenario.

## Deciding which one the file is

- Decide from the numbers, never from the file name or a column header, and never from one signal. Half of a budget file's lines never decrease simply because they are flat, and that reads as running totals on a "never decreases" test alone.
- The ratio is what separates them. If the last month is about a twelfth of the twelve-month total, the file is monthly; if the last month is most of the total, it is running totals. Say it with the figures: "December is 8% of the year, so these are monthly figures."
- When the workspace already holds the same account for another scenario or year, compare sizes with it: the load context has it, and it is decisive when available.

## Layers or alternatives

When a column splits the file into parts, work out whether the parts are alternatives or layers that add up.

- **Coverage is the tell.** If one part spans a handful of accounts and the other spans the whole statement, they are layers. If both span the same accounts and months, they are alternatives, and each loads separately as it is.
- **Layers can't be loaded as they come.** Each scenario you load has to stand on its own, so load the combination, not the increment. A layer that carries revenue and no costs looks like a complete budget with a 100% margin, and nothing can ever add it back to its base: selecting it in a report returns the fragment and nothing else.
- **One file can be several loads.** Say how many scenarios the file makes and what each holds, with the coverage figures ("one part covers 3 accounts, the other 150"), and let the user name them. Each load is measured and confirmed on its own.
