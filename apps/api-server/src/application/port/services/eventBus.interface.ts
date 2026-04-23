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
     * Creates a dedicated blocking subscription that yields event batches
     * as they arrive. Manages its own connection lifecycle internally.
     * The generator cleans up when the abort signal fires or the caller
     * breaks out of the loop.
     *
     * @param topic Stream key to subscribe to
     * @param abort Signal to terminate the subscription
     * @param cursorId Starting cursor (defaults to '$' for new events only)
     */
    streamEvents(
        topic: string,
        abort: AbortSignal,
        cursorId?: string,
    ): AsyncGenerator<EventEntry[]>;

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

    /**
     * Checks if a stream has been marked as ended (STREAM_END is the last entry).
     * Used by the use case to decide whether to send STREAM_DONE to the client.
     */
    isStreamEnded(topic: string): Promise<boolean>;
}

export type EventEntry = {
    id: string,
    fields: Record<string, string>
}
