import { ApiResponse, CategoryLabel, CategoryRow, ExerciseType, LectureCard, LectureID, PracticePaper, QuestionRow, ResultID, TableData, Test, TestCard, TestID, TestPaper, TestRecord, TestResultSummary, TestRow, Topic, TopicID, UpdateQuestionForm } from "../utils/types/type";
import axios from "./axios-customize";
const host = "https://toeic-practice-hze3cbbff4ctd8ce.southeastasia-01.azurewebsites.net";

export const loginUrl = `${host}/oauth2/authorize/google`;



export const callCreateCateogry = async (format: string, year: number) => {

    const response = await axios.post<ApiResponse<CategoryRow>>(
        `${import.meta.env.VITE_API_URL}/categories`,
        { format, year }
    );
    return response.data;

}


export const callGetCategory = () => {
    return axios.get<ApiResponse<CategoryRow[]>>(`${import.meta.env.VITE_API_URL}/categories`);
}

export const callGetRows = async <Model>(urlApi: string, pageNumber: number = 1, pageSize: number = 5): Promise<ApiResponse<TableData<Model>>> => {
    let url = `${import.meta.env.VITE_API_URL}/${urlApi}?current=${pageNumber}&pageSize=${pageSize}`;
    if (urlApi === "testusers") {
        if (pageNumber === 1)
            url = "https://dummyjson.com/c/ff5b-4415-4a6b-af8d";
        else {
            url = "https://dummyjson.com/c/ea74-036e-4fcb-872e";
        }
        const responseFetch = await fetch(url);
        const responseObject: ApiResponse<TableData<Model>> = await responseFetch.json();
        return responseObject;
    }
    const response = await axios.get<ApiResponse<TableData<Model>>>(url);
    return response.data;
}

export const callGetTestPaper = async (testId: TestID, parts: string): Promise<ApiResponse<TestPaper>> => {
    const postfix = parts === '0' ? 'full-test' : `practice?parts=${parts}`;
    const response = await axios.get<ApiResponse<TestPaper>>(`${import.meta.env.VITE_API_URL}/tests/${testId}/${postfix}`);
    return response.data;
}
export const callPostTest = async (testRow: TestRow): Promise<string> => {
    try {
        await axios.post<ApiResponse<Test>>(`${import.meta.env.VITE_API_URL}/tests`, {
            name: testRow.name,
            categoryId: testRow.idCategory,
            totalUserAttempt: testRow.totalUserAttempt,
            totalQuestion: testRow.totalQuestion,
            totalScore: testRow.totalScore,
            limitTime: testRow.limitTime,
        });
        return "";
    } catch (error) {
        return (error as Error).message
    }
}
export const callPostTestRecord = async (testRecord: TestRecord): Promise<ApiResponse<{ resultId: ResultID }>> => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/tests/submit`, testRecord)
    return response.data;
}

export const callGetUserDetailResultList = async (pageNumber: number = 0, pageSize: number = 5): Promise<ApiResponse<TableData<TestResultSummary>>> => {

    const response = await axios.get<ApiResponse<TableData<TestResultSummary>>>(`${import.meta.env.VITE_API_URL}/result?current=${pageNumber + 1}&pageSize=${pageSize}&type=FULL_TEST`);

    return response.data;
}

export const callGetExercisePaper = async (exerciseType: ExerciseType): Promise<ApiResponse<TableData<QuestionRow>>> => {

    const response = await axios.get<ApiResponse<TableData<QuestionRow>>>(`${import.meta.env.VITE_API_URL}/questions?${exerciseType}&pageSize=200`,);
    return response.data;
}

export const callGetQuestionRows = async (testId: TestID, currentPageIndex: number, pageSize: number = 5): Promise<ApiResponse<TableData<QuestionRow>>> => {
    const response = await axios.get<ApiResponse<TableData<QuestionRow>>>(`${import.meta.env.VITE_API_URL}/tests/${testId}/questions?current=${currentPageIndex + 1}&pageSize=${pageSize}`)
    return response.data;
}

export const callPutQuestionUpdate = async (formData: UpdateQuestionForm) => {
    const response = await axios.post<ApiResponse<TableData<QuestionRow>>>(`${import.meta.env.VITE_API_URL}/questions`, formData);
    return response;
}

export const callGetTopics = async (): Promise<ApiResponse<Topic[]>> => {
    const response = await axios.get<ApiResponse<Topic[]>>(`${import.meta.env.VITE_API_URL}/topics`)
    return response.data;
}

export const callGetResult = async (id: ResultID): Promise<ApiResponse<TestResultSummary>> => {
    const response = await axios.get<ApiResponse<TestResultSummary>>(`${import.meta.env.VITE_API_URL}/results/${id}`);
    return response.data;
}

export const callGetCategoryLabel = async (): Promise<ApiResponse<CategoryLabel[]>> => {
    const response = await axios.get<ApiResponse<CategoryLabel[]>>(`${import.meta.env.VITE_API_URL}/categories/none-page`);
    return response.data;
}

export const callGetTestCard = async (format: string, year: number, pageIndex: number): Promise<ApiResponse<TableData<TestCard>>> => {
    const response = await axios.get<ApiResponse<TableData<TestCard>>>(`${import.meta.env.VITE_API_URL}/categories/tests?format=${format}&year=${year}&current=${pageIndex + 1}&pageSize=4`);
    return response.data;
}
export const callGetLectureCards = async (pageIndex: number): Promise<ApiResponse<TableData<LectureCard>>> => {
    const urls = ["https://dummyjson.com/c/c7f2-48ee-4d53-9e8e", "https://dummyjson.com/c/c1de-8a5a-43d6-993c", "https://dummyjson.com/c/6b97-4215-4c8b-9f10"]
    const response = await fetch(urls[pageIndex]);
    const data: ApiResponse<TableData<LectureCard>> = await response.json();
    return data;
}

export const callGetPracticePaper = async (lectureId: LectureID): Promise<ApiResponse<PracticePaper>> => {
    const response = await fetch(`https://dummyjson.com/c/e6c2-181c-4ceb-86b1?lecture=${lectureId}`);
    const apiResponse: ApiResponse<PracticePaper> = await response.json();
    return apiResponse
}

