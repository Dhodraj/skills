#!/usr/bin/env python3
"""Lint a wiki folder: index coverage, dead links, home paths, undated present-tense claims.

Usage: python3 -I lint-wiki.py <wiki-dir>     Exit 0 clean, 1 errors found, 2 usage error.
       python3 -I lint-wiki.py --self-test
"""
import os, re, subprocess, sys, tempfile

LINK = re.compile(r"\[[^\]]*\]\(([^)#\s]+)(?:#[^)]*)?\)")
DATE = re.compile(r"\d{4}-\d{2}-\d{2}|@[0-9a-f]{7,40}")
PRESENT = re.compile(r"\b(currently|now)\b(?<!for now)", re.I)


def prose(path):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    text = re.sub(r"```.*?```", "", text, flags=re.S)  # code is examples, not claims or links
    return re.sub(r"`[^`\n]*`", "", text)


def links(text):
    return [m.group(1) for m in LINK.finditer(text) if not re.match(r"[a-z][a-z0-9+.-]*:", m.group(1))]


def lint(wiki):
    wiki = os.path.normpath(wiki)
    index = os.path.join(wiki, "index.md")
    if not os.path.isfile(index):
        return [f"{index}: missing"], []
    errors, advisories = [], []
    pages = sorted(f for f in os.listdir(wiki) if f.endswith(".md") and f != "index.md")
    listed = set()
    for name in ["index.md"] + pages:
        text = prose(os.path.join(wiki, name))
        for target in links(text):
            if target.startswith("~"):
                errors.append(f"{name}: home path {target}; a committed wiki holds no private paths")
                continue
            resolved = os.path.normpath(os.path.join(wiki, target))
            if not os.path.exists(resolved):
                errors.append(f"{name}: dead link {target}")
            elif name == "index.md" and os.path.dirname(resolved) == wiki:
                listed.add(os.path.basename(resolved))
        if name != "index.md":
            for para in re.split(r"\n\s*\n", text):
                if PRESENT.search(para) and not DATE.search(para):
                    advisories.append(f"{name}: undated present tense: {' '.join(para.split())[:80]}")
    errors += [f"index.md: does not list {p}" for p in pages if p not in listed]
    return errors, advisories


def self_test():
    with tempfile.TemporaryDirectory() as d:
        e, _ = lint(d)
        assert e and e[0].endswith("index.md: missing"), e
        w = lambda n, t: open(os.path.join(d, n), "w").write(t)
        os.mkdir(os.path.join(d, "decisions")); w(os.path.join("decisions", "auth.md"), "x")
        w("index.md", "## A\n- [a](a.md): one\n- [gone](gone.md): two\n- [rec](decisions/auth.md)\n- [web](https://x.io/y)\n")
        w("auth.md", "On 2026-11-24 the token\nis now refreshed.\n")
        w("a.md", "It is currently fast.\n\nFor now, see `[c](c.md)` and [h](~/secret.md).\n\n```\nnow() [ex](nope.md)\n```\n")
        e, a = lint(d)
        assert "index.md: dead link gone.md" in e, e
        assert "index.md: does not list auth.md" in e, e  # a link outside the wiki does not list a page
        assert any("home path ~/secret.md" in x for x in e), e
        assert len(e) == 3, e  # URL, inline-code and fenced links are skipped
        assert [x for x in a if x.startswith("a.md")] == ["a.md: undated present tense: It is currently fast."], a
        assert not any(x.startswith("auth.md") for x in a), a  # date in the same paragraph counts
        script = os.path.abspath(__file__)
        rc = lambda *args: subprocess.run([sys.executable, "-I", script, *args], capture_output=True).returncode
        assert rc(d) == 1 and rc() == 2, "exit codes"
        os.remove(os.path.join(d, "index.md")); os.remove(os.path.join(d, "a.md")); os.remove(os.path.join(d, "auth.md"))
        w("index.md", "## A\n")
        assert rc(d) == 0, "clean wiki exits 0"
    print("self-test ok")


if __name__ == "__main__":
    if sys.argv[1:] == ["--self-test"]:
        self_test(); sys.exit(0)
    if len(sys.argv) != 2 or not os.path.isdir(sys.argv[1]):
        print(__doc__.strip(), file=sys.stderr); sys.exit(2)
    errs, advs = lint(sys.argv[1])
    for x in errs: print("error:", x)
    for x in advs: print("advisory:", x)
    print(f"{len(errs)} errors, {len(advs)} advisories")
    sys.exit(1 if errs else 0)
