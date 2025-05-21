import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputTextarea } from "primereact/inputtextarea";
import { Message } from "primereact/message";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Panel } from "primereact/panel";
import { ProgressBar } from "primereact/progressbar";
import { ProgressSpinner } from "primereact/progressspinner";
import { Skeleton } from "primereact/skeleton";
import { Tag } from "primereact/tag";
import { useEffect, useState } from "react";
import { useWritingToeicPart3Logic } from "../../hooks/ToeicWritingPart3LLogicHook";
import { EssayEditorFormProps, EssayGradeDisplayProps, EssayQuestionDisplayProps, WritingToeicPart2PaginatorSectionProps, WritingToeicPart3PanelHeaderProps } from "../../utils/types/props";

export default function WritingToeicPart3Page() {
    const {
        state,
        generateNewEssayQuestion,
        updateUserEssayText,
        submitUserEssay,
        navigateToPart3Sheet,
        uiControls,
    } = useWritingToeicPart3Logic();

    // --- Guard chính cho việc tải dữ liệu từ DB ---
    // Bình luận: Nếu đang tải dữ liệu ban đầu từ CSDL, hiển thị spinner toàn trang.
    if (uiControls.isFetchingInitialData) {
        return (
            <div className="p-4 flex flex-column justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
                <ProgressSpinner strokeWidth="3" style={{ width: '60px', height: '60px' }} animationDuration=".8s" aria-label="Đang tải dữ liệu Part 3" />
                <p className="mt-3 text-xl text-color-secondary">Đang tải dữ liệu trang viết luận...</p>
            </div>
        );
    }

    // --- Header của trang ---


    // --- Xử lý sự kiện thay đổi trang của Paginator ---
    const handlePageChange = (event: PaginatorPageChangeEvent) => {
        const targetSheetId = event.page + 1; // Paginator event.page bắt đầu từ 0
        if (targetSheetId !== state.currentSheetId) {
            navigateToPart3Sheet(targetSheetId);
        }
    };


    // Biến xác định xem có nên hiển thị phần nội dung chính (đề bài, form trả lời) không
    const shouldRenderEssayContentArea = state.currentSheetData && !state.error;
    // Biến xác định xem có nên hiển thị form soạn thảo không
    const shouldRenderEssayEditor = !!state.currentPrompt && state.currentSheetData && state.currentSheetData.status !== 'blank';

    return (
        <>
            {/* Component Toast được giả định là đã render ở cấp App.tsx và được hook useToast quản lý */}
            <div className="p-2 md:p-4">
                <Panel header={<PageHeader state={state} uiControls={uiControls} generateNewEssayQuestion={generateNewEssayQuestion} />} className="shadow-2 border-round-lg">

                    {/* Placeholder nếu không có sheet data và không đang tải/lỗi */}
                    {!shouldRenderEssayContentArea && !uiControls.isGenerateNewEssayQuestionButtonLoading && (
                        <div className="text-center p-5">
                            <i className="pi pi-file-excel text-6xl text-color-secondary opacity-50 mb-3"></i>
                            <p className="text-xl text-color-secondary">
                                {state.error ? `Lỗi: ${state.error}` : "Sẵn sàng để tạo đề bài luận mới!"}
                            </p>
                            {/* Có thể thêm nút thử lại nếu có lỗi tải sheet cụ thể */}
                        </div>
                    )}

                    {/* Nội dung chính của trang: Đề bài, Form Soạn Thảo, Kết Quả */}
                    {shouldRenderEssayContentArea && (
                        <div className="animation-fadein">
                            {/* 1. Hiển thị Câu Hỏi Luận và Hướng Dẫn */}
                            <Card className="mb-4 shadow-1">
                                <h2 className="text-xl font-semibold mb-3 text-color-secondary flex align-items-center">
                                    <i className="pi pi-question-circle mr-2 text-xl" /> Đề Bài Luận và Hướng Dẫn
                                </h2>
                                <EssayQuestionDisplay
                                    prompt={state.currentPrompt}
                                    isLoading={uiControls.shouldShowEssayQuestionSkeleton}
                                />
                            </Card>

                            {/* 2. Khu vực soạn thảo bài luận (chỉ hiển thị nếu có đề bài) */}
                            {shouldRenderEssayEditor && (
                                <Card className="mb-4 shadow-1">
                                    <h2 className="text-xl font-semibold mb-3 text-color-secondary flex align-items-center">
                                        <i className="pi pi-pencil mr-2 text-xl" /> Bài Luận Của Bạn (Tối thiểu 300 từ)
                                    </h2>
                                    <EssayEditorForm
                                        essayText={state.userEssayText}
                                        onEssayChange={updateUserEssayText}
                                        onSubmit={submitUserEssay}
                                        isSubmitting={uiControls.isSubmitEssayButtonLoading}
                                        isFormDisabled={uiControls.isEssayEditorDisabled}
                                    />
                                </Card>
                            )}

                            {/* 3. Khu vực hiển thị điểm và feedback */}
                            {uiControls.shouldRenderEssayGradeDisplay && (
                                <Card className="shadow-1">
                                    <h2 className="text-xl font-semibold mb-3 text-color-secondary flex align-items-center">
                                        <i className="pi pi-star mr-2 text-xl" /> Kết Quả Đánh Giá Bài Luận
                                    </h2>
                                    <EssayGradeDisplay
                                        feedback={state.currentFeedback}
                                        isLoading={uiControls.isSubmitEssayButtonLoading} // Hoặc state.isLoadingGrade
                                    />
                                </Card>
                            )}
                        </div>
                    )}

                    {/* Paginator */}
                    {state.totalSheets > 0 && (
                        <div className="mt-5">
                            <Divider />
                            <WritingToeicPart3PaginatorSection // << Tạm dùng Paginator Section của Part 2, sẽ đổi tên sau
                                currentSheetId={state.currentSheetId}
                                totalSheets={state.totalSheets}
                                onPageChange={handlePageChange}
                                isDisabled={
                                    uiControls.isGenerateNewEssayQuestionButtonDisabled ||
                                    uiControls.isSubmitEssayButtonLoading
                                }
                            />
                        </div>
                    )}
                </Panel>
            </div>
        </>
    );
}

