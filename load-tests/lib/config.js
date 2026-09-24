// Zajednička konfiguracija i guard za sve k6 skripte.
// Nema staging projekta: sve ovde gađa PRODUKCIJU, zato guard mora da prođe
// pre nego što se pošalje ijedan zahtev (init context baca grešku → k6 staje).

import { SharedArray } from "k6/data";

export const PROJECT_REF = "wxyfuchsoajohqkmflwj";
export const BASE_URL = `https://${PROJECT_REF}.supabase.co/functions/v1`;
export const GAME_API_URL = `${BASE_URL}/game-api`;
export const SUBMIT_APPLICATION_URL = `${BASE_URL}/submit-application`;

// Jedini dozvoljeni Origin za game-api (ALLOWED_ORIGINS u game-api/index.ts).
export const ALLOWED_ORIGIN = "https://s2s.fonis.rs";
export const FORBIDDEN_ORIGIN = "https://evil.example.com";

const STAGES = ["smoke", "full"];

export const STAGE = __ENV.STAGE;

if (!STAGES.includes(STAGE)) {
  throw new Error(
    `STAGE mora biti jedno od: ${STAGES.join(", ")} (dobijeno: ${STAGE ?? "ništa"})`,
  );
}

if (__ENV.CONFIRM_PROJECT !== PROJECT_REF) {
  throw new Error(
    `Ovo gađa PRODUKCIJU. Potvrdi sa -e CONFIRM_PROJECT=${PROJECT_REF}`,
  );
}

// Seedovani kodovi (Supabase SQL Editor → Export CSV, kolone: label,access_code).
// Fajl je u .gitignore i nikad se ne commituje.
const CODES_PATH = __ENV.CODES_CSV || "../data/codes.csv";

export const CODES = new SharedArray("codes", () => {
  const lines = open(CODES_PATH)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const header = lines.shift().split(",");
  const codeIndex = header.indexOf("access_code");
  if (codeIndex === -1) {
    throw new Error(`${CODES_PATH} nema kolonu access_code`);
  }
  const codes = lines.map((line) => line.split(",")[codeIndex].replace(/"/g, ""));
  if (codes.length !== 50) {
    throw new Error(`Očekujem 50 seedovanih kodova, dobio ${codes.length}`);
  }
  return codes;
});

// Svaki scenario dobija svoje kodove, da se rate-limit bucket-i ne mešaju.
// Rate-limit scenariji imaju po 4 koda: svako ponovno pokretanje uzima sledeći
// (-e RUN_ID=0..3), jer je bucket prethodnog pokretanja možda još pun.
export const CODE_SLOTS = {
  smoke: [0, 1],
  legit: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  "rl-user": [12, 13, 14, 15],
  "rl-profile": [16, 17, 18, 19],
  "rl-run-score": [20, 21, 22, 23],
};

export const RUN_ID = Number(__ENV.RUN_ID ?? 0);

if (!Number.isInteger(RUN_ID) || RUN_ID < 0 || RUN_ID > 3) {
  throw new Error(`RUN_ID mora biti 0..3 (dobijeno: ${__ENV.RUN_ID})`);
}

export function codesFor(slot) {
  return CODE_SLOTS[slot].map((i) => CODES[i]);
}

// Jedan kod po pokretanju za rate-limit scenarije.
export function codeForRun(slot) {
  return CODES[CODE_SLOTS[slot][RUN_ID]];
}
