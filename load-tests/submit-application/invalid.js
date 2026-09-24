// submit-application: sve što pada PRE Turnstile provere (metoda, JSON,
// veličina, validacija polja) + jedan lažan Turnstile token koji mora biti
// odbijen. Nijedan zahtev ne stiže do limitera ni do inserta: nema upisa,
// nema mejla, ne troši IP/email bucket.
//
// Svi payload-i koriste SEEDOVAN email/telefon: i kad bi nešto neočekivano
// prošlo Turnstile, insert bi pao na unique (409) umesto da napravi prijavu.
//
// k6 run -e STAGE=full -e CONFIRM_PROJECT=wxyfuchsoajohqkmflwj \
//        -e TEST_EMAIL=<tvoj>+lt01@gmail.com load-tests/submit-application/invalid.js

import { check } from "k6";
import http from "k6/http";
import { ALLOWED_ORIGIN, STAGE, SUBMIT_APPLICATION_URL } from "../lib/config.js";

if (STAGE !== "full") {
  throw new Error("submit-application/invalid.js se pušta samo sa STAGE=full");
}

const TEST_EMAIL = __ENV.TEST_EMAIL;
if (!TEST_EMAIL || !/\+lt\d{2}@/.test(TEST_EMAIL)) {
  throw new Error("TEST_EMAIL mora biti seedovan email (…+ltNN@…)");
}

// Telefon seedovanog reda +lt01 (seed: '+38169900' || lpad(g, 4, '0')).
const TEST_PHONE = "+381699000001";

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    checks: ["rate==1"],
    http_req_failed: ["rate==0"],
  },
};

function validPayload(overrides = {}) {
  return {
    name_surname: "LOADTEST validacija",
    email: TEST_EMAIL,
    phone_number: TEST_PHONE,
    faculty: "LOADTEST",
    study_year: "1",
    previously_participated: false,
    receive_fonis_updates: false,
    motivation: "loadtest",
    attend_panel_discussion: false,
    first_workshop_choice: "CASE",
    first_knowledge_level: "Osnovni",
    first_choice_reason: "loadtest",
    turnstile_token: "neispravan-token",
    ...overrides,
  };
}

function post(body, expected, rawBody) {
  return http.post(SUBMIT_APPLICATION_URL, rawBody ?? JSON.stringify(body), {
    headers: { "Content-Type": "application/json", Origin: ALLOWED_ORIGIN },
    responseCallback: http.expectedStatuses(expected),
  });
}

function jsonOf(res) {
  try {
    return res.json();
  } catch {
    return {};
  }
}

function expectField(label, overrides, field) {
  const res = post(validPayload(overrides), 400);
  const body = jsonOf(res);
  check(res, {
    [`${label}: 400`]: (r) => r.status === 400,
    [`${label}: validation_error / ${field}`]: () =>
      body.error === "validation_error" && body.field === field,
  });
}

export default function () {
  // --- metoda i CORS ---
  const getRes = http.get(SUBMIT_APPLICATION_URL, {
    responseCallback: http.expectedStatuses(405),
  });
  check(getRes, {
    "GET: 405": (r) => r.status === 405,
    "GET: method_not_allowed": () => jsonOf(getRes).error === "method_not_allowed",
  });

  const preflight = http.options(SUBMIT_APPLICATION_URL, null, {
    headers: { Origin: ALLOWED_ORIGIN, "Access-Control-Request-Method": "POST" },
    responseCallback: http.expectedStatuses(204),
  });
  check(preflight, {
    "OPTIONS: 204": (r) => r.status === 204,
    "OPTIONS: izlaže Retry-After": (r) =>
      /retry-after/i.test(r.headers["Access-Control-Expose-Headers"] ?? ""),
  });

  // --- telo zahteva ---
  const notJson = post(null, 400, "ovo nije json");
  check(notJson, {
    "nije JSON: 400": (r) => r.status === 400,
    "nije JSON: invalid_json": () => jsonOf(notJson).error === "invalid_json",
  });

  const tooBig = post(null, 413, JSON.stringify({ motivation: "x".repeat(64_001) }));
  check(tooBig, {
    "> 64KB: 413": (r) => r.status === 413,
    "> 64KB: payload_too_large": () => jsonOf(tooBig).error === "payload_too_large",
  });

  // --- validacija (redosled u kodu: prvo turnstile_token, pa polja) ---
  expectField("bez turnstile_token", { turnstile_token: undefined }, "turnstile_token");
  expectField("nepoznato polje", { hacker: "x" }, "hacker");
  expectField("predugo ime (161)", { name_surname: "x".repeat(161) }, "name_surname");
  expectField("loš email", { email: "nije-email" }, "email");
  expectField("loš telefon", { phone_number: "123" }, "phone_number");
  expectField("godina 5", { study_year: "5" }, "study_year");
  expectField("boolean kao string", { previously_participated: "true" }, "previously_participated");
  expectField("prazna motivacija", { motivation: "   " }, "motivation");
  expectField("nepostojeća radionica", { first_workshop_choice: "Hakovanje" }, "first_workshop_choice");
  expectField("nepoznat nivo", { first_knowledge_level: "Ekspert" }, "first_knowledge_level");
  expectField("druga = prva radionica", { second_workshop_choice: "CASE" }, "second_workshop_choice");
  expectField(
    "druga bez nivoa",
    { second_workshop_choice: "Game Dev", second_choice_reason: "x" },
    "second_knowledge_level",
  );
  expectField("CV van Google Drive-a", { cv_drive_link: "https://example.com/cv.pdf" }, "cv_drive_link");

  // --- Turnstile: validan payload, lažan token → mora 403 ---
  const fake = post(validPayload({ turnstile_token: "XXXX.DUMMY.TOKEN.XXXX" }), 403);
  check(fake, {
    "lažan Turnstile token: 403": (r) => r.status === 403,
    "lažan Turnstile token: turnstile_verification_failed": () =>
      jsonOf(fake).error === "turnstile_verification_failed",
  });
}
