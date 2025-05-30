import { Content, GenerateContentConfig, GoogleGenAI, HarmBlockThreshold, HarmCategory, Schema, Type } from "@google/genai";
import { isCancel } from "axios";
import { Toast } from "primereact/toast";
import { MutableRefObject } from "react";
import { checkDraftInIndexDB } from "../database/indexdb";
import { emptyOverallStat } from "../utils/types/emptyValue";
import { ProfileHookState } from "../utils/types/state";
import * as promptsData from '../utils/types/ToeicSpeakingPrompts.json'; // Dữ liệu prompts được import trực tiếp
import {
    ApiResponse, AssignmentQuestion, CategoryID,
    CategoryLabel, CategoryRow, Comment_t, CommentPage,
    CommentReport, CreateCommentReportPayload,
    CreateCommentRequest, DeleteCommentRequest,
    DraftLocation,
    EssayQuestionApiResponse,
    ExerciseType, GradedFeedback, ImageDataWithMimeType, Lecture, LectureCard, LectureID,
    LectureProfile, LectureRow, Part2EmailContext, Permission, PermissionID,
    PexelsPhoto, PexelsSearchResponse, QuestionID, QuestionRow, RecommendDoc, RecommendLecture, RecommendTest, RelateLectureTitle, Resource, ResourceIndex, ResultID, Role, TableData, TargetType, Test, TestCard, TestDetailPageData, TestDraft, TestID, TestPaper, TestRecord, TestResultSummary, TestReviewAnswerSheet, TestRow, TestType, ToeicSpeakingPromptTask, Topic, TopicID, UpdateAssignmentQuestionForm, UpdateCommentReportStatusPayload, UpdateQuestionForm, UserComment, UserRow,
    WritingPart1Prompt,
    WritingToeicPart2ApiPromptData,
    WritingToeicPart2GradedFeedback,
    WritingToeicPart2GrammarCorrection,
    WritingToeicPart2PromptContextForGrading,
    WritingToeicPart3GradedFeedback
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
const GEMINI_MODEL_FOR_THINKING: string = import.meta.env.VITE_GEMINI_THINKING_MODEL;
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
                fetch(`${import.meta.env.VITE_API_URL}/categories?current=1&pageSize=1`, { method: "GET" }),
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

    const response = await axios.get<ApiResponse<TableData<QuestionRow>>>(`${import.meta.env.VITE_API_URL}/questions?${exerciseType}&pageSize=20`,);
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
        const response = await axios.get<ApiResponse<RecommendDoc>>(`${import.meta.env.VITE_API_URL}/recommendations/me`,)
        recommendDoc = [
            response.data.data.recommendedLectures,
            response.data.data.recommendedTests
        ]
    } catch (error) {
        console.error("Lỗi lấy gợi ý ", error);
    }
    finally {
        return recommendDoc;
    }
}


export const callGetIsDraftTestExist = async (testId: TestID, testType: TestType): Promise<DraftLocation> => {
    try {
        if (testType !== "fulltest") {
            return "none";
        }
        const isDraftInIndexDB = await checkDraftInIndexDB(testId);
        console.log("isdb", isDraftInIndexDB)
        if (isDraftInIndexDB) {
            return "indexDB";
        }
        const response = await axios.get<ApiResponse<{ exist: boolean }>>(`${import.meta.env.VITE_API_URL}/testDrafts/check-exist/${testId}`);
        if (response.data.data.exist) {
            return "server";
        }
        return "none";
    } catch (error) {
        console.error("Lỗi khi kiểm tra bài thi nháp:", error);
        return "none";
    }
}
export const callSaveDraftTestToServer = async (
    apiLock: MutableRefObject<boolean>,
    id: TestID,
    testDraft: TestDraft
): Promise<void> => {
    if (apiLock.current) return;

    try {
        apiLock.current = true;
        await axios.put(`${import.meta.env.VITE_API_URL}/testDrafts`, {
            testId: id,
            draftData: JSON.stringify(testDraft),
        });
    } catch (e) {
        console.error("Save draft failed:", e);
    } finally {
        apiLock.current = false;
    }
};

