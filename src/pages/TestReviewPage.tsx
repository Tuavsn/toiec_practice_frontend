
export default function TestReviewPage() {
    // const { id = "" } = useParams<{ id: string }>();

    // const emptyTestResultSummary: TestResultSummary = {
    //     createdAt: new Date(),
    //     parts: [0],
    //     questionRecords: [],
    //     totalCorrectAnswer: 999,
    //     totalIncorrectAnswer: 999,
    //     totalListeningScore: 999,
    //     totalReadingScore: 999,
    //     totalSkipAnswer: 999,
    //     totalTime: 9999,
    //     type: "fulltest"
    // }

    // const [testResultSummary, setTestResultSummary] = useState<TestResultSummary>(emptyTestResultSummary);
    // const [isQuestionCorrect, setIsQuestionCorrect] = useState<boolean[]>([]);
    // const {
    //     resourcesElement,
    //     questionsElement,
    //     currentPageIndex,
    //     setCurrentPageIndex,
    //     changePage,
    //     isUserAnswerSheetVisible,
    //     setIsUserAnswerSheetVisible,
    //     mappingQuestionsWithPage,
    //     setMappingQuestionsWithPage,
    //     setQuestionsElement,
    //     setResourcesElement
    // } = useTest();

    // useEffect(() => {

    //     const fetchData = async () => {
    //         try {
    //             const newTestResultSummary = await fetchQuestionsData(emptyTestResultSummary);
    //             // const totalQuestions = newTestResultSummary.totalCorrectAnswer + newTestResultSummary.totalIncorrectAnswer + newTestResultSummary.totalSkipAnswer;
    //             setTestResultSummary(newTestResultSummary)
    //             const [resources, questions, mappingQuestionsPage, isCorrect] = ConvertTestRecordToHTML(newTestResultSummary.questionRecords);
    //             setResourcesElement(resources);
    //             setQuestionsElement(questions);
    //             setMappingQuestionsWithPage(mappingQuestionsPage);
    //             setIsQuestionCorrect(isCorrect)

    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    // const ButtonListElement =
    //     isQuestionCorrect.map((isCorrect, index) => {
    //         const isOnPage = currentPageIndex === mappingQuestionsWithPage[index];
    //         return (
    //             <Button
    //                 key={"answer_" + index}
    //                 style={{ width: '60px', aspectRatio: '1/1' }}
    //                 className={"border-round-md border-solid text-center p-2"}
    //                 label={(index + 1).toString()}
    //                 severity={getColorButtonOnAnswerSheet(isCorrect, isOnPage)}
    //                 onClick={() => {
    //                     if (!isOnPage) {
    //                         setCurrentPageIndex(mappingQuestionsWithPage[index]);
    //                     }
    //                 }}
    //             />
    //         );
    //     })


    return (
        <main className="pt-8 w-full">

            {/* <UserAnswerSheet
                visible={isUserAnswerSheetVisible}
                setVisible={setIsUserAnswerSheetVisible}
                ButtonListElement={ButtonListElement} />

            <h1 className="text-center"> Kết quả của {id} {formatDate( testResultSummary.createdAt )}</h1>
            <Toolbar
                start={
                    <Button severity="help" label={`Danh sách trả lời`} icon="pi pi-arrow-right" onClick={() => setIsUserAnswerSheetVisible(true)} />
                }
            />
            <Card>


                <div className="flex flex-column md:flex-row justify-content-between p-5 gap-4 custom-scrollpanel">
                    <TestArea changePage={changePage}
                        currentPageIndex={currentPageIndex}
                        parts={""}
                        questionsElement={questionsElement}
                        resourcesElement={resourcesElement} />

                </div>



            </Card> */}



        </main >

    )
}

//-----------------------helper function

// function getColorButtonOnAnswerSheet(isCorrect: boolean, isOnPage: boolean): "success" | "danger" | "info" {
//     const returnString = isCorrect ? 'success' : 'danger';
//     return isOnPage ? 'info' : returnString;
// }

// async function fetchQuestionsData(defaultValue: TestResultSummary): Promise<TestResultSummary> {
//     try {
//         const response = await fetch("https://dummyjson.com/c/a600-c342-4b74-8f2d");

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         // Get the full response and cast it to ApiResponse<TestPaper>
//         const apiResponse: ApiResponse<TestResultSummary> = await response.json();

//         // Return the data part of the response
//         return apiResponse.data;
//     } catch (error) {
//         console.error('There was a problem with the fetch operation:', error);
//         return defaultValue;
//     }
// }
