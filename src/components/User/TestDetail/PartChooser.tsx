import { Button } from "primereact/button";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { confirmPopup, ConfirmPopup, ConfirmPopupProps } from "primereact/confirmpopup";
import { InputNumber } from "primereact/inputnumber";
import { memo, MouseEvent } from "react";
import { Navigate } from "react-router-dom";
import { callDeleteDraftFromServer } from "../../../api/api";
import { deleteDraftFromIndexDB } from "../../../database/indexdb";
import { useCheckBox, useTimeLimitChooser } from "../../../hooks/TestDetailPaperHook";
import { AmINotLoggedIn } from "../../../utils/helperFunction/AuthCheck";
import { TestID } from "../../../utils/types/type";


const PartChooser: React.FC<{ limitTime: number, testId: TestID }> = memo(({ limitTime, testId }) => {
    const { parts, onPartSelectChange } = useCheckBox();
    const isNotLogIn = AmINotLoggedIn();

    return (
        <main className="" data-testid="part-chooser">
            <hr />
            <PartCheckBoxes parts={parts} onPartSelectChange={onPartSelectChange} />
            <TimeLimitChooser isNotLogIn={isNotLogIn} limitTime={limitTime} parts={parts} testId={testId} />

            {isNotLogIn && (
                <div className="flex text-red-500 justify-content-center align-items-center column-gap-3" data-testid="login-warning">
                    <i className="pi pi-exclamation-circle" style={{ fontSize: "2rem" }}></i>
                    <p className="inline">Bạn cần phải đăng nhập để có thể làm bài</p>
                </div>
            )}
            <hr />
        </main>
    );
});

export default PartChooser;




//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
interface TimeLimitChooserProps {
    testId: TestID,
    parts: boolean[],
    isNotLogIn: boolean,
    limitTime: number
}

const TimeLimitChooser: React.FC<TimeLimitChooserProps> = ({ limitTime, parts, testId, isNotLogIn }) => {
    const {
        setIsButtonClicked,
        isButtonClicked,
        isDoneLoading,
        setTimeLimit,
        isDraftExist,
        timeLimit,
    } = useTimeLimitChooser(limitTime, testId, parts);

    const isButtonDisabled = isButtonClicked && !isDoneLoading;
    const isNavigateToDoTestPage = isButtonClicked && isDoneLoading;

    const accept = () => {
        setIsButtonClicked(true)
    }
    const reject = () => {
        callDeleteDraftFromServer(testId)
        deleteDraftFromIndexDB(testId).then(
            () => setIsButtonClicked(true)
        )
    }

    const confirm = (event: MouseEvent<HTMLButtonElement>) => {
        if (!isDraftExist || parts[0] === false) {
            setIsButtonClicked(true);
            return;
        }
        confirmPopup({
            target: event.currentTarget,
            message: 'Chúng tôi nhận thấy bạn có một bài thi chưa hoàn thành. Bạn có muốn tiếp tục làm bài thi này không?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept,
            reject,
            acceptLabel: 'Tiếp tục làm bài',
            rejectLabel: 'Bỏ qua',
        } as ConfirmPopupProps)
    }
    return (
        <div className="flex p-5 justify-content-center gap-2">
            <InputNumber
                min={10}/*                  */ buttonLayout="horizontal"
                showButtons/*               */ data-testid="time-limit-input"
                suffix=" phút"/*            */ inputStyle={{ width: "6rem" }}
                max={limitTime}/*     */ value={parts[0] ? limitTime : timeLimit}
                disabled={parts[0]}/* */ onValueChange={(e) => setTimeLimit(e.value ?? limitTime)}
            />
            <Button disabled={isNotLogIn || isButtonDisabled}
                loading={isButtonDisabled}
                label="Làm bài"
                data-testid="start-button"
                onClick={confirm}
            />
            {isNavigateToDoTestPage && <Navigate to={`dotest/${timeLimit}/${DecodeCheckBoxesToUrl(parts)}`}></Navigate>}
            <ConfirmPopup />
        </div>
    )
}







//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


const PartCheckBoxes: React.FC<{ parts: boolean[], onPartSelectChange: (event: CheckboxChangeEvent) => void }> = ({ parts, onPartSelectChange }) => {
    const checkboxes = parts.map((checkValue: boolean, index: number) => {
        const label = index === 0 ? "Thi thử" : `Phần ${index}`;
        return (
            <div className="flex align-items-center" key={"checkboxnum" + index} data-testid={`checkbox-container-${index}`}>
                <Checkbox value={index} name={`part${index}`} checked={checkValue} inputId={`checkBoxPart${index}`}
                    data-testid={`checkbox-${index}`} onChange={onPartSelectChange}
                />
                <label htmlFor={`checkBoxPart${index}`} className="ml-2" data-testid={`checkbox-label-${index}`}>
                    {label}
                </label>
            </div>
        );
    });
    return (
        <section>
            <h1 className="" data-testid="chooser-header">Chọn phần thi bạn muốn làm</h1>
            <span className="flex flex-wrap justify-content-center gap-3" data-testid="checkbox-group">
                {checkboxes}
            </span>
        </section>
    )
}





//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function DecodeCheckBoxesToUrl(parts: boolean[]): string {

    if (parts[0] === true) {
        return "fulltest/0";
    }
    let returnString = "";
    for (let i = 1; i <= 7; ++i) {
        if (parts[i] === true) {
            returnString += i;
        }
    }
    return "practice/" + returnString;
}