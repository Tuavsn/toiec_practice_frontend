import { ProgressSpinner } from "primereact/progressspinner";

export default function LoadingSpinner({ text }: { text: string }) {
    return (
        <main className="flex justify-content-center align-content-center max-w-full max-y-full">
            <div className="flex flex-column justify-content-center align-content-center">
                <ProgressSpinner style={{ width: '100px', height: '100px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                <p className="text-center">{text}</p>
            </div>
        </main>
    );
}