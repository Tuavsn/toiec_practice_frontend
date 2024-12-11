import { emptyOverallStat } from "../utils/types/emptyValue";
import { ApiResponse, CategoryID, CategoryLabel, CategoryRow, ExerciseType, Lecture, LectureID, LectureRow, Permission, PermissionID, PracticePaper, ProfileHookState, QuestionID, QuestionRow, Resource, ResourceIndex, ResultID, Role, TableData, Test, TestCard, TestDetailPageData, TestID, TestPaper, TestRecord, TestResultSummary, TestReviewAnswerSheet, TestRow, Topic, TopicID, UpdateQuestionForm, UserComment, UserRow } from "../utils/types/type";
import axios from "./axios-customize";
const host = "https://toeic-practice-hze3cbbff4ctd8ce.southeastasia-01.azurewebsites.net";

export const loginUrl = `${host}/oauth2/authorize/google`;



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

export const callGetCategoryLabel = async (): Promise<ApiResponse<CategoryLabel[]>> => {
    const response = await axios.get<ApiResponse<CategoryLabel[]>>(`${import.meta.env.VITE_API_URL}/categories/none-page`);
    return response.data;
}

export const callGetTestCard = async (format: string, year: number, pageIndex: number): Promise<ApiResponse<TableData<TestCard>>> => {
    const response = await axios.get<ApiResponse<TableData<TestCard>>>(`${import.meta.env.VITE_API_URL}/categories/tests?format=${format}&year=${year}&current=${pageIndex + 1}&pageSize=8`);
    return response.data;
}

export const callGetPracticePaper = async (lectureId: LectureID): Promise<ApiResponse<PracticePaper>> => {

    const response = await fetch(`https://raw.githubusercontent.com/Tuavsn/toiec_practice_frontend/refs/heads/role-update/src/api/${lectureId}.json`);
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
export const callGetLectureCard = async (pageNumber: number): Promise<TableData<LectureRow> | Error> => {
    try {
        const response = await axios.get<ApiResponse<TableData<LectureRow>>>(`${import.meta.env.VITE_API_URL}/lectures?info=true&current=${pageNumber + 1}&pageSize=5&active=true`);
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
export const callGetRole = async (): Promise<TableData<Role> | null> => {
    try {
        const response = await axios.get<ApiResponse<TableData<Role>>>(`${import.meta.env.VITE_API_URL}/roles`);
        return response.data.data;

    } catch (error) {
        return null;
    }
}

export const callGetPermission = async (currentPageIndex: number, pageSize: number = 5): Promise<TableData<Permission> | null> => {
    try {
        const response = await axios.get<ApiResponse<TableData<Permission>>>(`${import.meta.env.VITE_API_URL}/permissions?current=${currentPageIndex + 1}&pageSize=${pageSize}`);
        return response.data.data;

    } catch (error) {
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
        await axios.post(`${import.meta.env.VITE_API_URL}/roles/${role.id}`, {
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
        await axios.post(`${import.meta.env.VITE_API_URL}/roles/${permission.id}`, {
            ...permission
        });
        return true;
    } catch (error) {
        return false;
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

export const callGetTopicRow = async (currentPageIndex: number, pageSize: number = 5): Promise<TableData<Topic> | null> => {
    try {
        const response = await axios.get<ApiResponse<TableData<Topic>>>(`${import.meta.env.VITE_API_URL}/topics/pagination?current=${currentPageIndex + 1}&pageSize=${pageSize}`);
        return response.data.data;
    } catch (e) {
        return null;
    }
}
export const callGetComments = async (currentPageIndex: number, pageSize: number = 5): Promise<TableData<UserComment> | null> => {
    try {
        const response = await axios.get<ApiResponse<TableData<UserComment>>>(``);
        return response.data.data;
    } catch (e) {
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
export const callPostDeleteTestRow = async (test: TestRow): Promise<boolean> => {
    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/tests/${test.id}`, {
            active: false
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
        });
        return true
    } catch (error) {
        return false
    }
}
export const callPostUpdateTest = async (testRow: TestRow): Promise<boolean> => {
    try {
        await axios.post<ApiResponse<Test>>(`${import.meta.env.VITE_API_URL}/tests/${testRow.id}`, {
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
        const response = await axios.get<ApiResponse<ProfileHookState>>(`${import.meta.env.VITE_API_URL}/auth/account`);
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
        await axios.put<any>(`${import.meta.env.VITE_API_URL}/auth/account/target`, { target: targetScore });
        console.log("ok");

    } catch (error) {
        console.error(error);
    }
}