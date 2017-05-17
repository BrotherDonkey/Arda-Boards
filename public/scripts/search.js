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
    const matchArray = findMatches(this.value, searchTopics);

    const html = matchArray.map(topic => {
      const regex = new RegExp(this.value, "gi");
      const titleMatch = topic.title.replace(regex, `<span class="highlight">${this.value}</span>`);
      const textMatch = topic.text.replace(regex, `<span class="highlight">${this.value}</span>`);

      return `
      <li>
        <span class="name">${titleMatch}</span>
        <span class="name">${textMatch}</span>
      </li>
      `;
    }).join('');
    suggestions.innerHTML = html;
}



searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);

