import { Document, Types} from 'mongoose'

export interface IMessage {
    _id?: Types.ObjectId
    messages: {
        role: `user` | `assistant` | `system`
        content: string
        createdAt: Date
        model?: string
    }
}

export interface IConversation extends Document {
    _id: Types.ObjectId
    messages: IMessage[]
}