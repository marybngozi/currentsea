fetch("https://free.currencyconverterapi.com/api/v5/currencies")
.then((response) => {
  return response.json();
})
.then(data => {
  let datas = data.results;
    console.log(datas);
})
