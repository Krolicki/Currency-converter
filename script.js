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

function getRate(url, init){
    fetch(url)
    .then(resp => {
        return resp.json();
    })
    .then(resp => {
        calcDate.innerHTML = "Na dzień: " + resp.rates[0].effectiveDate;
        converted.innerHTML = (resp.rates[0].mid).toFixed(2) + " PLN";
        if(init)
            amountBot.value = (resp.rates[0].mid).toFixed(2);
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
    inputEvent("top", this.value)
})

amountBot.addEventListener("input", function(){
    inputEvent("bot", this.value)
})

function inputEvent(element, val){
    let opti = opt.value;
    let rever, target
    if(element == "top"){
        rever = false;
        target = amountBot;
    }
    else if(element == "bot"){
        rever = true;
        target = amount;
    }
    else{
        console.error("Wrong element in 'inputEvent'");
        return;
    }
    switch(opti){
        case 'EUR':
            calcRate(eurRate, target, val, rever);
            break;
        case 'USD':
            calcRate(usdRate, target, val, rever);
            break;
        case 'GBP':
            calcRate(gbpRate, target, val, rever);
            break;
    }
}

amount.addEventListener("change", function(){
    if(this.value == "")
        this.value = (0).toFixed(2);
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
            getRate(eurLink);
            calcRate(eurRate, amountBot, amo);
            break;
        case 'USD':
            // if(optBot.value == 'USD')
            //     optBot.value = 'PLN';
            info.innerHTML = "1 Dolar amerykański to w przeliczeniu";
            getRate(usdLink);
            calcRate(usdRate, amountBot, amo);
            break;
        case 'GBP':
            info.innerHTML = "1 Brytyjski funt szterling to w przeliczeniu";
            getRate(gbpLink);
            calcRate(gbpRate, amountBot, amo);
            break;
    }

})

getRate(eurLink, true);
assign();