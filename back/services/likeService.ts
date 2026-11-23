import { conversation, models } from "../models/models.js";

type RatingType = 'positive' | 'negative'

interface RatingMessage {
    _id?: string
    model?: string
    vote?: string
}
interface RatingRequest {
    type: RatingType
    message?: RatingMessage
    userName?: string
}

export default async function RatingService({type, message, userName}: RatingRequest){
    try{
        if (!message?.model || !userName) {
            return
        }
        const usedModel = await models.findOne({codename: message.model})
        const vote = message.vote === 'positive' || message.vote === 'negative'
        if(type == 'positive' && usedModel){
            if(vote){
                return
            }
            usedModel.likes.push(userName)
            const chat = await conversation.findOne({
                'messages._id': message._id
            })
            const savedMessage = chat?.messages.find(msg => 
                msg._id.toString() === message._id
            )
            if (!savedMessage || savedMessage.vote !== 'None') return
            savedMessage.vote = type
            await chat?.save()
            await usedModel.save()
        }
        if(type == 'negative' && usedModel){
            usedModel.likes.filter((user) => user !== userName)
            await usedModel.save()
        }
        return vote
    }catch(error){
        throw error
    }
}
