import { Content, GenerateContentConfig, GoogleGenAI, HarmBlockThreshold, HarmCategory, Schema, Type } from "@google/genai";
import { isCancel } from "axios";
import { Toast } from "primereact/toast";
import { emptyOverallStat } from "../utils/types/emptyValue";
import { ProfileHookState } from "../utils/types/state";
import {
    ApiResponse, AssignmentQuestion, CategoryID,
    CategoryLabel, CategoryRow, Comment_t, CommentPage,
    CommentReport, CreateCommentReportPayload,
    CreateCommentRequest, DeleteCommentRequest,
    ExerciseType, GradedFeedback, ImageDataWithMimeType, Lecture, LectureCard, LectureID,
    LectureProfile, LectureRow, Permission, PermissionID,
    PexelsPhoto, PexelsSearchResponse, QuestionID, QuestionRow, RecommendDoc, RecommendLecture, RecommendTest, RelateLectureTitle, Resource, ResourceIndex, ResultID, Role, TableData, TargetType, Test, TestCard, TestDetailPageData, TestID, TestPaper, TestRecord, TestResultSummary, TestReviewAnswerSheet, TestRow, Topic, TopicID, UpdateAssignmentQuestionForm, UpdateCommentReportStatusPayload, UpdateQuestionForm, UserComment, UserRow,
    WritingPart1Prompt
} from "../utils/types/type";
import axios from "./axios-customize";
const host = "https://toeic-practice-hze3cbbff4ctd8ce.southeastasia-01.azurewebsites.net";
//------------------------------------------------------
// Biến môi trường và Khởi tạo SDK
//------------------------------------------------------
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Sử dụng model bạn chỉ định, lấy từ .env
const GEMINI_MODEL_FOR_IMAGE: string = import.meta.env.VITE_GEMINI_MULTIMODAL_MODEL;
const GEMINI_MODEL_FOR_TEXT: string = import.meta.env.VITE_GEMINI_TEXT_MODEL;
const defaultSafetySettingsList = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];
let ai: GoogleGenAI | null = null; // Using GoogleGenAI type as per your import
if (GEMINI_API_KEY) {
    // Instantiating with `new GoogleGenAI({ apiKey: ... })` as per your example structure
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
} else {
    console.error("Thiếu VITE_GEMINI_API_KEY. Vui lòng kiểm tra file .env của bạn.");
}

const PEXELS_BASE_URL = 'https://api.pexels.com/v1';
export const loginUrl = `${host}/oauth2/authorize/google`;

export const wakeupServers = async (): Promise<void> => {
    try {

        await Promise.all(
            [
                axios.get(`${import.meta.env.VITE_API_URL}/categories?current=1&pageSize=1`),
                fetch(import.meta.env.VITE_TOXIC_CLASSIFIER_API_URL, { method: "HEAD" })
            ]
        )
    } catch (e: unknown) {
        console.error("wakeup server fail !!!");

    }
}

export const callCreateCategory = async (category: CategoryRow): Promise<boolean> => {
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

export const callGetTestPaper = async (testId: TestID, parts: string): Promise<ApiResponse<TestPaper> | null> => {
    const postfix = parts === '0' ? 'practice?parts=1234567' : `practice?parts=${parts}`;
    try {
        const response = await axios.get<ApiResponse<TestPaper>>(`${import.meta.env.VITE_API_URL}/tests/${testId}/${postfix}`);
        return response.data;

    } catch (error: any) {
        if (error.name === "CanceledError") {
            console.log("Yêu cầu đã bị hủy");
        } else {
            console.error("Lỗi khi lấy dữ liệu:", error);
        }
        return null;
    }
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
        await callPutQuestionResource(formData.id, resourceUrls, resources)


        // 3. Update the question form data
        await axios.put(`${import.meta.env.VITE_API_URL}/questions`, formData);

        return true;
    } catch (error) {
        console.error("Error updating question:", error);
        return false;
    }
};
export const callPutAssignmentQuestionUpdate = async (formData: UpdateAssignmentQuestionForm, lectureId: LectureID, resources: ResourceIndex[]): Promise<boolean> => {
    try {
        // 1. Upload resources and get their URLs
        const resourceUrls = await Promise.all(
            resources.map((r) => callPostConvertResourceToLink(r.file))
        );

        const res = resources.map((r, i) => {
            return {
                type: r.type,
                content: r.file ? resourceUrls[i] : r.content
            } as Resource
        })


        // 3. Update the question form data
        await axios.put(`${import.meta.env.VITE_API_URL}/lectures/${lectureId}/practice`,
            {
                index: formData.questionNum - 1,
                practiceQuestion: {
                    content: formData.content,
                    resources: res,
                    transcript: formData.transcript,
                    explanation: formData.explanation,
                    answers: formData.answers,
                    correctAnswer: formData.correctAnswer,
                }
            }
        );

        return true;
    } catch (error) {
        console.error("Error updating question:", error);
        return false;
    }
};

