let days = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
let openHours = [];
var changedHours = [];
var newGHours = [];
window.Buffer = window.Buffer;

var releaseUrl = "https://globroyal.hu/globroyal/";
var developmentUrl = "http://192.168.64.4/globroyal/";

var apiUrl = developmentUrl;


defaultChangeHours()
setTimeout(() => {
    sessionStorage.adminData = ""
    location.reload();

}, 7200 * 1000);
$(document).ready(function() {
    $("#openhours").css("background-color", "lightblue")
    if (typeof(Storage) !== "undefined") {
        if (sessionStorage.adminData) {
            let data = sessionStorage.adminData;
            data = JSON.parse(data);
            logined(data)

        } else {

        }

    } else {
        console.log("Sorry, your browser does not support web storage...");
    }
});

$(".btn-login").click(function(e) {
    login()
});

function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }

function change(s) {
    s = [...s].reverse().join("");
    let ns = "";
    for (let i = 0; i < s.length; i++) {
        let a = s[i];
        if (isNumber(a)) {
            let f = s[Number(a)];
            ns = s.replace(a, f)
        }
        if (i % 2 == 0 && !isNumber(s[i])) {
            ns = ns.replace(s[i], s[i].toUpperCase())
        }


    }
    let sd = "a#34mrQf?Da";
    for (let i = 0; i < sd.length; i++) {
        ns = ns.splice(i++, 0, sd[i]);
    }

    return ns;
}

function login() {


    let password = $("#password").val()
    password = change(password)
    password = CryptoJS.SHA3(password, { outputLength: 256 });

    let data = {
        email: $("#email").val(),
        password: password.toString()
    }

    data = btoa(JSON.stringify(data));

    $.ajax({
        type: "POST",
        url: apiUrl + "login.php",
        data: "data=" + data,
        dataType: "JSON",
        success: function(res) {
            if (typeof(Storage) !== "undefined") {

                let data = {
                    rang: res.rang,
                    id: res.id
                }
                sessionStorage.adminData = JSON.stringify(data)

            } else {
                console.log("Sorry, your browser does not support web storage...");
            }
            logined(res)
        },
        error: function(response) {
            alert("Sikertelen belépés")
        },

    });
}

function changeDate() {

    let newDate = $("#newdate").val();
    date = newDate
    newDate = new Date(newDate)
    console.log(newDate.getDay())
    selectDayOther(newDate)
    $("#currentDate").text(date);

}

function rendererEmployee() {
    $(".root").prepend(` <div class="settings-panel"><div class="vip-settings">
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
                        </div> </div> `);
    $('.admin-panel').append(`<div class="menu">
    <input type="date" id="newdate" onchange="changeDate()" />
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
String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

function rendererAdmin() {
    getDaysOpened()
    $('.admin-panel').append(`
    <div class= "menu" >
        <div class="menu-items">
        <input type="date" id="newdate" onchange="changeDate()" />
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
        <div class="date-changer" >
            <i class="fas fa-arrow-left datearrow" style="margin-right:1vw" onclick="changeCurrentDate(-1)"></i>
            <p id="currentDate" >2020-05-22</p>
            <i class="fas fa-arrow-right datearrow" style="margin-left:1vw" onclick="changeCurrentDate(1)"></i>
            <i class="fas fa-home" style="margin-left:5vw;cursor:pointer" onclick="gohome()" ></i>
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
    $(".root").append(`<div class="settings-panel"> <div class="vip-settings">
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
                        </div></div>`);

    generateDaysOpened()
    getScheduleRendered()
}
let logined = (data) => {
    $(".form-block").hide();

    if (Number(data.rang) == 3 && Number(data.id) == 19) {

        rendererAdmin()
    } else if (Number(data.rang) == 2 && Number(data.id) == 20) {

        rendererEmployee()
    }

}

function generateDaysOpened() {

    console.log("RENDER")

    for (let i = 1; i <= days.length; i++) {
        let a = i
        let dayI = a == 7 ? 0 : a++;
        $("#day-block").append(`<div class="day">
                            <p>` + days[i - 1] + `</p>
                            <div>
                                <p>Nyitás:</p>
                                <input type="time" step="3600000" max="24" id="open-` + dayI + `" onblur="changeHandler(${dayI},'open')" >
        </div>
                                <div>
                                    <p>Zárás:</p>
                                    <input type="time" step="3600000" id="close-` + dayI + `" onblur="changeHandler(${dayI},'close')" >
        </div>
                                    <div style="display:flex;align-items:center" >
                                        <p>Zárva van:</p>
                                        <input type="checkbox" id="checkbox-` + dayI + `" onclick="changeClosed(${dayI})" >
        </div>
                                    </div>`);
    }
}

$(".item").click(function() {
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
    } else {
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
        success: function(response) {
            if (response) {
                alert("Sikeres változtatás");
                getDaysOpened()
            }
            // console.log("Response: ",response)
        },
        error: function(err) {


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
        success: function(response) {
            refreshTimes(response)
        },
        error: function(err) {
            console.log("Error: ", err)

        }
    });
}



function vipInfo(i) {
    let data = freeDays[i];
    adminGameData = freeDays[i]
    $(".settings-panel").css("display", "flex");
    $(".vip-settings").css("display", "block")
    $("#vip-gametype").text(data.gameType)
    let time = data.time > 9 ? data.time + ":00" : "0" + data.time + ":00"
    let d = new Date(date)

    let year = d.getFullYear();
    let month = (d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1)
    let day = d.getDate() < 9 ? "0" + Number(d.getDate()) : Number(d.getDate())
    let dateString
    dateString = year + "-" + month + "-" + day;

    $("#vip-date").text(dateString + " " + time)
    $("#vip-name").text("Név: " + data.name)
    $("#vip-email").text("Email: " + data.email || "nincs")
    $("#vip-phone").text("Telefon: " + data.phone || "nincs")
    $("#vip-coupon").text("Kupon: " + data.coupon || "nincs")
    $("#vip-desc").text("Megjegyzés: " + data.desc || "nincs")
}

function closeAdminVipBookingPanel() {
    $(".vip-settings").css("display", "none")
    closePanel()
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
        success: function(res) {
            alert("Sikeres törlés")
            closeAdminVipBookingPanel()
        },
        error: function(response) {
            alert("Sikertelen törlés")
            closeAdminVipBookingPanel()
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
        success: function(res) {
            alert("Sikeres törlés")
        },
        error: function(response) {
            alert("Sikertelen törlés")
        },

    });
}

function closePanel() {
    $(".settings-panel").hide();
}