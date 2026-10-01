# Confirming a load

Up to `commit_data_load`, stopping costs nothing. That step deletes what the load replaces and arms the upload, so the confirmation before it is specific, comes from figures finstory measured, and is given once per load.

## Before the delete

1. **A complete rollback copy.** `get_load_context` returns the existing rows for the scope, and its `rollback_note` says to write them to a file in the session and tell the user the path before confirming. Make sure the copy is complete. The result carries at most `row_limit` rows (200 unless you ask for more, 2,000 at most), while `row_count` and the statistics cover the whole scope. Ask for the largest `row_limit`, write what comes back, and compare the rows written with `row_count`. If the file is shorter, it is a sample, not a restore copy: say so plainly, and ask the user to export the scope from the Load Data screen in finstory first, or to decide whether to go on without a complete copy. Never call a sample a rollback copy. When the scope is empty (`is_empty`), there is nothing to roll back: say that the load adds rows instead of replacing any.
2. **Check the route to the upload.** `begin_data_load` returns the upload URL, and the upload is a web request from the user's computer. Before you commit, make sure the session can reach that URL's host: any answer, even a refusal, shows the route works. If it can't, stop here; nothing has been deleted.
3. **Reserve the load.** `begin_data_load` takes the scope (the years, entities and scenarios the file holds, and only those: it is what gets replaced), the row count and amount total of your CSV, the `validation_token` from the clean `validate_load`, `source_grain` and `model`. It measures what the scope holds now and deletes nothing. The token is bound to the exact codes validated, so if what the file writes changes, validate again. A load over the size limit that `get_data_model` states is refused, not split.
4. **Put the confirmation to the user.** Use the `confirmation_prompt` it returns: it says what is replaced in rows and in money, and names the model as "name (code)" when the workspace has several. Add where the rollback copy is, and ask a plain yes or no. For an empty scope it says nothing will be deleted and the load adds rows. A controller recognises a wrong total at once and cannot recognise a wrong row count, so always give the money. A reserved load lasts an hour; if the answer takes longer, reserve it again before committing.

## The delete and the upload

5. **Commit.** After a yes, `commit_data_load` with `confirm_delete` true deletes the scope and arms the upload. It returns the number of rows deleted and the short-lived `upload_token`.
6. **Upload at once.** POST the CSV to the upload URL as multipart form data, in the field named `file`, with the upload token as a bearer. It is a plain web request, not a tool call, so the file never enters the conversation.
7. **Reconcile.** `get_load_status` counts what the scope holds now against what you said to expect. Report what it says in `report_to_user`, never your own count: a partial insert looks identical to a complete one from the sending side.

## When it goes wrong

- **The upload fails.** The scope is empty until the CSV lands. Check `get_load_status` before doing anything else, and tell the user at once what was removed and where the rollback copy is. A retry works only while the scope is still empty: once any rows have landed the upload refuses, because posting again on top of a partial load would duplicate those rows. If some landed, restore from the rollback copy and start again.
- **The load does not reconcile.** `report_to_user` says so; don't describe it as complete. If the scope is empty, the delete ran and nothing landed, so restore from the rollback copy rather than assuming the upload is still on its way. Otherwise don't post the CSV again; restore from the rollback copy and start again.
- **A restore** is a load of the rollback file, confirmed like any other: validate, reserve, confirm, commit, upload, reconcile.
- **Several loads from one file** run one after another, each with its own confirmation. If one fails, don't start the next until the state of the first is clear.

## After a good load

Say what was reconciled in the user's words ("48,060 rows are in place, totalling 200.0m"), and offer to check the new figures against the file's own totals with the financial-questions skill of the finstory plugin.
