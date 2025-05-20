import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Image } from "primereact/image";
import { InputTextarea } from "primereact/inputtextarea";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Panel } from "primereact/panel";
import { ProgressSpinner } from "primereact/progressspinner";
import { Skeleton } from "primereact/skeleton";
import { Tag } from "primereact/tag";
import React from "react";
import { useToeicPart1Logic } from "../../hooks/ToeicPart1LogicHook";
import { AnswerFormProps, GradeDisplayProps, ImageDisplayProps, PanelHeaderProps, PromptDisplayProps } from "../../utils/types/props";
import { PexelsPhoto, UIWritingPart1Control, WritingPart1Prompt, WritingSheetData } from "../../utils/types/type";

export default function ToeicPart1Page() {
    const {
        state,
        onAnswerChange,
        onSubmitAnswer,
        uiControls,
        generateNewQuestion,
        navigateToSheet,
        // clearError, // Not needed by the page directly if toasts auto-clear state.error
    } = useToeicPart1Logic();
    const {
        currentImage,
        currentPrompt,
        currentSheetData,
        userAnswerText,
        totalSheets,

    } = state
    // All useEffects related to toasts and auto-prompt-generation are now in the hook.

    // Primary DB Loading Guard
    if (state.isDbLoading) {
        return (
            // If your useToast requires <Toast/> in the tree, it might need to be here or in App.tsx
            // For now, assuming useToast handles its own rendering or is global.
            <div className="p-4 flex flex-column justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
                <ProgressSpinner strokeWidth="4" style={{ width: '60px', height: '60px' }} animationDuration=".5s" aria-label="Đang tải dữ liệu ứng dụng" />
                <p className="mt-3 text-xl text-color-secondary">Đang tải dữ liệu trang làm bài...</p>
            </div>
        );
    }


    const handlePageChange = (event: PaginatorPageChangeEvent) => {
        console.log("press", event, state.currentSheetId);
        const targetSheetId = event.page + 1;
        if (targetSheetId !== state.currentSheetId) {
            navigateToSheet(targetSheetId);
        }
    };

    const paginatorFirst = state.currentSheetId ? state.currentSheetId - 1 : 0;

    return (
        <>
            <div className="p-2 md:p-4">
                <Panel className="shadow-2 border-round-lg"
                    header={
                        <PanelHeader
                            currentSheetId={null}
                            generateNewQuestion={generateNewQuestion}
                            uiControl={uiControls}
                            totalSheets={totalSheets} />}
                >
                    <PanelBody currentImage={currentImage}
                        currentPrompt={currentPrompt}
                        currentSheetData={currentSheetData}
                        uiControls={uiControls}
                        onAnswerChange={onAnswerChange}
                        onSubmitAnswer={onSubmitAnswer}
                        userAnswerText={userAnswerText}
                    />



                    {(uiControls.shouldRenderGradeDisplay) && (
                        <div className="mt-4 animation-fadein">
                            <Divider className="my-4" />
                            <GradeDisplay feedback={state.currentFeedback} uiControls={uiControls} />
                        </div>
                    )}

                    {state.totalSheets > 0 && (
                        <div className="mt-5">
                            <Paginator
                                first={paginatorFirst}
                                rows={1}
                                totalRecords={state.totalSheets}
                                onPageChange={handlePageChange}
                                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                                currentPageReportTemplate="Bài {currentPage} trên {totalPages}"
                            />
                        </div>
                    )}
                </Panel>
            </div>
        </>
    );
}


function getScoreSeverity(score: number): "success" | "info" | "warning" | "danger" {
    if (score >= 4) return "success";
    if (score >= 3) return "info";
    if (score >= 1) return "warning";
    return "danger";
}

