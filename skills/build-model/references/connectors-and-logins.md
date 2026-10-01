# The connection: login, accounts, sync and loads

A connection is a model's link to a source system such as Adaptive or NetSuite. Everything here either reads, or replaces something the user should hear about first.

## Find before you create

- `list_connectors` shows the existing connections with the model each loads into, their settings (long lists as counts), their breakdown mappings, when they last synced and whether that sync can serve the next load. It also lists the connection types and what each can do. Read it before adding anything: a connection of the same type usually has a login the new one can reuse.
- `get_connector` shows one in full: its settings, whether its stored login still opens, what its last sync found (versions such as budgets and actuals, the source's own breakdowns with how many values each has), the source fields a mapping may name, and its latest jobs. Copy the shape of its settings for the new connection; a missing or wrong setting comes back by name.

## The login belongs to the user

Passwords and keys never pass through the connector or this conversation.

- **A login to reuse.** `create_connector` takes `use_login_of`, the id of an existing connection of the same type, and copies its login.
- **No login to reuse.** Leave `use_login_of` out. The connection is created awaiting its login, and the answer carries `login_url` (the connection's page in the connections portal) and `tell_the_user`. Pass that on in plain words: open the link, type the login for this connection there, and say when it is saved. It goes straight to finstory. Until then every sync and load is refused. When no portal is configured the answer says who can enter the login instead (a finstory administrator); say so and wait.
- When the user says it is saved, `get_connector` shows the login as no longer missing. Then sync.
- Never ask the user to paste a login, a key or a token into the chat.

## Accounts

`list_connector_accounts` lists what the source offers, from the last sync, each with whether it loads and why not (a level or an average, a metric, a linked or assumption account, not selected) and the group it sits in. It can be filtered by text, group or loadable only, and is paged. For a new connection, ask the one whose login it reuses.

- Choose the accounts that load, and never a linked account: take its source instead.
- Confirm the list with the user, by count and by group first, before it goes into the settings.
- When accounts are chosen one by one, the answer names the setting that holds the choice (`choose_with`) and each account's key for it.
- A connection's dimension mappings tie the model's breakdowns to source fields. `get_connector` lists the fields a mapping may name.

`update_connector` changes the name, model, settings or mappings after `confirmed_by_user`. Each setting sent is replaced whole (send a list in full, not the entries to add), mappings sent replace all of them, and after a change to what loads the next step is a sync. A connection's model and mode cannot change once it has run a job. Say what a settings change means for the next load before you make it.

## Sync

A sync replaces accounts and entities, so it is previewed first. Without `confirmed_by_user`, `sync_connector` only says what it will replace: every account and entity in the model that came from connections of this source type, this connection's and any other's loading into the same model, with what this connection holds now. On a connection's first job it also says that afterwards its model and mode can no longer change. Put that to the user in plain words, run it after they agree, and expect it to wait up to 40 seconds. If it is still running, follow it with `get_connector_job`.

## Loads

`run_connector_load` loads figures from the source into the model: actuals by month, or budgets by version and fiscal year. A load replaces that scenario's whole month or year.

- Without `confirmed_by_user` it only says what it will replace: the model, the scenario for each version, and the months or years. Put that to the user in plain words and run it after they agree.
- One budget version per job is safest for a large model; large loads can run out of memory. At most 20 versions go in one load.
- It is refused while another job of the connection runs, and until a sync has run for the connection's current settings. Sync first.
- A confirmed load returns the job after a short wait. Follow it with `get_connector_job` every minute or two. A running job whose last heartbeat is minutes old has died with its instance: say so, rather than waiting for it.
- When a job fails, its log lines show why. Tell the user what failed in plain words.
- When it finishes, check the figures before telling the user it is done ([checks-and-defaults.md](checks-and-defaults.md)), and say what the job reported, not a count of your own.
