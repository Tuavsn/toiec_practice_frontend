// Filename: formatDate.ts

export default function formatDate(input: Date | string | number): string {
    let date: Date;

    //------------------------------------------------------
    // Xử lý input: Date, string, hoặc số
    //------------------------------------------------------
    if (input instanceof Date) {
        date = input;
    } else if (typeof input === "string") {
        const parsedDate = new Date(input);
        if (isNaN(parsedDate.getTime())) {
            throw new Error(`Invalid date string: "${input}"`);
        }
        date = parsedDate;
    } else if (typeof input === "number") {
        // Xử lý timestamp: nếu < 1e12 thì giả định là giây
        const timestamp = input < 1e12 ? input * 1000 : input;
        const parsedDate = new Date(timestamp);
        if (isNaN(parsedDate.getTime())) {
            throw new Error(`Invalid timestamp: ${input}`);
        }
        date = parsedDate;
    } else {
        throw new Error(`Unsupported input type: ${typeof input}`);
    }

    //------------------------------------------------------
    // Format: dd/mm/yyyy
    //------------------------------------------------------
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();

    return `${day}/${month}/${year}`;
}
