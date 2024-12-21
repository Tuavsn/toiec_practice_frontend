import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React from "react";
import { ConfirmSubmitDialogProps } from "../../../utils/types/props";

const ConfirmSubmitDialog: React.FC<ConfirmSubmitDialogProps> = React.memo(
    (props) => {
        return (
            <Dialog visible={props.isDialogVisible} header={<b>Bạn có chắc muốn nộp bài</b>} onHide={() => props.dispatch({ type: "SET_VISIBLE", payload: true })}>
                <div className="flex flex-column gap-4">
                    {props.answeredCount < props.MultiRef.current.totalQuestions && <h1>Bạn có {props.MultiRef.current.totalQuestions - props.answeredCount} câu chưa làm !</h1>}
                    <div className="flex justify-content-end">
                        <Button severity="success" label="Chấp nhận nộp bài" onClick={props.onEndTest} />
                    </div>
                </div>
            </Dialog>
        )
    }
)

export default ConfirmSubmitDialog;