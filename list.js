var rank = 1; // for rank 
const container = document.createElement('div');
container.setAttribute('class', 'container'); // creates main container
container.classList.add('listContainer');
let target = document.getElementById('target');

target.appendChild(container); // appends container to target on page 


// coins/markets
fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false') // Api call 
    .then(response => response.json())
    .then(data => { processData(data);
    })
    .catch(error => { console.log(error);
});

function processData(data){

    let nameArray = []
    data.forEach(coin => {

        

        const card = document.createElement('div'); // creates card for each element
        card.setAttribute('class', 'card');
        card.style.borderBottom = "1px solid white";
        card.classList.add('listItem');
        

        const flexDiv = document.createElement('div'); // creates divs
        const flexDiv1 = document.createElement('div');
        const flexDiv2 = document.createElement('div');
        const flexDiv3 = document.createElement('div');
        const flexDiv4 = document.createElement('div');

        flexDiv.classList.add('item'); // adds classes for flexbox
       
        flexDiv2.classList.add('rank');
        flexDiv3.classList.add('item');
        flexDiv4.classList.add('rank');

   

        const rankText = document.createElement('p');
        rankText.innerHTML = rank;
        flexDiv4.appendChild(rankText);



        const heading = document.createElement('h5');
        heading.innerHTML = coin.id;
        nameArray.push(coin.id); // pushes name into array for local storage 
        heading.classList.add('gap');
        
        flexDiv.appendChild(heading);
  
        const p = document.createElement('p');
         p.innerHTML = coin.symbol;
         p.classList.add('gap');
         p.setAttribute('class', 'percent'); // for fonts
        flexDiv.appendChild(p);

        const pic = document.createElement('img');
        pic.src = coin.image;
        pic.classList.add('pic');
        
        flexDiv2.appendChild(pic);
       

        const price = document.createElement('p');
        const change = document.createElement('p');
        price.setAttribute('class', 'number'); // adding classes for fonts
        change.setAttribute('class', 'number');
        change.setAttribute('class', 'percent');
        price.innerHTML = coin.current_price;
        change.innerHTML = coin.price_change_percentage_24h;
        price.classList.add('gap');
        change.classList.add('gap');

        let percent = parseFloat(change.innerHTML);
        
        if(percent > 0){ // if converted float is over 0, color is green with +, else its red// 
            change.style.color = "green";
            change.innerHTML = "+ " + coin.price_change_percentage_24h;

        }
        else{
            change.style.color = "red";
        }

        
        flexDiv3.appendChild(price);
        flexDiv3.appendChild(change);

        const marketCap = document.createElement('p');
        
        marketCap.innerHTML = coin.market_cap;
        marketCap.setAttribute('class', 'number');
        flexDiv1.appendChild(marketCap) 
 // I appended the data to divs first so i could use flexbox for spacing // 

        card.appendChild(flexDiv4); // appends divs to card
        card.appendChild(flexDiv2);
        card.appendChild(flexDiv);
        card.appendChild(flexDiv3);
        card.appendChild(flexDiv1);
        container.appendChild(card); // apends card to the container

        rank++; // increments rank // 

    });

    localStorage.setItem('coinlist', nameArray); // sets list of coins in local storage for next page 

}