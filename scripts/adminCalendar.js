
var gameTypes = ["B2", "B3", "B4", "B5", "B6", "B7", "D1", "D2"];
var daysName = [""]
var gHours = [];
var allDays = [];
var freeDays = [];
var date;
var gDay;
var betweenDate = [];
function getScheduleRendered() {

    let d = new Date()
    let year = d.getFullYear();
    let month = (d.getMonth() < 9 ? "0" + Number(d.getMonth() + 1) : Number(d.getMonth() + 1));
    let day = d.getDate() < 9 ? "0" + d.getDate() : d.getDate();

    let dateString = year + "-" + month + "-" + day;

    $("#newdate").val(dateString);
    selectDay(d.getDate() - 1)

}

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
    let month = (d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1)
    let day = dayI < 9 ? "0" + Number(dayI + 1) : Number(dayI + 1);


    date = year + "-" + month + "-" + day

    $(".calendar-content").html("")
    $(".calendar-content").addClass("calendar-times").removeClass("calendar-content");
    getFreePos(date)
    getOpenHours(date)
}

function selectDayOther(date) {
    $(".calendar-times").html("");
    $(".calendar-content").html("")
    $(".calendar-content").addClass("calendar-times").removeClass("calendar-content");
    getFreePos(date)
    getOpenHoursWithParam(date.getDay())
}

