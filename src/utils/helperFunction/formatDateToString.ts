export default function formatDate(dateObj: Date | string): string {
    const date = typeof dateObj === 'string' ? new Date(dateObj) : dateObj;
    const day = date.getDate().toString().padStart(2,"0");
    const month = (date.getMonth() + 1).toString().padStart(2,"0");
    const year = date.getFullYear().toString(); // Get the last two digits of the year
    return `${day}/${month}/${year}`;
}