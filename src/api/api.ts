import { ApiResponse, CategoryRow, QuestionRow, ResponseUserResultList, ResultID, TableData, TestID, TestPaper, TestRecord, TestResultSummary, Topic, UpdateQuestionForm } from "../utils/types/type";
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

export const callGetRows = async <Model>(urlApi: string, _pageNumber: number = 1, _pageSize: number = 10): Promise<ApiResponse<TableData<Model>>> => {
    const response = await axios.get<ApiResponse<TableData<Model>>>(`${import.meta.env.VITE_API_URL}/${urlApi}?current=${_pageNumber}&pageSize=${_pageSize}`);
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

export const callGetUserDetailResultList = async (_pageNumber: number = 1, _pageSize: number = 10): Promise<ResponseUserResultList> => {
    // const response = await axios.get<ResponseUserResultList>(`${import.meta.env.VITE_API_URL}/result?current=${pageNumber}&pageSize=${pageSize}`);
    const response = await fetch("https://dummyjson.com/c/f8c9-96e9-4296-bdf6");
    return await response.json() as ResponseUserResultList;
}

export const callGetExercisePaper = async (parts: string): Promise<ApiResponse<TestPaper>> => {
    alert("viết api cho callGetExercisePaper")
    const postfix = `practice?parts=${parts}`;
    const response = await axios.get<ApiResponse<TestPaper>>(`${import.meta.env.VITE_API_URL}/tests/671a25094dbe5f4c165c31dc/${postfix}`);
    return response.data;
}

export const callGetQuestionRows = async (testId: TestID, currentPageIndex: number, pageSize: number = 8): Promise<ApiResponse<TableData<QuestionRow>>> => {
    const response = await axios.get<ApiResponse<TableData<QuestionRow>>>(`${import.meta.env.VITE_API_URL}/tests/${testId}/questions?current=${currentPageIndex + 1}&pageSize=${pageSize}`)
    return response.data;
}

export const callPutQuestionUpdate = async (formData: UpdateQuestionForm) => {
    alert(" viết api");
    console.dir(formData);
    return;
}

export const callGetTopics = async (): Promise<ApiResponse<Topic[]>> => {
    const response = await axios.get<ApiResponse<Topic[]>>(`${import.meta.env.VITE_API_URL}/topics`)
    return response.data;
}

export const callGetResult = async (id: ResultID): Promise<ApiResponse<TestResultSummary>> => {
    const response = await axios.get<ApiResponse<TestResultSummary>>(`${import.meta.env.VITE_API_URL}/result/${id}`);
    return response.data;
}