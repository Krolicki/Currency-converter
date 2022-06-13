const converted = document.getElementById("converted");
const calcButton = document.getElementById("calc");
const opt = document.getElementById("opt");
const optBot = document.getElementById("optBot");
const amount = document.getElementById("amount");
const amountBot = document.getElementById("amountBot");
const calcDate = document.getElementById("calcDate");
const info = document.getElementById("info");
const testButton = document.getElementById("testButton");

const eurLink = "http://api.nbp.pl/api/exchangerates/rates/A/EUR/?format=json";
const usdLink = "http://api.nbp.pl/api/exchangerates/rates/A/USD/?format=json";
const gbpLink = "http://api.nbp.pl/api/exchangerates/rates/A/gbp/?format=json";

var eurRate;
var usdRate;
var gbpRate;

function getRate(url, element, am, reverse){
    fetch(url)
    .then(resp => {
        return resp.json();
    })
    .then(resp => {
        calcDate.innerHTML = "Na dzień: " + resp.rates[0].effectiveDate;
        if(element.nodeName == "P")
            element.innerHTML = (resp.rates[0].mid * am).toFixed(2) + " PLN";
        if(element.nodeName == "INPUT"){
            if(reverse)
                element.value = (am / resp.rates[0].mid).toFixed(2);
            else
                element.value = (resp.rates[0].mid * am).toFixed(2);
        }
    })
    .catch(err => {
        console.log(err);
    });
}

async function getCurr(url) {
    const response = await fetch(url);
    const data = await response.json();
    const ret = data.rates[0].mid;
    return ret;
  }
  
  async function assign(){
      usdRate = await getCurr(usdLink);
      eurRate = await getCurr(eurLink);
      gbpRate = await getCurr(gbpLink);

  }



 function calcRate(rate, element, amount, rev){
    if(element.nodeName == "INPUT"){
        if(rev)
            element.value = (amount / rate).toFixed(2);
        else
            element.value =  (amount * rate).toFixed(2);
  }
}

amount.addEventListener("input", function(){
    let opti = opt.value;
    switch(opti){
        case 'EUR':
            calcRate(eurRate, amountBot, this.value);
            break;
        case 'USD':
            calcRate(usdRate, amountBot, this.value);
            break;
        case 'GBP':
            calcRate(gbpRate, amountBot, this.value);
            break;
    }
})

amount.addEventListener("change", function(){
    if(this.value == "")
        this.value = (0).toFixed(2);
})

amountBot.addEventListener("input", function(){
    let opti = opt.value;
    switch(opti){
        case 'EUR':
            calcRate(eurRate, amount, this.value, true);
            break;
        case 'USD':
            calcRate(usdRate, amount, this.value, true);
            break;
        case 'GBP':
            calcRate(gbpRate, amount, this.value, true);
            break;
    }
})

amountBot.addEventListener("change", function(){
    if(this.value == "")
        this.value = (0).toFixed(2);
})

opt.addEventListener("change", function(){
    let opti = opt.value;
    let amo = amount.value;
    switch(opti){
        case 'EUR':
            // if(optBot.value == 'EUR')
            //     optBot.value = 'PLN';
            info.innerHTML = "1 Euro to w przeliczeniu";
            getRate(eurLink, converted, 1);
            calcRate(eurRate, amountBot, amo);
            break;
        case 'USD':
            // if(optBot.value == 'USD')
            //     optBot.value = 'PLN';
            info.innerHTML = "1 Dolar amerykański to w przeliczeniu";
            getRate(usdLink, converted, 1);
            calcRate(usdRate, amountBot, amo);
            break;
        case 'GBP':
            info.innerHTML = "1 Brytyjski funt szterling to w przeliczeniu";
            getRate(gbpLink, converted, 1);
            calcRate(gbpRate, amountBot, amo);
            break;
    }

})

getRate(eurLink, converted, 1, false);
getRate(eurLink, amountBot, 1, false);
assign();