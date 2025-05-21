//------------------------------------------------------
// Mục: Hàm suy diễn trạng thái từ SheetData cho Part 3
//------------------------------------------------------

import { Dispatch, MutableRefObject, useCallback, useEffect, useReducer, useRef } from "react";
import { generateEssayQuestionForPart3, gradeEssayForPart3 } from "../api/api";
import { useToast } from "../context/ToastProvider";
import { addPart3Sheet, getLatestPart3SheetById, getLatestPart3SheetByTimestamp, getPart3SheetById, getPart3SheetsCount, getSomeHistoryTopicsForPart3, initializeDB, updatePart3Sheet } from "../database/indexdb";
import { WritingToeicPart3Action } from "../utils/types/action";
import { initialToeicWritingPart3State } from "../utils/types/emptyValue";
import { WritingToeicPart3State } from "../utils/types/state";
import { WritingToeicPart3GradedFeedback, WritingToeicPart3Prompt, WritingToeicPart3SheetData } from "../utils/types/type";
const DEFAULT_PART3_DIRECTIONS = "You will write an essay that responds to an opinion question. You will need to state your opinion, explain it, and support it. Your essay should be at least 300 words. You must plan, write, and revise your essay in 30 minutes.";

/**
 * @function deriveStateFromPart3SheetData
 * @description Suy diễn các phần của trạng thái UI từ WritingToeicPart3SheetData.
 * @param {WritingToeicPart3SheetData | null} sheetData - Dữ liệu của sheet hiện tại.
 * @returns {Partial<Pick<WritingToeicPart3State, 'currentPrompt' | 'userEssayText' | 'currentFeedback' | 'currentSheetData'>>}
 * @comment Bình luận bằng tiếng Việt: Chuyển đổi dữ liệu từ DB thành các đối tượng UI cần.
 */
function deriveStateFromPart3SheetData(sheetData: WritingToeicPart3SheetData | null): Partial<Pick<WritingToeicPart3State, 'currentPrompt' | 'userEssayText' | 'currentFeedback' | 'currentSheetData'>> {
    if (!sheetData) {
        return { currentPrompt: null, userEssayText: '', currentFeedback: null, currentSheetData: null };
    }

    const prompt: WritingToeicPart3Prompt | null = sheetData.essayQuestion
        ? {
            id: sheetData.id.toString(),
            part: 3,
            essayQuestion: sheetData.essayQuestion,
            directions: sheetData.promptDirections || DEFAULT_PART3_DIRECTIONS,
            generatedAt: sheetData.promptGeneratedAt || sheetData.createdAt,
        }
        : null;

    const feedback: WritingToeicPart3GradedFeedback | null = sheetData.gradeScore !== undefined && sheetData.gradeScore !== null
        ? {
            id: sheetData.id.toString(),
            answerId: sheetData.id.toString(), // Bài luận được lưu trong cùng sheet
            score: sheetData.gradeScore,
            overallFeedback: sheetData.gradeOverallFeedback || '',
            detailedFeedback: sheetData.gradeDetailedFeedback || {
                opinionSupportFeedback: '',
                organizationFeedback: '',
                grammarVocabularyFeedback: '',
            },
            keyImprovementAreas: sheetData.gradeKeyImprovementAreas || [],
            gradedAt: sheetData.gradeGradedAt || sheetData.createdAt,
        }
        : null;

    return {
        currentPrompt: prompt,
        userEssayText: sheetData.userEssayText || '',
        currentFeedback: feedback,
        currentSheetData: sheetData,
    };
}

