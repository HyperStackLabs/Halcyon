export interface aiModelInterface {
    _id?: string,
    codename: string
    image: string
    soft_name: string,
    type: 'Nano' | 'Pro' | 'Agentic',
    modelProvider: string
    likes: string[]
    interactions: number
}
