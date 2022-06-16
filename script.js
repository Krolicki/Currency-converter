const converted = document.getElementById("converted");
const calcButton = document.getElementById("calc");
const opt = document.getElementById("opt");
const optBot = document.getElementById("optBot");
const amount = document.getElementById("amount");
const amountBot = document.getElementById("amountBot");
const calcDate = document.getElementById("calcDate");
const info = document.getElementById("info");
const testButton = document.getElementById("testButton");
const calcSection = document.getElementById("calcSection");

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
        if(init){
            amountBot.value = (resp.rates[0].mid).toFixed(2);
            info.innerHTML = "1 Euro to w przeliczeniu";
        }
    })
    .catch(err => {
        calcDate.innerHTML = "Błąd przy pobieraniu kursów. <br> Brak połączenia z serwerem.<br> Proszę odczekać chwilę i odświeżyć stronę.";
        calcSection.style.display = "none";
        console.log("Błąd przy pobieraniu kursów. Brak połączenia z serwerem");
    });
}

async function getCurr(url) {
    try{
        const response = await fetch(url);
        const data = await response.json();
        const ret = data.rates[0].mid;
        return ret;
    }
    catch{
        console.log("Błąd przy pobieraniu kursów. Brak połączenia z serwerem");
    }
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

function calcForeign(element){
    let botCurr, topCurr;
    function assignCurr(option){
        switch(option){
            case 'EUR':
                return eurRate;
            case 'USD':
                return usdRate;
            case 'GBP':
                return gbpRate;
            default:
                return 1;
        }
    }

    topCurr = assignCurr(opt.value);
    botCurr = assignCurr(optBot.value);

    if(element == "bot"){
        amount.value = ((botCurr / topCurr) * amountBot.value).toFixed(2);
    }
    else if(element == "top"){
        amountBot.value = ((topCurr / botCurr) * amount.value).toFixed(2);
    }

}

amount.addEventListener("input", function(){
    if(opt.value == 'PLN'){
        inputEvent("top", this.value)
    }
    else{
        calcForeign("top");
    }
})

amountBot.addEventListener("input", function(){
    if(optBot.value == 'PLN')
        inputEvent("bot", this.value)
    else{
        calcForeign("bot");
    }
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
            calcForeign("top");
            //calcRate(eurRate, amountBot, amo);
            break;
        case 'USD':
            // if(optBot.value == 'USD')
            //     optBot.value = 'PLN';
            info.innerHTML = "1 Dolar amerykański to w przeliczeniu";
            getRate(usdLink);
            calcForeign("top");
            //calcRate(usdRate, amountBot, amo);
            break;
        case 'GBP':
            info.innerHTML = "1 Brytyjski funt szterling to w przeliczeniu";
            getRate(gbpLink);
            calcForeign("top");
            //calcRate(gbpRate, amountBot, amo);
            break;
    }
})

optBot.addEventListener("change", function(){
        calcForeign("bot");
})

getRate(eurLink, true);
assign();