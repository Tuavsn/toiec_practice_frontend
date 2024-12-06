import { ApiResponse, CategoryID, CategoryLabel, CategoryRow, ExerciseType, Lecture, LectureID, LectureRow, PracticePaper, ProfileHookState, QuestionID, QuestionRow, Resource, ResourceIndex, ResultID, TableData, Test, TestCard, TestDetailPageData, TestID, TestPaper, TestRecord, TestResultSummary, TestReviewAnswerSheet, TestRow, Topic, TopicID, UpdateQuestionForm, UserRow } from "../utils/types/type";
import axios from "./axios-customize";
const host = "https://toeic-practice-hze3cbbff4ctd8ce.southeastasia-01.azurewebsites.net";

export const loginUrl = `${host}/oauth2/authorize/google`;



export const callCreateCateogry = async (category: CategoryRow): Promise<boolean> => {
    try {
        await axios.post<ApiResponse<CategoryRow>>(
            `${import.meta.env.VITE_API_URL}/categories`,
            { format: category.format, year: category.year }
        );
        return true
    } catch (e) {
        return false;
    }
}

export const callGetTestPaper = async (testId: TestID, parts: string): Promise<ApiResponse<TestPaper>> => {
    const postfix = parts === '0' ? 'full-test' : `practice?parts=${parts}`;
    const response = await axios.get<ApiResponse<TestPaper>>(`${import.meta.env.VITE_API_URL}/tests/${testId}/${postfix}`);
    return response.data;
}

export const callPostTestRecord = async (testRecord: TestRecord): Promise<ApiResponse<{ resultId: ResultID }>> => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/tests/submit`, testRecord)
    return response.data;
}
export const callGetExercisePaper = async (exerciseType: ExerciseType): Promise<ApiResponse<TableData<QuestionRow>>> => {

    const response = await axios.get<ApiResponse<TableData<QuestionRow>>>(`${import.meta.env.VITE_API_URL}/questions?${exerciseType}&pageSize=200`,);
    return response.data;
}

export const callGetQuestionRows = async (testId: TestID, currentPageIndex: number, pageSize: number = 300): Promise<ApiResponse<TableData<QuestionRow>>> => {
    const response = await axios.get<ApiResponse<TableData<QuestionRow>>>(`${import.meta.env.VITE_API_URL}/tests/${testId}/questions?current=${currentPageIndex + 1}&pageSize=${pageSize}`)
    return response.data;
}

export const callPutQuestionUpdate = async (formData: UpdateQuestionForm, resources: ResourceIndex[]): Promise<boolean> => {
    try {
        // 1. Upload resources and get their URLs
        const resourceUrls = await Promise.all(
            resources.map((r) => callPostConvertResourceToLink(r.file))
        );

        // 2. Update question with the resources
        await callPostQuestionResource(formData.id, resourceUrls, resources)


        // 3. Update the question form data
        await axios.post(`${import.meta.env.VITE_API_URL}/questions`, formData);

        return true;
    } catch (error) {
        console.error("Error updating question:", error);
        return false;
    }
};

const callPostQuestionResource = async (questionID: QuestionID, url: string[], resources: ResourceIndex[]): Promise<boolean> => {
    try {
        const res = resources.map((r, i) => {
            return {
                type: r.type,
                content: r.file ? url[i] : r.content
            } as Resource
        })
        await axios.post(`${import.meta.env.VITE_API_URL}/questions/${questionID}/update/resource`,
            { res }
        );
        return true;
    } catch (error) {
        return false;

    }
}

export const callPutAssignmentQuestionUpdate = async (formData: any): Promise<boolean> => {
    try {
        await axios.post<ApiResponse<TableData<QuestionRow>>>(`${import.meta.env.VITE_API_URL}/lectures/${formData.id}/savePractice`, formData);
        return true;
    } catch (error) {
        return false;

    }
}

export const callPostAssignmentQuestion = async (formData: any): Promise<boolean> => {
    try {
        await axios.post<ApiResponse<TableData<QuestionRow>>>(`${import.meta.env.VITE_API_URL}/lectures/${formData.id}/savePractice`, formData);
        return true;
    } catch (error) {
        return false;

    }
}

export const callGetTopics = async (): Promise<ApiResponse<Topic[]>> => {
    const response = await axios.get<ApiResponse<Topic[]>>(`${import.meta.env.VITE_API_URL}/topics`)
    return response.data;
}

export const callGetResult = async (id: ResultID): Promise<ApiResponse<TestResultSummary>> => {
    // nếu dùng pageNumber thì dùng Api
    const response = await axios.get<ApiResponse<TestResultSummary>>(`${import.meta.env.VITE_API_URL}/results/${id}?current=1&pageSize=99`);
    return response.data;
}

export const callGetReviewTestPaper = async (id: ResultID): Promise<TestReviewAnswerSheet | null> => {
    try {
        const response = await axios.get<ApiResponse<TestReviewAnswerSheet>>(`${import.meta.env.VITE_API_URL}/results/${id}/review`);
        return response.data.data;
    } catch (e) {
        return null;
    }
}

export const callGetCategoryLabel = async (): Promise<ApiResponse<CategoryLabel[]>> => {
    const response = await axios.get<ApiResponse<CategoryLabel[]>>(`${import.meta.env.VITE_API_URL}/categories/none-page`);
    return response.data;
}

export const callGetTestCard = async (format: string, year: number, pageIndex: number): Promise<ApiResponse<TableData<TestCard>>> => {
    const response = await axios.get<ApiResponse<TableData<TestCard>>>(`${import.meta.env.VITE_API_URL}/categories/tests?format=${format}&year=${year}&current=${pageIndex + 1}&pageSize=8`);
    return response.data;
}

export const callGetPracticePaper = async (lectureId: LectureID): Promise<ApiResponse<PracticePaper>> => {
    const response = await fetch(`https://dummyjson.com/c/e6c2-181c-4ceb-86b1?lecture=${lectureId}`);
    const apiResponse: ApiResponse<PracticePaper> = await response.json();
    return apiResponse
}

