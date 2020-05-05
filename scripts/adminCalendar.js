
var gameTypes = ["B2", "B3", "B4", "B5", "B6", "B7", "D1", "D2"];
var daysName = [""]
var gHours = [];
var allDays = [];
var freeDays = [];
var date;
var gDay;
$(".schedule").ready(() => {
    console.log("ready")
    let d = new Date()
    let year = d.getFullYear();
    let month = d.getMonth()
    let day = d.getDate();
    console.log(d.getDate() - 1)
    selectDay(d.getDate() - 1)
    //     $.post("https://globroyal.hu/globroyal/getOpenHours.php",
    //     {
    //         day: day
    //     },
    //     (res, status) => {
    //         console.log(res)

    //         //let data = JSON.parse(res);
    //         let start = Number(res.opening);
    //         let end = res.closing
    //         let diff;
    //         if (start > end) {
    //             diff = (24 - Number(start)) + Number(end);
    //         }
    //         else {
    //             diff = end-start
    //         }

    //         diff = NaN ? 0 : diff;
    //         console.log(diff)
    //         for (let i = 0; i < diff; i++) {
    //             let d = new Date();
    //             d.setHours(Number(start) + i)

    //             let hours = d.getHours() == 0 ? 24 : d.getHours()
    //             gHours.push(hours)

    //         }
    //     }
    // )
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
    let month = (d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1)
    let day = dayI < 9 ? "0" + Number(dayI + 1) : Number(dayI + 1);


    date = year + "-" + month + "-" + day
    console.log("Date: ", date)
    $(".calendar-content").html("")
    $(".calendar-content").addClass("calendar-times").removeClass("calendar-content");
    getFreePos(date)
    getOpenHours(date)
}

function getOpenHours(date) {
    gHours = []

    let d = new Date();
    console.log("Day: ", d.getDate(), date)
    $.post(apiUrl + "getOpenHours.php",
        {
            day: d.getDay()
        },
        (res, status) => {

            console.log("Openhours:", res)

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
        url: apiUrl + "getAdminReservations.php",
        data: "data=" + JSON.stringify({ date: date }),
        dataType: "JSON",
        success: function (response) {
            console.log(response);
            let array = [];
            for (let i = 0; i < response.length; i++) {
                array.push({
                    time: Number(response[i].time),
                    name: (response[i].name),
                    email: (response[i].email),
                    phone: (response[i].phone),
                    gameType: response[i].gameType,
                    coupon: response[i].coupon,
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
    console.log("All: ", freeArray)
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


            }
        }
    }
    freeDays = array

    generateHtml()
}

function generateHtml() {
    $(".calendar-times").html("")
    if (gHours.length == 0) {
        $(".calendar-times").html("<h3>Ma zárva van</h3>")
    }
    else {
        for (let i = 0; i < gHours.length; i++) {


            $(".calendar-times").append(`
        <div class="times-table">
            <div class="time">
                <p>`+ gHours[i] + `:00</p>
            </div>
         </div>`);




        }
        for (let i = 0; i < gHours.length; i++) {

            freeDays.forEach((e, j) => {
                if (Number(e.time) === Number(gHours[i])) {
                    if (e.free == false) {
                        $(".times-table:nth-child(" + (i + 1) + ")").append(
                            "<div style = 'background-color:red' class= 'game-type' onclick='getScheduleInfo(" + j + ")'>" +
                            "<p>" + e.gameType + "</p>" +
                            "</div > ")
                    }
                    else {
                        $(".times-table").eq(i).append(
                            "<div class= 'game-type' >" +
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
    index = j;
    let data = freeDays[j];
    $("#newGameType").val(data.gameType)
    $(".schedule-info").css("display", "flex")
    $("#scheduled-info-text").html(`
        Név: ${data.name} <br>
        Email: ${data.email} <br>
        Telefon: ${data.phone} <br>
        Kupon kód: ${data.coupon}
    `)

}