export const callDeleteDraftFromServer = async (
    testId: TestID
) => {
    try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/${testId}`)

    } catch (error: any) {
        console.error(error);
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

export const callGetDraftFromServer = async (testId: TestID): Promise<TestDraft | null> => {
    try {
        const response = await axios.get<ApiResponse<{ testId: string, draftData: string }>>(`${import.meta.env.VITE_API_URL}/testDrafts/${testId}`);
        return JSON.parse(response.data.data.draftData) as TestDraft;
    } catch (error: any) {
        console.error(error);
        return null;
    }

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

//------------------------------------------------------
// Section: API Functions cho TOEIC Writing Part 2
//------------------------------------------------------

/**
 * @async
 * @function generateEmailPromptForPart2
 * @description Gọi Gemini API để tạo một kịch bản email cho TOEIC Writing Part 2.
 * Trả về thông tin email nhận được dưới dạng JSON.
 * @returns {Promise<WritingToeicPart2ApiPromptData | null>} Dữ liệu email nhận được hoặc null nếu có lỗi.
 * @comment Bình luận bằng tiếng Việt: Hàm này gửi yêu cầu đến Gemini để tạo một email đề bài cho Part 2,
 * bao gồm người gửi, chủ đề, nội dung và các tác vụ cụ thể. Kết quả trả về dưới dạng JSON.
 */
export async function generateEmailPromptForPart2(alreadyDoneEmailTopicList: Part2EmailContext[] | undefined, signal?: AbortSignal,): Promise<WritingToeicPart2ApiPromptData | null> {
    // Kiểm tra xem SDK đã được khởi tạo chưa
    if (!ai) {
        console.error("Lỗi api.ts: Gemini AI SDK (GoogleGenAI) chưa được khởi tạo (thiếu API key?).");
        return null;
    }
    let excludedTopicsPromptSegment = "";
    if (alreadyDoneEmailTopicList && alreadyDoneEmailTopicList.length > 0) {
        const topicStrings = alreadyDoneEmailTopicList.map(
            (ec: Part2EmailContext) => {
                return `{ "senderEmail": ${ec.email}, recipientName: ${ec.recipientName},"subject": ${ec.subject}, "tasks": ${JSON.stringify(ec.tasks)} }`;
            }
        );
        const avoidTopicContextContent = topicStrings.join(",\n    ");
        excludedTopicsPromptSegment = `

Please ensure the new email scenario you generate is substantially different from the following topics already presented to the student. Do NOT repeat or closely rephrase these scenarios:
[
    ${avoidTopicContextContent}
]`;
    }
    // Prompt tiếng Anh cho Gemini (như đã thiết kế ở Bước 3.1)
    const englishPromptForGemini = `
[SYSTEM]
You are an AI assistant specialized in creating authentic and diverse English language learning content for the TOEIC® Speaking & Writing Tests. Your responses must be accurate, adhere to specified formats, and reflect typical workplace or business-related communication scenarios. All your generated content for the email prompt itself (senderName, senderEmail, recipientName, subject, body, tasks) should be in English.

[ROLE]
Act as an expert test content designer for TOEIC Writing Part 2 ("Respond to a written request"). Your task is to generate a complete email scenario that a test-taker would receive. This scenario includes the incoming email, the name of the recipient of that email, and a specific persona the test-taker must adopt for their reply.

[CONTEXT]
The email scenario you generate will be presented to a student preparing for the TOEIC Writing test. The student will have approximately 10 minutes to read the received email and write a response of about 100-150 words.
The core of the task is for the student to understand the incoming email and write an appropriate reply fulfilling the requests or addressing the points made, while adopting a given persona.

[TASK]
Generate ONE complete and unique email scenario.${excludedTopicsPromptSegment} 

The scenario MUST include:
1.  An incoming email with:
    * A plausible sender name ('senderName').
    * A plausible sender email address ('senderEmail').
    * A plausible recipient name ('recipientName') for the email. This should be a realistic human-sounding name (e.g., "Mr. John Smith", "Sarah Connor", "Dr. Evelyn Reed"). 
    * A clear and concise subject line ('subject').
    * A body ('body') that presents a situation and contains 2 OR 3 distinct actionable items.
        * The email body must follow standard business email conventions (Greeting, Opening, Body, Closing, Salutation).
        * **The Greeting in the 'body' MUST use the generated 'recipientName' (e.g., "Dear {{recipientName}},", "Hello {{recipientName}},"). Do NOT use generic placeholders like "[Recipient Name]", "[Employee Name]", or "[Customer Name]" in the greeting.** 
        * The 'body' should be written in a natural, professional tone. The length of this incoming email body should be concise, approximately 70-120 words.
    * A summary of the 2-3 actionable items in an array of strings ('tasks').

2.  A description of the persona the test-taker (who is acting as the 'recipientName') should adopt for their reply ('recipientPersonaDescription'). This description should be concise and align with the 'recipientName' and the email's content (e.g., if recipientName is "Cherie Black", persona could be "Cherie Black, a Marketing Representative").

To ensure variety in the generated scenarios, please consider creating emails that would require the test-taker (as the 'recipientPersonaDescription') to respond by:
    * Asking for information.
    * Making requests.
    * Providing information.
    * Making a complaint or explaining problems.
    * Making suggestions or recommendations.
    Feel free to combine these types or create other common business scenarios.

You MUST provide your output ONLY as a single, valid JSON object, following this exact structure. Do not include any explanatory text before or after the JSON object. Ensure all strings within the JSON are properly escaped.

JSON Structure:
{
  "senderName": "string",
  "senderEmail": "string",
  "recipientName": "string",
  "subject": "string",
  "body": "string",
  "tasks": [
    "string", 
    "string"
  ],
  "recipientPersonaDescription": "string"
}

Ensure the 'recipientPersonaDescription' logically describes the role of the 'recipientName'.
Now, generate a new, unique email scenario
  `;
    const generateEmailPromptResponseSchema: Schema = {
        type: Type.OBJECT,
        properties: {
            senderName: {
                type: Type.STRING,
                description: "Họ tên đầy đủ của người gửi email (ví dụ: 'Sarah Chen', 'Phòng Dịch Vụ Khách Hàng').",
            },
            senderEmail: {
                type: Type.STRING,
                description: "Một địa chỉ email hợp lệ cho người gửi (ví dụ: 's.chen@examplebiz.com', 'support@techsolutions.co').",
            },
            subject: {
                type: Type.STRING,
                description: "Một dòng chủ đề email rõ ràng và ngắn gọn.",
            },
            body: {
                type: Type.STRING,
                description: "Toàn bộ nội dung của email mà người dự thi nhận được. Chuỗi này nên chứa lời chào, mở đầu, nội dung chính với 2-3 mục cần hành động, và kết thúc. Sử dụng \\n cho các ngắt dòng nếu cần trong nội dung email.",
            },
            tasks: {
                type: Type.ARRAY,
                description: "Một mảng các chuỗi, mỗi chuỗi mô tả ngắn gọn một mục cần hành động hoặc câu hỏi trong email. Phải có 2 hoặc 3 mục.",
                items: {
                    type: Type.STRING,
                    description: "Mô tả ngắn gọn về một nhiệm vụ hoặc câu hỏi (ví dụ: 'Xác nhận ngày giao hàng cho đơn hàng #123', 'Hỏi về việc thêm mặt hàng Z vào đơn hàng')."
                }
            },
            recipientPersonaDescription: {
                type: Type.STRING,
                description: "Mô tả ngắn gọn vai trò người nhận (người dự thi) cần đóng, ví dụ: 'A Customer Service Manager'"
            },
            recipientName: {
                type: Type.STRING,
                description: "Tên của người nhận email (người dự thi) mà người gửi đã đề cập trong email. Ví dụ: 'Mr. John Doe', 'Ms. Jane Smith'."
            }
        },
        // Tất cả các trường này đều quan trọng để tạo thành một đề bài email hoàn chỉnh.
        required: ["senderName", "senderEmail", "subject", "body", "tasks"]
    };
    // Cấu hình cho Gemini API call
    const contentConfig: GenerateContentConfig = {
        abortSignal: signal,
        safetySettings: defaultSafetySettingsList,
        temperature: 0.75, // Tăng một chút sự sáng tạo cho kịch bản email
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096, // Email có thể dài hơn
        // Yêu cầu Gemini trả về JSON cho đề bài email
        responseMimeType: 'application/json',
        responseSchema: generateEmailPromptResponseSchema,
    };
    let rawResponseText: string | null = null;
    try {
        // Sử dụng model text phù hợp (ví dụ: gemini-pro)
        const result = await ai.models.generateContent({
            model: GEMINI_MODEL_FOR_THINKING, // Model phù hợp cho việc tạo text
            contents: [{ text: englishPromptForGemini }],
            // Sử dụng cấu trúc config như người dùng đã cung cấp
            // Nếu SDK của bạn mong đợi generationConfig và safetySettings riêng lẻ ở đây, hãy điều chỉnh.
            // Dựa trên ví dụ cuối cùng của người dùng `ai.models.generateContent({..., config: contentConfig})`
            // thì contentConfig nên chứa tất cả các thông số.
            // Tuy nhiên, các SDK Gemini thường có `generationConfig` và `safetySettings` là các thuộc tính riêng biệt
            // của object truyền vào `generateContent`, hoặc được set khi lấy model `genAI.getGenerativeModel({...})`.
            // Giả sử SDK của bạn hỗ trợ một object config chung như bạn đã ví dụ.
            // Nếu không, cấu trúc này cần được điều chỉnh:
            // generationConfig: { temperature: 0.75, topK: 40, topP: 0.95, maxOutputTokens: 1024, responseMimeType: 'application/json' },
            // safetySettings: defaultSafetySettingsList,
            // Tạm thời tuân theo cấu trúc config của bạn
            config: contentConfig
        });


        // Trích xuất text từ response (cần kiểm tra cấu trúc thực tế của `result` từ SDK `@google/genai` bạn đang dùng)
        if (result && typeof (result as any).text === 'string') { // Dựa trên ví dụ của người dùng về result.text
            rawResponseText = (result as any).text;
        } else if (result && typeof (result as any).response?.text === 'function') { // Cấu trúc SDK phổ biến hơn
            rawResponseText = (result as any).response.text();
        } else if (result && (result as any).response?.candidates?.[0]?.content?.parts?.[0]?.text) { // Một cấu trúc khả dĩ khác
            rawResponseText = (result as any).response.candidates[0].content.parts[0].text;
        }


        if (!rawResponseText) {
            console.warn("generateEmailPromptForPart2: Gemini trả về phản hồi rỗng.");
            return null;
        }

        // Parse JSON từ text trả về
        const parsedJson = JSON.parse(rawResponseText) as WritingToeicPart2ApiPromptData;

        // Kiểm tra sơ bộ cấu trúc JSON nhận được
        if (
            parsedJson && typeof parsedJson.senderName === 'string' &&
            typeof parsedJson.senderEmail === 'string' &&
            typeof parsedJson.recipientName === 'string' && parsedJson.recipientName.trim() !== '' &&
            typeof parsedJson.subject === 'string' &&
            typeof parsedJson.body === 'string' && parsedJson.body.trim() !== '' && // << KIỂM TRA body
            Array.isArray(parsedJson.tasks) && parsedJson.tasks.length >= 2 && parsedJson.tasks.every((t: any) => typeof t === 'string') &&
            typeof parsedJson.recipientPersonaDescription === 'string' && parsedJson.recipientPersonaDescription.trim() !== ''
        ) {
            return parsedJson as WritingToeicPart2ApiPromptData;
        }

    } catch (error) {
        if ((error as Error).name === 'AbortError') {
            console.log("generateEmailPromptForPart2: Gọi API bị hủy.");
        } else {
            console.error("Lỗi trong generateEmailPromptForPart2:", (error as Error).message, "\nRaw response (nếu có):", rawResponseText);
        }
        return null;

    }
    return null;
}


/**
 * @async
 * @function gradeEmailResponseForPart2
 * @description Gọi Gemini API để chấm điểm email trả lời của người dùng cho Part 2.
 * Yêu cầu Gemini trả về JSON với schema định sẵn, các giải thích lỗi bằng tiếng Việt.
 * @param {number} sheetId - ID của bài làm (dùng để tạo ID cho feedback).
 * @param {string} userAnswerEmail - Email trả lời của người dùng.
 * @param {WritingToeicPart2ApiReceivedEmail} originalReceivedEmail - Email gốc mà người dùng đã nhận (để cung cấp ngữ cảnh).
 * @returns {Promise<WritingToeicPart2GradedFeedback | null>} Dữ liệu phản hồi đã chấm điểm hoặc null nếu có lỗi.
 * @comment Bình luận bằng tiếng Việt: Hàm này gửi email của người dùng và email gốc đến Gemini để chấm điểm.
 * Nó sử dụng một rubric chi tiết và yêu cầu Gemini trả về kết quả dưới dạng JSON,
 * trong đó các phần giải thích cho người dùng phải bằng tiếng Việt.
 */
export async function gradeEmailResponseForPart2(
    signal: AbortSignal,
    sheetId: number,
    userAnswerEmail: string,
    originalPromptContext: WritingToeicPart2PromptContextForGrading,
): Promise<WritingToeicPart2GradedFeedback | null> {
    // Kiểm tra SDK
    if (!ai) {
        console.error("Lỗi api.ts: Gemini AI SDK (GoogleGenAI) chưa được khởi tạo.");
        return null;
    }

    // System instruction (tiếng Anh, nhưng yêu cầu output tiếng Việt cho user)
    const systemInstructionForGrader: Content = {
        parts: [{ text: "You are a fair, strict, and helpful expert TOEIC Writing Part 2 (Respond to an Email) grader. Your primary goal is to provide constructive feedback to ESL learners. IMPORTANT: All detailed explanations, overall feedback text, and any specific advice for the student MUST be written entirely in VIETNAMESE. Adhere strictly to the requested JSON output schema." }]
    };

    // Prompt chính cho việc chấm điểm (tiếng Anh)
    const gradingPromptText = `
    A student was given the following email to respond to:
    Sender: ${originalPromptContext.senderName} (${originalPromptContext.senderEmail})
    Subject: ${originalPromptContext.subject}
    Original Email Body:
    """
    ${originalPromptContext.body}
    """
    Key tasks the student needed to address from the original email:
    ${originalPromptContext.tasks.map(task => `- ${task}`).join('\n')}

    The student's reply email is:
    """
    ${userAnswerEmail}
    """

    Please evaluate the student's reply based on the following TOEIC Part 2 criteria (overall score from 0 to 4, where 4 is excellent):
    1.  Task Completion: Were all tasks/questions from the original email fully and accurately addressed?
    2.  Organization & Cohesion: Is the email well-structured (greeting, body paragraphs, closing)? Are ideas linked logically?
    3.  Vocabulary: Is word choice appropriate for a workplace email, precise, and varied?
    4.  Grammar & Mechanics: Are sentences grammatically correct? Correct use of tenses, S-V agreement, articles, prepositions, punctuation, spelling.
    5.  Tone & Email Conventions: Is the tone appropriate (e.g., polite, professional)? Are standard email greetings and closings used correctly?

    Provide your response strictly as a single JSON object adhering to the provided schema.
    All student-facing text in the JSON (feedbackText, explanations for corrections) MUST be in VIETNAMESE.
  `;

    // Định nghĩa JSON Schema cho output của Gemini (như đã thiết kế ở Bước 3.2)
    const gradingResponseSchema: Schema = {
        type: Type.OBJECT,
        properties: {
            score: { type: Type.INTEGER, description: "Tổng điểm từ 0 đến 4 (Thang điểm ví dụ cho Part 2). Final score." }, // Max score adjusted to 4 as typical for TOEIC Part 2 individual task
            feedbackText: { type: Type.STRING, description: "Nhận xét tổng quát chi tiết (3-5 câu) bằng TIẾNG VIỆT. Giải thích điểm số, nêu điểm mạnh và điểm cần cải thiện." },
            corrections: {
                type: Type.ARRAY,
                description: "Một danh sách các lỗi cụ thể và gợi ý sửa. Nếu không có lỗi, trả về mảng rỗng [].",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        original: { type: Type.STRING, description: "Phần câu gốc có lỗi (tiếng Anh)." },
                        suggestion: { type: Type.STRING, description: "Gợi ý sửa lỗi (tiếng Anh)." },
                        explanation: { type: Type.STRING, description: "Giải thích chi tiết về lỗi bằng TIẾNG VIỆT." },
                        errorType: { type: Type.STRING, description: "Loại lỗi (ví dụ: 'Grammar', 'Vocabulary', 'Task Fulfillment', 'Organization', 'Tone', 'Mechanics')", enum: ["Grammar", "Vocabulary", "Task Fulfillment", "Organization", "Tone", "Mechanics", "Other"] }
                    },
                    required: ["original", "suggestion", "explanation"] // errorType is optional in data, but good to ask for
                }
            }
        },
        required: ["score", "feedbackText", "corrections"]
    };

    // Cấu hình cho Gemini API call
    const contentConfigForGrading: GenerateContentConfig = {
        abortSignal: signal,
        safetySettings: defaultSafetySettingsList,
        temperature: 0.3, // Thấp hơn để việc chấm điểm nhất quán hơn
        topK: 30,
        topP: 0.90,
        maxOutputTokens: 6048, // Cho phép output JSON dài hơn với giải thích tiếng Việt
        systemInstruction: systemInstructionForGrader,
        responseSchema: gradingResponseSchema,
        responseMimeType: 'application/json', // Quan trọng khi sử dụng responseSchema
    };
    let rawResponseText: string | null = null;
    try {
        // Sử dụng model text phù hợp, có thể là gemini-pro hoặc model mới hơn bạn đang dùng
        const result = await ai.models.generateContent({

            model: GEMINI_MODEL_FOR_THINKING, // Hoặc model mạnh hơn nếu cần cho việc phân tích và JSON generation
            contents: [{ text: gradingPromptText }], // Chỉ gửi text prompt, vì Part 2 không có hình ảnh trực tiếp
            config: contentConfigForGrading // Sử dụng cấu trúc config như bạn đã yêu cầu
        });


        // Trích xuất text từ response (cần kiểm tra và điều chỉnh cho SDK của bạn)
        if (result && typeof (result as any).text === 'string') {
            rawResponseText = (result as any).text;
        } else if (result && typeof (result as any).response?.text === 'function') {
            rawResponseText = (result as any).response.text();
        } else if (result && (result as any).response?.candidates?.[0]?.content?.parts?.[0]?.text) {
            rawResponseText = (result as any).response.candidates[0].content.parts[0].text;
        }


        if (!rawResponseText) {
            console.warn("gradeEmailResponseForPart2: Gemini trả về phản hồi rỗng.");
            return null;
        }

        // Parse JSON response
        const parsedJson = JSON.parse(rawResponseText);

        // Validate sơ bộ và tạo đối tượng GradedFeedback
        // (Thêm kiểm tra chặt chẽ hơn nếu cần)
        if (typeof parsedJson.score === 'number' && typeof parsedJson.feedbackText === 'string' && Array.isArray(parsedJson.corrections)) {
            return {
                id: sheetId.toString(), // ID của feedback lấy từ sheetId
                answerId: sheetId.toString(), // ID của câu trả lời cũng là sheetId
                score: parsedJson.score,
                feedbackText: parsedJson.feedbackText, // Nên bằng tiếng Việt
                corrections: parsedJson.corrections.map((corr: WritingToeicPart2GrammarCorrection) => ({
                    original: corr.original || "",
                    suggestion: corr.suggestion || "",
                    explanation: corr.explanation || "", // Nên bằng tiếng Việt
                    errorType: corr.errorType || "Other",
                })),
                gradedAt: Date.now(), // Sử dụng timestamp dạng number
            } as WritingToeicPart2GradedFeedback;
        } else {
            console.warn("gradeEmailResponseForPart2: Cấu trúc JSON chấm điểm từ Gemini không đúng:", parsedJson);
            // Trả về một lỗi có cấu trúc nếu muốn
            return {
                id: sheetId.toString(), answerId: sheetId.toString(), score: 0,
                feedbackText: "Lỗi: Phản hồi từ AI chấm điểm có cấu trúc không hợp lệ. Vui lòng thử lại.",
                corrections: [], gradedAt: Date.now(),
            };
        }
    } catch (error) {
        if ((error as Error).name === 'AbortError') {
            console.log("gradeEmailResponseForPart2: Call was aborted.");
            return null;
        }
        console.error("Lỗi api.ts - gradeEmailResponseForPart2:", error, "\nRaw response was:", rawResponseText ?? "N/A");
        return {
            id: sheetId.toString(),
            answerId: sheetId.toString(),
            score: 0,
            feedbackText: `Lỗi khi chấm điểm: ${(error as Error).message}. Vui lòng thử lại.`,
            corrections: [],
            gradedAt: Date.now(),
        };
    }
}

/**
 * @async
 * @function generateEssayQuestionForPart3
 * @description Gọi Gemini API để tạo một câu hỏi luận (opinion question) cho TOEIC Writing Part 3.
 * Có khả năng nhận vào danh sách các chủ đề đã có để tránh trùng lặp.
 * @param {string[]} [historyTopics] - (Tùy chọn) Mảng các câu hỏi luận đã được sử dụng trước đó.
 * @param {AbortSignal} [signal] - (Tùy chọn) AbortSignal để hủy request.
 * @returns {Promise<EssayQuestionApiResponse | null>} Một object chứa câu hỏi luận hoặc null nếu có lỗi/bị hủy.
 * @comment Bình luận bằng tiếng Việt: Hàm này yêu cầu Gemini tạo một câu hỏi luận mới cho Part 3,
 * đồng thời cung cấp danh sách các câu hỏi cũ để Gemini tránh tạo lại.
 */
export async function generateEssayQuestionForPart3(
    historyTopics?: string[],
    signal?: AbortSignal
): Promise<EssayQuestionApiResponse | null> {
    // Kiểm tra SDK và AbortSignal
    if (!ai) {
        console.error("Lỗi api.ts: Gemini AI SDK (GoogleGenAI) chưa được khởi tạo.");
        return null;
    }
    if (signal?.aborted) {
        console.log("generateEssayQuestionForPart3: Operation aborted before starting.");
        return null;
    }

    // Xây dựng phần prompt để liệt kê các chủ đề cần tránh
    let exclusionInstructions = "";
    if (historyTopics && historyTopics.length > 0) {
        const topicsToExcludeString = historyTopics
            .map(topic => `- "${topic.replace(/"/g, '\\"')}"`) // Escape quotes in existing topics
            .join("\n");
        exclusionInstructions = `

CRITICAL: Ensure the new essay question you generate is unique and NOT a rephrasing or similar to any of the following previously used questions:
${topicsToExcludeString}`;
    }

    // Prompt tiếng Anh cho Gemini (dựa trên thiết kế đã có, thêm phần tránh trùng lặp)
    const englishPromptForGemini = `
[SYSTEM]
You are an AI assistant highly skilled in creating authentic and varied English language test prompts for the TOEIC® Speaking & Writing Tests. Your generated questions must be clear, unambiguous, and suitable for eliciting extended opinion-based responses.

[ROLE]
Act as an expert test content designer for TOEIC Writing Part 3 ("Write an Opinion Essay"). Your task is to generate a single, thought-provoking opinion question.

[CONTEXT]
The question you generate will be presented to a student preparing for the TOEIC Writing test. They will need to write an essay of at least 300 words in 30 minutes, stating, explaining, and supporting their opinion. Topics should be general and relatable, often concerning work, education, technology, lifestyle, or societal trends. Avoid overly niche, controversial, sensitive, or highly political topics.
${exclusionInstructions}
[TASK]
Generate ONE unique opinion question suitable for a TOEIC Writing Part 3 essay.
To ensure variety, please try to formulate your question based on one of the following common TOEIC essay question types. You can choose a type or synthesize elements:

1.  **Advantage / Disadvantage:** Asks the writer to discuss the pros or cons of a topic and clarify their stance.
    * Example inspiration: "Is working at a start-up company advantageous or disadvantageous? Give reasons and examples to prove the point."

2.  **Preference:** Presents choices and asks the writer to select and justify their preference.
    * Example inspiration: "Some people like to live in apartments and some like to live in townhouses. What type of house do you prefer? Give examples to prove your point."

3.  **General Opinion:** Asks for the writer's viewpoint on a general topic or issue.
    * Example inspiration: "What do you think about the issue of employees not being allowed to listen to music while working? Give reasons and examples to back up your point."

4.  **Agree / Disagree:** Presents a statement or opinion and asks the writer whether they agree or disagree, and why.
    * Example inspiration: "Statement: 'Continuous learning is the most important factor for career success in the modern world.' To what extent do you agree or disagree with this statement? Provide specific reasons and examples."

5.  **Importance:** Asks the writer to explain why something is important to a particular group or in a specific context.
    * Example inspiration: "Why do you think effective communication skills are important in the workplace? Provide specific reasons and examples."

The generated question should clearly prompt for an opinion and imply the need for supporting reasons and examples.

Your output MUST be a single, valid JSON object with one key, "essayQuestion", containing the generated question as a string. Ensure the JSON is valid. No other text should be included in your response.

Example Output Format:
{
  "essayQuestion": "Some people prefer to work for a large corporation, while others prefer a small company. Which work environment do you believe offers more benefits to employees? Support your opinion with specific reasons and examples."
}

Now, generate a new, unique opinion question.
`; // Kết thúc prompt tiếng Anh

    // Schema đơn giản cho output JSON
    const essayQuestionResponseSchema: Schema = {
        type: Type.OBJECT,
        properties: {
            essayQuestion: {
                type: Type.STRING,
                description: "The generated TOEIC Writing Part 3 essay question."
            }
        },
        required: ["essayQuestion"]
    };

    // Cấu hình cho Gemini API call
    const contentConfig: GenerateContentConfig = {
        abortSignal: signal, // << SỬ DỤNG ABORTSIGNAL ĐÚNG CÁCH
        safetySettings: defaultSafetySettingsList,
        temperature: 0.8, // Tăng một chút để có sự đa dạng trong câu hỏi
        maxOutputTokens: 1024, // Câu hỏi luận thường không quá dài
        responseMimeType: 'application/json',
        responseSchema: essayQuestionResponseSchema,
    };

    let rawResponseText: string | undefined;
    try {
        if (signal?.aborted) throw new DOMException('Aborted before API call', 'AbortError');

        const result = await ai.models.generateContent({
            model: GEMINI_MODEL_FOR_TEXT, // Model phù hợp cho việc tạo text
            contents: [{ text: englishPromptForGemini }],
            config: contentConfig
        });

        if (signal?.aborted) throw new DOMException('Aborted during/after API call', 'AbortError');

        // --- Trích xuất text nhất quán ---
        if (result && typeof (result as any).text === 'string') { rawResponseText = (result as any).text; }
        else if (result && typeof (result as any).response?.text === 'function') { rawResponseText = (result as any).response.text(); }
        else if (result && (result as any).response?.candidates?.[0]?.content?.parts?.[0]?.text) { rawResponseText = (result as any).response.candidates[0].content.parts[0].text; }
        // --- Kết thúc trích xuất text ---

        if (!rawResponseText) {
            console.warn("generateEssayQuestionForPart3: Gemini trả về phản hồi rỗng.");
            throw new Error("Phản hồi rỗng từ AI tạo câu hỏi luận Part 3.");
        }

        const parsedJson = JSON.parse(rawResponseText);

        if (parsedJson && typeof parsedJson.essayQuestion === 'string' && parsedJson.essayQuestion.trim() !== '') {
            return parsedJson as EssayQuestionApiResponse;
        } else {
            console.warn("generateEssayQuestionForPart3: JSON parse được nhưng thiếu trường 'essayQuestion' hoặc trường rỗng. Parsed:", parsedJson, "Raw:", rawResponseText);
            throw new Error("Cấu trúc JSON cho câu hỏi luận không hợp lệ hoặc rỗng.");
        }

    } catch (error) {
        if ((error as Error).name === 'AbortError') {
            console.log("generateEssayQuestionForPart3: Gọi API bị hủy bởi AbortSignal.");
        } else {
            console.error("Lỗi trong generateEssayQuestionForPart3:", (error as Error).message, "\nRaw response (nếu có):", rawResponseText);
        }
        return null; // Trả về null nếu có lỗi hoặc bị hủy
    }
}

