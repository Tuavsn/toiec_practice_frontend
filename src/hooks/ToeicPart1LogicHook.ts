// Filename: src/features/toeic/part1/hooks/useToeicPart1Logic.ts
import { Dispatch, useEffect, useReducer } from 'react';
import { fetchAndConvertImageToBase64, fetchImageFromPexels, generateKeywordsAndInstructionForPart1, gradeAnswerWithGeminiSDK, suggestKeywordForImageSearch } from '../api/api';
import { useToast } from '../context/ToastProvider';
import { addSheet, getLatestSheetByIdFromDB, getLatestSheetByTimestampFromDB, getSheetById, getSheetsCountFromDB, initializeDB, updateSheetToDB } from '../database/indexdb';
import { ToeicWritingPart1Action } from '../utils/types/action';
import { initialToeicWritingPart1State } from '../utils/types/emptyValue';
import { ToeicWritingPart1State } from '../utils/types/state';
import { UIWritingPart1Control, WritingSheetData } from '../utils/types/type';
import toeicWritingPart1Reducer from './ToeicWritingPart1Reducer';




//------------------------------------------------------
// Custom Hook Logic
//------------------------------------------------------

export function useToeicPart1Logic() {
    const [state, dispatch] = useReducer(toeicWritingPart1Reducer, initialToeicWritingPart1State);


    useEffect(() => {
        let isMounted = true;
        initEffect(isMounted, dispatch);
        return () => { isMounted = false; };
    }, [dispatch]);
    useErrorMessage(state.error, dispatch);

    const onAnswerChange = (text: string) => {
        dispatch({ type: "UPDATE_USER_ANSWER", payload: text })
    }
    const generateNewQuestion = async () => _generateNewQuestionCb(state, dispatch);
    const onSubmitAnswer = async () => _onSubmitAnswercb(state, dispatch);
    const navigateToSheet = async (sheetIdToLoad: number) => _navigateToSheetCb(state, dispatch, sheetIdToLoad);
    return {
        state,
        onAnswerChange,
        onSubmitAnswer,
        uiControls: GenerateUIControl(state),
        navigateToSheet,
        generateNewQuestion,
    }
}

function GenerateUIControl(state: ToeicWritingPart1State): UIWritingPart1Control {
    //------------------------------------------------------
    // Sub-Section: Derived UI Control States
    //------------------------------------------------------

    // True if any core async operation related to fetching/generating new prompt content is active.
    const isLoadingNewSheetContent = state.isLoadingImage || state.isCreatingQuestion;

    // True if an answer is currently being graded.
    const isGradingAnswer = state.isLoadingGrade;

    // --- States for "Tạo đề mới" (Generate New Prompt) Button ---
    const isGenerateNewPromptButtonLoading = isLoadingNewSheetContent;
    const isGenerateNewPromptButtonDisabled =
        state.isDbLoading ||      // Cannot do anything if DB is initializing/busy
        isLoadingNewSheetContent || // Already generating new content
        isGradingAnswer;          // Cannot generate new while grading

    // --- States for Image Display ---
    // This tells the ImageDisplay component to show its internal skeleton
    // if image data (state.currentImage) is not yet available but is expected.
    const shouldShowImageSkeleton = state.isLoadingImage && !state.currentImage;

    // --- States for Question Section (Prompt Display) ---
    // This tells PromptDisplay to show its internal skeleton
    const shouldShowPromptSkeleton = state.isCreatingQuestion && !state.currentPrompt;

    // --- States for Text Area (Answer Input) ---
    const isAnswerAreaDisabled =
        state.isDbLoading ||
        isLoadingNewSheetContent || // Can't type if prompt is loading/changing
        isGradingAnswer ||          // Can't type if answer is being graded
        !state.currentPrompt ||     // No prompt to answer
        state.currentSheetData?.status === 'blank'; // Sheet is just a placeholder

    // --- States for "Nộp bài" (Submit Answer) Button ---
    const isSubmitAnswerButtonLoading = isGradingAnswer;

    const canSubmitAnswer = // A positive way to look at it for the button's disabled state
        !state.isDbLoading &&
        !isLoadingNewSheetContent &&
        !isGradingAnswer &&
        !!state.currentPrompt &&
        !!state.currentImage && // Image must be present
        state.userAnswerText.trim() !== "" &&
        state.currentSheetData?.status !== 'blank'; // Can submit for 'prompt_generated', 'answered', or 'graded' (if re-submitting an edited answer)

    // Final disabled state for Submit button based on canSubmitAnswer
    const finalIsSubmitAnswerButtonDisabled = !canSubmitAnswer;

    const shouldRenderGradeDisplay =
        (!!state.currentFeedback || isGradingAnswer) && // Either feedback exists or we're actively grading
        !!state.currentSheetData &&                      // And there is a current sheet context
        (state.currentSheetData.status === 'graded' ||   // And the sheet is graded
            state.currentSheetData.status === 'answered');  // Or it's answered (implying grading is pending/active)

    return {
        isFetchingInitialData: state.isDbLoading, // For global page spinner
        // "Tạo đề mới" Button
        isGenerateNewPromptButtonLoading,
        isGenerateNewPromptButtonDisabled,
        // Image Display
        shouldShowImageSkeleton, // Prop for ImageDisplay's isLoading
        // Question Display
        shouldShowPromptSkeleton, // Prop for PromptDisplay's isLoading
        // Answer Text Area
        isAnswerAreaDisabled,
        // "Nộp bài" Button
        isSubmitAnswerButtonLoading,
        isSubmitAnswerButtonDisabled: finalIsSubmitAnswerButtonDisabled, // Use the refined one
        shouldRenderGradeDisplay,
    }
}

