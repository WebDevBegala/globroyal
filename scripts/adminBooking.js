var releaseUrl = "https://globroyal.hu/globroyal/";
var developmentUrl = "http://192.168.64.4/globroyal/";

var apiUrl = developmentUrl;

var adminGameData;

function setAdminSchedule(index) {
    let data = freeDays[index];
    adminGameData = data
    let d = new Date()
    let year = d.getFullYear();
    let month = (d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1)
    let dayI = gDay;
    let day = dayI < 9 ? "0" + Number(dayI+1) : Number(dayI+1)

    date = year + "-" + month + "-" + day;
    $(".admin-forms").css("display", "block")
    $("#gametype").text(data.gameType)
    $("#date").text(date)

}
function adminSetSchedule() {
    let d = new Date()
    let year = d.getFullYear();
    let month = (d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1)
    let dayI = gDay;
    let day = dayI < 9 ? "0" + Number(dayI+1) : Number(dayI+1)

    date = year + "-" + month + "-" + day;

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
        gameType: adminGameData.gameType,
        date: date + " " + time + ":00",
        nextDate: date + " " + nextTime + ":00",
        userrank: 2
    }

    console.log("Foglalás:", data)


    $.ajax({
        type: "POST",
        url: apiUrl + "setSchedule.php",
        data: "data=" + JSON.stringify(data),
        dataType: "JSON",
        success: function (response) {
            alert(response.bookingStatus)
            let d = new Date()
            let year = d.getFullYear();
            let month = (d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1)
            let dayI = gDay;
            let day = dayI < 9 ? "0" + dayI : dayI;

            date = year + "-" + month + "-" + day
            console.log(date)
            getFreePos(date)
            getOpenHours(date)
        },
        error: function (res) {
            console.log('Error:', res.responseText)
        }
    });
}
function closeAdminBookingPanel() {
    $(".admin-forms").css("display", "none")
}


function setVipSchedule(){
    let d = new Date()
    let year = d.getFullYear();
    let month = (d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1)
    let dayI = gDay;
    let day = dayI < 9 ? "0" + Number(dayI+1) : Number(dayI+1)

    date = year + "-" + month + "-" + day;

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
        date: date + " " + time + ":00",
        userrank: 3,
        desc: desc,
        edit:true
    }

    console.log("Foglalás:", data)


    $.ajax({
        type: "POST",
        url: apiUrl + "setVip.php",
        data: "data=" + JSON.stringify(data),
        dataType: "JSON",
        success: function (response) {
            alert(response.bookingStatus)
            let d = new Date()
            let year = d.getFullYear();
            let month = (d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1)
            let dayI = gDay;
            let day = dayI < 9 ? "0" + dayI : dayI;

            date = year + "-" + month + "-" + day
            console.log(date)
            getFreePos(date)
            getOpenHours(date)
        },
        error: function (res) {
            console.log('Error:', res.responseText)
        }
    });
}