export const callDeleteAssignmentQuestion = async (lectureId: LectureID, questionNum: number): Promise<boolean> => {
    try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/lectures/${lectureId}/practice`, {
            data: {
                index: questionNum - 1,
            }
        });
        return true;
    } catch (error) {
        console.error("Error deleting question:", error);
        return false;
    }
}

const callPutQuestionResource = async (questionID: QuestionID, url: string[], resources: ResourceIndex[]): Promise<boolean> => {
    try {
        const res = resources.map((r, i) => {
            return {
                type: r.type,
                content: r.file ? url[i] : r.content
            } as Resource
        })
        await axios.put(`${import.meta.env.VITE_API_URL}/questions/${questionID}/update/resource`,
            { res }
        );
        return true;
    } catch (error) {
        return false;

    }
}


export const callPostAssignmentQuestion = async (formData: UpdateAssignmentQuestionForm, lecture_id: LectureID, resources: ResourceIndex[]): Promise<boolean> => {
    try {
        const resourceUrls = await Promise.all(
            resources.map((r) => callPostConvertResourceToLink(r.file))
        );

        const res = resources.map((r, i) => {
            return {
                type: r.type,
                content: r.file ? resourceUrls[i] : r.content
            } as Resource
        })

        await axios.post<ApiResponse<TableData<QuestionRow>>>(`${import.meta.env.VITE_API_URL}/lectures/${lecture_id}/practice`,
            {
                practiceQuestion: {
                    content: formData.content,
                    resources: res,
                    transcript: formData.transcript,
                    explanation: formData.explanation,
                    answers: formData.answers,
                    correctAnswer: formData.correctAnswer,
                }
            }
        );
        return true;
    } catch (error) {
        return false;

    }
}

export const callGetTopics = async (): Promise<Topic[] | null> => {
    try {
        const response = await axios.get<ApiResponse<Topic[]>>(`${import.meta.env.VITE_API_URL}/topics`);
        return response.data.data;
    } catch (e) {
        return null;
    }
}

export const callGetResult = async (id: ResultID): Promise<ApiResponse<TestResultSummary>> => {
    // nếu dùng pageNumber thì dùng Api
    const response = await axios.get<ApiResponse<TestResultSummary>>(`${import.meta.env.VITE_API_URL}/results/${id}`);
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

export const callGetMyRecommend = async (): Promise<[(RecommendLecture[] | null), (RecommendTest[] | null)]> => {
    let recommendDoc: [(RecommendLecture[] | null), (RecommendTest[] | null)] = [null, null];
    try {

        const response = await axios.get<ApiResponse<RecommendDoc>>(`${import.meta.env.VITE_API_URL}/recommendations/me`)
        recommendDoc = [
            response.data.data.recommendedLectures,
            response.data.data.recommendedTests
        ]
    } catch (error) {
        console.error("Lỗi lấy gợi ý ");
    }
    finally {
        return recommendDoc;
    }
}


export const callGetCategoryLabel = async (): Promise<ApiResponse<CategoryLabel[]>> => {
    const response = await axios.get<ApiResponse<CategoryLabel[]>>(`${import.meta.env.VITE_API_URL}/categories/none-page`);
    return response.data;
}

export const callGetTestCard = async (format: string, year: number, pageIndex: number): Promise<ApiResponse<TableData<TestCard>>> => {
    const response = await axios.get<ApiResponse<TableData<TestCard>>>(`${import.meta.env.VITE_API_URL}/tests/public?format=${format}&year=${year}&current=${pageIndex + 1}&pageSize=6`);
    return response.data;
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
export const callGetLectureRow = async (signal: AbortSignal, pageNumber: number, searchText: string = ""): Promise<TableData<LectureRow> | "abort" | null> => {
    try {
        const response = await axios.get<ApiResponse<TableData<LectureRow>>>(`${import.meta.env.VITE_API_URL}/lectures?info=true&current=${pageNumber + 1}&pageSize=5&search=${searchText}`, { signal });
        return response.data.data;
    } catch (error) {
        if (isCancel(error)) {
            return "abort";
        }
        return null;
    }
}
export const callGetLectureCard = async (pageNumber: number, keyword: string, pageSize: number = 5): Promise<TableData<LectureCard> | null> => {
    try {
        const response = await axios.get<ApiResponse<TableData<LectureCard>>>(`${import.meta.env.VITE_API_URL}/lectures/client?info=true&current=${pageNumber + 1}&pageSize=${pageSize}&active=true&search=${keyword}`);
        return response.data.data;
    } catch (error) {
        return null
    }
}

export const callGetRelateLectures = async (lectureId: LectureID): Promise<RelateLectureTitle[] | null> => {
    try {
        const response = await axios.get<ApiResponse<RelateLectureTitle[]>>(`${import.meta.env.VITE_API_URL}/lectures/${lectureId}/random`);
        return response.data.data;
    } catch (error) {
        return null
    }
}
export const callGetLectureCardProfile = async (): Promise<LectureProfile | null> => {
    try {
        const response = await axios.get<ApiResponse<LectureProfile>>(`${import.meta.env.VITE_API_URL}/users/lectures`);
        return response.data.data;
    } catch (error) {
        return null
    }
}

export const callPutPercentLecture = async (lectureId: LectureID, percent: number): Promise<void> => {
    try {
        await axios.put<ApiResponse<any>>(`${import.meta.env.VITE_API_URL}/lectures/${lectureId}/percent`, { percent });
    } catch (error) {
        return
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
        return response.data.data.content ?? "không có nội dung";
    } catch (error) {
        return (error as Error);
    }
}

export const callPutLectureActive = async (lecture: LectureRow): Promise<boolean> => {
    try {
        await axios.put(`${import.meta.env.VITE_API_URL}/lectures/${lecture.id}/status`, {
            active: !lecture.active
        });
        return true;
    } catch (error) {
        return false;
    }
}
export const callPutRoleRowActive = async (role: Role): Promise<boolean> => {
    try {
        await axios.put(`${import.meta.env.VITE_API_URL}/roles/${role.id}/status`, {
            active: !role.active
        });
        return true;
    } catch (error) {
        return false;
    }
}
export const callPutPermissionRowActive = async (permission: Permission): Promise<boolean> => {
    try {
        await axios.put(`${import.meta.env.VITE_API_URL}/permissions/${permission.id}/status`, {
            active: !permission.active
        });
        return true;
    } catch (error) {
        return false;
    }
}

export const callGetAssignmentRows = async (lectureID: LectureID): Promise<AssignmentQuestion[] | null> => {
    try {

        const response = await axios.get<ApiResponse<Lecture>>(`${import.meta.env.VITE_API_URL}/lectures/${lectureID}?practice=true`)
        return response.data.data.practiceQuestions ?? [];
    } catch
    (e) {
        return null
    }
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



export const callGetUserRow = async (signal: AbortSignal, currentPageIndex: number, searchText: string, pageSize: number = 5): Promise<TableData<UserRow> | "abort" | null> => {
    try {
        const response = await axios.get<ApiResponse<TableData<UserRow>>>(`${import.meta.env.VITE_API_URL}/users?current=${currentPageIndex + 1}&pageSize=${pageSize}&search=${searchText}`, { signal });
        return response.data.data;
    } catch (error) {
        if (isCancel(error)) {
            return "abort";
        }
        return null;
    }

}
export const callGetRole = async (signal: AbortSignal, searchText: string = ""): Promise<TableData<Role> | "abort" | null> => {
    try {
        const response = await axios.get<ApiResponse<TableData<Role>>>(`${import.meta.env.VITE_API_URL}/roles?search=${searchText}`, { signal });
        return response.data.data;

    } catch (error) {
        if (isCancel(error)) {
            return "abort";
        }
        return null;
    }
}

export const callGetPermission = async (signal: AbortSignal, currentPageIndex: number, searchText: string = "", pageSize: number = 5): Promise<TableData<Permission> | "abort" | null> => {
    try {
        const response = await axios.get<ApiResponse<TableData<Permission>>>(`${import.meta.env.VITE_API_URL}/permissions?current=${currentPageIndex + 1}&pageSize=${pageSize}&search=${searchText}`, { signal });
        return response.data.data;

    } catch (error) {
        if (isCancel(error)) {
            return "abort";
        }
        return null;
    }
}
export const callGetPermissionList = async (): Promise<TableData<Permission> | null> => {
    try {
        const response = await axios.get<ApiResponse<TableData<Permission>>>(`${import.meta.env.VITE_API_URL}/permissions?current=1&pageSize=999&active=true`);
        return response.data.data;

    } catch (error) {
        return null;
    }
}

export const callPostRole = async (role: Role, permissionIDList: PermissionID[]): Promise<boolean> => {
    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/roles`, {
            name: role.name,
            description: role.description,
            permissionIds: permissionIDList,
        });
        return true;
    } catch (error) {
        return false;
    }
}
export const callPostPermission = async (permission: Permission): Promise<boolean> => {
    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/permissions`, {
            ...permission
        });
        return true;
    } catch (error) {
        return false;
    }
}
export const callPutUpdateRole = async (role: Role, permissionIDList: PermissionID[]): Promise<boolean> => {
    try {
        await axios.put(`${import.meta.env.VITE_API_URL}/roles/${role.id}`, {
            name: role.name,
            description: role.description,
            permissionIds: permissionIDList,
        });
        return true;
    } catch (error) {
        return false;
    }
}
export const callPutUpdatePermission = async (permission: Permission,): Promise<boolean> => {
    try {
        await axios.put(`${import.meta.env.VITE_API_URL}/permissions/${permission.id}`, {
            ...permission
        });
        return true;
    } catch (error) {
        return false;
    }
}
export const callGetCategoryRow = async (signal: AbortSignal, currentPageIndex: number, searchText: string = "", pageSize: number = 5): Promise<TableData<CategoryRow> | "abort" | null> => {
    try {
        const response = await axios.get<ApiResponse<TableData<CategoryRow>>>(`${import.meta.env.VITE_API_URL}/categories?current=${currentPageIndex + 1}&pageSize=${pageSize}&search=${searchText}`, { signal });
        return response.data.data;
    } catch (error) {
        if (isCancel(error)) {
            return "abort";
        }
        return null;
    }
}
export const callGetTestRow = async (signal: AbortSignal, categoryID: CategoryID, currentPageIndex: number, searchText: string, pageSize: number = 5): Promise<TableData<TestRow> | "abort" | null> => {
    try {
        const response = await axios.get<ApiResponse<TableData<TestRow>>>(`${import.meta.env.VITE_API_URL}/tests/${categoryID}?current=${currentPageIndex + 1}&pageSize=${pageSize}&search=${searchText}`, { signal });
        return response.data.data;
    } catch (error) {
        if (isCancel(error)) {
            return "abort";
        }
        return null;
    }
}

export const callGetTopicRow = async (signal: AbortSignal, currentPageIndex: number, searchText: string = "", pageSize: number = 5): Promise<TableData<Topic> | "abort" | null> => {
    try {
        const response = await axios.get<ApiResponse<TableData<Topic>>>(`${import.meta.env.VITE_API_URL}/topics/pagination?current=${currentPageIndex + 1}&pageSize=${pageSize}&search=${searchText}`, { signal: signal });
        return response.data.data;
    } catch (e) {
        if (isCancel(e)) {
            return "abort";
        }
        return null;
    }
}
export const callGetComments = async (currentPageIndex: number, pageSize: number = 5): Promise<TableData<UserComment> | null> => {
    try {
        const response = await fetch(`https://raw.githubusercontent.com/Tuavsn/toiec_practice_frontend/refs/heads/comment/src/api/dummy/comment_${currentPageIndex}_${pageSize}.json`);
        const responseData = await response.json() as ApiResponse<TableData<UserComment>>
        return responseData.data;
    } catch (e) {
        return null;
    }
}