export const callPostDoctrine = async (lectureId: LectureID, request: string): Promise<boolean> => {
    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/lectures/${lectureId}/saveContent`,
            request,
            {
                headers: {
                    'Content-Type': 'text/plain',
                },
            }
        );
        return true;
    } catch (e: unknown) {
        return false;
    }
}
export const callGetLectureRow = async (pageNumber: number): Promise<TableData<LectureRow> | Error> => {
    try {
        const response = await axios.get<ApiResponse<TableData<LectureRow>>>(`${import.meta.env.VITE_API_URL}/lectures?info=true&current=${pageNumber + 1}&pageSize=5`);
        return response.data.data;
    } catch (error) {
        return (error as Error)
    }
}
export const callPutLectureDetailUpdate = async (lectureID: LectureID, name: string, topicIds: TopicID[]): Promise<boolean> => {
    try {
        await axios.put(`${import.meta.env.VITE_API_URL}/lectures/${lectureID}`, {
            name,
            topicIds
        })
        return true
    } catch (error: unknown) {
        return false
    }
}

export const callPostLectureDetail = async (name: string, topicIds: TopicID[]): Promise<boolean> => {
    try {
        await axios.post<ApiResponse<any>>(`${import.meta.env.VITE_API_URL}/lectures`, {
            name,
            topicIds
        })
        return true
    } catch (error: unknown) {
        return false
    }
}


export const callGetLectureDoctrine = async (lectureID: LectureID): Promise<string | Error> => {
    try {
        const response = await axios.get<ApiResponse<Lecture>>(`${import.meta.env.VITE_API_URL}/lectures/${lectureID}?content=true`);
        return response.data.data.content;
    } catch (error) {
        return (error as Error);
    }
}

export const callDeleteLecture = async (lectureID: LectureID): Promise<boolean> => {
    try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/lectures/${lectureID}`);
        return true;
    } catch (error) {
        return false;
    }
}

export const callGetAssignmentRows = async (lectureID: LectureID): Promise<QuestionRow[]> => {
    const response = await axios.get<ApiResponse<Lecture>>(`${import.meta.env.VITE_API_URL}/lectures/${lectureID}?PRACTICE=true`)
    return response.data.data.practiceQuestions || [];
}

