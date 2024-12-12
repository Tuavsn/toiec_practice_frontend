import { Sidebar } from "primereact/sidebar";
import React from "react";
import { UserAnswerSheetFullTestProps, UserAnswerSheetProps } from "../../../utils/types/type";

export const UserAnswerSheet: React.FC<UserAnswerSheetProps> = React.memo(
    ({ visible, setVisible, ButtonListElement }) => {
        return (
            <Sidebar header={<h2 className="text-center">Câu trả lời</h2>} visible={visible} onHide={() => setVisible(false)}>
                <div className="flex flex-wrap gap-2 justify-content-left">
                    {ButtonListElement}
                </div>
            </Sidebar>
        );
    },
);
export const UserAnswerSheetFullTest: React.FC<UserAnswerSheetFullTestProps> = React.memo(
    ({ visible, dispatch, ButtonListElement }) => {
        return (
            <Sidebar header={<h2 className="text-center">Câu trả lời</h2>} visible={visible} onHide={() => dispatch({ type: "SET_USER_ANSWER_SHEET_VISIBLE", payload: false })}>
                <div className="flex flex-wrap gap-2 justify-content-left">
                    {ButtonListElement}
                </div>
            </Sidebar>
        );
    },
);


