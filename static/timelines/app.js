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

var middleTime = 1337;
var oldMiddleTime = -1;
var timelineLength = 200;
var numberOfRows = 12;
var oldNumberOfRows = 12;
var scrollSpeed = 6;

/*
{
    name: "War of the roses",
    color: "#ff1A17",
    start: new EventDate(1455, 4, 22),
    end: new EventDate(1487, 5, 16),
    row: 5,
    computedRect: [],
    isHovered: false
}*/

const markReferences = []
const events = [{
    name: "100 years war",
    color: "#1AFF17",
    start: new EventDate(1337, 4, 22),
    end: new EventDate(1453, 5, 16),
    row: 3,
    computedRect: [],
    isHovered: false
}]

const canvas = $("#timeline").get(0)

/** 
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext("2d")

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let change = true;


function drawTimelineRows() {
    if (oldNumberOfRows == numberOfRows) return;
    oldNumberOfRows = numberOfRows
    ctx.strokeStyle = "white"

    for (let i = 0; i < numberOfRows; i++) {
        ctx.moveTo(0, i * canvas.height / numberOfRows);
        ctx.lineTo(canvas.width, i * canvas.height / numberOfRows);
        ctx.stroke();
    }
}

function drawCenturyMarks() {
    if(middleTime == oldMiddleTime) return;
    oldMiddleTime = middleTime;
    let marks = []
    //calculate centuries which are in the area of timeline
    for (let i = 0; i < (timelineLength / 50) + (middleTime % 100 == 0); i++) {
        marks.push((Math.ceil(middleTime / 100) * 100 + ((i) * 100)) - timelineLength)
    }
    while (markReferences.length) {
        markReferences.pop().remove() //remove previously drawn marks
    }
    for (let mark of marks) {
        let positionX = (canvas.clientWidth / timelineLength) * (mark - middleTime) /
            2 //Calculate where date is in timeline
        let element = $(`
            <div class="century-marker">
                <h4 class="century-text">${mark}</h4>
                <div class="reverse-triangle"></div>
                <div class="vertical-line"></div>
            </div>
        `)
        markReferences.push(element)
        $("#timeline-container").append(element)

        //Point of subtracting half of the elements width is to compansate for vertical-line being in center of the century-marker
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

function drawEvents(updateEvent) {
    drawTimelineRows();
    const rowHeight = canvas.clientHeight / numberOfRows;
    ctx.font = "1rem 'Rubik'"
    for (let event of events) {
        let row = event.row * rowHeight
        let start = ((event.start.year - middleTime) * (canvas.clientWidth / timelineLength) / 2) + (canvas
            .clientWidth / 2)
        let length = ((event.end.year - event.start.year) * (canvas.clientWidth / timelineLength) / 2)

        ctx.fillStyle = event.color;
        if (event.isHovered) {
            ctx.fillStyle = colorShade(event.color, 40)
        }

        event.computedRect = [Math.floor(start), Math.floor(row), Math.floor(length), Math.floor(rowHeight)]

        ctx.fillRect(...event.computedRect)
        ctx.fillStyle = "white"
        ctx.beginPath()
        ctx.rect(...event.computedRect)
        ctx.save()
        ctx.clip()
        ctx.fillText(event.name, event.computedRect[0], event.computedRect[1] + (rowHeight + convertRemToPixels(1) / 2) / 2)
        ctx.restore()
    }
    //this loop is seperated so this menu will be drawn on top of every event
    for (let event of events) {
        if (event.isHovered) {
            ctx.fillStyle = "#ffffff"
            let rect = event.computedRect.slice();
            if (event.row == 0) {
                rect[1] += rowHeight;
            } else {
                rect[1] -= rowHeight;
            }
            ctx.fillRect(...rect)
        }
    }

}

$("#timeline-container").on("wheel", (x) => {
    middleTime -= (x.originalEvent.deltaY) / 100 * scrollSpeed
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
        
        console.log(x,y,eventData, xInBounds && yInBounds)
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

function mainLoop() {
    if (change) {
        ctx.clearRect(0,0,canvas.width,canvas.height)
        drawEvents()
        drawCenturyMarks();
        change = false;
    }
    requestAnimationFrame(mainLoop)
}


const popup = document.getElementsByClassName('event-data-popup')[0];
const createEventButton = $(".toolbar").children().get(0);
document.addEventListener('click', (event) => {
    if (!popup.contains(event.target) && !createEventButton.contains(event.target)) {
        popup.style.display = 'none';
    }
});

createEventButton.addEventListener('click', (event) => {
    popup.style.display = 'block';
});

requestAnimationFrame(mainLoop)