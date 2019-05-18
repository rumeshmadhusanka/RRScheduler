var id = 0;
var time_quantum;
var time = 0;
var done = false;
var elemntid = 2;
var endTime = 100;
var tot_turn_time = 0;
var no_process = 0;
var tot_waiting_time = 0;

class process {
    constructor(burst_time, arrival_time) {
        this.id = id + 1;
        this.arrival_time = arrival_time;
        this.burst_time = burst_time;
        this.remaining_time = burst_time;
        this.colour = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
        id += 1;
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

    execute_once() {
        this.remaining_time -= 1;
    }
}

async function execute() {

    while (!(processList.length == 0 && readyQueue.length == 0)) {
        //sleep for 1s
        if (readyQueue.length != 0) {
            pro = readyQueue.shift();
            count = 0;
            while (count < time_quantum && pro.remainingTime > 0) {
                await sleep(1500);
                pro.execute_once();
                $("div.jqTimespaceColumn:nth-child(" + (time + 1) + ")").css("background", pro.colour).append("<p>Process " + pro.Id + "</p>");
                //add the code to represent ready queue...
                var readyQ = [];
                readyQueue.forEach(element => {
                    readyQ.push(element.Id);
                });
                $("#process_details3").html("Ready Queue : " + JSON.stringify(readyQ));
                //
                $("#process_details").html("Executing Process " + pro.Id + " ");
                //moving the gnatt chart
                if (time >= 9 && (time - 9) % 4 == 0) {
                    $("div[title|='Move Right']").trigger("click");
                }
                count++;
                time++;
                addToReadyQueue(); //checks for new arrivals
                //add the code to represent ready queue...
                var readyQ = [];
                readyQueue.forEach(element => {
                    readyQ.push(element.Id);
                });
                $("#process_details3").html("Ready Queue : " + JSON.stringify(readyQ));
                //
            }
            if (pro.remainingTime != 0) {
                //if the process is not completed append to readyQueue
                readyQueue.push(pro);

            } else {
                //if process is completed
                var turn_time = (time - pro.arrivalTime);
                var waiting_time = (turn_time - pro.burstTime);
                tot_turn_time += turn_time;
                tot_waiting_time += (waiting_time);

            }
        } else {
            await sleep(1500);
            $("div.jqTimespaceColumn:nth-child(" + (time + 1) + ")").append("<p>waiting</p>");
            $("#process_details").html("Waiting for process");
            if (time >= 9 && (time - 9) % 4 == 0) {
                $("div[title|='Move Right']").trigger("click");
            }
            time++;
            addToReadyQueue();

        }
    }
    await sleep(1000);
    $("#process_details").html("Average Turn Around Time : " + tot_turn_time / no_process);
    $("#process_details2").html("Average Waiting Time : " + tot_waiting_time / no_process);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addToReadyQueue() {
    var i = 0;
    while (i < processList.length) {
        if (processList[i].arrivalTime == time) {
            readyQueue.push(processList[i]);
            processList.splice(i, 1);
        } else {
            i++;
        }
    }
}


var processList = new Array();
var readyQueue = new Array();
//initiatte process list
//initiating readyQueue.

function createEle() {
    var t = $('<tr id="trow' + elemntid + '"><th scope="row">' + elemntid + '</th><td><input class="form-control" type="number" min=1 id="burst' + elemntid + '" /></td><td><input class="form-control" type="number" min=0 id="arrival' + elemntid + '" /></td></tr>');
    return t;
};
$(document).ready(function () {

    $('#buttonAdd').click(function () {
        $("#tbody").append(createEle());
        elemntid++;
    });
    $("#buttonRem").click(function () {
        if (elemntid > 1) {
            elemntid -= 1;
        }
        $('#trow' + elemntid).remove();
    });
    $("#buttonSub").click(function () {


        //onlick of submit button
        if ($('#timeline').has()) {

            $('#timeline').empty();
            $('#process_details2').html("");
            id = 0;
            time = 0;
            processList = [];
            readyQueue = [];
            done = false;
            tot_turn_time = 0;
            tot_waiting_time = 0;
            no_process = 0;

        }

        $('#timeline').timespace({
            selectedEvent: -1,
            // 24-hour timeline
            data: {

                events: [{
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
            },

        });


        time_quantum = parseInt($("#time_quantum").val());
        if (isNaN(time_quantum)) {
            alert("Please give a value to time quantum");
            throw new Error("no value to time quantum");
        }
        if (time_quantum < 1) {
            alert("Time quantum should be greater than 0");
            throw new Error("Time quantum should be greater than 0");
        }

        var c = $("#tbody").children().length;
        for (i = 1; i <= c; i++) {
            var burst = parseInt($("#burst" + i.toString()).val());
            var arr = parseInt($("#arrival" + i.toString()).val());
            if (isNaN(burst) || isNaN(arr) || (burst < 1) || (arr < 0)) {
                alert("Please give values to burst and arrival times. Burst times should be greater than 0 and Arrival times should be greater than or equal to 0");
                throw new Error("no burst and arrival times");
            }

            processList.push(new process(burst, arr));
        }
        unhideFunction();
        no_process = processList.length;
        addToReadyQueue();
        execute();
    });

    $("#forwardBtn").click(function () {
        $("div.jqTimespaceColumn:nth-child(" + 3 + ")").css("background", "coral").append("<p>Test</p>");
    });

});

function unhideFunction() {
    var divelement = document.getElementsByName("hiddenEl");
    divelement.forEach(element => {
        if (element.style.display == 'none')
            element.style.display = 'block';
    });

}
