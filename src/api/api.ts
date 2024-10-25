import axios from "./axios-customize";
import { ApiResponse, CategoryRow, TableData, TestPaper } from "../utils/types/type";
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

export const callGetTestPaper = async (testId: string,parts:string): Promise<ApiResponse<TestPaper>> => {
    const postfix = parts==='0' ? 'full-test' : `practice?parts=${parts}`;
    const response = await axios.get<ApiResponse<TestPaper>>(`${import.meta.env.VITE_API_URL}/tests/${testId}/${postfix}` );
    return response.data;
}