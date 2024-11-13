import { ApiResponse, CategoryLabel, CategoryRow, QuestionRow, ResultID, TableData, TestCard, TestID, TestPaper, TestRecord, TestResultSummary, Topic, UpdateQuestionForm } from "../utils/types/type";
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
    const response = await axios.get<ApiResponse<TableData<Model>>>(`${import.meta.env.VITE_API_URL}/${urlApi}?current=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
}

export const callGetTestPaper = async (testId: string, parts: string): Promise<ApiResponse<TestPaper>> => {
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

export const callGetExercisePaper = async (parts: string): Promise<ApiResponse<TestPaper>> => {
    alert("viết api cho callGetExercisePaper")
    const postfix = `practice?parts=${parts}`;
    const response = await axios.get<ApiResponse<TestPaper>>(`${import.meta.env.VITE_API_URL}/tests/671a25094dbe5f4c165c31dc/${postfix}`,);
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
    const response = await axios.get<ApiResponse<TestResultSummary>>(`${import.meta.env.VITE_API_URL}/result/${id}`);
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