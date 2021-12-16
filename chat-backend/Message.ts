export class Message {
    timestamp: number;
    name: string;
    message: string;

    constructor(name: string, timestamp: number, message: string) {
        this.timestamp = timestamp
        this.name = name
        this.message = message
    }

    toJSON() {
        return JSON.stringify({name: this.name, message: this.message, timestamp: this.timestamp})
    }
}