function getOpenHours(date) {
    gHours = []

    let d = new Date();

    $.post(apiUrl + "getOpenHours.php",
        {
            day: d.getDay()
        },
        (res, status) => {



            //let data = JSON.parse(res);
            let start = Number(res.opening);
            let end = res.closing
            let diff;
            if (start > end) {
                diff = (24 - Number(start)) + Number(end);
            }
            else {
                diff = end - start
            }

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
    $(".calendar-times").html("")
    $(".calendar-times").addClass("calendar-content").removeClass("calendar-times");
    renderDays(year, month);
}



function getFreePos(date) {

    $.ajax({
        type: "POST",
        url: apiUrl + "getAdminReservations.php",
        data: "data=" + JSON.stringify({ date: date }),
        dataType: "JSON",
        success: function (response) {

            let array = [];
            for (let i = 0; i < response.length; i++) {
                array.push({
                    time: Number(response[i].time),
                    name: (response[i].name),
                    email: (response[i].email),
                    phone: (response[i].phone),
                    gameType: response[i].gameType,
                    coupon: response[i].coupon,
                    desc: response[i].desc,
                    free: response[i].free,
                    rank: response[i].rank
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
                array[i].name = freeArray[j].name
                array[i].email = freeArray[j].email
                array[i].phone = freeArray[j].phone
                array[i].coupon = freeArray[j].coupon
                array[i].desc = freeArray[j].desc
                array[i].rank = freeArray[j].rank



            }
        }
    }
    freeDays = array

    generateHtml()
}

function generateHtml() {
    $(".calendar-times").html("")
    $(".times-table").html("")
    if (gHours.length == 0) {
        $(".calendar-times").html("<h3>Ma zárva van</h3>")
    }
    else {
        for (let i = 0; i < gHours.length; i++) {

            if (Number(gHours[i] + 1) == 25) {
                $(".calendar-times").append(`
                <div class="times-table">
                    <div class="time">
                        <p>`+ gHours[i] + `:00  -  02:00</p>
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

            freeDays.forEach((e, j) => {
                if (Number(e.time) === Number(gHours[i])) {
                    if (e.free == false) {
                        switch (Number(e.rank)) {
                            case 1:
                                if (e.gameType.substr(0, 1) == "B") {
                                    if (e.coupon) {
                                        $(".times-table:nth-child(" + (i + 1) + ")").append(
                                            "<div style = 'background-color:orange;border:1px solid red' title='Név: " + e.name + "' class= 'game-type' onclick='getScheduleInfo(" + j + ")'>" +
                                            "<p>" + e.gameType + "</p>" +
                                            "</div > ")
                                    } else {
                                        $(".times-table:nth-child(" + (i + 1) + ")").append(
                                            "<div style = 'background-color:orange' title='Név: " + e.name + "' class= 'game-type' onclick='getScheduleInfo(" + j + ")'>" +
                                            "<p>" + e.gameType + "</p>" +
                                            "</div > ")
                                    }

                                }
                                else {
                                    if (e.coupon) {

                                    } else {

                                    }
                                    $(".times-table:nth-child(" + (i + 1) + ")").append(
                                        "<div style = 'background-color:yellow' title='Név: " + e.name + "' class= 'game-type' onclick='getScheduleInfo(" + j + ")'>" +
                                        "<p>" + e.gameType + "</p>" +
                                        "</div > ")
                                }

                                break;
                            case 2:
                                if (e.gameType.substr(0, 1) == "B") {
                                    if (e.coupon) {
                                        $(".times-table:nth-child(" + (i + 1) + ")").append(
                                            "<div style = 'background-color:lightblue;border:1px solid red' title='Név: " + e.name + "' class= 'game-type' onclick='getScheduleInfo(" + j + ")'>" +
                                            "<p>" + e.gameType + "</p>" +
                                            "</div > ")
                                    } else {
                                        $(".times-table:nth-child(" + (i + 1) + ")").append(
                                            "<div style = 'background-color:lightblue' title='Név: " + e.name + "' class= 'game-type' onclick='getScheduleInfo(" + j + ")'>" +
                                            "<p>" + e.gameType + "</p>" +
                                            "</div > ")
                                    }

                                }
                                else {
                                    if (e.coupon) {
                                        $(".times-table:nth-child(" + (i + 1) + ")").append(
                                            "<div style = 'background-color:lightgreen;border:1px solid red' title='Név: " + e.name + "' class= 'game-type' onclick='getScheduleInfo(" + j + ")'>" +
                                            "<p>" + e.gameType + "</p>" +
                                            "</div > ")
                                    } else {
                                        $(".times-table:nth-child(" + (i + 1) + ")").append(
                                            "<div style = 'background-color:lightgreen' title='Név: " + e.name + "' class= 'game-type' onclick='getScheduleInfo(" + j + ")'>" +
                                            "<p>" + e.gameType + "</p>" +
                                            "</div > ")
                                    }

                                }

                                break;
                            case 3:
                                if (e.name == "VIP") {
                                    $(".times-table:nth-child(" + (i + 1) + ")").append(
                                        "<div style = 'background-color:gold' class= 'game-type' onclick='vipInfo(" + j + ")'>" +
                                        "<p>" + e.gameType + "</p>" +
                                        "</div > ")
                                } else {
                                    if (e.coupon) {
                                        $(".times-table:nth-child(" + (i + 1) + ")").append(
                                            "<div style = 'background-color:khaki;border:1px solid red' title='Név: " + e.name + "' class= 'game-type' onclick='vipInfo(" + j + ")'>" +
                                            "<p>" + e.gameType + "</p>" +
                                            "</div > ")
                                    }
                                    else {
                                        $(".times-table:nth-child(" + (i + 1) + ")").append(
                                            "<div style = 'background-color:khaki' title='Név: " + e.name + "' class= 'game-type' onclick='vipInfo(" + j + ")'>" +
                                            "<p>" + e.gameType + "</p>" +
                                            "</div > ")
                                    }

                                }

                            default:
                                break;
                        }

                        // $(".times-table:nth-child(" + (i + 1) + ")").append(
                        //     "<div style = 'background-color:red' class= 'game-type' onclick='getScheduleInfo(" + j + ")'>" +
                        //     "<p>" + e.gameType + "</p>" +
                        //     "</div > ")

                    }
                    else {
                        $(".times-table").eq(i).append(
                            "<div class= 'game-type' onclick='setAdminSchedule(" + j + ")' >" +
                            "<p>" + e.gameType + "</p>" +
                            "</div > ")
                    }
                }
            });
        }
    }
}

$(".game-type").click(function (e) {
    e.preventDefault();
    console.log(e)
});
let index;
function getScheduleInfo(j) {
    $(".settings-panel").css("display", "flex");
    index = j;
    adminGameData = freeDays[index]
    let data = freeDays[j];
    $("#newGameType").val(data.gameType)
    $(".schedule-info").css("display", "flex")
    $("#scheduled-info-text").html(`
        Név: ${data.name} <br>
        Email: ${data.email} <br>
        Telefon: ${data.phone} <br>
        Megjegyzés: ${data.desc} <br>
        Kupon kód: ${data.coupon}
    `)

}

function closeAdminForm() {
    $(".schedule-info").css("display", "none");
    closePanel()
}

function getOpenHoursWithParam(date) {
    gHours = []
    console.log(gHours)
    $.post(apiUrl + "getOpenHours.php",
        {
            day: date
        },
        (res, status) => {



            //let data = JSON.parse(res);
            let start = Number(res.opening);
            let end = res.closing
            let diff;
            if (start > end) {
                diff = (24 - Number(start)) + Number(end);
            }
            else {
                diff = end - start
            }

            for (let i = 0; i < diff; i += 2) {
                let d = new Date();
                d.setHours(Number(start) + i)

                let hours = d.getHours()
                gHours.push(hours)

            }
        }
    )
}


function changeCurrentDate(dayCh) {

    let newDate = new Date(date)
    console.log(newDate.addDays(dayCh), new Date(betweenDate["max"]))
    let cd = newDate.addDays(dayCh);

    let year = cd.getFullYear();
    let month = (cd.getMonth() < 9 ? "0" + Number(cd.getMonth() + 1) : Number(cd.getMonth() + 1));
    let day = cd.getDate() < 9 ? "0" + cd.getDate() : cd.getDate();

    let dateString = year + "-" + month + "-" + day;
    date = dateString;
    console.log("dateString: ", dateString)
    getFreePos(dateString);
    getOpenHoursWithParam(cd.getDay())
    $("#currentDate").text(dateString)
    $("#newdate").val(dateString);

}


function gohome() {
    let newD = new Date();
    let year = newD.getFullYear();
    let month = (newD.getMonth() < 9 ? "0" + Number(newD.getMonth() + 1) : Number(newD.getMonth() + 1));
    let day = newD.getDate() < 9 ? "0" + newD.getDate() : newD.getDate();

    let dateString = year + "-" + month + "-" + day;
    date = dateString;
    console.log("dateString: ", dateString)
    getFreePos(dateString);
    getOpenHoursWithParam(newD.getDay())
    $("#currentDate").text(dateString)
    $("#newdate").val(dateString);
}

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}