export const callPutUpdateCategoryRow = async (category: CategoryRow): Promise<boolean> => {
    try {
        await axios.put(`${import.meta.env.VITE_API_URL}/categories/${category.id}`, {
            format: category.format,
            year: category.year
        });
        return true;
    } catch (error) {
        return false;
    }
}
export const callPutCategoryRowActive = async (category: CategoryRow): Promise<boolean> => {
    try {
        await axios.put(`${import.meta.env.VITE_API_URL}/categories/${category.id}/status`, {
            active: !category.active
        });
        return true;
    } catch (error) {
        return false;
    }
}
export const callPutUpdateRoleForUser = async (role: Role, user: UserRow): Promise<boolean> => {
    try {
        await axios.put(`${import.meta.env.VITE_API_URL}/users/${user.id}/role`, {
            roleId: role.id
        });
        return true;
    } catch (error) {
        return false;
    }
}
export const callPutTopicRowActive = async (topic: Topic): Promise<boolean> => {
    try {
        await axios.put(`${import.meta.env.VITE_API_URL}/topics/${topic.id}/status`, {
            active: !topic.active
        });
        return true;
    } catch (error) {
        return false;
    }
}
export const callPutDeleteTestRow = async (test: TestRow): Promise<boolean> => {
    try {
        await axios.put(`${import.meta.env.VITE_API_URL}/tests/${test.id}/status`, {
            active: !test.active
        });
        return true;
    } catch (error) {
        return false;
    }
}

export const callPutUpdateUserRow = async (user: UserRow): Promise<boolean> => {
    try {
        await axios.put(`${import.meta.env.VITE_API_URL}/users/${user.id}/status`, {
            active: !user.active
        });
        return true;
    } catch (error) {
        return false;
    }
}


export const callPostTest = async (testRow: TestRow): Promise<boolean> => {
    try {
        await axios.post<ApiResponse<Test>>(`${import.meta.env.VITE_API_URL}/tests`, {
            name: testRow.name,
            categoryId: testRow.idCategory,
            totalUserAttempt: testRow.totalUserAttempt,
            totalQuestion: testRow.totalQuestion,
            totalScore: testRow.totalScore,
            limitTime: testRow.limitTime,
            difficulty: testRow.difficulty,
        });
        return true
    } catch (error) {
        return false
    }
}
export const callPutUpdateTest = async (testRow: TestRow): Promise<boolean> => {
    try {
        await axios.put<ApiResponse<Test>>(`${import.meta.env.VITE_API_URL}/tests/${testRow.id}`, {
            name: testRow.name,
            totalQuestion: testRow.totalQuestion,
            totalScore: testRow.totalScore,
            limitTime: testRow.limitTime,
            difficulty: testRow.difficulty,
        });
        return true
    } catch (error) {
        return false
    }
}

