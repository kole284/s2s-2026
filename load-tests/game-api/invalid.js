// Scenario 4: nevalidni podaci → tačan status i tačna poruka iz game-api/index.ts.
// ~20 zahteva, 1 VU. Jedini upis je jedan submit-score 0/0/0 (no-op) za
// proveru dvostrukog slanja; update-profile slučajevi padaju pre upisa.
//
// k6 run -e STAGE=full -e CONFIRM_PROJECT=wxyfuchsoajohqkmflwj load-tests/game-api/invalid.js

import { check } from "k6";
import { STAGE, codesFor } from "../lib/config.js";
import { gameApi, jsonOf, sessionFor, startRun, submitScore } from "../lib/game.js";

if (STAGE !== "full") {
  throw new Error("invalid.js se pušta samo sa STAGE=full");
}

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    // Bez abortOnFail: pao check je nalaz, hoćemo sve nalaze u jednom prolazu.
    checks: ["rate==1"],
    http_req_failed: ["rate==0"],
  },
};

function expectError(res, label, status, message) {
  check(res, {
    [`${label}: ${status}`]: (r) => r.status === status,
    [`${label}: "${message}"`]: () => jsonOf(res).error === message,
  });
}

function runTokenFor(sessionToken) {
  const token = jsonOf(startRun(sessionToken)).runToken;
  if (!token) throw new Error("start-run nije vratio runToken");
  return token;
}

// Menja poslednji znak potpisa: base64url ostaje ispravan, HMAC više ne.
function tamper(token) {
  const last = token.slice(-1);
  return token.slice(0, -1) + (last === "A" ? "B" : "A");
}

export default function () {
  const [codeA, codeB] = codesFor("invalid");
  const sessionA = sessionFor(codeA);
  const sessionB = sessionFor(codeB);
  const tokenA = runTokenFor(sessionA);
  const tokenB = runTokenFor(sessionB);

  const bad = (body, status = 400) => gameApi(body, { expected: [status] });
  const score = (runToken, s, f, c, status = 400) =>
    submitScore(sessionA, runToken, s, f, c, { expected: [status] });

  // --- identitet i sesija ---
  expectError(
    bad({ action: "user", sessionToken: "abc.def" }, 401),
    "loš sessionToken", 401, "Sesija je istekla. Prijavite se ponovo.",
  );
  expectError(
    bad({ action: "user" }),
    "bez koda i sesije", 400, "Nevažeći format pristupnog koda.",
  );

  // --- run token ---
  expectError(
    bad({ action: "submit-score", sessionToken: sessionA, score: 0 }),
    "bez runToken", 400, "Nedostaje token partije.",
  );
  expectError(score(tamper(tokenA), 0, 0, 0), "izmenjen runToken", 400,
    "Nevažeći ili istekao token partije.");
  expectError(score(tokenB, 0, 0, 0), "runToken drugog koda", 400,
    "Nevažeći ili istekao token partije.");

  // --- vrednosti (validacija je pre limitera i ne troši token) ---
  expectError(score(tokenA, -1, 0, 0), "score -1", 400, "Nevažeći rezultat.");
  expectError(score(tokenA, 250001, 0, 0), "score 250001", 400, "Nevažeći rezultat.");
  expectError(score(tokenA, "abc", 0, 0), "score string", 400, "Nevažeći rezultat.");
  expectError(score(tokenA, 1.5, 0, 0), "score 1.5", 400, "Nevažeći rezultat.");
  expectError(score(tokenA, 0, 601, 0), "floor 601", 400, "Nevažeći sprat.");
  expectError(score(tokenA, 0, 2.5, 0), "floor 2.5", 400, "Nevažeći sprat.");
  expectError(score(tokenA, 0, 0, 301), "combo 301", 400, "Nevažeći combo.");

  // Envelope: score=1000 uz floor=0/combo=0 prolazi edge validaciju i
  // anti-cheat, ali krši result_score_envelope u bazi. Očekivano ponašanje je
  // 400; ako stigne 500, to je nalaz (edge ne proverava envelope sam).
  const envelope = score(tokenA, 1000, 0, 0, 400);
  check(envelope, {
    "envelope prekršen: 400 (500 = nalaz)": (r) => r.status === 400,
    "envelope prekršen: \"Nevažeći rezultat.\"": () =>
      jsonOf(envelope).error === "Nevažeći rezultat.",
  });

  // --- dvostruko slanje istog tokena ---
  const first = score(tokenA, 0, 0, 0, 200);
  check(first, { "prvo slanje 0/0/0: 200": (r) => r.status === 200 });
  expectError(score(tokenA, 0, 0, 0), "isti token drugi put", 400,
    "Rezultat je već poslat za ovu partiju.");

  // --- update-profile (troši 3 od 10 pokušaja profile bucket-a za kod A) ---
  expectError(
    bad({ action: "update-profile", sessionToken: sessionA, avatar: "hacker" }),
    "nepoznat avatar", 400, "Nevažeći avatar.",
  );
  expectError(
    bad({ action: "update-profile", sessionToken: sessionA, username: "x".repeat(21) }),
    "username 21 znak", 400, "Nadimak mora imati između 1 i 20 karaktera.",
  );
  expectError(
    bad({ action: "update-profile", sessionToken: sessionA }),
    "prazan update", 400, "Nema validnih podataka za izmenu.",
  );
}
