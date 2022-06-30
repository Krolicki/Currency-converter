var theChart = null;

async function drawChart(currency, daysToShow, compareCurrency){
    const canvas = document.getElementById("chart");
    var today = new Date(currencyList[currency].date);
    var pastDate = new Date(today);
    let labels =[];
    let data =[];

    let currencyMain;
    var days = daysToShow;

    pastDate.setDate(today.getDate() - days);
    pastDate = pastDate.toISOString().slice(0, 10);
    today = today.toISOString().slice(0, 10);

    if(currency == "PLN"){
        currencyMain = compareCurrency;
    }
    else{
        currencyMain = currency;
    }

    await fetch("http://api.nbp.pl/api/exchangerates/rates/A/"+currencyMain+"/"+pastDate+"/"+today+"/")
        .then(resp => {
            return resp.json();
        })
        .then(resp => {
            for(dayRate of resp.rates){
                labels.push(dayRate.effectiveDate);
                data.push(dayRate.mid);
            }
        })
        .catch(err => {
            console.log("Błąd przy generowaniu wykresu. Brak połączenia z serwerem");
            console.log(err);
        });

    if(compareCurrency != "PLN" && currency != "PLN"){
        await fetch("http://api.nbp.pl/api/exchangerates/rates/A/"+compareCurrency+"/"+pastDate+"/"+today+"/")
        .then(response => { return response.json(); })
        .then(response => {
            let compareData;
            for(i = 0; i < response.rates.length; i++){
                compareData = response.rates[i].mid;
                data[i] = (data[i] / compareData).toFixed(4);
            }
        })
        .catch(err =>{
            console.log(err);
        });
    }
    if(currency == "PLN"){
        for(i = 0; i < data.length; i++){
            data[i] = (1 / data[i]).toFixed(4);
        }
    }

    var gradient = canvas.getContext('2d').createLinearGradient(0, 0, 0, 170);
    var color;
    if(data.at(-1) > (data[0] + 0.01)){
        gradient.addColorStop(0, 'rgba(52,168,83,0.4)'); //green
        color = "rgba(52,168,83,1)";
    }
    else if((data.at(-1) + 0.01) < data[0]){
        gradient.addColorStop(0, 'rgba(234,67,53,0.4)'); //red
        color = 'rgba(234,67,53,1)';
    }
    else{
        gradient.addColorStop(0, 'rgba(112,117,122,0.4)'); //grey
        color = "rgba(112,117,122,1)";
    }
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    if(theChart != null){
        theChart.destroy();
    }

    theChart = new Chart(canvas, {
        type: "line",
        data:{
        labels: labels,
        datasets: [{
            label: currency,
            data: data,
            // fill: false,
            // borderColor: 'rgb(75, 192, 192)',
            // tension: 0.1
            fill: true,
            lineTension: 0.1,
            backgroundColor: gradient,
            borderColor: color,
            borderCapStyle: 'butt',
            borderDash: [],
            borderWidth: 2,
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: color,
            pointBackgroundColor: color,
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: color,
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 1,
            pointRadius: 0,
            pointHitRadius: 5,
            }
        ]},
        options: {
            scales: {
                xAxes: [{
                        ticks: {
                            fontSize: 10,
                            maxRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: 3,
                            // autoSkip:false,
                            // callback: function(tick, index, array) {
                            //     if(index == Math.floor(days / 2 - 1) || (index == Math.floor(days /3 - 1 )))
                            //         return tick;
                            //     else
                            //         return "";
                                
                            //     //return ((index != Math.floor(days /2)) || (index != Math.floor(days /3))) ? "" : tick;
                            // }
                        },
                        gridLines: {
                            display: false
                        } 
                        }],
                yAxes: [{
                    ticks: {
                        fontSize: 10,
                        autoSkip: true,
                        maxTicksLimit: 3,
                        // callback: function(tick, index, array) {
                        //     return (index % 2) ? "" : tick;
                        // }
                    },  
                }]
            },
            legend: {
                display: false
            }
        }
                
    });

}


