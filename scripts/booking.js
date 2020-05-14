var releaseUrl = "https://globroyal.hu/globroyal/";
var developmentUrl = "http://192.168.64.4/globroyal/";

var apiUrl = releaseUrl;

let gameData;

function couponCode() {
    let checked = document.querySelector(".input-checkbox").checked
    console.log(checked)
    $(".coupon-code").toggle()
}

$(".input-checkbox").click(function () {
    $(".coupon-code").toggle(this.checked)
})

$(".btn-send").click(function () {
    if (gameData) {
        let name = $("#name").val();
        let email = $("#email").val();
        let phone = $("#phone").val();
        let desc = $("#desc").val();
        let coupon = $("#coupon-code").val();
        let time = gameData.time < 10 ? "0" + gameData.time : gameData.time;
        let nextTime = gameData.time < 10 ? "0" + Number(gameData.time+1) : Number(gameData.time+1);
        let data = {
            name: name,
            email: email,
            phone: phone,
            coupon: coupon,
            gameType: gameData.type,
            date: date + " " + time + ":00",
            nextDate: date + " " + nextTime + ":00",
            desc:desc,
            userrank: 1
        }

        console.log("Foglalás:",data)


        $.ajax({
            type: "POST",
            url: apiUrl+"setSchedule.php",
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
    else {
        alert("Válaszd ki hogy hova szeretnél foglalni!")
    }

})

function getBookingData(game, time) {
    gameData = {
        type: game,
        time: time
    }
    selectedGame()
}

function selectedGame() {
    $(".gameinfo").html("")
    $(".gameinfo").html(`${gameData.type} ${date} ${gameData.time}:00`)
}

