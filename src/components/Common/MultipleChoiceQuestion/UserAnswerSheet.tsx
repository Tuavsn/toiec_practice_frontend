import { Sidebar } from "primereact/sidebar";
import React from "react";
import { UserAnswerSheetProps } from "../../../utils/types/props";

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



