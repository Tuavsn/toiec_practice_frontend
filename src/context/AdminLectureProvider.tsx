import { createContext } from "react";
import { LectureReduceProps } from "../utils/types/type";
import useLecture from "../hooks/LectureHook";

const AdminLectureContext = createContext<LectureReduceProps | undefined>(undefined);

export const AdminLectureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { state, dispatch } = useLecture();

    return (
        <AdminLectureContext.Provider value={{ state, dispatch }}>
            {children}
        </AdminLectureContext.Provider>
    );
}