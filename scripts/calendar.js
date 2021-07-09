var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.createTemplateTagFirstArg = function(a) { return a.raw = a };
$jscomp.createTemplateTagFirstArgWithRaw = function(a, b) { a.raw = b; return a };

function renderDays() {
    $(".date_selector").html("");
    for (var a = new Date, b = 0; 15 > b; b++) {
        var c = a.addDays(b),
            d = 9 > c.getMonth() ? "0" + Number(c.getMonth() + 1) : Number(c.getMonth() + 1),
            e = 9 > c.getDate() ? "0" + c.getDate() : c.getDate();
        $(".date_selector").append('\n            <div class="select_item" onclick="getOpenHours(\'' + c.getFullYear() + "." + d + "." + e + "')\" >\n                " + d + "." + e + "\n            </div>\n        ")
    }
}

function renderGameTypes() { "B2 B3 B4 B5 B6 B7 D1 D2".split(" ").forEach(function(a) { $(".gametype_selector").append('\n            <div class="select_item" onclick="gameTypeSelected(\'' + a + "')\" >\n                " + a + "\n            </div>\n        ") }) }

function renderTime(a) {
    $("#time_selector_default").remove();
    $(".time_selector").html("");
    a.forEach(function(b) { $(".time_selector").append('\n            <div class="select_item" onclick="setSelectedTime(\'' + b + ":00')\" >\n                " + b + ":00\n            </div>\n        ") });
    $(".time_selector > .select_item").click(function(b) {
        $(".time_selector > .select_item").css("background-color", "white");
        $(b.currentTarget).css("background-color", "yellow")
    })
};