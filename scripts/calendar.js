
var gameTypes = ["B2", "B3", "B4", "B5", "B6", "B7", "D1", "D2"];
var gHours = [];
var allDays = [];
var freeDays = [];
var date;
var gDay;
$(document).ready(() => {

    let d = new Date()
    let year = d.getFullYear();
    let month = d.getMonth()
    let day = d.getDate();

    renderDays(year, month)
    $.post("https://globroyal.hu/globroyal/index.php",
    {
        day: day
    },
    (res, status) => {
        console.log(res)

        //let data = JSON.parse(res);
        let start = Number(res.opening);
        let end = res.closing
        let diff;
        if (start > end) {
            diff = (24 - Number(start)) + Number(end);
        }
        else {
            diff = end-start
        }
        console.log(diff)
        for (let i = 0; i < diff; i++) {
            let d = new Date();
            d.setHours(Number(start) + i)

            let hours = d.getHours() == 0 ? 24 : d.getHours()
            gHours.push(hours)

        }
    }
)
})

function renderDays(year, month) {
    var calendarContent = $(".calendar-content");
    $(".calendar-content").html("")
    let d = new Date(year, month, 0)
    for (let i = 1; i < d.getDate() + 1; i++) {
        //console.log(i)
        $(".calendar-content").append(`
    <div class="c-block" onclick="selectDay(`+ i + `)" ><p style="margin:0.5em" >` + i + `</p></div>
    `)
    }
}

const selectDay = (dayI) => {
    gDay = dayI;
    let d = new Date()
    let year = d.getFullYear();
    let month = (d.getMonth() < 9 ? "0" +( d.getMonth()+1) : d.getMonth()+1)
    let day = dayI < 9 ? "0" + dayI : dayI;
   
    date = year + "-" + month + "-" + day
    console.log("Date: ",d.getMonth())
    $(".calendar-content").html("")
    $(".calendar-content").addClass("calendar-times").removeClass("calendar-content");
    getFreePos(date)
    getOpenHours(date)
}

function getOpenHours(date) {
    gHours = []
    console.log(date)
    let d = new Date(date);
    let day = d.getDay();
    console.log("Day: ", day,d.getMonth(),date)
    $.post("https://globroyal.hu/globroyal/getOpenHours.php",
        {
            day: day
        },
        (res, status) => {
            console.log(res)

            //let data = JSON.parse(res);
            let start = Number(res.opening);
            let end = res.closing
            let diff;
            if (start > end) {
                diff = (24 - Number(start)) + Number(end);
            }
            else {
                diff = end-start
            }
            console.log(diff)
            for (let i = 0; i < diff; i++) {
                let d = new Date();
                d.setHours(Number(start) + i)

                let hours = d.getHours() == 0 ? 24 : d.getHours()
                gHours.push(hours)

            }
        }
    )
}

function back() {
    let d = new Date()
    let year = d.getFullYear();
    let month = d.getMonth()
    let day = d.getDate();
    $(".calendar-times").html("")
    $(".calendar-times").addClass("calendar-content").removeClass("calendar-times");
    renderDays(year, month);
}



function getFreePos(date) {
    console.log("Get Free Pos")
    $.ajax({
        type: "POST",
        url: "https://globroyal.hu/globroyal/getReservations.php",
        data: "data=" + JSON.stringify({ date: date }),
        dataType: "JSON",
        success: function (response) {
            console.log(response);
            let array = [];
            for (let i = 0; i < response.length; i++) {
                array.push({
                    time: Number(response[i].time),
                    gameType: response[i].gameType,
                    free: response[i].free
                })
            }

            generateDay(array)
        },
        error: function (err) {
            console.log(err)
        }

    });

}

function generateDay(otherArray) {

    setTimeout(function () {
        let array = []
        for (let i = 0; i < gHours.length; i++) {
            for (let j = 0; j < gameTypes.length; j++) {
                array.push({
                    time: gHours[i],
                    gameType: gameTypes[j]
                })
            }
        }

        generateFreeDays(array, otherArray)

    }, 100)

}

function generateFreeDays(allArray, freeArray) {
    freeDays = [];
    let array = allArray
    for (let i = 0; i < allArray.length; i++) {
        for (let j = 0; j < freeArray.length; j++) {
            if (array[i].gameType == freeArray[j].gameType
                && array[i].time == freeArray[j].time) {
                array[i].free = false
            }
        }
    }
    freeDays = array

    generateHtml()
}

function generateHtml() {
    $(".calendar-times").html("")
    for (let i = 0; i < gHours.length; i++) {


        $(".calendar-times").append(`
        <div class="times-table">
            <div class="time">
                <p>`+ gHours[i] + `:00</p>
            </div>
         </div>`);




    }
    for (let i = 0; i < gHours.length; i++) {

        freeDays.forEach(e => {
            if (Number(e.time) === Number(gHours[i])) {
                if (e.free == false) {
                    $(".times-table:nth-child(" + (i + 1) + ")").append(
                        "<div style = 'background-color:red' class= 'game-type' onclick = 'alert(`Ez a hely sajnos már foglalt!`)' >" +
                        "<p>" + e.gameType + "</p>" +
                        "</div > ")
                }
                else {
                    $(".times-table").eq(i).append(
                        "<div class= 'game-type' onclick='getBookingData(`" + e.gameType + "`," + e.time + ")' >" +
                        "<p>" + e.gameType + "</p>" +
                        "</div > ")
                }
            }
        });
    }
}

