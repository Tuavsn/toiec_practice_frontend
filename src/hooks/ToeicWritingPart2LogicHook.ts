import { Dispatch, MutableRefObject, useCallback, useEffect, useReducer, useRef } from "react";
import { generateEmailPromptForPart2, gradeEmailResponseForPart2 } from "../api/api";
import { useToast } from "../context/ToastProvider";
import { addPart2Sheet, getLastestPart2TopicFromDB, getLatestPart2SheetById, getLatestPart2SheetByTimestamp, getPart2SheetById, getPart2SheetsCount, initializeDB, updatePart2Sheet } from "../database/indexdb";
import { WritingToeicPart2Action } from "../utils/types/action";
import { initialToeicWritingPart2State } from "../utils/types/emptyValue";
import { WritingToeicPart2ApiPromptData, WritingToeicPart2GradedFeedback, WritingToeicPart2Prompt, WritingToeicPart2SheetData, WritingToeicPart2State } from "../utils/types/type";

/**
 * @function deriveStateFromPart2SheetData
 * @description Suy diễn các phần của trạng thái UI từ WritingToeicPart2SheetData.
 * @param {WritingToeicPart2SheetData | null} sheetData - Dữ liệu của sheet hiện tại.
 * @returns {Partial<Pick<WritingToeicPart2State, 'currentPrompt' | 'userResponseText' | 'currentFeedback' | 'currentSheetData'>>}
 * @comment Bình luận bằng tiếng Việt: Hàm này chuyển đổi dữ liệu thô từ DB thành các đối tượng mà UI cần.
 */
function deriveStateFromPart2SheetData(sheetData: WritingToeicPart2SheetData | null): Partial<Pick<WritingToeicPart2State, 'currentPrompt' | 'userResponseText' | 'currentFeedback' | 'currentSheetData'>> {
    if (!sheetData) {
        return { currentPrompt: null, userResponseText: '', currentFeedback: null, currentSheetData: null };
    }
    const prompt: WritingToeicPart2Prompt | null = sheetData.promptReceivedEmailBody && sheetData.promptRecipientPersonaDescription
        ? {
            id: sheetData.id.toString(),
            part: 2,
            receivedEmail: {
                senderName: sheetData.promptReceivedEmailSenderName || 'N/A',
                senderEmail: sheetData.promptReceivedEmailSenderEmail || 'N/A',
                recipientName: sheetData.promptRecipientName || '',
                subject: sheetData.promptReceivedEmailSubject || 'N/A',
                body: sheetData.promptReceivedEmailBody,
                tasks: sheetData.promptReceivedEmailTasks || [],
            },
            recipientPersonaDescription: sheetData.promptRecipientPersonaDescription,

            // Construct the full instruction text dynamically or use a stored one
            // For dynamic construction:
            instructionText: sheetData.promptInstructionText || `Đọc email dưới đây. Trả lời email với vai trò là ${sheetData.promptRecipientPersonaDescription}. Trong email của bạn, hãy giải quyết tất cả các điểm được đề cập và viết một cách rõ ràng, chuyên nghiệp.`,
            generatedAt: sheetData.promptGeneratedAt || sheetData.createdAt,
        }
        : null;

    const feedback: WritingToeicPart2GradedFeedback | null = sheetData.gradeScore !== undefined && sheetData.gradeScore !== null
        ? {
            id: sheetData.id.toString(),
            answerId: sheetData.id.toString(),
            score: sheetData.gradeScore,
            feedbackText: sheetData.gradeFeedbackText || '',
            corrections: sheetData.gradeCorrections || [],
            gradedAt: sheetData.gradeGradedAt || sheetData.createdAt,
        }
        : null;

    return {
        currentPrompt: prompt,
        userResponseText: sheetData.userAnswerText || '',
        currentFeedback: feedback,
        currentSheetData: sheetData,
    };
}