/**
 * @async
 * @function gradeEssayForPart3
 * @description Gọi Gemini API để chấm điểm bài luận Part 3 của người dùng.
 * Yêu cầu Gemini trả về JSON với schema định sẵn, các giải thích lỗi bằng tiếng Việt.
 * @param {number} sheetId - ID của bài làm (dùng để tạo ID cho feedback).
 * @param {string} studentEssayText - Nội dung bài luận của người dùng.
 * @param {string} originalEssayQuestion - Câu hỏi luận gốc đã được giao.
 * @param {AbortSignal} [signal] - (Tùy chọn) AbortSignal để hủy request.
 * @returns {Promise<WritingToeicPart3GradedFeedback | null>} Dữ liệu phản hồi đã chấm điểm hoặc null nếu có lỗi.
 * @comment Bình luận bằng tiếng Việt: Hàm này gửi câu hỏi, bài luận của người dùng đến Gemini để chấm điểm.
 * Rubric và yêu cầu output JSON (với các phần tiếng Việt) được định nghĩa trong prompt.
 */
export async function gradeEssayForPart3(
    sheetId: number,
    studentEssayText: string,
    originalEssayQuestion: string,
    signal?: AbortSignal
): Promise<WritingToeicPart3GradedFeedback | null> {
    // Kiểm tra SDK và AbortSignal
    if (!ai) {
        console.error("Lỗi api.ts: Gemini AI SDK (GoogleGenAI) chưa được khởi tạo.");
        return null;
    }
    if (signal?.aborted) {
        console.log("gradeEssayForPart3: Operation aborted before starting.");
        return null;
    }

    // System instruction (tiếng Anh, nhưng yêu cầu output tiếng Việt cho user)
    const systemInstructionForGrader: Content = { // Đảm bảo type Content được import đúng
        parts: [{ text: "You are an AI assistant acting as an expert, meticulous, and constructive grader for the TOEIC® Writing Test, specifically Part 3 'Write an Opinion Essay.' Your primary language for analysis and internal reasoning is English, but all feedback directed to the student MUST be in VIETNAMESE. Adhere strictly to the requested JSON output schema." }]
    };

    // Prompt chính cho việc chấm điểm (tiếng Anh)
    const gradingPromptText = `
[SYSTEM]
You are an AI assistant acting as an expert, meticulous, and constructive grader for the TOEIC® Writing Test, specifically Part 3 "Write an Opinion Essay." Your primary language for analysis and internal reasoning is English, but all feedback directed to the student MUST be in VIETNAMESE. You must strictly adhere to the JSON output format requested.

[ROLE]
Evaluate the student's essay provided below, which was written in response to the given TOEIC Part 3 question. Assess it based on established TOEIC scoring criteria. Your goal is to provide a fair score (0-5 points) and actionable, detailed feedback in VIETNAMESE to help the student improve their essay writing skills.

[CONTEXT]
The student was given the following essay question:
"${originalEssayQuestion.replace(/"/g, '\\"')}"

The student wrote the following essay (minimum 300 words expected):
"""
${studentEssayText.replace(/"/g, '\\"')}
"""

The essay will be scored on a scale of 0-5. Please evaluate the essay based on the following criteria:
1.  **Opinion Support & Development:** How effectively is the opinion stated, developed, and supported with relevant, specific reasons, details, and examples? Is the argument logical and convincing?
2.  **Organization & Structure:** How clear is the essay's structure (introduction with a clear thesis, well-developed body paragraphs with distinct main ideas, and a concluding paragraph)? Is there logical progression and flow between ideas, sentences, and paragraphs (coherence and cohesion, use of transition words)?
3.  **Grammar:** What is the accuracy and appropriate use of grammatical structures? Consider sentence formation, verb tenses, subject-verb agreement, articles, prepositions, word order, etc.
4.  **Vocabulary:** What is the range, precision, and appropriateness of the vocabulary used for an opinion essay? Is there an attempt to use varied and sophisticated language where appropriate? Are there significant lexical errors?

[TASK]
Provide your evaluation ONLY as a single, valid JSON object. Do not include any text outside of this JSON object.
All textual feedback intended for the student within the JSON fields (specifically 'overallFeedback', all properties within 'detailedFeedback', and all items in 'keyImprovementAreas') MUST be written entirely in VIETNAMESE.

The JSON output must conform to the following schema:
{
  "type": "OBJECT",
  "properties": {
    "score": {
      "type": "INTEGER",
      "description": "Overall score from 0 to 5 for the essay."
    },
    "overallFeedback": {
      "type": "STRING",
      "description": "Detailed overall feedback (approximately 4-6 sentences) in VIETNAMESE. This should explain the score, highlight key strengths, and identify major weaknesses across the scoring criteria. Offer general advice for improvement."
    },
    "detailedFeedback": {
      "type": "OBJECT",
      "description": "Detailed feedback per category, in VIETNAMESE.",
      "properties": {
        "opinionSupportFeedback": {
          "type": "STRING",
          "description": "Specific comments on how the student stated, developed, and supported their opinion, including the relevance and sufficiency of reasons and examples (in VIETNAMESE)."
        },
        "organizationFeedback": {
          "type": "STRING",
          "description": "Specific comments on the essay's structure, paragraphing, topic sentences, coherence, and use of transitions (in VIETNAMESE)."
        },
        "grammarVocabularyFeedback": {
          "type": "STRING",
          "description": "Specific comments on grammar accuracy and vocabulary choice. Highlight any recurring errors or particularly good/poor usage. Suggest areas for language improvement (in VIETNAMESE)."
        }
      },
      "required": ["opinionSupportFeedback", "organizationFeedback", "grammarVocabularyFeedback"]
    },
    "keyImprovementAreas": {
      "type": "ARRAY",
      "description": "A list of 2-3 main bullet points summarizing the most critical areas the student should focus on for improvement, in VIETNAMESE.",
      "items": {
        "type": "STRING",
        "description": "A specific area for improvement (in VIETNAMESE)."
      }
    }
  },
  "required": ["score", "overallFeedback", "detailedFeedback", "keyImprovementAreas"]
}

Now, evaluate the student's essay based on the provided question and essay text, and generate your response strictly in the JSON format described above. Remember, all student-facing narrative feedback must be in VIETNAMESE.
`

    const essayGradingResponseSchema: Schema = {
        type: Type.OBJECT,
        properties: {
            score: { type: Type.INTEGER, description: "Điểm tổng từ 0 đến 5 cho bài luận." },
            overallFeedback: { type: Type.STRING, description: "Nhận xét tổng quát chi tiết (khoảng 4-6 câu) bằng TIẾNG VIỆT..." },
            detailedFeedback: {
                type: Type.OBJECT, description: "Nhận xét chi tiết theo từng tiêu chí, bằng TIẾNG VIỆT.",
                properties: {
                    opinionSupportFeedback: { type: Type.STRING, description: "Nhận xét về cách phát triển và bảo vệ quan điểm... (bằng TIẾNG VIỆT)." },
                    organizationFeedback: { type: Type.STRING, description: "Nhận xét về cấu trúc bài luận... (bằng TIẾNG VIỆT)." },
                    grammarVocabularyFeedback: { type: Type.STRING, description: "Nhận xét về việc sử dụng ngữ pháp và từ vựng... (bằng TIẾNG VIỆT)." }
                },
                required: ["opinionSupportFeedback", "organizationFeedback", "grammarVocabularyFeedback"]
            },
            keyImprovementAreas: {
                type: Type.ARRAY, description: "Danh sách 2-3 điểm chính cần cải thiện nhất... (bằng TIẾNG VIỆT).",
                items: { type: Type.STRING, description: "Một lĩnh vực cụ thể cần cải thiện." }
            }
        },
        required: ["score", "overallFeedback", "detailedFeedback", "keyImprovementAreas"]
    };

    // Cấu hình cho Gemini API call
    const contentConfigForGrading: GenerateContentConfig = {
        abortSignal: signal, // Thêm AbortSignal
        safetySettings: defaultSafetySettingsList, // Đã định nghĩa ở đâu đó
        temperature: 0.35, // Nhiệt độ thấp hơn để chấm điểm nhất quán hơn
        maxOutputTokens: 6048, // Cho phép output JSON dài hơn với giải thích tiếng Việt
        systemInstruction: systemInstructionForGrader,
        responseSchema: essayGradingResponseSchema, // Schema đã định nghĩa
        responseMimeType: 'application/json', // Quan trọng khi sử dụng responseSchema
    };

    let rawResponseText: string | undefined;
    try {
        if (signal?.aborted) throw new DOMException('Aborted before API call', 'AbortError');

        const result = await ai.models.generateContent({
            model: GEMINI_MODEL_FOR_THINKING, // Hoặc model mạnh hơn nếu cần cho việc phân tích và JSON generation
            contents: [{ text: gradingPromptText.replace("{{essayQuestion}}", originalEssayQuestion.replace(/"/g, '\\"')).replace("{{studentEssayText}}", studentEssayText.replace(/"/g, '\\"')) }],
            config: contentConfigForGrading
        });

        if (signal?.aborted) throw new DOMException('Aborted during/after API call', 'AbortError');

        // --- Trích xuất text nhất quán ---
        if (result && typeof (result as any).text === 'string') { rawResponseText = (result as any).text; }
        else if (result && typeof (result as any).response?.text === 'function') { rawResponseText = (result as any).response.text(); }
        else if (result && (result as any).response?.candidates?.[0]?.content?.parts?.[0]?.text) { rawResponseText = (result as any).response.candidates[0].content.parts[0].text; }
        // --- Kết thúc trích xuất text ---

        if (!rawResponseText) {
            console.warn("gradeEssayForPart3: Gemini trả về phản hồi rỗng.");
            throw new Error("Phản hồi rỗng từ AI chấm điểm bài luận.");
        }

        const parsedJson = JSON.parse(rawResponseText);

        // Validate sơ bộ và tạo đối tượng GradedFeedback
        if (
            parsedJson &&
            typeof parsedJson.score === 'number' &&
            typeof parsedJson.overallFeedback === 'string' &&
            parsedJson.detailedFeedback &&
            typeof parsedJson.detailedFeedback.opinionSupportFeedback === 'string' &&
            typeof parsedJson.detailedFeedback.organizationFeedback === 'string' &&
            typeof parsedJson.detailedFeedback.grammarVocabularyFeedback === 'string' &&
            Array.isArray(parsedJson.keyImprovementAreas)
        ) {
            return {
                id: sheetId.toString(), // ID của feedback lấy từ sheetId
                answerId: sheetId.toString(), // ID của câu trả lời cũng là sheetId
                score: parsedJson.score,
                overallFeedback: parsedJson.overallFeedback, // Nên bằng tiếng Việt
                detailedFeedback: { // Đảm bảo các trường này cũng bằng tiếng Việt
                    opinionSupportFeedback: parsedJson.detailedFeedback.opinionSupportFeedback,
                    organizationFeedback: parsedJson.detailedFeedback.organizationFeedback,
                    grammarVocabularyFeedback: parsedJson.detailedFeedback.grammarVocabularyFeedback,
                },
                keyImprovementAreas: parsedJson.keyImprovementAreas.map((area: any) => String(area)), // Nên bằng tiếng Việt
                gradedAt: Date.now(), // Sử dụng timestamp dạng number
            };
        } else {
            console.warn("gradeEssayForPart3: Cấu trúc JSON chấm điểm từ Gemini không đúng:", parsedJson, "Raw response:", rawResponseText);
            throw new Error("Cấu trúc JSON chấm điểm không hợp lệ từ AI.");
        }
    } catch (error) {
        if ((error as Error).name === 'AbortError') {
            console.log("gradeEssayForPart3: Gọi API bị hủy bởi AbortSignal.");
            return null; // Hoặc rethrow tùy theo cách hook xử lý
        }
        console.error("Lỗi trong gradeEssayForPart3:", (error as Error).message, "\nRaw response (nếu có):", rawResponseText);
        // Trả về một đối tượng feedback lỗi có cấu trúc để UI hiển thị
        return {
            id: sheetId.toString(),
            answerId: sheetId.toString(),
            score: 0,
            overallFeedback: `Lỗi khi chấm điểm bài luận: ${(error as Error).message}. Vui lòng thử lại.`,
            detailedFeedback: {
                opinionSupportFeedback: "Không có dữ liệu.",
                organizationFeedback: "Không có dữ liệu.",
                grammarVocabularyFeedback: "Không có dữ liệu."
            },
            keyImprovementAreas: ["Không thể xử lý yêu cầu chấm điểm."],
            gradedAt: Date.now(),
        };
    }
}

//------------------------------------------------------
// API Functions
// Các hàm tương tác với "nguồn dữ liệu" (hiện tại là file JSON)
//------------------------------------------------------

/**
 * @description Tải danh sách các câu hỏi/nhiệm vụ từ nguồn dữ liệu.
 * Trong tương lai, đây có thể là một cuộc gọi API thực sự đến backend.
 * Hiện tại, nó đọc từ file prompts.json đã import và thực hiện kiểm tra cơ bản.
 * @returns Promise chứa mảng các ToeicSpeakingPromptTask, hoặc null nếu có lỗi.
 */
export const fetchToeicSpeakingPrompts = async (): Promise<ToeicSpeakingPromptTask[] | null> => {
    // Mô phỏng một cuộc gọi API bất đồng bộ
    await new Promise(resolve => setTimeout(resolve, 100)); // Độ trễ nhỏ để mô phỏng

    // Không dùng try-catch ở đây theo yêu cầu (vì hook sẽ không dùng try-catch)
    // Thay vào đó, kiểm tra dữ liệu và trả về null nếu không hợp lệ.
    // Logic try-catch thực sự cho network/parsing sẽ ở đây nếu đây là fetch() thật.
    if (
        promptsData &&
        typeof promptsData === 'object' &&
        'tasks' in promptsData &&
        Array.isArray((promptsData as any).tasks)
    ) {
        // Giả sử cấu trúc cơ bản là đúng, kiểu dữ liệu của từng task sẽ được reducer xử lý/kiểm tra thêm nếu cần.
        return (promptsData as { tasks: ToeicSpeakingPromptTask[] }).tasks;
    } else {
        console.error(
            '[ToeicSpeakingApi] Cấu trúc dữ liệu prompts.json không hợp lệ hoặc không tìm thấy "tasks".'
        );
        return null; // Trả về null nếu dữ liệu không đúng cấu trúc mong đợi
    }
};

/**
 * @async
 * @function userFetchImageFromPexels (Renamed to avoid conflict if you had it elsewhere)
 * @description Tìm và lấy một hình ảnh ngẫu nhiên từ Pexels dựa trên từ khóa.
 * @param {string} keyword - Từ khóa để tìm kiếm hình ảnh.
 * @returns {Promise<PexelsPhoto | null>} Một đối tượng ảnh Pexels hoặc null nếu không tìm thấy.
 */
async function userFetchImageFromPexels(keyword: string, fetchDataFn: <T>(url: string, options?: RequestInit) => Promise<T>): Promise<PexelsPhoto | null> {
    if (!PEXELS_API_KEY || PEXELS_API_KEY === 'YOUR_PEXELS_API_KEY_FALLBACK') {
        console.error("Thiếu PEXELS_API_KEY hoặc đang dùng fallback. Vui lòng kiểm tra file .env của bạn.");
        // To align with the wrapper's expectation of handling throws, we throw here.
        // The wrapper will catch this and return null for the URL.
        throw new Error("Chưa cấu hình Pexels API key đúng cách.");
    }
    const url = `${PEXELS_BASE_URL}/search?query=${encodeURIComponent(keyword)}&per_page=10&page=1&orientation=landscape`;
    const options: RequestInit = {
        headers: {
            Authorization: PEXELS_API_KEY,
        },
    };

    // try-catch is in your original function, which is good.
    // The outer wrapper will also have a try-catch.
    // try { // Your original function already has a try-catch that re-throws.
    const data = await fetchDataFn<PexelsSearchResponse>(url, options);
    if (data.photos && data.photos.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.photos.length);
        return data.photos[randomIndex];
    }
    return null; // Không tìm thấy ảnh nào
    // } catch (error) { // Your function re-throws, so this catch is as per your snippet.
    //     console.error(`Lỗi khi lấy ảnh từ Pexels với từ khóa "${keyword}" (trong userFetchImageFromPexels):`, error);
    //     throw error;
    // }
}
export const fetchPexelsImage = async (query: string): Promise<string | null> => {
    // Define a dummy fetchData for the sake of this example if it's not globally available
    // In your actual project, ensure `WorkspaceData` is correctly defined and imported
    // into the scope where `userFetchImageFromPexels` can use it.
    const DUMMY_FETCH_DATA_FN_FOR_USER_FUNCTION = async <T>(url: string, options?: RequestInit): Promise<T> => {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`[DUMMY_FETCH_DATA_FN] HTTP error! status: ${response.status}`, errorBody);
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
        }
        return response.json();
    };


    try {
        // Call your function, passing the dummy fetchData or your actual one
        const photoObject = await userFetchImageFromPexels(query, DUMMY_FETCH_DATA_FN_FOR_USER_FUNCTION);

        if (photoObject && photoObject.src) {
            // Prefer 'medium', then 'large', then 'original' as fallback
            return photoObject.src.medium || photoObject.src.large || photoObject.src.original;
        } else {
            // userFetchImageFromPexels returned null (no photo found)
            console.warn(`[ToeicSpeakingApi] No photo object returned from userFetchImageFromPexels for query: "${query}"`);
            return null;
        }
    } catch (error) {
        // This catch block handles errors thrown by userFetchImageFromPexels
        // (e.g., API key issue, network errors from fetchData if it throws)
        console.error(`[ToeicSpeakingApi] Error utilizing userFetchImageFromPexels for query "${query}":`, error);
        return null; // Adhere to "return null on error"
    }
};