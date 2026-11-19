#!/usr/bin/env node
// Validates sources.json: shape, required fields, a known reuse tier and kind
// on every entry, the condition on every check-licence entry, unique ids, no
// duplicate urls, no entry that is both listed and rejected, and a reading
// note on every licence. With --links it also asks each url for a response, which
// needs the network; a browse-only url is skipped, never fetched.
//
// Exit 0 clean, 1 a problem in the file, 2 the file could not be read.
"use strict";

const fs = require("fs");
const path = require("path");

const file = process.argv[2] || path.join(__dirname, "..", "sources.json");
const checkLinks = process.argv.includes("--links");

let data;
try {
  data = JSON.parse(fs.readFileSync(file, "utf8"));
} catch (error) {
  console.error(`cannot read ${file}: ${error.message}`);
  process.exit(2);
}

const problems = [];
const REQUIRED = ["id", "url", "tier", "kind", "for", "stack", "licence"];
// The reuse tier says what may be copied; sources.json.tiers says what each means.
const TIERS = ["use", "credit", "check-licence", "inspiration", "browse-only"];
const KINDS = ["component", "screen", "pattern", "motion", "video", "shader", "gallery", "ruleset"];

if (data.version !== 1) problems.push(`version must be 1, found ${JSON.stringify(data.version)}`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(data.updated || "")) problems.push("updated must be a YYYY-MM-DD date");

const seenId = new Map();
const seenUrl = new Map();

if (data.tiers !== undefined && Object.keys(data.tiers).join() !== TIERS.join()) {
  problems.push(`tiers must define exactly ${TIERS.join(", ")}, in that order`);
}

if (!Array.isArray(data.sources)) {
  problems.push("sources must be an array");
} else {
  data.sources.forEach((entry, index) => {
    const where = `sources[${index}]`;
    for (const field of REQUIRED) {
      if (entry[field] === undefined || entry[field] === "") problems.push(`${where} has no ${field}`);
    }
    if (entry.tier && !TIERS.includes(entry.tier)) problems.push(`${where} has unknown tier "${entry.tier}"`);
    if (entry.kind && !KINDS.includes(entry.kind)) problems.push(`${where} has unknown kind "${entry.kind}"`);
    // A check-licence entry is usable only once the user knows the condition.
    if (entry.tier === "check-licence" && !entry.condition) problems.push(`${where} is check-licence with no condition saying what to check`);
    if (entry.tier === "credit" && !entry.credit) problems.push(`${where} is credit with no credit saying where the attribution goes`);
    // A licence with no note cannot be told apart from a guess.
    if (!entry["licence-read"]) problems.push(`${where} has no licence-read note saying where the licence was read`);
    if (entry.for !== undefined && !Array.isArray(entry.for)) problems.push(`${where}.for must be an array`);
    if (Array.isArray(entry.for) && entry.for.length === 0) problems.push(`${where}.for is empty`);
    if (entry.url && !/^https?:\/\//.test(entry.url)) problems.push(`${where}.url is not a url`);
    // A registry url is a template the search script fills in.
    if (entry.registry && !entry.registry.includes("{name}")) {
      problems.push(`${where}.registry must contain {name}`);
    }
    if (entry.catalogue && !/^https?:\/\//.test(entry.catalogue)) {
      problems.push(`${where}.catalogue is not a url`);
    }
    if (entry.id) {
      if (seenId.has(entry.id)) problems.push(`${where}.id "${entry.id}" repeats ${seenId.get(entry.id)}`);
      else seenId.set(entry.id, where);
    }
    if (entry.url) {
      if (seenUrl.has(entry.url)) problems.push(`${where}.url repeats ${seenUrl.get(entry.url)}`);
      else seenUrl.set(entry.url, where);
    }
  });
}

if (!Array.isArray(data.rejected)) {
  problems.push("rejected must be an array");
} else {
  data.rejected.forEach((entry, index) => {
    const where = `rejected[${index}]`;
    if (!entry.url) problems.push(`${where} has no url`);
    if (!entry.reason) problems.push(`${where} has no reason`);
    if (entry.url && seenUrl.has(entry.url)) problems.push(`${where} is also listed at ${seenUrl.get(entry.url)}`);
  });
}

const report = (code) => {
  if (problems.length === 0) {
    const counted = (list) => (data[list] || []).length;
    const searchable = (data.sources || []).filter((entry) => entry.registry).length;
    // A licence-read note proves somebody looked. It does not prove they
    // found a licence, and `--curated-only` is not a licence filter, so the
    // count of unread licences belongs in the verdict rather than in nobody's
    // head. Not a problem: an unlicensed source is a decision for the user.
    // Only tiers that allow copying count: nothing is taken from an
    // inspiration or browse-only source, so its licence decides nothing.
    const unread = (data.sources || [])
      .filter((entry) => !["inspiration", "browse-only"].includes(entry.tier))
      .filter((entry) => /not (stated|read|found)|no component licence/i.test(String(entry.licence || "")));
    console.log(
      `sources.json: ${counted("sources")} sources ` +
      `(${searchable} searchable), ${counted("rejected")} rejected, no problems`,
    );
    if (unread.length) {
      console.log(
        `  ${unread.length} with no licence read, which needs the user's decision before shipping: ` +
        unread.map((entry) => entry.id).join(", "),
      );
    }
  } else {
    for (const problem of problems) console.error(problem);
  }
  process.exit(problems.length ? 1 : code);
};

if (!checkLinks) report(0);

(async () => {
  // A browse-only site's owner blocks agents, so it is never fetched, even here.
  const blocked = new Set((data.sources || []).filter((entry) => entry.tier === "browse-only").map((entry) => entry.url));
  for (const url of blocked) console.log(`not fetched: browse-only ${url}`);
  const urls = [...seenUrl.keys()].filter((url) => !blocked.has(url));
  await Promise.all(urls.map(async (url) => {
    try {
      const response = await fetch(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(15000) });
      if (!response.ok) problems.push(`${url} answered ${response.status}`);
    } catch (error) {
      problems.push(`${url} did not answer: ${error.message}`);
    }
  }));
  report(0);
})();