export const callPutUpdateTopic = async (topicRow: Topic): Promise<boolean> => {
    try {
        await axios.put<ApiResponse<Topic>>(`${import.meta.env.VITE_API_URL}/topics`, {
            name: topicRow.name,
            solution: topicRow.solution,
            overallSkill: topicRow.solution,
        });
        return true
    } catch (error) {
        return false
    }
}

export const callPostTopic = async (topicRow: Topic): Promise<boolean> => {
    try {
        await axios.post<ApiResponse<Topic>>(`${import.meta.env.VITE_API_URL}/topics`, {
            name: topicRow.name,
            solution: topicRow.solution,
            overallSkill: topicRow.solution,
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
        const response = await axios.get<ApiResponse<ProfileHookState>>(`${import.meta.env.VITE_API_URL}/users/account`);
        if (!response.data.data.overallStat) {
            response.data.data.overallStat = emptyOverallStat;
        }

        return response.data.data;
    } catch (error) {
        return null;
    }
}

export const callPutUserTarget = async (targetScore: number): Promise<void> => {
    try {
        await axios.put<any>(`${import.meta.env.VITE_API_URL}/users/account/target`, { target: targetScore });
        console.log("ok");

    } catch (error) {
        console.error(error);
    }
}

export const callGetChatMessage = async (_message: string): Promise<string> => {
    try {
        // Simulate API call to virtual assistant
        // const response: ApiResponse<string> = await axios.post("/api/chat", { message });

        const resfetch = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en")//`https://raw.githubusercontent.com/trhanhtu/dummyjson/refs/heads/main/chatbotresponse_${index}.json`);
        const response = await resfetch.json();
        return response.text;
    } catch (error) {
        return "Error: Unable to connect.";
    }
}

export const callStartChat = async (questionId: string): Promise<ApiResponse<{ sessionId: string, chatResponse: { choices: [{ message: { role: string, content: string } }] } }> | null> => {
    try {
        const response = await axios.post<ApiResponse<{ sessionId: string, chatResponse: { choices: [{ message: { role: string, content: string } }] } }>>(
            `${import.meta.env.VITE_API_URL}/chatgpt/tutor`,
            { questionId }
        );
        return response.data;
    } catch (error) {
        console.error("Error starting chat:", error);
        return null;
    }
}

export const callContinueChat = async (questionId: string, sessionId: string, message: string): Promise<ApiResponse<{ chatResponse: { choices: [{ message: { role: string, content: string } }] } }> | null> => {
    try {
        const response = await axios.post<ApiResponse<{ chatResponse: { choices: [{ message: { role: string, content: string } }] } }>>(
            `${import.meta.env.VITE_API_URL}/chatgpt/tutor`,
            { questionId, sessionId, message }
        );
        return response.data;
    } catch (error) {
        console.error("Error continuing chat:", error);
        return null;
    }
}

export const fetchTableOfComments = async (toast: React.MutableRefObject<Toast | null>,
    page: number = 1,
    pageSize: number = 10,
    term?: string,
    signal?: AbortSignal,
    sortBy: string[] = ["createdAt"],
    sortDirection: string[] = ["desc"],
    active?: boolean,
): Promise<TableData<Comment_t> | null> => {
    try {
        const params = new URLSearchParams()
        params.append("current", page.toString())
        params.append("pageSize", pageSize.toString())

        if (term) params.append("term", term)

        sortBy.forEach((sort, index) => {
            params.append("sortBy", sort)
            if (sortDirection[index]) {
                params.append("sortDirection", sortDirection[index])
            }
        })

        if (active !== undefined) params.append("active", active.toString())

        const response = await axios.get<ApiResponse<TableData<Comment_t>>>(`${import.meta.env.VITE_API_URL}/comments?${params.toString()}`, { signal })
        return response.data.data
    } catch (error) {
        console.dir(error);
        if (isCancel(error) || (error as any).code === 'ERR_CANCELED') {
            return null
        }

        // Các lỗi khác thì show toast
        toast.current?.show({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không tải được bình luận',
            life: 3000,
        })
        return null
    }
}


export const fetchRootCommentList = async (
    targetType: TargetType,
    targetId: string,
    signal?: AbortSignal,
    page = 1,
    pageSize = 10,
    term?: string,
    sortBy: string[] = ["createdAt"],
    sortDirection: string[] = ["desc"],
    active?: boolean,
): Promise<CommentPage | null> => {
    try {
        const params = new URLSearchParams()
        params.append("current", page.toString())
        params.append("pageSize", pageSize.toString())

        if (term) params.append("term", term)

        sortBy.forEach((sort, index) => {
            params.append("sortBy", sort)
            if (sortDirection[index]) {
                params.append("sortDirection", sortDirection[index])
            }
        })

        if (active !== undefined) params.append("active", active.toString())

        const response = await axios.get<ApiResponse<CommentPage>>(
            `${import.meta.env.VITE_API_URL}/comments/root/${targetType}/${targetId}?${params.toString()}`, { signal }
        )

        return response.data.data
    } catch (error) {
        console.error("Error fetching root comments:", error)
        return null
    }
}

export const fetchRepliesList = async (
    targetType: TargetType,
    targetId: string,
    parentId: string,
    signal?: AbortSignal,
    page = 1,
    pageSize = 10,
    term?: string,
    sortBy: string[] = ["createdAt"],
    sortDirection: string[] = ["desc"],
    active?: boolean,
): Promise<CommentPage | null> => {
    try {
        const params = new URLSearchParams()
        params.append("current", page.toString())
        params.append("pageSize", pageSize.toString())

        if (term) params.append("term", term)

        sortBy.forEach((sort, index) => {
            params.append("sortBy", sort)
            if (sortDirection[index]) {
                params.append("sortDirection", sortDirection[index])
            }
        })

        if (active !== undefined) params.append("active", active.toString())

        const response = await axios.get<ApiResponse<CommentPage>>(
            `${import.meta.env.VITE_API_URL}/comments/replies/${targetType}/${targetId}/${parentId}?${params.toString()}`, { signal }
        )

        return response.data.data
    } catch (error) {
        console.error("Error fetching replies:", error)
        return null
    }
}

export const createComment = async (commentData: CreateCommentRequest, signal?: AbortSignal): Promise<Comment_t | null> => {
    try {
        const response = await axios.post<ApiResponse<Comment_t>>(`${import.meta.env.VITE_API_URL}/comments`, commentData, { signal })

        return response.data.data
    } catch (error) {
        console.error("Error creating comment:", error)
        return null
    }
}

export const deleteOneComment = async (
    commentId: string,
    deleteRequest: DeleteCommentRequest,
    signal?: AbortSignal
): Promise<Comment_t | null> => {
    try {
        const response = await axios.delete<ApiResponse<Comment_t>>(`${import.meta.env.VITE_API_URL}/comments/${commentId}`, { data: deleteRequest, signal })

        return response.data.data
    } catch (error) {
        console.error("Error deleting comment:", error)
        return null
    }
}

export const toggleOneLike = async (commentId: string, signal?: AbortSignal): Promise<Comment_t | null> => {
    try {
        const response = await axios.put<ApiResponse<Comment_t>>(`${import.meta.env.VITE_API_URL}/comments/toggle-like/${commentId}`, undefined, { signal })

        return response.data.data
    } catch (error) {
        console.error("Error toggling like:", error)
        return null
    }
}

export const toggleActive = async (commentId: string): Promise<Comment_t | null> => {
    try {
        const response = await axios.put<ApiResponse<Comment_t>>(`${import.meta.env.VITE_API_URL}/comments/toggle-active/${commentId}`)

        return response.data.data
    } catch (error) {
        console.error("Error toggling active status:", error)
        return null
    }
}

/**
 * Gửi báo cáo cho một bình luận cụ thể.
 * (Submits a report for a specific comment.)
 *
 * @param commentId ID của bình luận cần báo cáo. (ID of the comment to be reported.)
 * @param reportData Dữ liệu báo cáo bao gồm lý do và chi tiết. (Report data including reason and details.)
 * @param signal (Tùy chọn) AbortSignal để có thể hủy request. (Optional AbortSignal to cancel the request.)
 * @returns Promise chứa đối tượng báo cáo đã được tạo (CommentReport_t) nếu thành công, hoặc null nếu thất bại trước khi request được gửi.
 * Ném lỗi (throws error) nếu API trả về lỗi, để component gọi có thể xử lý (ví dụ: hiển thị toast).
 * (Returns a Promise with the created report object (CommentReport_t) on success, or null if failed before request.
 * Throws an error if the API returns an error, allowing the calling component to handle it (e.g., show a toast).)
 */
export const submitCommentReport = async (
    reportData: CreateCommentReportPayload,
    signal?: AbortSignal
): Promise<CommentReport> => { // Changed to throw error instead of returning null for API errors
    try {
        // Endpoint: POST /comments/{commentId}/reports
        const response = await axios.post<ApiResponse<CommentReport>>(
            `${import.meta.env.VITE_API_URL}/comment-reports`,
            reportData,
            { signal } // Pass the AbortSignal to axios config
        );

        // Assuming your backend's ApiResponse wraps the actual data in a 'data' property
        // and includes a success message and statusCode.
        if (response.data && response.data.data) {
            // Log success message from API if needed, or let UI handle generic success
            // console.log(response.data.message);
            return response.data.data;
        } else {
            // This case should ideally not happen if backend follows ApiResponse strictly for success
            throw new Error('Phản hồi API không hợp lệ sau khi gửi báo cáo.');
            // (Invalid API response after submitting the report.)
        }
    } catch (error: any) {
        // Log the detailed error for debugging
        console.error(
            "Lỗi khi gửi báo cáo bình luận (Error submitting comment report):",
            error.response?.data?.message || error.response?.data || error.message
        );

        // Rethrow the error so the calling component (e.g., in UI, using a toast) can handle it
        // This allows for more specific error messages in the UI based on backend response
        throw error;
    }
};

/**
 * @en Fetches a paginated list of comment reports for admin.
 * @vi Lấy danh sách báo cáo bình luận đã phân trang cho quản trị viên.
 */
export const fetchAdminCommentReports = async (
    params: {
        page?: number;
        pageSize?: number;
        sortBy?: string;
        sortDirection?: 'asc' | 'desc';
        status?: string; // Assuming CommentReportStatus enum values are strings
        reasonCategory?: string;
        commentId?: string;
        reportedByUserId?: string;
    },
    signal?: AbortSignal
): Promise<TableData<CommentReport> | null> => {
    try {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('current', params.page.toString());
        if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
        if (params.status) queryParams.append('status', params.status);
        if (params.reasonCategory) queryParams.append('reasonCategory', params.reasonCategory);
        if (params.commentId) queryParams.append('commentId', params.commentId);
        if (params.reportedByUserId) queryParams.append('reportedByUserId', params.reportedByUserId);

        const response = await axios.get<ApiResponse<TableData<CommentReport>>>(
            `${import.meta.env.VITE_API_URL}/comment-reports?${queryParams.toString()}`, // Corrected URL
            { signal }
        );
        return response.data.data;
    } catch (error: any) {
        if (isCancel(error)) {
            console.log('Fetch admin comment reports cancelled');
        } else {
            console.error("Lỗi khi tải danh sách báo cáo (Error fetching admin comment reports):", error.response?.data || error.message);
        }
        return null; // Return null on error as per project pattern
    }
};

/**
 * @en Updates the status and admin notes of a specific comment report.
 * @vi Cập nhật trạng thái và ghi chú của quản trị viên cho một báo cáo bình luận cụ thể.
 */
export const updateAdminCommentReportStatus = async (
    reportId: string,
    payload: UpdateCommentReportStatusPayload,
    signal?: AbortSignal
): Promise<CommentReport | null> => {
    try {
        const response = await axios.put<ApiResponse<CommentReport>>(
            `${import.meta.env.VITE_API_URL}/comment-reports/${reportId}`, // Corrected URL, assuming status update is via PUT to the report itself
            payload,
            { signal }
        );
        return response.data.data;
    } catch (error: any) {
        if (isCancel(error)) {
            console.log('Update admin comment report status cancelled');
        } else {
            console.error("Lỗi khi cập nhật trạng thái báo cáo (Error updating report status):", error.response?.data || error.message);
        }
        return null;
    }
};

/**
 * @en Deletes a specific comment report. This typically means the report itself is removed, not the comment.
 * @vi Xóa một báo cáo bình luận cụ thể. Thao tác này thường xóa chính báo cáo đó, không phải bình luận.
 *
 * @param reportId The ID of the comment report to delete.
 * @param signal Optional AbortSignal.
 * @returns A Promise resolving to true if deletion was successful (e.g., 204 No Content), false otherwise.
 */
export const deleteAdminCommentReport = async (
    reportId: string,
    signal?: AbortSignal
): Promise<boolean | null> => { // Return boolean for success/fail, null for cancellation/network error
    try {
        // DELETE requests might return 204 No Content on success, or the deleted object, or a success message.
        // Adjust based on your actual backend response. Here, we assume 2xx means success.
        const response = await axios.delete<ApiResponse<null | { id: string }>>( // Backend might return null or the ID of deleted item
            `${import.meta.env.VITE_API_URL}/comment-reports/${reportId}`,
            { signal }
        );
        // Check for 2xx status codes for success.
        // Axios typically throws for non-2xx, but if it doesn't for some reason:
        return response.status >= 200 && response.status < 300;
    } catch (error: any) {
        if (isCancel(error)) {
            console.log('Delete admin comment report cancelled');
        } else {
            console.error("Lỗi khi xóa báo cáo (Error deleting report):", error.response?.data || error.message);
        }
        return null; // Returning null to indicate error or cancellation
    }
};

/**
 * @async
 * @function fetchData
 * @description Hàm fetch API chung với error handling cơ bản.
 * @param {string} url - URL để fetch.
 * @param {RequestInit} [options] - Các tùy chọn cho request.
 * @returns {Promise<T>} Dữ liệu trả về từ API.
 * @template T - Kiểu dữ liệu mong đợi trả về.
 * @throws {Error} Nếu request thất bại hoặc response không ok.
 */
async function fetchData<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        // Ghi log lỗi chi tiết hơn ở đây nếu cần (ví dụ: gửi tới một dịch vụ logging)
        console.error('API Error Response:', errorData);
        throw new Error(`Lỗi API: ${response.status} ${errorData.message || response.statusText}`);
    }
    return response.json() as Promise<T>;
}

