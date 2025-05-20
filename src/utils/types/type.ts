import { DataTableValue } from "primereact/datatable";
import { Dispatch, SetStateAction } from "react";
import { NavigateFunction } from "react-router-dom";

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
//---------------------------- tên gọi khác
export type TestAnswerSheet = Map<QuestionNumber, AnswerData>;
export type ResultID = string;
export type QuestionID = string;
export type UserID = string;
export type QuestionNumber = number;
export type milisecond = number;
export type TestID = string;
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




