// Filename: src/features/toeic/part2/WritingToeicPart2Page.tsx
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';
import { Paginator, type PaginatorPageChangeEvent } from 'primereact/paginator';
import { Panel } from 'primereact/panel';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Skeleton } from 'primereact/skeleton';
import { Tag } from 'primereact/tag';
import { Navigate } from 'react-router-dom';
import { useWritingToeicPart2Logic } from '../../hooks/ToeicWritingPart2LogicHook';
import { AmINotLoggedIn } from '../../utils/helperFunction/AuthCheck';
import { EmailGradeDisplayProps, EmailPromptDisplayProps, EmailResponseFormProps, WritingToeicPart2GradeSectionProps, WritingToeicPart2InitialMessageProps, WritingToeicPart2PaginatorSectionProps, WritingToeicPart2PromptSectionProps, WritingToeicPart2ResponseSectionProps } from '../../utils/types/props';

export default function WritingToeicPart2Page() {
    const {
        state,
        generateNewEmailPrompt,
        updateUserResponse,
        submitEmailResponse,
        navigateToPart2Sheet,
        uiControls,
    } = useWritingToeicPart2Logic();
        if (AmINotLoggedIn()) return <Navigate to={"/home?login=true"} />
    
    // --- Guard chính cho việc tải dữ liệu từ DB ---
    if (uiControls.isFetchingInitialData) {
        return <WritingToeicPart2GlobalSpinner />;
    }

    // --- Header của trang ---
    const pageHeader = (
        <div className="flex flex-wrap justify-content-between align-items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold m-0 text-primary">
                TOEIC Writing - Part 2: Trả lời Email{" "}
                {state.currentSheetId && state.totalSheets > 0 && `(Bài ${state.currentSheetId} / ${state.totalSheets})`}
            </h1>
            <Button
                label="Tạo Email Mới"
                icon="pi pi-envelope"
                onClick={generateNewEmailPrompt}
                loading={uiControls.isGenerateNewEmailPromptButtonLoading}
                disabled={uiControls.isGenerateNewEmailPromptButtonDisabled}
                tooltip="Tạo một email đề bài mới"
                tooltipOptions={{ position: 'bottom' }}
                className="p-button-lg"
            />
        </div>
    );

    // --- Xử lý sự kiện thay đổi trang của Paginator ---
    const handlePageChange = (event: PaginatorPageChangeEvent) => {
        const targetSheetId = event.page + 1;
        if (targetSheetId !== state.currentSheetId) {
            navigateToPart2Sheet(targetSheetId);
        }
    };

    // Biến xác định xem có nên hiển thị phần nội dung chính (đề bài, form trả lời) không
    const shouldRenderMainContent = state.currentSheetData && !state.error;
    // Biến xác định xem có nên hiển thị form trả lời không
    const shouldRenderResponseForm = !!state.currentPrompt && state.currentSheetData && state.currentSheetData.status !== 'blank';


    return (
        <>
            {/* Toast component được giả định là đã render ở cấp App.tsx */}
            <div className="p-2 md:p-4">
                <Panel header={pageHeader} className="shadow-2 border-round-lg">
                    {/* Thông báo ban đầu hoặc lỗi nếu không có sheet data */}

                    {!shouldRenderMainContent && (
                        <WritingToeicPart2InitialMessage error={state.error} />
                    )}

                    {/* Nội dung chính của trang */}
                    {shouldRenderMainContent && (
                        <div className="animation-fadein">
                            <WritingToeicPart2PromptSection
                                prompt={state.currentPrompt}
                                isLoading={uiControls.shouldShowReceivedEmailSkeleton}
                            />

                            {shouldRenderResponseForm && (
                                <WritingToeicPart2ResponseSection
                                    userResponseText={state.userResponseText}
                                    onResponseChange={updateUserResponse}
                                    onSubmit={submitEmailResponse}
                                    isSubmitting={uiControls.isSubmitEmailButtonLoading}
                                    isFormDisabled={uiControls.isEmailResponseAreaDisabled}
                                />
                            )}

                            {uiControls.shouldRenderGradeDisplay && (
                                <WritingToeicPart2GradeSection
                                    feedback={state.currentFeedback}
                                    isLoading={uiControls.isSubmitEmailButtonLoading}
                                />
                            )}
                        </div>
                    )}

                    {/* Paginator Section */}

                    <WritingToeicPart2PaginatorSection
                        currentSheetId={state.currentSheetId}
                        totalSheets={state.totalSheets}
                        onPageChange={handlePageChange}
                        isDisabled={
                            uiControls.isGenerateNewEmailPromptButtonDisabled || // Chung cho các thao tác chính
                            uiControls.isSubmitEmailButtonLoading
                        }
                    />

                </Panel>
            </div>
        </>
    );
}


