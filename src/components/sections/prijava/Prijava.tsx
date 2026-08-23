import { FormEvent, useRef, useState } from 'react';
import './Prijava.scss';

type ApplicationPayload = {
  name_surname: string;
  email: string;
  phone_number: string;
  faculty: string;
  major: string;
  study_year: string;
  previously_participated: boolean;
  s2s_experience: string;
  dream_workshop_topic: string;
  receive_fonis_updates: boolean;
  motivation: string;
  attend_panel_discussion: boolean;
  question_for_lecturers: string | null;
  first_workshop_choice: string | null;
  first_choice_reason: string | null;
  second_workshop_choice: string;
  second_choice_reason: string;
  cv_drive_link: string;
  accepted_workshop: null;
  accepted_choice: null;
};

type DuplicatePrompt = {
  applicationId: number;
  message: string;
  payload: ApplicationPayload;
  focusField: 'email' | 'phone_number';
};

type ExistingApplication = {
  id: number;
  email: string;
  phone_number: string;
};

const emptyToNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
};

const readBoolean = (form: FormData, name: string) => {
  return form.get(name) === 'true';
};

const isGoogleDriveLink = (value: string) => {
  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }

    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    return host === 'drive.google.com' || host === 'docs.google.com';
  } catch {
    return false;
  }
};

const supabaseHeaders = (publishableKey: string) => ({
  apikey: publishableKey,
  Authorization: `Bearer ${publishableKey}`,
  'Content-Type': 'application/json',
});

const quoteFilterValue = (value: string) => {
  return `"${value.replaceAll('"', '')}"`;
};

const buildPayload = (form: FormData): ApplicationPayload => {
  return {
    name_surname: String(form.get('name_surname') ?? '').trim(),
    email: String(form.get('email') ?? '').trim(),
    phone_number: String(form.get('phone_number') ?? '').trim(),
    faculty: String(form.get('faculty') ?? '').trim(),
    major: String(form.get('major') ?? '').trim(),
    study_year: String(form.get('study_year') ?? '').trim(),
    previously_participated: readBoolean(form, 'previously_participated'),
    s2s_experience: String(form.get('s2s_experience') ?? '').trim(),
    dream_workshop_topic: String(form.get('dream_workshop_topic') ?? '').trim(),
    receive_fonis_updates: readBoolean(form, 'receive_fonis_updates'),
    motivation: String(form.get('motivation') ?? '').trim(),
    attend_panel_discussion: readBoolean(form, 'attend_panel_discussion'),
    question_for_lecturers: emptyToNull(
      String(form.get('question_for_lecturers') ?? ''),
    ),
    first_workshop_choice: emptyToNull(
      String(form.get('first_workshop_choice') ?? ''),
    ),
    first_choice_reason: emptyToNull(
      String(form.get('first_choice_reason') ?? ''),
    ),
    second_workshop_choice: String(
      form.get('second_workshop_choice') ?? '',
    ).trim(),
    second_choice_reason: String(form.get('second_choice_reason') ?? '').trim(),
    cv_drive_link: String(form.get('cv_drive_link') ?? '').trim(),
    accepted_workshop: null,
    accepted_choice: null,
  };
};