function GradeDisplay({ feedback, uiControls }: GradeDisplayProps) {
    if (uiControls.isSubmitAnswerButtonLoading) {
        return (
            <Card title="Đang chấm bài..." className="mt-4">
                <Skeleton width="30%" height="2rem" className="mb-3" />
                <Skeleton height="1rem" className="mb-2" />
                <Skeleton height="1rem" />
            </Card>
        );
    }

    if (!feedback) {
        return <p className="mt-4 text-color-secondary">Chưa có điểm số và nhận xét.</p>;
    }

    const title = (
        <div className="flex align-items-center">
            <span className="font-bold text-xl mr-2">Kết quả chấm bài</span>
            <Tag value={`Điểm: ${feedback.score}/5`} severity={getScoreSeverity(feedback.score)} rounded />
        </div>
    );

    return (
        <Card title={title} className="mt-4 bg-surface-50 shadow-1">
            <p className="text-lg">{feedback.feedbackText}</p>
            {feedback.grammarCorrections && feedback.grammarCorrections.length > 0 && (
                <>
                    <Divider />
                    <Accordion>
                        <AccordionTab header={`Gợi ý sửa lỗi (${feedback.grammarCorrections.length})`}>
                            {feedback.grammarCorrections.map((correction, index) => (
                                <div key={index} className="mb-3 p-3 border-1 border-round border-surface-200 bg-surface-0">
                                    <p><strong>Lỗi gốc:</strong> <span className="text-red-500">{correction.original}</span></p>
                                    <p><strong>Gợi ý:</strong> <span className="text-green-500">{correction.suggestion}</span></p>
                                    {correction.explanation && <p className="text-sm text-color-secondary">{correction.explanation}</p>}
                                </div>
                            ))}
                        </AccordionTab>
                    </Accordion>
                </>
            )}
        </Card>
    );
}

interface PanelBodyProps {
    currentSheetData: WritingSheetData | null,
    currentImage: PexelsPhoto | null,
    userAnswerText: string,
    onAnswerChange: (text: string) => void,
    onSubmitAnswer: () => void,
    currentPrompt: WritingPart1Prompt | null,
    uiControls: UIWritingPart1Control
}

const PanelBody: React.FC<PanelBodyProps> = React.memo(
    ({ currentSheetData, currentImage,
        uiControls,
        onAnswerChange,
        onSubmitAnswer,
        userAnswerText,
        currentPrompt
    }) => {
        if (!currentSheetData) {
            return <React.Fragment>
                lỗi rồi
            </React.Fragment>
        }
        return (

            <div className="grid animation-fadein">
                {/* Image Section */}

                <ImageDisplay
                    image={currentImage}
                    isLoading={uiControls.shouldShowImageSkeleton}
                    imageAltText={currentPrompt?.imageAltText}
                />

                {/* Prompt & Answer Section */}
                < div className="col-12 lg:col-5 xl:col-4 mt-3 lg:mt-0" >
                    <Card className="shadow-1 h-full">
                        <WritingQuestionPart1Section currentPrompt={currentPrompt} isLoading={uiControls.shouldShowPromptSkeleton} />
                        <AnswerForm
                            answerText={userAnswerText}
                            onAnswerChange={onAnswerChange}
                            onSubmit={onSubmitAnswer}
                            isSubmitting={uiControls.isSubmitAnswerButtonLoading}
                            isSubmitAnswerButtonDisable={uiControls.isSubmitAnswerButtonDisabled}
                        />

                    </Card>
                </div >
            </div >
        )
    }

)
interface WritingQuestionPart1SectionProps {
    currentPrompt: WritingPart1Prompt | null,
    isLoading: boolean,
}

const WritingQuestionPart1Section: React.FC<WritingQuestionPart1SectionProps> = React.memo(
    ({ currentPrompt, isLoading }) => {
        return (
            < div className="col-12 lg:col-5 xl:col-4 mt-3 lg:mt-0 w-full" >
                <Card className="shadow-1 h-full">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-3 text-color-secondary flex align-items-center">
                            <i className="pi pi-align-left mr-2 text-xl" />Đề bài và Hướng dẫn
                        </h2>
                        <PromptDisplay
                            prompt={currentPrompt}
                            isLoading={isLoading}
                        />
                    </div>
                </Card>
            </div>
        )
    }
)

const PanelHeader: React.FC<PanelHeaderProps> = React.memo(
    ({ generateNewQuestion, uiControl, currentSheetId, totalSheets }) => {
        let headerText = "";
        if (currentSheetId && totalSheets > 0) {
            headerText = `(Bài ${currentSheetId} / ${totalSheets})`

        }
        return (
            <div className="flex flex-wrap justify-content-between align-items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold m-0 text-primary">
                    TOEIC Writing - Part 1{headerText}

                </h1>
                <Button
                    label="Tạo đề mới"
                    icon="pi pi-refresh"
                    onClick={generateNewQuestion}
                    loading={uiControl.isGenerateNewPromptButtonLoading}
                    disabled={uiControl.isGenerateNewPromptButtonDisabled}
                    tooltip="Tải hoặc tạo đề bài và hình ảnh mới"
                    tooltipOptions={{ position: 'bottom' }}
                    className="p-button-lg"
                />
            </div>
        );
    }
)


