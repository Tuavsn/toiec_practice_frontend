import { ApiResponse, CategoryLabel, CategoryRow, ExerciseType, LectureCard, LectureID, QuestionRow, ResultID, TableData, TestCard, TestID, TestPaper ,PracticePaper, TestRecord, TestResultSummary, Topic, UpdateQuestionForm } from "../utils/types/type";
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