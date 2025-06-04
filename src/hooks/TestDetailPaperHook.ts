import { CheckboxChangeEvent } from "primereact/checkbox";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { callGetIsDraftTestExist, callGetTestDetailPageData } from "../api/api";
import { addQuestionListByPartIndex } from "../database/indexdb";
import { emptyTestDetailPageData } from "../utils/types/emptyValue";
import { Question_PageIndex, Resource, TestDetailPageData, TestDocument, TestID, TestPaperWorkerRequest, WorkerResponse } from "../utils/types/type";


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


async function PreFetchResources(testDocument: TestDocument): Promise<void> {
    const questionList: Question_PageIndex[] = [];
    testDocument.forEach(
        td => {
            td.questionList.forEach(
                q => {
                    questionList.push(q);

                }
            )
        }
    );

    if (!Array.isArray(questionList) || questionList.length === 0) return;

    const head = document.head;
    if (!head) return;

    // Remove only the prefetch links previously inserted by this function
    Array.from(head.querySelectorAll('link[data-prefetch-generated="true"]')).forEach(link => {
        head.removeChild(link);
    });

    // Extract all resources in one pass
    const resources: Resource[] = [];
    questionList.forEach(
        q => {
            resources.push(...q.resources);
            if (q.subQuestions.length > 0) {
                q.subQuestions.forEach(
                    sq => {
                        resources.push(...sq.resources);
                    }
                )
            }
        }
    )

    // Append prefetch links
    resources.forEach(({ type, content }) => {
        if (type === 'paragraph') return;
        const asType = type === 'image' ? 'image' : 'audio';
        const linkEl = createPrefetchLink(content, asType);

        head.appendChild(linkEl);
    });
    console.log("prefetch %d resources", resources.length);
}
function createPrefetchLink(url: string, asType: 'image' | 'audio'): HTMLLinkElement {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = asType;
    link.href = url;
    link.setAttribute('data-prefetch-generated', 'true'); // tag for cleanup
    return link;
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