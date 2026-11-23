export type MessageRole = `user` | `assistant` | `system`

export interface ChatMessage {
  _id?: string
  role: MessageRole
  content: string
  createdAt: string
  model?: string
}
export interface Conversation {
  _id: string,
  title: string,
  totalTokens?: number,
  locked: boolean
}
export type ChatMessages = ChatMessage[]