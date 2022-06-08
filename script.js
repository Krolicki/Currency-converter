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

var test;

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

async function getRate2(url) {
    // var response = await fetch(url)
    // .then(resp => {
    //     return resp.json();
    // })
    // .then(resp => {
    //     return resp.rates[0].mid;
    // });
  
    // return response;
    const response = await fetch(url);
    const data = await response.json();
    const ret = data.rates[0].mid;
    return ret;
  }
  
  async function getRate3(url){
      test = await getRate2(url);
      //console.log(rate);
     // test = rate.rates[0].mid;
     // return rate.rates[0].mid;

  }

  function test2(){
    getRate3(usdLink);
  }
  //const data2 = getRate3(usdLink);
  getRate3(usdLink);
  
  test2();

testButton.addEventListener("click",function(){
    console.log(test);
})



amount.addEventListener("change", function(){
    let opti = opt.value;
    let amo = amount.value;
    switch(opti){
        case 'EUR':
            getRate(eurLink, amountBot, amo, false);
            break;
        case 'USD':
            getRate(usdLink, amountBot, amo, false);
            break;
    }
})

amountBot.addEventListener("change", function(){
    let opti = opt.value;
    let amo = amountBot.value;
    switch(opti){
        case 'EUR':
            getRate(eurLink, amount, amo, true);
            break;
        case 'USD':
            getRate(usdLink, amount, amo, true);
            break;
    }
})

opt.addEventListener("change", function(){
    let opti = opt.value;
    let amo = amount.value;
    switch(opti){
        case 'EUR':
            info.innerHTML = "1 Euro to w przeliczeniu";
            getRate(eurLink, converted, 1);
            getRate(eurLink, amountBot, amo, false);
            break;
        case 'USD':
            info.innerHTML = "1 Dolar amerykański to w przeliczeniu";
            getRate(usdLink, converted, 1);
            getRate(usdLink, amountBot, amo, false);
            break;
    }

})

getRate(eurLink, converted, 1);