//------------------------------------------------------
// Mục: Reducer Function cho Part 2
//------------------------------------------------------
function writingToeicPart2Reducer(state: WritingToeicPart2State, action: WritingToeicPart2Action): WritingToeicPart2State {
    switch (action.type) {
        case 'PART2_DB_INIT_START':
            return { ...state, isDbLoading: true, error: null };
        case 'PART2_DB_INIT_SUCCESS': {
            const derived = deriveStateFromPart2SheetData(action.payload.latestSheet);
            return {
                ...state, ...derived,
                currentSheetId: action.payload.latestSheet?.id || null,
                currentSheetData: action.payload.latestSheet || null,
                totalSheets: action.payload.totalSheets,
                isDbLoading: false, isLoadingPrompt: false, isLoadingGrade: false, error: null,
            };
        }
        case 'PART2_LOAD_SHEET_START':
            return { ...state, isDbLoading: true, isLoadingPrompt: false, isLoadingGrade: false, error: null };
        case 'PART2_LOAD_SHEET_SUCCESS': {
            const derived = deriveStateFromPart2SheetData(action.payload.sheetData);
            return {
                ...state, ...derived,
                currentSheetId: action.payload.sheetData.id,
                currentSheetData: action.payload.sheetData,
                totalSheets: action.payload.totalSheets, // Cập nhật tổng số sheet
                isDbLoading: false, isLoadingPrompt: false, isLoadingGrade: false, error: null,
            };
        }
        case 'PART2_DB_OPERATION_ERROR':
            return { ...state, isDbLoading: false, isLoadingPrompt: false, isLoadingGrade: false, error: action.payload };

        case 'PART2_CREATE_SHEET_SUCCESS': { // Dành cho sheet trắng đầu tiên khi DB trống
            const derived = deriveStateFromPart2SheetData(action.payload.newSheet);
            return {
                ...state, ...derived,
                currentSheetId: action.payload.newSheet.id,
                currentSheetData: action.payload.newSheet,
                totalSheets: action.payload.totalSheets,
                isDbLoading: false, isLoadingPrompt: false, isLoadingGrade: false, error: null,
            };
        }
        case 'PART2_INTERNAL_NEW_SHEET_READY': { // Khi generateNewPrompt tạo sheet trắng mới
            const derived = deriveStateFromPart2SheetData(action.payload.newActiveSheet);
            return {
                ...state, ...derived, // Sẽ xóa currentPrompt, userResponseText, currentFeedback
                currentSheetId: action.payload.newActiveSheet.id,
                currentSheetData: action.payload.newActiveSheet,
                totalSheets: action.payload.totalSheets,
                error: null, // Không chạm vào isLoadingPrompt, isDbLoading
            };
        }
        case 'PART2_UPDATE_SHEET_IN_STATE': {
            if (!state.currentSheetData || !action.payload.id || state.currentSheetData.id !== action.payload.id) return state;
            const updatedSheetData = { ...state.currentSheetData, ...action.payload } as WritingToeicPart2SheetData;
            const derivedAfterUpdate = deriveStateFromPart2SheetData(updatedSheetData);
            return { ...state, ...derivedAfterUpdate, currentSheetData: updatedSheetData };
        }
        case 'PART2_SET_CURRENT_SHEET_ID':
            return { ...state, currentSheetId: action.payload };
        case 'PART2_SET_TOTAL_SHEETS':
            return { ...state, totalSheets: action.payload };

        case 'PART2_GENERATE_PROMPT_START':
            return {
                ...state, isLoadingPrompt: true, isLoadingGrade: false, error: null,
                // Xóa câu trả lời/feedback cũ nếu đang tạo đề cho sheet hiện tại và nó là blank/prompt_generated
                userResponseText: (state.currentSheetData?.status === 'blank' || state.currentSheetData?.status === 'prompt_generated') ? '' : state.userResponseText,
                currentFeedback: (state.currentSheetData?.status === 'blank' || state.currentSheetData?.status === 'prompt_generated') ? null : state.currentFeedback,
                currentPrompt: null, // Xóa đề bài cũ trong khi đang tạo đề mới
            };
        case 'PART2_GENERATE_PROMPT_SUCCESS': { // payload chứa { id, receivedEmail, instructionText, generatedAt, part }
            if (!state.currentSheetData || state.currentSheetId !== parseInt(action.payload.id, 10)) {
                console.warn("PART2_GENERATE_PROMPT_SUCCESS: ID không khớp hoặc không có sheet hiện tại.");
                return state;
            }
            const promptUpdateForSheet: Partial<WritingToeicPart2SheetData> = {
                promptReceivedEmailSenderName: action.payload.receivedEmail.senderName,
                promptReceivedEmailSenderEmail: action.payload.receivedEmail.senderEmail,
                promptReceivedEmailSubject: action.payload.receivedEmail.subject,
                promptReceivedEmailBody: action.payload.receivedEmail.body,
                promptReceivedEmailTasks: action.payload.receivedEmail.tasks,
                promptInstructionText: action.payload.instructionText,
                promptGeneratedAt: action.payload.generatedAt,
                status: 'prompt_generated',
            };
            const sheetWithNewPrompt = { ...state.currentSheetData, ...promptUpdateForSheet } as WritingToeicPart2SheetData;
            const derivedWithNewPrompt = deriveStateFromPart2SheetData(sheetWithNewPrompt);
            return {
                ...state, ...derivedWithNewPrompt,
                isLoadingPrompt: false, error: null,
            };
        }
        case 'PART2_GENERATE_PROMPT_FAILURE':
            return { ...state, isLoadingPrompt: false, error: action.payload, currentPrompt: null };

        case 'PART2_UPDATE_USER_RESPONSE':
            return { ...state, userResponseText: action.payload };
        case 'PART2_SUBMIT_RESPONSE_START':
            return { ...state, isLoadingGrade: true, error: null, currentFeedback: null };
        case 'PART2_SUBMIT_RESPONSE_SUCCESS': { // payload là WritingToeicPart2GradedFeedback
            if (!state.currentSheetData || state.currentSheetId !== parseInt(action.payload.answerId, 10)) {
                console.warn("PART2_SUBMIT_RESPONSE_SUCCESS: ID không khớp hoặc không có sheet hiện tại.");
                return state;
            }
            const gradeUpdateForSheet: Partial<WritingToeicPart2SheetData> = {
                gradeScore: action.payload.score,
                gradeFeedbackText: action.payload.feedbackText,
                gradeCorrections: action.payload.corrections,
                gradeGradedAt: action.payload.gradedAt,
                status: 'graded',
            };
            const sheetWithGrade = { ...state.currentSheetData, ...gradeUpdateForSheet } as WritingToeicPart2SheetData;
            const derivedWithGrade = deriveStateFromPart2SheetData(sheetWithGrade);
            return {
                ...state, ...derivedWithGrade,
                isLoadingGrade: false, error: null,
            };
        }
        case 'PART2_SUBMIT_RESPONSE_FAILURE':
            return { ...state, isLoadingGrade: false, error: action.payload };

        case 'PART2_CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
}

//------------------------------------------------------
// Mục: Custom Hook - useWritingToeicPart2Logic
//------------------------------------------------------
export function useWritingToeicPart2Logic() {
    const [state, dispatch] = useReducer(writingToeicPart2Reducer, initialToeicWritingPart2State);
    const generatePromptAbortControllerRef = useRef<AbortController | null>(null);



    useBackgroundTask(generatePromptAbortControllerRef, state, dispatch); // Hook cho các tác vụ nền như khởi tạo DB, hiển thị toast, và tự động tạo đề bài

    // --- Exposed Callbacks ---
    const generateNewEmailPrompt = useCallback(async () => {
        await _internalGenerateNewEmailPrompt(generatePromptAbortControllerRef, state, dispatch);
    }, [state, dispatch, _internalGenerateNewEmailPrompt]); // _internalGenerateNewEmailPrompt nên được memoized nếu nó không thay đổi quá thường xuyên

    const submitEmailResponse = useCallback(async () => {
        await _internalSubmitPart2Response(generatePromptAbortControllerRef, state, dispatch);
    }, [state, dispatch, _internalSubmitPart2Response]);

    const navigateToPart2Sheet = async (sheetIdToLoad: number) => _navigateToPart2Sheet(sheetIdToLoad, state, dispatch)


    const updateUserResponse = useCallback((text: string) => {
        dispatch({ type: 'PART2_UPDATE_USER_RESPONSE', payload: text });
    }, [dispatch]);

    // --- Derived UI Control States ---
    const isLoadingEmailPrompt = state.isLoadingPrompt;
    const isGradingEmail = state.isLoadingGrade;
    const uiControls = {
        isFetchingInitialData: state.isDbLoading,
        isGenerateNewEmailPromptButtonLoading: isLoadingEmailPrompt,
        isGenerateNewEmailPromptButtonDisabled: state.isDbLoading || isLoadingEmailPrompt || isGradingEmail,
        shouldShowReceivedEmailSkeleton: isLoadingEmailPrompt && !state.currentPrompt,
        isEmailResponseAreaDisabled: state.isDbLoading || isLoadingEmailPrompt || isGradingEmail || !state.currentPrompt || state.currentSheetData?.status === 'blank',
        isSubmitEmailButtonLoading: isGradingEmail,
        isSubmitEmailButtonDisabled: !(!state.isDbLoading && !isLoadingEmailPrompt && !isGradingEmail && !!state.currentPrompt && state.userResponseText.trim() !== "" && state.currentSheetData?.status !== 'blank'),
        shouldRenderGradeDisplay: (!!state.currentFeedback || isGradingEmail) && !!state.currentSheetData && (state.currentSheetData.status === 'graded' || state.currentSheetData.status === 'answered'),
    };

    return {
        state,
        generateNewEmailPrompt,
        updateUserResponse,
        submitEmailResponse,
        navigateToPart2Sheet,
        uiControls,
    };
}


function useBackgroundTask(_generatePromptAbortControllerRef: MutableRefObject<AbortController | null>, state: WritingToeicPart2State, dispatch: Dispatch<WritingToeicPart2Action>) {
    const { toast } = useToast(); // Sử dụng hook useToast ở đây
    // --- Các useEffects cho DB init, toasts, và auto-generate prompt ---
    useEffect(() => { // Khởi tạo DB và tải sheet mới nhất
        let isMounted = true;
        _initDatabase(isMounted, dispatch);
        return () => { isMounted = false; };
    }, []);

    useEffect(() => { // Hiển thị toast lỗi
        if (state.error) {
            toast.current?.show({ severity: "error", summary: "Lỗi Part 2", detail: state.error, life: 4000 });
            dispatch({ type: 'PART2_CLEAR_ERROR' });
        }
    }, [state.error, toast, dispatch]);

    useEffect(() => { // Toast khi chấm bài thành công
        if (state.currentFeedback && state.currentSheetData?.status === 'graded' && !state.isLoadingGrade && !state.error) {
            const feedbackToastKey = `part2_feedbackToastShown_${state.currentSheetId}_${state.currentFeedback.gradedAt}`;
            if (sessionStorage.getItem(feedbackToastKey) !== 'true') {
                toast.current?.show({ severity: "success", summary: "Chấm email thành công!", detail: `Điểm của bạn: ${state.currentFeedback.score}`, life: 3000 });
                sessionStorage.setItem(feedbackToastKey, 'true');
            }
        }
    }, [state.currentFeedback, state.currentSheetData, state.isLoadingGrade, state.error, toast, state.currentSheetId]);

}

async function _initDatabase(isMounted: boolean, dispatch: Dispatch<WritingToeicPart2Action>) {
    dispatch({ type: 'PART2_DB_INIT_START' });
    try {
        await initializeDB(); // Đảm bảo DB (và store Part 2) đã được khởi tạo/nâng cấp
        let latestSheet = await getLatestPart2SheetByTimestamp();
        let totalSheetsCount = await getPart2SheetsCount();
        if (!latestSheet && totalSheetsCount === 0) {
            const newSheetId = await addPart2Sheet({ status: 'blank', createdAt: Date.now() });
            latestSheet = await getPart2SheetById(newSheetId);
            totalSheetsCount = 1;
            if (latestSheet && isMounted) {
                dispatch({ type: 'PART2_CREATE_SHEET_SUCCESS', payload: { newSheet: latestSheet, totalSheets: totalSheetsCount } });
            }
        } else if (isMounted) {
            dispatch({ type: 'PART2_DB_INIT_SUCCESS', payload: { latestSheet: latestSheet || null, totalSheets: totalSheetsCount } });
        }
    } catch (err) {
        if (isMounted) dispatch({ type: 'PART2_DB_OPERATION_ERROR', payload: (err as Error).message || 'Lỗi khởi tạo CSDL Part 2.' });
    }
}

async function _internalGenerateNewEmailPrompt(generatePromptAbortControllerRef: MutableRefObject<AbortController | null>, currentState: WritingToeicPart2State, dispatchFn: Dispatch<WritingToeicPart2Action>) {
    // debugger
    if (generatePromptAbortControllerRef.current) {
        generatePromptAbortControllerRef.current.abort();
        console.log("Aborted previous prompt generation request.");
    }
    // Create a new AbortController for this request
    const controller = new AbortController();
    generatePromptAbortControllerRef.current = controller;

    dispatchFn({ type: 'PART2_GENERATE_PROMPT_START' });
    let targetSheetId = currentState.currentSheetId;
    let currentTotalSheets = currentState.totalSheets;
    try {
        const latestSheetInDb = await getLatestPart2SheetById();
        let sheetToOperateOn: WritingToeicPart2SheetData;
        const alreadyDoneEmailTopicList = await getLastestPart2TopicFromDB();
        console.log("Get already done topic is done");
        if (latestSheetInDb && latestSheetInDb.status === 'blank') {
            targetSheetId = latestSheetInDb.id;
            sheetToOperateOn = latestSheetInDb;
            if (currentState.currentSheetId !== targetSheetId) {
                dispatchFn({ type: 'PART2_LOAD_SHEET_SUCCESS', payload: { sheetData: latestSheetInDb, totalSheets: currentTotalSheets } });
            }
        } else {
            const newSheetIdFromDb = await addPart2Sheet({ status: 'blank', createdAt: Date.now() });
            targetSheetId = newSheetIdFromDb;
            const newBlankSheet = await getPart2SheetById(newSheetIdFromDb);
            currentTotalSheets = await getPart2SheetsCount();
            if (!newBlankSheet) throw new Error("Không thể tạo sheet trắng mới cho Part 2.");
            sheetToOperateOn = newBlankSheet;
            dispatchFn({ type: 'PART2_INTERNAL_NEW_SHEET_READY', payload: { newActiveSheet: sheetToOperateOn, totalSheets: currentTotalSheets } });
        }
        if (!targetSheetId) throw new Error("Không thể xác định target sheet ID cho Part 2.");

        const generatedEmailData: WritingToeicPart2ApiPromptData | null = await generateEmailPromptForPart2(alreadyDoneEmailTopicList, controller.signal,); // Trả về WritingToeicPart2ApiReceivedEmail
        if (!generatedEmailData) throw new Error("Không thể tạo đề bài email từ AI.");

        const instructionTextForUser = `Đọc email dưới đây. Trả lời email với vai trò là ${generatedEmailData.recipientPersonaDescription}. Trong email của bạn, hãy giải quyết tất cả các điểm được đề cập và viết một cách rõ ràng, chuyên nghiệp.`;

        const promptUpdateForSheet: Partial<WritingToeicPart2SheetData> = {
            promptReceivedEmailSenderName: generatedEmailData.senderName,
            promptReceivedEmailSenderEmail: generatedEmailData.senderEmail,
            promptRecipientName: generatedEmailData.recipientName,
            promptReceivedEmailSubject: generatedEmailData.subject,
            promptReceivedEmailBody: generatedEmailData.body,
            promptReceivedEmailTasks: generatedEmailData.tasks,
            promptInstructionText: instructionTextForUser,
            promptGeneratedAt: Date.now(),
            status: 'prompt_generated',
            userAnswerText: '', // Xóa câu trả lời cũ
            gradeScore: undefined, gradeFeedbackText: undefined, gradeCorrections: undefined, gradeGradedAt: undefined,
            promptRecipientPersonaDescription: generatedEmailData.recipientPersonaDescription,
        };

        const sheetBeforePromptUpdate = await getPart2SheetById(targetSheetId);
        if (!sheetBeforePromptUpdate) throw new Error(`Sheet Part 2 ID ${targetSheetId} không tìm thấy trước khi cập nhật đề bài.`);

        await updatePart2Sheet({ ...sheetBeforePromptUpdate, ...promptUpdateForSheet } as WritingToeicPart2SheetData);
        const finalUpdatedSheet = await getPart2SheetById(targetSheetId);
        if (finalUpdatedSheet) {
            dispatchFn({ type: 'PART2_LOAD_SHEET_SUCCESS', payload: { sheetData: finalUpdatedSheet, totalSheets: currentTotalSheets } });
        } else { throw new Error("Không thể tải sheet Part 2 sau khi cập nhật đề bài."); }
        generatePromptAbortControllerRef.current = null;

    } catch (err) {
        generatePromptAbortControllerRef.current = null;
        if ((err as Error).name !== 'AbortError') {
            dispatchFn({ type: 'PART2_GENERATE_PROMPT_FAILURE', payload: (err as Error).message || 'Lỗi tạo đề bài email Part 2.' });
        }
    }
}
async function _navigateToPart2Sheet(sheetIdToLoad: number, state: WritingToeicPart2State, dispatch: Dispatch<WritingToeicPart2Action>) {

    if (sheetIdToLoad === state.currentSheetId && state.currentSheetData?.id === sheetIdToLoad && state.currentSheetData.status !== 'blank') return;
    dispatch({ type: 'PART2_LOAD_SHEET_START', payload: { sheetId: sheetIdToLoad } });
    try {
        const sheetFromDb = await getPart2SheetById(sheetIdToLoad);
        const currentTotalSheetsInDb = await getPart2SheetsCount();
        if (!sheetFromDb) {
            dispatch({ type: 'PART2_DB_OPERATION_ERROR', payload: `Không tìm thấy bài làm Part 2 số ${sheetIdToLoad}.` });
            const latestSheetFallback = await getLatestPart2SheetByTimestamp();
            if (latestSheetFallback) {
                dispatch({ type: 'PART2_LOAD_SHEET_SUCCESS', payload: { sheetData: latestSheetFallback, totalSheets: currentTotalSheetsInDb } });
            } else {
                dispatch({ type: 'PART2_DB_INIT_SUCCESS', payload: { latestSheet: null, totalSheets: 0 } });
            }
            return;
        }
        dispatch({ type: 'PART2_LOAD_SHEET_SUCCESS', payload: { sheetData: sheetFromDb, totalSheets: currentTotalSheetsInDb } });
    } catch (err) {
        dispatch({ type: 'PART2_DB_OPERATION_ERROR', payload: (err as Error).message || `Lỗi tải bài làm Part 2 số ${sheetIdToLoad}.` });
    }
}


async function _internalSubmitPart2Response(generatePromptAbortControllerRef: MutableRefObject<AbortController | null>, currentState: WritingToeicPart2State, dispatchFn: Dispatch<WritingToeicPart2Action>) {
    if (!currentState.currentSheetId || !currentState.currentSheetData || !currentState.currentPrompt) {
        dispatchFn({ type: 'PART2_SUBMIT_RESPONSE_FAILURE', payload: 'Thông tin đề bài Part 2 không đủ.' }); return;
    }
    if (currentState.userResponseText.trim().length === 0) {
        dispatchFn({ type: 'PART2_SUBMIT_RESPONSE_FAILURE', payload: 'Vui lòng viết email trả lời.' }); return;
    }
    if (generatePromptAbortControllerRef.current) {
        generatePromptAbortControllerRef.current.abort();
        console.log("Aborted previous prompt generation request.");
    }

    // Create a new AbortController for this request
    const controller = new AbortController();
    generatePromptAbortControllerRef.current = controller;
    dispatchFn({ type: "PART2_SUBMIT_RESPONSE_START" });
    try {
        let sheetToUpdate = await getPart2SheetById(currentState.currentSheetId!);
        if (!sheetToUpdate) throw new Error("Không tìm thấy sheet Part 2 để cập nhật câu trả lời.");
        const answeredSheetUpdate: Partial<WritingToeicPart2SheetData> = {
            userAnswerText: currentState.userResponseText, userAnswerSubmittedAt: Date.now(), status: 'answered',
        };
        sheetToUpdate = { ...sheetToUpdate, ...answeredSheetUpdate };
        await updatePart2Sheet(sheetToUpdate as WritingToeicPart2SheetData);
        // dispatchFn({ type: 'PART2_UPDATE_SHEET_IN_STATE', payload: { ...answeredSheetUpdate, id: currentState.currentSheetId! } });

        const feedback = await gradeEmailResponseForPart2(controller.signal,
            currentState.currentSheetId!, currentState.userResponseText, currentState.currentPrompt.receivedEmail
        );
        if (!feedback) throw new Error("Không nhận được phản hồi chấm điểm email từ AI.");

        const sheetBeforeGradeSave = await getPart2SheetById(currentState.currentSheetId!);
        if (!sheetBeforeGradeSave) throw new Error("Không lấy được sheet Part 2 trước khi lưu điểm.");

        const gradedSheetUpdate: Partial<WritingToeicPart2SheetData> = {
            gradeScore: feedback.score, gradeFeedbackText: feedback.feedbackText,
            gradeCorrections: feedback.corrections, gradeGradedAt: feedback.gradedAt, status: 'graded',
        };
        await updatePart2Sheet({ ...sheetBeforeGradeSave, ...gradedSheetUpdate } as WritingToeicPart2SheetData);
        const finalGradedSheet = await getPart2SheetById(currentState.currentSheetId!);
        if (finalGradedSheet) {
            dispatchFn({ type: 'PART2_LOAD_SHEET_SUCCESS', payload: { sheetData: finalGradedSheet, totalSheets: currentState.totalSheets } });
        } else { throw new Error("Không tải được sheet Part 2 sau khi cập nhật điểm."); }

        const latestSheetInDb = await getLatestPart2SheetById();
        if (latestSheetInDb && currentState.currentSheetId === latestSheetInDb.id && finalGradedSheet?.status === 'graded') {
            await addPart2Sheet({ status: 'blank', createdAt: Date.now() });
            const newTotalSheets = await getPart2SheetsCount();
            dispatchFn({ type: 'PART2_SET_TOTAL_SHEETS', payload: newTotalSheets });
        }
        generatePromptAbortControllerRef.current = null;

    } catch (err) {
        generatePromptAbortControllerRef.current = null;
        if ((err as Error).name !== 'AbortError') {
            dispatchFn({ type: "PART2_SUBMIT_RESPONSE_FAILURE", payload: (err as Error).message || "Lỗi không xác định khi nộp email Part 2." });
        }
    }
}
