const formatoData = new Intl.DateTimeFormat("it-IT", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

// "2026-10-12" -> "12 ott 2026" (senza passare da UTC, che sposterebbe il giorno)
export const formattaData = (isoData) => {
  if (!isoData) return "";
  const [anno, mese, giorno] = isoData.split("-").map(Number);
  return formatoData.format(new Date(anno, mese - 1, giorno));
};
