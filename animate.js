"use strict";
$(function () {
    $('#addBtn').on('click', () => {
        $("#tbody").append(addRow());
        elementId++;
    });
    $("#resetBtn").on('click', () => {
        document.location.replace("index.html");
    });
    $("#displayBth").on('click', animate);
});
//Global vars
let processList = [];
let processListCopy = [];
let readyQueue = [];
let currentProcessId = 0;
let timeQuantum;
let time = 0;
let elementId = 2;
let totalTurnAroundTime = 0;
let numberOfProcess = 0;
let totalWaitingTime = 0;
function run() {
    while (!(readyQueue.length == 0 && processList.length == 0)) {
        if (readyQueue.length != 0) {
            //one clock tick
            let currentProcess = (readyQueue.shift());
            let count = 0;
            while (count < timeQuantum && currentProcess.remainingTime > 0) {
                currentProcess.tick();
                $("div.jqTimespaceColumn:nth-child(" + (time + 1) + ")").css("background", currentProcess.colour)
                    .append("<br><br><p>&nbsp;&nbsp;&nbsp;PID: " + currentProcess.Id + "</p>");
                count++;
                time++;
                pListToReadyQueue();
            }
            if (currentProcess.remainingTime != 0) {
                //the process is not completed : append to readyQueue
                readyQueue.push(currentProcess);
            }
            else {
                //process is completed
                let turn_time = (time - currentProcess.arrivalTime);
                currentProcess.turnAroundTime = turn_time;
                totalTurnAroundTime += turn_time;
                let waiting_time = (turn_time - currentProcess.burstTime);
                currentProcess.waitingTime = waiting_time;
                totalWaitingTime += (waiting_time);
            }
        }
        else {
            $("div.jqTimespaceColumn:nth-child(" + (time + 1) + ")").append("<br><br><p>&nbsp;&nbsp;Waiting</p>");
            time++;
            pListToReadyQueue();
        }
    }
    //simulation done
}
function pListToReadyQueue() {
    let i = 0;
    while (i < processList.length) {
        if (processList[i].arrivalTime == time) {
            readyQueue.push(processList[i]);
            processList.splice(i, 1);
        }
        else {
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
function getData() {
    timeQuantum = parseInt(document.getElementById("time_quantum").value);
    let number = $("#tbody").children().length;
    for (let i = 1; i <= number; i++) {
        let burstTime = parseInt($("#burst" + i.toString()).val());
        let arrivalTime = parseInt($("#arrival" + i.toString()).val());
        let process = new Process(burstTime, arrivalTime);
        processList.push(process);
        processListCopy.push(process);
    }
}
function animate() {
    let animation = $('#timeline');
    let dataObj = {
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
        data: dataObj
    });
    getData();
    //show time space element
    (() => {
        let element = document.getElementById("timeline");
        let heading = document.getElementById("timeLineHeading");
        if (element.style.display == 'none') {
            element.style.display = 'block';
            heading.style.display = 'block';
        }
    })();
    numberOfProcess = processList.length;
    pListToReadyQueue();
    run();
}
