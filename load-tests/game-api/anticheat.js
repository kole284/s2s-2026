// Scenario 5: anti-cheat. submit-score odbija kad je (server) elapsed od
// start-run manji od minPlausibleMs = max(floor*47, combo*140) / 3.
// 7 zahteva, 1 VU. Pozitivna kontrola upisuje max_floor=150 u seedovan
// red (username NULL → nije na rang listi; cleanup ga briše).
//
// k6 run -e STAGE=full -e CONFIRM_PROJECT=wxyfuchsoajohqkmflwj load-tests/game-api/anticheat.js

import { check, sleep } from "k6";
import { STAGE, codesFor } from "../lib/config.js";
import { jsonOf, sessionFor, startRun, submitScore } from "../lib/game.js";

if (STAGE !== "full") {
  throw new Error("anticheat.js se pušta samo sa STAGE=full");
}

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    checks: ["rate==1"],
    http_req_failed: ["rate==0"],
  },
};

const minPlausibleMs = (floor, combo) => Math.max(floor * 47, combo * 140) / 3;

function runToken(session) {
  const token = jsonOf(startRun(session)).runToken;
  if (!token) throw new Error("start-run nije vratio runToken");
  return token;
}

function expectRejected(res, label) {
  check(res, {
    [`${label}: 400`]: (r) => r.status === 400,
    [`${label}: "Nevažeći rezultat."`]: () => jsonOf(res).error === "Nevažeći rezultat.",
  });
}

export default function () {
  const [code] = codesFor("anticheat");
  const session = sessionFor(code);

  // 1) Nemoguće brzo: odmah posle start-run.
  //    floor=600 traži 9400ms, combo=300 traži 14000ms.
  const fast = runToken(session);
  expectRejected(
    submitScore(session, fast, 0, 600, 0, { expected: [400] }),
    `floor=600 posle ~0s (treba ${minPlausibleMs(600, 0)}ms)`,
  );
  expectRejected(
    submitScore(session, fast, 0, 0, 300, { expected: [400] }),
    `combo=300 posle ~0s (treba ${minPlausibleMs(0, 300)}ms)`,
  );

  // 2) Granica: floor=150 traži 2350ms. Isti token (odbijanje ga ne troši):
  //    odmah → odbijeno; posle 4s → prihvaćeno.
  const edge = runToken(session);
  const started = Date.now();
  expectRejected(
    submitScore(session, edge, 0, 150, 0, { expected: [400] }),
    `floor=150 pre praga (treba ${minPlausibleMs(150, 0)}ms)`,
  );

  sleep(Math.max(0, 4 - (Date.now() - started) / 1000));

  const ok = submitScore(session, edge, 0, 150, 0, { expected: [200] });
  check(ok, {
    "floor=150 posle ~4s: 200": (r) => r.status === 200,
    "floor=150 upisan kao maxFloor": () => jsonOf(ok).user?.maxFloor === 150,
  });
}
