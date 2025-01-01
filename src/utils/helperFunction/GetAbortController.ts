import { MutableRefObject } from "react";

export default function GetAbortController(abortControllerRef: MutableRefObject<AbortController | null>) {
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    return controller;
}