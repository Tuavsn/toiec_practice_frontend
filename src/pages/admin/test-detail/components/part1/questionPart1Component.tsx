import React, { useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Editor, EditorTextChangeEvent } from 'primereact/editor';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Divider } from 'primereact/divider';

interface QuestionPart1Props {
    questionNum: number;
    transcript: string; // Dịch nghĩa
    explain: string; // Giải thích đáp án
    listAnswer: { value: string, text: string }[]; // List of answers
    image: string; // Image URL
    audio: string; // Audio URL
}

const QuestionPart1Component: React.FC<QuestionPart1Props> = ({ questionNum, transcript, explain, listAnswer, image, audio }) => {
  const [transcriptValue, setTranscript] = useState<string>(transcript);
  const [explainValue, setExplain] = useState<string>(explain);

  return (
    <div>
      <h4>Câu {questionNum}</h4>
      <audio controls>
        <source src={audio} type="audio/ogg" />
      </audio>

      <div className="flex flex-column md:flex-row gap-6 mt-5">
        <div className="flex-auto">
          <ScrollPanel style={{ width: '400px', height: '400px' }}>
            <img
              src={image}
              alt="question illustration"
              style={{ width: '100%', height: 'auto' }}
            />
          </ScrollPanel>
        </div>
        <div className="flex-auto">
          <ScrollPanel style={{ width: '600px', height: '400px' }}>
            <ul className="answers m-0 p-0" style={{ listStyle: 'none', lineHeight: '30px' }}>
              {listAnswer.map((answer, index) => (
                <li key={index} id={`answer0-${answer.value}`}>
                  <input type="radio" name="question0" value={answer.value} />
                  {answer.text}
                </li>
              ))}
            </ul>
            <p>Đáp án: D</p>

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

export default QuestionPart1Component;