function WritingToeicPart3PaginatorSection({
    currentSheetId,
    totalSheets,
    onPageChange,
}: WritingToeicPart2PaginatorSectionProps) {
    if (totalSheets <= 0) {
        return <></>
    }
    // Bình luận: Section chứa Paginator để điều hướng qua các bài làm cũ.
    const paginatorFirst = currentSheetId ? currentSheetId - 1 : 0;

    return (
        <div className="mt-5">
            <Divider />
            <Paginator
                first={paginatorFirst}
                rows={1} // Mỗi trang 1 sheet
                totalRecords={totalSheets}
                onPageChange={onPageChange}
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                currentPageReportTemplate="Bài {currentPage} trên {totalPages}"
            />
        </div>
    );
}

const MIN_WORDS_ESSAY = 300; // Số từ tối thiểu yêu cầu
function EssayEditorForm({
    essayText,
    onEssayChange,
    onSubmit,
    isSubmitting,
    isFormDisabled,
}: EssayEditorFormProps) {
    // Bình luận: Component này chứa InputTextarea lớn cho bài luận Part 3,
    // bộ đếm từ, và nút "Nộp bài".

    const [wordCount, setWordCount] = useState(0);

    // Cập nhật số từ mỗi khi essayText thay đổi
    useEffect(() => {
        const words = essayText.trim().split(/\s+/).filter(Boolean);
        setWordCount(words.length);
    }, [essayText]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onEssayChange(e.target.value);
    };

    const handleSubmitClick = () => {
        // Có thể thêm kiểm tra cuối cùng ở đây nếu cần,
        // ví dụ, cảnh báo nếu số từ quá ít trước khi gọi onSubmit.
        if (wordCount < MIN_WORDS_ESSAY * 0.8) { // Cảnh báo nếu ít hơn 80% số từ yêu cầu
            // Có thể dùng toast ở đây nếu muốn, hoặc để hook xử lý lỗi logic nghiệp vụ
            console.warn(`Bài luận có ${wordCount} từ, hơi ngắn so với yêu cầu ~${MIN_WORDS_ESSAY} từ.`);
        }
        onSubmit();
    };

    // Điều kiện để vô hiệu hóa nút nộp bài
    const isSubmitButtonActuallyDisabled =
        isFormDisabled ||      // Nếu toàn bộ form bị vô hiệu hóa
        isSubmitting ||        // Hoặc đang trong quá trình nộp
        essayText.trim().length === 0 || // Hoặc chưa nhập gì
        wordCount < MIN_WORDS_ESSAY * 0.7; // Hoặc quá ít từ (ví dụ, dưới 70% yêu cầu thì không cho nộp)

    // Tính toán giá trị cho ProgressBar
    const progressValue = Math.min((wordCount / MIN_WORDS_ESSAY) * 100, 100);
    const progressColor = progressValue < 70 ? 'var(--orange-500)' : (progressValue < 100 ? 'var(--primary-color)' : 'var(--green-500)');


    return (
        <div className="p-fluid essay-editor-form">
            {/* Khu vực nhập liệu cho bài luận */}
            <InputTextarea
                value={essayText}
                onChange={handleInputChange}
                rows={18} // Tăng số dòng cho phù hợp với bài luận dài
                placeholder="Viết bài luận của bạn tại đây (ít nhất 300 từ)..."
                className="mb-3 text-lg font-serif" // Sử dụng font serif cho dễ đọc văn bản dài
                disabled={isFormDisabled || isSubmitting}
                autoResize
                style={{ lineHeight: '1.7' }} // Tăng giãn dòng cho dễ đọc
            />

            {/* Hiển thị số từ và ProgressBar */}
            <div className="mb-3">
                <div className="flex justify-content-between align-items-center mb-1">
                    <small className="text-color-secondary">
                        Số từ hiện tại: {wordCount} / {MIN_WORDS_ESSAY} (tối thiểu)
                    </small>
                    {wordCount > 0 && wordCount < MIN_WORDS_ESSAY && (
                        <small style={{ color: progressColor }}>
                            {MIN_WORDS_ESSAY - wordCount} từ nữa để đạt mục tiêu
                        </small>
                    )}
                </div>
                <ProgressBar value={progressValue} style={{ height: '8px' }} color={progressColor} showValue={false} />
                {essayText.trim().length > 0 && wordCount < MIN_WORDS_ESSAY * 0.7 && (
                    <Message
                        severity="warn"
                        text={`Bài luận cần có ít nhất ${MIN_WORDS_ESSAY} từ để được đánh giá tốt nhất. Hiện tại mới có ${wordCount} từ.`}
                        className="mt-2 text-sm"
                    />
                )}
            </div>


            {/* Nút Nộp Bài Luận */}
            <Button
                label="Nộp Bài Luận"
                icon="pi pi-send"
                onClick={handleSubmitClick}
                loading={isSubmitting}
                disabled={isSubmitButtonActuallyDisabled}
                className="p-button-primary p-button-lg w-full md:w-auto" // Nút lớn, dễ nhận biết
                tooltip="Hoàn tất và gửi bài luận của bạn để được chấm điểm"
                tooltipOptions={{ position: 'top' }}
            />
            {isSubmitButtonActuallyDisabled && essayText.trim().length > 0 && wordCount < MIN_WORDS_ESSAY * 0.7 && (
                <small className="p-error block mt-1">
                    Bài luận của bạn chưa đủ dài để nộp.
                </small>
            )}
        </div>
    );
}