export const callPostImportExcel = async (testID: TestID, excelFiles: File[]): Promise<string> => {
    try {
        if (excelFiles.length <= 0) {
            return "";
        }
        const excelFormData = new FormData();
        excelFiles.forEach((file) => excelFormData.append("file", file));

        await axios.post<ApiResponse<any>>(`${import.meta.env.VITE_API_URL}/tests/${testID}/import`, excelFormData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return ""
    } catch (e) {
        return (e as Error).message;
    }
}
const callPostConvertResourceToLink = async (resourse: File | null): Promise<string> => {
    try {
        if (!resourse) {
            return "";
        }
        const resourceFormData = new FormData();
        resourceFormData.append("files", resourse);
        const response = await axios.post<ApiResponse<string[]>>(`${import.meta.env.VITE_API_URL}/tests/resources/upload`, resourceFormData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data.data[0];
    } catch (e) {
        return "";
    }
}
export const callPostImportResource = async (resourceFiles: File[]): Promise<string> => {
    try {
        if (resourceFiles.length <= 0) {
            return "";
        }
        const resourceFormData = new FormData();
        resourceFiles.forEach((file) => resourceFormData.append("files", file));

        await axios.post<ApiResponse<any>>(`${import.meta.env.VITE_API_URL}/tests/resources/upload`, resourceFormData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return ""
    } catch (e) {
        return (e as Error).message;
    }
}



export const callGetUserRow = async (currentPageIndex: number, pageSize: number = 5): Promise<TableData<UserRow> | null> => {
    try {
        const response = await axios.get<ApiResponse<TableData<UserRow>>>(`${import.meta.env.VITE_API_URL}/users?current=${currentPageIndex + 1}&pageSize=${pageSize}`);
        return response.data.data;
    } catch (error) {
        return null;
    }

}

export const callGetCategoryRow = async (currentPageIndex: number, pageSize: number = 5): Promise<TableData<CategoryRow> | null> => {
    try {
        const response = await axios.get<ApiResponse<TableData<CategoryRow>>>(`${import.meta.env.VITE_API_URL}/categories?current=${currentPageIndex + 1}&pageSize=${pageSize}`);
        return response.data.data;
    } catch (error) {
        return null;
    }
}
export const callGetTestRow = async (categoryID: CategoryID, currentPageIndex: number, pageSize: number = 5): Promise<TableData<TestRow> | null> => {
    try {
        const response = await axios.get<ApiResponse<TableData<TestRow>>>(`${import.meta.env.VITE_API_URL}/categories/${categoryID}/tests?current=${currentPageIndex + 1}&pageSize=${pageSize}`);
        return response.data.data;
    } catch (error) {
        return null;
    }
}

export const callPostUpdateCategoryRow = async (category: CategoryRow): Promise<boolean> => {
    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/categories/${category.id}`, {
            format: category.format,
            year: category.year
        });
        return true;
    } catch (error) {
        return false;
    }
}
export const callPostDeleteCategoryRow = async (category: CategoryRow): Promise<boolean> => {
    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/categories/${category.id}`, {
            isActive: false
        });
        return true;
    } catch (error) {
        return false;
    }
}
export const callPostDeleteTestRow = async (test: TestRow): Promise<boolean> => {
    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/tests/${test.id}`, {
            isActive: false
        });
        return true;
    } catch (error) {
        return false;
    }
}

export const callPutUpdateUserRow = async (user: UserRow): Promise<boolean> => {
    try {
        await axios.put(`${import.meta.env.VITE_API_URL}/users/${user.id}/status`, {
            isActive: false
        });
        return true;
    } catch (error) {
        return false;
    }
}


export const callPostTest = async (testRow: TestRow): Promise<boolean> => {
    try {
        axios.post<ApiResponse<Test>>(`${import.meta.env.VITE_API_URL}/tests`, {
            name: testRow.name,
            categoryId: testRow.idCategory,
            totalUserAttempt: testRow.totalUserAttempt,
            totalQuestion: testRow.totalQuestion,
            totalScore: testRow.totalScore,
            limitTime: testRow.limitTime,
        });
        return true
    } catch (error) {
        return false
    }
}
export const callPostUpdateTest = async (testRow: TestRow): Promise<boolean> => {
    try {
        axios.post<ApiResponse<Test>>(`${import.meta.env.VITE_API_URL}/tests/${testRow.id}`, {
            name: testRow.name,
            categoryId: testRow.idCategory,
            totalUserAttempt: testRow.totalUserAttempt,
            totalQuestion: testRow.totalQuestion,
            totalScore: testRow.totalScore,
            limitTime: testRow.limitTime,
        });
        return true
    } catch (error) {
        return false
    }
}

export const callGetTestDetailPageData = async (testID: TestID): Promise<TestDetailPageData | null> => {
    try {
        const response = await axios.get<ApiResponse<TestDetailPageData>>(`${import.meta.env.VITE_API_URL}/tests/${testID}/info`);
        return response.data.data;
    } catch (error) {
        return null;
    }
}

export const callGetProfile = async (): Promise<ProfileHookState | null> => {
    try {
        const response = await axios.get<ApiResponse<ProfileHookState>>(`${import.meta.env.VITE_API_URL}/auth/account`);
        return response.data.data;
    } catch (error) {
        return null;
    }
}

//test
function getRandomTopics(array: string[], count: number): string[] {
    return array.sort(() => Math.random() - 0.5).slice(0, count);
}
const topicIdArray: string[] = [
    "6729f1c03f5c033083992e95",
    "6729f24d709f571669727b6d",
    "6729f2ad709f571669727b6e",
    "6729f5c9709f571669727b6f",
    "6729f7c2709f571669727b70",
    "6729f9c0709f571669727b71",
    "6729fa6a709f571669727b72",
    "672a2dd7a07d4b4d1b8d7679",
    "672a2e78a07d4b4d1b8d767a",
    "672a2ee6a07d4b4d1b8d767b",
    "672a2f43a07d4b4d1b8d767c",
    "672a3014a07d4b4d1b8d767d",
    "672a30c5a07d4b4d1b8d767e",
    "672a312fa07d4b4d1b8d767f",
    "672a319ba07d4b4d1b8d7680",
    "672ad610962cf22580ad1670",
    "672ada37dd1e325366e41d01",
    "672adc4add1e325366e41d02",
    "672ade21dd1e325366e41d03",
    "672ae048dd1e325366e41d04",
    "672ae19fdd1e325366e41d05",
    "672ae240dd1e325366e41d06",
    "672ae3abdd1e325366e41d07",
    "672ae411dd1e325366e41d08",
    "672ae4c1dd1e325366e41d09",
    "672ae548dd1e325366e41d0a",
    "672ae5ffdd1e325366e41d0b",
    "672ae796dd1e325366e41d0c",
    "672ae80ddd1e325366e41d0d",
    "672ae87bdd1e325366e41d0e",
    "672ae8d8dd1e325366e41d0f",
    "672b35f59e302318ee8724e2",
    "672b36689e302318ee8724e3",
    "672b376d9e302318ee8724e4",
    "672b37c29e302318ee8724e5",
    "672b3c839e302318ee8724e6",
    "672b3dc29e302318ee8724e7",
    "672b69733197f909155e4de9",
    "672b69c33197f909155e4dea",
    "672b6ad13197f909155e4deb",
    "672b6b163197f909155e4dec",
    "672b6b843197f909155e4ded",
    "672b6bf43197f909155e4dee",
    "672b6cb23197f909155e4def",
    "672b6db33197f909155e4df0",
    "672b6dea3197f909155e4df1",
    "672b70443197f909155e4df2",
    "672b76c23197f909155e4df3",
    "672b793a3197f909155e4df4",
    "672b79a33197f909155e4df5",
    "672b7a5b3197f909155e4df6",
    "672b7b173197f909155e4df7",
    "672b7b353197f909155e4df8",
    "672b7d443197f909155e4df9",
    "672b7dc73197f909155e4dfa",
    "672b80043197f909155e4dfb",
    "672b80293197f909155e4dfc",
    "672b803f3197f909155e4dfd",
    "672b80af3197f909155e4dfe",
    "672b80ca3197f909155e4dff",
    "672b81a43197f909155e4e00",
    "672b81de3197f909155e4e01",
    "672b81f93197f909155e4e02",
    "672b82103197f909155e4e03",
    "672b82243197f909155e4e04",
    "672b82a43197f909155e4e05",
    "672b82e23197f909155e4e06",
    "672b833a3197f909155e4e07",
    "672b83953197f909155e4e08",
    "672b83f83197f909155e4e09",
    "672b846d3197f909155e4e0a",
    "672b84a53197f909155e4e0b"
]
// Helper function for sequential processing
async function processEach<T>(array: T[], callback: (item: T) => Promise<any>) {
    const results: any[] = [];
    for (const item of array) {
        results.push(await callback(item));
    }
    return results;
}

// Main function
export async function processQuestions(questionArray: QuestionRow[]) {
    try {
        const responses = await processEach(questionArray, async (question) => {
            const selectedTopics = getRandomTopics(topicIdArray, 2 + Math.floor(Math.random() * 2)); // 2 or 3 topics
            question.listTopics = selectedTopics;

            const formData: UpdateQuestionForm = {
                id: question.id,
                testId: question.testId,
                practiceId: question.practiceId ?? "",
                content: question.content,
                difficulty: question.difficulty,
                listTopicIds: question.listTopics,
                transcript: question.transcript ?? "",
                explanation: question.explanation ?? "",
                answers: question.answers,
                correctAnswer: question.correctAnswer,
            };

            // Post the updated question
            return axios.post(`${import.meta.env.VITE_API_URL}/questions`, formData);
        });

        console.log('All questions processed:', responses);
    } catch (error) {
        console.error('Error processing questions:', error);
    }
}