---
paths:
  - "src/components/sections/prijava/**"
  - "src/data/**"
---

# Backend contract: submit-application

Source of truth is the Edge Function in the backend repo: `s2s-email-backend/supabase/functions/submit-application/index.ts`.
This summary was taken from it. If unsure, ask the user to paste the current function.

## Request
`POST ${VITE_SUPABASE_URL}/functions/v1/submit-application`
Headers: `apikey: ${VITE_SUPABASE_PUBLISHABLE_KEY}`, `Content-Type: application/json`. Body under 64,000 bytes.

The body is a flat JSON object. Unknown keys are rejected, so send exactly these snake_case fields:

Required:
- `name_surname` (max 160), `email` (max 254, valid format, lowercased server-side)
- `phone_number` (max 20): `06XXXXXXX(X)` is normalized to `+3816XXXXXXX(X)`; the result must match `^\+3816\d{7,8}$`
- `faculty` (max 200), `study_year` in `"1" | "2" | "3" | "4" | "Master" | "Doktorske"`
- `previously_participated`, `receive_fonis_updates`, `attend_panel_discussion` (booleans)
- `motivation` (max 5000)
- `first_workshop_choice` (must equal a `WORKSHOPS[].shortName`), `first_knowledge_level` in `"Osnovni" | "Srednji" | "Napredni"`, `first_choice_reason` (max 5000)

Optional (send `null` or omit):
- `s2s_experience` (max 5000, only kept when `previously_participated` is true)
- `dream_workshop_topic` (max 2000)
- `question_for_lecturers` (max 3000, only kept when `attend_panel_discussion` is true)
- `second_workshop_choice` (must differ from the first). If set, `second_knowledge_level` and `second_choice_reason` become required.
- `cv_drive_link` (max 2048, host must be `drive.google.com` or `docs.google.com`)

## Responses
- `201 { success: true }`
- `400 { error: "validation_error", field }`
- `409 { error: "duplicate_application", field: "email" | "phone_number" | "unknown" }`
- `405`, `413`, `500 { error: "internal_error" }`

## Keeping both repos in sync
- `WORKSHOPS[].shortName` values in `src/data/workshops.ts` must match `WORKSHOP_CHOICES` in the backend. Renaming or adding a workshop needs a backend change.
- Same for `study_year` options and knowledge levels.
- Any change here: tell the user exactly which constants or fields must change in the backend.
