
(function () {
   PopulateDropDown();
   document.getElementById('SearchBtn').addEventListener('click', GetData, false);
  })();

 
let chartConatiner = document.getElementById('chartContainer');
let accessDiv = document.getElementById('mainContainer'); 
const container = document.createElement('div');
container.setAttribute('class', 'container');


const removeChilds = (parent) => { // removes all children , so new info and chart can be rendered 
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};


function PopulateDropDown(){
  let search = document.getElementById('search');
    let coinListCSV = localStorage.getItem('coinlist'); // gets local storage of names from previous page// 
    let coinList = coinListCSV.split(','); // coverts local storage item back to array 

    for(let i = 0; i < coinList.length; i++)
    {
         let opt = coinList[i];
         let option = document.createElement('option'); // appends coniList array into select items 
         option.textContent = opt;
         option.value = opt;
         search.appendChild(option);


    } 
}

function GetData()
{
   
   removeChilds(accessDiv); // call to remove children, for prvious serach
   removeChilds(chartConatiner);
   removeChilds(container);
   
    fetch('https://api.coingecko.com/api/v3/coins/' + search.value) // serachs for coin with value of searchbox
    .then(response => response.json())
    .then(data => { processData(data); // fetchs data and passes to ProcessData
    })
    .catch(error => { console.log(error);
});

}


function processData(data){

  // using bootstrap row and col to split up div 
    const card = document.createElement('div');
    card.setAttribute('class', 'row'); // adding bootstrap class
    card.classList.add('searchDiv');

    let div1 = document.createElement('div');
    div1.setAttribute('class', 'col') // adding bootstrap classes
    let div2 = document.createElement('div');
    div2.setAttribute('class', 'col')
    let div3 = document.createElement('div');
    div3.setAttribute('class', 'col')

    const h1 = document.createElement('h3');
    h1.textContent = data.id;
    h1.classList.add('head'); // for fonts
    

    const p = document.createElement('h5');
    p.innerHTML = data.symbol;
    

    const pic = document.createElement('img');
    pic.src = data.image.small;
    pic.style.width = "50px";
    pic.style.height = "50px";
 

    const price = document.createElement('p');
    const change = document.createElement('p');
    price.setAttribute('class', 'number'); // class for fonts
    change.setAttribute('class', 'number');
    
    change.innerHTML = data.market_data.price_change_percentage_24h;
 
    let percent = parseFloat(change.innerHTML);

    if(percent > 0){ // same as previous page
      change.style.color = "green";
     
    }
    else{
      change.style.color = "red";
    }
    price.innerHTML = data.market_data['current_price'].eur ; // renders data to div

    const ath = document.createElement('p'); // gets all time high
    ath.innerHTML = data.market_data['ath'].eur;
    ath.setAttribute('class', 'number');

    
    const athDate = document.createElement('p');
    athDate.setAttribute('class', 'number');

    let datestring = JSON.stringify(data.market_data['ath_date'].eur);
    datestring = datestring.substring(1,10);
    athDate.innerHTML = datestring;

   
 
   


    accessDiv.appendChild(container);
    container.appendChild(card);

    div1.appendChild(h1)  // appends elements to divs
    div1.appendChild(pic);
    div2.appendChild(p);
    div2.appendChild(price);
    div2.appendChild(change);
    div3.appendChild(ath);
    div3.appendChild(athDate);
    
    card.appendChild(div1) // appends to conatiner
    //card.appendChild(div3)
    card.appendChild(div2)
    card.appendChild(div3);

    container.style.width = "60%";
    container.style.border = "2px solid white";
    container.style.padding = "5%";
    
    // appends elements

    
fetch('https://api.coingecko.com/api/v3/coins/'+search.value+'/market_chart?vs_currency=eur&days=100&interval=daily')
.then(response => response.json())
.then(data => { ProcessChart(data); // fetchs price data for last 100 days for searched coin
})
.catch(error => { console.log(error);
});

}
function ProcessChart(data)
{
    
    let chart = document.createElement('canvas'); // creates canvas
   
    chart.id = 'line-chart'; // add class for chart.js to target later / 
    chart.width = 800;
    chart.height = 450; // created canvas
    chart.style.backgroundColor = "#323232";
    chart.style.color = "white";
    chartConatiner.appendChild(chart); // append canvas
    let priceHistory = data.prices; // stores price history from api

    // get dates

    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    console.log('Day of year: ' + day); // get the day in the year it is// 

    let dayList = [];

    for(let i = day - 100; i < day; i++){
        dayList.push(i); // creates a array , todays date - 100
    }
  
    
    DrawChart(priceHistory, dayList) 

}

function DrawChart(priceData, dayList)
{/*
  I pass the array of price data , and the array of todays day of the year, -100 , 
  into chart js , which draws the data onto the chart
  */
      // creates chart
        let myChart = new Chart(document.getElementById("line-chart"), { // using chart.js renders line chart
        type: 'line',
        data: {
          labels: dayList, // using day array
          datasets: [{ 
              data: priceData, // using created price array
              label: search.value, // using search
              borderColor: "#3e95cd",
              fill: false
            },
           
          ]
        },
        options: {
          title: {
            display: true,
            text: 'Price movements, last 100 days'
          }
        }
      });

    }

