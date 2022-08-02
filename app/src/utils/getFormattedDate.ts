function getFormattedDate(date: string, locale?: string) {
  return new Intl.DateTimeFormat(locale ?? "en-US", {
    year: "numeric",
    month: "long"
  }).format(new Date(date));
};

function getFormattedDateTime(date: string, locale?: string) {
  return new Intl.DateTimeFormat(locale ?? "en-US", {
    day: "2-digit",
    year: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(date));
};


export { getFormattedDate, getFormattedDateTime };

