# S2S 2026 — trenutno stanje projekta i security hardening

## 1. Aktivni projekti

**Supabase projekat:**

```text
wxyfuchsoajohqkmflwj
```

Ignorisati stari/napušteni projekat:

```text
fzyqolbxjrzpznwzljnk
```

**Frontend:**

```text
/home/kole/Documents/Projects/s2s-2026-spojeno/s2s-2026
```

Branch:

```text
spojeno
```

**Email/Supabase backend:**

```text
/home/kole/Documents/Projects/s2s-email-backend
```

Glavna email Edge Function:

```text
supabase/functions/send-access-code/index.ts
```

---

## 2. Email problem — REŠEN

Originalno smo istraživali duple / nestale access-code mejlove.

### Database flow

Trenutni trigger chain je:

```text
Application INSERT
        ↓
trigger_auto_create_result
        ↓
auto_create_result_for_application()
        ↓
Result INSERT
        ↓
send_email_on_result_insert
        ↓
send_access_code_on_result_insert()
        ↓
pg_net
        ↓
send-access-code Edge Function
        ↓
SMTP
        ↓
email
```

Triggeri:

```text
Application:
trigger_auto_create_result
AFTER INSERT
→ auto_create_result_for_application()

Result:
send_email_on_result_insert
AFTER INSERT
→ send_access_code_on_result_insert()
```

### Duplicate email istraga

Potvrđeno je:

```text
Result.application_id UNIQUE ✅
Result.access_code UNIQUE ✅
```

Nema duplih `Result` redova po `application_id`.

`send-access-code` Edge Function ima samo jedan:

```ts
await transporter.sendMail(...)
```

Nema retry loop, nema drugi `sendMail`, nema self-call.

Kontrolisani test je završio sa:

```text
1 Application
1 Result
1 Edge invocation
1 email
```

Dakle dupli email trenutno nije reprodukovan.

---

## 3. Webhook auth problem — REŠEN

Otkrili smo mismatch između:

```text
Vault:
send_access_code_webhook_secret
```

i:

```text
Edge Function env:
SEND_ACCESS_CODE_WEBHOOK_SECRET
```

Debug je prvo pokazivao:

```text
headerLength: 64
envLength: 116
matches: false
```

Vault je zatim imao:

```text
65 karaktera
```

zbog newline-a.

Na kraju su oba usklađena na:

```text
64 karaktera
```

i debug je potvrdio:

```text
headerPresent: true
headerLength: 64
envPresent: true
envLength: 64
matches: true
```

Vault trenutno ima:

```text
send_access_code_webhook_secret → 64 karaktera
send_access_code_legacy_jwt     → 219 karaktera
```

Secret vrednosti nisu izlagane u chatu.

---

## 4. `Invalid JSON body` problem — REŠEN

Ranije je `pg_net` dobijao:

```json
{"error":"Invalid JSON body"}
```

Dokazali smo da sam `pg_net` šalje ispravan JSON preko Postman Echo testa:

```json
{"application_id":8}
```

sa:

```text
Content-Type: application/json
Content-Length: 21
```

Posle redeploy/auth popravke test je završio sa:

```text
400 {"error":"Invalid application_id"}
```

za:

```json
{"application_id":0}
```

što znači da je:

```text
req.json() ✅
```

radio ispravno.

Zatim je pravi test dao:

```text
200 {"success":true}
```

i mejl je stvarno stigao.

---

## 5. Email Edge Function cleanup — ZAVRŠEN

Privremeno smo ubacili:

```text
WEBHOOK AUTH DEBUG
REQUEST DEBUG
```

Posle dijagnostike su oba uklonjena.

Takođe je uklonjen privremeni:

```ts
expectedWebhookSecret
```

Funkcija je uspešno redeployovana:

```text
send-access-code ✅
```

Backup postoji:

```text
/home/kole/Documents/Projects/s2s-email-backend/supabase/functions/send-access-code/index.ts.backup.20260920-011350
```

Privremeni secret fajlovi iz `/tmp` su obrisani.

Posle cleanup-a je ponovo testirana prava prijava:

```text
prijava ✅
Result ✅
trigger ✅
Edge Function ✅
1 email ✅
```

---

## 6. Auth napomena za `send-access-code`

Funkcija trenutno ima:

```text
X-Webhook-Secret
```

kao primarnu custom autentikaciju.

Postoji i transitional fallback:

```ts
Authorization: Bearer ...
```

sa komentarom da zavisi od `verify_jwt=true`.

Direktan `curl` bez Authorization headera dobija:

