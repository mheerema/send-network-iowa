import assert from "node:assert/strict";
import test, { describe } from "node:test";
import { isPublished, todayInPublishZone } from "./articles.ts";

/**
 * The scheduled-publishing boundary. Run with `npm test`.
 *
 * Every case injects `now` as an absolute instant (UTC `Z` literals) and
 * asserts what Iowa's calendar says at that instant. Nothing here reads the
 * host clock or the host timezone, so the results are the same on a laptop in
 * Des Moines and on a Vercel builder running UTC.
 */

// 2026-08-14 00:00:00 CDT (UTC-5). Iowa's midnight on a summer publish day.
const IOWA_MIDNIGHT_AUG_14 = "2026-08-14T05:00:00Z";
// 2026-01-15 00:00:00 CST (UTC-6). Same boundary outside daylight time.
const IOWA_MIDNIGHT_JAN_15 = "2026-01-15T06:00:00Z";

describe("todayInPublishZone", () => {
  test("reports Iowa's calendar day, not UTC's", () => {
    // 21:00 CDT on the 13th is already the 14th in UTC. Iowa governs.
    assert.equal(todayInPublishZone(new Date("2026-08-14T02:00:00Z")), "2026-08-13");
  });

  test("rolls over exactly at Iowa midnight (CDT)", () => {
    assert.equal(
      todayInPublishZone(new Date("2026-08-14T04:59:59Z")),
      "2026-08-13",
    );
    assert.equal(todayInPublishZone(new Date(IOWA_MIDNIGHT_AUG_14)), "2026-08-14");
  });

  test("rolls over exactly at Iowa midnight (CST)", () => {
    assert.equal(
      todayInPublishZone(new Date("2026-01-15T05:59:59Z")),
      "2026-01-14",
    );
    assert.equal(todayInPublishZone(new Date(IOWA_MIDNIGHT_JAN_15)), "2026-01-15");
  });

  test("always returns a zero-padded YYYY-MM-DD", () => {
    // Single-digit month and day: unpadded output would break the string
    // compare that the whole gate rests on.
    assert.equal(todayInPublishZone(new Date("2026-03-05T18:00:00Z")), "2026-03-05");
    assert.match(todayInPublishZone(new Date("2026-03-05T18:00:00Z")), /^\d{4}-\d{2}-\d{2}$/);
  });

  test("survives the DST spring-forward gap", () => {
    // 2026-03-08: Iowa jumps 01:59 CST -> 03:00 CDT. There is no 02:30 local.
    assert.equal(todayInPublishZone(new Date("2026-03-08T07:59:59Z")), "2026-03-08");
    assert.equal(todayInPublishZone(new Date("2026-03-08T08:00:00Z")), "2026-03-08");
  });

  test("survives the DST fall-back repeat", () => {
    // 2026-11-01: 01:00-02:00 local happens twice. Neither pass changes the day.
    assert.equal(todayInPublishZone(new Date("2026-11-01T06:30:00Z")), "2026-11-01");
    assert.equal(todayInPublishZone(new Date("2026-11-01T07:30:00Z")), "2026-11-01");
  });
});

describe("isPublished", () => {
  test("a post dated today is live for the whole Iowa day", () => {
    assert.equal(isPublished("2026-08-14", new Date(IOWA_MIDNIGHT_AUG_14)), true);
    assert.equal(isPublished("2026-08-14", new Date("2026-08-15T04:59:59Z")), true);
  });

  test("a post dated tomorrow is not live one second before Iowa midnight", () => {
    assert.equal(isPublished("2026-08-14", new Date("2026-08-14T04:59:59Z")), false);
  });

  test("does not publish a day early on the UTC rollover", () => {
    // The failure mode this gate exists to prevent: 2026-08-14T00:00Z is still
    // 2026-08-13 19:00 in Iowa, so the 14th's post must stay hidden.
    assert.equal(isPublished("2026-08-14", new Date("2026-08-14T00:00:00Z")), false);
  });

  test("past-dated posts stay published", () => {
    assert.equal(isPublished("2026-06-16", new Date(IOWA_MIDNIGHT_AUG_14)), true);
    assert.equal(isPublished("1999-12-31", new Date(IOWA_MIDNIGHT_AUG_14)), true);
  });

  test("far-future posts stay unpublished", () => {
    assert.equal(isPublished("2030-01-01", new Date(IOWA_MIDNIGHT_AUG_14)), false);
  });

  test("gates Matt's seven-day queue one day at a time", () => {
    const queue = [
      "2026-08-13",
      "2026-08-14",
      "2026-08-15",
      "2026-08-16",
      "2026-08-17",
      "2026-08-18",
      "2026-08-19",
    ];

    // Walk Iowa midnight forward one day at a time; the live count should be
    // exactly 1, 2, 3, ... never a jump and never an off-by-one.
    queue.forEach((day, index) => {
      const iowaMidnight = new Date(`${day}T05:00:00Z`);
      const live = queue.filter((d) => isPublished(d, iowaMidnight));
      assert.equal(
        live.length,
        index + 1,
        `at Iowa midnight on ${day}, expected ${index + 1} live post(s), got ${live.length}`,
      );
      assert.equal(live.at(-1), day);
    });
  });
});
