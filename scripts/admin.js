
let days = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
let openHours = [];
var changedHours = [];
defaultChangeHours()

$(document).ready(function () {
    $("#openhours").css("background-color","lightblue")
});


function login() {

    let data = {
        email: $("#email").val(),
        password: $("#password").val()
    }
    let resData;
    $.ajax({
        type: "POST",
        url: "https://globroyal.hu/globroyal/login.php",
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

    $.ajax({
        type: "POST",
        url: "http://192.168.64.4/globroyal/getOpenHours.php",
        data: "",
        dataType: "JSON",
        success: function (response) {

            refreshTimes(response)
        },
        error: function(err){
            console.log("Error: ",err)

        }
    });

    for (let i = 1; i <= days.length; i++) {
        let a = i
        let dayI = a == 7 ? 0 : a++;
        $("#day-block").append(`<div class="day">
        <p>`+ days[i - 1] + `</p>
        <div>
            <p>Nyitás:</p>
            <input type="time" step="3600000"  id="open-`+ dayI + `" onblur="changeHandler(${dayI},'open')" >
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

function changeClosed(day){
    changedHours[day].closed = !changedHours[day].closed;

}

function changeOpenHours() {
    let data = JSON.stringify(changedHours);
    console.log("Send:", data)
    $.ajax({
        type: "POST",
        url: "http://192.168.64.4/globroyal/changeHours.php",
        data: "data=" + data,
        dataType: "JSON",
        success: function (response) {
            if(response){
                alert("Sikeres változtatás");
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
            open: 0,
            close: 0,
            closed: false
        }
    }
}

function goToCalendar(){
$(".openhours-panel").css("display","none");
$(".schedule").css("display","block");
}

function goToOpenHours(){
    $(".openhours-panel").css("display","block");
    $(".schedule").css("display","none");
}

function showScheduled(items){
    console.log(items)
}

