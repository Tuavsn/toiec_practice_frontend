export default function convertSecondsToString(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes} phút ${remainingSeconds} giây`;
}