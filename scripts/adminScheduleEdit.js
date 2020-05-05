function editSchedule(){
    let data = freeDays[index];

    data = {
        oldGameType: data['gameType'],
        gameType:$("#newGameType").val(),
        email:data.email,
        date: date+" "+data.time+":00:00"
    }
    $.ajax({
        type: "POST",
        url: apiUrl+"refreshSchedule.php",
        data: "data=" + JSON.stringify(data),
        dataType: "JSON",
        success: function (res) {
            //console.log(res)
            alert(res.bookingStatus)
            let d = new Date();
            selectDay(d.getDate() - 1)
        },
        error: function (response) {
            alert(response.responseText)
        },

    });
}