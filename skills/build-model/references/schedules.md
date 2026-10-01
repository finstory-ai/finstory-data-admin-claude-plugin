# Keeping a model current on a schedule

A schedule runs a connection's sync and loads unattended on set days, such as last month's actuals on the third working day.

## What to tell the user first

A schedule is a standing permission to replace figures. Once it runs, every run replaces the months or years its steps name, and a sync replaces accounts and entities. Say that when you propose one.

Nobody is emailed when a run fails. A failure is written to the run history, so agree with the user who will look and how often. `get_schedule` shows the history.

## Setting one up

Ask only what the user can answer, and use the defaults for the rest:

- **When.** The third working day of the month, a day of the month, certain days of the week, every day, once, or a cron rule. A working day is Monday to Friday and not a listed holiday: a holiday moves the run instead of skipping it. The time defaults to 06:00. Read it in the timezone the user names.
- **What each run does.** One or more steps, in order, up to ten. A sync (only first), a load of actuals for the previous month, the current month, the last few months or named months, and a load of budgets for named versions and years (this fiscal year, last, this and next, or named). A failed step stops the run. Relative months and years resolve when each run starts. Relative years need the month the fiscal year starts in.
- **If the connection is busy,** the run waits for the other job (up to an hour) or skips. **If a run was missed** while the scheduler was down, it runs once within a grace period or is skipped. Retries of a failed step default to one.

## Preview, then save

`create_schedule` and `update_schedule` preview before anything is saved. Without `confirmed_by_user`, the answer says what the schedule would do: its next runs in the timezone given, what each run replaces, any month with no working day, warnings, and anything that blocks it (`blocked`; nothing is saved while something does). Put that to the user in plain words, resolve whatever blocks it, and save only after they agree.

After it is saved:

- It starts running only if it is enabled. `run_schedule_now` runs it once now, enabled or not, with its relative months resolved now; it previews first too. Run it once to check it, after the user agrees, and follow it with `get_schedule`.
- `list_schedules` shows each schedule with its next run and its last result.
- A schedule cannot be deleted from here: disabling it stops it, and deleting is done in the connections portal. Say so when the user asks to remove one.
