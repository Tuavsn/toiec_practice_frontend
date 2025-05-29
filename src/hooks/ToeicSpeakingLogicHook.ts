import { useCallback, useEffect, useMemo, useReducer } from "react";
import { fetchToeicSpeakingPrompts } from "../api/api";
import { ToeicSpeakingPartAction } from "../utils/types/action";
import { initialToeicSpeakingState } from "../utils/types/emptyValue";
import { FetchTaskContentFailurePayload, FetchTaskContentRequestPayload, FetchTaskContentSuccessPayload, SaveResponsePayload, ToeicSpeakingLoadedTask, ToeicSpeakingPartActionType, ToeicSpeakingPartState, ToeicSpeakingPracticeView, ToeicSpeakingPromptTask, ToeicSpeakingTaskType, ToeicSpeakingUserResponse, UseToeicSpeakingReturn } from "../utils/types/type";

function toeicSpeakingPartReducer(
  state: ToeicSpeakingPartState,
  action: ToeicSpeakingPartAction
): ToeicSpeakingPartState {
  // console.log("[useToeicSpeaking] Action dispatched:", action.type, action.payload); // Để debug
  switch (action.type) {
    case ToeicSpeakingPartActionType.LOAD_PROMPTS_REQUEST:
      return {
        ...state,
        isLoadingPrompts: true,
        overallError: undefined,
        tasks: [], // Xóa tasks cũ khi bắt đầu request mới
      };
    case ToeicSpeakingPartActionType.LOAD_PROMPTS_SUCCESS:
      const loadedTasksFromPrompts: ToeicSpeakingLoadedTask[] = action.payload.tasks.map(
        (task: ToeicSpeakingPromptTask) => ({
          ...task,
        })
      );
      return {
        ...state,
        isLoadingPrompts: false,
        tasks: loadedTasksFromPrompts,
        currentView: loadedTasksFromPrompts.length > 0 ? ToeicSpeakingPracticeView.INTRO : ToeicSpeakingPracticeView.INTRO,
        overallError: loadedTasksFromPrompts.length === 0 ? "Không có bài tập nào được tải." : undefined,
      };
    case ToeicSpeakingPartActionType.LOAD_PROMPTS_FAILURE:
      return {
        ...state,
        isLoadingPrompts: false,
        overallError: action.payload,
        currentView: ToeicSpeakingPracticeView.INTRO, // Bleibt im Intro oder zeigt einen globalen Fehler an
      };
    case ToeicSpeakingPartActionType.START_SIMULATION:
      if (state.tasks.length === 0) {
        return { ...state, overallError: "Không thể bắt đầu: Không có bài tập nào." };
      }
      const firstTask = state.tasks[0];
      let initialViewForFirstTask = ToeicSpeakingPracticeView.LOADING_TASK_CONTENT;

      if (firstTask && (firstTask.type !== ToeicSpeakingTaskType.DESCRIBE_PICTURE || firstTask.imageUrl)) {
        initialViewForFirstTask = ToeicSpeakingPracticeView.PREPARATION;
      }

      return {
        ...state,
        isTestInProgress: true,
        currentTaskIndex: 0,
        currentSubQuestionIndex: undefined,
        userResponses: [],
        overallError: undefined,
        currentView: initialViewForFirstTask, // Use determined view
      };
    case ToeicSpeakingPartActionType.PROCEED_TO_PREPARATION:
      return {
        ...state,
        currentView: ToeicSpeakingPracticeView.PREPARATION,
      };
    case ToeicSpeakingPartActionType.COMPLETE_SIMULATION:
      return {
        ...state,
        isTestInProgress: false,
        currentView: ToeicSpeakingPracticeView.SUMMARY,
      };
    case ToeicSpeakingPartActionType.RESET_SIMULATION:
      // Giữ lại tasks đã tải, chỉ reset trạng thái bài thi và view
      return {
        ...initialToeicSpeakingState,
        tasks: state.tasks,
        isLoadingPrompts: false, // Prompts are already loaded
        currentView: ToeicSpeakingPracticeView.INTRO,
      };
    case ToeicSpeakingPartActionType.SET_OVERALL_ERROR:
      return {
        ...state,
        overallError: action.payload,
      };
    case ToeicSpeakingPartActionType.CLEAR_OVERALL_ERROR:
      return {
        ...state,
        overallError: undefined,
      };
    // TODO: Implement other actions:
    // FETCH_TASK_CONTENT_REQUEST, FETCH_TASK_CONTENT_SUCCESS, FETCH_TASK_CONTENT_FAILURE
    // START_RECORDING, SAVE_RESPONSE
    // GET_AI_FEEDBACK_REQUEST, GET_AI_FEEDBACK_SUCCESS, GET_AI_FEEDBACK_FAILURE
    // NEXT_QUESTION_OR_TASK
    case ToeicSpeakingPartActionType.FETCH_TASK_CONTENT_REQUEST: {
      const { taskIndex } = action.payload as FetchTaskContentRequestPayload; // Type assertion
      if (!state.tasks[taskIndex]) return state; // Guard clause

      const updatedTasks = state.tasks.map((task, index) =>
        index === taskIndex
          ? { ...task, isContentLoading: true, contentError: undefined }
          : task
      );
      return {
        ...state,
        tasks: updatedTasks,
        // Important: Stay in or move to LOADING_TASK_CONTENT view for the current task
        currentView: ToeicSpeakingPracticeView.LOADING_TASK_CONTENT,
      };
    }
    case ToeicSpeakingPartActionType.FETCH_TASK_CONTENT_SUCCESS: {
      const { taskIndex, updatedProperties } = action.payload as FetchTaskContentSuccessPayload;
      if (!state.tasks[taskIndex]) return state;

      const updatedTasks = state.tasks.map((task, index) =>
        index === taskIndex
          ? { ...task, ...updatedProperties, isContentLoading: false }
          : task
      );
      return {
        ...state,
        tasks: updatedTasks,
        // After content is loaded successfully, move to PREPARATION
        currentView: ToeicSpeakingPracticeView.PREPARATION,
      };
    }
    case ToeicSpeakingPartActionType.FETCH_TASK_CONTENT_FAILURE: {
      const { taskIndex, error } = action.payload as FetchTaskContentFailurePayload;
      if (!state.tasks[taskIndex]) return state;

      const updatedTasks = state.tasks.map((task, index) =>
        index === taskIndex
          ? { ...task, isContentLoading: false, contentError: error }
          : task
      );
      return {
        ...state,
        tasks: updatedTasks,
        // Stay in LOADING_TASK_CONTENT to show error, or move to an error view for the task
        // For now, TaskPlayer will handle displaying the error within this view.
        currentView: ToeicSpeakingPracticeView.LOADING_TASK_CONTENT,
      };
    }
    case ToeicSpeakingPartActionType.START_RECORDING_PHASE:
      if (!state.isTestInProgress || !state.tasks[state.currentTaskIndex]) {
        console.error("Cannot start recording phase: Test not in progress or no current task.");
        return state; // Or set an error
      }
      return {
        ...state,
        currentView: ToeicSpeakingPracticeView.RECORDING,
      };
    case ToeicSpeakingPartActionType.SAVE_RESPONSE: {
      const payload = action.payload as SaveResponsePayload;
      const newResponse: ToeicSpeakingUserResponse = {
        responseId: payload.responseId, // Use the generated ID
        taskId: payload.taskId,
        subQuestionId: payload.subQuestionId,
        audioBlob: payload.audioBlob, // Store the Blob directly for now
        // audioUrl will be created on demand for playback later
        timestamp: payload.timestamp,
        // feedback will be added later
      };
      return {
        ...state,
        userResponses: [...state.userResponses, newResponse],
        // After saving, decide what's next. For now, let's placeholder this.
        // This should ideally dispatch NEXT_QUESTION_OR_TASK or COMPLETE_SIMULATION
        // currentView: ToeicSpeakingPracticeView.SOME_REVIEW_OR_NEXT_STATE, // Placeholder
      };
    }

    case ToeicSpeakingPartActionType.NEXT_QUESTION_OR_TASK: {
      // Basic logic to move to next task. Will need refinement for sub-questions.
      const nextTaskIndex = state.currentTaskIndex + 1;
      if (nextTaskIndex < state.tasks.length) {
        return {
          ...state,
          currentTaskIndex: nextTaskIndex,
          currentSubQuestionIndex: undefined, // Reset for new task
          currentView: ToeicSpeakingPracticeView.LOADING_TASK_CONTENT, // Start loading content for next task
        };
      } else {
        // All tasks completed
        return {
          ...state,
          isTestInProgress: false,
          currentView: ToeicSpeakingPracticeView.SUMMARY,
        };
      }
    }
    //------------------------------------------------------

    case ToeicSpeakingPartActionType.PROCEED_TO_PREPARATION:
      return {
        ...state,
        currentView: ToeicSpeakingPracticeView.PREPARATION,
      };
    case ToeicSpeakingPartActionType.COMPLETE_SIMULATION:
      // ... (same as before)
      return {
        ...state,
        isTestInProgress: false,
        currentView: ToeicSpeakingPracticeView.SUMMARY,
      };
    case ToeicSpeakingPartActionType.RESET_SIMULATION:
      // ... (same as before)
      return {
        ...initialToeicSpeakingState,
        tasks: state.tasks,
        isLoadingPrompts: false,
        currentView: ToeicSpeakingPracticeView.INTRO,
      };
    case ToeicSpeakingPartActionType.SET_OVERALL_ERROR:
      // ... (same as before)
      return {
        ...state,
        overallError: action.payload,
      };
    case ToeicSpeakingPartActionType.CLEAR_OVERALL_ERROR:
      // ... (same as before)
      return {
        ...state,
        overallError: undefined,
      };

    default:
      return state;
  }



}

