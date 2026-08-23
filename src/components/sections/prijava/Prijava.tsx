import { FormEvent, useState } from 'react';
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

const emptyToNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
};

const readBoolean = (form: FormData, name: string) => {
  return form.get(name) === 'true';
};

const Prijava = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle',
  );
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    const payload: ApplicationPayload = {
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

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      if (!supabaseUrl || !supabasePublishableKey) {
        throw new Error(
          'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY.',
        );
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/Application`, {
        method: 'POST',
        headers: {
          apikey: supabasePublishableKey,
          Authorization: `Bearer ${supabasePublishableKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with ${response.status}`);
      }

      setStatus('success');
      formElement.reset();
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Prijava nije poslata.',
      );
    }
  };

  return (
    <section>
      <h1>Prijava</h1>
      <form onSubmit={handleSubmit}>
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
          <input id="cv_drive_link" name="cv_drive_link" type="url" required />
        </p>

        <p>
          <button type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Slanje...' : 'Pošalji prijavu'}
          </button>
        </p>
      </form>

      {status === 'success' ? <p>Prijava je uspešno poslata.</p> : null}
      {status === 'error' ? <p>{errorMessage}</p> : null}
    </section>
  );
};

export default Prijava;
