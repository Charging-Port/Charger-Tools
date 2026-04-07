#!/usr/bin/env node

import fs from "fs";
import path from "path";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  console.log("\n  Create a new blog post\n");

  const title = await ask("  Title: ");
  const category = (await ask("  Category (Hardware/Software/Personal): ")) || "General";
  const excerpt = await ask("  Excerpt (one-liner): ");

  const slug = slugify(title);
  const date = new Date().toISOString().split("T")[0];
  const dir = path.join(process.cwd(), "content/blog");
  const filepath = path.join(dir, `${slug}.md`);

  if (fs.existsSync(filepath)) {
    console.log(`\n  File already exists: content/blog/${slug}.md\n`);
    rl.close();
    return;
  }

  const content = `---
title: "${title}"
date: "${date}"
category: "${category}"
excerpt: "${excerpt}"
---

Write your post here...
`;

  fs.writeFileSync(filepath, content, "utf8");
  console.log(`\n  Created: content/blog/${slug}.md`);
  console.log(`  Open in your editor and start writing!\n`);
  rl.close();
}

main();
