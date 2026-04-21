export interface IEventBus {
    /**
     * 
     * Say if needed to get fromthis message to the latest ones live
     * 
     * @param topic Topic
     * @param listenMs How much time to subscribe to 
     * @param count How much messges to get while listening
     * @param cursorId Optional id if give start from there to fetch, if not given wil get only new messages
     */
    subscribeToEvents(
        topic: string,
        listenMs: number,
        count: number,
        cursorId?: string
    ): Promise<EventEntry[] | null>;

    /**
     * get this number of recent messages
     * 
     * @param topic Which topic
     * @param count Count of messages needed
     */
    getRecentEvents(
        topic: string,
        count: number
    ): Promise<EventEntry[]>;

    /**
     * can use to get this numebr of message from this given cursor
     * 
     * @param topic Topic
     * @param beforeId ID of cursor which will be used as refernce to get before from
     * @param count count
     */
    getEventsBefore(
        topic: string,
        beforeId: string,
        count: number
    ): Promise<EventEntry[]>;


    getAllEvents(
        topic: string,
        chunkSize?: number
    ): AsyncGenerator<EventEntry[]>;
}

export type EventEntry = {
    id: string,
    fields: Record<string, string>
}