export const callPostDoctrine = async (lectureId: LectureID, htmlContent: string): Promise<string> => {
    try {
        await axios.post<ApiResponse<any>>(`${import.meta.env.VITE_API_URL}/lecture/doctrine`, {
            lectureId,
            htmlContent,
        })
        return "";
    } catch (e: unknown) {
        return "Lỗi";
    }
}

export const callPutLectureDetailUpdate = async (lectureID: LectureID, title: string, topicIds: TopicID[]): Promise<boolean> => {
    try {
        await axios.put<ApiResponse<any>>(`${import.meta.env.VITE_API_URL}/lectures`, {
            lectureID,
            title,
            topicIds
        })
        return true
    } catch (error: unknown) {
        return false
    }
}

export const callPostLectureDetail = async (title: string, topicIds: TopicID[]): Promise<boolean> => {
    try {
        await axios.post<ApiResponse<any>>(`${import.meta.env.VITE_API_URL}/lectures`, {
            title,
            topicIds
        })
        return true
    } catch (error: unknown) {
        return false
    }
}


export const callGetLectureDoctrine = async (lectureID: LectureID): Promise<string> => {
    try {
        const responseCall = await fetch(`https://raw.githubusercontent.com/Tuavsn/toiec_practice_frontend/refs/heads/fix-route-bug/test.json?lecture=${lectureID}`)
        const response = await responseCall.json();
        console.log(response);

        // const response = await axios.get<ApiResponse<string>>(`${import.meta.env.VITE_API_URL}/lecture/doctrine/${lectureID}`);
        return response.data;
    } catch (error) {
        return (error as Error).message;
    }
}

export const callGetAssignmentRows = async (lectureID: LectureID, currentPageIndex: number, pageSize: number = 5): Promise<ApiResponse<TableData<QuestionRow>>> => {
    lectureID = "671a25094dbe5f4c165c31dc";
    const response = await axios.get<ApiResponse<TableData<QuestionRow>>>(`${import.meta.env.VITE_API_URL}/tests/${lectureID}/questions?current=${currentPageIndex + 1}&pageSize=${pageSize}`)
    return response.data;
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

