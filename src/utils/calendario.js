import moment from "moment";
import { momentLocalizer } from "react-big-calendar";
// Lo stile sta qui, accanto al localizer: lo importa ogni pagina con un calendario (utente e admin)
import "react-big-calendar/lib/css/react-big-calendar.css";

// Solo l'italiano che serve al calendario: "moment-with-locales" aggiungeva quasi 300 kB
moment.defineLocale("it", {
  months: "gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre".split("_"),
  monthsShort: "gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic".split("_"),
  weekdays: "domenica_lunedì_martedì_mercoledì_giovedì_venerdì_sabato".split("_"),
  weekdaysShort: "dom_lun_mar_mer_gio_ven_sab".split("_"),
  weekdaysMin: "do_lu_ma_me_gi_ve_sa".split("_"),
  week: { dow: 1, doy: 4 }, // settimana da lunedì
});
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
  time: "",
  event: "Turno",
  noEventsInRange: "Nessun turno in questo periodo",
  showMore: (totale) => `+${totale} altri`,
};

// Formati in italiano (giorno prima del mese) per la vista elenco
export const formatiCalendario = {
  agendaHeaderFormat: ({ start, end }, culture, loc) =>
    `${loc.format(start, "D MMM", culture)} – ${loc.format(end, "D MMM YYYY", culture)}`,
  agendaDateFormat: "ddd D MMM",
};