function useErrorMessage(error: string | null, dispatch: Dispatch<ToeicWritingPart1Action>) {
    const { toast } = useToast();
    useEffect(() => {
        if (error) {
            toast.current?.show({
                severity: "error", summary: "Có lỗi xảy ra", detail: error, life: 4000
            });
            dispatch({ type: 'CLEAR_ERROR' }); // Очищаем ошибку после отображения тоста
        }
    }, [error, toast, dispatch]);
}

async function initEffect(isMounted: boolean, dispatch: Dispatch<ToeicWritingPart1Action>) {
    dispatch({ type: 'DB_INIT_START' });
    try {
        await initializeDB();
        let latestSheet = await getLatestSheetByTimestampFromDB();
        let total = await getSheetsCountFromDB();

        if (!latestSheet && total === 0) {
            console.log("useToeicPart1Logic: không có sheet");
            const newSheetId = await addSheet({ status: 'blank', createdAt: Date.now() });
            latestSheet = await getSheetById(newSheetId); // Получаем созданный лист
            total = 1;
            if (latestSheet && isMounted) {
                dispatch({ type: 'CREATE_SHEET_SUCCESS', payload: { newSheet: latestSheet, totalSheets: total } });
            }
        } else if (isMounted) {
            console.log("lấy bài gần nhất thành công", total);

            dispatch({ type: 'DB_INIT_SUCCESS', payload: { latestSheet: latestSheet || null, totalSheets: total } });
        }
    } catch (err) {
        if (isMounted) {
            dispatch({ type: 'DB_OPERATION_ERROR', payload: (err as Error).message || 'Lỗi khởi tạo cơ sở dữ liệu.' });
        }
    }
}

