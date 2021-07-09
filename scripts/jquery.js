function renderDays() {
    $(".date_selector").html("");
    let d = new Date();
    for (let i = 0; i < 14 + 1; i++) {
        let cD = d.addDays(i);
        let monthString =
            cD.getMonth() < 9 ?
            "0" + Number(cD.getMonth() + 1) :
            Number(cD.getMonth() + 1);
        let dateString = cD.getDate() < 9 ? "0" + cD.getDate() : cD.getDate();
        $(".date_selector").append(`
            <div class="select_item" onclick="getOpenHours('${cD.getFullYear()}.${monthString}.${dateString}')" >
                ${monthString}.${dateString}
            </div>
        `);
    }
}

function renderGameTypes() {
    const gameTypes = ["B2", "B3", "B4", "B5", "B6", "B7", "D1", "D2"];
    gameTypes.forEach((gametype) => {
        $(".gametype_selector").append(`
            <div class="select_item" onclick="gameTypeSelected('${gametype}')" >
                ${gametype}
            </div>
        `);
    });
}

function renderTime(freeTable) {
    $('#time_selector_default').remove();
    $(".time_selector").html("");
    freeTable.forEach((time) => {
        $(".time_selector").append(`
            <div class="select_item" onclick="setSelectedTime('${time}:00')" >
                ${time}:00
            </div>
        `);
    });
    $(".time_selector > .select_item").click(function(e) {
        $(".time_selector > .select_item").css("background-color", "white");
        $(e.currentTarget).css("background-color", "yellow");
    });
}