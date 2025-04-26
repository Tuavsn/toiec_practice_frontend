import { Button } from "primereact/button"
import { Image } from "primereact/image"
import { ScrollPanel } from "primereact/scrollpanel"
import React, { useState } from "react"
import { ConvertThisTestQuestionToHTML } from "../../../utils/helperFunction/convertToHTML"
import { TestAreaProps } from "../../../utils/types/props"


export const TestArea: React.FC<TestAreaProps> = React.memo(
    ({ changePage, question, userAnswerSheet, testType,
        setTestAnswerSheet
    }) => {
        const [partTutorials, setPartTutorials] = useState<boolean[]>(Array<boolean>(7).fill(false));
        let resourcesElement: JSX.Element[] = [<React.Fragment key="default res"></React.Fragment>];
        let questionsElement: JSX.Element[] = [<React.Fragment key="default quest"></React.Fragment>];
        const setTutorialToDone = () => {
            const newPartTutorial = [...partTutorials];
            newPartTutorial[question.partNum - 1] = true;
            setPartTutorials(newPartTutorial);
        }
        let showTutorial = false;
        if (testType === "fulltest" && partTutorials[question.partNum - 1] === false) {
            [resourcesElement, questionsElement] = GetTutorial(question.partNum, setTutorialToDone);
            showTutorial = true;
        }
        else
            [resourcesElement, questionsElement] = ConvertThisTestQuestionToHTML(question, userAnswerSheet, setTestAnswerSheet, testType, changePage);
        return (
            <div className="flex xl:flex-row lg:flex-row flex-wrap md:flex-column sm:flex-column justify-content-between gap-1 custom-scrollpanel px-0 py-0 align-items-center"
            >
                <ScrollPanel
                    className="flex-1 border-round m-2 shadow-2 min-h-full"
                    style={{ minHeight: '50px', overflowY: 'auto', minWidth: '600px', maxHeight: '700px' }}
                >
                    {resourcesElement}
                </ScrollPanel>

                <div className="flex-1 align-items-stretch" style={{ minWidth: '600px' }}>
                    {(testType != "fulltest" || question.partNum > 4) &&
                        <div className="flex justify-content-end px-3 pt-2">
                            <b className="py-0 m-auto text-blue-300">Phần {question.partNum}</b>
                            <span>
                                <Button className="py-0 mr-1" icon="pi pi-angle-double-left" onClick={() => { if (!showTutorial) changePage(-1); else setTutorialToDone() }}></Button>
                                <Button className="py-0" icon="pi pi-angle-double-right" onClick={() => { if (!showTutorial) changePage(1); else setTutorialToDone() }}></Button>
                            </span>
                        </div>
                    }
                    <ScrollPanel
                        className="custombar1 border-round m-2 shadow-2 pl-2"
                        style={{ minHeight: '50px', overflowY: 'auto', maxHeight: '700px', flex: '1 1 auto' }}
                    >
                        {questionsElement}
                    </ScrollPanel>
                </div>
            </div>
        );
    }
)

function GetTutorial(partNum: number, setTutorialToDone: () => void): [JSX.Element[], JSX.Element[]] {
    const tutorial: JSX.Element[] = [<h1 key="default">hướng dẫn đang tải</h1>]
    switch (partNum) {
        case 1: tutorial[0] = <div className="py-5 text-center " key="image-div">
            <audio src="https://tuine09.blob.core.windows.net/resources/DIRECTION-PART-1.mp3" hidden autoPlay/>
            <Image key="image" width="500px" src="https://tuine09.blob.core.windows.net/resources/image_2024-12-03_105043723.png" />
        </div>;
            break;
        case 2: tutorial[0] = <div className="py-5 text-center " key="image-div">
            <audio src="https://tuine09.blob.core.windows.net/resources/DIRECTION-PART-2.mp3" hidden autoPlay/>
            <Image key="image" width="500px" src="https://tuine09.blob.core.windows.net/resources/DIRECTION-PART-2.PNG" />
        </div>;
            break;
        case 3: tutorial[0] = <div className="py-5 text-center " key="image-div">
            <audio src="https://tuine09.blob.core.windows.net/resources/DIRECTION-PART-3.mp3" hidden autoPlay/>
            <Image key="image" width="500px" src="https://tuine09.blob.core.windows.net/resources/DIRECTION-PART-3.PNG" />
        </div>;
            break;
        case 4: tutorial[0] = <div className="py-5 text-center " key="image-div">
            <audio src="https://tuine09.blob.core.windows.net/resources/DIRECTION-PART-4.mp3" hidden autoPlay/>
            <Image key="image" width="500px" src="https://tuine09.blob.core.windows.net/resources/DIRECTION-PART-4.PNG" />
        </div>;
            break;
        case 5: tutorial[0] = <div className="py-5 text-center " key="image-div">
            <Image key="image" width="500px" src="https://tuine09.blob.core.windows.net/resources/DIRECTION-PART-5.PNG" />
        </div>;
            break;
        case 6: tutorial[0] = <div className="py-5 text-center " key="image-div">
            <Image key="image" width="500px" src="https://tuine09.blob.core.windows.net/resources/DIRECTION-PART-6.PNG" />
        </div>;
            break;
        case 7: tutorial[0] = <div className="py-5 text-center " key="image-div">
            <Image key="image" width="500px" src="https://tuine09.blob.core.windows.net/resources/DIRECTION-PART-7.PNG" />
        </div>
            break;

    }
    return [tutorial, [<div key="confirm button" className="flex justify-content-center h-screen " style={{ maxHeight: '600px' }}>
        <span className="align-content-center">

            <Button label="Tiếp" onClick={setTutorialToDone} />
        </span>
    </div>
    ]]
}