```json
{
  "code":"UNAUTHORIZED_NO_AUTH_HEADER",
  "message":"Missing authorization header"
}
```

što potvrđuje da Supabase gateway trenutno traži auth pre ulaska u funkciju.

Normalni DB trigger šalje i:

```text
Authorization: Bearer <legacy JWT>
X-Webhook-Secret: <webhook secret>
```

Normalni flow sada koristi validan webhook secret.

Fallback ćemo kasnije dodatno očistiti/migrirati, ali trenutno radi.

---

## 7. Frontend security audit

Codex je pronašao da frontend direktno koristi `Application` samo za:

```text
GET /rest/v1/Application
POST /rest/v1/Application
```

Stari flow je bio:

```text
GET Application
→ proveri email/telefon
→ ako nema
→ POST Application
```

Frontend nije direktno čitao:

```text
Result
access_code
```

Nije pronađen očigledan SQL injection.

PostgREST filter nije raw SQL injection, ali je stari javni SELECT bio ozbiljan authorization problem.

---

## 8. Application PII rupa — REŠENA

Live RLS stanje je bilo:

```text
Application RLS = ON
Result      RLS = ON
```

Ali `Application` je imao:

```text
public_select_applications
roles: anon, authenticated
SELECT
USING (true)
```

i grantove:

```text
anon          SELECT=true
authenticated SELECT=true
```

To je značilo da napadač može promeniti frontend request iz:

```text
select=email,phone_number
```

u:

```text
select=*
```

i potencijalno čitati celu `Application` tabelu.

To je zatvoreno.

Trenutno:

```text
anon          SELECT=false
authenticated SELECT=false
service_role  SELECT=true
```

SELECT policy je uklonjena.

Preostala Application policy:

```text
public_insert_applications
roles: anon, authenticated
cmd: INSERT
WITH CHECK: true
```

Posle zatvaranja SELECT-a testirano je:

```text
nova prijava ✅
1 email ✅
dupli email odbijen ✅
dupli telefon odbijen ✅
```

---

## 9. Duplicate handling — PREBAČEN NA DB

Otkriveno je da baza već ima dobre UNIQUE indekse:

```sql
application_email_ci_unique
UNIQUE (lower(btrim(email)))
```

i:

```sql
application_phone_unique
UNIQUE (btrim(phone_number))
```

Pre toga smo proverili postojeće podatke:

```text
duplicate normalized emails: 0
duplicate normalized phones: 0
```

Svi telefoni u postojećoj bazi su formata:

```text
+381...
```

Frontend je izmenjen tako da više ne radi javni GET za duplicate-check.

Sada radi:

```text
POST Application
→ ako DB vrati unique violation / 23505
→ frontend prikazuje duplicate poruku
```

Dakle:

```text
anon SELECT Application više nije potreban ✅
```

Ovo je testirano i radi.

---

## 10. Application schema

`Application` ima sledeća polja:

```text
id
name_surname
email
phone_number
faculty
major
study_year
previously_participated
s2s_experience
dream_workshop_topic
receive_fonis_updates
motivation
attend_panel_discussion
question_for_lecturers
first_workshop_choice
first_choice_reason
second_workshop_choice
second_choice_reason
cv_drive_link
accepted_workshop
accepted_choice
first_knowledge_level
second_knowledge_level
created_at
```

Bitno:

```text
Application praktično nema CHECK constraints.
```

Osim PK-a, validacija je uglavnom bila frontend-only.

Zato direktni anon INSERT trenutno još može da zaobiđe React validaciju.

---

## 11. Result security

`Result` je trenutno mnogo bolje zatvoren.

Grantovi:

```text
anon:
SELECT ❌
INSERT ❌
UPDATE ❌
DELETE ❌

authenticated:
SELECT ❌
INSERT ❌
UPDATE ❌
DELETE ❌

service_role:
SELECT ✅
INSERT ✅
UPDATE ✅
DELETE ✅
```

Constraints:

```text
PRIMARY KEY(id)

UNIQUE(access_code)
UNIQUE(application_id)

FOREIGN KEY(application_id)
→ Application(id)
→ ON DELETE CASCADE
```

Access code format:

```regex
^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{8}$
```

Postoje i CHECK constraints za:

```text
high_score: 0–250000
max_combo: 0–40
max_floor: 0–600
username: 1–20 karaktera
avatar: whitelist
```

---

## 12. `submit-application` hardening — PRIPREMLJEN, ALI JOŠ NIJE ZAVRŠEN/DEPLOYOVAN

Napravljen je paket:

```text
s2s-registration-hardening-v2.zip
```

Ideja je da finalni flow bude:

