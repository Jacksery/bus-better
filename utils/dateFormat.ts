export function formatDateTime(isoString: string | undefined): string {
    if (!isoString) return 'Unknown';

    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return 'Unknown';

        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    } catch {
        return 'Unknown';
    }
}
