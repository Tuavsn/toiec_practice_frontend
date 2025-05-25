import { Button } from "primereact/button";
import { Image } from "primereact/image";
import React from "react";
import { RennderTutorialProps } from "../../../utils/types/props";

const RennderTutorial: React.FC<RennderTutorialProps> = React.memo(
    (props) => {
        function setTutorialIsDone() {
            props.dispatchTutorialIsDone({ type: "SET_TUTORIALS_DONE", payload: props.partNeedToShow })
        }
        let tutorialSection = <></>;
        switch (props.partNeedToShow) {
            case 1:
                tutorialSection = <div data-testid="tutorial-section" className="py-5 text-center " key="image-div">
                    <audio src="https://tuine09.blob.core.windows.net/resources/DIRECTION-PART-1.mp3" hidden autoPlay onEnded={setTutorialIsDone} />
                    <Image key="image"  src="https://tuine09.blob.core.windows.net/resources/DIRECTION-PART-1%20(1).png" />
                </div>;
                break;
            case 2: tutorialSection = <div data-testid="tutorial-section" className="py-5 text-center " key="image-div">
                <audio src="https://tuine09.blob.core.windows.net/resources/DIRECTION-PART-2.mp3" hidden autoPlay onEnded={setTutorialIsDone} />
                <Image key="image"  src="https://tuine09.blob.core.windows.net/resources/DIRECTION-PART-2.PNG" />
            </div>;
                break;
            case 3: tutorialSection = <div data-testid="tutorial-section" className="py-5 text-center " key="image-div">
                <audio src="https://tuine09.blob.core.windows.net/resources/DIRECTION-PART-3.mp3" hidden autoPlay onEnded={setTutorialIsDone} />
                <Image key="image"  src="https://tuine09.blob.core.windows.net/resources/DIRECTION-PART-3.PNG" />
            </div>;
                break;
            case 4: tutorialSection = <div data-testid="tutorial-section" className="py-5 text-center " key="image-div">
                <audio src="https://tuine09.blob.core.windows.net/resources/DIRECTION-PART-4.mp3" hidden autoPlay onEnded={setTutorialIsDone} />
                <Image key="image"  src="https://tuine09.blob.core.windows.net/resources/DIRECTION-PART-4.PNG" />
            </div>;
                break;
            case 5: tutorialSection = <div data-testid="tutorial-section" className="py-5 text-center " key="image-div">
                <Image key="image"  src="https://tuine09.blob.core.windows.net/resources/DIRECTION-PART-5.PNG" />
            </div>;
                break;
            case 6: tutorialSection = <div data-testid="tutorial-section" className="py-5 text-center " key="image-div">
                <Image key="image"  src="https://tuine09.blob.core.windows.net/resources/DIRECTION-PART-6.PNG" />
            </div>;
                break;
            case 7: tutorialSection = <div data-testid="tutorial-section" className="py-5 text-center " key="image-div">
                <Image key="image"  src="https://tuine09.blob.core.windows.net/resources/DIRECTION-PART-7.PNG" />
            </div>
                break;

        }
        return (
            <article className="flex flex-column justify-content-center align-items-center" >
                <Button data-testid="understand-button" label="Confirm" onClick={setTutorialIsDone} ></Button>
                {tutorialSection}
            </article>
        )
    }
)

export default RennderTutorial;