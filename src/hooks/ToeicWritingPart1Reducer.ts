import { ToeicWritingPart1Action } from "../utils/types/action";
import { ToeicWritingPart1State } from "../utils/types/state";
import { GradedFeedback, PexelsPhoto, WritingPart1Prompt, WritingSheetData } from "../utils/types/type";

export default function toeicWritingPart1Reducer(state: ToeicWritingPart1State, action: ToeicWritingPart1Action): ToeicWritingPart1State {

    switch (action.type) {
        //------------------------------------------------------
        // Actions: Database Initialization and Sheet Loading
        //------------------------------------------------------
        case 'DB_INIT_START':
            return {
                ...state,
                isDbLoading: true,
                error: null,
            };

        case 'DB_INIT_SUCCESS': {
            const derived = deriveStateFromSheetData(action.payload.latestSheet);
            return {
                ...state,
                ...derived,
                currentSheetId: action.payload.latestSheet?.id || null,
                currentSheetData: action.payload.latestSheet || null,
                totalSheets: action.payload.totalSheets,
                isDbLoading: false,
                // If latestSheet is blank, UI effect will trigger prompt generation
                isLoadingImage: false, // Reset these, auto-gen effect will handle
                isCreatingQuestion: false,
                error: null,
            };
        }

        case 'LOAD_SHEET_START':
            // When loading a sheet, indicate general DB loading and clear specific content loading flags
            return {
                ...state,
                isDbLoading: true, // Use this for sheet switching too
                isLoadingImage: false,
                isCreatingQuestion: false,
                isLoadingGrade: false,
                error: null,
            };

        case 'LOAD_SHEET_SUCCESS': {
            const derived = deriveStateFromSheetData(action.payload.sheetData);
            return {
                ...state,
                ...derived,
                currentSheetId: action.payload.sheetData.id,
                currentSheetData: action.payload.sheetData,
                totalSheets: action.payload.totalSheets, // Update total sheets if it changed
                isDbLoading: false,
                isLoadingImage: false, // Reset after successful load
                isCreatingQuestion: false,
                isLoadingGrade: false,
                error: null,
            };
        }

        case 'DB_OPERATION_ERROR':
            return {
                ...state,
                isDbLoading: false,
                isLoadingImage: false,
                isCreatingQuestion: false,
                isLoadingGrade: false,
                error: action.payload,
            };

        //------------------------------------------------------
        // Actions: Sheet Creation & Management (used by hook logic)
        //------------------------------------------------------
        case 'CREATE_SHEET_SUCCESS': { // Primarily for the very first blank sheet in an empty DB
            const derived = deriveStateFromSheetData(action.payload.newSheet); // newSheet is blank
            return {
                ...state,
                ...derived,
                currentSheetId: action.payload.newSheet.id,
                currentSheetData: action.payload.newSheet,
                totalSheets: action.payload.totalSheets,
                isDbLoading: false, // DB init part is done
                isLoadingImage: false, // Page useEffect will trigger generateNewQuestion, which sets these
                isCreatingQuestion: false,
                error: null,
            };
        }

        case 'INTERNAL_NEW_SHEET_READY': { // When generateNewQuestion creates a new blank sheet mid-flow
            const derived = deriveStateFromSheetData(action.payload.newActiveSheet); // newActiveSheet is blank
            return {
                ...state,
                ...derived, // Clears currentImage, currentPrompt, userAnswerText, currentFeedback
                currentSheetId: action.payload.newActiveSheet.id,
                currentSheetData: action.payload.newActiveSheet,
                totalSheets: action.payload.totalSheets,
                // IMPORTANT: Do not touch isLoadingImage, isLoadingPrompt here.
                // They are already true from FETCH_IMAGE_AND_GENERATE_PROMPT_START.
                // isDbLoading is not relevant here.
                error: null,
            };
        }

        case 'UPDATE_SHEET_IN_STATE': { // For local optimistic updates or after DB confirms an update to currentSheetData
            if (!state.currentSheetData || !action.payload.id || state.currentSheetData.id !== action.payload.id) {
                // Avoid updating if there's no current sheet or if the payload ID doesn't match
                console.warn("UPDATE_SHEET_IN_STATE: ID mismatch or no current sheet.", state.currentSheetId, action.payload.id);
                return state;
            }
            // Create new object for currentSheetData to ensure state immutability
            const updatedSheetData = { ...state.currentSheetData, ...action.payload } as WritingSheetData;
            const derivedAfterUpdate = deriveStateFromSheetData(updatedSheetData);
            return {
                ...state,
                ...derivedAfterUpdate, // Re-derive UI state from the updated sheet data
                currentSheetData: updatedSheetData, // Set the merged sheet data
            };
        }

        case 'SET_CURRENT_SHEET_ID': // Typically used when generateNewQuestion targets an existing blank sheet
            return { ...state, currentSheetId: action.payload };

        case 'SET_TOTAL_SHEETS': // After submitting latest sheet, a new blank one is added, update total
            return { ...state, totalSheets: action.payload };

        //------------------------------------------------------
        // Actions: Prompt Generation
        //------------------------------------------------------
        case 'FETCH_IMAGE_AND_GENERATE_PROMPT_START':
            return {
                ...state,
                isLoadingImage: true,
                isCreatingQuestion: true,
                isLoadingGrade: false, // Cancel any ongoing grading
                error: null,
                // Clear previous answer/feedback if generating for the current sheet
                // This depends on whether we are generating for a truly "new" context or re-generating.
                // If currentSheetData reflects a blank sheet, these will be cleared by deriveStateFromSheetData.
                userAnswerText: (state.currentSheetData?.status === 'blank' || state.currentSheetData?.status === 'prompt_generated') ? '' : state.userAnswerText,
                currentFeedback: (state.currentSheetData?.status === 'blank' || state.currentSheetData?.status === 'prompt_generated') ? null : state.currentFeedback,
                currentImage: null, // Clear current image, new one will be fetched
                currentPrompt: null, // Clear current prompt
            };

        case 'FETCH_IMAGE_SUCCESS': // For immediate display of Pexels image before full prompt is ready
            return {
                ...state,
                // isLoadingImage: false, // Don't set to false yet, prompt is still loading
                currentImage: action.payload, // Display the fetched image
                error: null,
            };

        case 'GENERATE_PROMPT_SUCCESS': { // Called after Gemini generates prompt & DB is updated
            // The calling function should ideally dispatch LOAD_SHEET_SUCCESS with the updated sheet.
            // This action assumes payload contains data to form WritingPrompt and update currentSheetData.
            if (!state.currentSheetData || state.currentSheetId !== parseInt(action.payload.id, 10)) {
                // Mismatch, likely an outdated action. For safety, don't update.
                console.warn("GENERATE_PROMPT_SUCCESS: ID mismatch or no current sheet.");
                return state;
            }
            const updatedPromptData: Partial<WritingSheetData> = {
                promptImageUrl: action.payload.imageUrl,
                promptImageAltText: action.payload.imageAltText,
                promptText: action.payload.promptText,
                promptMandatoryKeyword1: action.payload.mandatoryKeyword1,
                promptMandatoryKeyword2: action.payload.mandatoryKeyword2,
                promptGeneratedAt: action.payload.createdAt.getTime(),
                status: 'prompt_generated',
            };
            const sheetWithGeneratedPrompt = { ...state.currentSheetData, ...updatedPromptData } as WritingSheetData;
            const derivedWithPrompt = deriveStateFromSheetData(sheetWithGeneratedPrompt);
            return {
                ...state,
                ...derivedWithPrompt,
                isLoadingImage: false, // Prompt and its image are now fully loaded
                isCreatingQuestion: false,
                error: null,
            };
        }

        case 'FETCH_IMAGE_FAILURE':
        case 'GENERATE_PROMPT_FAILURE':
            return {
                ...state,
                isLoadingImage: false,
                isCreatingQuestion: false,
                error: action.payload,
                // Potentially clear currentImage/currentPrompt if they were partially set
                currentImage: null,
                currentPrompt: null,
            };

        //------------------------------------------------------
        // Actions: User Answer and Grading
        //------------------------------------------------------
        case 'UPDATE_USER_ANSWER':
            return {
                ...state,
                userAnswerText: action.payload,
                // currentSheetData could also be updated here if auto-save is on:
                // currentSheetData: state.currentSheetData ? { ...state.currentSheetData, userAnswerText: action.payload } : null,
            };

        case 'SUBMIT_ANSWER_START':
            return {
                ...state,
                isLoadingGrade: true,
                error: null,
                currentFeedback: null, // Clear previous feedback
            };

        case 'SUBMIT_ANSWER_SUCCESS': { // Payload is GradedFeedback. DB is updated by calling function.
            // This action reflects the update in UI state.
            if (!state.currentSheetData || state.currentSheetId !== parseInt(action.payload.answerId, 10)) {
                console.warn("SUBMIT_ANSWER_SUCCESS: ID mismatch or no current sheet.");
                return state;
            }
            const updatedGradeData: Partial<WritingSheetData> = {
                gradeScore: action.payload.score,
                gradeFeedbackText: action.payload.feedbackText,
                gradeGrammarCorrections: action.payload.grammarCorrections?.map(gc => ({ explanation: gc.explanation ?? "", original: gc.original, suggestion: gc.suggestion })),
                gradeGradedAt: action.payload.gradedAt.getTime(),
                // userAnswerText is already in state.userAnswerText and should have been saved to DB
                // userAnswerSubmittedAt should also have been saved.
                status: 'graded',
            };
            // Create a new sheetData object with the merged information
            const sheetWithGrade = { ...state.currentSheetData, ...updatedGradeData } as WritingSheetData;
            const derivedWithGrade = deriveStateFromSheetData(sheetWithGrade);

            return {
                ...state,
                ...derivedWithGrade,
                isLoadingGrade: false,
                error: null,
            };
        }

        case 'SUBMIT_ANSWER_FAILURE':
            return {
                ...state,
                isLoadingGrade: false,
                error: action.payload,
            };

        //------------------------------------------------------
        // Actions: Miscellaneous
        //------------------------------------------------------
        case 'CLEAR_ERROR':
            return { ...state, error: null };

        default:
            // This default case can help catch unhandled actions if you use a library
            // or if you want to ensure all actions are explicitly handled.
            // For now, just returning state is fine.
            // const _exhaustiveCheck: never = action; // For exhaustive type checking
            return state;
    }
}


