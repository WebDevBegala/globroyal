
let days = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
let openHours = [];
var changedHours = [];
var newGHours = [];
window.Buffer = window.Buffer;

var releaseUrl = "https://globroyal.hu/globroyal/";
var developmentUrl = "http://192.168.64.4/globroyal/";

var apiUrl = releaseUrl;


defaultChangeHours()

$(document).ready(function () {
    $("#openhours").css("background-color", "lightblue")
});

$(".btn-login").click(function (e) {
    login()
});

function login() {

    let data = {
        email: $("#email").val(),
        password: $("#password").val()
    }

    data = btoa(JSON.stringify(data));

    $.ajax({
        type: "POST",
        url: apiUrl + "login.php",
        data: "data=" + data,
        dataType: "JSON",
        success: function (res) {
            logined(res)
        },
        error: function (response) {
           alert("Sikertelen belépés")
        },

    });
}
function rendererEmployee() {
    $(".root").prepend(` <div class="vip-settings">
                            <div class="info">
                                <p id="vip-gametype"></p>
                                <p id="vip-date"></p>
                                <p id="vip-name"></p>
                                <p id="vip-email"></p>
                                <p id="vip-phone"></p>
                                <p id="vip-coupon"></p>
                                <p id="vip-desc"></p>
                            </div>
                            <div class="input">
                                <label for="">Név:</label>
                                <input type="text" id="name" />
                            </div>
                            <div class="input">
                                <label for="">Email:</label>
                                <input type="email" id="email" />
                            </div>
                            <div class="input">
                                <label for="email">Telefonszám:</label>
                                <input type="mobile" id="phone" />
                            </div>
                            <div class="input">
                                <label for="email">Megjegyzés:</label>
                                <input type="text" id="desc" />
                            </div>
                            <div class="input coupon-code">
                                <label>Kuponkód:</label>
                                <input type="text" placeholder="kód" id="coupon-code" />
                            </div>
                            <div class="adminSchedule-btn" onclick="setVipSchedule()">
                                <p>Átfoglalás</p>
                            </div>
                            <div class="close-btn" onclick="closeAdminVipBookingPanel()">
                                <p>Bezárás</p>
                            </div>
                        </div>
                        <div class="admin-forms">
                            <div class="info">
                                <p id="gametype"></p>
                                <p id="date"></p>
                            </div>
                            <div class="input">
                                <label for="">Név:</label>
                                <input type="text" id="a-name" />
                            </div>
                            <div class="input">
                                <label for="">Email:</label>
                                <input type="email" id="a-email" />
                            </div>
                            <div class="input">
                                <label for="email">Telefonszám:</label>
                                <input type="mobile" id="a-phone" />
                            </div>
                            <div class="input">
                                <label for="email">Megjegyzés:</label>
                                <input type="text" id="a-desc" />
                            </div>

                            <div class="input coupon-code">
                                <label>Kuponkód:</label>
                                <input type="text" placeholder="kód" id="a-coupon-code" />
                            </div>
                            <div class="adminSchedule-btn" onclick="adminSetSchedule()">
                                <p>Foglalás</p>
                            </div>
                            <div class="close-btn" onclick="closeAdminBookingPanel()">
                                <p>Bezárás</p>
                            </div>
                        </div>
                        <div class="schedule-info">
                            <p id="scheduled-info-text"></p>
                            <select name="" id="newGameType">
                                <option value="B2">B2</option>
                                <option value="B3">B3</option>
                                <option value="B4">B4</option>
                                <option value="B5">B5</option>
                                <option value="B6">B6</option>
                                <option value="B7">B7</option>
                                <option value="D1">D1</option>
                                <option value="D2">D2</option>
                            </select>
                            <div class="btn" onclick="editSchedule()">
                                <p>Átfoglalás</p>
                            </div>
                            <div class="btn" onclick="deleteSchedule()">
                                <p>Törlés</p>
                            </div>
                            <div class="close-btn" onclick="closeAdminForm()">
                                <p>Bezárás</p>
                            </div>
                        </div>`);
    $('.admin-panel').append(`<div class="menu">
    <div class="menu-items">
        <div style="display:block" class="schedule">
        <div class="calendar-block">
            <div class="date-navigator">
                <i class="fas fa-arrow-left" onclick="back()"></i>
            </div>
            <div class="calendar-content">

            </div>
        </div>
    </div>
      `);
    getScheduleRendered()

}

