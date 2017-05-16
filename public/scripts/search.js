'use strict';


const endpoint = 'https://fdy-brotherdonkey.c9users.io/api-topics/';
const searchInput = document.querySelector('#Barad-dur');
const suggestions = document.querySelector('.suggestions');

let searchTopics = [];

fetch(endpoint)
    .then(blob => blob.json())
    .then(data => searchTopics.push(...data));
    
console.log(searchTopics);

//use map to concat title + /n + text (we will also need the ._id for the href later)

function findMatches(wordToMath, searchTopics) {
    return searchTopics.filter(topic => {
        //figure out it the city or state matches
        const regex = new RegExp(wordToMath, 'gi');
        
        return topic.text.match(regex);
    });
}//end find matches


function displayMatches() {
    const match = findMatches(this.value, searchTopics);

    const html = matchArray.map(topic => {
       return `
       <li>
        <span class="name">${topic.title}</span>
        <span class="name">${topic.text}, ${topic._id}</span>
       </li>
       `;
    }).join('');
    suggestions.innerHTML = html;
    
}



searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);

