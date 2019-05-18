$(function () {
    $('#addBtn').on('click',  ()=> {
        $("#tbody").append(addRow());
        elementId++;
    });
    $("#resetBtn").on('click', () =>{
        document.location.replace("index.html");
    });
    $("#displayBth").on('click', animate);

});

let processList: Process[] = [];
let readyQueue: Process[] = [];
let currentProcessId = 0;
let timeQuantum: number;
let time = 0;
let elementId = 2;
let totalTurnAroundTime = 0;
let numberOfProcess = 0;
let totalWaitingTime = 0;

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

function run() {

    while (!(readyQueue.length == 0 && processList.length == 0)) {
        if (readyQueue.length != 0) {
            let currentProcess = <Process>(readyQueue.shift());
            let count = 0;
            while (count < timeQuantum && currentProcess.remainingTime > 0) {
                currentProcess.tick();
                $("div.jqTimespaceColumn:nth-child(" + (time + 1) + ")").css("background", currentProcess.colour)
                    .append("<p>Process " + currentProcess.Id + "</p>");
                count++;
                time++;
                pListToReadyQueue();

            }
            if (currentProcess.remainingTime != 0) {
                //if the process is not completed append to readyQueue
                readyQueue.push(currentProcess);
            } else {
                //if process is completed
                let turn_time = (time - currentProcess.arrivalTime);
                let waiting_time = (turn_time - currentProcess.burstTime);
                totalTurnAroundTime += turn_time;
                totalWaitingTime += (waiting_time);
            }
        } else {

            $("div.jqTimespaceColumn:nth-child(" + (time + 1) + ")").append("<p>waiting</p>");
            time++;
            pListToReadyQueue();

        }
    }


}

function pListToReadyQueue() {
    let i = 0;
    while (i < processList.length) {
        if (processList[i].arrivalTime == time) {
            readyQueue.push(processList[i]);
            processList.splice(i, 1);
        } else {
            i++;
        }
    }
}


function addRow() {
    return $('<tr id="trow' + elementId + '">' +
        '<th scope="row">' + elementId + '</th>' +
        '<td><input class="form-control" type="number" min=1 id="burst' + elementId + '" />' +
        '</td><td><input class="form-control" type="number" min=0 id="arrival' + elementId + '" />' +
        '</td>' +
        '</tr>');
}


function animate() {
    let animation = $('#timeline');
    // @ts-ignore
    // if (animation.has()) {
    //
    //     animation.empty();
    //     currentProcessId = 0;
    //     time = 0;
    //     processList = [];
    //     readyQueue = [];
    //     done = false;
    //     totalTurnAroundTime = 0;
    //     totalWaitingTime = 0;
    //     numberOfProcess = 0;
    //
    // }

let dataObj =  {
    events: [
        {
            start: 6.50,
            title: '',
            description: ' ',

        },
        {
            start: 8,
            end: 10,
            title: ' ',
            description: ' '
        },
        {
            start: 14,
            title: ' ',
            description: ' '
        },
        {
            start: 14.75,
            title: ' ',
            description: ' '
        },
    ]
};
    // @ts-ignore
    animation.timespace({
        data:dataObj
    });
    timeQuantum = parseInt((<HTMLInputElement>document.getElementById("time_quantum")).value);
    let c = $("#tbody").children().length;
    for (let i = 1; i <= c; i++) {
        let burstTime = parseInt(<string>$("#burst" + i.toString()).val());
        let arrivalTime = parseInt(<string>$("#arrival" + i.toString()).val());
        processList.push(new Process(burstTime, arrivalTime));
    }
    //show time space element
    (()=>{let element = <HTMLElement>document.getElementById("timeline");
        if (element.style.display == 'none') {
            element.style.display = 'block';
        }})();
    numberOfProcess = processList.length;
    pListToReadyQueue();
    run();
}


