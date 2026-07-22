export class chatError extends Error{
    status: number
    constructor(message: string, status = 429){
        super()
        this.status = status
        console.log(message)
    }
}