function WritingToeicPart2GlobalSpinner() {
    // Bình luận: Component hiển thị spinner toàn cục khi dữ liệu ban đầu đang được tải.
    return (
        <div className="p-4 flex flex-column justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
            <ProgressSpinner
                strokeWidth="3"
                style={{ width: '60px', height: '60px' }}
                animationDuration=".8s"
                aria-label="Đang tải dữ liệu Part 2"
            />
            <p className="mt-3 text-xl text-color-secondary">Đang tải dữ liệu trang làm bài...</p>
        </div>
    );
}


function WritingToeicPart2InitialMessage({ error }: WritingToeicPart2InitialMessageProps) {
    // Bình luận: Component hiển thị thông báo khi không có dữ liệu sheet nào
    // hoặc khi có lỗi tải dữ liệu ban đầu.
    return (
        <div className="text-center p-5">
            <i className="pi pi-inbox text-6xl text-color-secondary opacity-50 mb-3"></i>
            <p className="text-xl text-color-secondary">
                {error ? `Lỗi: ${error}` : "Sẵn sàng để tạo email đề bài mới!"}
            </p>
            {/* {error && onRetry && (
        <Button label="Thử lại tải đề" icon="pi pi-refresh" onClick={onRetry} className="p-button-secondary mt-2"/>
      )} */}
        </div>
    );
}


function WritingToeicPart2PromptSection({ prompt, isLoading }: WritingToeicPart2PromptSectionProps) {
    // Bình luận: Section hiển thị email đề bài nhận được.
    // Sử dụng EmailPromptDisplay để render nội dung chi tiết.
    return (
        <Card className="mb-4 shadow-1">
            <h2 className="text-xl font-semibold mb-3 text-color-secondary flex align-items-center">
                <i className="pi pi-envelope mr-2 text-xl" /> Email Bạn Nhận Được (Đề Bài)
            </h2>
            <EmailPromptDisplay
                prompt={prompt}
                isLoading={isLoading}
            />
        </Card>
    );
}


export function WritingToeicPart2ResponseSection({
    userResponseText,
    onResponseChange,
    onSubmit,
    isSubmitting,
    isFormDisabled,
}: WritingToeicPart2ResponseSectionProps) {
    // Bình luận: Section chứa form cho người dùng soạn và nộp email trả lời.
    return (
        <Card className="mb-4 shadow-1">
            <h2 className="text-xl font-semibold mb-3 text-color-secondary flex align-items-center">
                <i className="pi pi-pencil mr-2 text-xl" /> Soạn Email Trả Lời Của Bạn
            </h2>
            <Divider className="mb-3" /> {/* Thêm Divider cho rõ ràng */}
            <EmailResponseForm
                responseText={userResponseText}
                onResponseChange={onResponseChange}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
                isFormDisabled={isFormDisabled}
            />
        </Card>
    );
}


function WritingToeicPart2GradeSection({ feedback, isLoading }: WritingToeicPart2GradeSectionProps) {
    // Bình luận: Section hiển thị kết quả chấm điểm và nhận xét chi tiết.
    return (
        <Card className="shadow-1">
            <h2 className="text-xl font-semibold mb-3 text-color-secondary flex align-items-center">
                <i className="pi pi-check-circle mr-2 text-xl" /> Kết Quả & Nhận Xét
            </h2>
            <Divider className="mb-3" /> {/* Thêm Divider */}
            <EmailGradeDisplay
                feedback={feedback}
                isLoading={isLoading}
            />
        </Card>
    );
}


