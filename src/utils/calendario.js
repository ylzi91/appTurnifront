// Versione con i locale inclusi: l'import separato di "moment/locale/it" non agganciava la stessa istanza
import moment from "moment/min/moment-with-locales";
import { momentLocalizer } from "react-big-calendar";

moment.locale("it");

// Un solo localizer condiviso: prima ogni componente ne creava uno nuovo a ogni render
export const localizer = momentLocalizer(moment);

export const messaggiCalendario = {
  today: "Oggi",
  previous: "Indietro",
  next: "Avanti",
  month: "Mese",
  week: "Settimana",
  day: "Giorno",
  agenda: "Agenda",
  date: "Data",
  time: "Ora",
  event: "Turno",
  noEventsInRange: "Nessun turno in questo periodo",
  showMore: (totale) => `+${totale} altri`,
};
