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
const conv = document.querySelector(".conv");

//const codesList = ["USD",  "EUR", "GBP", "CHF", "RUB"]

var prev;
var dateGet;

var currencyList = {};

function initialize(){
    fetch("http://api.nbp.pl/api/exchangerates/rates/A/EUR/")
    .then(resp => {
        return resp.json();
    })
    .then(resp => {
        calcDate.innerHTML = "Na dzień: " + resp.rates[0].effectiveDate + " (NBP)";
        converted.innerHTML = (resp.rates[0].mid).toFixed(2) + " Złoty";
        amountBot.value = (resp.rates[0].mid).toFixed(2);
        info.innerHTML = "1 Euro to w przeliczeniu";
    })
    .catch(err => {
        calcDate.innerHTML = "Błąd przy pobieraniu kursów. <br> Brak połączenia z serwerem.<br> Proszę odczekać chwilę i odświeżyć stronę.";
        calcSection.style.display = "none";
        console.log("Błąd przy pobieraniu kursów. Brak połączenia z serwerem");
        console.log(err);
    });
}

async function getCurr(code){
    try{
        const response = await fetch("http://api.nbp.pl/api/exchangerates/rates/A/"+code);
        const data = await response.json();
        const currencyRate = data.rates[0].mid;
        let currencyName = data.currency;
        currencyName = currencyName.charAt(0).toUpperCase() + currencyName.slice(1);
        code = code.toUpperCase();
        currencyList[code] = { name : currencyName, rate : currencyRate};
        dateGet = data.rates[0].effectiveDate;
    }
    catch(err){
        console.log("Błąd przy pobieraniu kursów. Brak połączenia z serwerem");
        console.log(err);
    }
}
  
  async function assign(){

    const codesList = await fetch('./codes.json')
    .then(response => {
         return response.json();
    })
    .catch( () => {
        console.log("Błąd przy odczycie pliku");
        let el = document.createElement('p');
        el.innerHTML = "Błąd przy pobieraniu listy walut"
        conv.appendChild(el);
        amount.disabled = true;
        amountBot.disabled = true;
    });

    for(i = 0; i < codesList.code.length; i++){
        await getCurr(codesList.code[i]);
    }

    currencyList["PLN"] = { name : "Złoty", rate : 1};

    Object.entries(currencyList).forEach(([key, value]) => {
        let el = document.createElement('option');
        el.value = key;
        el.innerHTML = value.name;

        let el2 = document.createElement('option');
        el2.value = key;
        el2.innerHTML = value.name;

        if(key != "EUR")
            opt.append(el);
        if(key != "PLN")
            optBot.append(el2);
    });

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

initialize();
assign();