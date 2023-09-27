export class Stopwatch {
    private startTime: Date
    private endTime: Date

    start() {
        this.startTime = new Date()
    }

    stop() {
        this.endTime = new Date()
        return this.getTimeElapsed()
    }

    getTimeElapsed() {
        if (!this.endTime) {
            throw new Error('the stopwatch has not been stopped yet')
        }
        return this.endTime.getTime() - this.startTime.getTime()
    }

    static createAndInit() {
        const stopwatch  = new Stopwatch()
        stopwatch.start()
        return stopwatch
    }
    
}