const converted = document.getElementById("converted");
const calcButton = document.getElementById("calc");
const opt = document.getElementById("opt");
const amount = document.getElementById("amount");
const calcDate = document.getElementById("calcDate");
const eurLink = "http://api.nbp.pl/api/exchangerates/rates/A/EUR/?format=json";
const usdLink = "http://api.nbp.pl/api/exchangerates/rates/A/USD/?format=json";


function getRate(url, element, am){
    fetch(url)
    .then(resp => {
        return resp.json();
    })
    .then(resp => {
        calcDate.innerHTML = "Na dzień: " + resp.rates[0].effectiveDate;
        element.innerHTML = (resp.rates[0].mid * am).toFixed(2) + " PLN";
        //return resp.rates[0].mid;
    })
    .catch(err => {
        console.log(err);
    });

    // let loadEur = async () => {
    //     element.innerHTML = (await data * am).toFixed(2) + " PLN"; 
        
    // }
    // loadEur();

}

calcButton.addEventListener("click", function(){
    let opti = opt.value;
    let amo = amount.value;
    switch(opti){
        case 'EUR':
            getRate(eurLink, converted, amo);
            break;
        case 'USD':
            getRate(usdLink, converted, amo);
            break;
    }
    

})