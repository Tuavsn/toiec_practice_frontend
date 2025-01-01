import { Button } from "primereact/button";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { memo } from "react";
import { Navigate } from "react-router-dom";
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
    const { setTimeLimit, timeLimit, isButtonClicked, isDoneLoading, setIsButtonClicked } = useTimeLimitChooser(limitTime, testId);
    const isButtonDisabled = isButtonClicked && !isDoneLoading
    return (
        <div className="flex p-5 justify-content-center gap-2">
            <InputNumber
                min={10}/*                  */ buttonLayout="horizontal"
                showButtons/*               */ data-testid="time-limit-input"
                suffix=" phút"/*            */ inputStyle={{ width: "6rem" }}
                max={limitTime}/*     */ value={parts[0] ? limitTime : timeLimit}
                disabled={parts[0]}/* */ onValueChange={(e) => setTimeLimit(e.value ?? limitTime)}
            />
            <Button disabled={isNotLogIn || isButtonDisabled} loading={isButtonDisabled} label="Làm bài" data-testid="start-button" onClick={() => setIsButtonClicked(true)} />
            {isButtonClicked && isDoneLoading && <Navigate to={`dotest/${timeLimit}/${DecodeCheckBoxesToUrl(parts)}`}></Navigate>}
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