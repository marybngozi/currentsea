fetch("https://free.currencyconverterapi.com/api/v5/currencies")
.then((response) => {
  return response.json();
})
.then(data => {
  let datas = data.results;
    datas.forEach((dats) => {
      console.log(dats);
    });
})
