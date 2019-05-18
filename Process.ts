class Process {
    public id: number;
    public arrival_time: number;
    public burst_time: number;
    public remaining_time: number;
    public colour: string;

    constructor(burst_time: number, arrival_time: number) {
        this.id = currentProcessId + 1;
        this.arrival_time = arrival_time;
        this.burst_time = burst_time;
        this.remaining_time = burst_time;
        this.colour = Process.getRandomColor();
        currentProcessId += 1;
    }

    get Id() {
        return this.id;
    }

    get remainingTime() {
        return this.remaining_time;
    }

    get burstTime() {
        return this.burst_time;
    }

    get arrivalTime() {
        return this.arrival_time;
    }

    public static getRandomColor(): string {
        let letters: string = '0123456789ABCDEF';
        let color: string = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    tick() {
        this.remaining_time -= 1;
    }
}