const Prijava = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle',
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [duplicatePrompt, setDuplicatePrompt] = useState<DuplicatePrompt | null>(
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);

  const getSupabaseConfig = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabasePublishableKey) {
      throw new Error(
        'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY.',
      );
    }

    return { supabaseUrl, supabasePublishableKey };
  };

  const findExistingApplication = async (
    supabaseUrl: string,
    supabasePublishableKey: string,
    email: string,
    phoneNumber: string,
  ) => {
    const params = new URLSearchParams({
      or: `(email.ilike.${quoteFilterValue(email)},phone_number.eq.${quoteFilterValue(phoneNumber)})`,
      select: 'id,email,phone_number',
    });

    const response = await fetch(
      `${supabaseUrl}/rest/v1/Application?${params.toString()}`,
      { headers: supabaseHeaders(supabasePublishableKey) },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed with ${response.status}`);
    }

    const rows = (await response.json()) as ExistingApplication[];
    const emailMatches = rows.filter(
      (row) => row.email.toLowerCase() === email.toLowerCase(),
    );
    const phoneMatches = rows.filter((row) => row.phone_number === phoneNumber);

    const emailMatch = emailMatches.at(-1);
    const phoneMatch = phoneMatches.at(-1);

    if (emailMatch && phoneMatch && emailMatch.id !== phoneMatch.id) {
      throw new Error(
        'Email i broj telefona pripadaju različitim prijavama.',
      );
    }

    if (emailMatch) {
      return {
        applicationId: emailMatch.id,
        message:
          'Email koji ste uneli već postoji, da li želite da ažurirate podatke?',
        focusField: 'email' as const,
      };
    }

    if (phoneMatch) {
      return {
        applicationId: phoneMatch.id,
        message:
          'Broj telefona koji ste uneli već postoji, da li želite da ažurirate podatke?',
        focusField: 'phone_number' as const,
      };
    }

    return null;
  };

  const createApplication = async (
    supabaseUrl: string,
    supabasePublishableKey: string,
    payload: ApplicationPayload,
  ) => {
    const response = await fetch(`${supabaseUrl}/rest/v1/Application`, {
      method: 'POST',
      headers: {
        ...supabaseHeaders(supabasePublishableKey),
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed with ${response.status}`);
    }
  };

  const updateApplicationAndResendCode = async (
    supabaseUrl: string,
    supabasePublishableKey: string,
    applicationId: number,
    payload: ApplicationPayload,
  ) => {
    const {
      accepted_workshop: _acceptedWorkshop,
      accepted_choice: _acceptedChoice,
      ...updatePayload
    } = payload;

    const updateResponse = await fetch(
      `${supabaseUrl}/rest/v1/Application?id=eq.${applicationId}`,
      {
        method: 'PATCH',
        headers: {
          ...supabaseHeaders(supabasePublishableKey),
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(updatePayload),
      },
    );

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(errorText || `Request failed with ${updateResponse.status}`);
    }

    const resendResponse = await fetch(
      `${supabaseUrl}/rest/v1/rpc/resend_existing_access_code`,
      {
        method: 'POST',
        headers: supabaseHeaders(supabasePublishableKey),
        body: JSON.stringify({ p_application_id: applicationId }),
      },
    );

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      throw new Error(errorText || `Request failed with ${resendResponse.status}`);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    setDuplicatePrompt(null);

    const formElement = event.currentTarget;
    const payload = buildPayload(new FormData(formElement));

    if (!isGoogleDriveLink(payload.cv_drive_link)) {
      setStatus('error');
      setErrorMessage('Unesite validan Google Drive link.');
      return;
    }

    try {
      const { supabaseUrl, supabasePublishableKey } = getSupabaseConfig();
      const existing = await findExistingApplication(
        supabaseUrl,
        supabasePublishableKey,
        payload.email,
        payload.phone_number,
      );

      if (existing) {
        setStatus('idle');
        setDuplicatePrompt({
          ...existing,
          payload,
        });
        return;
      }

      await createApplication(supabaseUrl, supabasePublishableKey, payload);
      setStatus('success');
      formElement.reset();
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Prijava nije poslata.',
      );
    }
  };

  const handleDeclineUpdate = () => {
    const focusField = duplicatePrompt?.focusField ?? 'email';
    setDuplicatePrompt(null);
    setStatus('idle');
    window.setTimeout(() => {
      document.getElementById(focusField)?.focus();
    }, 0);
  };

  const handleConfirmUpdate = async () => {
    if (!duplicatePrompt) {
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const { supabaseUrl, supabasePublishableKey } = getSupabaseConfig();
      await updateApplicationAndResendCode(
        supabaseUrl,
        supabasePublishableKey,
        duplicatePrompt.applicationId,
        duplicatePrompt.payload,
      );
      setDuplicatePrompt(null);
      setStatus('success');
      formRef.current?.reset();
    } catch (error) {
      setDuplicatePrompt(null);
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Prijava nije ažurirana.',
      );
    }
  };

  return (
    <section>
      <h1>Prijava</h1>
      <form ref={formRef} onSubmit={handleSubmit}>
        <p>
          <label htmlFor="name_surname">Ime i prezime</label>
          <br />
          <input id="name_surname" name="name_surname" required />
        </p>

        <p>
          <label htmlFor="email">Email</label>
          <br />
          <input id="email" name="email" type="email" required />
        </p>

        <p>
          <label htmlFor="phone_number">Broj telefona</label>
          <br />
          <input id="phone_number" name="phone_number" type="tel" required />
        </p>

        <p>
          <label htmlFor="faculty">Fakultet</label>
          <br />
          <input id="faculty" name="faculty" required />
        </p>

        <p>
          <label htmlFor="major">Smer</label>
          <br />
          <input id="major" name="major" required />
        </p>

        <p>
          <label htmlFor="study_year">Godina studija</label>
          <br />
          <input id="study_year" name="study_year" required />
        </p>

        <fieldset>
          <legend>Da li si ranije učestvovao/la na S2S?</legend>
          <label>
            <input
              type="radio"
              name="previously_participated"
              value="true"
              required
            />
            Da
          </label>
          <label>
            <input type="radio" name="previously_participated" value="false" />
            Ne
          </label>
        </fieldset>

        <p>
          <label htmlFor="s2s_experience">Iskustvo sa S2S</label>
          <br />
          <textarea id="s2s_experience" name="s2s_experience" required />
        </p>

        <p>
          <label htmlFor="dream_workshop_topic">
            Tema radionice iz snova
          </label>
          <br />
          <textarea
            id="dream_workshop_topic"
            name="dream_workshop_topic"
            required
          />
        </p>

        <fieldset>
          <legend>Želiš li obaveštenja FONIS-a?</legend>
          <label>
            <input
              type="radio"
              name="receive_fonis_updates"
              value="true"
              required
            />
            Da
          </label>
          <label>
            <input type="radio" name="receive_fonis_updates" value="false" />
            Ne
          </label>
        </fieldset>

        <p>
          <label htmlFor="motivation">Motivacija</label>
          <br />
          <textarea id="motivation" name="motivation" required />
        </p>

        <fieldset>
          <legend>Da li ćeš doći na panel diskusiju?</legend>
          <label>
            <input
              type="radio"
              name="attend_panel_discussion"
              value="true"
              required
            />
            Da
          </label>
          <label>
            <input type="radio" name="attend_panel_discussion" value="false" />
            Ne
          </label>
        </fieldset>

        <p>
          <label htmlFor="question_for_lecturers">Pitanje za predavače</label>
          <br />
          <textarea id="question_for_lecturers" name="question_for_lecturers" />
        </p>

        <p>
          <label htmlFor="first_workshop_choice">Prvi izbor radionice</label>
          <br />
          <input id="first_workshop_choice" name="first_workshop_choice" />
        </p>

        <p>
          <label htmlFor="first_choice_reason">Obrazloženje prvog izbora</label>
          <br />
          <textarea id="first_choice_reason" name="first_choice_reason" />
        </p>

        <p>
          <label htmlFor="second_workshop_choice">Drugi izbor radionice</label>
          <br />
          <input
            id="second_workshop_choice"
            name="second_workshop_choice"
            required
          />
        </p>

        <p>
          <label htmlFor="second_choice_reason">
            Obrazloženje drugog izbora
          </label>
          <br />
          <textarea
            id="second_choice_reason"
            name="second_choice_reason"
            required
          />
        </p>

        <p>
          <label htmlFor="cv_drive_link">CV (Google Drive link)</label>
          <br />
          <input
            id="cv_drive_link"
            name="cv_drive_link"
            type="url"
            required
          />
        </p>

        <p>
          <button type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Slanje...' : 'Pošalji prijavu'}
          </button>
        </p>
      </form>

      {status === 'success' ? <p>Prijava je uspešno poslata.</p> : null}
      {status === 'error' ? <p>{errorMessage}</p> : null}

      {duplicatePrompt ? (
        <div className="prijava-dialog-backdrop" role="presentation">
          <div
            className="prijava-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="prijava-duplicate-title"
          >
            <p id="prijava-duplicate-title">{duplicatePrompt.message}</p>
            <div className="prijava-dialog-actions">
              <button
                type="button"
                onClick={handleConfirmUpdate}
                disabled={status === 'submitting'}
              >
                Da
              </button>
              <button
                type="button"
                onClick={handleDeclineUpdate}
                disabled={status === 'submitting'}
              >
                Ne
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default Prijava;
