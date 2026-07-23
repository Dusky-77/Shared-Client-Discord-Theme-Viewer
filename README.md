# theme-builder-bot

A Discord bot for building, previewing, and sharing custom Discord client color themes (gradient background, colors, angle, intensity) using Components V2. Built on discord.js 14.

## Commands

| Command | Description |
|---|---|
| `/build-theme` | Opens the interactive theme builder — mode, colors, angle, intensity, live preview |
| `/theme-from-image` | Extracts a 5-color palette from an uploaded image and loads it into the builder |
| `/mythemes` | Lists your saved themes (max 5), each labeled Public or Private |
| `/presets` | Browse public themes saved by other users, paginated |
| `/delete-theme` | Delete one of your saved themes by name |

`/build-theme` has a 5-minute cooldown per user.

## Requirements

- Node.js **20.6.0 or newer** (the project uses the native `--env-file` flag; this went fully stable in v22.21.0, but works from 20.6.0 onward)
- A Discord bot application with the **applications.commands** and **bot** scopes
- Only the **Guilds** gateway intent is required — no privileged intents (Message Content, Presence, Server Members) need to be enabled in the Developer Portal

## Setup

```bash
git clone <this-repo>
cd theme-builder-bot
npm install
```

Create a `.env` file in the project root:

```
DISCORD_TOKEN=your_bot_token_here
```

Run in development (auto-restarts on file changes):

```bash
npm run dev
```

Build and run in production:

```bash
npm run build
npm start
```

Slash commands are registered globally on every bot startup (`ClientReady` → `PUT /applications/{id}/commands`). Global command updates can take up to an hour to propagate on Discord's side; this is a Discord platform limitation, not something this bot controls. If you're actively developing and want command changes to show up instantly, register to a single guild instead (`Routes.applicationGuildCommands(clientId, guildId)` in place of `Routes.applicationCommands(clientId)` in `ClientReady.ts`) and switch back to global registration once you're done testing.

## Bot permissions

Standard interaction replies (slash command responses, button/modal updates) don't require any channel permission beyond the bot being in the server. The one exception is `/build-theme`'s **Share** button, which posts the current theme to the channel via a direct message send — this needs the bot to have **Send Messages** in that channel. If that permission is missing, the Share button will fail silently rather than crash the bot.

## Dependencies of note

- **`sqlite3`** — theme storage (`themes.db`, single table `user_themes`)
- **`@napi-rs/canvas`** — renders the gradient preview image and the small swatch thumbnails shown in `/mythemes` and `/presets`
- **`colorthief` + `sharp`** — palette extraction for `/theme-from-image`. `colorthief` does the actual color quantization; `sharp` is required by `colorthief` to decode the image buffer in Node (this isn't optional — without it, `/theme-from-image` throws on every call)

### About `allowScripts` in package.json

`sqlite3` and `sharp` both compile/fetch native binaries via a postinstall script, and `esbuild` runs a postinstall step of its own. Recent npm versions (v12+) block package postinstall scripts by default unless explicitly allowed. If you install with a tool that respects this, and you see `sharp` or `sqlite3` failing to install or erroring at runtime with a missing-binary message, confirm your package manager is honoring the `allowScripts` block already in `package.json` — don't just disable the protection globally.

## Project structure

```
src/
  index.ts                 entrypoint — creates the client, wires up events, logs in
  client.ts                shared Client instance + in-memory per-user state (cooldowns, active theme state, preset page)
  types.ts                 shared types: ThemeState, SharedClientTheme, mode enum
  db.ts                    sqlite3 access — save/get/delete user themes, get public presets

  commands/
    index.ts               explicit command registry (array of {data, execute})
    theme/                 one file per slash command

  payloads/                functions that assemble the actual Components V2 message payloads
                            (kept separate from command files so button/modal handlers can
                            reuse the same builder without importing a command module)

  components/
    buttons/                one handler file per group of related buttons
    modals/                 one handler file per modal

  events/
    ClientReady.ts          registers slash commands on startup
    InteractionCreate.ts    routes incoming interactions to the right command/button/modal handler

  utils/
    canvas.ts               preview image + mini swatch generation
    palette.ts              image → color palette extraction
    contrast.ts              WCAG contrast ratio calculations (used by the Contrast Check button)
    cssExport.ts             generates the downloadable theme.css file
    errorContainer.ts        shared error-message container builder
```

Command routing is a plain object lookup (`Record<string, handlerFn>`) in `InteractionCreate.ts`, not a dynamic file loader. Adding a new button means adding one line to that object, not registering a class or writing a loader that scans the filesystem.

## Known limitations

These are real, current gaps — not fixed in this version:

- **`/presets` pagination does an extra unbounded database query on every page load.** `buildPresetsPayload` calls `getPublicPresets()` a second time with no limit, just to check whether enough presets exist to enable the "jump to page" button. This works fine at low preset counts but will get slower as the public presets table grows, since it re-fetches every row every time.
- **"Last page" in `/presets` is a sentinel hack, not a computed value.** Clicking the last-page button jumps to page `999` and relies on that page coming back empty to correctly disable further pagination. It works, but if the presets table ever exceeds `999 × 7` rows, this stops working correctly.
- **`/theme-from-image` will not always return 5 visually distinct colors.** If the source image has fewer than 5 genuinely distinct color regions (e.g. a photo with 3 dominant tones), the 5th slot may be filled with a blended in-between color rather than a 5th real color. This is expected behavior from the underlying quantization, not a bug to be "fixed" — there isn't a 5th real color to extract from an image that doesn't have one.

## License

Add a license if you intend to share or distribute this.