async function _onSubmitAnswercb(state: ToeicWritingPart1State, dispatch: Dispatch<ToeicWritingPart1Action>) {
    // 1. Initial checks (Good)
    if (!state.currentSheetId || !state.currentSheetData /* ...etc... */) { /* ... dispatch failure ... */ return; }
    if (state.userAnswerText.trim().length === 0) { /* ... dispatch failure ... */ return; }

    // 2. Start submission
    dispatch({ type: "SUBMIT_ANSWER_START" });

    try {
        // 3. Get the most up-to-date version of the sheet from DB before modifying
        let sheetToUpdate = await getSheetById(state.currentSheetId!);
        if (!sheetToUpdate) {
            throw new Error("Không tìm thấy bài làm hiện tại trong DB.");
        }

        // 4. Update sheet with the user's answer and set status to 'answered'
        sheetToUpdate = {
            ...sheetToUpdate,
            userAnswerText: state.userAnswerText,
            userAnswerSubmittedAt: Date.now(),
            status: 'answered'
        };
        await updateSheetToDB(sheetToUpdate); // Assuming updateSheet is your DB save function

        dispatch({ type: 'UPDATE_SHEET_IN_STATE', payload: { userAnswerText: sheetToUpdate.userAnswerText, userAnswerSubmittedAt: sheetToUpdate.userAnswerSubmittedAt, status: 'answered', id: sheetToUpdate.id } });


        // 5. Get feedback from AI
        const feedback = await gradeAnswerWithGeminiSDK(
            state.currentSheetId!,
            state.userAnswerText,
            sheetToUpdate.promptText!, // Use promptText from the sheet we are updating
            sheetToUpdate.promptMandatoryKeyword1!,
            sheetToUpdate.promptMandatoryKeyword2!,
            sheetToUpdate.promptImageUrl!,
            sheetToUpdate.promptImageAltText
        );

        if (!feedback) {
            // Sheet remains 'answered' in DB. UI will show error via toast.
            // isLoadingGrade will be stuck true unless SUBMIT_ANSWER_FAILURE reducer sets it false.
            dispatch({ type: "SUBMIT_ANSWER_FAILURE", payload: "Không nhận được phản hồi chấm điểm từ AI." });
            return;
        }

        // 6. Merge feedback into the sheet data and update status to 'graded'
        sheetToUpdate = {
            ...sheetToUpdate, // Contains the answer data already
            gradeScore: feedback.score,
            gradeFeedbackText: feedback.feedbackText,
            gradeGrammarCorrections: feedback.grammarCorrections?.map(c => ({ explanation: c.explanation ?? "", ...c })),
            gradeGradedAt: feedback.gradedAt.getTime(),
            status: 'graded'
        };
        await updateSheetToDB(sheetToUpdate); // Save the fully graded sheet to DB

        // 7. Fetch the definitive final version from DB and dispatch LOAD_SHEET_SUCCESS
        // This action's reducer will correctly set isLoadingGrade: false, update all
        // currentSheetData, currentFeedback, etc., ensuring UI consistency with DB.
        const finalSheetFromDb = await getSheetById(state.currentSheetId!);
        if (finalSheetFromDb) {
            dispatch({ type: 'LOAD_SHEET_SUCCESS', payload: { sheetData: finalSheetFromDb, totalSheets: state.totalSheets } });
        } else {
            // This is a problem, means the sheet wasn't found after supposedly saving it.
            // Fallback to just updating UI with feedback, but data isn't fully synced.
            console.error("CRITICAL: Sheet not found in DB after grade update for ID:", state.currentSheetId);
            dispatch({ type: "SUBMIT_ANSWER_SUCCESS", payload: feedback }); // Still provide UI update
            dispatch({ type: "SUBMIT_ANSWER_FAILURE", payload: "Lỗi đồng bộ dữ liệu sau khi chấm điểm." }); // Notify user of sync issue
            return;
        }

        // 8. Handle creation of a new blank sheet if this was the latest sheet submitted
        const latestSheetInDb = await getLatestSheetByIdFromDB();
        if (latestSheetInDb && state.currentSheetId === latestSheetInDb.id && finalSheetFromDb.status === 'graded') {
            await addSheet({ status: 'blank', createdAt: Date.now() });
            const newTotalSheets = await getSheetsCountFromDB();
            dispatch({ type: 'SET_TOTAL_SHEETS', payload: newTotalSheets });
        }

    } catch (error) {
        console.error("Lỗi trong quá trình nộp bài:", error);
        dispatch({ type: "SUBMIT_ANSWER_FAILURE", payload: (error as Error).message || "Lỗi không xác định khi nộp bài." });
    }
}

