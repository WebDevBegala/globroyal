
var gameTypes = ["B2", "B3", "B4", "B5", "B6", "B7", "D1", "D2"];
var daysName = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
var gHours = [];
var allDays = [];
var freeDays = [];
var date;
var newDate = new Date();
var gDay;
var betweenDate = [];
function accepted() {
    $(".footer-blocking").hide();
    $(".footer").hide();
}

$(document).ready(() => {
    $(".backarrow").css("display", "none");
    $(".datearrow").css("display", "none");


    bookingDate = date
    let d = new Date()
    let year = d.getFullYear();
    let month = d.getMonth()
    let day = d.getDate();
    let monthString = month > 9 ? (month + 1) : "0" + (month + 1)
    $("#currentDate").text(year + "-" + monthString)
    renderDays(year, month)
})
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
function renderDays(year, month) {
    var calendarContent = $(".calendar-content");
    $(".calendar-content").html("")
    let d = new Date();
    betweenDate["min"] = d.getTime();
    betweenDate["max"] = (d.addDays(14)).getTime();

    for (let i = 0; i < 14 + 1; i++) {
        //console.log(i)
        let cD = d.addDays(i);
        let dayString = daysName[cD.getDay()] == undefined ? "Hétfő" : daysName[cD.getDay()];
        let monthString = cD.getMonth() < 9 ? "0" + Number(cD.getMonth() + 1) : Number(cD.getMonth() + 1)
        let dateString = cD.getDate() < 9 ? "0" + cD.getDate() : cD.getDate()
        $(".calendar-content").append(`
    <div class="c-block" onclick="selectDay(`+ Number(cD.getMonth() + 1) + "," + cD.getDate() + `)" ><p style="margin:0.5em" >` + monthString + "." + dateString + "</br>" + dayString + `</p></div>
    `)
    }
}

const selectDay = (monthI, dayI) => {

    $(".backarrow").css("display", "block");
    $(".datearrow").css("display", "block");
    gDay = dayI;
    let d = new Date()
    let year = d.getFullYear();
    let month = (monthI < 9 ? "0" + (monthI) : monthI);
    let day = dayI < 9 ? "0" + dayI : dayI;

    date = year + "-" + month + "-" + day
    newDate = new Date(date)
    console.log(newDate)
    console.log("Date: ", d.getMonth())
    $(".calendar-content").html("")
    $(".calendar-content").addClass("calendar-times").removeClass("calendar-content");
    getFreePos(date)
    getOpenHours(date)
    $("#currentDate").text(date)
}

function getOpenHours(date) {
    gHours = []

    let d = new Date(date);
    let day = d.getDay();
    console.log("Day: ", day, d.getMonth(), date)
    $.post(apiUrl + "getOpenHours.php",
        {
            day: day
        },
        (res, status) => {


            let start = Number(res.opening);
            let end = res.closing
            let diff;
            if (start > end) {
                diff = (24 - Number(start)) + Number(end - 1);
            }
            else {
                diff = end - start
            }
            console.log(diff)
            for (let i = 0; i < diff; i += 2) {
                let d = new Date();
                d.setHours(Number(start) + i)

                let hours = d.getHours()
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
    $(".backarrow").css("display", "none");
    $(".datearrow").css("display", "none");

    month = (month < 9 ? "0" + Number(month + 1) : Number(month + 1));
    let currentdateString = year + "-" + month;
    $("#currentDate").text(currentdateString)
    $(".calendar-times").html("")
    $(".calendar-times").addClass("calendar-content").removeClass("calendar-times");
    renderDays(year, month);
}



function getFreePos(date) {
    console.log("Get Free Pos")
    $.ajax({
        type: "POST",
        url: apiUrl + "getReservations.php",
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
    if (gHours.length == 0) {
        $(".calendar-times").html("<h3>Ma sajnos zárva van</h3>")
    }
    else {
        for (let i = 0; i < gHours.length; i++) {


            if (Number(gHours[i] + 1) == 25) {
                $(".calendar-times").append(`
                <div class="times-table">
                    <div class="time">
                        <p>`+ gHours[i] + `:00  -  1:00</p>
                    </div>
                 </div>`);
            } else {
                $(".calendar-times").append(`
                <div class="times-table">
                    <div class="time">
                        <p>`+ gHours[i] + `:00  - ` + Number(gHours[i] + 2) + `:00</p>
                    </div>
                 </div>`);
            }


        }
        for (let i = 0; i < gHours.length; i++) {

            freeDays.forEach(e => {
                if (Number(e.time) === Number(gHours[i])) {
                    if (e.free == false) {
                        $(".times-table:nth-child(" + (i + 1) + ")").append(
                            "<div style = 'background-color:red' class='game-type' onclick = 'alert(`Ez a hely sajnos már foglalt!`)' >" +
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
}

function changeCurrentDate(dayCh) {
    let cdMin = new Date(betweenDate["min"]);
    let cdMax = new Date(betweenDate["max"]);

    if ((newDate.addDays(dayCh)).getTime() >= betweenDate["min"] && (newDate.addDays(dayCh)).getTime() <= betweenDate["max"]) {
        console.log(newDate.addDays(dayCh), new Date(betweenDate["max"]))
        let cd = newDate.addDays(dayCh);
        newDate = cd;
        let year = cd.getFullYear();
        let month = (cd.getMonth() < 9 ? "0" + Number(cd.getMonth()+1) : Number(cd.getMonth()+1));
        let day = cd.getDate() < 9 ? "0" + cd.getDate() : cd.getDate();

        let dateString = year + "-" + month + "-" + day;
        console.log("dateString: ", dateString)
        getFreePos(dateString);
        getOpenHours(dateString)
        $("#currentDate").text(dateString)
    }
}