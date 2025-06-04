import { Question_PageIndex, QuestionID, Resource, TestDocument } from "../types/type";

// type ResourcePrefetch = {
//     resources: Resource[]
//     questionId: QuestionID
//     subQuestions: ResourcePrefetch[]
// }

// export async function CleanupPrefetch(): Promise<void> {
//     const head = document.head;
//     if (!head) return;

//     // Remove only the prefetch links previously inserted by this function
//     Array.from(head.querySelectorAll('link[data-prefetch-generated="true"]')).forEach(link => {
//         head.removeChild(link);
//     });
// }

// export async function PreFetchNeighborhood(doTestDataRef: MutableRefObject<TestSheet>, newPageIndex: number): Promise<void> {
//     const questionList = doTestDataRef.current.questionList;
//     const maxIndex = questionList.length;
//     if (newPageIndex - 1 >= 0) {
//         PrefetchThisQuestionResource(questionList[newPageIndex - 1]);
//     }
//     if (newPageIndex + 1 <= maxIndex) {
//         PrefetchThisQuestionResource(questionList[newPageIndex + 1]);
//     }
// }

// function PrefetchThisQuestionResource(question: QuestionAnswerRecord) {
//     const head = document.head;
//     if (!head) return;
//     const resourceList: ResourcePrefetch[] = [];
//     question.resources.forEach(
//         () => {
//             resourceList.push({ id: question.questionId, resources: question.resources } as ResourcePrefetch)
//         }
//     );
//     question.subQuestions.forEach(
//         (sq: QuestionAnswerRecord) => {
//             sq.resources.forEach(
//                 () => {
//                     resourceList.push({ id: sq.questionId, resources: sq.resources } as ResourcePrefetch)
//                 }
//             );
//         }
//     )
//     for (const res of resourceList) {
//         res.resources.forEach(
//             (resource) => {
//                 if (resource.type === "paragraph") {
//                     return;
//                 }
//                 const alreadyTryPrefetchLink = document.getElementById(`${res.id}-${resource.type}`)
//                 if (alreadyTryPrefetchLink) {
//                     return;
//                 }
//                 const linkEl = createPrefetchLink(resource.content, resource.type, res.id);
//                 head.appendChild(linkEl);
//             }
//         )

//     }
// }




// export async function PreFetchResources(testDocument: TestDocument): Promise<void> {
//     const questionList: Question_PageIndex[] = [];
//     testDocument[0].questionList.slice(0, 3).forEach(
//         q => {
//             questionList.push(q);

//         }
//     )


//     if (!Array.isArray(questionList) || questionList.length === 0) return;

//     const head = document.head;
//     if (!head) return;

//     // Remove only the prefetch links previously inserted by this function
//     Array.from(head.querySelectorAll('link[data-prefetch-generated="true"]')).forEach(link => {
//         head.removeChild(link);
//     });

//     // Extract all resources in one pass
//     const resourceList: ResourcePrefetch[] = [];
//     questionList.forEach(
//         q => {
//             resourceList.push({ id: q.questionId, resources: q.resources, });
//             if (q.subQuestions.length > 0) {
//                 q.subQuestions.forEach(
//                     sq => {
//                         resourceList.push({ id: sq.questionId, resources: sq.resources });
//                     }
//                 )
//             }
//         }
//     )

//     // Append prefetch links
//     resourceList.forEach(({ id, resources }) => {
//         resources.forEach(
//             (r => {

//                 if (r.type === 'paragraph') return;
//                 const asType = r.type === 'image' ? 'image' : 'audio';
//                 const linkEl = createPrefetchLink(r.content, asType, id);