function rendererAdmin() {
    getDaysOpened()
    $('.admin-panel').append(`
    <div class= "menu" >
        <div class="menu-items">
            <div class="item" id="openhours" onclick="goToOpenHours()">
                <p>Nyitvatartások kezelése</p>
            </div>
            <div class="item" id="schedule" onclick="goToCalendar()">
                <p>Foglalások kezelése</p>
            </div>
            <div class="item" id="vip" onclick="goToVip()">
                <p>VIP kezelése</p>
            </div>
        </div>
    </div>
        <div class="openhours-panel">
            <div style="display: flex;" id="day-block"></div>
            <div class="btn-openhours" onclick="changeOpenHours()">
                <p>Szerkesztés</p>
            </div>
        </div>
        <div class="schedule">
            <div class="calendar-block">
                <div class="date-navigator">
                    <i class="fas fa-arrow-left" onclick="back()"></i>
                </div>
                <div class="calendar-content">

                </div>
            </div>
        </div>
        <div class="vip-panel">
            <select name="" id="newVipGameType">
                <option value="B2">B2</option>
                <option value="B3">B3</option>
                <option value="B4">B4</option>
                <option value="B5">B5</option>
                <option value="B6">B6</option>
                <option value="B7">B7</option>
                <option value="D1">D1</option>
                <option value="D2">D2</option>
            </select>

            <div class="setdate">

                <p>Mikortól legyen érvényes a VIP</p>
                <input type="time" step="3600000" name="" id="start">
                    <p>Meddig legyen érvényes a VIP</p>
                    <input type="time" step="3600000" name="" id="end">
                        <br>
                            <br>
                                <p>Válaszd ki a napot</p>
                                <select name="" id="vipDay">
                                    <option value="1">Hétfő</option>
                                    <option value="2">Kedd</option>
                                    <option value="3">Szerda</option>
                                    <option value="4">Csütörtök</option>
                                    <option value="5">Péntek</option>
                                    <option value="6">Szombat</option>
                                    <option value="0">Vasárnap</option>
                                </select>
    </div>
                            <div class="btn" onclick="setVip()">
                                <p>VIP beállítása</p>
                            </div>
                            <div class="btn" onclick="deleteVip()">
                                <p>VIP törlése</p>
                            </div>
</div>`)
    $(".root").append(` <div class="vip-settings">
                            <div class="info">
                                <p id="vip-gametype"></p>
                                <p id="vip-date"></p>
                                <p id="vip-name"></p>
                                <p id="vip-email"></p>
                                <p id="vip-phone"></p>
                                <p id="vip-coupon"></p>
                                <p id="vip-desc"></p>
                            </div>
                            <div class="input">
                                <label for="">Név:</label>
                                <input type="text" id="name" />
                            </div>
                            <div class="input">
                                <label for="">Email:</label>
                                <input type="email" id="email" />
                            </div>
                            <div class="input">
                                <label for="email">Telefonszám:</label>
                                <input type="mobile" id="phone" />
                            </div>
                            <div class="input">
                                <label for="email">Megjegyzés:</label>
                                <input type="text" id="desc" />
                            </div>
                            <div class="input coupon-code">
                                <label>Kuponkód:</label>
                                <input type="text" placeholder="kód" id="coupon-code" />
                            </div>
                            <div class="adminSchedule-btn" onclick="setVipSchedule()">
                                <p>Átfoglalás</p>
                            </div>
                            <div class="close-btn" onclick="closeAdminVipBookingPanel()">
                                <p>Bezárás</p>
                            </div>
                        </div>
                        <div class="admin-forms">
                            <div class="info">
                                <p id="gametype"></p>
                                <p id="date"></p>
                            </div>
                            <div class="input">
                                <label for="">Név:</label>
                                <input type="text" id="a-name" />
                            </div>
                            <div class="input">
                                <label for="">Email:</label>
                                <input type="email" id="a-email" />
                            </div>
                            <div class="input">
                                <label for="email">Telefonszám:</label>
                                <input type="mobile" id="a-phone" />
                            </div>
                            <div class="input">
                                <label for="email">Megjegyzés:</label>
                                <input type="text" id="a-desc" />
                            </div>

                            <div class="input coupon-code">
                                <label>Kuponkód:</label>
                                <input type="text" placeholder="kód" id="a-coupon-code" />
                            </div>
                            <div class="adminSchedule-btn" onclick="adminSetSchedule()">
                                <p>Foglalás</p>
                            </div>
                            <div class="close-btn" onclick="closeAdminBookingPanel()">
                                <p>Bezárás</p>
                            </div>
                        </div>
                        <div class="schedule-info">
                            <p id="scheduled-info-text"></p>
                            <select name="" id="newGameType">
                                <option value="B2">B2</option>
                                <option value="B3">B3</option>
                                <option value="B4">B4</option>
                                <option value="B5">B5</option>
                                <option value="B6">B6</option>
                                <option value="B7">B7</option>
                                <option value="D1">D1</option>
                                <option value="D2">D2</option>
                            </select>
                            <div class="btn" onclick="editSchedule()">
                                <p>Átfoglalás</p>
                            </div>
                            <div class="btn" onclick="deleteSchedule()">
                                <p>Törlés</p>
                            </div>
                        </div>`);

    generateDaysOpened()
    getScheduleRendered()
}
let logined = (data) => {
    $(".form-block").hide();

    if (Number(data.rang) == 3) {

        rendererAdmin()
    } else if(Number(data.rang) == 2){

        rendererEmployee()
    }

}

