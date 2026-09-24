// Tanki helperi za game-api akcije. Svaki zahtev nosi tag `action`,
// da k6 summary razdvoji latenciju i greške po akciji.

import http from "k6/http";
import { ALLOWED_ORIGIN, GAME_API_URL } from "./config.js";

export function gameApi(body, { origin = ALLOWED_ORIGIN, expected = [200] } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (origin) headers.Origin = origin;
  // Opciono: zakuca Edge Function u region baze (npr. -e REGION=eu-central-1).
  // Bez ovoga Supabase pušta funkciju u regionu najbližem klijentu.
  if (__ENV.REGION) headers["x-region"] = __ENV.REGION;

  return http.post(GAME_API_URL, JSON.stringify(body), {
    headers,
    tags: { action: body.action || "none" },
    responseCallback: http.expectedStatuses(...expected),
  });
}

export function jsonOf(res) {
  try {
    return res.json();
  } catch {
    return {};
  }
}

export const login = (userCode) => gameApi({ action: "login", userCode });

export const getUser = (sessionToken) => gameApi({ action: "user", sessionToken });

export const startRun = (sessionToken) =>
  gameApi({ action: "start-run", sessionToken });

export const submitScore = (sessionToken, runToken, score, maxFloor, maxCombo, opts) =>
  gameApi(
    { action: "submit-score", sessionToken, runToken, score, maxFloor, maxCombo },
    opts,
  );

export const leaderboard = () => gameApi({ action: "leaderboard" });
