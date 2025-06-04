import { MutableRefObject } from "react";
import { Question_PageIndex, QuestionAnswerRecord, QuestionID, Resource, TestDocument, TestSheet } from "../types/type";

type ResourcePrefetch = {
    resources: Resource[]
    id: QuestionID
}

export async function CleanupPrefetch(): Promise<void> {
    const head = document.head;
    if (!head) return;

    // Remove only the prefetch links previously inserted by this function
    Array.from(head.querySelectorAll('link[data-prefetch-generated="true"]')).forEach(link => {
        head.removeChild(link);
    });
}

export async function PreFetchNeighborhood(doTestDataRef: MutableRefObject<TestSheet>, newPageIndex: number): Promise<void> {
    const questionList = doTestDataRef.current.questionList;
    const maxIndex = questionList.length;
    if (newPageIndex - 1 >= 0) {
        PrefetchThisQuestionResource(questionList[newPageIndex - 1]);
    }
    if (newPageIndex + 1 <= maxIndex) {
        PrefetchThisQuestionResource(questionList[newPageIndex + 1]);
    }
}

function PrefetchThisQuestionResource(question: QuestionAnswerRecord) {
    const head = document.head;
    if (!head) return;
    const resourceList: ResourcePrefetch[] = [];
    question.resources.forEach(
        () => {
            resourceList.push({ id: question.questionId, resources: question.resources } as ResourcePrefetch)
        }
    );
    question.subQuestions.forEach(
        (sq: QuestionAnswerRecord) => {
            sq.resources.forEach(
                () => {
                    resourceList.push({ id: sq.questionId, resources: sq.resources } as ResourcePrefetch)
                }
            );
        }
    )
    for (const res of resourceList) {
        res.resources.forEach(
            (resource) => {
                if (resource.type === "paragraph") {
                    return;
                }
                const alreadyTryPrefetchLink = document.getElementById(`${res.id}-${resource.type}`)
                if (alreadyTryPrefetchLink) {
                    return;
                }
                const linkEl = createPrefetchLink(resource.content, resource.type, res.id);
                head.appendChild(linkEl);
            }
        )

    }
}




export async function PreFetchResources(testDocument: TestDocument): Promise<void> {
    const questionList: Question_PageIndex[] = [];
    testDocument[0].questionList.slice(0, 3).forEach(
        q => {
            questionList.push(q);

        }
    )


    if (!Array.isArray(questionList) || questionList.length === 0) return;

    const head = document.head;
    if (!head) return;

    // Remove only the prefetch links previously inserted by this function
    Array.from(head.querySelectorAll('link[data-prefetch-generated="true"]')).forEach(link => {
        head.removeChild(link);
    });

    // Extract all resources in one pass
    const resourceList: ResourcePrefetch[] = [];
    questionList.forEach(
        q => {
            resourceList.push({ id: q.questionId, resources: q.resources, });
            if (q.subQuestions.length > 0) {
                q.subQuestions.forEach(
                    sq => {
                        resourceList.push({ id: sq.questionId, resources: sq.resources });
                    }
                )
            }
        }
    )

    // Append prefetch links
    resourceList.forEach(({ id, resources }) => {
        resources.forEach(
            (r => {

                if (r.type === 'paragraph') return;
                const asType = r.type === 'image' ? 'image' : 'audio';
                const linkEl = createPrefetchLink(r.content, asType, id);

                head.appendChild(linkEl);
            })
        )
    });
    console.log("prefetch %d resources", resourceList.length);
}
function createPrefetchLink(url: string, asType: 'image' | 'audio', id: QuestionID): HTMLLinkElement {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = asType;
    link.href = url;
    link.id = `${id}-${asType}`;
    link.setAttribute('data-prefetch-generated', 'true'); // tag for cleanup
    return link;
}