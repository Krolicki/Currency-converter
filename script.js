const button7 = document.getElementById("button7");
const button14 = document.getElementById("button14");
const button30 = document.getElementById("button30");
const button182 = document.getElementById("button182");
const button365 = document.getElementById("button365");

var buttons = [button7, button14, button30, button182, button365];

function changeDate(){
    for(but of buttons){
        if (but.classList.contains("activeButton"))
            but.classList.remove("activeButton");
    }
}

buttons.forEach(function(but){
    but.addEventListener("click", () => {
        changeDate();
        but.classList.add("activeButton");
        daysChart = parseInt(but.id.slice(6));
        drawChart(opt.value, daysChart, optBot.value);
    })
});