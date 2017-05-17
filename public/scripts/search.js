'use strict';

//Currently occurs only on /barad-dur route


const endpoint = 'https://fdy-brotherdonkey.c9users.io/api-topics/';
const searchInput = document.querySelector('#Barad-dur');
const suggestions = document.querySelector('.suggestions');

let searchTopics = [];

fetch(endpoint)
    .then(blob => blob.json())
    .then(data => searchTopics.push(...data));
    
// console.log("Search topics", searchTopics);

//use map to concat title + /n + text (we will also need the ._id for the href later)

function findMatches(wordToMath, searchTopics) {
    return searchTopics.filter(topic => {
        //figure out it the city or state matches
        const regex = new RegExp(wordToMath, 'gi');
        let toSearch = ''.concat(topic.title, topic.text, topic.author);
        return toSearch.match(regex);
    });
}//end find matches


function displayMatches() {
    const matchArray = findMatches(this.value, searchTopics);
    const html = matchArray.map(topic => {
    const regex = new RegExp(this.value, "gi");
    const topicTitle = topic.title.replace(regex, `<span class="bg-success">${this.value}</span>`)
    const topicText = topic.text.replace(regex, `<span class="bg-success">${this.value}</span>`)
    const topicAuthor = topic.author.replace(regex, `<span class="bg-success">${this.value}</span>`)


    return `
        <li class="card">
          <div class="card-block m-y-1">
            <a href="https://fdy-brotherdonkey.c9users.io/rivendell/${topic._id}">
                <h4 class="card-title text-primary">${topicTitle}
                    <span class="text-muted small"> - ${topicAuthor} </span>
                </h4>
            </a>
            <p class="card-text text-muted small">${topicText}</span>
            </p>
          </div>
        </li>
        `;
    }).join('');
    suggestions.innerHTML = html;
}

searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);

