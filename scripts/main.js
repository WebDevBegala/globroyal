$(function() {
    setTimeout(() => {
        $(".loading_scene").css("display", "none");
        $(".title").css("opacity", "1");

        renderDays();
        renderGameTypes();
        $(".date_selector > .select_item").click(function(e) {
            e.preventDefault();
            $(".date_selector > .select_item").css("background-color", "white");
            $(e.currentTarget).css("background-color", "yellow");
        });
        $(".gametype_selector > .select_item").click(function(e) {
            e.preventDefault();
            $(".gametype_selector > .select_item").css("background-color", "white");
            $(e.currentTarget).css("background-color", "yellow");
        });
    });
});
const apiUrl = "http://localhost:8888/globroyal/";
const prodApiurl = "https://globroyal.hu/globroyal/"
let openHours = {
    open: 0,
    close: 0,
};
let selectedDate = "";
let selectedTime = "";
let selectedGameType = "";

function setOpenHours(setOpen, setClose) {
    openHours = {
        open: setOpen,
        close: setClose,
    };

    if (selectedGameType) {
        gameTypeSelected(selectedGameType)
    }
}

function getOpenHours(date) {
    let d = new Date(date);
    selectedDate = date;
    let day = d.getDay();
    $.ajax({
        type: "POST",
        url: prodApiurl + "getOpenHours.php",
        data: { day },
        crossDomain: true,
        dataType: "json",
        success: function(res) {
            let start = Number(res.opening);
            let end = Number(res.closing) === 0 ? 24 : Number(res.closing);
            setOpenHours(start, end);
        },
    });
}

function gameTypeSelected(gameType) {
    if (selectedDate) {
        const date = selectedDate;
        selectedGameType = gameType;
        $.ajax({
            type: "post",
            url: prodApiurl + "getReservations.php",
            data: "data=" + JSON.stringify({ date }),
            dataType: "json",
            success: function(response) {
                renderFreeTable(response, gameType);
            },
        });
    }
}

function renderFreeTable(reservedTables, gameType) {
    const gameTypeTable = gameType[0];
    let allTables = [];
    const diff = gameTypeTable === "B" ? 2 : 1;
    for (let index = openHours.open; index < openHours.close; index += diff) {
        allTables.push(index);
    }
    let filteredTables = reservedTables.filter(
        (table) => table.gameType === gameType
    );

    filteredTables = allTables.filter(
        (time) => !filteredTables.find((table) => Number(table.time) === time)
    );
    renderTime(filteredTables);
}

function setSelectedTime(selectedTimeVal) {
    selectedTime = selectedTimeVal;
}

function submitForm() {
    const data = {
        name: $("#name").val(),
        email: $("#email").val(),
        phone: $("#phone").val(),
        desc: $("#description").val(),
        coupon: $("#coupon").val(),
        date: `${selectedDate} ${selectedTime}`,
        gameType: selectedGameType,
        userrank: 1
    };

    $.ajax({
        type: "POST",
        url: prodApiurl + "setSchedule.php",
        data: "data=" + JSON.stringify(data),
        dataType: "JSON",
        success: function(response) {
            console.log('RUNNED');
            alert('Sikeres foglalás')
            window.location.reload()
        },
        error: function(res) {
            alert('Sikertelen foglalás')
        }
    });
}

function accepted() {
    $('body').css('overflow-y', 'scroll');
    $('.footer').css('display', 'none');
    $('.footer-blocking').css('display', 'none');
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};