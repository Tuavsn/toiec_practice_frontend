import { DataTableValue } from "primereact/datatable";
import { Dispatch, SetStateAction } from "react";
import { NavigateFunction } from "react-router-dom";
import { FullTestScreenState } from "./state";

export interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}
export interface Category extends CategoryRow {
  tests: Test[];
}

// Lecture Collection
export interface Lecture extends DataTableValue {
  id: LectureID;
  name: string | null;
  topic: Topic[];
  content: string | null;
  practiceQuestions: AssignmentQuestion[] | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export interface Topic {
  createdAt: Date,
  updatedAt: Date,
  id: TopicID,
  name: string,
  solution: string,
  overallSkill: "Từ vựng" | "Ngữ pháp",
  active: boolean
}

export interface UserComment {
  id: UserCommentID;
  text: string;
  email: string;
  userId: UserID;
}


export interface Assignment extends DataTableValue {
  required: number;
  totalQuestion: number;
  questionIds: string[];  // List of Question IDs
}

// Question Collection
export type QuestionRow = QuestionCore & DataTableValue & {
  id: QuestionID;
  parentId: QuestionID;
  testId: TestID;
  practiceId: string | null;
  difficulty: number;
  topic: Topic[];
  transcript?: string;
  explanation?: string;
  correctAnswer: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  subQuestions: QuestionRow[]; // Specific subQuestions type
};

export interface Resource extends DataTableValue {
  type: ResourceType;  // Resource type
  content: string;
}

// Result Collection
export interface Result extends DataTableValue {
  id: string;
  testId: string;
  user: User;  // Reference to User
  totalTime: number;
  totalReadingScore: number;
  totalListeningScore: number;
  totalCorrectAnswer: number;
  totalIncorrectAnswer: number;
  totalSkipAnswer: number;
  type: 'practice' | 'fulltest';
  parts: number[];  // Practice parts
  userAnswers: SingleUserAnswerOverview[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export type QuestionCore = {
  type: string;
  partNum: number;
  content: string;
  answers: string[];
  resources: Resource[];
  questionNum: QuestionNumber;
};
export type SingleUserAnswerOverview = QuestionCore & {
  answer: string;
  solution: string;
  correct: boolean;
  timeSpent: number;
  transcript: string;
  explanation: string;
  correctAnswer: string;
  questionId: QuestionID;
  listTopics: Topic[];
};

// Role Collection
export interface Role extends DataTableValue {
  createdAt: string;
  updatedAt: string;
  id: RoleID;
  name: string;
  description: string;
  permissions: Permission[];
  active: boolean;
}

export interface Permission extends DataTableValue {
  createdAt: Date;
  updatedAt: Date;
  id: PermissionID;
  name: string;
  apiPath: string;
  method: string;
  module: string;
  active: boolean;
}



export interface Test extends TestRow {
  category: Category;  // Reference to Category
}

export interface LectureRow {
  id: LectureID;
  name: string;
  topic: Topic[];
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

export interface User extends UserRow {
  refreshToken: string;
  testAttemptHistory: TestAttempt[];  // List of test attempts
  learningProgress: LearningProgress[];  // List of learning progress
}

export interface TestAttempt extends DataTableValue {
  testId: string;
  results: Result[];  // List of Results
}

export interface LearningProgress extends DataTableValue {
  lectures: Lecture[];  // List of Lectures
  isCompleted: boolean;
}

//-------------------------------------------------REQUEST RESPONE OBJECT----------------------------------------------------------------

export interface TableData<T> {
  meta: Meta;
  result: T[];
}

export interface Meta {
  current: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface WorkerResponse<T> {
  status: 'success' | 'error';
  data: T;
  message: string;
}

export interface ApiResponse<T> {
  statusCode: number,
  message: string,
  data: T,
  error: string,
}

export interface PracticeTitle {
  title: string;
  isCompleted: boolean
}

export interface CategoryLabel {
  format: string;
  year: number[];
}

export interface LectureCard {
  id: string,
  name: string,
  topic: string[],
  percent: number,
}

export interface LectureProfile {
  notCompleted: LectureCard[],
  completed: LectureCard[],
}

export interface TestCard {
  id: string;
  format: string;
  year: number;
  name: string;
  completed: boolean,
  totalUser: number,
}

export interface CategoryRow extends DataTableValue {
  id: string;
  format: string;
  year: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Test Collection
export interface TestRow extends DataTableValue {
  id: string;
  name: string;
  totalUserAttempt: number;
  totalQuestion: number;
  totalScore: number;
  idCategory: string;
  limitTime: number;
  difficulty: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// User Collection
export interface UserRow extends DataTableValue {
  id: UserID;
  email: string;
  role: Role;
  target: number;
  active: boolean;
}


export interface UserResultRow {
  id: ResultID,
  createdAt: Date,
  totalCorrectAnswer: number,
  totalTime: number,
  type: TestType;
  parts: number[];  // Practice parts
}

export type UserDetailResultRow = {
  createdAt: Date; // ISO 8601 date string
  testId: TestID;
  resultId: ResultID;
  testName: string;
  result: string; // "1/200" format
  totalTime: number; // Total time in seconds
  totalReadingScore: number;
  totalListeningScore: number;
  totalCorrectAnswer: number;
  totalIncorrectAnswer: number;
  totalSkipAnswer: number;
  type: TestType; // E.g., "fulltest"
  parts: string;
}

export interface TestPaper {
  totalQuestion: number,
  listMultipleChoiceQuestions: MultipleChoiceQuestion[]
}

export type QuestionAnswerRecord = QuestionCore & {
  flag: boolean;
  pageIndex: number;
  userAnswer: string;
  timeSpent: milisecond;
  questionId: QuestionID;
  subQuestions: QuestionAnswerRecord[];
};

export type Question_PageIndex = QuestionCore & {
  pageIndex: number;
  questionId: QuestionID;
  subQuestions: Question_PageIndex[];
};

export interface TestPaperRecord {
  totalQuestion: number,
  listMultipleChoiceQuestions: QuestionAnswerRecord[]
}




export interface SelectedQuestionDialogTestOverallPage {
  body: JSX.Element | null;
  title: JSX.Element | null;
}
export interface QuestionPage {
  questionNum: QuestionNumber,
  part: number,
  page: number,
}


export interface AnswerData {
  questionId: QuestionID,
  userAnswer: string,
}

export type TestRecord = {
  totalSeconds: number;
  testId: string;
  parts: string;
  userAnswer: AnswerRecord[];
  type: TestType
}
export interface TestDetailPageData {
  id: string;
  name: string;
  totalUserAttempt: number;
  totalQuestion: number;
  totalScore: number;
  limitTime: number;
  resultsOverview: ResultOverview[];
  topicsOverview: TopicOverview[];
}
export type TopicStat = {
  topic: Topic; // Assuming Topic is another type or interface
  totalCorrect: number;
  totalIncorrect: number;
  averageTime: number;
  timeCount: number;
  totalTime: number;
};
export type OverallStat = {
  averageListeningScore: number;
  listeningScoreCount: number;
  averageReadingScore: number;
  readingScoreCount: number;
  averageTotalScore: number;
  totalScoreCount: number;
  averageTime: number;
  timeCount: number;
  highestScore: number;
};
export type SkillStat = {
  skill: string; // "listening", "reading", etc.
  totalCorrect: number;
  totalIncorrect: number;
  totalTime: number;
};
export interface ResultOverview {
  createdAt: Date; // Use ISO string for Instant in Java
  result: ResultID; // e.g., "x/200", "x/30"
  totalTime: number;
  totalReadingScore: number;
  totalListeningScore: number;
  totalCorrectAnswer: number;
  totalIncorrectAnswer: number;
  totalSkipAnswer: number;
  type: TestType;
  parts: string; // "Practice parts"
}

export interface TopicOverview {
  partNum: number;
  topicNames: string[];
}

export type TestResultSummary = {
  testName: string;
  id: ResultID;
  testId: TestID;
  totalTime: number;
  totalReadingScore: number;
  totalListeningScore: number;
  totalCorrectAnswer: number;
  totalIncorrectAnswer: number;
  totalSkipAnswer: number;
  type: TestType;
  parts: string;
  userAnswers: SingleUserAnswerOverview[];
}

// export interface AssignmentPaper {
//   totalQuestions: number,
//   active: boolean,
//   createdAt: Date,
//   updatedAt: Date,
//   id: string,
//   name: string|null,
//   content: string|null,
//   tocpic: Topic[],
//   practiceQuestions: AssignmentQuestion[]
// }

export interface PracticeQuestion {
  id: QuestionID;
  type: QuestionType;
  subQuestions: PracticeQuestion[];
  content: string;
  resources: Resource[];
  transcript: string;
  explanation: string;
  answers: string[];
  correctAnswer: string;
}

export interface AssignmentQuestion {

  content: string,
  resources: Resource[],
  transcript: string,
  explanation: string,
  answers: string[],
  correctAnswer: string
}


export interface UserAnswerRecord {
  questionId: QuestionID;
  parentId: QuestionID;
  listTopics: Topic[];
  userAnswer: string;
  solution: string | null;
  correct: boolean;
  timeSpent: number;
  questionNum: QuestionNumber;
  partNum: number;
  type: QuestionType;
  content: string;
  difficulty: number;
  resources: Resource[];
  transcript: string;
  explanation: string;
  answers: string[];
  correctAnswer: string;
  subUserAnswer: UserAnswerRecord[];
}

export type MultipleChoiceQuestion = QuestionCore & {
  subQuestions: MultipleChoiceQuestion[];
  id: QuestionID;
};

export interface SuggestionsForUser {
  title: string;
  content: string;
}

export interface UpdateQuestionForm {
  id: QuestionID;
  content: string;
  difficulty: number;
  listTopicIds: TopicID[];
  transcript: string;
  explanation: string;
  answers: string[];
  correctAnswer: string;
}
export interface UpdateAssignmentQuestionForm {
  content: string;
  questionNum: QuestionNumber;
  transcript: string;
  explanation: string;
  answers: string[];
  correctAnswer: string;
}

export type RecommendLecture = {
  id: string,
  explanation: string,
  lectureId: string,
  name: string
}
export type RecommendTest = {
  id: string,
  explanation: string,
  name: string,
  testId: string,
}

export type RecommendDoc = {
  userId: string,
  recommendedLectures: RecommendLecture[],
  recommendedTests: RecommendTest[],
}

export interface UpdateLectureForm {
  id: LectureID;
  name: string;
  topicIds: TopicID[];
}

export interface RelateLectureTitle {
  id: LectureID,
  name: string,
}
export interface CommentPage {
  result: Comment_t[]
  meta: Meta
}


export interface CreateCommentRequest {
  targetType: TargetType
  targetId: string
  parentId?: string
  content: string
  mentionedUserIds?: string[]
}

export interface DeleteCommentRequest {
  reason: string,
  reasonTag: DeleteReasonTag,

}

export enum TargetType {
  TEST = "TEST",
  LESSON = "LECTURE",
}

export enum DeleteReason {
  VIOLATE_COMMUNITY_STANDARDS = "VIOLATE_COMMUNITY_STANDARDS",
  USER_DELETE = "USER_DELETE",
  ADMIN_DELETE = "ADMIN_DELETE",
}


export interface ScoresPayload {
  prob_insult: number
  prob_threat: number
  prob_hate_speech: number
  prob_spam: number
  prob_severe_toxicity: number
  prob_obscene: number
}

/**
 * @en Payload for creating a new comment report.
 * @vi Dữ liệu (payload) để tạo một báo cáo bình luận mới.
 */
export interface CreateCommentReportPayload {
  /**
   * @en The ID of the comment being reported. This will be part of the URL path in the API request.
   * @vi ID của bình luận bị báo cáo. Trường này sẽ là một phần của đường dẫn URL trong yêu cầu API.
   * @note Your interface has `reportedCommentId` here. If `commentId` is already in the URL like `POST /comments/{commentId}/reports`,
   * then this field might be redundant in the payload. I'm keeping it as per your structure.
   * If `commentId` is in URL, this could be omitted from payload.
   */
  reportedCommentId: string;

  /**
   * @en The user ID of the person submitting the report.
   * @vi ID của người dùng gửi báo cáo.
   * @note This is often determined by the backend from the authenticated session/token and might not be needed in the request payload from the client.
   * I'm keeping it as per your structure.
   */
  reasonCategory: CommentReportReasonCategory;

  /**
   * @en Additional details provided by the reporter, especially if 'reasonCategory' is OTHER.
   * @vi Chi tiết bổ sung do người báo cáo cung cấp, đặc biệt nếu 'reasonCategory' là OTHER.
   * @note Bắt buộc nếu reasonCategory là OTHER, tùy chọn cho các lý do khác (Required if reasonCategory is OTHER, optional otherwise).
   */
  reasonDetails?: string;

  /**
   * @en The type of page/context where the reported comment exists.
   * @vi Loại trang/bối cảnh nơi bình luận bị báo cáo tồn tại.
   */
  commentContextType: TargetType; // Renamed from commentOnPageTestOrLecture for clarity

  /**
   * @en The specific ID related to the commentContextType (e.g., if LECTURE, this could be lectureId).
   * @vi ID cụ thể liên quan đến commentContextType (ví dụ: nếu là LECTURE, đây có thể là ID bài giảng).
   * @note This was `relateId` in your `CommentReport_t`. Added here for consistency if it's known at report creation.
   * If this is derived by the backend from `reportedCommentId`, it might not be needed in payload.
   */
  commentContextId: string; // Renamed from `relateId` for clarity and consistency
}

/**
 * @en Represents a complete comment report object, typically as stored in the database or returned by the API.
 * @vi Đại diện cho một đối tượng báo cáo bình luận hoàn chỉnh, thường được lưu trữ trong cơ sở dữ liệu hoặc được API trả về.
 */
export interface CommentReport { // Renamed from CommentReport_t to follow common type naming (PascalCase without _t)
  /**
   * @en Unique identifier for the report itself.
   * @vi Mã định danh duy nhất cho chính báo cáo này.
   */
  id: string;

  /**
   * @en ID of the comment that was reported.
   * @vi ID của bình luận đã bị báo cáo.
   */
  reportedCommentId: string; // Renamed from commentIdThatBeingReported for clarity

  /**
   * @en ID of the user who submitted the report.
   * @vi ID của người dùng đã gửi báo cáo.
   */
  reporterUserId: string; // Renamed from reportedByUserId for consistency

  /**
   * @en The type of page/context where the reported comment existed.
   * @vi Loại trang/bối cảnh nơi bình luận bị báo cáo đã tồn tại.
   */
  commentContextType: TargetType; // Renamed from commentOnPageTestOrLecture

  /**
   * @en The specific ID related to the commentContextType (e.g., LECTURE ID, TEST ID).
   * @vi ID cụ thể liên quan đến commentContextType (ví dụ: ID bài giảng, ID bài kiểm tra).
   */
  commentContextId: string; // Renamed from relateId for clarity

  /**
   * @en The category classifying the reason for the report.
   * @vi Danh mục phân loại lý do báo cáo.
   */
  reasonCategory: CommentReportReasonCategory;

  /**
   * @en Optional additional details provided by the reporter.
   * @vi Chi tiết bổ sung tùy chọn do người báo cáo cung cấp.
   */
  reasonDetails?: string;

  /**
   * @en Current administrative status of the report.
   * @vi Trạng thái quản lý hiện tại của báo cáo.
   */
  status: CommentReportStatus;

  /**
   * @en (Optional) ID of the administrator who reviewed and processed this report.
   * @vi (Tùy chọn) ID của quản trị viên đã xem xét và xử lý báo cáo này.
   */
  reviewedByAdminId?: string;

  /**
   * @en (Optional) Notes or comments made by the administrator during the review.
   * @vi (Tùy chọn) Ghi chú hoặc nhận xét của quản trị viên trong quá trình xem xét.
   */
  adminNotes?: string;

  /**
   * @en Timestamp indicating when the report was created (ISO 8601 format string).
   * @vi Dấu thời gian cho biết khi nào báo cáo được tạo (chuỗi định dạng ISO 8601).
   */
  createdAt: string;

  /**
   * @en Timestamp indicating the last time the report was updated (ISO 8601 format string).
   * @vi Dấu thời gian cho biết lần cuối cùng báo cáo được cập nhật (chuỗi định dạng ISO 8601).
   */
  updatedAt: string;

  /**
   * @en (Optional) Machine learning prediction probability for insult. Value between 0 and 1.
   * @vi (Tùy chọn) Xác suất dự đoán bởi máy học cho nội dung xúc phạm. Giá trị từ 0 đến 1.
   */
  probInsult?: number; // Kept your original field name

  /**
   * @en (Optional) Machine learning prediction probability for threat. Value between 0 and 1.
   * @vi (Tùy chọn) Xác suất dự đoán bởi máy học cho nội dung đe dọa. Giá trị từ 0 đến 1.
   */
  probThreat?: number;

  /**
   * @en (Optional) Machine learning prediction probability for hate speech. Value between 0 and 1.
   * @vi (Tùy chọn) Xác suất dự đoán bởi máy học cho ngôn từ gây thù ghét. Giá trị từ 0 đến 1.
   */
  probHateSpeech?: number;

  /**
   * @en (Optional) Machine learning prediction probability for spam. Value between 0 and 1.
   * @vi (Tùy chọn) Xác suất dự đoán bởi máy học cho nội dung rác. Giá trị từ 0 đến 1.
   */
  probSpam?: number;

  /**
   * @en (Optional) Machine learning prediction probability for severe toxicity. Value between 0 and 1.
   * @vi (Tùy chọn) Xác suất dự đoán bởi máy học cho mức độ độc hại nghiêm trọng. Giá trị từ 0 đến 1.
   */
  probSevereToxicity?: number;

  /**
   * @en (Optional) Machine learning prediction probability for obscene content. Value between 0 and 1.
   * @vi (Tùy chọn) Xác suất dự đoán bởi máy học cho nội dung tục tĩu. Giá trị từ 0 đến 1.
   */
  probObscene?: number;
}

export type DeleteReasonTag = "VIOLATE_COMMUNITY_STANDARDS" | "USER_DELETE" | "ADMIN_DELETE"

export enum CommentReportReasonCategory {
  /**
   * @en Unsolicited or irrelevant messages, often commercial or repetitive.
   * @vi Tin nhắn không mong muốn hoặc không liên quan, thường mang tính thương mại hoặc lặp đi lặp lại.
   */
  SPAM = "SPAM",
  /**
   * @en Language that attacks or demeans a group based on attributes like race, religion, ethnic origin, gender, disability, or sexual orientation.
   * @vi Ngôn ngữ tấn công hoặc hạ thấp một nhóm người dựa trên các thuộc tính như chủng tộc, tôn giáo, nguồn gốc dân tộc, giới tính, khuyết tật, hoặc xu hướng tính dục.
   */
  HATE_SPEECH = "HATE_SPEECH",
  /**
   * @en Unwanted conduct, bullying, or targeting of an individual.
   * @vi Hành vi không mong muốn, bắt nạt, hoặc nhắm mục tiêu vào một cá nhân.
   */
  HARASSMENT = "HARASSMENT",
  /**
   * @en Content that depicts or encourages violence, or makes credible threats of harm.
   * @vi Nội dung mô tả hoặc khuyến khích bạo lực, hoặc đưa ra những lời đe dọa gây hại đáng tin cậy.
   */
  VIOLENCE_OR_THREATS = "VIOLENCE_THREATS", // Changed from VIOLENCE_THREATS for clarity
  /**
   * @en False or inaccurate information that has the potential to cause harm.
   * @vi Thông tin sai lệch hoặc không chính xác có khả năng gây hại.
   */
  HARMFUL_MISINFORMATION = "HARMFUL_MISINFORMATION", // Changed from MISINFORMATION_HARMFUL
  /**
   * @en Content that promotes or glorifies self-harm or suicide.
   * @vi Nội dung quảng bá hoặc tôn vinh hành vi tự làm hại bản thân hoặc tự tử.
   */
  SELF_HARM_OR_SUICIDE = "SELF_HARM_OR_SUICIDE", // Changed from SELF_HARM_SUICIDE
  /**
   * @en Pretending to be someone else, or a fake account.
   * @vi Giả vờ là người khác, hoặc một tài khoản giả mạo.
   */
  IMPERSONATION = "IMPERSONATION",
  /**
   * @en Content that infringes on someone else's copyright.
   * @vi Nội dung vi phạm bản quyền của người khác.
   */
  COPYRIGHT_INFRINGEMENT = "COPYRIGHT_INFRINGEMENT",
  /**
   * @en Content that endangers or exploits children.
   * @vi Nội dung gây nguy hiểm hoặc bóc lột trẻ em.
   */
  CHILD_SAFETY_ISSUES = "CHILD_SAFETY_ISSUES", // Changed from CHILD_SAFETY
  /**
   * @en Sharing private or intimate images/videos of someone without their consent.
   * @vi Chia sẻ hình ảnh/video riêng tư hoặc thân mật của ai đó mà không có sự đồng ý của họ.
   */
  NON_CONSENSUAL_CONTENT = "NON_CONSENSUAL_CONTENT",
  /**
   * @en For reasons not covered by other categories; requires specific details.
   * @vi Dành cho các lý do không được bao gồm trong các danh mục khác; yêu cầu cung cấp chi tiết cụ thể.
   */
  OTHER = "OTHER",
  MISINFORMATION_HARMFUL = "MISINFORMATION_HARMFUL",
}


/**
 * Trạng thái của một báo cáo bình luận.
 * Được sử dụng bởi quản trị viên để theo dõi và quản lý.
 * (Status of a comment report. Used by administrators for tracking and management.)
 */
export enum CommentReportStatus {
  /**
   * @en Report has been submitted and is awaiting review.
   * @vi Báo cáo đã được gửi và đang chờ duyệt.
   */
  PENDING_REVIEW = "PENDING_REVIEW",
  /**
   * @en Report is currently being actively reviewed by an administrator.
   * @vi Báo cáo hiện đang được quản trị viên xem xét.
   */
  UNDER_REVIEW = "UNDER_REVIEW",
  /**
   * @en Report has been reviewed, and appropriate action has been taken (e.g., comment hidden/deleted).
   * @vi Báo cáo đã được xem xét và hành động phù hợp đã được thực hiện (ví dụ: ẩn/xóa bình luận).
   */
  ACTION_TAKEN = "ACTION_TAKEN",
  /**
   * @en Report has been reviewed, and no action was deemed necessary (e.g., report was invalid or comment did not violate policies).
   * @vi Báo cáo đã được xem xét và không có hành động nào được cho là cần thiết (ví dụ: báo cáo không hợp lệ hoặc bình luận không vi phạm chính sách).
   */
  NO_ACTION_NEEDED = "NO_ACTION_NEEDED",
}

export interface Comment_t {
  id: string,
  content: string,
  userId: string,
  userDisplayName: string,
  userAvatarUrl: string,
  parentId: string,
  rootId: string,
  mentionedUserIds: string[],
  targetType: TargetType,
  targetId: string,
  likeCounts: number,
  directReplyCount: number,
  level: number,
  deleted: true,
  deleteReasonTag: DeleteReason,
  deleteReason: string,
  createdAt: string,
  active: true,
  probInsult: number,
  probThreat: number,
  probHateSpeech: number,
  probSpam: number,
  probSevereToxicity: number,
  probObscene: number,
  likedByCurrentUser: true
}

export interface ScoresPayload {
  prob_insult: number
  prob_threat: number
  prob_hate_speech: number
  prob_spam: number
  prob_severe_toxicity: number
  prob_obscene: number
}

export interface DoTestFunction {
  updateTimeSpentOnEachQuestionInCurrentPage: () => void;
  setIsOnTest: Dispatch<SetStateAction<boolean>>;
  changePage: (offset: number) => void;
  startTest: () => void;
  navigate: NavigateFunction;
}



export interface TopicRecord extends DataTableValue {
  topic: string,
  correctCount: number,
  wrongCount: number,
  correctPercent: number,
}


export type AnswerRecord = AnswerData & {
  timeSpent: milisecond;
}




export interface QuestionContext {
  ask?: string
  choices?: string[]
  correctChoice?: string
  transcript?: string
  explanation?: string
}
export type ResourceIndex = Resource & {
  index: number,
  file: File | null,
}

export interface QuestionListByPart {
  questionList: Question_PageIndex[],
  totalQuestions: number,
}

/**
 * @en Payload for updating the status of a comment report by an admin.
 * @vi Dữ liệu (payload) để quản trị viên cập nhật trạng thái của một báo cáo bình luận.
 */
export interface UpdateCommentReportStatusPayload {
  status: CommentReportStatus;
  adminNotes?: string; // Ghi chú của quản trị viên (Admin's notes)
}
export interface ReportTableFilters {
  status?: CommentReportStatus | null;
  reasonCategory?: CommentReportReasonCategory | null;
  reportedByUserId?: string | null;
  commentId?: string | null;
}
export type TestSheet = {
  questionList: QuestionAnswerRecord[],
  timeCountStart: milisecond,
  totalQuestions: number,
  answeredCount: number,
  secondsLeft: number,
  testType: TestType,
}


/**
 * @type WritingSheetStatus
 * @description Defines the possible states of a practice sheet.
 * - 'blank': Newly created, no prompt yet. Ready for "Tạo đề mới".
 * - 'prompt_generated': Prompt is available, awaiting user's answer.
 * - 'answered': User has submitted an answer, awaiting grading. (May be a brief state if grading is auto)
 * - 'graded': Grading is complete, feedback is available.
 */
export type WritingSheetStatus = 'blank' | 'prompt_generated' | 'answered' | 'graded';

/**
 * @interface WritingSheetData
 * @description Defines the structure for a single practice sheet stored in IndexedDB.
 * This will use a flat structure as requested.
 */
export interface WritingSheetData {
  id: number; // Auto-incrementing primary key, also used as page number
  status: WritingSheetStatus;
  createdAt: number; // Timestamp (Date.now()) for creation and sorting

  // Prompt related fields (populated when status is 'prompt_generated' or later)
  promptImageUrl?: string;
  promptImageAltText?: string;
  promptText?: string; // Main instruction text including keywords
  promptMandatoryKeyword1?: string;
  promptMandatoryKeyword2?: string;
  promptGeneratedAt?: number; // Timestamp

  // User Answer related fields (populated when status is 'answered' or 'graded')
  userAnswerText?: string;
  userAnswerSubmittedAt?: number; // Timestamp

  // Grade/Feedback related fields (populated when status is 'graded')
  gradeScore?: number;
  gradeFeedbackText?: string; // In Vietnamese
  gradeGrammarCorrections?: Array<{ // As defined in GradedFeedback
    original: string;
    suggestion: string;
    explanation: string; // In Vietnamese
  }>;
  gradeGradedAt?: number; // Timestamp
}

/**
 * @interface PexelsPhotoSource
 * @description Định nghĩa cấu trúc nguồn của ảnh từ Pexels.
 */
export interface PexelsPhotoSource {
  original: string; // URL ảnh gốc
  large2x: string; // URL ảnh lớn 2x
  large: string; // URL ảnh lớn
  medium: string; // URL ảnh trung bình
  small: string; // URL ảnh nhỏ
  portrait: string; // URL ảnh dọc
  landscape: string; // URL ảnh ngang
  tiny: string; // URL ảnh rất nhỏ
}

/**
 * @interface PexelsPhoto
 * @description Định nghĩa cấu trúc dữ liệu một ảnh từ Pexels.
 */
export interface PexelsPhoto {
  id: number; // ID của ảnh
  width: number; // Chiều rộng ảnh
  height: number; // Chiều cao ảnh
  url: string; // URL trang Pexels của ảnh
  photographer: string; // Tên nhiếp ảnh gia
  photographer_url: string; // URL trang Pexels của nhiếp ảnh gia
  photographer_id: number; // ID nhiếp ảnh gia
  avg_color: string; // Màu trung bình của ảnh (hex code)
  src: PexelsPhotoSource; // Các nguồn ảnh với kích thước khác nhau
  alt: string; // Mô tả thay thế cho ảnh (thường là mô tả ngắn gọn)
}

/**
* @interface PexelsSearchResponse
* @description Cấu trúc response từ Pexels search API.
*/
export interface PexelsSearchResponse {
  photos: PexelsPhoto[];
  page: number;
  per_page: number;
  total_results: number;
  next_page?: string;
}

/**
 * @interface WritingPart1Prompt
 * @description Định nghĩa cấu trúc của một đề bài viết.
 */
export interface WritingPart1Prompt {
  id: string; // ID duy nhất của đề bài (có thể tạo bằng UUID)
  part: 1 | 2 | 3; // Phần thi TOEIC (1: Miêu tả tranh, 2: Viết email, 3: Viết luận)
  imageUrl?: string; // URL hình ảnh cho Part 1
  imageAltText?: string; // Mô tả hình ảnh (quan trọng cho accessibility và có thể là một phần của prompt)
  promptText: string; // Nội dung đề bài do LLM tạo ra
  mandatoryKeyword1?: string; // First mandatory word/phrase
  mandatoryKeyword2?: string; // Second mandatory word/phrase
  createdAt: Date; // Ngày tạo
}

/**
 * @interface ImageKeywords
 * @description Defines the structure for two keywords extracted from an image.
 */
export interface ImageKeywords {
  keyword1: string;
  keyword2: string;
}

/**
 * @interface UserAnswer
 * @description Định nghĩa cấu trúc bài làm của người dùng.
 */
export interface UserAnswer {
  id: string; // ID duy nhất của bài làm
  promptId: string; // ID của đề bài tương ứng
  text: string; // Nội dung bài làm của người dùng
  submittedAt: Date; // Ngày nộp bài
  isAutoSaved?: boolean; // Đánh dấu nếu đây là bản lưu tự động
}

/**
 * @interface GradedFeedback
 * @description Định nghĩa cấu trúc phản hồi và điểm số sau khi chấm bài.
 */
export interface GradedFeedback {
  id: string; // ID duy nhất của feedback
  answerId: string; // ID của bài làm tương ứng
  score: number; // Điểm số (ví dụ: 0-5 cho Part 1)
  feedbackText: string; // Nhận xét chi tiết từ LLM
  grammarCorrections?: Array<{
    original: string; // Phần văn bản gốc có lỗi
    suggestion: string; // Gợi ý sửa lỗi
    explanation?: string; // Giải thích (nếu có)
  }>; // Danh sách sửa lỗi ngữ pháp
  gradedAt: Date; // Ngày chấm bài
}

export interface ImageDataWithMimeType {
  base64Data: string;
  mimeType: string;
}

export interface GeminiSafetyRating {
  category: string;
  probability: string;
}

export interface GeminiCandidate {
  content: {
    parts: Array<{ text: string }>;
    role: string;
  };
  finishReason: string;
  index: number;
  safetyRatings: GeminiSafetyRating[];
}

export interface GeminiResponse {
  candidates?: GeminiCandidate[];
  promptFeedback?: {
    safetyRatings: GeminiSafetyRating[];
  };
  // Thêm các trường khác nếu có, ví dụ error
  error?: {
    code: number;
    message: string;
    status: string;
  }
}

export type UIWritingPart1Control = {
  isFetchingInitialData: boolean;
  isGenerateNewPromptButtonLoading: boolean;
  isGenerateNewPromptButtonDisabled: boolean;
  shouldShowImageSkeleton: boolean;
  shouldShowPromptSkeleton: boolean;
  isAnswerAreaDisabled: boolean;
  isSubmitAnswerButtonLoading: boolean;
  isSubmitAnswerButtonDisabled: boolean;
  shouldRenderGradeDisplay: boolean;
}

/**
 * @interface WritingToeicPart2Prompt
 * @description Định nghĩa cấu trúc của một đề bài email cho Part 2.
 * Đề bài thường là một email yêu cầu người dùng phản hồi, giải quyết vấn đề hoặc cung cấp thông tin.
 */
export interface WritingToeicPart2Prompt {
  // Mã định danh duy nhất cho đề bài (có thể dùng id của SheetData)
  id: string;
  // Loại phần thi (luôn là 2 cho Part 2)
  part: 2;
  // Email nhận được (đề bài)
  receivedEmail: {
    senderName: string; // Tên người gửi
    senderEmail: string; // Email người gửi
    recipientName?: string;
    subject: string; // Tiêu đề email
    body: string; // Nội dung email người dùng nhận được
    // Các yêu cầu cụ thể hoặc câu hỏi trong email mà người dùng cần trả lời
    tasks: string[]; // Ví dụ: ["Hỏi về giá sản phẩm X", "Đề xuất một cuộc họp"]
  };
  // Hướng dẫn chung cho người dùng (ví dụ: "Đọc email và viết thư trả lời.")
  instructionText: string;
  recipientPersonaDescription: string;
  // Thời gian tạo đề bài (timestamp)
  generatedAt: number;
}

/**
 * @interface WritingToeicPart2UserAnswer
 * @description Định nghĩa cấu trúc email trả lời của người dùng.
 * (Thực tế, đây có thể chỉ là một chuỗi string, nhưng để mở rộng có thể làm thành object)
 */
export interface WritingToeicPart2UserAnswer {
  // Mã định danh của câu trả lời (có thể dùng id của SheetData)
  id: string;
  // Nội dung email người dùng soạn thảo
  responseText: string;
  // Thời gian nộp bài (timestamp)
  submittedAt: number;
}

/**
 * @interface WritingToeicPart2GrammarCorrection
 * @description Cấu trúc cho một lỗi ngữ pháp và gợi ý sửa.
 * Tương tự Part 1, nhưng có thể có thêm các yếu tố đặc thù cho email.
 */
export interface WritingToeicPart2GrammarCorrection {
  // Phần văn bản gốc có lỗi (tiếng Anh)
  original: string;
  // Gợi ý sửa lỗi (tiếng Anh)
  suggestion: string;
  // Giải thích lỗi (bằng tiếng Việt)
  explanation: string;
  // Loại lỗi (ví dụ: 'Grammar', 'Vocabulary', 'Tone') - tùy chọn
  errorType?: string;
}

/**
 * @interface WritingToeicPart2GradedFeedback
 * @description Định nghĩa cấu trúc phản hồi và điểm số sau khi chấm email Part 2.
 */
export interface WritingToeicPart2GradedFeedback {
  // Mã định danh của feedback (có thể dùng id của SheetData)
  id: string;
  // Mã định danh của câu trả lời tương ứng (có thể dùng id của SheetData)
  answerId: string;
  // Điểm số (ví dụ: 0-4 cho Part 2, tùy theo thang điểm TOEIC)
  score: number;
  // Nhận xét chi tiết từ LLM (bằng tiếng Việt)
  // Tập trung vào: hoàn thành yêu cầu, rõ ràng, tổ chức, từ vựng, ngữ pháp, văn phong email.
  feedbackText: string;
  // Danh sách sửa lỗi ngữ pháp hoặc gợi ý cải thiện từ vựng/văn phong
  corrections?: WritingToeicPart2GrammarCorrection[];
  // Thời gian chấm bài (timestamp)
  gradedAt: number;
}

/**
 * @type WritingToeicPart2SheetStatus
 * @description Định nghĩa các trạng thái có thể có của một bài thực hành Part 2.
 * - 'blank': Mới tạo, chưa có đề bài.
 * - 'prompt_generated': Đề bài (email) đã có, chờ người dùng trả lời.
 * - 'answered': Người dùng đã nộp email trả lời, chờ chấm điểm.
 * - 'graded': Đã chấm điểm, có phản hồi.
 */
export type WritingToeicPart2SheetStatus = 'blank' | 'prompt_generated' | 'answered' | 'graded';

/**
 * @interface WritingToeicPart2SheetData
 * @description Định nghĩa cấu trúc cho một bài thực hành Part 2 lưu trong IndexedDB.
 */
export interface WritingToeicPart2SheetData {
  // ID tự tăng, cũng là số thứ tự bài làm
  id: number;
  // Trạng thái của bài làm
  status: WritingToeicPart2SheetStatus;
  // Thời gian tạo bài làm (timestamp)
  createdAt: number;

  // --- Dữ liệu đề bài ---
  // Email nhận được (đề bài)
  promptReceivedEmailSenderName?: string;
  promptReceivedEmailSenderEmail?: string;
  promptRecipientName?: string;
  promptReceivedEmailSubject?: string;
  promptReceivedEmailBody?: string;
  promptReceivedEmailTasks?: string[]; // Mảng các yêu cầu
  // Hướng dẫn chung
  promptInstructionText?: string;
  // Thời gian tạo đề bài
  promptGeneratedAt?: number;

  // --- Dữ liệu câu trả lời của người dùng ---
  userAnswerText?: string;
  userAnswerSubmittedAt?: number;

  // --- Dữ liệu điểm và phản hồi ---
  gradeScore?: number;
  gradeFeedbackText?: string; // Bằng tiếng Việt
  gradeCorrections?: WritingToeicPart2GrammarCorrection[];
  gradeGradedAt?: number;
  promptRecipientPersonaDescription?: string;
}

/**
 * @interface WritingToeicPart2GeneratedPromptData
 * @description Defines the structure of the JSON object expected directly from Gemini when generating a Part 2 email prompt.
 * @comment Định nghĩa cấu trúc JSON mà Gemini trả về khi tạo đề bài Part 2.
 */
export interface WritingToeicPart2GeneratedPromptData {
  senderName: string;
  senderEmail: string;
  subject: string;
  body: string;
  tasks: string[];
  recipientPersonaDescription: string;
}

/**
 * @interface WritingToeicPart2PromptContextForGrading
 * @description Defines the necessary context of the original email prompt that needs to be passed to the grading function.
 * @comment Thông tin email gốc cần thiết để Gemini chấm điểm.
 */
export interface WritingToeicPart2PromptContextForGrading {
  senderName: string;
  senderEmail: string; // Optional, might not be strictly needed by grader if senderName and subject are enough context
  subject: string;
  body: string;
  tasks: string[]; // The specific tasks the student was supposed to address
}

// Your other Part 2 types: WritingToeicPart2GradedFeedback, WritingToeicPart2SheetData, etc.
// WritingToeicPart2Prompt (the one used in your hook's state) would be constructed from WritingToeicPart2GeneratedPromptData
// and would include instructionText, id, part, etc.
export interface WritingToeicPart2Prompt {
  id: string;
  part: 2;
  receivedEmail: { // Thông tin email mà người dùng nhận được
    senderName: string;
    senderEmail: string; // Có thể tùy chọn nếu không quá quan trọng với UI hiển thị
    recipientName?: string; // 
    subject: string;
    body: string; // Đã bao gồm lời chào với recipientName
    tasks: string[];
  }; // Use the grading context here
  recipientPersonaDescription: string;
  instructionText: string;
  generatedAt: number;
}

export interface WritingToeicPart2ApiPromptData {
  senderName: string;
  senderEmail: string;
  recipientName: string;
  subject: string;
  body: string;
  tasks: string[];
  recipientPersonaDescription: string;
  WritingToeicPart2ApiPromptData: string;
}
/**
 * @typedef WritingToeicPart2ApiReceivedEmail
 * @description Cấu trúc dữ liệu email nhận được (đề bài) trả về từ API tạo đề Part 2.
 */
export type WritingToeicPart2ApiReceivedEmail = WritingToeicPart2Prompt['receivedEmail']


/**
 * @interface WritingToeicPart2State
 * @description Định nghĩa trạng thái cho trang TOEIC Part 2 trong React hook.
 */
export interface WritingToeicPart2State {
  // --- Trạng thái tải ---
  isDbLoading: boolean; // Đang tải/khởi tạo CSDL
  isLoadingPrompt: boolean; // Đang tạo đề bài email mới
  isLoadingGrade: boolean; // Đang chấm điểm email trả lời

  // --- Dữ liệu bài làm hiện tại ---
  currentSheetId: number | null;
  currentSheetData: WritingToeicPart2SheetData | null; // Dữ liệu đầy đủ của sheet hiện tại từ DB

  // --- Dữ liệu được suy ra từ currentSheetData cho UI ---
  currentPrompt: WritingToeicPart2Prompt | null; // Đề bài email hiện tại
  userResponseText: string; // Nội dung email người dùng đang soạn
  currentFeedback: WritingToeicPart2GradedFeedback | null; // Phản hồi và điểm cho email hiện tại

  // --- Thông tin chung & lỗi ---
  totalSheets: number; // Tổng số bài làm đã lưu
  error: string | null; // Thông báo lỗi
}

export interface Part2EmailContext {
  email: string;
  subject: string;
  tasks: string[];
  recipientName: string;
}

/**
 * @interface EssayQuestionApiResponse
 * @description Định nghĩa cấu trúc JSON mong đợi từ Gemini cho câu hỏi luận Part 3.
 * @comment Cấu trúc đơn giản chỉ chứa câu hỏi luận.
 */
export interface EssayQuestionApiResponse {
  essayQuestion: string;
}

export interface WritingToeicPart3GradedFeedback {
  score: number; // Điểm tổng từ 0 đến 5 cho bài luận

  overallFeedback: string; // Nhận xét tổng quát chi tiết (khoảng 4-6 câu) bằng TIẾNG VIỆT

  detailedFeedback: {
    opinionSupportFeedback: string; // Nhận xét về cách phát triển và bảo vệ quan điểm (TIẾNG VIỆT)
    organizationFeedback: string;   // Nhận xét về cấu trúc bài luận (TIẾNG VIỆT)
    grammarVocabularyFeedback: string; // Nhận xét về ngữ pháp và từ vựng (TIẾNG VIỆT)
  };

  keyImprovementAreas: string[]; // Danh sách 2-3 điểm chính cần cải thiện (TIẾNG VIỆT)
}
/**
 * @interface EssayQuestionDataFromApi
 * @description Định nghĩa cấu trúc JSON trả về từ API khi tạo câu hỏi luận Part 3.
 * @comment Cấu trúc này khớp với output của hàm generateEssayQuestionForPart3.
 */
export interface EssayQuestionDataFromApi {
  essayQuestion: string; // Câu hỏi luận
}

/**
 * @interface WritingToeicPart3Prompt
 * @description Định nghĩa cấu trúc của một đề bài luận Part 3.
 * @comment Bao gồm câu hỏi luận và các thông tin liên quan.
 */
export interface WritingToeicPart3Prompt {
  // ID của sheet mà đề bài này thuộc về
  id: string;
  // Loại phần thi, luôn là 3 cho Part 3
  part: 3;
  // Câu hỏi luận chính
  essayQuestion: string;
  // Hướng dẫn chung cho người dùng (có thể lấy từ đề bài TOEIC gốc)
  directions: string; // Ví dụ: "You will write an essay... at least 300 words."
  // Thời gian tạo đề bài (timestamp)
  generatedAt: number;
}

/**
 * @type WritingToeicPart3UserAnswer
 * @description Định nghĩa cấu trúc bài luận của người dùng.
 * Đơn giản là một chuỗi string dài.
 * @comment Bài luận do người dùng soạn thảo.
 */
export type WritingToeicPart3UserAnswer = string; // Hoặc một object nếu muốn thêm metadata

/**
 * @interface WritingToeicPart3DetailedFeedbackCriteria
 * @description Nhận xét chi tiết theo từng tiêu chí cho bài luận Part 3.
 * @comment Các mục nhận xét cụ thể bằng tiếng Việt.
 */
export interface WritingToeicPart3DetailedFeedbackCriteria {
  opinionSupportFeedback: string; // Nhận xét về cách phát triển và bảo vệ quan điểm
  organizationFeedback: string;   // Nhận xét về cấu trúc, mạch lạc, liên kết
  grammarVocabularyFeedback: string; // Nhận xét về ngữ pháp và từ vựng
}

/**
 * @interface WritingToeicPart3GradedFeedback
 * @description Định nghĩa cấu trúc phản hồi và điểm số sau khi chấm bài luận Part 3.
 * @comment Cấu trúc này khớp với JSON schema đã thiết kế cho hàm gradeEssayForPart3.
 */
export interface WritingToeicPart3GradedFeedback {
  // ID của feedback, thường là ID của sheet
  id: string;
  // ID của câu trả lời (bài luận) tương ứng, thường là ID của sheet
  answerId: string;
  // Điểm số (ví dụ: 0-5)
  score: number;
  // Nhận xét tổng quát bằng TIẾNG VIỆT
  overallFeedback: string;
  // Nhận xét chi tiết theo từng tiêu chí, bằng TIẾNG VIỆT
  detailedFeedback: WritingToeicPart3DetailedFeedbackCriteria;
  // Danh sách các lĩnh vực chính cần cải thiện, bằng TIẾNG VIỆT
  keyImprovementAreas: string[];
  // Thời gian chấm bài (timestamp)
  gradedAt: number;
}

/**
 * @type WritingToeicPart3SheetStatus
 * @description Định nghĩa các trạng thái có thể có của một bài thực hành luận Part 3.
 * - 'blank': Mới tạo, chưa có câu hỏi luận.
 * - 'prompt_generated': Câu hỏi luận đã có, chờ người dùng viết bài.
 * - 'answered': Người dùng đã nộp bài luận, chờ chấm điểm.
 * - 'graded': Đã chấm điểm, có phản hồi.
 * @comment Các giai đoạn của một bài làm Part 3.
 */
export type WritingToeicPart3SheetStatus = 'blank' | 'prompt_generated' | 'answered' | 'graded';

/**
 * @interface WritingToeicPart3SheetData
 * @description Định nghĩa cấu trúc cho một bài thực hành luận Part 3 lưu trong IndexedDB.
 * @comment Dữ liệu được lưu trữ lâu dài trong trình duyệt cho mỗi bài luận.
 */
export interface WritingToeicPart3SheetData {
  // ID tự tăng, cũng là số thứ tự bài làm
  id: number;
  // Trạng thái của bài làm
  status: WritingToeicPart3SheetStatus;
  // Thời gian tạo bài làm (timestamp)
  createdAt: number;

  // --- Dữ liệu đề bài ---
  essayQuestion?: string; // Câu hỏi luận
  promptDirections?: string; // Hướng dẫn làm bài (có thể cố định hoặc từ API)
  promptGeneratedAt?: number; // Thời gian tạo câu hỏi

  // --- Dữ liệu bài luận của người dùng ---
  userEssayText?: WritingToeicPart3UserAnswer; // Nội dung bài luận
  userEssaySubmittedAt?: number; // Thời gian nộp bài

  // --- Dữ liệu điểm và phản hồi ---
  gradeScore?: number;
  gradeOverallFeedback?: string; // Nhận xét chung (tiếng Việt)
  gradeDetailedFeedback?: WritingToeicPart3DetailedFeedbackCriteria; // Nhận xét chi tiết (tiếng Việt)
  gradeKeyImprovementAreas?: string[]; // Lĩnh vực cần cải thiện (tiếng Việt)
  gradeGradedAt?: number; // Thời gian chấm bài
}
export type WritingToeicPart3UIControls = {
  isFetchingInitialData: boolean;
  isGenerateNewEssayQuestionButtonLoading: boolean;
  isGenerateNewEssayQuestionButtonDisabled: boolean;
  shouldShowEssayQuestionSkeleton: boolean;
  isEssayEditorDisabled: boolean;
  isSubmitEssayButtonLoading: boolean;
  isSubmitEssayButtonDisabled: boolean;
  shouldRenderEssayGradeDisplay: boolean;
}

/**
 * @description Loại của câu hỏi trong bài thi nói TOEIC.
 * - readAloud: Đọc to một đoạn văn.
 * - describePicture: Miêu tả một bức tranh (hình ảnh sẽ được tải động).
 * - respondToQuestions: Trả lời các câu hỏi (có thể là một chuỗi câu hỏi).
 * - respondToQuestionsWithInfo: Trả lời các câu hỏi dựa trên thông tin cho trước.
 * - proposeSolution: Đề xuất giải pháp cho một vấn đề.
 * - expressOpinion: Trình bày quan điểm về một chủ đề.
 */
export enum ToeicSpeakingTaskType {
  READ_ALOUD = "readAloud",
  DESCRIBE_PICTURE = "describePicture",
  RESPOND_TO_QUESTIONS = "respondToQuestions",
  RESPOND_TO_QUESTIONS_WITH_INFO = "respondToQuestionsWithInfo",
  PROPOSE_SOLUTION = "proposeSolution",
  EXPRESS_OPINION = "expressOpinion",
}

/**
 * @description Thông tin cho các câu hỏi cần đọc/tham khảo trước khi trả lời (ví dụ: lịch trình cho câu 7-9).
 */
export interface ToeicSpeakingTaskProvidedInfo {
  text?: string; // Nội dung văn bản
  // Nếu thông tin cung cấp cũng có thể là hình ảnh, thêm imageQuery ở đây.
  // imageQuery?: string; // Từ khóa để tìm ảnh nếu cần
}

/**
 * @description Cấu trúc cho một câu hỏi đơn lẻ, đặc biệt dùng trong `RESPOND_TO_QUESTIONS` series.
 */
export interface ToeicSpeakingSubQuestion {
  questionId: string; // ID định danh cho câu hỏi phụ
  prepTimeSeconds: number; // Thời gian chuẩn bị (giây) - tiêu chuẩn ETS
  responseTimeSeconds: number; // Thời gian trả lời (giây) - tiêu chuẩn ETS
  questionText: string; // Nội dung câu hỏi
}

/**
 * @description Cấu trúc cơ bản cho một nhiệm vụ trong bài thi TOEIC Speaking.
 * `prepTimeSeconds` và `responseTimeSeconds` là thời gian TIÊU CHUẨN của ETS.
 * Logic ứng dụng sẽ nhân 1.5x lên các giá trị này để ra thời gian thực tế cho người dùng.
 */
export interface ToeicSpeakingTaskBase {
  id: string; // ID định danh cho nhiệm vụ/câu hỏi chính
  type: ToeicSpeakingTaskType; // Loại nhiệm vụ
  title: string; // Tiêu đề của phần thi (ví dụ: "Câu 1-2: Đọc một đoạn văn")
  instructions: string; // Hướng dẫn chung cho phần thi/câu hỏi
  prepTimeSeconds: number; // Thời gian chuẩn bị (giây) - tiêu chuẩn ETS
  responseTimeSeconds: number; // Thời gian trả lời (giây) - tiêu chuẩn ETS
}

/**
 * @description Nhiệm vụ đọc to đoạn văn.
 */
export interface ToeicSpeakingReadAloudTask extends ToeicSpeakingTaskBase {
  type: ToeicSpeakingTaskType.READ_ALOUD;
  content: string; // Nội dung đoạn văn cần đọc
}

/**
 * @description Nhiệm vụ miêu tả tranh.
 * Hình ảnh sẽ được tải động từ Pexels dựa trên `imageQuery`.
 */
export interface ToeicSpeakingDescribePictureTask extends ToeicSpeakingTaskBase {
  type: ToeicSpeakingTaskType.DESCRIBE_PICTURE;
  imageQuery: string; // Từ khóa/chủ đề để tìm kiếm ảnh trên Pexels (ví dụ: "office meeting", "park scene")
  // `image` field (URL of the fetched image) will be added to the task dynamically in the state after fetching.
}

/**
 * @description Nhiệm vụ trả lời chuỗi câu hỏi (ví dụ: Câu 4-6).
 */
export interface ToeicSpeakingRespondToQuestionsTask extends ToeicSpeakingTaskBase {
  type: ToeicSpeakingTaskType.RESPOND_TO_QUESTIONS;
  seriesTitle?: string; // Tiêu đề cho cả chuỗi câu hỏi (nếu có)
  questions: ToeicSpeakingSubQuestion[]; // Danh sách các câu hỏi phụ
}

/**
 * @description Nhiệm vụ trả lời câu hỏi dựa trên thông tin cho trước (ví dụ: Câu 7-9).
 */
export interface ToeicSpeakingRespondToQuestionsWithInfoTask extends ToeicSpeakingTaskBase {
  type: ToeicSpeakingTaskType.RESPOND_TO_QUESTIONS_WITH_INFO;
  providedInfo: ToeicSpeakingTaskProvidedInfo; // Thông tin được cung cấp (văn bản, lịch trình, etc.)
  seriesTitle?: string; // Tiêu đề cho cả chuỗi câu hỏi
  questions: ToeicSpeakingSubQuestion[]; // Danh sách các câu hỏi phụ
}

/**
 * @description Nhiệm vụ đề xuất giải pháp (ví dụ: Câu 10).
 */
export interface ToeicSpeakingProposeSolutionTask extends ToeicSpeakingTaskBase {
  type: ToeicSpeakingTaskType.PROPOSE_SOLUTION;
  problemContext: string; // Mô tả vấn đề/tình huống (có thể là text thay cho audio prompt)
}

/**
 * @description Nhiệm vụ trình bày quan điểm (ví dụ: Câu 11).
 */
export interface ToeicSpeakingExpressOpinionTask extends ToeicSpeakingTaskBase {
  type: ToeicSpeakingTaskType.EXPRESS_OPINION;
  topic: string; // Chủ đề cần trình bày quan điểm
}

/**
 * @description Union type cho tất cả các loại nhiệm vụ TOEIC Speaking.
 * Đây là kiểu dữ liệu sẽ được đọc từ prompts.json (hoặc nguồn dữ liệu khác).
 * Đối với `ToeicSpeakingDescribePictureTask`, sau khi fetch ảnh, chúng ta có thể muốn thêm một trường `imageUrl?: string` vào state,
 * nên có thể cần một type khác cho task trong state, hoặc làm cho `imageUrl` optional ở đây.
 * For now, we'll handle the fetched image URL within the component or an enriched state type.
 */
export type ToeicSpeakingPromptTask = // Renamed to clarify it's from the prompt source
  | ToeicSpeakingReadAloudTask
  | ToeicSpeakingDescribePictureTask
  | ToeicSpeakingRespondToQuestionsTask
  | ToeicSpeakingRespondToQuestionsWithInfoTask
  | ToeicSpeakingProposeSolutionTask
  | ToeicSpeakingExpressOpinionTask;

//------------------------------------------------------
// Task in State (after potential enrichment like fetching image URL)
//------------------------------------------------------
/**
 * @description Properties that can be added to a task at runtime (e.g., after fetching data).
 * Các thuộc tính có thể được thêm vào một nhiệm vụ trong quá trình chạy (ví dụ: sau khi tải dữ liệu).
 */
export interface LoadedTaskRuntimeProperties {
  imageUrl?: string; // URL của hình ảnh đã tải về cho DescribePictureTask
  isContentLoading?: boolean; // Cờ báo nội dung động (ví dụ: ảnh) đang được tải
  contentError?: string; // Lỗi khi tải nội dung động
}

/**
 * @description Represents a task within the application's state.
 * It's the original prompt task intersected with runtime properties.
 * Đại diện cho một nhiệm vụ trong trạng thái của ứng dụng.
 * Nó là sự kết hợp (intersection) của nhiệm vụ gốc từ prompt và các thuộc tính runtime.
 */
export type ToeicSpeakingLoadedTask =
  | (ToeicSpeakingReadAloudTask & LoadedTaskRuntimeProperties)
  | (ToeicSpeakingDescribePictureTask & LoadedTaskRuntimeProperties) // imageUrl sẽ được sử dụng chính ở đây
  | (ToeicSpeakingRespondToQuestionsTask & LoadedTaskRuntimeProperties)
  | (ToeicSpeakingRespondToQuestionsWithInfoTask & LoadedTaskRuntimeProperties)
  | (ToeicSpeakingProposeSolutionTask & LoadedTaskRuntimeProperties)
  | (ToeicSpeakingExpressOpinionTask & LoadedTaskRuntimeProperties);




//------------------------------------------------------
// User Response and Feedback
// Định nghĩa cấu trúc cho câu trả lời của người dùng và phản hồi từ AI
//------------------------------------------------------

/**
 * @description Thông tin phản hồi từ AI.
 */
export interface ToeicSpeakingFeedback {
  transcript?: string; // Văn bản ghi âm từ giọng nói của người dùng
  pronunciation?: string; // Đánh giá về phát âm
  fluency?: string; // Đánh giá về sự trôi chảy
  grammar?: string; // Đánh giá về ngữ pháp
  vocabulary?: string; // Đánh giá về từ vựng
  overall?: string; // Nhận xét chung
}

/**
 * @description Câu trả lời của người dùng cho một nhiệm vụ.
 */
export interface ToeicSpeakingUserResponse {
  responseId: string; // ID duy nhất cho câu trả lời này
  taskId: string; // ID của nhiệm vụ đã trả lời
  subQuestionId?: string; // ID của câu hỏi phụ (nếu có)
  audioBlob?: Blob; // Dữ liệu audio dạng Blob để lưu vào IndexedDB
  audioUrl?: string; // For playback, can be generated from Blob
  feedback?: ToeicSpeakingFeedback; // Phản hồi từ AI
  timestamp: number; // Thời điểm ghi âm
  attemptNumber?: number; // Số lần thử (nếu cho phép làm lại)
}

//------------------------------------------------------
// State Management (useReducer) for ToeicSpeakingPartPage
//------------------------------------------------------

export enum ToeicSpeakingPracticeView {
  INTRO = "intro",
  LOADING_TASK_CONTENT = "loadingTaskContent",
  PREPARATION = "preparation",
  RECORDING = "recording",
  SUMMARY = "summary",
}

export interface ToeicSpeakingPartState {
  currentView: ToeicSpeakingPracticeView;
  tasks: ToeicSpeakingLoadedTask[]; // Sử dụng ToeicSpeakingLoadedTask để có thể chứa imageUrl
  currentTaskIndex: number;
  currentSubQuestionIndex?: number;
  userResponses: ToeicSpeakingUserResponse[];
  isTestInProgress: boolean;
  currentTaskError?: string; // Lỗi liên quan đến việc tải hoặc hiển thị task hiện tại
  overallError?: string; // Lỗi chung của cả trang
  // Flags for specific loading states might be more granular
  isLoadingTasks: boolean; // Loading tasks from prompts.json
  isLoadingPexelsImage: boolean; // Specifically for Pexels image fetching
  isLoadingAiFeedbackFor?: string; // taskId or responseId for which feedback is being fetched
  isLoadingPrompts: boolean;
}

export enum ToeicSpeakingPartActionType {
  LOAD_PROMPTS_REQUEST = "LOAD_PROMPTS_REQUEST",
  LOAD_PROMPTS_SUCCESS = "LOAD_PROMPTS_SUCCESS",
  LOAD_PROMPTS_FAILURE = "LOAD_PROMPTS_FAILURE",

  FETCH_TASK_CONTENT_REQUEST = "FETCH_TASK_CONTENT_REQUEST",
  FETCH_TASK_CONTENT_SUCCESS = "FETCH_TASK_CONTENT_SUCCESS",
  FETCH_TASK_CONTENT_FAILURE = "FETCH_TASK_CONTENT_FAILURE",

  START_SIMULATION = "START_SIMULATION",
  PROCEED_TO_PREPARATION = "PROCEED_TO_PREPARATION", // Indicates content is ready, move to prep timer
  // HIGHLIGHT: New action type
  START_RECORDING_PHASE = "START_RECORDING_PHASE", // Prep time ended, move to recording timer & UI

  // START_RECORDING and STOP_RECORDING_AND_SAVE were previous ideas,
  // Let's refine SAVE_RESPONSE. START_RECORDING might be a local state in AudioRecorder.
  SAVE_RESPONSE = "SAVE_RESPONSE", // Save the recorded audio response

  GET_AI_FEEDBACK_REQUEST = "GET_AI_FEEDBACK_REQUEST",
  GET_AI_FEEDBACK_SUCCESS = "GET_AI_FEEDBACK_SUCCESS",
  GET_AI_FEEDBACK_FAILURE = "GET_AI_FEEDBACK_FAILURE",

  NEXT_QUESTION_OR_TASK = "NEXT_QUESTION_OR_TASK",
  COMPLETE_SIMULATION = "COMPLETE_SIMULATION",
  RESET_SIMULATION = "RESET_SIMULATION",
  SET_OVERALL_ERROR = "SET_OVERALL_ERROR",
  CLEAR_OVERALL_ERROR = "CLEAR_OVERALL_ERROR",
}

export interface FetchTaskContentRequestPayload {
  taskIndex: number;
}
export interface FetchTaskContentSuccessPayload {
  taskIndex: number;
  // Chỉ chứa các thuộc tính được cập nhật từ LoadedTaskRuntimeProperties
  updatedProperties: Pick<LoadedTaskRuntimeProperties, 'imageUrl'>; // Hoặc Partial<LoadedTaskRuntimeProperties>
}
export interface FetchTaskContentFailurePayload {
  taskIndex: number;
  error: string;
}

// Payloads for actions
export interface LoadPromptsSuccessPayload {
  tasks: ToeicSpeakingPromptTask[]; // Tasks as defined in prompts.json
}
export interface FetchDynamicContentSuccessPayload {
  taskIndex: number;
  updatedTask: Partial<ToeicSpeakingLoadedTask>; // e.g., { imageUrl: '...' }
}
export interface SaveResponsePayload {
  responseId: string; // ID duy nhất cho response này
  taskId: string;
  subQuestionId?: string;
  audioBlob: Blob;
  timestamp: number;
}
export interface GetAiFeedbackRequestPayload {
  responseId: string; // ID của câu trả lời cần lấy feedback
}
export interface GetAiFeedbackSuccessPayload {
  responseId: string;
  feedback: ToeicSpeakingFeedback;
}
export interface GetAiFeedbackFailurePayload {
  responseId: string;
  error: string;
}
export interface GetAiFeedbackSuccessPayload {
  responseId: string;
  feedback: ToeicSpeakingFeedback;
}
export interface GetAiFeedbackFailurePayload {
  responseId: string;
  error: string;
}

export type TestDraft = {
  version: number,
  draftTestScreenState: FullTestScreenState
  draftTestData: TestSheet
}

export type EssayQuestionPayload = { id: string; essayQuestion: string; directions: string; generatedAt: number; part: 3 }
//---------------------------- tên gọi khác
export type TestAnswerSheet = Map<QuestionNumber, AnswerData>;
export type ResultID = string;
export type QuestionID = string;
export type UserID = string;
export type QuestionNumber = number;
export type milisecond = number;
export type TestID = string;
export type DraftLocation = "indexDB" | "server" | "none";
type RoleID = string;
export type PermissionID = string;
export type LectureID = string;
export type UserCommentID = string;
export type PracticeAnswerSheet = Map<QuestionID, string>;
export type TestReviewAnswerSheet = UserAnswerRecord[];
export type CategoryID = string;
export type TopicID = string;
export type ResponseUserResultList = ApiResponse<TableData<UserDetailResultRow>>;
export type UserAnswerTimeCounter = Map<QuestionNumber, milisecond>
export type ResourceType = 'paragraph' | 'image' | 'audio'
export type TestType = 'fulltest' | 'practice' | 'exercise' | 'thi thử' | 'làm 1 phần' | 'luyện tập';
export type QuestionType = 'single' | 'group' | 'subquestion' | 'ABCD';
export type ExerciseType = "partNum=1" | "partNum=2" | "partNum=3" | "partNum=4" | "partNum=5" | "partNum=6" | "partNum=7" | "topic=Câu hỏi ngữ pháp" | "topic=Câu hỏi từ vựng";
export type DialogLectureJobType = '' | 'CREATE' | 'UPDATE' | 'DELETE' | 'PAGE_DESIGNER' | 'QUESTION_EDITOR';
export type DialogRowJobType = '' | 'CREATE' | 'UPDATE' | 'DELETE';
export type ColorString = "success" | "info" | "warning" | "danger" | 'secondary' | 'help';
export type BadgeColor = "danger" | "secondary" | "success" | "info" | "warning" | "contrast" | null | undefined;
export type Name_ID<T extends string> = T;
export type TestDocument = QuestionListByPart[]
export type ReportReason = string
export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  GUEST = "GUEST",
}
//-----------------------------reducer---------------------



export interface MultiQuestionRef {
  lastTimeStampRef: number,
  timeDoTest: number,
  timeSpentListRef: UserAnswerTimeCounter,
  abortControllerRef: AbortController | null,
  totalQuestions: number
}
//------------------------------------------------------
// Custom Hook Definition
//------------------------------------------------------

export interface UseToeicSpeakingReturn {
  // ViewState: Dữ liệu cần thiết cho UI để render
  viewState: {
    currentView: ToeicSpeakingPracticeView;
    currentTask: ToeicSpeakingLoadedTask | undefined;
    // currentSubQuestion: ToeicSpeakingSubQuestion | undefined; // Sẽ thêm khi cần
    currentTaskIndex: number;
    overallError?: string;
    tasksCount: number;
    currentTaskNumber: number; // Số thứ tự task hiện tại (1-based)
  };
  // UiControls: Các cờ điều khiển trạng thái của UI (loading, disabled, etc.)
  uiControls: {
    isPromptsLoading: boolean;
    isStartSimulationDisabled: boolean;
    isTestInProgress: boolean;
    isCurrentTaskContentLoading: boolean;
  };
  // Actions: Các hàm để tương tác với state (dispatch actions)
  actions: {
    startSimulation: () => void;
    resetSimulation: () => void;
    fetchDynamicContentForTask: (taskIndex: number) => Promise<void>; // Returns a promise
    proceedToPreparation: () => void; // Action to manually move to prep
    completeSimulation: () => void; // Added for completeness
    startRecordingPhase: () => void;
    saveResponse: (data: Omit<SaveResponsePayload, 'responseId' | 'timestamp'> & { audioBlob: Blob }) => void; // Simplified input
    goToNextTaskOrEnd: () => void;
  };
}

export interface PexelsSearchResponse { // Making this exportable
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  next_page?: string;
}


export interface TestPaperWorkerRequest {
  testId: TestID;
  parts: string;
}