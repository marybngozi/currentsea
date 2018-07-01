//Registering the Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
  .register('sw.js')
  .then(() => console.log("Service Worker Registered"));
}

const currencyUrl = "https://free.currencyconverterapi.com/api/v5/currencies";
let arradd = [];

fetch(currencyUrl)
.then(res => res.json())
.then(data => {
  for (const key in data) {
    return data[key];
  }
})
.then(datakey => {
  for ( const key2 in datakey) {
    const curName = datakey[key2].currencyName;
    const id = `${curName}-(${datakey[key2].id})`;
    arradd.push(id);
  }
  arradd.sort();
  arradd.map(idd => {
    $('#curOne, #curTwo').append($('<option>').text(`${idd}`).attr('value', idd));
  });
  console.log(num);
})
.catch(error => {
  console.log(error);
})

$("#convert").on("click", () => {
  const amt = $('#amtOne').val();
  let curOne = $('#curOne option:selected').val();
  let curTwo = $('#curTwo option:selected').val(); 
  curOne = curOne.slice(-4, -1);
  curTwo = curTwo.slice(-4, -1); 
  const query = `${curOne}_${curTwo}`;
  if (curOne <= 0 && curTwo <= 0) {
    
  }else{
    const url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=y`;
    fetch(url)
    .then(response => response.json())
    .then(parsedData => {
      console.log(parsedData);
      for(let rate in parsedData){
        let conversionVal = (parsedData[rate].val); 
        let totalAmt = (Number(amt) * conversionVal);
        $('#amtTwo').val(Math.round(totalAmt * 100) / 100);
        $('.outPut').empty();
        $('.outPut').append(`${amt} ${curOne} equals ${$('#amtTwo').val()} ${curTwo}`);
      }
    }) 
  }
     
});