function generateDaysOpened() {

    console.log("RENDER")

    for (let i = 1; i <= days.length; i++) {
        let a = i
        let dayI = a == 7 ? 0 : a++;
        $("#day-block").append(`<div class="day">
                            <p>`+ days[i - 1] + `</p>
                            <div>
                                <p>Nyitás:</p>
                                <input type="time" step="3600000" max="24" id="open-`+ dayI + `" onblur="changeHandler(${dayI},'open')" >
        </div>
                                <div>
                                    <p>Zárás:</p>
                                    <input type="time" step="3600000" id="close-`+ dayI + `" onblur="changeHandler(${dayI},'close')" >
        </div>
                                    <div style="display:flex;align-items:center" >
                                        <p>Zárva van:</p>
                                        <input type="checkbox" id="checkbox-`+ dayI + `" onclick="changeClosed(${dayI})" >
        </div>
                                    </div>`);
    }
}

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

    let d = new Date();
    let newGHours = [];
    let newDates = []
    let type = $("#newVipGameType").val();
    let startTime = Number($("#start").val().substr(0, 2));
    let endTime = Number($("#end").val().substr(0, 2));
    let day = Number($("#vipDay").val());
    let diff = 0;
    let newDayDiff = 0;
    let newDatesArray = []

    if (startTime > endTime) {
        alert("Helytelen időpont")
    }
    else {
        diff = Number(endTime - startTime)
        for (let i = startTime; i <= endTime - 2; i += 2) {
            let time = i > 9 ? i + ":00" : "0" + i + ":00";
            newGHours.push(time)
        }
        if (day > d.getDay()) {
            newDayDiff = (d.getDate() + (day - d.getDay()));
        }
        else {
            newDayDiff = (d.getDate() - (d.getDay() - day));
        }
    }

    for (let i = 0; i <= 8; i++) {
        let newD = new Date()
        newD.setDate(newDayDiff)
        newDates.push(newD.setDate(newD.getDate() + i * 7))
    }

    let da = newDates[0]
    for (let i = 0; i < newDates.length; i++) {
        let d = new Date(newDates[i])
        let year = d.getFullYear();
        let month = (d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1)
        let day = d.getDate() < 9 ? "0" + d.getDate() : d.getDate();


        date = year + "-" + month + "-" + day
        newDatesArray.push(date)

    }




    let data = {
        dates: newDatesArray,
        times: newGHours,
        gameType: type,

    }

    $.ajax({
        type: "POST",
        url: apiUrl + "setVip.php",
        data: "data=" + JSON.stringify(data),
        dataType: "JSON",
        success: function (response) {
            alert("Sikeres VIP foglalás")
        },
        error: function (response) {
            alert("Sikertelen VIP foglalás")

        }
    });

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

function deleteVip() {

    let data = {
        day: Number($("#vipDay").val()),
        gameType: $("#newVipGameType").val(),
        startTime: Number($("#start").val().substr(0, 2)),
        endTime: Number($("#end").val().substr(0, 2))
    }
    $.ajax({
        type: "POST",
        url: apiUrl + "deleteVip.php",
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