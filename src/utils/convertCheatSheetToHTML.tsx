import { Card } from "primereact/card";
import { CheatEntry, Resource } from "./types/type";
import { Image } from 'primereact/image';
export default function ConvertCheatSheetToHTML(cheatSheet: CheatEntry[]): [JSX.Element[], JSX.Element[],number[]] {
    const resoursesSection: JSX.Element[] = [];
    const questionsSection: JSX.Element[] = [];
    const mappingQuestionsWithPage: number[] = []
    let questionNum: number = 0;
    var page = 0;
    for (const cheatEntry of cheatSheet) {
        const resoursesElement: JSX.Element[] = [];
        const questionsElement: JSX.Element[] = [];
        resoursesElement.push(...ResourcesToHTML(cheatEntry.resources, questionNum));
        if (cheatEntry.type !== 'group') {
            questionNum += 1;
            mappingQuestionsWithPage.push(page);
            questionsElement.push(
                <h5 key={"h5" + questionNum} > {questionNum}.{cheatEntry.content} </h5>
            );
            questionsElement.push(AnswersToHTML(cheatEntry.answers, questionNum));
        }
        else {
            questionsElement.push(<h3 key={"group" + questionNum} > {cheatEntry.content} </h3>);
            for (const subCheatEntry of cheatEntry.subQuestions) {
                questionNum += 1;
                mappingQuestionsWithPage.push(page);
                questionsElement.push(<h5 key={"h5" + questionNum} > {questionNum}.{subCheatEntry.content} </h5>);
                resoursesElement.push(...ResourcesToHTML(subCheatEntry.resources, questionNum));
                questionsElement.push(AnswersToHTML(subCheatEntry.answers, questionNum))
            }
        }
        questionsSection.push(
            <section className="p-3" key={"questionsSection" + questionNum} >
                {questionsElement}
            </section>
        );
        resoursesSection.push(
            <section key={"resouresSection" + questionNum} >
                {resoursesElement}
            </section>
        );
        page +=1;
    }
    return [resoursesSection, questionsSection,mappingQuestionsWithPage];
}

function ResourcesToHTML(resources: Resource[], qNum: number): JSX.Element[] {
    if (!resources) {
        return [<h1 key={"res_" + qNum}>Cố lên</h1>]
    }
    const resourcesElement: JSX.Element[] = [];
    resources.forEach(
        (r, index) => {
            switch (r.type) {
                case 'paragraph':
                    resourcesElement.push(<Card key={"para" + qNum.toString() + index} style={{ borderStyle: 'dotted', borderColor: 'lavender' }} ><p >{r.content}</p></Card>)
                    break;
                case 'image':
                    resourcesElement.push(
                        <div key={"img" + qNum.toString() + index} className="p-3 text-center"> <Image src={r.content} indicatorIcon={<i className="pi pi-search"></i>} alt="Image" preview loading='lazy' /> </div>
                    )
                    break;
                case 'audio':
                    resourcesElement.unshift(
                        <audio key={"audio" + qNum + index.toString()} className='w-full' controls autoPlay={true}>
                            <source src={r.content} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    )
                    break;
                default:
                    console.error("not have that: ", r.type);
                    break;
            }
        }
    )

    return resourcesElement;
}

function AnswersToHTML(answers: string[], qNum: number): JSX.Element {
    return (
        <div key={"answer" + qNum} className="flex flex-column gap-3 my-3">
            {answers.map((answer, index) => {
                return (
                    <div key={"answerbox" + index} className="flex align-items-center">
                        <input
                            style={{ accentColor: '#00BFFF', width: '24px', height: '24px', position: 'relative', top: '6px' }}
                            type="radio"
                            id={"id" + qNum + index} // Unique ID for each radio button
                            name={`answer-${qNum}`}   // Use a unique name for grouping per question
                            value={answer}            // Value of the radio button
                            onChange={() => alert("Chọn phương án: " + answer)} // Change event
                        />
                        <label htmlFor={"id" + qNum + index} style={{ marginLeft: '8px' }}>
                            {answer}
                        </label>
                    </div>
                );
            })}
        </div>
    );
}