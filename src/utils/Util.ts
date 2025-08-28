export function addBusinessDays(startDate: Date, days: number): Date {
    const result = new Date(startDate);
    let added = 0;

    while (added < days) {
        result.setDate(result.getDate() + 1);
        const day = result.getDay();
        if (day !== 0 && day !== 6) {
            added++;
        }
    }

    return result;
}

export function formatDateBR(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export function parseDate(dateStr?: string | null) {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("/");
    return new Date(Number(year), Number(month) - 1, Number(day));
}


