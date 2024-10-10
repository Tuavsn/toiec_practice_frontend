import { Accordion, AccordionTab } from 'primereact/accordion';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

const CourseDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Access course ID from URL params

    return (
        <div>
            <h2>Course Details for ID: {id}</h2>
            <div className='flex flex-column md:flex-row'>
                <main className='align-items-center justify-content-center border-round m-2' style={{ minWidth: '70%' }}>
                    <Card>
                        <h1>Lý thuyết</h1>
                        <Accordion activeIndex={0}>
                            <AccordionTab header="Header I">
                                <p className="m-0">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                    commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                            </AccordionTab>
                            <AccordionTab header="Header II">
                                <p className="m-0">
                                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                                    quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                                    sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                                    Consectetur, adipisci velit, sed quia non numquam eius modi.
                                </p>
                            </AccordionTab>
                            <AccordionTab header="Header III">
                                <p className="m-0">
                                    At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
                                    quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
                                    mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                                    Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                                </p>
                            </AccordionTab>
                        </Accordion>

                    </Card>
                    <br></br>
                    <Card>
                        <h1>Bài tập</h1>
                        <Accordion activeIndex={0}>
                            <AccordionTab header="Header I">
                                <p className="m-0">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                    commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                            </AccordionTab>
                            <AccordionTab header="Header II">
                                <p className="m-0">
                                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                                    quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                                    sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                                    Consectetur, adipisci velit, sed quia non numquam eius modi.
                                </p>
                            </AccordionTab>
                            <AccordionTab header="Header III">
                                <p className="m-0">
                                    At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
                                    quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
                                    mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                                    Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                                </p>
                            </AccordionTab>
                        </Accordion>

                    </Card>
                </main>
                <aside className='align-items-center justify-content-center border-round m-2' style={{ minWidth: '28%' }}>
                    <Card>
                        <h1 className='text-center'>Một số khóa học khác</h1>
                        {RelateCourses()}
                    </Card>
                </aside>
            </div>
        </div>
    );
};

export default CourseDetailsPage;


function RelateCourses() {
    return (
        <React.Fragment>
            <Link to={''}>
                Khóa làm chủ ★★★☆☆
            </Link>
            <Divider />
            <Link to={''}>
                Khóa làm giàu ★★★☆☆
            </Link>
            <Divider />
            <Link to={''}>
                khóa làm đẹp ★★★☆☆
            </Link>
            <Divider />
            <Link to={''}>
                khóa làm ăn ★★★☆☆
            </Link>
        </React.Fragment>
    )

}