export const useToeicSpeaking = (): UseToeicSpeakingReturn => {
  const [state, dispatch] = useReducer(toeicSpeakingPartReducer, initialToeicSpeakingState);

  // Effect để tải prompts khi hook được sử dụng lần đầu (component mount)
  useEffect(() => {
    let didCancel = false; // Biến cờ để tránh cập nhật state nếu component đã unmount

    const loadInitialPrompts = async () => {
      dispatch({ type: ToeicSpeakingPartActionType.LOAD_PROMPTS_REQUEST });
      const prompts = await fetchToeicSpeakingPrompts(); // Gọi API, không có try-catch ở đây

      if (didCancel) return;

      if (prompts) {
        dispatch({
          type: ToeicSpeakingPartActionType.LOAD_PROMPTS_SUCCESS,
          payload: { tasks: prompts },
        });
      } else {
        dispatch({
          type: ToeicSpeakingPartActionType.LOAD_PROMPTS_FAILURE,
          payload: 'Không thể tải danh sách bài tập. Vui lòng thử lại sau.',
        });
      }
    };

    loadInitialPrompts();

    return () => {
      didCancel = true; // Đặt cờ nếu component unmount trước khi fetch xong
    };
  }, []); // Mảng rỗng đảm bảo effect chỉ chạy một lần

  // Memoized action dispatchers
  const startSimulation = useCallback(() => {
    dispatch({ type: ToeicSpeakingPartActionType.START_SIMULATION });
  }, [dispatch]);

  const resetSimulation = useCallback(() => {
    dispatch({ type: ToeicSpeakingPartActionType.RESET_SIMULATION });
  }, [dispatch]);
  const completeSimulation = useCallback(() => {
    dispatch({ type: ToeicSpeakingPartActionType.COMPLETE_SIMULATION });
  }, []);

  const proceedToPreparation = useCallback(() => {
    dispatch({ type: ToeicSpeakingPartActionType.PROCEED_TO_PREPARATION });
  }, []);
  // Derived state and UI controls (useMemo for complex derivations if needed)
  const fetchDynamicContentForTask = useCallback(async (taskIndex: number): Promise<void> => {
    const task = state.tasks[taskIndex];
    if (!task || task.type !== 'describePicture' || task.imageUrl) {
      // No need to fetch if not a picture task, or image already loaded, or task doesn't exist
      // If content is already loaded or not needed, directly move to preparation
      dispatch({ type: ToeicSpeakingPartActionType.PROCEED_TO_PREPARATION });
      return;
    }

    dispatch({
      type: ToeicSpeakingPartActionType.FETCH_TASK_CONTENT_REQUEST,
      payload: { taskIndex },
    });

    // Simulate API call to Pexels using task.imageQuery
    // In a real scenario, this would be:
    // const imageUrl = await fetchPexelsImage(task.imageQuery); from ToeicSpeakingApi.ts
    // For now, simulate success/failure
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    const simulateSuccess = true; // 80% chance of success

    if (simulateSuccess) {
      const simulatedImageUrl = `https://picsum.photos/200/300?random=${task.imageQuery.replace(/\s+/g, '+')}`;
      dispatch({
        type: ToeicSpeakingPartActionType.FETCH_TASK_CONTENT_SUCCESS,
        payload: { taskIndex, updatedProperties: { imageUrl: simulatedImageUrl } },
      });
    } else {
      dispatch({
        type: ToeicSpeakingPartActionType.FETCH_TASK_CONTENT_FAILURE,
        payload: { taskIndex, error: `Không thể tải ảnh cho chủ đề: "${task.imageQuery}"` },
      });
    }
  }, [state.tasks]); // dispatch is stable, state.tasks is a dependency

  const startRecordingPhase = useCallback(() => {
    dispatch({ type: ToeicSpeakingPartActionType.START_RECORDING_PHASE });
  }, []);

  const saveResponse = useCallback((data: Omit<SaveResponsePayload, 'responseId' | 'timestamp'> & { audioBlob: Blob }) => {
    // Generate unique ID and timestamp here before dispatching
    dispatch({
      type: ToeicSpeakingPartActionType.SAVE_RESPONSE,
      payload: {
        ...data,
        responseId: `respond_${Math.random}_${Date.now()}`, // Generate a unique ID for the response
        timestamp: Date.now(),
      },
    });
    // After saving, automatically try to go to the next task or end the simulation
    // This behavior can be adjusted if manual progression is preferred after saving.
    dispatch({ type: ToeicSpeakingPartActionType.NEXT_QUESTION_OR_TASK });
  }, []);

  const goToNextTaskOrEnd = useCallback(() => {
    dispatch({ type: ToeicSpeakingPartActionType.NEXT_QUESTION_OR_TASK });
  }, []);


  const currentTask = useMemo(() => {
    if (state.tasks.length > 0 && state.currentTaskIndex >= 0 && state.currentTaskIndex < state.tasks.length) {
      return state.tasks[state.currentTaskIndex];
    }
    return undefined;
  }, [state.tasks, state.currentTaskIndex]);

  const isPromptsLoading = state.isLoadingPrompts;
  const isStartSimulationDisabled =
    isPromptsLoading || state.tasks.length === 0 || state.isTestInProgress;
  // NEW: Control flag for current task's content loading state
  const isCurrentTaskContentLoading = currentTask?.isContentLoading || false;

  return {
    viewState: {
      currentTaskIndex: state.currentTaskIndex,
      currentView: state.currentView,
      currentTask: currentTask,
      overallError: state.overallError,
      tasksCount: state.tasks.length,
      currentTaskNumber: state.isTestInProgress ? state.currentTaskIndex + 1 : 0,
    },
    uiControls: {
      isPromptsLoading: isPromptsLoading,
      isStartSimulationDisabled: isStartSimulationDisabled,
      isTestInProgress: state.isTestInProgress,
      isCurrentTaskContentLoading: isCurrentTaskContentLoading,
    },
    actions: {
      startSimulation,
      resetSimulation,
      fetchDynamicContentForTask,
      proceedToPreparation,
      completeSimulation,
      startRecordingPhase,
      saveResponse,
      goToNextTaskOrEnd,
    },
  };
};