/**
 * @function getEssayScoreSeverity
 * @description Xác định mức độ (severity) của Tag điểm dựa trên điểm số bài luận.
 * @param {number} score - Điểm số.
 * @param {number} maxScore - Điểm tối đa (ví dụ: 5 cho Part 3).
 * @returns {"success" | "info" | "warning" | "danger"}
 * @comment Bình luận bằng tiếng Việt: Hàm giúp xác định màu sắc cho Tag hiển thị điểm bài luận.
 */
function getEssayScoreSeverity(score: number, maxScore: number = 5): "success" | "info" | "warning" | "danger" {
    if (score >= maxScore * 0.8) return "success"; // >= 4/5
    if (score >= maxScore * 0.6) return "info";    // >= 3/5
    if (score >= maxScore * 0.4) return "warning"; // >= 2/5
    return "danger"; // < 2/5
}

export function EssayGradeDisplay({ feedback, isLoading }: EssayGradeDisplayProps) {
    // Bình luận: Component này hiển thị kết quả chấm điểm chi tiết cho bài luận Part 3.
    // Bao gồm điểm tổng, nhận xét chung, nhận xét chi tiết theo từng kỹ năng và gợi ý cải thiện.

    // --- Trường hợp đang tải kết quả chấm điểm ---
    if (isLoading) {
        return (
            <Card title="Đang phân tích và chấm điểm bài luận của bạn..." className="mt-4">
                <Skeleton width="35%" height="2.5rem" className="mb-4" /> {/* Score Tag */}
                {/* Overall Feedback Skeletons */}
                <Skeleton width="50%" height="1.8rem" className="mb-2" />
                <Skeleton height="1rem" className="mb-3" />
                {/* Detailed Feedback Skeletons (e.g., for 3 criteria) */}
                <Skeleton width="45%" height="1.8rem" className="mb-2 mt-3" />
                <Skeleton height="1rem" className="mb-3" />
                <Skeleton width="40%" height="1.8rem" className="mb-2 mt-3" />
                <Skeleton height="1rem" className="mb-3" />
                {/* Key Improvement Areas Skeleton */}
                <Skeleton width="55%" height="1.8rem" className="mb-2 mt-3" />
                <Skeleton height="1rem" />
            </Card>
        );
    }

    // --- Trường hợp không có feedback (sau khi tải xong) ---
    if (!feedback) {
        return (
            <div className="mt-4 p-4 text-center text-color-secondary border-1 surface-border border-round surface-ground">
                <i className="pi pi-info-circle text-2xl mb-2"></i>
                <p>Chưa có kết quả chấm điểm cho bài luận này.</p>
            </div>
        );
    }

    const maxScorePart3 = 5; // Thang điểm tối đa cho Part 3 (ví dụ)
    const scoreTagSeverity = getEssayScoreSeverity(feedback.score, maxScorePart3);

    // --- Tiêu đề Card bao gồm điểm số ---
    const cardTitle = (
        <div className="flex align-items-center flex-wrap gap-2">
            <span className="font-bold text-xl">Đánh Giá Chi Tiết Bài Luận</span>
            <Tag value={`Điểm Tổng: ${feedback.score}/${maxScorePart3}`} severity={scoreTagSeverity} className="text-lg px-3 py-1" rounded />
        </div>
    );

    // --- Hiển thị thông tin điểm và feedback ---
    return (
        <Card title={cardTitle} className="mt-4 bg-bluegray-50 shadow-1"> {/* Nền khác biệt một chút */}
            {/* 1. Nhận xét tổng quát (bằng tiếng Việt) */}
            <div className="mb-4 p-3 surface-0 border-round shadow-1">
                <h4 className="font-semibold text-lg mt-0 mb-2 text-primary-700 flex align-items-center">
                    <i className="pi pi-comment mr-2" />Nhận Xét Tổng Quát:
                </h4>
                <p className="text-md line-height-3 m-0" style={{ whiteSpace: 'pre-line' }}>
                    {feedback.overallFeedback || "Không có nhận xét tổng quát."}
                </p>
            </div>

            <Divider />

            {/* 2. Nhận xét chi tiết theo từng tiêu chí */}
            {feedback.detailedFeedback && (
                <div className="my-4">
                    <h4 className="font-semibold text-lg mt-0 mb-3 text-primary-700 flex align-items-center">
                        <i className="pi pi-chart-line mr-2" />Phân Tích Chi Tiết Theo Tiêu Chí:
                    </h4>
                    <Accordion multiple activeIndex={[0, 1, 2]}> {/* Mở sẵn tất cả các tab */}
                        <AccordionTab
                            header={<span className="font-semibold"><i className="pi pi-bullseye mr-2" />Bảo Vệ Quan Điểm & Phát Triển Ý</span>}>
                            <p className="text-md line-height-3 m-0 p-2" style={{ whiteSpace: 'pre-line' }}>
                                {feedback.detailedFeedback.opinionSupportFeedback || "Không có nhận xét."}
                            </p>
                        </AccordionTab>
                        <AccordionTab
                            header={<span className="font-semibold"><i className="pi pi-sitemap mr-2" />Tổ Chức & Bố Cục Bài Luận</span>}>
                            <p className="text-md line-height-3 m-0 p-2" style={{ whiteSpace: 'pre-line' }}>
                                {feedback.detailedFeedback.organizationFeedback || "Không có nhận xét."}
                            </p>
                        </AccordionTab>
                        <AccordionTab
                            header={<span className="font-semibold"><i className="pi pi-language mr-2" />Ngữ Pháp & Từ Vựng</span>}>
                            <p className="text-md line-height-3 m-0 p-2" style={{ whiteSpace: 'pre-line' }}>
                                {feedback.detailedFeedback.grammarVocabularyFeedback || "Không có nhận xét."}
                            </p>
                        </AccordionTab>
                    </Accordion>
                </div>
            )}

            {/* 3. Các lĩnh vực chính cần cải thiện (nếu có) */}
            {feedback.keyImprovementAreas && feedback.keyImprovementAreas.length > 0 && (
                <>
                    <Divider />
                    <div className="mt-4 p-3 surface-0 border-round shadow-1">
                        <h4 className="font-semibold text-lg mt-0 mb-2 text-orange-700 flex align-items-center">
                            <i className="pi pi-directions mr-2" />Gợi Ý Cải Thiện Chính:
                        </h4>
                        <ul className="list-disc pl-5 m-0">
                            {feedback.keyImprovementAreas.map((area, index) => (
                                <li key={index} className="mb-2 text-md line-height-3">{area}</li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </Card>
    );
}

function EssayQuestionDisplay({ prompt, isLoading }: EssayQuestionDisplayProps) {
    // Bình luận: Component này hiển thị câu hỏi luận và hướng dẫn chung cho Part 3.

    // --- Trường hợp đang tải đề bài ---
    if (isLoading) {
        return (
            <div className="p-0"> {/* Bỏ padding của Card bọc ngoài nếu có */}
                {/* Skeleton cho phần Directions */}
                <Skeleton width="40%" height="1.5rem" className="mb-2" />
                <Skeleton height="1rem" className="mb-3" />
                <Divider />
                {/* Skeleton cho phần Câu hỏi luận */}
                <Skeleton width="60%" height="1.5rem" className="mt-3 mb-2" />
                <Skeleton height="1.25rem" width="90%" className="mb-2" />
                <Skeleton height="1.25rem" width="80%" />
            </div>
        );
    }

    // --- Trường hợp không có đề bài (sau khi tải xong) ---
    if (!prompt || !prompt.essayQuestion) {
        return (
            <div className="p-4 text-center text-color-secondary border-1 surface-border border-round surface-ground">
                <i className="pi pi-question-circle text-2xl mb-2"></i>
                <p>Chưa có câu hỏi luận. Vui lòng tạo đề mới.</p>
            </div>
        );
    }

    // --- Hiển thị đề bài và hướng dẫn ---
    // Sử dụng Panel để mô phỏng khung đề thi
    return (
        <Panel header="Đề bài và Hướng dẫn" toggleable className="essay-question-panel">
            {/* Hướng dẫn chung */}
            {prompt.directions && (
                <div className="directions-section mb-4">
                    <h4 className="font-semibold text-lg mt-0 mb-2 text-orange-700">
                        <i className="pi pi-info-circle mr-2" />Hướng dẫn chung:
                    </h4>
                    <p className="text-md line-height-3 m-0" style={{ whiteSpace: 'pre-line' }}>
                        {prompt.directions}
                    </p>
                </div>
            )}

            {prompt.directions && prompt.essayQuestion && <Divider className="my-4" />}

            {/* Câu hỏi luận */}
            <div className="essay-question-section">
                <h4 className="font-semibold text-lg mt-0 mb-2 text-indigo-700">
                    <i className="pi pi-question mr-2" />Yêu cầu bài luận:
                </h4>
                <p className="text-lg line-height-3 font-bold m-0" style={{ whiteSpace: 'pre-line' }}>
                    {prompt.essayQuestion}
                </p>
            </div>

            {prompt.generatedAt && (
                <div className="text-right text-xs text-color-secondary mt-3">
                    Đề được tạo lúc: {new Date(prompt.generatedAt).toLocaleString('vi-VN')}
                </div>
            )}
        </Panel>
    );
}


const PageHeader: React.FC<WritingToeicPart3PanelHeaderProps> = ({ state, uiControls, generateNewEssayQuestion }) => (
    <div className="flex flex-wrap justify-content-between align-items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-bold m-0 text-primary">
            TOEIC Writing - Part 3: Viết Bài Luận{" "}
            {state.currentSheetId && state.totalSheets > 0 && `(Bài luận ${state.currentSheetId} / ${state.totalSheets})`}
        </h1>
        <Button
            label="Tạo Đề Luận Mới"
            icon="pi pi-file-edit" // Icon cho việc soạn thảo
            onClick={generateNewEssayQuestion}
            loading={uiControls.isGenerateNewEssayQuestionButtonLoading}
            disabled={uiControls.isGenerateNewEssayQuestionButtonDisabled}
            tooltip="Tạo một câu hỏi luận mới"
            tooltipOptions={{ position: 'bottom' }}
            className="p-button-lg"
        />
    </div>
);