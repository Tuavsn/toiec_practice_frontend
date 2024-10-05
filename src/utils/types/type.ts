import { DataTableValue } from "primereact/datatable";

export interface TestCategory extends DataTableValue {
    id: string;
    format: string;
    year: number;
    createdAt: Date;
    updatedAt: Date;
    tests: string[];
}