import { useState, useCallback, useRef } from 'react';
import './Prijava.scss';

import FormStep1 from './components/FormStep1';
import FormStep2 from './components/FormStep2';
import FormStep3 from './components/FormStep3';
import FormStep4 from './components/FormStep4';
import FormNavigacija from './components/FormNavigacija';
import type { PrijavaForma } from './types';

import zvezdaLevo from '@/assets/prijava/decor/zvezda_levo.svg';
import zvezdaDesno from '@/assets/prijava/decor/zvezda_desno.svg';
import tamnoPlaviLevi from '@/assets/prijava/decor/tamno_plavi_levi_detalj.svg';
import tamnoPlaviDesni from '@/assets/prijava/decor/tamno_plavi_desni_detalj.svg';
import zutiLevi from '@/assets/prijava/decor/zuti_levi_detalj.svg';
import zutiDesni from '@/assets/prijava/decor/zuti_desni_detalj.svg';
import naslovPrijaviSe from '@/assets/prijava/decor/prijavi_se_tekst_i_zuta_pozadina.svg';
import napomenaObavezna from '@/assets/prijava/decor/pitanja_sa_zvezdicom_su_obavezna.svg';

import papirVrhCrni from '@/assets/prijava/decor/reckavi_papir_vrh_crni.svg';
import papirDnoCrni from '@/assets/prijava/decor/reckavi_papir_dno_crni.svg';
import papirVrhPlavi from '@/assets/prijava/decor/reckavi_papir_vrh_plavi.svg';
import papirDnoPlavi from '@/assets/prijava/decor/reckavi_papir_dno_plavi.svg';
import naslovRadionice from '@/assets/prijava/decor/naslov_radionice.svg';
import naslovPanel from '@/assets/prijava/decor/naslov_panel.svg';
import naslovIskustva from '@/assets/prijava/decor/naslov_iskustva.svg';
import papirSredinaCrni from '@/assets/prijava/decor/reckavi_papir_sredina_crni.svg';
import papirSredinaPlavi from '@/assets/prijava/decor/reckavi_papir_sredina_plavi.svg';
import { usePapirTajlovi } from './usePapirTajlovi';

const praznaForma: PrijavaForma = {
  imePrezime: '',
  email: '',
  telefon: '',
  fakultet: '',
  godinaStudija: '',
  prvaZeljaRadionica: '',
  prvaZeljaNivoZnanja: '',
  prvaZeljaPrimena: '',
  drugaZeljaRadionica: '',
  drugaZeljaNivoZnanja: '',
  drugaZeljaPrimena: '',
  prisustvoPanelu: null,
  pitanjeZaPredavace: '',
  razloziZaS2S: '',
  ranijeUcestvovao: null,
  s2sIskustvo: '',
  predlogRadionice: '',
  cvDriveLink: '',
  zeliObavestenja: false,
};

type ApplicationPayload = {
  name_surname: string;
  email: string;
  phone_number: string;
  faculty: string;
  major?: string;
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
  second_workshop_choice: string | null;
  second_choice_reason: string | null;
  cv_drive_link: string;
  accepted_workshop: null;
  accepted_choice: null;
};

