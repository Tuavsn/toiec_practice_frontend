import { EditorTextChangeEvent } from "primereact/editor"
import { Toast } from "primereact/toast"
import { Dispatch, MutableRefObject } from "react"
import { NavigateFunction } from "react-router-dom"
import { LectureHookAction, RoleHookAction, RowHookAction, UserHookAction } from "./action"
import { DialogLectureJobType, DialogRowJobType, LectureID, LectureRow, Permission, PermissionID, Role, TestRow, Topic, TopicID, UserRow } from "./type"

type RenderLectureDialogParams = {
  job: DialogLectureJobType,
  currentSelectedLecture: LectureRow,
  dispatch: Dispatch<LectureHookAction>,
  topicListRef: React.MutableRefObject<Topic[]>
}

type RenderRowDialogParams<RowModel> = {
  job: DialogRowJobType,
  currentSelectedRow: RowModel,
  dispatch: Dispatch<RowHookAction<RowModel>>,
}
type RenderTestRowDialogParams = {
  job: DialogRowJobType,
  currentSelectedRow: TestRow,
  dispatch: Dispatch<RowHookAction<TestRow>>,
  categoryName: string,
}
type RenderRoleRowDialogParams = {
  job: DialogRowJobType,
  currentSelectedRow: Role,
  dispatch: Dispatch<RoleHookAction>,
  permissionList: Permission[],
}
type RenderUserRowDialogParams = {
  job: DialogRowJobType,
  currentSelectedRow: UserRow,
  dispatch: Dispatch<UserHookAction>,
  roleList: Role[],
}

type SaveTextParams = {
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  toast: MutableRefObject<Toast | null>
  text: React.MutableRefObject<string>,
  lectureID: LectureID,
}
type EditTextParams = {
  e: EditorTextChangeEvent,
  button: React.MutableRefObject<HTMLButtonElement>,
  text: React.MutableRefObject<string>
}
type handeSaveLectureParams = {
  title: string,
  topicIds: TopicID[],
  lectureID: LectureID,
  toast: React.MutableRefObject<Toast | null>,
  dispatch: React.Dispatch<LectureHookAction>,
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>,
}

type handeDeleteLectureParams = {
  lecture: LectureRow,
  toast: React.MutableRefObject<Toast | null>,
  dispatch: React.Dispatch<LectureHookAction>,
}

type handeDeleteRowParams<RowModel> = {
  row: RowModel,
  toast: React.MutableRefObject<Toast | null>,
  dispatch: React.Dispatch<RowHookAction<RowModel>>,
}

type handeSaveRowParams<RowModel> = {
  row: RowModel
  toast: React.MutableRefObject<Toast | null>,
  dispatch: React.Dispatch<RowHookAction<RowModel>>,

  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>,
}
type handeSaveRoleParams = {
  row: Role
  toast: React.MutableRefObject<Toast | null>,
  dispatch: React.Dispatch<RoleHookAction>,
  permissionIDList: PermissionID[],
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>,
}
type handeSaveUserRowParams = {
  role: Role,
  navigate: NavigateFunction,
  user: UserRow,
  toast: React.MutableRefObject<Toast | null>,
  dispatch: React.Dispatch<UserHookAction>,
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>,
}

export type {
  EditTextParams, handeDeleteLectureParams,
  handeDeleteRowParams,
  handeSaveLectureParams,
  handeSaveRoleParams,
  handeSaveRowParams,
  handeSaveUserRowParams, RenderLectureDialogParams,
  RenderRoleRowDialogParams,
  RenderRowDialogParams,
  RenderTestRowDialogParams,
  RenderUserRowDialogParams,
  SaveTextParams
}

