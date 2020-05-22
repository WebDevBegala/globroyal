var releaseUrl = "https://globroyal.hu/globroyal/";
var developmentUrl = "http://192.168.64.4/globroyal/";

var apiUrl = developmentUrl;

var adminGameData;

function setAdminSchedule(index) {
    $(".settings-panel").css("display","flex");
    let data = freeDays[index];
    adminGameData = data

    $(".admin-forms").css("display", "block")
    $("#gametype").text(data.gameType)
    $("#date").text(date)

}
function adminSetSchedule() {

    let name = $("#a-name").val();
    let email = $("#a-email").val();
    let phone = $("#a-phone").val();
    let desc = $("#a-desc").val();
    let coupon = $("#a-coupon-code").val();
    let time = adminGameData.time < 10 ? "0" + adminGameData.time : adminGameData.time;
    let nextTime = adminGameData.time < 10 ? "0" + Number(adminGameData.time + 1) : Number(adminGameData.time + 1);
    let data = {
        name: name,
        email: email,
        phone: phone,
        coupon: coupon,
        desc:desc,
        gameType: adminGameData.gameType,
        date: date + " " + time + ":00",
        nextDate: date + " " + nextTime + ":00",
        userrank: 2
    }




    $.ajax({
        type: "POST",
        url: apiUrl + "setSchedule.php",
        data: "data=" + JSON.stringify(data),
        dataType: "JSON",
        success: function (response) {
            alert(response.bookingStatus)
            let d = new Date(date)
            let day = d.getDay()
            getFreePos(date)
            getOpenHoursWithParam(day)
            closeAdminVipBookingPanel()
        },
        error: function (res) {
            closeAdminVipBookingPanel()
        }
    });
}
function closeAdminBookingPanel() {
    $(".admin-forms").css("display", "none")
    closePanel()
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



function setVipSchedule(){
    let d = new Date(date)
    let year = d.getFullYear();
    let month = (d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1)
    let day = d.getDate() < 9 ? "0" + Number(d.getDate()) : Number(d.getDate())
    console.log(date)
   let dateString = year + "-" + month + "-" + day;

    let name = $("#name").val();
    let email = $("#email").val();
    let phone = $("#phone").val();
    let desc = $("#desc").val();
    let coupon = $("#coupon-code").val();
    let time = adminGameData.time < 10 ? "0" + adminGameData.time : adminGameData.time;
    let data = {
        name: name,
        email: email,
        phone: phone,
        coupon: coupon,
        gameType: adminGameData.gameType,
        date: dateString + " " + time + ":00",
        userrank: 3,
        desc: desc,
        edit:true
    }



    $.ajax({
        type: "POST",
        url: apiUrl + "setVip.php",
        data: "data=" + JSON.stringify(data),
        dataType: "JSON",
        success: function (response) {
            alert("Sikeres törlés")

            console.log(response)
            console.log(dateString)
            getFreePos(dateString)
            getOpenHoursWithParam(d.getDay())
            closeAdminVipBookingPanel()
        },
        error: function (res) {
            closeAdminVipBookingPanel()
        }
    });
}