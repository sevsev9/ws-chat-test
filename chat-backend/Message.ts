export class Message {
    timestamp: number;
    from: string;
    message: string;

    constructor(from: string, timestamp: number, message: string) {
        this.timestamp = timestamp
        this.from = from
        this.message = message
    }

}
