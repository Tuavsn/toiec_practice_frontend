export default function formatDate(dateObj: Date | string | number): string {
    let date: Date;

    if (typeof dateObj === "string" || typeof dateObj === "number") {
        // Nếu là số nhỏ, giả sử là giây và nhân 1000
        const timestamp = typeof dateObj === "number" && dateObj < 1e12
            ? dateObj * 1000
            : Number(dateObj);

        date = new Date(timestamp);
    } else {
        date = dateObj;
    }

    if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
}
