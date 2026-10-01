# finstory data admin plugin for Claude

The finstory data admin plugin for Claude, from Finstory, Inc. It connects Claude to your company's finstory workspace so you can load budgets, forecasts and actuals from a file, restate your accounts a second way, and build a model from a source system such as NetSuite or Adaptive, all from a Claude conversation.

The plugin bundles two things:

- **The finstory data admin connector**, a remote MCP server at `https://mcp.finstory.ai/mcp-data-admin`. Its tools read how your workspace is set up, load files of figures, add accounts and subtotals, create and configure models, connect source systems and schedule their loads. Every call is checked against your own finstory role.
- **Three skills** that tell Claude how to do these jobs carefully: how to load a file, how to restate accounts under another structure, and how to build a model from a source system.

This plugin is separate from the [finstory plugin](https://github.com/finstory-ai/finstory-claude-plugin), which answers questions about your numbers and builds reports and board stories. Install both to go from loading data to a finished report in one conversation.

## Requirements

- A finstory subscription, and a finstory login with access to your company's workspace.
- A finstory role that may load data and change models. Creating, changing or syncing connections to source systems, and creating, changing or running schedules, needs an administrator. Claude tells you when a step needs a role you don't have.
- A paid Claude plan.
- To load a file, Claude must read it on your computer and send the finished CSV to finstory, so the session needs local files, code execution and web access, as in Claude Code or Cowork. In a plain claude.ai chat Claude can check a file against your workspace but cannot load it.
- In claude.ai and the desktop app, skills need **Code execution and file creation** switched on in Claude's settings. The skills themselves run no code; the setting is what lets Claude load skills.
- On a Team or Enterprise plan, an Owner adds or allows the finstory data admin connector for the organization.

## Install

This repository is also a plugin marketplace named `finstory-data-admin`, so you add it by its GitHub name, `finstory-ai/finstory-data-admin-claude-plugin`.

### Claude on the web and desktop (chat and Cowork)

1. Go to **Customize > Plugins > Add**.
2. Choose **Add marketplace** and enter `finstory-ai/finstory-data-admin-claude-plugin`, then install **finstory data admin**. Alternatively, choose **Upload plugin** and upload a zip of this repository.

On a Team or Enterprise plan, an Owner can install it for the organization from **Organization settings > Plugins**.

### Claude Code

```bash
claude plugin marketplace add finstory-ai/finstory-data-admin-claude-plugin
claude plugin install finstory-data-admin@finstory-data-admin
```

### Connect finstory data admin

After installing, open the plugin's **Connectors** tab, connect **finstory-data-admin**, and sign in with your finstory login at `app.finstory.ai`. The sign-in screen lists what this connector can do. It is a separate sign-in from the finstory connector. In Claude Code, run `/mcp` and authenticate the finstory-data-admin server. If Claude says the finstory data admin tools are not available, this step has not been completed yet.

## Skills

| Skill | What it does |
| --- | --- |
| `load-data` | Loads a budget, forecast, plan, re-forecast, actuals or a correction to one period from a workbook or CSV. Reads and profiles the file on your computer, matches it to your accounts, scenarios and entities, asks about whatever the numbers can't settle, shows what the load will replace in rows and money, and loads only after you confirm. |
| `restate-structure` | Reads the same accounts a second way, from a mapping you supply: a management P&L, a covenant pack, a lender's balance sheet. Shows the structure as an outline for approval, builds it, links your existing accounts under it, and checks the totals against the mapping. Nothing is copied and nothing moves. |
| `build-model` | Builds a new model from a source system: creates the model, connects the source (you type its first login yourself), previews and runs the sync and the loads, creates the scenarios, checks the figures, and can keep the model current on a schedule. |

Claude picks the right skill from your request. You can also name it, for example "use the finstory load-data skill".

## Example prompts

1. "Load the attached 2027 budget workbook into finstory. Check it against our accounts first and ask me about anything you can't tell from the numbers."
2. "This forecast file holds a base case and an upside. Tell me what you see before you load anything."
3. "Here is our lender's balance sheet mapping. Restate our accounts under it and show me the structure before you build it."
4. "Set up a new model from our NetSuite connection, with this year's actuals. Show me what each step replaces before you run it."
5. "Load last month's actuals from NetSuite on the third working day of every month."

## Data and privacy

- **The plugin itself contains only instructions.** The skills are text files. The plugin runs no code, stores nothing and contacts nothing on its own. The `scripts/` folder is maintainer tooling that Claude does not load.
- **The bundled connector** sends tool calls only to `https://mcp.finstory.ai`, on your behalf, after you sign in with your finstory login. A call your role doesn't allow is refused.
- **Your file stays on your computer.** Claude reads it locally and sends the connector only a summary of it (counts, and a few sample values per column) and the list of codes it would write, to profile and check it. The finished CSV goes to finstory when you have confirmed the load.
- **What the connector can change:** it replaces data (a load replaces the figures for the years, entities and scenarios the file covers), adds accounts, scenarios and other items, links accounts under new subtotals without copying them, creates and configures models, connects source systems, and runs syncs, loads and schedules. A schedule keeps replacing figures each time it runs.
- **Confirmation and copies:** every connector tool is marked as read-only, additive, or able to overwrite, so Claude can ask for your approval before a change runs, depending on your Claude settings. The skills tell Claude to show what a load will replace, in rows and amounts, and to write a copy of it to your computer, before anything is deleted. There is no undo button for a load.
- **Privacy policy:** https://finstory.ai/privacy#finstory-in-claude
- **Documentation:** https://finstory.ai/docs/claude

## Support and security

- **Support:** support@finstory.ai
- **Security issues:** see [SECURITY.md](SECURITY.md) (security@finstory.ai, https://finstory.ai/security#report).

## License

Apache License 2.0. See [LICENSE](LICENSE). Copyright Finstory, Inc.

finstory is a product of Finstory, Inc.