//------------------------------------------------------
// Mục: Reducer Function cho Part 3
//------------------------------------------------------
function writingToeicPart3Reducer(state: WritingToeicPart3State, action: WritingToeicPart3Action): WritingToeicPart3State {
    // console.log("Part3 Reducer Action:", action.type, (action as any).payload ?? ''); // Dùng để debug
    switch (action.type) {
        case 'PART3_DB_INIT_START':
            return { ...state, isDbLoading: true, error: null };
        case 'PART3_DB_INIT_SUCCESS': {
            const derived = deriveStateFromPart3SheetData(action.payload.latestSheet);
            return {
                ...state, ...derived,
                currentSheetId: action.payload.latestSheet?.id || null,
                currentSheetData: action.payload.latestSheet || null,
                totalSheets: action.payload.totalSheets,
                isDbLoading: false, isLoadingPrompt: false, isLoadingGrade: false, error: null,
            };
        }
        case 'PART3_LOAD_SHEET_START':
            return { ...state, isDbLoading: true, isLoadingPrompt: false, isLoadingGrade: false, error: null };
        case 'PART3_LOAD_SHEET_SUCCESS': {
            const derived = deriveStateFromPart3SheetData(action.payload.sheetData);
            return {
                ...state, ...derived,
                currentSheetId: action.payload.sheetData.id,
                currentSheetData: action.payload.sheetData,
                totalSheets: action.payload.totalSheets,
                isDbLoading: false, isLoadingPrompt: false, isLoadingGrade: false, error: null,
            };
        }
        case 'PART3_DB_OPERATION_ERROR':
            return { ...state, isDbLoading: false, isLoadingPrompt: false, isLoadingGrade: false, error: action.payload };

        case 'PART3_CREATE_SHEET_SUCCESS': {
            const derived = deriveStateFromPart3SheetData(action.payload.newSheet);
            return {
                ...state, ...derived,
                currentSheetId: action.payload.newSheet.id,
                currentSheetData: action.payload.newSheet,
                totalSheets: action.payload.totalSheets,
                isDbLoading: false, isLoadingPrompt: false, isLoadingGrade: false, error: null,
            };
        }
        case 'PART3_INTERNAL_NEW_SHEET_READY': {
            const derived = deriveStateFromPart3SheetData(action.payload.newActiveSheet);
            return {
                ...state, ...derived,
                currentSheetId: action.payload.newActiveSheet.id,
                currentSheetData: action.payload.newActiveSheet,
                totalSheets: action.payload.totalSheets,
                error: null,
            };
        }
        case 'PART3_UPDATE_SHEET_IN_STATE': {
            if (!state.currentSheetData || !action.payload.id || state.currentSheetData.id !== action.payload.id) return state;
            const updatedSheetData = { ...state.currentSheetData, ...action.payload } as WritingToeicPart3SheetData;
            const derivedAfterUpdate = deriveStateFromPart3SheetData(updatedSheetData);
            return { ...state, ...derivedAfterUpdate, currentSheetData: updatedSheetData };
        }
        case 'PART3_SET_CURRENT_SHEET_ID':
            return { ...state, currentSheetId: action.payload };
        case 'PART3_SET_TOTAL_SHEETS':
            return { ...state, totalSheets: action.payload };

        case 'PART3_GENERATE_ESSAY_QUESTION_START':
            return {
                ...state, isLoadingPrompt: true, isLoadingGrade: false, error: null,
                userEssayText: (state.currentSheetData?.status === 'blank' || state.currentSheetData?.status === 'prompt_generated') ? '' : state.userEssayText,
                currentFeedback: (state.currentSheetData?.status === 'blank' || state.currentSheetData?.status === 'prompt_generated') ? null : state.currentFeedback,
                currentPrompt: null,
            };
        case 'PART3_GENERATE_ESSAY_QUESTION_SUCCESS': {
            if (!state.currentSheetData || state.currentSheetId !== parseInt(action.payload.id, 10)) {
                return state;
            }
            const promptUpdateForSheet: Partial<WritingToeicPart3SheetData> = {
                essayQuestion: action.payload.essayQuestion,
                promptDirections: action.payload.directions,
                promptGeneratedAt: action.payload.generatedAt,
                status: 'prompt_generated',
            };
            const sheetWithNewPrompt = { ...state.currentSheetData, ...promptUpdateForSheet } as WritingToeicPart3SheetData;
            const derivedWithNewPrompt = deriveStateFromPart3SheetData(sheetWithNewPrompt);
            return {
                ...state, ...derivedWithNewPrompt,
                isLoadingPrompt: false, error: null,
            };
        }
        case 'PART3_GENERATE_ESSAY_QUESTION_FAILURE':
            return { ...state, isLoadingPrompt: false, error: action.payload, currentPrompt: null };

        case 'PART3_UPDATE_USER_ESSAY':
            return { ...state, userEssayText: action.payload };
        case 'PART3_SUBMIT_ESSAY_START':
            return { ...state, isLoadingGrade: true, error: null, currentFeedback: null };
        case 'PART3_SUBMIT_ESSAY_SUCCESS': {
            if (!state.currentSheetData || state.currentSheetId !== parseInt(action.payload.answerId, 10)) {
                return state;
            }
            const gradeUpdateForSheet: Partial<WritingToeicPart3SheetData> = {
                gradeScore: action.payload.score,
                gradeOverallFeedback: action.payload.overallFeedback,
                gradeDetailedFeedback: action.payload.detailedFeedback,
                gradeKeyImprovementAreas: action.payload.keyImprovementAreas,
                gradeGradedAt: action.payload.gradedAt,
                status: 'graded',
            };
            const sheetWithGrade = { ...state.currentSheetData, ...gradeUpdateForSheet } as WritingToeicPart3SheetData;
            const derivedWithGrade = deriveStateFromPart3SheetData(sheetWithGrade);
            return {
                ...state, ...derivedWithGrade,
                isLoadingGrade: false, error: null,
            };
        }
        case 'PART3_SUBMIT_ESSAY_FAILURE':
            return { ...state, isLoadingGrade: false, error: action.payload };

        case 'PART3_CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
}

//------------------------------------------------------
// Mục: Custom Hook - useWritingToeicPart3Logic
//------------------------------------------------------
export function useWritingToeicPart3Logic() {
    const [state, dispatch] = useReducer(writingToeicPart3Reducer, initialToeicWritingPart3State);

    // --- Refs cho AbortController ---
    const generateQuestionAbortControllerRef = useRef<AbortController | null>(null);
    const submitEssayAbortControllerRef = useRef<AbortController | null>(null);

    // --- useEffect cho việc dọn dẹp AbortController khi component unmount ---
    useEffect(() => {
        return () => {
            generateQuestionAbortControllerRef.current?.abort();
            submitEssayAbortControllerRef.current?.abort();
        };
    }, []);

    // --- useEffect cho khởi tạo DB và tải sheet mới nhất ---
    useEffect(() => {
        let isMounted = true;

        _initDatabase(isMounted, dispatch);
        return () => { isMounted = false; };
    }, [dispatch]);

    useBackgroundTask(state, dispatch);

    // --- Các hàm callback nội bộ cho logic chính (sử dụng state và dispatch từ hook scope) ---

    const generateNewEssayQuestion = useCallback(async () => {
        _internalGenerateNewEssayQuestion(state, dispatch, generateQuestionAbortControllerRef)
    }, [state.currentSheetId, state.totalSheets, dispatch]); // state.currentSheetData đã bị loại bỏ để tránh vòng lặp nếu có thể




    const submitUserEssay = useCallback(async () => {
        _internalSubmitUserEssay(state, dispatch, submitEssayAbortControllerRef);
    }, [state.currentSheetId, state.currentSheetData, state.userEssayText, state.currentPrompt, state.totalSheets, dispatch]);


    const navigateToPart3Sheet = useCallback(async (sheetIdToLoad: number) => {
        _internalNavigateToPart3Sheet(sheetIdToLoad, state, dispatch);
    }, [state.currentSheetId, state.currentSheetData, dispatch]);


    const updateUserEssayTextCb = useCallback((text: string) => {
        dispatch({ type: 'PART3_UPDATE_USER_ESSAY', payload: text });
    }, [dispatch]);

    // --- Derived UI Control States (uiControls) ---
    const isLoadingEssayQuestion = state.isLoadingPrompt;
    const isGradingEssay = state.isLoadingGrade;
    const uiControls = {
        isFetchingInitialData: state.isDbLoading,
        isGenerateNewEssayQuestionButtonLoading: isLoadingEssayQuestion,
        isGenerateNewEssayQuestionButtonDisabled: state.isDbLoading || isLoadingEssayQuestion || isGradingEssay,
        shouldShowEssayQuestionSkeleton: isLoadingEssayQuestion && !state.currentPrompt,
        isEssayEditorDisabled: state.isDbLoading || isLoadingEssayQuestion || isGradingEssay || !state.currentPrompt || state.currentSheetData?.status === 'blank',
        isSubmitEssayButtonLoading: isGradingEssay,
        isSubmitEssayButtonDisabled: !(!state.isDbLoading && !isLoadingEssayQuestion && !isGradingEssay && !!state.currentPrompt && state.userEssayText.trim().length >= 200 && state.currentSheetData?.status !== 'blank'), // Độ dài tối thiểu ví dụ
        shouldRenderEssayGradeDisplay: (!!state.currentFeedback || isGradingEssay) && !!state.currentSheetData && (state.currentSheetData.status === 'graded' || state.currentSheetData.status === 'answered'),
    };

    return {
        state,
        generateNewEssayQuestion, // Exposed memoized version
        updateUserEssayText: updateUserEssayTextCb,
        submitUserEssay, // Exposed memoized version
        navigateToPart3Sheet, // Exposed memoized version
        uiControls,
    };
}
async function _internalGenerateNewEssayQuestion(state: WritingToeicPart3State,
    dispatch: Dispatch<WritingToeicPart3Action>,
    generateQuestionAbortControllerRef: MutableRefObject<AbortController | null>) {
    // Hủy request trước nếu có
    generateQuestionAbortControllerRef.current?.abort();
    const controller = new AbortController();
    generateQuestionAbortControllerRef.current = controller;

    dispatch({ type: 'PART3_GENERATE_ESSAY_QUESTION_START' });
    let targetSheetId = state.currentSheetId;
    let currentTotalSheets = state.totalSheets;

    try {
        const latestSheetInDb = await getLatestPart3SheetById();
        let sheetToOperateOn: WritingToeicPart3SheetData;
        const historyTopics = await getSomeHistoryTopicsForPart3(); // Cần hàm lấy lịch sử câu hỏi

        if (latestSheetInDb && latestSheetInDb.status === 'blank') {
            targetSheetId = latestSheetInDb.id;
            sheetToOperateOn = latestSheetInDb;
            if (state.currentSheetId !== targetSheetId) {
                dispatch({ type: 'PART3_LOAD_SHEET_SUCCESS', payload: { sheetData: latestSheetInDb, totalSheets: currentTotalSheets } });
            }
        } else {
            const newSheetIdFromDb = await addPart3Sheet({ status: 'blank', createdAt: Date.now() });
            targetSheetId = newSheetIdFromDb;
            const newBlankSheet = await getPart3SheetById(newSheetIdFromDb);
            currentTotalSheets = await getPart3SheetsCount();
            if (!newBlankSheet) throw new Error("Không thể tạo sheet trắng mới cho Part 3.");
            sheetToOperateOn = newBlankSheet;
            dispatch({ type: 'PART3_INTERNAL_NEW_SHEET_READY', payload: { newActiveSheet: sheetToOperateOn, totalSheets: currentTotalSheets } });
        }
        if (!targetSheetId) throw new Error("Không thể xác định target sheet ID cho Part 3.");

        // Gọi API với AbortSignal
        const essayQuestionData = await generateEssayQuestionForPart3(historyTopics, controller.signal);
        if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
        if (!essayQuestionData || !essayQuestionData.essayQuestion) throw new Error("Không thể tạo câu hỏi luận từ AI.");

        const promptUpdateForSheet: Partial<WritingToeicPart3SheetData> = {
            essayQuestion: essayQuestionData.essayQuestion,
            promptDirections: DEFAULT_PART3_DIRECTIONS,
            promptGeneratedAt: Date.now(),
            status: 'prompt_generated',
            userEssayText: '',
            gradeScore: undefined, gradeOverallFeedback: undefined, gradeDetailedFeedback: undefined, gradeKeyImprovementAreas: undefined, gradeGradedAt: undefined,
        };

        const sheetBeforeUpdate = await getPart3SheetById(targetSheetId);
        if (!sheetBeforeUpdate) throw new Error(`Sheet Part 3 ID ${targetSheetId} không tìm thấy trước khi cập nhật.`);

        await updatePart3Sheet({ ...sheetBeforeUpdate, ...promptUpdateForSheet } as WritingToeicPart3SheetData);
        const finalUpdatedSheet = await getPart3SheetById(targetSheetId);
        if (finalUpdatedSheet) {
            dispatch({ type: 'PART3_LOAD_SHEET_SUCCESS', payload: { sheetData: finalUpdatedSheet, totalSheets: currentTotalSheets } });
        } else { throw new Error("Không thể tải sheet Part 3 sau khi cập nhật câu hỏi."); }
        generateQuestionAbortControllerRef.current = null;
    } catch (err) {
        generateQuestionAbortControllerRef.current = null;
        if ((err as Error).name !== 'AbortError') {
            dispatch({ type: 'PART3_GENERATE_ESSAY_QUESTION_FAILURE', payload: (err as Error).message || 'Lỗi tạo câu hỏi luận Part 3.' });
        } else { console.log("Tạo câu hỏi luận Part 3 đã bị hủy."); }
    }
}
async function _internalSubmitUserEssay(state: WritingToeicPart3State,
    dispatch: Dispatch<WritingToeicPart3Action>,
    submitEssayAbortControllerRef: MutableRefObject<AbortController | null>) {
    if (!state.currentSheetId || !state.currentSheetData || !state.currentPrompt?.essayQuestion) {
        dispatch({ type: 'PART3_SUBMIT_ESSAY_FAILURE', payload: 'Thông tin đề bài Part 3 không đủ.' }); return;
    }
    if (state.userEssayText.trim().length < 250) { // Ví dụ: kiểm tra sơ bộ độ dài tối thiểu (TOEIC yêu cầu ~300)
        dispatch({ type: 'PART3_SUBMIT_ESSAY_FAILURE', payload: 'Bài luận của bạn quá ngắn. Vui lòng viết ít nhất khoảng 250-300 từ.' }); return;
    }

    submitEssayAbortControllerRef.current?.abort();
    const controller = new AbortController();
    submitEssayAbortControllerRef.current = controller;

    dispatch({ type: "PART3_SUBMIT_ESSAY_START" });
    try {
        let sheetToUpdate = await getPart3SheetById(state.currentSheetId!);
        if (!sheetToUpdate) throw new Error("Không tìm thấy sheet Part 3 để cập nhật bài luận.");
        const answeredSheetUpdate: Partial<WritingToeicPart3SheetData> = {
            userEssayText: state.userEssayText, userEssaySubmittedAt: Date.now(), status: 'answered',
        };
        sheetToUpdate = { ...sheetToUpdate, ...answeredSheetUpdate };
        await updatePart3Sheet(sheetToUpdate as WritingToeicPart3SheetData);
        // dispatch({ type: 'PART3_UPDATE_SHEET_IN_STATE', payload: ... }); // Optional

        if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');

        const feedback = await gradeEssayForPart3(
            state.currentSheetId!, state.userEssayText, state.currentPrompt.essayQuestion, controller.signal
        );
        if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
        if (!feedback) throw new Error("Không nhận được phản hồi chấm điểm bài luận từ AI.");

        const sheetBeforeGradeSave = await getPart3SheetById(state.currentSheetId!);
        if (!sheetBeforeGradeSave) throw new Error("Không lấy được sheet Part 3 trước khi lưu điểm.");

        const gradedSheetUpdate: Partial<WritingToeicPart3SheetData> = {
            gradeScore: feedback.score, gradeOverallFeedback: feedback.overallFeedback,
            gradeDetailedFeedback: feedback.detailedFeedback, gradeKeyImprovementAreas: feedback.keyImprovementAreas,
            gradeGradedAt: feedback.gradedAt, status: 'graded',
        };
        await updatePart3Sheet({ ...sheetBeforeGradeSave, ...gradedSheetUpdate } as WritingToeicPart3SheetData);
        const finalGradedSheet = await getPart3SheetById(state.currentSheetId!);
        if (finalGradedSheet) {
            dispatch({ type: 'PART3_LOAD_SHEET_SUCCESS', payload: { sheetData: finalGradedSheet, totalSheets: state.totalSheets } });
        } else { throw new Error("Không tải được sheet Part 3 sau khi cập nhật điểm."); }

        const latestSheetInDb = await getLatestPart3SheetById();
        if (latestSheetInDb && state.currentSheetId === latestSheetInDb.id && finalGradedSheet?.status === 'graded') {
            await addPart3Sheet({ status: 'blank', createdAt: Date.now() });
            const newTotalSheets = await getPart3SheetsCount();
            dispatch({ type: 'PART3_SET_TOTAL_SHEETS', payload: newTotalSheets });
        }
        submitEssayAbortControllerRef.current = null;
    } catch (err) {
        submitEssayAbortControllerRef.current = null;
        if ((err as Error).name !== 'AbortError') {
            dispatch({ type: "PART3_SUBMIT_ESSAY_FAILURE", payload: (err as Error).message || "Lỗi không xác định khi nộp bài luận Part 3." });
        } else { console.log("Nộp bài luận Part 3 đã bị hủy."); }
    }
}
async function _internalNavigateToPart3Sheet(sheetIdToLoad: number, state: WritingToeicPart3State, dispatch: Dispatch<WritingToeicPart3Action>) {
    if (sheetIdToLoad === state.currentSheetId && state.currentSheetData?.id === sheetIdToLoad && state.currentSheetData.status !== 'blank') return;
    dispatch({ type: 'PART3_LOAD_SHEET_START', payload: { sheetId: sheetIdToLoad } });
    try {
        const sheetFromDb = await getPart3SheetById(sheetIdToLoad);
        const currentTotalSheetsInDb = await getPart3SheetsCount();
        if (!sheetFromDb) {
            dispatch({ type: 'PART3_DB_OPERATION_ERROR', payload: `Không tìm thấy bài luận Part 3 số ${sheetIdToLoad}.` });
            const latestSheetFallback = await getLatestPart3SheetByTimestamp();
            if (latestSheetFallback) {
                dispatch({ type: 'PART3_LOAD_SHEET_SUCCESS', payload: { sheetData: latestSheetFallback, totalSheets: currentTotalSheetsInDb } });
            } else {
                dispatch({ type: 'PART3_DB_INIT_SUCCESS', payload: { latestSheet: null, totalSheets: 0 } });
            }
            return;
        }
        dispatch({ type: 'PART3_LOAD_SHEET_SUCCESS', payload: { sheetData: sheetFromDb, totalSheets: currentTotalSheetsInDb } });
    } catch (err) {
        dispatch({ type: 'PART3_DB_OPERATION_ERROR', payload: (err as Error).message || `Lỗi tải bài luận Part 3 số ${sheetIdToLoad}.` });
    }
}
async function _initDatabase(isMounted: boolean, dispatch: Dispatch<WritingToeicPart3Action>) {
    dispatch({ type: 'PART3_DB_INIT_START' });
    try {
        await initializeDB();
        let latestSheet = await getLatestPart3SheetByTimestamp();
        let totalSheetsCount = await getPart3SheetsCount();
        if (!latestSheet && totalSheetsCount === 0) {
            const newSheetId = await addPart3Sheet({ status: 'blank', createdAt: Date.now() });
            latestSheet = await getPart3SheetById(newSheetId);
            totalSheetsCount = 1;
            if (latestSheet && isMounted) {
                dispatch({ type: 'PART3_CREATE_SHEET_SUCCESS', payload: { newSheet: latestSheet, totalSheets: totalSheetsCount } });
            }
        } else if (isMounted) {
            dispatch({ type: 'PART3_DB_INIT_SUCCESS', payload: { latestSheet: latestSheet || null, totalSheets: totalSheetsCount } });
        }
    } catch (err) {
        if (isMounted) dispatch({ type: 'PART3_DB_OPERATION_ERROR', payload: (err as Error).message || 'Lỗi khởi tạo CSDL Part 3.' });
    }
}

function useBackgroundTask(state: WritingToeicPart3State,
    dispatch: Dispatch<WritingToeicPart3Action>,
) {
    const { toast } = useToast();
    // --- useEffect cho hiển thị toast lỗi ---
    useEffect(() => {
        if (state.error) {
            toast.current?.show({ severity: "error", summary: "Lỗi Part 3", detail: state.error, life: 4000 });
            dispatch({ type: 'PART3_CLEAR_ERROR' });
        }
    }, [state.error, toast, dispatch]);

    // --- useEffect cho toast khi chấm bài thành công ---
    useEffect(() => {
        if (state.currentFeedback && state.currentSheetData?.status === 'graded' && !state.isLoadingGrade && !state.error) {
            const feedbackToastKey = `part3_feedbackToastShown_${state.currentSheetId}_${state.currentFeedback.gradedAt}`;
            if (sessionStorage.getItem(feedbackToastKey) !== 'true') {
                toast.current?.show({ severity: "success", summary: "Chấm bài luận thành công!", detail: `Điểm của bạn: ${state.currentFeedback.score}/5`, life: 3000 });
                sessionStorage.setItem(feedbackToastKey, 'true');
            }
        }
    }, [state.currentFeedback, state.currentSheetData, state.isLoadingGrade, state.error, toast, state.currentSheetId, dispatch]);
    // useEffect cho việc tự động tạo câu hỏi luận cho sheet trắng

}