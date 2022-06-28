const button7 = document.getElementById("button7");
const button14 = document.getElementById("button14");
const button30 = document.getElementById("button30");
const button365 = document.getElementById("button365");
const button1825 = document.getElementById("button1825");

var buttons = [button7, button14, button30, button365, button1825];

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
        drawChart(opt.value, daysChart);
    })
});