type DuplicatePrompt = {
  applicationId: number;
  message: string;
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

const supabaseHeaders = (publishableKey: string) => ({
  apikey: publishableKey,
  Authorization: `Bearer ${publishableKey}`,
  'Content-Type': 'application/json',
});

const quoteFilterValue = (value: string) => {
  return `"${value.replaceAll('"', '')}"`;
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

const buildPayload = (forma: PrijavaForma): ApplicationPayload => {
  return {
    name_surname: forma.imePrezime.trim(),
    email: forma.email.trim(),
    phone_number: forma.telefon.trim(),
    faculty: forma.fakultet.trim(),

    study_year: forma.godinaStudija.trim(),
    previously_participated: forma.ranijeUcestvovao ?? false,
    s2s_experience: forma.s2sIskustvo.trim(),
    dream_workshop_topic: forma.predlogRadionice.trim(),
    receive_fonis_updates: forma.zeliObavestenja,
    motivation: forma.razloziZaS2S.trim(),
    attend_panel_discussion: forma.prisustvoPanelu ?? false,
    question_for_lecturers: emptyToNull(forma.pitanjeZaPredavace),
    first_workshop_choice: emptyToNull(forma.prvaZeljaRadionica),
    first_choice_reason: emptyToNull(forma.prvaZeljaPrimena),
    second_workshop_choice: emptyToNull(forma.drugaZeljaRadionica),
    second_choice_reason: emptyToNull(forma.drugaZeljaPrimena),
    cv_drive_link: forma.cvDriveLink.trim(),
    accepted_workshop: null,
    accepted_choice: null,
  };
};

const Prijava = () => {
  const [forma, setForma] = useState<PrijavaForma>(praznaForma);
  const [korak, setKorak] = useState(1);
  const [poslato, setPoslato] = useState(false);
  const [greske, setGreske] = useState<Record<string, string>>({});
  const jeSenkaCrna = korak === 1;
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'error'
  >('idle');

  const [errorMessage, setErrorMessage] = useState('');
  const [duplicatePrompt, setDuplicatePrompt] =
    useState<DuplicatePrompt | null>(null);

  const sadrzajRef = useRef<HTMLDivElement>(null);
  const sadrzajUnutraRef = useRef<HTMLDivElement>(null);

  const trenutnaSredina = jeSenkaCrna ? papirSredinaCrni : papirSredinaPlavi;
  const { visinaTajla } = usePapirTajlovi(sadrzajRef, sadrzajUnutraRef, trenutnaSredina);

  const promeniPolje = useCallback(<K extends keyof PrijavaForma>(
    polje: K,
    vrednost: PrijavaForma[K],
  ) => {
    setForma((prev) => ({ ...prev, [polje]: vrednost }));
  }, []);

  const ocistiGresku = useCallback((polje: string) => {
    setGreske((prev) => {
      if (!(polje in prev)) return prev;

      const sledece = { ...prev };
      delete sledece[polje];

      return sledece;
    });
  }, []);

  const validirajKorak = (): boolean => {
    const greskeKorak: Record<string, string> = {};

    if (korak === 1) {
      if (!forma.imePrezime.trim()) {
        greskeKorak.imePrezime = 'Ime i prezime je obavezno.';
      }

      if (!forma.email.trim()) {
        greskeKorak.email = 'Email je obavezan.';
      }

      if (!forma.telefon.trim()) {
        greskeKorak.telefon = 'Broj telefona je obavezan.';
      }

      if (!forma.fakultet.trim()) {
        greskeKorak.fakultet = 'Fakultet je obavezan.';
      }

      if (!forma.godinaStudija) {
        greskeKorak.godinaStudija = 'Godina studija je obavezna.';
      }
    } else if (korak === 2) {
      if (!forma.prvaZeljaRadionica) {
        greskeKorak.prvaZeljaRadionica = 'Izaberi radionicu.';
      }

      if (!forma.prvaZeljaNivoZnanja) {
        greskeKorak.prvaZeljaNivoZnanja = 'Izaberi nivo znanja.';
      }

      if (!forma.prvaZeljaPrimena.trim()) {
        greskeKorak.prvaZeljaPrimena = 'Ovo polje je obavezno.';
      }

      if (forma.drugaZeljaRadionica) {
        if (!forma.drugaZeljaNivoZnanja) {
          greskeKorak.drugaZeljaNivoZnanja = 'Izaberi nivo znanja.';
        }

        if (!forma.drugaZeljaPrimena.trim()) {
          greskeKorak.drugaZeljaPrimena = 'Ovo polje je obavezno.';
        }
      }
    } else if (korak === 3) {
      if (forma.prisustvoPanelu === null) {
        greskeKorak.prisustvoPanelu =
          'Odgovori da li bi prisustvovao/la panelu.';
      }

      if (!forma.razloziZaS2S.trim()) {
        greskeKorak.razloziZaS2S = 'Ovo polje je obavezno.';
      }
    } else if (korak === 4) {
      if (forma.ranijeUcestvovao === null) {
        greskeKorak.ranijeUcestvovao =
          'Odgovori da li si ranije učestvovao.';
      }

      if (
        forma.ranijeUcestvovao === true &&
        !forma.s2sIskustvo.trim()
      ) {
        greskeKorak.s2sIskustvo = 'Opiši svoje iskustvo.';
      }
    }

    setGreske(greskeKorak);

    return Object.keys(greskeKorak).length === 0;
  };

  const sledeciKorak = () => {
    if (validirajKorak()) {
      setKorak((k) => Math.min(k + 1, 4));
    }
  };

  const prethodniKorak = () => {
    setKorak((k) => Math.max(k - 1, 1));
  };

  const getSupabaseConfig = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabasePublishableKey =
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabasePublishableKey) {
      throw new Error(
        'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY.',
      );
    }

    return {
      supabaseUrl,
      supabasePublishableKey,
    };
  };

  const findExistingApplication = async (
    supabaseUrl: string,
    supabasePublishableKey: string,
    email: string,
    phoneNumber: string,
  ) => {
    const params = new URLSearchParams({
      or: `(email.ilike.${quoteFilterValue(
        email,
      )},phone_number.eq.${quoteFilterValue(phoneNumber)})`,
      select: 'id,email,phone_number',
    });

    const response = await fetch(
      `${supabaseUrl}/rest/v1/Application?${params.toString()}`,
      {
        headers: supabaseHeaders(supabasePublishableKey),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        errorText || `Request failed with ${response.status}`,
      );
    }

    const rows = (await response.json()) as ExistingApplication[];

    const emailMatches = rows.filter(
      (row) => row.email.toLowerCase() === email.toLowerCase(),
    );

    const phoneMatches = rows.filter(
      (row) => row.phone_number === phoneNumber,
    );

    const emailMatch = emailMatches.at(-1);
    const phoneMatch = phoneMatches.at(-1);

    if (
      emailMatch &&
      phoneMatch &&
      emailMatch.id !== phoneMatch.id
    ) {
      throw new Error(
        'Email i broj telefona pripadaju različitim prijavama.',
      );
    }

    if (emailMatch) {
      return {
        applicationId: emailMatch.id,
        message:
          'Email koji ste uneli već postoji, da li želite da ažurirate podatke?',
      };
    }

    if (phoneMatch) {
      return {
        applicationId: phoneMatch.id,
        message:
          'Broj telefona koji ste uneli već postoji, da li želite da ažurirate podatke?',
      };
    }

    return null;
  };

  const createApplication = async (
    supabaseUrl: string,
    supabasePublishableKey: string,
    payload: ApplicationPayload,
  ) => {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/Application`,
      {
        method: 'POST',
        headers: {
          ...supabaseHeaders(supabasePublishableKey),
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        errorText || `Request failed with ${response.status}`,
      );
    }
  };

  const updateApplicationAndResendCode = async (
    supabaseUrl: string,
    supabasePublishableKey: string,
    applicationId: number,
    payload: ApplicationPayload,
  ) => {
    const updatePayload = {
      name_surname: payload.name_surname,
      email: payload.email,
      phone_number: payload.phone_number,
      faculty: payload.faculty,
      ...(payload.major !== undefined
        ? { major: payload.major }
        : {}),
      study_year: payload.study_year,
      previously_participated: payload.previously_participated,
      s2s_experience: payload.s2s_experience,
      dream_workshop_topic: payload.dream_workshop_topic,
      receive_fonis_updates: payload.receive_fonis_updates,
      motivation: payload.motivation,
      attend_panel_discussion: payload.attend_panel_discussion,
      question_for_lecturers: payload.question_for_lecturers,
      first_workshop_choice: payload.first_workshop_choice,
      first_choice_reason: payload.first_choice_reason,
      second_workshop_choice: payload.second_workshop_choice,
      second_choice_reason: payload.second_choice_reason,
      cv_drive_link: payload.cv_drive_link,
    };

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

      throw new Error(
        errorText || `Request failed with ${updateResponse.status}`,
      );
    }

    const resendResponse = await fetch(
      `${supabaseUrl}/rest/v1/rpc/resend_existing_access_code`,
      {
        method: 'POST',
        headers: supabaseHeaders(supabasePublishableKey),
        body: JSON.stringify({
          p_application_id: applicationId,
        }),
      },
    );

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();

      throw new Error(
        errorText || `Request failed with ${resendResponse.status}`,
      );
    }
  };

  const posaljiPrijavu = async () => {
    if (!validirajKorak()) {
      return;
    }

    setStatus('submitting');
    setErrorMessage('');
    setDuplicatePrompt(null);

    const payload = buildPayload(forma);

    if (
      payload.cv_drive_link &&
      !isGoogleDriveLink(payload.cv_drive_link)
    ) {
      setStatus('error');
      setErrorMessage('Unesite validan Google Drive link.');
      return;
    }

    try {
      const {
        supabaseUrl,
        supabasePublishableKey,
      } = getSupabaseConfig();

      const existing = await findExistingApplication(
        supabaseUrl,
        supabasePublishableKey,
        payload.email,
        payload.phone_number,
      );

      if (existing) {
        setStatus('idle');

        setDuplicatePrompt({
          applicationId: existing.applicationId,
          message: existing.message,
        });

        return;
      }

      await createApplication(
        supabaseUrl,
        supabasePublishableKey,
        payload,
      );

      setStatus('idle');
      setPoslato(true);
      setForma(praznaForma);
      setGreske({});
      setKorak(1);
    } catch (error) {
      setStatus('error');

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Prijava nije poslata.',
      );
    }
  };

  const handleDeclineUpdate = () => {
    setDuplicatePrompt(null);
    setStatus('idle');
  };

  const handleConfirmUpdate = async () => {
    if (!duplicatePrompt) {
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const {
        supabaseUrl,
        supabasePublishableKey,
      } = getSupabaseConfig();

      const payload = buildPayload(forma);

      await updateApplicationAndResendCode(
        supabaseUrl,
        supabasePublishableKey,
        duplicatePrompt.applicationId,
        payload,
      );

      setDuplicatePrompt(null);
      setStatus('idle');
      setPoslato(true);
      setForma(praznaForma);
      setGreske({});
      setKorak(1);
    } catch (error) {
      setDuplicatePrompt(null);
      setStatus('error');

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Prijava nije ažurirana.',
      );
    }
  };

  if (poslato) {
    return (
      <section className="prijava">
        <div className="prijava_stage">
          <div className="prijava_card prijava_card--uspeh">
            <h1 className="prijava_naslov">USPEŠNO!</h1>
            <p className="prijava_uspeh_tekst">
              Tvoja prijava je zabeležena. Proveri svoj email – tamo
              ćeš dobiti jedinstveni kod za pristup igrici.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="prijava">
      <div className="prijava_stage">
        <div className="prijava_zaglavlje">
          <img
            src={tamnoPlaviLevi}
            alt=""
            aria-hidden="true"
            className="prijava_dekor prijava_dekor--plavi-levo"
          />

          <img
            src={tamnoPlaviDesni}
            alt=""
            aria-hidden="true"
            className="prijava_dekor prijava_dekor--plavi-desno"
          />

          <img
            src={zutiLevi}
            alt=""
            aria-hidden="true"
            className="prijava_dekor prijava_dekor--zuti-levo"
          />

          <img
            src={zutiDesni}
            alt=""
            aria-hidden="true"
            className="prijava_dekor prijava_dekor--zuti-desno"
          />

          <img
            src={zvezdaLevo}
            alt=""
            className="prijava_zvezda prijava_zvezda--levo"
          />

          <img
            src={zvezdaDesno}
            alt=""
            className="prijava_zvezda prijava_zvezda--desno"
          />

          {korak === 1 ? (
            <img src={naslovPrijaviSe} alt="Prijavi se" className="prijava_naslov-img" />
          ) : (
            <img
              src={korak === 2 ? naslovRadionice : korak === 3 ? naslovPanel : naslovIskustva}
              alt={korak === 2 ? 'Radionice' : korak === 3 ? 'Panel' : 'Iskustva'}
              className="prijava_naslov-img"
            />
          )}

          <img
            src={napomenaObavezna}
            alt="Pitanja sa * su obavezna"
            className="prijava_napomena-img"
          />
        </div>

        <div className={`prijava_card ${poslato ? 'prijava_card--uspeh' : ''}`}>
          <img
            src={jeSenkaCrna ? papirVrhCrni : papirVrhPlavi}
            alt=""
            className="prijava_card__vrh"
          />

          <div className="prijava_card__telo">
            <div
              className="prijava_card__sadrzaj"
              ref={sadrzajRef}
              style={{ backgroundImage: `url(${trenutnaSredina})` }}
            >
              <div className="prijava_card__sadrzaj-unutra" ref={sadrzajUnutraRef}>
                {korak === 1 && (
                  <FormStep1 forma={forma} promeniPolje={promeniPolje} greske={greske} ocistiGresku={ocistiGresku} />
                )}
                {korak === 2 && (
                  <FormStep2
                    forma={forma}
                    promeniPolje={promeniPolje}
                    greske={greske}
                    ocistiGresku={ocistiGresku}
                    visinaTajla={visinaTajla}
                  />
                )}
                {korak === 3 && (
                  <FormStep3 forma={forma} promeniPolje={promeniPolje} greske={greske} ocistiGresku={ocistiGresku} />
                )}
                {korak === 4 && (
                  <FormStep4 forma={forma} promeniPolje={promeniPolje} greske={greske} ocistiGresku={ocistiGresku} />
                )}
                {status === 'error' && errorMessage && <p role="alert">{errorMessage}</p>}
              </div>
            </div>
          </div>

          <div className="prijava_card__dno-wrap">
            <img
              src={jeSenkaCrna ? papirDnoCrni : papirDnoPlavi}
              alt=""
              className="prijava_card__dno"
            />
            <div className="prijava_navigacija-pomeraj">
              <FormNavigacija
                korak={korak}
                onPrethodni={prethodniKorak}
                onSledeci={sledeciKorak}
                onPosalji={posaljiPrijavu}
              />
            </div>
          </div>
        </div>

        {duplicatePrompt ? (
          <div
            className="prijava-dialog-backdrop"
            role="presentation"
          >
            <div
              className="prijava-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="prijava-duplicate-title"
            >
              <p id="prijava-duplicate-title">
                {duplicatePrompt.message}
              </p>

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
      </div>
    </section>
  );
};

export default Prijava;