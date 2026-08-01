const dateTimeFormatter = new Intl.DateTimeFormat("nl-NL", {
    timeZone: "Europe/Amsterdam",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("nl-NL", {
    timeZone: "Europe/Amsterdam",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
});

export function formatDateTime(value: Date | string | number) {
    return dateTimeFormatter.format(new Date(value));
}

export function formatDate(value: Date | string | number) {
    return dateFormatter.format(new Date(value));
}