//------------------------------------------------------
// Dịch vụ Pexels API
//------------------------------------------------------



/**
 * @async
 * @function fetchImageFromPexels
 * @description Tìm và lấy một hình ảnh ngẫu nhiên từ Pexels dựa trên từ khóa.
 * @param {string} keyword - Từ khóa để tìm kiếm hình ảnh.
 * @returns {Promise<PexelsPhoto | null>} Một đối tượng ảnh Pexels hoặc null nếu không tìm thấy.
 */
export async function fetchImageFromPexels(keyword: string): Promise<PexelsPhoto | null> {
    if (!PEXELS_API_KEY) {
        console.error("Thiếu PEXELS_API_KEY. Vui lòng kiểm tra file .env của bạn.");
        throw new Error("Chưa cấu hình Pexels API key.");
    }
    const url = `${PEXELS_BASE_URL}/search?query=${encodeURIComponent(keyword)}&per_page=10&page=1`;
    const options: RequestInit = {
        headers: {
            Authorization: PEXELS_API_KEY,
        },
    };

    try {
        const data = await fetchData<PexelsSearchResponse>(url, options);
        if (data.photos && data.photos.length > 0) {
            // Chọn một ảnh ngẫu nhiên từ kết quả trả về
            const randomIndex = Math.floor(Math.random() * data.photos.length);
            return data.photos[randomIndex];
        }
        return null; // Không tìm thấy ảnh nào
    } catch (error) {
        console.error(`Lỗi khi lấy ảnh từ Pexels với từ khóa "${keyword}":`, error);
        // Ném lại lỗi để hook có thể xử lý và cập nhật UI
        // Hoặc bạn có thể trả về một giá trị mặc định/thông báo lỗi cụ thể hơn
        throw error;
    }
}

