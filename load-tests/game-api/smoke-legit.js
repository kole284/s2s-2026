// Smoke: legitiman tok za 2 seedovana koda + 3 negativne sanity provere.
// Ukupno 12 zahteva, 1 VU, 1 iteracija. Upisi su no-op (score/floor/combo = 0,
// greatest() ne menja red); jedini trag je `run-redeem:` red u rate_limit.
//
// k6 run -e STAGE=smoke -e CONFIRM_PROJECT=wxyfuchsoajohqkmflwj load-tests/game-api/smoke-legit.js

import { check, sleep } from "k6";
import { STAGE, FORBIDDEN_ORIGIN, codesFor } from "../lib/config.js";
import {
  gameApi,
  getUser,
  jsonOf,
  leaderboard,
  login,
  startRun,
  submitScore,
} from "../lib/game.js";

if (STAGE !== "smoke") {
  throw new Error("smoke-legit.js se pušta samo sa STAGE=smoke");
}

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    checks: [{ threshold: "rate==1", abortOnFail: true }],
    http_req_failed: ["rate==0"],
    // Smoke hvata i cold start, zato je prag labaviji od full testa (800ms).
    http_req_duration: ["p(95)<2000"],
    // Pragovi po akciji su tu da bi k6 prikazao latenciju po akciji u summary-ju.
    "http_req_duration{action:leaderboard}": ["p(95)<5000"],
    "http_req_duration{action:login}": ["p(95)<5000"],
    "http_req_duration{action:user}": ["p(95)<5000"],
    "http_req_duration{action:start-run}": ["p(95)<5000"],
    "http_req_duration{action:submit-score}": ["p(95)<5000"],
  },
};

function legitFlow(code, label) {
  const loginRes = login(code);
  const loginBody = jsonOf(loginRes);
  check(loginRes, {
    [`${label} login 200`]: (r) => r.status === 200,
    [`${label} login ima sessionToken`]: () => typeof loginBody.sessionToken === "string",
    [`${label} login needsProfile (username NULL)`]: () => loginBody.needsProfile === true,
  });
  const sessionToken = loginBody.sessionToken;
  if (!sessionToken) return;

  const userRes = getUser(sessionToken);
  check(userRes, {
    [`${label} user 200`]: (r) => r.status === 200,
    [`${label} user vraća isti kod`]: () => jsonOf(userRes).user?.userCode === code,
  });

  const runRes = startRun(sessionToken);
  const runToken = jsonOf(runRes).runToken;
  check(runRes, {
    [`${label} start-run 200`]: (r) => r.status === 200,
    [`${label} start-run ima runToken`]: () => typeof runToken === "string",
  });
  if (!runToken) return;

  // floor=0/combo=0 → minPlausibleMs = 0, ali ostavljamo realnu pauzu.
  sleep(1);

  const scoreRes = submitScore(sessionToken, runToken, 0, 0, 0);
  const scoreBody = jsonOf(scoreRes);
  check(scoreRes, {
    [`${label} submit-score 200`]: (r) => r.status === 200,
    [`${label} submit-score nije nov rekord`]: () => scoreBody.isNewHighScore === false,
    [`${label} highScore ostao 0`]: () => scoreBody.user?.highScore === 0,
  });
}

export default function () {
  const lbRes = leaderboard();
  const lbBody = jsonOf(lbRes);
  check(lbRes, {
    "leaderboard 200": (r) => r.status === 200,
    "leaderboard je niz": () => Array.isArray(lbBody.leaderboard),
    "nema LOADTEST_ na rang listi": () =>
      (lbBody.leaderboard ?? []).every((e) => !String(e.username).startsWith("LOADTEST_")),
  });

  const [codeA, codeB] = codesFor("smoke");
  legitFlow(codeA, "A");
  legitFlow(codeB, "B");

  // Negativne sanity provere, da znamo da guard i CORS rade kako očekujemo.
  const noOrigin = gameApi({ action: "leaderboard" }, { origin: null, expected: [403] });
  check(noOrigin, {
    "bez Origin → 403": (r) => r.status === 403,
    "bez Origin poruka": () => jsonOf(noOrigin).error === "Origin not allowed",
  });

  const badOrigin = gameApi(
    { action: "leaderboard" },
    { origin: FORBIDDEN_ORIGIN, expected: [403] },
  );
  check(badOrigin, {
    "zabranjen Origin → 403": (r) => r.status === 403,
    "zabranjen Origin nema CORS header": (r) => !r.headers["Access-Control-Allow-Origin"],
  });

  const unknown = gameApi({ action: "nepostojeca" }, { expected: [400] });
  check(unknown, {
    "nepoznata akcija → 400": (r) => r.status === 400,
    "nepoznata akcija poruka": () => jsonOf(unknown).error === "Nepoznata akcija.",
  });
}
