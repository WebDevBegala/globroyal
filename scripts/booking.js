

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
        let coupon = $("#coupon-code").val();
        let time = gameData.time < 10 ? "0" + gameData.time : gameData.time;

        let data = {
            name: name,
            email: email,
            phone: phone,
            coupon: coupon,
            gameType: gameData.type,
            date: date + " " + time + ":00",
            userrank: 1
        }



        $.ajax({
            type: "POST",
            url: "https://globroyal.hu/globroyal/setSchedule.php",
            data: "data=" + JSON.stringify(data),
            dataType: "JSON",
            success: function (response) {
                alert(response.bookingStatus)
                let d = new Date()
                let year = d.getFullYear();
                let month = d.getMonth() < 9 ? "0" + d.getMonth() : d.getMonth()
                let day = gDay < 9 ? "0" + gDay : gDay;
                let date = `${year}-${month}-${day}`;
                getFreePos(date)
                getOpenHours()
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