async function _navigateToSheetCb(state: ToeicWritingPart1State, dispatch: Dispatch<ToeicWritingPart1Action>, sheetIdToLoad: number) {
    // --- Guard Clauses ---

    // Guard 1: Prevent re-loading the same sheet if it's already current, loaded, and not blank.
    // If it's current but blank, we allow "re-navigating" to it because LOAD_SHEET_SUCCESS
    // for a blank sheet, followed by the auto-prompt-generation useEffect, can re-trigger prompt fetching.
    if (
        sheetIdToLoad === state.currentSheetId &&
        state.currentSheetData && // Ensure currentSheetData exists
        state.currentSheetData.id === sheetIdToLoad && // Double-check ID match
        state.currentSheetData.status !== 'blank' // Allow re-load if current is blank to trigger auto-gen
    ) {
        console.log(`HOOK: navigateToSheetCb: Sheet ${sheetIdToLoad} is already current and has content. No navigation action taken.`);
        return;
    }

    // Guard 2: Basic sanity check for the sheet ID.
    // Although Paginator should provide valid pages, this adds a layer of safety.
    // state.totalSheets might be slightly stale if this callback's closure is old and totalSheets changed rapidly,
    // but getSheetsCount() later will fetch the absolute current total.
    if (sheetIdToLoad <= 0 || (state.totalSheets > 0 && sheetIdToLoad > state.totalSheets)) {
        const warningMsg = `HOOK: navigateToSheetCb: Invalid sheetId ${sheetIdToLoad} requested. Total sheets: ${state.totalSheets}.`;
        console.warn(warningMsg);
        // We could dispatch an error here, but often just not proceeding is enough if this is due to a rapid click.
        // If it indicates a real issue, other parts of the app might show an error.
        // For now, just return. A more robust UX might show a toast.
        // dispatch({ type: 'DB_OPERATION_ERROR', payload: `ID bài làm không hợp lệ: ${sheetIdToLoad}.` });
        return;
    }

    console.log(`HOOK: navigateToSheetCb: Attempting to load sheet ID: ${sheetIdToLoad}. Current active sheetId: ${state.currentSheetId}`);
    dispatch({ type: 'LOAD_SHEET_START', payload: { sheetId: sheetIdToLoad } });

    // --- Main Logic Path ---
    try {
        const sheetFromDb = await getSheetById(sheetIdToLoad);
        const currentTotalSheetsInDb = await getSheetsCountFromDB(); // Get the most up-to-date total

        // Guard 3: Sheet not found in the database.
        if (!sheetFromDb) {
            console.error(`HOOK: navigateToSheetCb: Sheet with ID ${sheetIdToLoad} not found in DB.`);
            dispatch({ type: 'DB_OPERATION_ERROR', payload: `Không tìm thấy bài làm số ${sheetIdToLoad}.` });

            // Attempt to recover gracefully by loading the latest known valid sheet, if any.
            const latestSheetFallback = await getLatestSheetByTimestampFromDB();
            if (latestSheetFallback) {
                console.log(`HOOK: navigateToSheetCb: Fallback - loading latest sheet ID: ${latestSheetFallback.id}`);
                dispatch({ type: 'LOAD_SHEET_SUCCESS', payload: { sheetData: latestSheetFallback, totalSheets: currentTotalSheetsInDb } });
            } else {
                // No sheets at all, likely an edge case after DB clear or error. Reset to initial empty-like state.
                console.log(`HOOK: navigateToSheetCb: Fallback - No sheets found in DB. Resetting.`);
                dispatch({ type: 'DB_INIT_SUCCESS', payload: { latestSheet: null, totalSheets: 0 } }); // Resembles initial empty state
            }
            return; // Exit after handling "not found"
        }

        // Happy path: Sheet found, dispatch success.
        console.log(`HOOK: navigateToSheetCb: Successfully loaded sheet ${sheetIdToLoad} from DB.`);
        dispatch({ type: 'LOAD_SHEET_SUCCESS', payload: { sheetData: sheetFromDb, totalSheets: currentTotalSheetsInDb } });

    } catch (err) {
        console.error(`HOOK: navigateToSheetCb: Critical error for sheetId ${sheetIdToLoad}:`, err);
        dispatch({ type: 'DB_OPERATION_ERROR', payload: (err as Error).message || `Lỗi nghiêm trọng khi tải bài làm số ${sheetIdToLoad}.` });
    }
}

