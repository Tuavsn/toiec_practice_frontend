import { Sidebar } from "primereact/sidebar";
import React from "react";
import { UserAnswerSheetFullTestProps, UserAnswerSheetProps } from "../../../utils/types/type";
import SubComponents from "../../User/TestComponent/LoadingGetQuestions";

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
    (props) => {
        return (
            <Sidebar header={<h2 className="text-center">Câu trả lời</h2>} visible={props.visible} onHide={() => props.dispatch({ type: "SET_USER_ANSWER_SHEET_VISIBLE", payload: false })}>
                <div className="flex flex-wrap gap-2 justify-content-left">
                    <SubComponents.ButtonList
                        flags={props.flags}
                        dispatch={props.dispatch}
                        pageMapper={props.pageMapper}
                        questionList={props.questionList}
                        userAnswerSheet={props.userAnswerSheet}
                        currentPageIndex={props.currentPageIndex}
                    />
                </div>
            </Sidebar>
        );
    },
);