//------------------------------------------------------
// Hàm tiện ích (Helper Functions)
//------------------------------------------------------


// Browser-compatible ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

//------------------------------------------------------
// Dịch vụ Gemini API (Using your specified syntax)
//------------------------------------------------------
export async function fetchAndConvertImageToBase64(imageUrl: string): Promise<ImageDataWithMimeType | null> {
    try {
        const response = await fetch(imageUrl); // CORS must allow this
        if (!response.ok) {
            console.error(`Lỗi khi tải hình ảnh ${imageUrl}: ${response.statusText}`);
            return null;
        }
        const mimeType = response.headers.get('Content-Type') || 'image/jpeg'; // Default if not found
        const imageArrayBuffer = await response.arrayBuffer();
        const base64Data = arrayBufferToBase64(imageArrayBuffer); // Your existing helper
        return { base64Data, mimeType };
    } catch (error) {
        console.error(`Lỗi khi fetch hoặc chuyển đổi hình ảnh ${imageUrl}:`, error);
        return null;
    }
}

/**
 * @async
 * @function generateKeywordsAndInstructionForPart1
 * @description Uses Gemini to look at an image, suggest two keywords, and form an instruction.
 * Model: GEMINI_MODEL_FOR_IMAGE (multimodal) from .env.
 * @param {string} base64ImageData - Dữ liệu ảnh base64.
 * @param {string} imageMimeType - Loại MIME của ảnh.
 * @param {string} [imageAltText] - Văn bản thay thế của ảnh.
 * @returns {Promise<Pick<WritingPart1Prompt, 'promptText' | 'mandatoryKeyword1' | 'mandatoryKeyword2'> | null>}
 * Object containing instruction and keywords, or null on error.
 */
