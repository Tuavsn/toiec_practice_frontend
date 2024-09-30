import React, { useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Editor, EditorTextChangeEvent } from 'primereact/editor';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';

interface QuestionPart2Props {
    questionNum: number;
    transcript: string; // Dịch nghĩa
    explain: string; // Giải thích đáp án
    listAnswer: { value: string, text: string }[]; // List of answers
    audio: string; // Audio URL
}

const QuestionPart2Component: React.FC<QuestionPart2Props> = ({ questionNum, transcript, explain, listAnswer, audio }) => {
  const [transcriptValue, setTranscript] = useState<string>(transcript);
  const [explainValue, setExplain] = useState<string>(explain);
  const [value, setValue] = useState<string>("");

  return (
    <div>
      <h4>Câu {questionNum}</h4>
      <audio controls>
        <source src={audio} type="audio/ogg" />
      </audio>

      <div className="flex flex-column md:flex-row gap-6 mt-5">
        <div className="flex-auto">
          <ScrollPanel style={{ width: '400px', height: '400px' }}>
            <p className='text-5xl'>Nothing here</p>
          </ScrollPanel>
        </div>
        <div className="flex-auto">
          <ScrollPanel style={{ width: '600px', height: '400px' }}>
            <ul className="answers m-0 p-0" style={{ listStyle: 'none', lineHeight: '30px' }}>
              {listAnswer.map((answer, index) => (
                <li key={index} id={`answer0-${answer.value}`}>
                  {answer.value}
                  <InputText className='m-2' name={`question-${questionNum}`} value={value} onChange={(e) => setValue(e.target.value)} />
                </li>
              ))}
            </ul>
            <div className='flex'>
              <p>Đáp án: </p>
              <InputText className='m-2'/>
            </div>
            
            <Accordion>
              <AccordionTab header="Dịch nghĩa">
                <div className="card">
                  <Editor
                    value={transcriptValue}
                    onTextChange={(e: EditorTextChangeEvent) => setTranscript(e.htmlValue || '')}
                    style={{ height: '320px' }}
                  />
                </div>
              </AccordionTab>
            </Accordion>

            <Accordion>
              <AccordionTab header="Giải thích đáp án">
                <div className="card">
                  <Editor
                    value={explainValue}
                    onTextChange={(e: EditorTextChangeEvent) => setExplain(e.htmlValue || '')}
                    style={{ height: '320px' }}
                  />
                </div>
              </AccordionTab>
            </Accordion>
          </ScrollPanel>
        </div>
      </div>
      <Divider/>
    </div>
  );
};

export default QuestionPart2Component;
