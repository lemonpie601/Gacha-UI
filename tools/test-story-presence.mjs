import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../extension.js", import.meta.url), "utf8");
const start = source.indexOf("  function storyCastAt(");
const end = source.indexOf("  function storySnapshot(", start);
const presence = new Function("MAX_STORY_CAST", source.slice(start, end) + "; return storyCastAt;")(3);
const cast = [
  { name: "령", prota: true, art: "/a" },
  { name: "경운", art: "/b" },
  { name: "백우", art: "/c" },
  { name: "단서", art: "/d" },
];
const names = (segments, at = segments.length - 1) => presence(segments, at, cast).map((c) => c.name);
assert.deepEqual(names([{ text: "시작", place: "장터" }]), []);
assert.deepEqual(names([{ speaker: "령", place: "장터" }, { speaker: "경운" }]), ["령", "경운"]);
assert.deepEqual(names([{ speaker: "령", place: "장터" }, { speaker: "경운" }, { text: "경운은 밖으로 나갔다." }]), ["령"]);
assert.deepEqual(names([{ speaker: "령", place: "장터" }, { speaker: "경운" }, { text: "창고로 이동했다.", place: "창고" }]), []);
assert.deepEqual(names([{ speaker: "령", place: "장터" }, { speaker: "경운", place: "창고" }]), ["경운"]);
assert.deepEqual(names([{ text: "백우가 들어왔다." }]), ["백우"]);
assert.deepEqual(names([{ speaker: "령" }, { text: "령은 나가지 말라고 말했다." }]), ["령"]);
assert.deepEqual(names(cast.map((c) => ({ speaker: c.name }))), ["경운", "백우", "단서"]);
assert.deepEqual(names([{ speaker: "령" }, { speaker: "경운" }], 0), ["령"]);
assert.deepEqual(names([{ speaker: "you" }]), ["령"]);
console.log("story presence behavior: 10 cases passed");
