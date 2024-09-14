import '/global.js'
import '../libs/jquery.min.js'


class EventDate {
    constructor(year, month, day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    isValid() {
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const isLeapYear = (year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

        if (this.month < 1 || this.month > 12) {
            return false;
        }

        const daysInCurrentMonth = isLeapYear(this.year) && this.month === 2 ? 29 : daysInMonth[this.month - 1];
        if (this.day < 1 || this.day > daysInCurrentMonth) {
            return false;
        }

        return true;
    }

    toString() {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];
        return `${months[this.month - 1]} ${this.day}, ${this.year}`;
    }
}

var events = []


var middleTime = 0;
var oldMiddleTime = -1;
var timelineLength = 200;
var oldTimelineLength = 200;
var numberOfRows = 12;
var scrollSpeed = 6;
var defaultStartTime = 0;
var timelineControlSwitchState = 0;

window.dbg = () => {
    console.log(numberOfRows ,scrollSpeed, defaultStartTime)
}

const markReferences = []
const eventDataPopup = document.getElementsByClassName('event-data-popup')[0];
const settingsPopup = document.getElementsByClassName('settings-popup')[0];
const canvas = $("#timeline").get(0)

/** 
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext("2d")

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let change = true;


function drawTimelineRows() {
    ctx.save()
    ctx.strokeStyle = document.documentElement.style.getPropertyValue("--text-color")

    for (let i = 0; i < numberOfRows; i++) {
        ctx.beginPath()
        ctx.moveTo(0, i * canvas.height / numberOfRows);
        ctx.lineTo(canvas.width, i * canvas.height / numberOfRows);
        ctx.stroke();
    }
    ctx.restore()
}

function drawCenturyMarks() {
    if(middleTime == oldMiddleTime && timelineLength == oldTimelineLength) return;
    oldMiddleTime = middleTime;
    oldTimelineLength = timelineLength;
    let marks = []
    //calculate centuries which are in the area of timeline
    for (let i = 0; i < (timelineLength / 50) + (middleTime % 100 == 0); i++) {
        marks.push((Math.ceil(middleTime / 100) * 100 + ((i) * 100)) - timelineLength)
    }
    while (markReferences.length) {
        markReferences.pop().remove() //remove previously drawn marks
    }
    for (let mark of marks) {
        //Calculate where date is in timeline
        let positionX = (canvas.clientWidth / timelineLength) * (mark - middleTime) /  2 
        let element = $(`
            <div class="century-marker">
                <h4 class="century-text">${mark}</h4>
                <div class="reverse-triangle"></div>
                <div class="vertical-line"></div>
            </div>
        `)
        markReferences.push(element)
        $("#timeline-container").append(element)

        //subtract half of the elements width in order to compansate for vertical-line being in center of the century-marker
        element.css("transform", `translateX(${positionX-(element.width()/2)}px)`)
    }
}

function convertRemToPixels(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

const colorShade = (hexColor, magnitude) => {
    hexColor = hexColor.replace(`#`, ``);
    if (hexColor.length === 6) {
        const decimalColor = parseInt(hexColor, 16);
        let r = (decimalColor >> 16) + magnitude;
        r > 255 && (r = 255);
        r < 0 && (r = 0);
        let g = (decimalColor & 0x0000ff) + magnitude;
        g > 255 && (g = 255);
        g < 0 && (g = 0);
        let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
        b > 255 && (b = 255);
        b < 0 && (b = 0);
        return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
    } else {
        return hexColor;
    }
};

function drawEvents() {
    drawTimelineRows();
    const rowHeight = canvas.clientHeight / numberOfRows;
    const canvasTimelineLengthRatio = (canvas.clientWidth / timelineLength);
    ctx.font = "1rem 'Rubik'"
    for (let event of events) {
        ctx.save()
        let row = event.row * rowHeight
        let start = ((event.start.year - middleTime) * canvasTimelineLengthRatio / 2) + (canvas
            .clientWidth / 2)
        let length = ((event.end.year - event.start.year) * canvasTimelineLengthRatio / 2)

        ctx.fillStyle = event.color;
        if (event.isHovered) {
            ctx.fillStyle = colorShade(event.color, 40)
        }
        if(event.isSelected){
            openEditorPopup(event);
        }

        event.computedRect = [Math.floor(start), Math.floor(row), Math.floor(length), Math.floor(rowHeight)]

        ctx.fillRect(...event.computedRect)
        ctx.beginPath()
        ctx.rect(...event.computedRect)
        ctx.clip()
        ctx.fillStyle = "white"
        ctx.fillText(event.name, event.computedRect[0], event.computedRect[1] + (rowHeight + convertRemToPixels(1) / 2) / 2)
        ctx.restore()
    }
    //this loop is seperated so this menu will be drawn on top of every event
    for (let event of events) {
        if (event.isHovered) {
            ctx.save()
            ctx.fillStyle = "#ffffff"
            let rect = event.computedRect.slice();
            if (event.row == 0) {
                rect[1] += rowHeight;
            } else {
                rect[1] -= rowHeight;
            }
            //center text
            rect[0] -= (ctx.measureText(event.name).width - rect[2]) / 2
            rect[2] = ctx.measureText(event.name).width
            ctx.fillRect(...rect)

            ctx.fillStyle = "black"
            ctx.fillText(event.name, rect[0], rect[1]+(rect[3]/2), rect[2])
            ctx.restore()
        }
    }

}

function retrieveTimeline() {
    const url = "/api/retrieveTimeline"; 
  
    $.ajax({
      url: url,
      type: "GET",
      dataType: "json", 
      data: { Project: localStorage.getItem("CurrentProject") }, 
      success: function(res) {
        if (res === "Fail: Specified project does not exist") {
          console.error("Specified project does not exist.");
        } else {
            if(res == {}){
                return;
            }
            let response = (res);
            events = response["events"];
            let settings = response["settings"]
            numberOfRows = settings["numberOfRows"]
            scrollSpeed = settings["scrollSpeed"]
            middleTime = defaultStartTime = settings["defaultStartTime"]
            change = true;
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error("Error retrieving timeline:", textStatus, errorThrown);
      }
    });

    let inputs = $(".settings-popup").find("input[type=number]").get()
    inputs[0].value = numberOfRows;
    inputs[1].value = defaultStartTime;
    inputs[2].value = scrollSpeed;
  }
  
function openEditorPopup(event){
    $("#eventName").val(event.name)

    let startDate = $("#startDate").children()
    startDate[0].value = event.start.year
    startDate[1].value = event.start.month
    startDate[2].value = event.start.day

    let endDate = $("#endDate").children()
    endDate[0].value = event.end.year
    endDate[1].value = event.end.month
    endDate[2].value = event.end.day

    $("#rowInput").val(event.row)

    $("#colorInput").val(event.color)

    eventDataPopup.style.display = 'block';  
}

$("#timeline-container").on("wheel", (x) => {
    if(timelineControlSwitchState == 0){
        middleTime -= (x.originalEvent.deltaY) / 100 * scrollSpeed
    }else if(timelineControlSwitchState == 1){
        // resizes the canvas and makes sure that timelineLength is in range of 100-1000 and is divisible by 100
        timelineLength = window.clampNumber(parseInt((timelineLength + (x.originalEvent.deltaY)) / 100) * 100,100,1000)
    }
    change = true;
})

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = parseInt( event.clientX - rect.left );
    const y = parseInt( event.clientY - rect.top );

    for (const eventData of events) {
        const {
            computedRect
        } = eventData;
        
        
        let xInBounds = (x >= computedRect[0]) && (x <= computedRect[0] + computedRect[2]);
        let yInBounds = (y >= computedRect[1]) && (y <= computedRect[1] + computedRect[3]);
        
        if ( xInBounds && yInBounds) {
            if(!eventData.isHovered){
                change = true;
            }
            eventData.isHovered = true;
            break;
        } else {
            if(eventData.isHovered){
                change = true;
            }
            eventData.isHovered = false;
        }
    }
});

canvas.addEventListener('dblclick', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = parseInt( event.clientX - rect.left );
    const y = parseInt( event.clientY - rect.top );

    for (const eventData of events) {
        const {
            computedRect
        } = eventData;
        
        
        let xInBounds = (x >= computedRect[0]) && (x <= computedRect[0] + computedRect[2]);
        let yInBounds = (y >= computedRect[1]) && (y <= computedRect[1] + computedRect[3]);
        
        if ( xInBounds && yInBounds) {
            if(!eventData.isSelected){
                change = true;
            }
            eventData.isSelected = true;
            break;
        } else {
            if(eventData.isSelected){
                change = true;
            }
            eventData.isSelected = false;
        }
    }
});


function mainLoop() {
    if (change) {
        ctx.clearRect(0,0,canvas.width,canvas.height)
        drawEvents()
        drawCenturyMarks();
        console.log(timelineLength)
        change = false;
    }

    requestAnimationFrame(mainLoop)
}

function saveTimeline() {
    const url = "/api/saveTimeline"; 
    $.ajax({
      url: url,
      type: "POST",
      dataType: "text", 
      data: JSON.stringify({ Project: localStorage.getItem("CurrentProject"), Data: {
        events, 
        settings: {
            scrollSpeed,
            defaultStartTime,
            numberOfRows
        }
      } }),
      contentType: "application/json; charset=utf-8", 
      success: function(response) {
        if (response === "Sucess") {
          console.log("Timeline saved successfully!");
        } else {
          console.error("Failed to save timeline:", response);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error("Error saving timeline:", textStatus, errorThrown);
      }
    });
}

function saveEvent(){
    let name = $("#eventName").val()  
    let startDate = (() => {
        let [year, month, day] = $("#startDate").children().get();
        return new EventDate(parseInt(year.value), parseInt(month.value), parseInt(day.value))
    })() 
    
    let endDate = (() => {
        let [year, month, day] = $("#endDate").children().get();
        return new EventDate(parseInt(year.value), parseInt(month.value), parseInt(day.value))
    })() 

    let row = $("#rowInput").val()
    let color = $("#colorInput").val()
    
    let eventIndex = events.findIndex((x) => {
        return x["name"] == name;
    })
    if(eventIndex == -1){
        events.push({
            name,
            start: startDate,
            end: endDate,
            row,
            color,
            isHovered: false,
            isSelected: false,
            computedRect: [],
        })
    }else{
        events[eventIndex] = {
            name,
            start: startDate,
            end: endDate,
            row,
            color,
            isHovered: false,
            isSelected: false,
            computedRect: [],
        }
    }

    //update timeline
    change = true;
    
    //close popup
    eventDataPopup.style.display = 'none';
    
    //reset form
    $("#eventName").val("")
    $("#startDate").children().val(1)
    $("#endDate").children().val(1)
    $("#rowInput").val(0)
    $("#colorInput").val("#000000")

    saveTimeline()
}


/** 
 * @type {HTMLElement}
 * @type {HTMLElement}
 * @type {HTMLElement}
 */
const createEventButton = $(".toolbar").children().get(0);
const timelineControlSwitch = $(".toolbar").children().get(1);
const settingsButton = $(".toolbar").children().get(2);

document.addEventListener('click', (event) => {
    if (!eventDataPopup.contains(event.target) && !createEventButton.contains(event.target)) {
        eventDataPopup.style.display = 'none';
    }
    if(!settingsPopup.contains(event.target) && !settingsButton.contains(event.target) && settingsPopup.style.display == 'block'){
        settingsPopup.style.display = 'none'
        //save settings 
        let e = $(".settings-popup").find("input[type=number]").get();
        [numberOfRows,defaultStartTime,scrollSpeed] = [
            parseInt(e[0].value),
            parseInt(e[1].value),
            parseInt(e[2].value)
        ]
        saveTimeline()
    }
});

timelineControlSwitch.addEventListener("click" , (event) => {
    event.stopPropagation()
    timelineControlSwitchState++;
    timelineControlSwitchState %= 2;
    let icon = $(timelineControlSwitch).children("i")
    switch(timelineControlSwitchState){
        case 0: 
            //move
            icon.addClass("fa-left-right")
            icon.removeClass("fa-arrows-left-right-to-line")
            break;
        case 1:
            //scale
            icon.addClass("fa-arrows-left-right-to-line")
            icon.removeClass("fa-left-right")
            break;
    }
    
})

createEventButton.addEventListener('click', (event) => {
    eventDataPopup.style.display = 'block';
});
settingsButton.addEventListener('click', (event) => {
    let inputs = $(".settings-popup").find("input[type=number]").get()
    inputs[0].value = numberOfRows;
    inputs[1].value = defaultStartTime;
    inputs[2].value = scrollSpeed;

    settingsPopup.style.display = 'block';
});

retrieveTimeline()
requestAnimationFrame(mainLoop)

window.saveEvent = saveEvent;

$(window).on('resize', () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    change = true;
})