export async function generateKeywordsAndInstructionForPart1(
    base64ImageData: string,
    imageMimeType: string,
    imageAltText?: string
): Promise<Pick<WritingPart1Prompt, 'promptText' | 'mandatoryKeyword1' | 'mandatoryKeyword2'> | null> {
    if (!ai) {
        console.error("Gemini AI SDK (GoogleGenAI) chưa được khởi tạo.");
        return null;
    }

    const imageContext = imageAltText ? `Image context (alt text): "${imageAltText}".` : "No alt text provided.";
    const keywordExtractionSystemInstruction: Content = {
        parts: [{ text: "You are a TOEIC Writing Part 1 test content creator. Your goal is to extract two relevant keywords from an image and formulate a standard test instruction. Follow the user's formatting instructions precisely." }]
    };
    const keywordExtractionPrompt = `
    Analyze the provided image carefully. ${imageContext}
    Your task is to:
    1. Identify two distinct, common, and relevant English words or short phrases (1-2 words each) from the main elements or action in the image.
    2. Formulate a standard TOEIC Part 1 instruction telling the test-taker to write one sentence describing the picture using these two words/phrases. Mention that word forms can be changed and used in any order.

    Provide your response strictly in the following format:
    KEYWORD1: [Your first chosen word/phrase]
    KEYWORD2: [Your second chosen word/phrase]
    INSTRUCTION: [The instruction text including the two keywords you chose.]

    Example:
    KEYWORD1: woman
    KEYWORD2: reading
    INSTRUCTION: Write one sentence that best describes the picture, using the words "woman" and "reading". You can change the forms of these words and use them in any order.
  `;

    const contentConfig: GenerateContentConfig = {
        safetySettings: defaultSafetySettingsList,
        temperature: 0.6, // Slightly more deterministic for keyword extraction
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 250,
        systemInstruction: keywordExtractionSystemInstruction,
    };
    try {
        const result = await ai.models.generateContent({
            model: GEMINI_MODEL_FOR_IMAGE,
            contents: [
                { inlineData: { mimeType: imageMimeType, data: base64ImageData } },
                { text: keywordExtractionPrompt },
            ],
            config: contentConfig
        });

        let rawResponseText: string | null = null;
        // (Code to extract rawResponseText from result, as in previous versions)
        if (result && typeof (result as any).text === 'string') {
            rawResponseText = (result as any).text;
        } else if (result && typeof (result as any).response?.text === 'function') {
            rawResponseText = (result as any).response.text();
        }


        if (!rawResponseText) { /* ... */ return null; }
        const lines = rawResponseText.trim().split('\n');
        let keyword1: string | undefined, keyword2: string | undefined, instruction: string | undefined;
        lines.forEach(line => {
            if (line.startsWith("KEYWORD1:")) keyword1 = line.replace("KEYWORD1:", "").trim();
            else if (line.startsWith("KEYWORD2:")) keyword2 = line.replace("KEYWORD2:", "").trim();
            else if (line.startsWith("INSTRUCTION:")) instruction = line.replace("INSTRUCTION:", "").trim();
        });
        if (keyword1 && keyword2 && instruction) return { promptText: instruction, mandatoryKeyword1: keyword1, mandatoryKeyword2: keyword2 };
        return null;
    } catch (error) {
        console.error("Error generating keywords/instruction with Gemini:", error);
        return null;
    }

}


/**
 * @async
 * @function suggestKeywordForImageSearch
 * @description Gợi ý từ khóa tìm ảnh sử dụng Gemini SDK (theo cú pháp bạn cung cấp).
 * Model: GEMINI_MODEL_FOR_TEXT từ .env (ví dụ "gemini-pro").
 * @returns {Promise<string | null>} Từ khóa gợi ý hoặc null nếu lỗi.
 */