function WritingToeicPart2PaginatorSection({
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



export function EmailPromptDisplay({ prompt, isLoading }: EmailPromptDisplayProps) {
    // Bình luận: Component này hiển thị nội dung email đề bài (Part 2) mà người dùng nhận được.

    // --- Trường hợp đang tải đề bài ---
    if (isLoading) {
        return (
            <div className="p-4 border-1 surface-border border-round">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <Skeleton width="10rem" height="1.5rem" className="mb-2" />
                        <Skeleton width="15rem" height="1rem" />
                    </div>
                    <Skeleton width="6rem" height="1rem" />
                </div>
                <Skeleton width="8rem" height="1.5rem" className="mb-3" />
                <Divider />
                <Skeleton height="1rem" className="mb-2" />
                <Skeleton height="1rem" width="80%" className="mb-2" />
                <Skeleton height="1rem" className="mb-2" />
                <Skeleton height="1rem" width="90%" className="mb-2" />
                <Skeleton height="1rem" width="70%" />
            </div>
        );
    }

    // --- Trường hợp không có đề bài (sau khi tải xong) ---
    if (!prompt || !prompt.receivedEmail) {
        return (
            <div className="p-4 text-center text-color-secondary border-1 surface-border border-round surface-ground">
                <i className="pi pi-info-circle text-2xl mb-2"></i>
                <p>Chưa có nội dung đề bài email. Vui lòng tạo đề mới.</p>
            </div>
        );
    }

    const { senderName, senderEmail, subject, body, tasks, recipientName } = prompt.receivedEmail;

    // --- Hiển thị email đề bài ---
    return (
        <div className="email-prompt-container p-0">
            {/* Thông tin người gửi và chủ đề */}
            <div className="email-header mb-4 p-3 surface-100 border-round-top">
                <div className="flex justify-content-between align-items-start mb-2">
                    <div>
                        <div className="font-bold text-lg text-primary">{senderName || 'Người gửi không xác định'}</div>
                        <div className="text-sm text-color-secondary">
                            From: {senderEmail || 'Không có địa chỉ email'}
                        </div>
                    </div>
                    {prompt.generatedAt && (
                        <div className="text-sm text-color-secondary">
                            Received Date: {new Date(prompt.generatedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </div>
                    )}
                </div>
                <h3 className="text-xl font-semibold m-0">{subject || '(Không có chủ đề)'}</h3>
            </div>

            <Divider className="my-0" /> {/* Ngăn cách header và body */}

            {/* Nội dung email */}
            <div className="email-body p-3" style={{ whiteSpace: 'pre-line', lineHeight: '1.6', fontFamily: `'Segoe UI', Roboto, 'Helvetica Neue', sans-serif` }}>
                {body.replace(/\\n/g, '\n') || 'Nội dung email trống.'}
            </div>

            {/* Hiển thị các yêu cầu/tasks một cách rõ ràng (tùy chọn, vì chúng nên có trong body) */}
            {tasks && tasks.length > 0 && (
                <>
                    <Divider className="my-3" />
                    <div className="email-tasks p-3 surface-50 border-round-bottom">
                        <strong className="d-block mb-2 text-color-secondary">
                            <i className="pi pi-list mr-2" />
                            Respond to the e-mail as if you are {recipientName || "email recipient"}:
                        </strong>
                        <ul className="list-disc pl-5 m-0">
                            {tasks.map((task, index) => (
                                <li key={index} className="mb-1">{task}</li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}

function EmailResponseForm({
    responseText,
    onResponseChange,
    onSubmit,
    isSubmitting,
    isFormDisabled,
}: EmailResponseFormProps) {
    // Bình luận: Component này chứa InputTextarea cho người dùng soạn email
    // và nút "Nộp bài".

    const wordCount = responseText.trim().split(/\s+/).filter(Boolean).length;
    const suggestedWordCountMin = 100; // Số từ gợi ý tối thiểu
    const suggestedWordCountMax = 150; // Số từ gợi ý tối đa

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onResponseChange(e.target.value);
    };

    const handleSubmitClick = () => {
        // Có thể thêm kiểm tra logic ở đây trước khi gọi onSubmit nếu cần,
        // ví dụ: kiểm tra số từ tối thiểu, mặc dù nút submit đã có logic disabled riêng.
        onSubmit();
    };

    // Điều kiện để vô hiệu hóa nút nộp bài
    const isSubmitButtonActuallyDisabled =
        isFormDisabled || // Nếu toàn bộ form bị vô hiệu hóa
        isSubmitting ||    // Hoặc đang trong quá trình nộp
        responseText.trim().length === 0; // Hoặc chưa nhập gì

    return (
        <div className="p-fluid email-response-form">
            {/* Khu vực nhập liệu */}
            <InputTextarea
                value={responseText}
                onChange={handleInputChange}
                rows={10} // Số dòng mặc định, có thể tăng nếu cần
                placeholder="Soạn email trả lời của bạn tại đây..."
                className="mb-3 text-lg" // Tăng kích thước chữ một chút
                disabled={isFormDisabled || isSubmitting} // Vô hiệu hóa khi form bị disabled hoặc đang nộp
                autoResize // Cho phép tự động thay đổi chiều cao khi nhập liệu
                style={{ lineHeight: '1.6' }}
            />

            {/* Hiển thị số từ và gợi ý */}
            <div className="flex justify-content-between align-items-center mb-3">
                <small className="text-color-secondary">
                    Số từ hiện tại: {wordCount} (Gợi ý: {suggestedWordCountMin}-{suggestedWordCountMax} từ)
                </small>
                {wordCount > suggestedWordCountMax && (
                    <Message severity="warn" text={`Bạn đã vượt quá ${suggestedWordCountMax} từ.`} className="p-0 m-0 text-sm" style={{ background: 'transparent', borderWidth: '0' }} />
                )}
            </div>


            {/* Nút Nộp Bài */}
            <Button
                label="Gửi Email Trả Lời"
                icon="pi pi-send"
                onClick={handleSubmitClick}
                loading={isSubmitting}
                disabled={isSubmitButtonActuallyDisabled}
                className="p-button-primary w-full md:w-auto p-button-lg" // Nút lớn hơn
                tooltip="Hoàn tất và gửi email trả lời của bạn để được chấm điểm"
                tooltipOptions={{ position: 'top' }}
            />
        </div>
    );
}

/**
 * @function getEmailScoreSeverity
 * @description Xác định mức độ (severity) của Tag điểm dựa trên điểm số.
 * @param {number} score - Điểm số.
 * @param {number} maxScore - Điểm tối đa (ví dụ: 4 hoặc 5 cho Part 2).
 * @returns {"success" | "info" | "warning" | "danger"}
 * @comment Bình luận bằng tiếng Việt: Hàm nhỏ giúp xác định màu sắc cho Tag hiển thị điểm.
 */
function getEmailScoreSeverity(score: number, maxScore: number = 4): "success" | "info" | "warning" | "danger" {
    if (score >= maxScore * 0.8) return "success"; // Ví dụ: 4/4 hoặc 4/5, 5/5
    if (score >= maxScore * 0.6) return "info";    // Ví dụ: 3/4 hoặc 3/5
    if (score >= maxScore * 0.4) return "warning"; // Ví dụ: 2/4 hoặc 2/5
    return "danger"; // Ví dụ: 0/4, 1/4 hoặc 0/5, 1/5
}

export function EmailGradeDisplay({ feedback, isLoading }: EmailGradeDisplayProps) {
    // Bình luận: Component này hiển thị kết quả chấm điểm chi tiết cho email Part 2.

    // --- Trường hợp đang tải kết quả chấm điểm ---
    if (isLoading) {
        return (
            <Card title="Đang xử lý và chấm điểm email của bạn..." className="mt-4">
                <Skeleton width="40%" height="2.5rem" className="mb-3" /> {/* Score Tag */}
                <Skeleton height="1.5rem" className="mb-2" /> {/* Feedback title */}
                <Skeleton height="1rem" className="mb-3" />   {/* Feedback text */}
                <Skeleton height="2rem" width="60%" />                  {/* Corrections Accordion header */}
            </Card>
        );
    }

    // --- Trường hợp không có feedback (sau khi tải xong) ---
    if (!feedback) {
        return (
            <div className="mt-4 p-4 text-center text-color-secondary border-1 surface-border border-round surface-ground">
                <i className="pi pi-info-circle text-2xl mb-2"></i>
                <p>Chưa có kết quả chấm điểm cho email này.</p>
            </div>
        );
    }

    const maxScorePart2 = 4; // Hoặc 5, tùy theo thang điểm bạn quyết định cho Part 2
    const scoreTagSeverity = getEmailScoreSeverity(feedback.score, maxScorePart2);

    // --- Tiêu đề Card bao gồm điểm số ---
    const cardTitle = (
        <div className="flex align-items-center flex-wrap gap-2">
            <span className="font-bold text-xl">Kết quả và Nhận xét chi tiết</span>
            <Tag value={`Điểm: ${feedback.score}/${maxScorePart2}`} severity={scoreTagSeverity} className="text-lg px-3 py-1" rounded />
        </div>
    );

    // --- Hiển thị thông tin điểm và feedback ---
    return (
        <Card title={cardTitle} className="mt-4 bg-surface-50 shadow-1">
            {/* Nhận xét tổng quan (bằng tiếng Việt) */}
            <div className="mb-4">
                <h4 className="font-semibold text-lg mt-0 mb-2 text-primary">
                    <i className="pi pi-comment mr-2" />Nhận xét chung:
                </h4>
                <p className="text-lg line-height-3 m-0" style={{ whiteSpace: 'pre-line' }}>
                    {feedback.feedbackText || "Không có nhận xét chi tiết."}
                </p>
            </div>

            {/* Các lỗi cụ thể và gợi ý sửa (nếu có) */}
            {feedback.corrections && feedback.corrections.length > 0 && (
                <>
                    <Divider />
                    <div className="mt-4">
                        <Accordion activeIndex={0}>
                            <AccordionTab
                                header={
                                    <span className="font-semibold text-lg flex align-items-center">
                                        <i className="pi pi-exclamation-triangle mr-2 text-orange-500" /> Gợi ý sửa lỗi & Cải thiện ({feedback.corrections.length})
                                    </span>
                                }
                            >
                                {feedback.corrections.map((correction, index) => (
                                    <div key={index} className="mb-3 p-3 border-1 border-round surface-border surface-0 hover:surface-100 transition-colors transition-duration-150">
                                        {correction.errorType && (
                                            <Tag value={correction.errorType} severity="contrast" className="mb-2 text-sm p-tag-rounded" style={{ backgroundColor: 'var(--primary-color)', color: 'var(--primary-color-text)' }} />
                                        )}
                                        <p className="mb-1">
                                            <strong className="text-red-600">Nội dung gốc:</strong>{' '}
                                            <span className="text-red-500" style={{ fontStyle: 'italic' }}>{correction.original}</span>
                                        </p>
                                        <p className="mb-1">
                                            <strong className="text-green-600">Gợi ý sửa:</strong>{' '}
                                            <span className="text-green-500" style={{ fontWeight: 'bold' }}>{correction.suggestion}</span>
                                        </p>
                                        {correction.explanation && (
                                            <p className="text-sm text-color-secondary m-0 line-height-3" style={{ whiteSpace: 'pre-line' }}>
                                                <strong className="text-bluegray-600">Giải thích (Tiếng Việt):</strong> {correction.explanation}
                                            </p>
                                        )}
                                        {index < feedback.corrections!.length - 1 && <Divider className="my-3" />}
                                    </div>
                                ))}
                            </AccordionTab>
                        </Accordion>
                    </div>
                </>
            )}
        </Card>
    );
}