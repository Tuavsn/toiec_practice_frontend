import { CheckboxChangeEvent } from "primereact/checkbox";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { callGetIsDraftTestExist, callGetTestDetailPageData } from "../api/api";
import { addQuestionListByPartIndex } from "../database/indexdb";
import { CleanupPrefetch, PreFetchResources } from "../utils/helperFunction/PrefetchResources";
import { emptyTestDetailPageData } from "../utils/types/emptyValue";
import { TestDetailPageData, TestDocument, TestID, TestPaperWorkerRequest, WorkerResponse } from "../utils/types/type";


export const useCheckBox = () => {
    const [parts, setParts] = useState<boolean[]>([true, ...Array(7).fill(false)]);
    const onPartSelectChange = (event: CheckboxChangeEvent): void => {
        const { value = 0, checked = false } = event;
        const _parts = [...parts];

        if (value === 0) {
            _parts.fill(false, 1);
            _parts[0] = true;
            setParts(_parts);
            return;
        }
        _parts[value] = checked;

        if (checked) {
            _parts[0] = false;
        } else if (_parts.slice(1).every(part => !part)) {
            _parts[0] = true;
        }


        setParts(_parts);
    };

    return {
        parts,
        onPartSelectChange
    }
}

export function useTestDetail() {
    const { id = "" } = useParams<{ id: TestID }>();
    const [testInfo, setTestInfo] = useState<TestDetailPageData>(emptyTestDetailPageData);

    useEffect(() => {
        callGetTestDetailPageData(id).then(newTestInfo => {
            if (newTestInfo) {
                setTestInfo(newTestInfo);
            }
        });
        return () => {
            CleanupPrefetch();
        }
    }, [id]);

    return { testInfo, id };
}

function loadTestPaper(testId: TestID, setIsDoneLoading: Dispatch<SetStateAction<boolean>>) {
    const worker = new Worker(new URL('../workers/getTestPaper.worker.ts', import.meta.url), { type: 'module' });
    // Send a message to the worker
    worker.postMessage({ testId, parts: "0" } as TestPaperWorkerRequest);

    // xử lý worker responses
    worker.onmessage = async (event: MessageEvent<WorkerResponse<TestDocument>>) => {
        const { status, data, message } = event.data;

        if (status === 'success') {
            Promise.resolve().then(() => PreFetchResources(data));
            await addQuestionListByPartIndex(data);

            console.log("Test Paper successfully loaded.");
            setIsDoneLoading(true);
        } else {
            console.error(message || 'An error occurred.');
        }
        worker.terminate(); // Clean up the worker
    };

    worker.onerror = (error) => {
        console.error('Worker error:', error);
        worker.terminate(); // Clean up the worker
    };
}



export const useTimeLimitChooser = (limitTime: number, testId: TestID, parts: boolean[]) => {
    const [timeLimit, setTimeLimit] = useState<number>(limitTime);
    const [isButtonClicked, setIsButtonClicked] = useState<boolean>(false);
    const [isDoneLoading, setIsDoneLoading] = useState<boolean>(false);
    const [isDraftExist, setIsDraftExist] = useState<boolean>(false);
    useEffect(() => setTimeLimit(limitTime), [limitTime]);
    useEffect(() => {
        loadTestPaper(testId, setIsDoneLoading)
        callGetIsDraftTestExist(testId, parts[0] === true ? "fulltest" : "practice").then(draftLocation => {
            console.log(`Draft test existence for ${testId}:`, draftLocation);

            setIsDraftExist(draftLocation !== "none");
        })
    }, [testId])
    return {
        setIsButtonClicked,
        isButtonClicked,
        isDoneLoading,
        isDraftExist,
        setTimeLimit,
        timeLimit,
    }
}