async function drawChart(currency){
    let today = new Date();
    let pastDate = new Date();
    pastDate.setDate(today.getDate() - 7);
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
                    }
                ]},
                options: {
                    scales: {
                    xAxes: [{
                            ticks: {
                                fontSize: 9
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