//                 head.appendChild(linkEl);
//             })
//         )
//     });
//     console.log("prefetch %d resources", resourceList.length);
// }
// function createPrefetchLink(url: string, asType: 'image' | 'audio', id: QuestionID): HTMLLinkElement {
//     const link = document.createElement('link');
//     link.rel = 'prefetch';
//     link.as = asType;
//     link.href = url;
//     link.id = `${id}-${asType}`;
//     link.setAttribute('data-prefetch-generated', 'true'); // tag for cleanup
//     return link;
// }
// Dùng chung cho cả main question và subQuestions
interface ResourcePrefetch {
    resources: Resource[];
    questionId: QuestionID;
    subQuestions: ResourcePrefetch[];
}

type ResourceKey = `${QuestionID}-${"audio" | "image"}`;

//------------------------------------------------------
// State chung module
//------------------------------------------------------

const pending: Set<ResourceKey> = new Set();

//------------------------------------------------------
// Xóa các link prefetch đã sinh
//------------------------------------------------------

export async function cleanupPrefetch(): Promise<void> {
    const head = document.head;
    if (!head) return;

    head.querySelectorAll('link[data-prefetch-generated]')
        .forEach(link => link.remove());
    pending.clear();
}

//------------------------------------------------------
// Prefetch tài nguyên của trang lân cận
//------------------------------------------------------

export async function prefetchNeighborhood(
    questions: ResourcePrefetch[],
    currentIndex: number
): Promise<void> {
    if (!questions?.length) return;

    const tasks: Promise<void>[] = [];
    [currentIndex - 1, currentIndex + 1].forEach(idx => {
        if (idx >= 0 && idx < questions.length) {
            tasks.push(prefetchQuestion(questions[idx]));
        }
    });
    await Promise.all(tasks);
}

//------------------------------------------------------
// Prefetch toàn bộ tài nguyên mẫu (ví dụ: first N questions)
//------------------------------------------------------

export async function prefetchResources(
    testDocument: TestDocument
): Promise<void> {
    const questions: ResourcePrefetch[] = [];
    testDocument[0].questionList.slice(0, 3).forEach(
        (q: Question_PageIndex) => {
            questions.push(q);

        }
    )
    if (!questions?.length) return;
    await Promise.all(
        questions.map(q => prefetchQuestion(q))
    );
}

//------------------------------------------------------
// Prefetch cho một câu hỏi (gồm cả subQuestions)
//------------------------------------------------------

async function prefetchQuestion(
    question: ResourcePrefetch
): Promise<void> {
    if (!question) return;
    const items = collectResources(question);

    items.forEach(({ key, url, asType }) => {
        if (pending.has(key)) return;
        pending.add(key);

        const schedule = (cb: VoidFunction) => {
            if ('requestIdleCallback' in window) {
                (window as any).requestIdleCallback(cb);
            } else {
                setTimeout(cb, 0);
            }
        };

        schedule(() => insertLink(url, asType, key));
    });
}

//------------------------------------------------------
// Gom nhóm tài nguyên chính và phụ, loại bỏ trùng lặp
//------------------------------------------------------

function collectResources(
    root: ResourcePrefetch
): { key: ResourceKey; url: string; asType: 'image' | 'audio' }[] {
    const map = new Map<ResourceKey, { url: string; asType: 'image' | 'audio' }>();

    const gather = (item: ResourcePrefetch) => {
        item.resources.forEach(r => {
            if (r.type === 'paragraph') return;
            const asType = r.type === 'image' ? 'image' : 'audio';
            const key = `${item.questionId}-${asType}` as ResourceKey;
            if (!map.has(key)) {
                map.set(key, { url: r.content, asType });
            }
        });
        // Đệ quy vào subQuestions
        item.subQuestions?.forEach(gather);
    };

    gather(root);

    return Array.from(map.entries()).map(([key, v]) => ({ key, ...v }));
}

//------------------------------------------------------
// Tạo và chèn link prefetch
//------------------------------------------------------

function insertLink(
    url: string,
    asType: 'image' | 'audio',
    key: ResourceKey
): void {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = asType;
    link.href = url;
    link.id = key;
    link.setAttribute('data-prefetch-generated', 'true');
    document.head.appendChild(link);
}
