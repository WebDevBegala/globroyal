
let days = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
let openHours = [];
var changedHours = [];
var newGHours = [];


var releaseUrl = "https://globroyal.hu/globroyal/";
var developmentUrl = "http://192.168.64.4/globroyal/";

var apiUrl = releaseUrl;


defaultChangeHours()

$(document).ready(function () {
    $("#openhours").css("background-color", "lightblue")
});


function login() {

    let data = {
        email: $("#email").val(),
        password: $("#password").val()
    }
    let resData;
    $.ajax({
        type: "POST",
        url: apiUrl + "login.php",
        data: "data=" + JSON.stringify(data),
        dataType: "JSON",
        success: function (res) {
            logined(res)
        },
        error: function (response) {
            console.log(response.responseText)
        },

    });


    return resData;
}

let logined = (data) => {
    $(".form-block").hide();
    $(".admin-panel").show();
}

$("#day-block").ready(() => {

    getDaysOpened()

    for (let i = 1; i <= days.length; i++) {
        let a = i
        let dayI = a == 7 ? 0 : a++;
        $("#day-block").append(`<div class="day">
        <p>`+ days[i - 1] + `</p>
        <div>
            <p>Nyitás:</p>
            <input type="time" step="3600000" max="24"  id="open-`+ dayI + `" onblur="changeHandler(${dayI},'open')" >
        </div>
        <div>
            <p>Zárás:</p>
            <input type="time" step="3600000"  id="close-`+ dayI + `" onblur="changeHandler(${dayI},'close')" >
        </div>
        <div style="display:flex;align-items:center" >
            <p>Zárva van:</p>
            <input type="checkbox" id="checkbox-`+ dayI + `" onclick="changeClosed(${dayI})" >
        </div>
    </div>`);
    }
})

$(".item").click(function () {
    let id = $(this).attr("id");
    $("#" + id).css("background-color", "lightblue");
    $(".item").not("#" + id).css("background-color", "white")
})

function refreshTimes(times) {
    times.forEach(e => {
        $("#open-" + e.day).val(formatHour(e.opening));
        $("#close-" + e.day).val(formatHour(e.closing));
    });
}

let formatHour = (time) => {
    return res = time > 9 ? time + ":00" : "0" + time + ":00"
}

function changeHandler(day, timeSer) {
    let newTime;
    if (timeSer == "open") {
        newTime = $("#open-" + day).val()
        newTime = newTime.replace(":00", "")
        changedHours[day].open = Number(newTime);
    }
    else {
        newTime = $("#close-" + day).val()
        newTime = newTime.replace(":00", "")
        changedHours[day].close = Number(newTime);
    }


}

function changeClosed(day) {
    changedHours[day].closed = !changedHours[day].closed;

}

function changeOpenHours() {
    let data = JSON.stringify(changedHours);
    console.log("Send:", data)
    $.ajax({
        type: "POST",
        url: apiUrl + "changeHours.php",
        data: "data=" + data,
        dataType: "JSON",
        success: function (response) {
            if (response) {
                alert("Sikeres változtatás");
                getDaysOpened()
            }
            // console.log("Response: ",response)
        },
        error: function (err) {
            console.log("Err: ", err);

        }

    });
}

function defaultChangeHours() {
    for (let i = 1; i <= days.length; i++) {
        let a = i
        let dayI = a == 7 ? 0 : a++;
        changedHours[dayI] = {
            open: -1,
            close: -1,
            closed: false
        }
    }
}

function goToCalendar() {
    $(".openhours-panel").css("display", "none");
    $(".schedule").css("display", "block");
    $(".vip-panel").css("display", "none");
}

function goToOpenHours() {
    $(".openhours-panel").css("display", "block");
    $(".schedule").css("display", "none");
    $(".vip-panel").css("display", "none");
}
function goToVip() {
    $(".openhours-panel").css("display", "none");
    $(".schedule").css("display", "none");
    $(".vip-panel").css("display", "block");
}

function showScheduled(items) {
    console.log(items)
}

function getDaysOpened() {
    $.ajax({
        type: "POST",
        url: apiUrl + "getOpenHours.php",
        data: "",
        dataType: "JSON",
        success: function (response) {
            refreshTimes(response)
        },
        error: function (err) {
            console.log("Error: ", err)

        }
    });
}

function setVip() {

    let newGHours = [];
    let type = $("#newVipGameType").val();

    let date = $("#vip-date").val()
    let d = new Date(date)

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

                let hours = d.getHours();
                hours = hours > 9 ? hours + ":00" : "0" + hours + ":00"
                newGHours.push(hours)

            }
        }
    )
    let hours = [];
    for (let index = 0; index < newGHours.length; index++) {
        hours[index] = newGHours[index];

    }

    console.log("Send", hours)
    setTimeout(() => {
        let data = {
            gameType: type,
            date: date,
            times: newGHours,
            edit: false
        }
        console.log("Send", data)
        $.ajax({
            type: "POST",
            url: apiUrl + "setVip.php",
            data: "data=" + JSON.stringify(data),
            dataType: "JSON",
            success: function (res) {
                console.log(res)
            },
            error: function (response) {
                console.log(response)
            },

        });
    }, 100);

}

function vipInfo(i) {
    let data = freeDays[i];
    adminGameData = freeDays[i]
    $(".vip-settings").css("display", "block")
    $("#vip-gametype").text(data.gameType)
    let time = data.time > 9 ? data.time + ":00" : "0" + data.time + ":00"
    let d = new Date()
    let year = d.getFullYear();
    let month = (d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1)
    let dayI = gDay;
    let day = dayI < 9 ? "0" + Number(dayI + 1) : Number(dayI + 1)

    date = year + "-" + month + "-" + day;
    $("#vip-date").text(date + " " + time)
    $("#vip-name").text("Név: " + data.name)
    $("#vip-email").text("Email: " + data.email || "nincs")
    $("#vip-phone").text("Telefon: " + data.phone || "nincs")
    $("#vip-coupon").text("Kupon: " + data.coupon || "nincs")
    $("#vip-desc").text("Megjegyzés: " + data.desc || "nincs")


}

function closeAdminVipBookingPanel() {
    $(".vip-settings").css("display", "none")
}

function deleteSchedule() {
    let d = new Date()
    let year = d.getFullYear();
    let month = (d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1)
    let dayI = gDay;
    let day = dayI < 9 ? "0" + Number(dayI + 1) : Number(dayI + 1)

    date = year + "-" + month + "-" + day;
    let time = adminGameData.time < 10 ? "0" + adminGameData.time : adminGameData.time;
    let nextTime = adminGameData.time < 10 ? "0" + Number(adminGameData.time + 1) : Number(adminGameData.time + 1);
    let data = {
        date: date + " " + time + ":00",
        gameType: adminGameData.gameType,
        date: date + " " + time + ":00",
        nextDate: date + " " + nextTime + ":00",
    }
    $.ajax({
        type: "POST",
        url: apiUrl + "deleteSchedule.php",
        data: "data=" + JSON.stringify(data),
        dataType: "JSON",
        success: function (res) {
            alert("Sikeres törlés")
        },
        error: function (response) {
            alert("Sikertelen törlés")
        },

    });
}