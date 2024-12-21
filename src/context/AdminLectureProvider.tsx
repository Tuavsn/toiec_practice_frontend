import { createContext } from "react";
import useLecture from "../hooks/LectureHook";
import { LectureReduceProps } from "../utils/types/props";

const AdminLectureContext = createContext<LectureReduceProps | undefined>(undefined);

export const AdminLectureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { state, dispatch } = useLecture();

    return (
        <AdminLectureContext.Provider value={{ state, dispatch }}>
            {children}
        </AdminLectureContext.Provider>
    );
}