function AnswerForm({
    answerText,
    onAnswerChange,
    onSubmit,
    isSubmitting,
    isSubmitAnswerButtonDisable,
}: AnswerFormProps) {
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onAnswerChange(e.target.value);
    };

    return (
        <React.Fragment>
            <Divider />
            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-3 text-color-secondary flex align-items-center">
                    <i className="pi pi-pencil mr-2 text-xl" />Câu trả lời của bạn
                </h2>
                <div className="p-fluid">
                    <InputTextarea
                        value={answerText}
                        onChange={handleInputChange}
                        rows={5}
                        placeholder="Viết một câu mô tả bức tranh tại đây..."
                        className="mb-3 text-lg"
                        disabled={isSubmitting}
                        autoResize
                    />
                    <Button
                        label="Nộp bài"
                        icon="pi pi-check"
                        onClick={onSubmit}
                        loading={isSubmitting}
                        disabled={isSubmitAnswerButtonDisable}
                        className="p-button-primary w-full md:w-auto"
                    />
                </div>
            </div>
        </React.Fragment>
    );
}


function PromptDisplay({ prompt, isLoading }: PromptDisplayProps) {
    if (isLoading && !prompt) {
        return (
            <>
                <Skeleton width="90%" height="1.5rem" className="mb-3" /> {/* Instruction line 1 */}
                <Skeleton width="70%" height="1.5rem" className="mb-4" /> {/* Instruction line 2 */}
                <Skeleton width="40%" height="1.5rem" className="mb-2" /> {/* Keywords label */}
                <div className="flex">
                    <Skeleton width="100px" height="2.5rem" className="mr-2" /> {/* Keyword 1 Tag */}
                    <Skeleton width="100px" height="2.5rem" /> {/* Keyword 2 Tag */}
                </div>
            </>
        );
    }

    if (!prompt || !prompt.promptText) {
        return <p className="text-color-secondary mt-2">Vui lòng tạo đề bài mới.</p>;
    }

    // The prompt.promptText itself should already contain the keywords as part of the instruction.
    // This display below is for highlighting them.

    return (
        <div className="p-0"> {/* Removed Card to give page more control */}
            {/* Main Instruction Text */}
            <p className="m-0 text-lg line-height-3" style={{ whiteSpace: 'pre-line' }}>
                {prompt.promptText}
            </p>

            {/* Visually Distinct Section for Mandatory Keywords */}
            {(prompt.mandatoryKeyword1 || prompt.mandatoryKeyword2) && (
                <div className="mt-4 p-3 border-1 border-dashed border-primary-500 border-round bg-primary-50">
                    <strong className="text-md mr-2 d-block mb-2 text-primary-700">
                        <i className="pi pi-key mr-2" />
                        Sử dụng các từ/cụm từ sau:
                    </strong>
                    <div className="flex flex-wrap gap-2 align-items-center">
                        {prompt.mandatoryKeyword1 && (
                            <Tag
                                value={prompt.mandatoryKeyword1}
                                severity="warning" // Changed severity for more attention
                                className="p-tag-lg text-base px-3 py-2"
                            />
                        )}
                        {prompt.mandatoryKeyword2 && (
                            <Tag
                                value={prompt.mandatoryKeyword2}
                                severity="warning" // Changed severity for more attention
                                className="p-tag-lg text-base px-3 py-2"
                            />
                        )}
                    </div>
                    <small className="text-sm text-color-secondary mt-2 d-block">
                        (Bạn có thể thay đổi dạng của từ và sử dụng chúng theo thứ tự bất kỳ.)
                    </small>
                </div>
            )}
        </div>
    );
}


function ImageDisplay({ image, isLoading, imageAltText }: ImageDisplayProps) {
    if (isLoading) {
        return <Skeleton width="100%" height="300px" className="mb-3" />;
    }

    if (!image || !image.src.large) {
        return (
            <div className="flex flex-1 justify-content-center align-items-center mb-3" style={{ height: '300px', border: '1px dashed var(--surface-d)', borderRadius: 'var(--border-radius)' }}>
                <p className="text-color-secondary">Vui lòng tạo đề để hiển thị hình ảnh.</p>
            </div>
        );
    }

    return (
        <div className="col-12 lg:col-7 xl:col-8 pr-lg-4">
            <Card className="shadow-1 h-full">

                <div className="mb-3 flex justify-content-center">
                    <Image
                        src={image.src.large}
                        alt={imageAltText || image.alt || "Hình ảnh cho đề bài TOEIC"}
                        width="100%" // Chiều rộng tối đa, tự điều chỉnh chiều cao
                        style={{ maxWidth: '600px', height: 'auto', borderRadius: 'var(--border-radius)' }}
                        preview
                        imageClassName="border-round"
                    />
                </div>
            </Card>
        </div>
    );
}