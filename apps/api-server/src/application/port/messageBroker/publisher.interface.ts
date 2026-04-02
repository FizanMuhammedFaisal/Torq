export interface IPublisher {
    publish<T>(Topic: string, message: T, stringify: boolean): Promise<PublishResult>
}
export type PublishResult = {
    success: boolean,
    error?: Error
}