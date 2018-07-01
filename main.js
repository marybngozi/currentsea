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
      for(let rate in parsedData){
        let conversionVal = (parsedData[rate].val); 
        let totalAmt = (Number(amt) * conversionVal);
        $('#amtTwo').val(Math.round(totalAmt * 100) / 100);
        $('.outPut').empty();
        $('.outPut').append(`${amt} ${curOne} equals ${$('#amtTwo').val()} ${curTwo}`);
        indexPart(query,conversionVal);
      }
      
    }) 
  }
});   


/********************* control section *****************************/
function indexPart(queryd,valuesd) {
  // This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
  let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

  // Open (or create) the database
  let open = indexedDB.open("currentsea", 2);

  // Create the schema
  open.onupgradeneeded = () => {
    let db = open.result;
    let store = db.createObjectStore("Currents", { keyPath: "id" });
    let index = store.createIndex("NameIndex", queryd);
  };

  open.onsuccess = () => {
    // Start a new transaction
    let db = open.result;
    let tx = db.transaction("Currents", "readwrite");
    let store = tx.objectStore("Currents");
    let index = store.index("NameIndex");

    // Add some data
    store.put({ id: queryd, valuedd: valuesd});

    /*   // Query the data
      var getJohn = store.get(12345);
      var getBob = index.get(["Smith", "Bob"]);
    
      getJohn.onsuccess = function () {
        console.log(getJohn.result.name.first);  // => "John"
      };
    
      getBob.onsuccess = function () {
        console.log(getBob.result.name.first);   // => "Bob"
      }; */

    // Close the db when the transaction is done
    tx.oncomplete = () => {
      db.close();
    };
  }
}
