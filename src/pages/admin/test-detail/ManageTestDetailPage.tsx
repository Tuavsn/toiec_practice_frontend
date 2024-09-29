import { Card } from "primereact/card";
import { CustomBreadCrumb } from "../../../components/Common/Index";
import AdminLayout from "../../../components/Layout/AdminLayout";
import { TabPanel, TabView } from "primereact/tabview";
import QuestionPart1Component from "./components/part1/questionPart1Component";

const questions = [
    {
        questionNum: 1,
        transcript: 'Dịch nghĩa câu hỏi 1...',
        explain: 'Giải thích đáp án câu hỏi 1...',
        listAnswer: [
            { value: 'a', text: '0 điểm' },
            { value: 'b', text: '2 điểm' },
            { value: 'c', text: '1 điểm' },
            { value: 'd', text: '10 điểm' }
        ],
        image: 'https://zenlishtoeic.vn/wp-content/uploads/2022/08/4.jpg',
        audio: 'horse.ogg',
    },
    {
        questionNum: 2,
        transcript: 'Dịch nghĩa câu hỏi 2...',
        explain: 'Giải thích đáp án câu hỏi 2...',
        listAnswer: [
            { value: 'a', text: '0 điểm' },
            { value: 'b', text: '2 điểm' },
            { value: 'c', text: '1 điểm' },
            { value: 'd', text: '10 điểm' }
        ],
        image: 'https://zenlishtoeic.vn/wp-content/uploads/2022/08/4.jpg',
        audio: 'horse.ogg',
    },
    {
        questionNum: 3,
        transcript: 'Dịch nghĩa câu hỏi 2...',
        explain: 'Giải thích đáp án câu hỏi 2...',
        listAnswer: [
            { value: 'a', text: '0 điểm' },
            { value: 'b', text: '2 điểm' },
            { value: 'c', text: '1 điểm' },
            { value: 'd', text: '10 điểm' }
        ],
        image: 'https://zenlishtoeic.vn/wp-content/uploads/2022/08/4.jpg',
        audio: 'horse.ogg',
    },
    {
        questionNum: 4,
        transcript: 'Dịch nghĩa câu hỏi 2...',
        explain: 'Giải thích đáp án câu hỏi 2...',
        listAnswer: [
            { value: 'a', text: '0 điểm' },
            { value: 'b', text: '2 điểm' },
            { value: 'c', text: '1 điểm' },
            { value: 'd', text: '10 điểm' }
        ],
        image: 'https://zenlishtoeic.vn/wp-content/uploads/2022/08/4.jpg',
        audio: 'horse.ogg',
    },
    {
        questionNum: 5,
        transcript: 'Dịch nghĩa câu hỏi 2...',
        explain: 'Giải thích đáp án câu hỏi 2...',
        listAnswer: [
            { value: 'a', text: '0 điểm' },
            { value: 'b', text: '2 điểm' },
            { value: 'c', text: '1 điểm' },
            { value: 'd', text: '10 điểm' }
        ],
        image: 'https://zenlishtoeic.vn/wp-content/uploads/2022/08/4.jpg',
        audio: 'horse.ogg',
    },
    {
        questionNum: 6,
        transcript: 'Dịch nghĩa câu hỏi 2...',
        explain: 'Giải thích đáp án câu hỏi 2...',
        listAnswer: [
            { value: 'a', text: '0 điểm' },
            { value: 'b', text: '2 điểm' },
            { value: 'c', text: '1 điểm' },
            { value: 'd', text: '10 điểm' }
        ],
        image: 'https://zenlishtoeic.vn/wp-content/uploads/2022/08/4.jpg',
        audio: 'horse.ogg',
    },
    // Add 4 more objects for a total of 6 questions
];

const Part1 = () => {
    return (
        <>
            <h3>Part 1</h3>
            <hr />
            {/* Loop through the questions array to render 6 questions */}
            {questions.map((question, index) => (
                <QuestionPart1Component
                    questionNum={question.questionNum}
                    key={index}
                    transcript={question.transcript}
                    explain={question.explain}
                    listAnswer={question.listAnswer}
                    image={question.image}
                    audio={question.audio}
                />
            ))}
        </>
    )
    
}

const TabParts = (
    <TabView>
        <TabPanel header="Part 1">
            <Part1/>
        </TabPanel>
        <TabPanel header="Header II">
        <p className="m-0">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, 
            eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
            enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui 
            ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
        </p>
    </TabPanel>
    <TabPanel header="Header III">
        <p className="m-0">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti 
            quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in
            culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. 
            Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
        </p>
    </TabPanel>
    </TabView>
)

export default function ManageTestDetailPage() {
    return (
        <AdminLayout>
            <div>
                <CustomBreadCrumb />
                <Card className="my-2">
                    {TabParts}
                </Card>
            </div>
        </AdminLayout>
    )
}