function deriveStateFromSheetData(sheetData: WritingSheetData | null): Partial<Pick<ToeicWritingPart1State, 'currentImage' | 'currentPrompt' | 'userAnswerText' | 'currentFeedback' | 'currentSheetData'>> {
    if (!sheetData) {
        return {
            currentImage: null, currentPrompt: null, userAnswerText: '',
            currentFeedback: null, currentSheetData: null,
        };
    }

    const prompt: WritingPart1Prompt | null = sheetData.promptText
        ? {
            id: sheetData.id.toString(), part: 1,
            imageUrl: sheetData.promptImageUrl, imageAltText: sheetData.promptImageAltText,
            promptText: sheetData.promptText,
            mandatoryKeyword1: sheetData.promptMandatoryKeyword1,
            mandatoryKeyword2: sheetData.promptMandatoryKeyword2,
            createdAt: sheetData.promptGeneratedAt ? new Date(sheetData.promptGeneratedAt) : new Date(sheetData.createdAt),
        } : null;

    const imageForDisplay: PexelsPhoto | null = sheetData.promptImageUrl
        ? ({
            id: sheetData.id, // Используем ID листа для простоты
            src: { original: sheetData.promptImageUrl, large: sheetData.promptImageUrl } as any, // Достаточно для ImageDisplay
            alt: sheetData.promptImageAltText || 'Hình ảnh đã tải',
            // Остальные поля PexelsPhoto не обязательны для отображения, если ImageDisplay их не требует
        } as PexelsPhoto) : null;

    const feedback: GradedFeedback | null = sheetData.gradeScore !== undefined && sheetData.gradeScore !== null
        ? {
            id: sheetData.id.toString(), answerId: sheetData.id.toString(),
            score: sheetData.gradeScore,
            feedbackText: sheetData.gradeFeedbackText || '',
            grammarCorrections: sheetData.gradeGrammarCorrections || [],
            gradedAt: sheetData.gradeGradedAt ? new Date(sheetData.gradeGradedAt) : new Date(sheetData.createdAt),
        } : null;

    return {
        currentImage: imageForDisplay,
        currentPrompt: prompt,
        userAnswerText: sheetData.userAnswerText || '',
        currentFeedback: feedback,
        currentSheetData: sheetData,
    };
}
