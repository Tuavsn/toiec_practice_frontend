import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "../context/ToastProvider";
import { EditTextParams, LectureID, SaveTextParams } from "../utils/types/type";
import { callGetLectureDoctrine, callPostDoctrine } from "../api/api";

export default function useRichTextBox(lectureID: LectureID) {
    const text = useRef<string>("<p>á</p>");
    const button = useRef<HTMLButtonElement>(null!);
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        async function fetchDoctrine() {
            const result = await callGetLectureDoctrine(lectureID);
            if (result instanceof Error) {
                toast.current?.show({ severity: "error", summary: "Lỗi khi tải dữ liệu", detail: result.message });
                return;
            }
            text.current = result;
            setIsLoading(false);

        }
        fetchDoctrine();
    }, [])
    const onSaveText = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>, text: React.MutableRefObject<string>) => {
        SaveText({ e, text, lectureID, toast });
    }, [])
    return {
        text,
        button,
        EditText,
        isLoading,
        onSaveText,
    };
}

async function SaveText(params: SaveTextParams) {
    if (params.e.currentTarget.classList.contains("bg-yellow-500")) {
        params.e.currentTarget.classList.replace("bg-yellow-500", "bg-green-500");
        params.e.currentTarget.innerText = "Lưu";
        const result = await callPostDoctrine(params.lectureID, params.text.current);
        if (result) {
            params.toast.current?.show({ severity: "success", summary: "Thành công", detail: "Lưu thành công" });
        } else {
            params.toast.current?.show({ severity: "error", summary: "Lỗi", detail: "Lỗi khi lưu. vui lòng thử lại sau" });
        }

    }
}
function EditText(params: EditTextParams) {
    if (params.e.htmlValue) {
        if (params.button.current.classList.contains("bg-green-500")) {
            params.button.current.classList.replace("bg-green-500", "bg-yellow-500");
            params.button.current.innerText = "Lưu*";
        }
    }
    params.text.current = params.e.htmlValue ?? ""
} 