# Scenarios, checking the figures, subtotals and defaults

## The model

- Use only a name the user gave. The model's code is permanent: it is made from the name unless the user chooses one, and even a failed create keeps it taken. A blank model starts with an "Actual" scenario and the standard breakdowns under their default names. A copy starts from another model's setup (its breakdowns, accounts, entities, scenarios and structures) and never its figures.
- Read `list_models` first, so a new model never duplicates one that exists. Whether the user may add a model comes back with it; when not, say so and who can.
- `configure_dimensions` gives each breakdown the source brings the name the user chose, puts it in use, makes it visible on the report bar and sets its order, default and top. Show the user each breakdown, its new name and what changes first. Only the fields you send change.

## Scenarios

A load never creates a scenario, so create the one each version loads into before loading, with `ensure_dimension_members` and a name the user gave. Each scenario stores its figures one of two ways, and the user decides which:

- **Monthly (Periodic)** for flows such as revenue and costs.
- **Year to date (YTD)** for levels such as headcount or open pipeline.

A monthly scenario holds levels too, in accounts of type Balance, which show their level in every view. A source's levels (an Adaptive time rollup of "Last", say) arrive as Balance accounts, so the scenario stays monthly.

`update_scenario` renames a scenario or changes how it stores figures. Figures already loaded are not converted: change the storage before loading, or reload afterwards.

## Check the figures

After the first load, read each account's monthly values with the finstory connector (`analysis_query`, or the financial-questions skill) before telling the user it is done. Look for an account whose value repeats every month, one that duplicates another, and one that is incomplete. Drop it from the connection's accounts with `update_connector`, then sync and load again. Put what you found to the user with the figures; don't drop an account on your own judgement.

## Subtotals

Where the source's own totals don't equal their lines, add subtotal accounts with `create_rollup_members` and then `attach_shared_members`. The restate-structure skill covers the outline, the signs and the checks; the same rules apply.

## Defaults

Every breakdown the model uses needs a default before its reports work, or they fail with "default is unset":

- an analytical breakdown takes "top" (the whole breakdown), unless the user wants one member;
- the others take one member. The entity and account members exist only after the first sync or load, and a scenario only once it is created, so set these last. A subtotal from the step above serves well for the account.

`configure_dimensions` refuses a change that puts a breakdown in use without a default, and it returns `missing_defaults` after every change. The model is ready when `get_data_model` shows none missing.

## Reports

When the figures are right, build the first report with the report-builder skill of the finstory plugin: the model and report group first, then the components, then publish when the user agrees.
