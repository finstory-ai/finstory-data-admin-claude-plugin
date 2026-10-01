# Talking about a load

The user is a finance controller, not a data engineer. Say everything in their words, with the numbers that prompted it. The tools use storage vocabulary that means little to them.

## Words to use

| Don't say | Say instead |
| --- | --- |
| dimension | what the numbers are broken down by: account, entity, scenario, period, or the workspace's own name for another breakdown |
| member, member code | the account, entity or scenario, by its name |
| cardinality, "distinct values" | "the same value in every row", "12 different values" |
| crossing, functional dependence | "these two columns vary independently", "this column just repeats that one" |
| grain | monthly, or year to date: "each row is one month's movement", "each row is a running total" |
| residue | "columns I couldn't place" |
| handle | "this load" |
| POV | the scope: the entity, scenario and period the load covers |
| fact row | a row of figures |
| delete scope | "what this will replace" |
| a tool's name | what you are doing: "checking the file against your accounts" |

Say "this replaces 7,300 rows totalling 36.0m", not "the delete scope contains 7,300 fact rows". Say "this file has two budget layers", not "the scenario axis crosses the period axis". The figures in these examples are illustrations; always use the ones you measured.

## Putting a question

- **Show what you found before what you propose.** The finding can be checked; the proposal can't.
- **Attach the numbers to every question.** "Which entity?" can't be answered. "This column holds one value in all 4,800 rows, and the workspace has twelve entities; which should these rows load to?" can, by someone who has never seen the file.
- **A fact, not an opinion.** "This column holds one value in every row" is a fact; "this column looks like a placeholder" is an opinion. State the fact and let the user say what it is.
- **Offer existing names as the reference, then let the user write their own.** When something new needs a name, show how the workspace's existing ones look (short, no underscores, code and display name alike, say) so the new one is consistent, and ask the user for the name as free text. Your candidates may all be wrong, and they must be free to say so.
- **Lead a list of new names with the counts.** "3 new: 1 scenario, 1 account, 1 cost type", then the list. A long unlabelled list gets approved unread.
- **Several models.** When the workspace has two or more, agree which model each load goes into before anything is created or deleted, and name it as "name (code)" in the confirmation: a load replaces a slice of that one model. One file can feed loads into several models; confirm each on its own.

## When the user says no

Nothing is deleted before `commit_data_load`, so stopping is always safe up to that point. Say that, drop the load, and keep what the user decided (names, mappings) in case they come back.
