import { COMMENT_TYPE } from "src/utils/constValues"

export type Comment = {
  id: string
  parentId: string
  memberId: string
  userName?: string
  profileIcon?: string
  type: COMMENT_TYPE
  comment: string
  tokenQuantity: number
  replyCount?:string
  parentCommentId?:string
}