"use strict";
class Process {
    constructor(burst_time, arrival_time) {
        this.id = currentProcessId + 1;
        this.arrival_time = arrival_time;
        this.burst_time = burst_time;
        this.remaining_time = burst_time;
        this.colour = Process.getRandomColor();
        this._turn_around_time = 0;
        this._waiting_time = 0;
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
    get turnAroundTime() {
        return this._turn_around_time;
    }
    get waitingTime() {
        return this._waiting_time;
    }
    get arrivalTime() {
        return this.arrival_time;
    }
    set turnAroundTime(value) {
        this._turn_around_time = value;
    }
    set waitingTime(value) {
        this._waiting_time = value;
    }
    static getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    tick() {
        this.remaining_time -= 1;
    }
}
