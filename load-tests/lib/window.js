// rate_limit_hit koristi FIKSAN prozor poravnat na epoch:
//   window_start = floor(now / window) * window
// Zato test mora da zna koliko je ostalo do kraja prozora: ako se prozor
// promeni usred serije, brojač se resetuje i "429 na (max+1)." gubi smisao.

import { check, sleep } from "k6";
import { jsonOf } from "./game.js";

export const RATE_LIMIT_MESSAGE = "Previše pokušaja. Pokušajte ponovo kasnije.";

// Tolerancija za razliku lokalnog sata i sata baze (clock_timestamp()).
const CLOCK_TOLERANCE_S = 5;

export function secondsLeft(windowSec) {
  return windowSec - ((Date.now() / 1000) % windowSec);
}

// Ako do kraja prozora ima manje od needSec, sačekaj početak sledećeg.
export function ensureWindow(windowSec, needSec) {
  const left = secondsLeft(windowSec);
  if (left < needSec) {
    console.log(`čekam ${Math.ceil(left + 2)}s na novi ${windowSec}s prozor`);
    sleep(left + 2);
  }
}

// Uvek sačekaj početak sledećeg prozora (za bucket-e koje ne možemo da
// "osvežimo" novim kodom, npr. login:ip).
export function waitNextWindow(windowSec) {
  const left = secondsLeft(windowSec);
  console.log(`čekam ${Math.ceil(left + 2)}s na novi ${windowSec}s prozor`);
  sleep(left + 2);
}

// Proverava da je odgovor pravi 429 iz rateLimited() i da Retry-After
// pokazuje kraj prozora iz koga je limit stvarno došao (expectWindowSec).
export function checkRateLimited(res, label, expectWindowSec) {
  const retryAfter = Number(res.headers["Retry-After"]);
  const expected = Math.ceil(secondsLeft(expectWindowSec));
  return check(res, {
    [`${label}: 429`]: (r) => r.status === 429,
    [`${label}: poruka`]: () => jsonOf(res).error === RATE_LIMIT_MESSAGE,
    [`${label}: Retry-After ceo broj u [1, ${expectWindowSec}]`]: () =>
      Number.isInteger(retryAfter) && retryAfter >= 1 && retryAfter <= expectWindowSec,
    [`${label}: Retry-After ≈ kraj ${expectWindowSec}s prozora (±${CLOCK_TOLERANCE_S}s)`]:
      () => Math.abs(retryAfter - expected) <= CLOCK_TOLERANCE_S,
  });
}
