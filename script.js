const EURp = document.getElementById("EUR");
const USDp = document.getElementById("USD");
const eurLink = "http://api.nbp.pl/api/exchangerates/rates/A/EUR/?format=json";
const usdLink = "http://api.nbp.pl/api/exchangerates/rates/A/USD/?format=json";


function getRate(url, element){
    let data = fetch(url)
    .then(resp => {
        return resp.json();
    })
    .then(resp => {
        //EURp.innerHTML += resp.rates[0].mid;
        return resp.rates[0].mid;
    })
    .catch(err => {
        console.log(err);
    });

    let loadEur = async () => {
        element.innerHTML += await data; 
    }
    loadEur();

}

getRate(eurLink, EURp);
getRate(usdLink, USDp);