async function _generateNewQuestionCb(state: ToeicWritingPart1State, dispatch: Dispatch<ToeicWritingPart1Action>) {
    dispatch({ type: 'FETCH_IMAGE_AND_GENERATE_PROMPT_START' });
    let targetSheetId = state.currentSheetId;
    let sheetToUpdateFromState: WritingSheetData | null = state.currentSheetData; //
    let currentTotalSheets = state.totalSheets;

    try {
        const latestSheetInDb = await getLatestSheetByIdFromDB();

        if (latestSheetInDb && latestSheetInDb.status === 'blank') {
            targetSheetId = latestSheetInDb.id;
            sheetToUpdateFromState = latestSheetInDb; //
            if (state.currentSheetId !== targetSheetId) { //
                //
                dispatch({ type: 'LOAD_SHEET_SUCCESS', payload: { sheetData: latestSheetInDb, totalSheets: currentTotalSheets } });
            }
            //
        } else { //
            const newSheetIdFromDb = await addSheet({ status: 'blank', createdAt: Date.now() });
            targetSheetId = newSheetIdFromDb;
            sheetToUpdateFromState = await getSheetById(newSheetIdFromDb) ?? null; //
            currentTotalSheets = await getSheetsCountFromDB();

            if (sheetToUpdateFromState) {
                dispatch({ type: 'INTERNAL_NEW_SHEET_READY', payload: { newActiveSheet: sheetToUpdateFromState, totalSheets: currentTotalSheets } });
            } else { throw new Error("Không thể tạo hoặc truy xuất sheet trắng mới sau khi добавили в БД."); }
        }

        if (!targetSheetId || !sheetToUpdateFromState) { //
            throw new Error("Không thể xác định лист для работы.");
        }
        //
        //

        const pexelsTheme = await suggestKeywordForImageSearch();
        if (!pexelsTheme) throw new Error("Không thể gợi ý chủ đề cho Pexels.");

        const pexelsImage = await fetchImageFromPexels(pexelsTheme);
        if (!pexelsImage) throw new Error(`Không tìm thấy ảnh cho chủ đề: ${pexelsTheme}.`);
        //
        //

        const imageData = await fetchAndConvertImageToBase64(pexelsImage.src.large || pexelsImage.src.original);
        if (!imageData) throw new Error("Không thể xử lý dữ liệu hình ảnh.");

        const promptContent = await generateKeywordsAndInstructionForPart1(imageData.base64Data, imageData.mimeType, pexelsImage.alt);
        if (!promptContent) throw new Error("Không thể tạo đề bài và từ khóa từ Gemini.");

        const promptSheetDataUpdate: Partial<WritingSheetData> = {
            promptImageUrl: pexelsImage.src.large || pexelsImage.src.original,
            promptImageAltText: pexelsImage.alt,
            promptText: promptContent.promptText,
            promptMandatoryKeyword1: promptContent.mandatoryKeyword1,
            promptMandatoryKeyword2: promptContent.mandatoryKeyword2,
            promptGeneratedAt: Date.now(),
            status: 'prompt_generated',
            userAnswerText: '', gradeScore: undefined, gradeFeedbackText: undefined, gradeGrammarCorrections: undefined, gradeGradedAt: undefined,
        };

        //
        const sheetToFinallyUpdate = await getSheetById(targetSheetId);
        if (!sheetToFinallyUpdate) throw new Error(`Не найден лист с ID ${targetSheetId} для финального обновления.`);

        await updateSheetToDB({ ...sheetToFinallyUpdate, ...promptSheetDataUpdate } as WritingSheetData); //
        const finalUpdatedSheet = await getSheetById(targetSheetId);

        if (finalUpdatedSheet) {
            //
            dispatch({ type: 'LOAD_SHEET_SUCCESS', payload: { sheetData: finalUpdatedSheet, totalSheets: currentTotalSheets } });
        } else { throw new Error("Không thể tải sheet sau khi cập nhật đề bài."); }

    } catch (err) {
        dispatch({ type: 'GENERATE_PROMPT_FAILURE', payload: (err as Error).message || 'Lỗi tạo câu hỏi mới.' });
    }
} 