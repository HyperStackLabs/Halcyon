export interface LanguageModel {
    soft_name: string,
    codename: string,
    image: string,
    type: 'Nano' | 'Pro',
    provider: string
}