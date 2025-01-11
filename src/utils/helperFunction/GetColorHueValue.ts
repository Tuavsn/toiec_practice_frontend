export default function GetColorBasedOnValue(value: number): string {
    if (value < 0) value = 0;
    if (value > 100) value = 100;

    // Map value (0–100) to hue (0–120), where 0 is red and 120 is green
    const hue = (value / 100) * 120;
    return `hsl(${hue}, 100%, 50%)`; // Saturation 100%, Lightness 50%
}