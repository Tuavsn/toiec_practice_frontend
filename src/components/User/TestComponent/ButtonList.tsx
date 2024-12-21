import { Button } from "primereact/button";
import React, { memo } from "react";
import { ButtonListProps } from "../../../utils/types/props";
import { MultipleChoiceQuestion } from "../../../utils/types/type";



const ButtonList: React.FC<ButtonListProps> = memo(
    ({
        pageMapper,
        userAnswerSheet,
        currentPageIndex,
        questionList,
        flags,
        dispatch,
    }) => {
        if (userAnswerSheet.size <= 0) {
            return <h1 key={"error-button-list"}>Lỗi rồi</h1>;
        }

        let part = 0;
        return (
            <>
                {pageMapper.map((pq, index) => {
                    const isOnPage = currentPageIndex === pq.page;
                    const text = userAnswerSheet.get(pq.questionNum)?.userAnswer ?? "";
                    const isDisabled = checkIsAllowToChangePage(questionList, pq.page, currentPageIndex);
                    let newPart = false;

                    if (part !== pq.part) {
                        part = pq.part;
                        newPart = true;
                    }

                    return (
                        <React.Fragment key={`section_for_each_question_${index}`}>
                            {newPart && <h5 className="w-full text-blue-600">Part {pq.part}</h5>}
                            <Button
                                disabled={isDisabled}
                                style={{ width: "60px", aspectRatio: "1/1" }}
                                className="border-round-md border-solid text-center p-2"
                                label={pq.questionNum.toString()}
                                severity={getColorButtonOnAnswerSheet(text, isOnPage, flags[index])}
                                onClick={() => {
                                    if (!isOnPage) {
                                        dispatch({
                                            type: "SET_CURRENT_PAGE_INDEX",
                                            payload: pq.page,
                                        });
                                    }
                                }}
                            />
                        </React.Fragment>
                    );
                })}
            </>
        );
    }
);

function checkIsAllowToChangePage(questionList: MultipleChoiceQuestion[], page: number, currentPageIndex: number): boolean {
    return (questionList[currentPageIndex].partNum <= 4 || questionList[page].partNum <= 4);
}

type ColorString = 'info' | 'secondary' | 'warning' | 'help';
function getColorButtonOnAnswerSheet(answer: string, isOnPage: boolean, isFlag: boolean): ColorString {
    let returnString: ColorString = 'secondary';
    if (answer) {
        returnString = 'info'
    }
    if (isFlag) {
        returnString = 'warning';
    }
    return isOnPage ? 'help' : returnString;
}

export default ButtonList;