export async function suggestKeywordForImageSearch(): Promise<string | null> {
    if (!ai) {
        console.error("Gemini AI SDK (GoogleGenAI) chưa được khởi tạo.");
        return null;
    }

    const promptText = "Suggest a single, common English keyword phrase (1-3 words maximum) suitable for finding diverse images for a TOEIC Part 1 task. Examples: 'office meeting', 'park bench', 'kitchen preparation'. Output only the keyword phrase, no extra text or quotes.";

    try {
        const contentConfig: GenerateContentConfig = {
            safetySettings: defaultSafetySettingsList,
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 15
        }
        // Sử dụng cú pháp ai.models.generateContent({...})
        const result = await ai.models.generateContent({
            model: GEMINI_MODEL_FOR_TEXT,
            contents: [{ text: promptText }],
            config: contentConfig
        });

        // Tương tự như trên, kiểm tra cách truy cập text
        if (result && typeof (result as any).text === 'string') {
            const keyword = (result as any).text.trim().replace(/["'.]/g, '');
            if (keyword.length === 0) {
                console.warn("Gemini trả về từ khóa rỗng.");
                return null;
            }
            return keyword;
        } else if (result && typeof (result as any).response?.text === 'function') {
            const keyword = (result as any).response.text().trim().replace(/["'.]/g, '');
            if (keyword.length === 0) {
                console.warn("Gemini trả về từ khóa rỗng (via response.text()).");
                return null;
            }
            return keyword;
        } else {
            console.warn("Không thể trích xuất keyword từ Gemini response. Cấu trúc result:", result);
            return null;
        }

    } catch (error) {
        console.error("Lỗi khi gợi ý từ khóa từ Gemini SDK (ai.models.generateContent):", error);
        return null;
    }
}

/**
 * @async
 * @function gradeAnswerWithGeminiSDK (Updated with JSON Schema & Vietnamese explanations)
 * @description Uses Gemini SDK to grade a user's answer, expecting JSON output.
 * All user-facing explanations will be in Vietnamese.
 */
export async function gradeAnswerWithGeminiSDK(
    sheetId: number,
    userAnswerText: string,
    originalPromptInstruction: string,
    mandatoryKeyword1: string,
    mandatoryKeyword2: string,
    imageUrlForContext: string,
    imageAltTextForContext?: string
): Promise<GradedFeedback | null> {
    if (!ai) { /* ... error handling ... */ return null; }

    const imageDataResult = await fetchAndConvertImageToBase64(imageUrlForContext);
    if (!imageDataResult) { /* ... error handling ... */ return null; }
    const { base64Data, mimeType } = imageDataResult;

    const systemInstructionForGrader: Content = {
        parts: [{ text: "Bạn là một giáo viên chấm điểm bài thi TOEIC Writing Part 1 nghiêm khắc nhưng công bằng và rất giỏi trong việc đưa ra phản hồi hữu ích. Tất cả các nhận xét, giải thích chi tiết và phản hồi tổng quát dành cho học viên PHẢI được viết hoàn toàn bằng TIẾNG VIỆT. Hãy tuân thủ định dạng JSON đầu ra được yêu cầu." }]
    };

    const gradingPromptText = `
    Người dùng được xem một hình ảnh (tôi sẽ cung cấp cho bạn) và nhận hướng dẫn sau: "${originalPromptInstruction}".
    Hai từ/cụm từ bắt buộc người dùng phải sử dụng là: "${mandatoryKeyword1}" và "${mandatoryKeyword2}".
    Câu trả lời của người dùng: "${userAnswerText}".
    Ngữ cảnh bổ sung cho hình ảnh (nếu có, từ alt text): "${imageAltTextForContext || 'Không có'}".

    Vui lòng đánh giá câu trả lời của người dùng dựa trên các tiêu chí sau cho bài thi TOEIC Part 1:
    1.  **Sử dụng Từ khóa Bắt buộc**: Người dùng có sử dụng đúng cả hai từ/cụm từ "${mandatoryKeyword1}" và "${mandatoryKeyword2}" (hoặc các dạng từ của chúng) trong câu không?
    2.  **Hoàn thành Nhiệm vụ**: Câu văn có phải là một câu đơn, hoàn chỉnh, mô tả chính xác các yếu tố/hành động chính trong tranh và đã kết hợp các từ khóa không?
    3.  **Ngữ pháp & Cấu trúc**: Cấu trúc câu, thì động từ, sự hòa hợp chủ vị, mạo từ, giới từ, v.v. có đúng không?
    4.  **Từ vựng**: Lựa chọn từ ngữ có phù hợp, chính xác và liên quan đến bức tranh và từ khóa không?

    Hãy cung cấp phản hồi của bạn dưới dạng một đối tượng JSON.
  `; // Note: The instruction to output JSON is implicit due to responseSchema. Explicitly stating it can also help.

    const gradingResponseSchema: Schema = {
        type: Type.OBJECT, // Changed from 'object' to 'OBJECT' as per some OpenAPI/Schema conventions
        properties: {
            score: { type: Type.INTEGER, description: "Điểm số từ 0 đến 5." },
            feedbackText: { type: Type.STRING, description: "Nhận xét tổng quan chi tiết (khoảng 3-5 câu) bằng tiếng Việt, giải thích điểm số, nêu điểm mạnh và điểm cần cải thiện." },
            grammarCorrections: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        original: { type: Type.STRING, description: "Phần câu gốc có lỗi (bằng tiếng Anh)." },
                        suggestion: { type: Type.STRING, description: "Gợi ý sửa lỗi (bằng tiếng Anh)." },
                        explanation: { type: Type.STRING, description: "Giải thích chi tiết về lỗi và cách sửa bằng tiếng Việt." }
                    },
                    required: ['original', 'suggestion', 'explanation']
                },
                description: "Một danh sách các lỗi cụ thể và cách sửa. Nếu không có lỗi, trả về một mảng rỗng []."
            }
        },
        required: ['score', 'feedbackText', 'grammarCorrections']
    };

    const contentConfigForGrading: GenerateContentConfig = {
        safetySettings: defaultSafetySettingsList,
        temperature: 0.4, // Lower temperature for more consistent grading
        topK: 30,
        topP: 0.9,
        maxOutputTokens: 800, // Allow more tokens for JSON structure and Vietnamese text
        systemInstruction: systemInstructionForGrader,
        responseSchema: gradingResponseSchema,
        responseMimeType: 'application/json',
    };

    try {
        // Using the structure `ai.models.generateContent({ model, contents, config })`
        // as per user's latest explicit example for the API call.
        const result = await ai.models.generateContent({
            model: GEMINI_MODEL_FOR_IMAGE,
            contents: [
                { inlineData: { mimeType: mimeType, data: base64Data } },
                { text: gradingPromptText },
            ],
            config: contentConfigForGrading
        });

        let rawResponseText: string | null = null;
        // Extract text based on SDK structure (assuming result.text or result.response.text())
        if (result && typeof (result as any).text === 'string') {
            rawResponseText = (result as any).text;
        } else if (result && typeof (result as any).response?.text === 'function') {
            rawResponseText = (result as any).response.text();
        } // Add other potential accessors if needed

        if (!rawResponseText) {
            console.warn("Gemini returned empty response for grading.");
            return null;
        }

        // If responseMimeType was 'application/json' and schema was used, expect JSON
        try {
            const parsedJson = JSON.parse(rawResponseText);
            // Validate parsedJson against expected GradedFeedback structure (basic check)
            if (typeof parsedJson.score !== 'number' || typeof parsedJson.feedbackText !== 'string' || !Array.isArray(parsedJson.grammarCorrections)) {
                console.error("Phản hồi JSON từ Gemini không đúng cấu trúc mong đợi:", parsedJson);
                // Fallback or return error - for now, try to make the best of it or return null
                // return null;
                // For a partial recovery if structure is slightly off but main fields exist:
                return {
                    id: sheetId.toString(),
                    answerId: sheetId.toString(),
                    score: parsedJson.score || 0,
                    feedbackText: parsedJson.feedbackText || "Lỗi: Không thể phân tích đầy đủ phản hồi JSON từ AI.",
                    grammarCorrections: parsedJson.grammarCorrections || [],
                    gradedAt: new Date(),
                };
            }
            return {
                id: sheetId.toString(),
                answerId: sheetId.toString(),
                score: parsedJson.score,
                feedbackText: parsedJson.feedbackText, // Should be in Vietnamese
                grammarCorrections: parsedJson.grammarCorrections.map((corr: any) => ({
                    original: corr.original, // English
                    suggestion: corr.suggestion, // English
                    explanation: corr.explanation, // Should be in Vietnamese
                })),
                gradedAt: new Date(),
            };
        } catch (e) {
            console.error("Lỗi khi phân tích JSON phản hồi từ Gemini:", e, "\nRaw response:", rawResponseText);
            // Fallback: if JSON parsing fails, maybe the old text parsing can be attempted or return a generic error
            // For now, return null or a generic error feedback
            return {
                id: sheetId.toString(),
                answerId: sheetId.toString(),
                score: 0,
                feedbackText: "Đã có lỗi xảy ra khi xử lý phản hồi từ AI chấm điểm. Vui lòng thử lại. (Lỗi phân tích JSON - Chi tiết đã được log)",
                grammarCorrections: [],
                gradedAt: new Date(),
            };
        }

    } catch (error) {
        console.error("Lỗi khi chấm điểm (JSON mode) bằng Gemini SDK:", error);
        return null;
    }
}