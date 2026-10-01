#!/usr/bin/env node
// Checks the skills against the servers' tool names and against this plugin's own rules.
// Run from the repository root: node scripts/check-tools.mjs
//
// Why it exists: the skills name tools of two servers (finstory data admin and finstory) and a
// server change must stay compatible with the published skills. A tool that is renamed or removed
// on the server then fails here, in the change that updates scripts/tools.snapshot.json, rather
// than in a customer's conversation.
//
// It fails when:
//   - a backticked snake_case name in a skill is neither a tool nor a listed parameter/result field;
//   - a SKILL.md frontmatter is not exactly name + description, the name differs from the folder,
//     or the description is over the 1,024-character limit;
//   - a skill file contains a URL (skills carry no hosts: they point at the URLs the tools return);
//   - a relative link does not resolve, or a references/ file is not linked from its SKILL.md.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const snapshot = JSON.parse(readFileSync(join(root, 'scripts', 'tools.snapshot.json'), 'utf8'));
const dataAdminTools = new Set(snapshot.dataAdminTools);
const known = new Set([...snapshot.dataAdminTools, ...snapshot.finstoryTools, ...snapshot.knownFields]);

const errors = [];
const mentioned = new Set();
const fail = (file, line, message) => errors.push(`${relative(root, file)}${line ? `:${line}` : ''}: ${message}`);
const read = (file) => readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

function markdownFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return markdownFiles(path);
    return path.endsWith('.md') ? [path] : [];
  });
}

const skillsDir = join(root, 'skills');
const skillNames = readdirSync(skillsDir).filter((entry) => statSync(join(skillsDir, entry)).isDirectory());
if (skillNames.length === 0) errors.push('skills/: no skills found');

for (const skill of skillNames) {
  const skillFile = join(skillsDir, skill, 'SKILL.md');
  if (!existsSync(skillFile)) {
    fail(join(skillsDir, skill), 0, 'missing SKILL.md');
    continue;
  }

  const text = read(skillFile);
  const frontmatter = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!frontmatter) {
    fail(skillFile, 1, 'missing frontmatter');
  } else {
    const keys = {};
    for (const line of frontmatter[1].split('\n')) {
      const match = /^([a-z-]+):\s*(.*)$/.exec(line);
      if (!match) fail(skillFile, 0, `frontmatter line is not "key: value": ${line.slice(0, 60)}`);
      else keys[match[1]] = match[2];
    }
    const extra = Object.keys(keys).filter((key) => key !== 'name' && key !== 'description');
    if (extra.length > 0) fail(skillFile, 0, `frontmatter has keys besides name and description: ${extra.join(', ')}`);
    if (keys.name !== skill) fail(skillFile, 0, `name "${keys.name}" differs from the folder "${skill}"`);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(keys.name ?? '') || (keys.name ?? '').length > 64) {
      fail(skillFile, 0, 'name must be lowercase words joined by hyphens, at most 64 characters');
    }
    if (!keys.description) fail(skillFile, 0, 'missing description');
    else {
      if (keys.description.length > 1024) fail(skillFile, 0, `description is ${keys.description.length} characters, the limit is 1024`);
      // A plain YAML scalar cannot hold ": " or " #", and cannot start with an indicator character.
      if (/: | #/.test(keys.description)) fail(skillFile, 0, 'description contains ": " or " #", which strict YAML parsers reject in an unquoted value');
      if (/^[\[\]{}*&!|>'"%@`,?-]/.test(keys.description)) fail(skillFile, 0, 'description starts with a YAML indicator character');
    }
  }

  const linked = new Set();
  for (const file of markdownFiles(join(skillsDir, skill))) {
    const lines = read(file).split('\n');
    lines.forEach((line, index) => {
      const number = index + 1;
      if (/https?:\/\//.test(line)) fail(file, number, 'skills carry no URLs; refer to the URL a tool returns');

      for (const [, token] of line.matchAll(/`([^`\n]+)`/g)) {
        if (!/^[a-z][a-z0-9]*(_[a-z0-9]+)+$/.test(token)) continue;
        if (known.has(token)) mentioned.add(token);
        else fail(file, number, `\`${token}\` is not a known tool, parameter or result field (add it to scripts/tools.snapshot.json if it is real)`);
      }

      for (const [, target] of line.matchAll(/\]\(([^)#\s]+)(?:#[^)\s]*)?\)/g)) {
        if (/^[a-z]+:/.test(target)) continue;
        const resolved = resolve(dirname(file), target);
        if (!existsSync(resolved)) fail(file, number, `link target does not exist: ${target}`);
        else if (file === skillFile) linked.add(resolved);
      }
    });
  }

  const referencesDir = join(skillsDir, skill, 'references');
  if (existsSync(referencesDir)) {
    for (const file of markdownFiles(referencesDir)) {
      if (!linked.has(file)) fail(file, 0, 'not linked from its SKILL.md');
    }
  }
}

const unmentioned = [...dataAdminTools].filter((tool) => !mentioned.has(tool));
if (unmentioned.length > 0) {
  console.log(`Note: no skill mentions these data admin tools: ${unmentioned.join(', ')}`);
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} problem${errors.length === 1 ? '' : 's'} found.`);
  process.exit(1);
}
console.log(`OK: ${skillNames.length} skills checked.`);
