async function drawChart(currency){
    var today = new Date(currencyList[currency].date);
    var pastDate = new Date(today);
    let labels =[];
    let data =[];
    pastDate.setDate(today.getDate() - 6);
    pastDate = pastDate.toISOString().slice(0, 10);
    today = today.toISOString().slice(0, 10);

    fetch("http://api.nbp.pl/api/exchangerates/rates/A/"+currency+"/"+pastDate+"/"+today+"/")
        .then(resp => {
            return resp.json();
        })
        .then(resp => {
            for(dayRate of resp.rates){
                labels.push(dayRate.effectiveDate);
                data.push(dayRate.mid);
            }
            new Chart("myChart", {
                type: "line",
                data:{
                labels: labels,
                datasets: [{
                    label: currency,
                    data: data,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                    // fill: true,
                    // lineTension: 0.1,
                    // backgroundColor: "#f9f9f9",
                    // borderColor: "#72bce3",
                    // borderCapStyle: 'butt',
                    // borderDash: [],
                    // borderDashOffset: 0.0,
                    // borderJoinStyle: 'miter',
                    // pointBorderColor: "black",
                    // pointBackgroundColor: "#fff",
                    // pointBorderWidth: 1,
                    // pointHoverRadius: 5,
                    // pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    // pointHoverBorderColor: "rgba(220,220,220,1)",
                    // pointHoverBorderWidth: 2,
                    // pointRadius: 1,
                    // pointHitRadius: 10,
                    }
                ]},
                options: {
                    scales: {
                    xAxes: [{
                            ticks: {
                                fontSize: 9,
                                callback: function(tick, index, array) {
                                    return (index % 2) ? "" : tick;
                                }
                            }
                            }]
                            }
                        }
            });
        })
        .catch(err => {
            // calcDate.innerHTML = "Błąd przy pobieraniu kursów. <br> Brak połączenia z serwerem.<br> Proszę odczekać chwilę i odświeżyć stronę.";
            // calcSection.style.display = "none";
            // console.log("Błąd przy pobieraniu kursów. Brak połączenia z serwerem");
            console.log(err);
        });

}
