import React, { memo } from 'react';
import ToeicScorePage from '../components/User/ToeicScoreTable/ToeicScoreTable';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Divider } from 'primereact/divider';
import { Editor, EditorTextChangeEvent } from 'primereact/editor';
import { InputText } from 'primereact/inputtext';
import { ScrollPanel } from 'primereact/scrollpanel';



const LookUpPage = () => {
    console.log('Rendering Greeting component');
    const div100 = () => {
        const divs = Array.from({ length: 100 }, (_, index) => (
            <div key={index} className='flex'>
                <p>Đáp án {index + 1}: </p>
                <InputText className='m-2' />
            </div>
        ));
    
        return divs;
    };
    return (
        <React.Fragment>
            <ToeicScorePage />
            <React.Fragment>
                <div>
                    <h4>Câu</h4>
                    <audio controls>

                    </audio>

                    <div className="flex flex-column md:flex-row gap-6 mt-5">
                        <div className="flex-auto">
                            <ScrollPanel style={{ width: '400px', height: '400px' }}>
                                <img
                                    src="https://zenlishtoeic.vn/wp-content/uploads/2024/01/zenlish-62-64-6.jpg"
                                    alt="question illustration"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </ScrollPanel>
                        </div>
                        <div className="flex-auto">
                            <ScrollPanel style={{ width: '600px', height: '400px' }}>
                                <ul className="answers m-0 p-0" style={{ listStyle: 'none', lineHeight: '30px' }}>

                                </ul>
                                {div100()}


                                <Accordion>
                                    <AccordionTab header="Dịch nghĩa">
                                        <div className="card">

                                        </div>
                                    </AccordionTab>
                                </Accordion>

                                <Accordion>
                                    <AccordionTab header="Giải thích đáp án">
                                        <div className="card">

                                        </div>
                                    </AccordionTab>
                                </Accordion>
                            </ScrollPanel>
                        </div>
                    </div>
                    <Divider />
                </div>

            </React.Fragment>
        </React.Fragment>
    )
};

// Using React.memo to prevent re-render if props don't change
export default memo(LookUpPage);
