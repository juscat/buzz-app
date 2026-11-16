// The Buzz base prompt every agent harness plugin gives its agents, before
// its own instructions, and what a turn a mention or DM starts adds to it.
import basePrompt from "./base_prompt.md?raw";
import mentionPrompt from "./mention_prompt.md?raw";

export const BASE_PROMPT = basePrompt.trim();

/** What the base prompt's Workspace Layout says of the working directory,
 * and what it says instead in a conversation working in a folder of its
 * own, where `{workspace}` is the agent's workspace. */
const OWN_FOLDER = [
  [
    "Your persistent workspace is in your working directory:",
    "Your persistent workspace is at `{workspace}`, not in your working directory, which is this conversation's own folder:",
  ],
  [
    "Default source checkouts; `<community-repositories>` may replace this location. Use existing checkouts before cloning, and follow the working-location rules below",
    "Source checkouts for other work; this conversation works in its own folder. `<community-repositories>` may replace this source-checkout location, not the conversation's folder",
  ],
  [
    "When the working directory is assigned to this conversation, or the chat names project folders (in its workspace Canvas or referenced folders), work there and follow their rules; do not create another worktree unless those rules ask for one. Otherwise,",
    "Work in this conversation's own folder or the chat's explicit project folders and follow their rules; do not create another worktree unless those rules ask for one. For other work,",
  ],
  [
    "See `AGENTS.md` in your working directory for full workspace conventions.",
    "See `AGENTS.md` in your workspace for full workspace conventions.",
  ],
  [
    "These paths are relative to your working directory — start there for your own files rather than scanning `$HOME` or `/`.",
    "These paths are relative to your workspace — start there for your own files rather than scanning `$HOME` or `/`. Keep them there; do not create them in your working directory.",
  ],
] as const;

/** The base prompt, for a conversation in a folder of its own when
 * `workspace`, the agent's workspace as an absolute path, is given. */
export function basePromptFor(workspace?: string) {
  if (!workspace) return BASE_PROMPT;
  return OWN_FOLDER.reduce((text, [from, to]) => {
    if (!text.includes(from))
      throw new Error(`The base prompt no longer says: ${from}`);
    return text.replace(from, () => to.replace("{workspace}", () => workspace));
  }, BASE_PROMPT);
}

/** Shown with each turn a mention or DM starts, and with each message that
 * arrives while one runs: what the agent owes it. Watch, timer and wake
 * turns do not get it; their own sections say what to publish. */
export const MENTION_PROMPT = mentionSection();

/** The `<mention>` section, with a harness's own rules for a mention added. */
export function mentionSection(extra = "") {
  const body = [mentionPrompt, extra]
    .map((part) => part.trim())
    .filter(Boolean);
  return `<mention>\n${body.join("\n\n")}\n</mention>`;
}