```text
Browser
   ↓
submit-application Edge Function
   ↓
server-side validacija
   ↓
privilegovani backend INSERT
   ↓
Application
   ↓
postojeći trigger chain
```

Tada možemo potpuno da ugasimo:

```text
anon INSERT Application
```

i browser više neće imati direktan DB pristup.

U paketu je pripremljen:

```text
supabase/functions/submit-application/index.ts
```

i prilagođen frontend `Prijava.tsx`.

### Važno

Ovaj deo još nije potvrđeno deployovan/testiran.

Dakle trenutno produkcija i dalje koristi:

```text
frontend → direktan POST /rest/v1/Application
```

sa:

```text
anon INSERT=true
```

To trenutno radi i duplicate handling je bezbedniji nego ranije, ali još postoji mogućnost direktnog abuse-a nad INSERT endpointom.

---

## 13. Workshops whitelist

Canonical frontend fajl je:

```text
src/data/workshops.ts
```

Frontend import ostaje:

```ts
import { WORKSHOPS } from "@/data/workshops";
```

To nije menjano.

Frontend koristi:

```ts
const RADIONICE = WORKSHOPS.map(
  (workshop) => workshop.shortName
);
```

Canonical workshop short names su:

```text
UI/UX dizajn
C# Dev
Cybersecurity
CASE
Digitalni marketing
Uvod u C
Game Dev
AI agenti
Startup
Mašinsko učenje
```

`submit-application` backend v2 ima server-side whitelist tih vrednosti.

`workshops.reference.ts` iz ZIP-a je samo referenca i **ne treba da zameni postojeći `src/data/workshops.ts`**.

---

## 14. Šta iz hardening ZIP-a ide gde

Frontend:

```text
Prijava.tsx
→ src/components/sections/prijava/Prijava.tsx
```

Backend:

```text
submit-application/index.ts
→ /home/kole/Documents/Projects/s2s-email-backend/supabase/functions/submit-application/index.ts
```

Ne menjati postojeći:

```text
src/data/workshops.ts
```

sa reference fajlom.

---

## 15. Šta još treba uraditi

Preostali security posao, redom:

1. **Deploy `submit-application` Edge Function**
2. prebaciti frontend na `submit-application`
3. testirati:
   ```text
   nova prijava
   duplicate email
   duplicate telefon
   Result creation
   tačno 1 email
   ```
4. tek kad sve radi:
   ```sql
   REVOKE INSERT
   ON public."Application"
   FROM anon, authenticated;
   ```
5. ukloniti:
   ```text
   public_insert_applications
   ```
6. tada `Application` treba da bude:
   ```text
   anon SELECT ❌
   anon INSERT ❌
   anon UPDATE ❌
   anon DELETE ❌
   ```
7. zatim auditovati **`game-api`**

---

## 16. Game security — JOŠ NIJE AUDITOVAN

Bundlovana igrica šalje `game-api` akcije:

```text
login
user
update-profile
submit-score
leaderboard
```

Posebno je bitno:

```text
submit-score:
userCode
score
maxFloor
maxCombo
```

Ovo je sledeći veliki security audit.

Treba proveriti da li backend samo veruje:

```json
{
  "score": 99999999,
  "maxFloor": 999,
  "maxCombo": 999
}
```

koje browser pošalje.

Ako veruje, igrač može menjati score kroz DevTools/curl.

Treba proveriti i:

```text
brute force access_code
rate limiting
session/token nakon login-a
IDOR
userCode enumeration
profile update authorization
leaderboard manipulation
replay
score validation
```

---

## 17. SQL injection trenutno

Za frontend prijavu nije pronađen stvarni raw SQL injection.

Nema pronađenog:

```text
raw SQL
dynamic SQL
EXECUTE sa user inputom
SQL string concatenation
frontend rpc()
```

Stari PostgREST filter je bio authorization/data exposure problem, ne potvrđen SQL injection.

Ipak treba kasnije auditovati sve PL/pgSQL/RPC funkcije posebno.

---

## 18. Trenutni najvažniji status

Produkcioni flow trenutno radi:

```text
Prijava ✅
Duplicate email ✅
Duplicate telefon ✅
Application PII SELECT zatvoren ✅
Result zatvoren ✅
Result auto-create ✅
Access code ✅
Email trigger ✅
Webhook auth ✅
SMTP ✅
Tačno 1 email ✅
```

Preostala glavna rupa na prijavi:

```text
anon INSERT Application = true
WITH CHECK (true)
```

To zatvaramo tek nakon uspešnog prelaska na:

```text
submit-application Edge Function
```

A posle toga prelazimo na:

```text
game-api security audit
```
