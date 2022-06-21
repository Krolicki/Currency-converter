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

// var eurRate;
// var usdRate;
// var gbpRate;

var prev;
var dateGet;

var currencyList = {};

function getRate(url, init){
    fetch(url)
    .then(resp => {
        return resp.json();
    })
    .then(resp => {
        calcDate.innerHTML = "Na dzień: " + resp.rates[0].effectiveDate + " (NBP)";
        converted.innerHTML = (resp.rates[0].mid).toFixed(2) + " Złoty";
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
        dateGet = data.rates[0].effectiveDate;
        return ret;
    }
    catch{
        console.log("Błąd przy pobieraniu kursów. Brak połączenia z serwerem");
    }
  }
  
  async function assign(){

    currencyList = {
        EUR : { name : 'Euro', rate : await getCurr(eurLink) },
        USD : { name : 'Dolar amerykański', rate : await getCurr(usdLink) },
        GBP : { name : 'Brytyjski funt szterling', rate : await getCurr(gbpLink) },
        PLN : { name : 'Złoty', rate : 1 },
    };
    //   usdRate = await getCurr(usdLink);
    //   eurRate = await getCurr(eurLink);
    //   gbpRate = await getCurr(gbpLink);
  }

 function calcRate(rate, element, amount, rev){
    if(element.nodeName == "INPUT"){
        if(rev)
            element.value = (amount / rate).toFixed(2);
        else
            element.value =  (amount * rate).toFixed(2);
  }
}

// function assignCurr(option){
//     switch(option){
//         case 'EUR':
//             return eurRate;
//         case 'USD':
//             return usdRate;
//         case 'GBP':
//             return gbpRate;
//         default:
//             return 1;
//     }
// }

// function assignCurrStr(option){
//     switch(option){
//         case 'EUR':
//             return  "Euro";
//         case 'USD':
//             return "Dolar amerykański";
//         case 'GBP':
//             return "Brytyjski funt szterling";
//         default:
//             return "Złoty";
//     }
// }

function calcForeign(element){
    let botCurr, topCurr;
    // topCurr = assignCurr(opt.value);
    // botCurr = assignCurr(optBot.value);

    topCurr = currencyList[opt.value].rate;
    botCurr = currencyList[optBot.value].rate;

    if(element == "bot"){
        amount.value = ((botCurr / topCurr) * amountBot.value).toFixed(2);
    }
    else if(element == "top"){
        amountBot.value = ((topCurr / botCurr) * amount.value).toFixed(2);
    }

}

function changeCurrency(){
    calcDate.innerHTML = "Na dzień: " + dateGet + " (NBP)";
    info.innerHTML = amount.value + " " + currencyList[opt.value].name + " to w przeliczeniu";
    converted.innerHTML = amountBot.value + " " + currencyList[optBot.value].name;

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
    if(opti != "PLN")
        calcRate(currencyList[opt.value].rate, target, val, rever);
    else
        calcForeign(element);
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

    if(optBot.value == this.value)
        optBot.value = prev;  

    calcForeign("top");

    changeCurrency();
})

optBot.addEventListener("change", function(){
    if(opt.value == this.value)
        opt.value = prev;

    calcForeign("top");

    changeCurrency();
})

opt.addEventListener("focus", function(){
    prev = this.value;
    this.blur();
})

optBot.addEventListener("focus", function(){
    prev = this.value;
    this.blur();
})

getRate(eurLink, true);
assign();