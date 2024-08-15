const searchBtn = document.getElementById("searchButton");
const resetBtn = document.getElementById("resetButton");
const resultDiv = document.getElementById('result');

// Arrays to keep track of displayed items
let displayedCities = [];
let displayedCountries = [];
let displayedTemples = [];
let displayedBeaches = [];

function searchPlace() {
    clearResults();
    console.log('Search button clicked'); // Debugging line
    resultDiv.innerHTML = '';
    fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
        const input = document.getElementById('placeInput').value.toLowerCase().trim();
        let found = false;

        if (input === "country" || input === "countries") {
            found = true;
            if (!displayedCountries.length) {
                data.countries.forEach(country => {
                    country.cities.forEach(city => {
                        if (!displayedCities.includes(city.name.toLowerCase())) {
                            displayCity(city);
                            displayedCities.push(city.name.toLowerCase());
                        }
                    });
                });
                displayedCountries = data.countries.map(country => country.name.toLowerCase());
            }
        } else if (input === "city" || input === "cities") {
            found = true;
            if (!displayedCities.includes(city.name.toLowerCase())) {
                data.countries.forEach(country => {
                    country.cities.forEach(city => {
                        displayCity(city);
                        displayedCities.push(city.name.toLowerCase());
                    }); 
                });
            }
        } else if (input === "temple" || input === "temples") {
            found = true;
            if (!displayedTemples.includes(temple.name.toLowerCase())) {
                data.temples.forEach(temple => {
                    displayTemple(temple);
                    displayedTemples.push(temple.name.toLowerCase());
                });
            }
        } else if (input === "beach" || input === "beaches") {
            found = true;
            if (!displayedBeaches.includes(beach.name.toLowerCase())) {
                data.beaches.forEach(beach => {
                    displayBeach(beach);
                    displayedBeaches.push(beach.name.toLowerCase());
                });
            }
        } else {
            // Search for countries
            for (const country of data.countries) {
                if (country.name.toLowerCase().includes(input)) {
                    found = true;
                    if (!displayedCountries.includes(country.name.toLowerCase())) {
                        displayedCountries.push(country.name.toLowerCase());
                        country.cities.forEach(city => {
                            if (!displayedCities.includes(city.name.toLowerCase())) {
                                displayCity(city);
                                displayedCities.push(city.name.toLowerCase());
                            }
                        });
                    }
                    break; // Exit the loop once a country is found
                }
            }

            // If no country match is found, search for cities directly
            if (!found) {
                for (const country of data.countries) {
                    for (const city of country.cities) {
                        if (city.name.toLowerCase().includes(input)) {
                            found = true;
                            if (!displayedCities.includes(city.name.toLowerCase())) {
                                displayCity(city);
                                displayedCities.push(city.name.toLowerCase());
                            }
                            break; // Exit the loop once a city is found
                        }
                    }
                    if (found) break; // Exit the loop once a city is found
                }
            }

            // If still no match is found, search for individual temples
            if (!found) {
                for(const temple of data.temples){
                    data.temples.forEach(temple => {
                        if (temple.name.toLowerCase().includes(input)) {
                            found = true;
                            displayTemple(temple);
                            displayedTemples.push(temple.name.toLowerCase());
                        }
                    });
                }
            }

            // If still no match is found, search for individual beaches
            if (!found) {
                data.beaches.forEach(beach => {
                    if (beach.name.toLowerCase().includes(input)) {
                        found = true;
                        displayBeach(beach);
                        displayedBeaches.push(beach.name.toLowerCase());
                    }
                });
            }
        }

        // If no match is found
        if (!found) {
            console.log("Place not found"); // Debugging line
            resultDiv.innerHTML = 'Place not found.';
        }

        // Show the result window after search
        resultDiv.style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = 'An error occurred while fetching data.';
    });
}

function displayCity(city) {
    const country = city.name.split(', ')[1];
    const timeZone = getTimeZone(country);    
    resultDiv.innerHTML += `
        <div class="result-item">
            <p class="result-time">Local time in ${city.name}: ${timeZone}</p>
            <img src="${city.imageUrl}" alt="${city.name} Image" class="result-image">
            <h2 class="result-title">${city.name}</h2>
            <p class="result-description">${city.description}</p>
        </div>`;
}

function displayTemple(temple) {
    console.log("Displaying temple:", temple.name); // Debugging line
    if (!displayedTemples.includes(temple.name.toLowerCase())) {
        resultDiv.innerHTML += `
            <div class="result-item">
                <img src="${temple.imageUrl}" alt="${temple.name} Image" class="result-image">
                <h2 class="result-title">${temple.name}</h2>
                <p class="result-description">${temple.description}</p>
            </div>`;
        displayedTemples.push(temple.name.toLowerCase());
    }
}

function displayBeach(beach) {
    console.log("Displaying beach:", beach.name); // Debugging line
    if (!displayedBeaches.includes(beach.name.toLowerCase())) {
        resultDiv.innerHTML += `
            <div class="result-item">
                <img src="${beach.imageUrl}" alt="${beach.name} Image" class="result-image">
                <h2 class="result-title">${beach.name}</h2>
                <p class="result-description">${beach.description}</p>
            </div>`;
        displayedBeaches.push(beach.name.toLowerCase());
    }
}


function clearResults() {
    resultDiv.innerHTML = '';
    // Hide the result window on reset
    resultDiv.style.display = 'none';

    // Clear displayed items arrays
    displayedCities = [];
    displayedCountries = [];
    displayedTemples = [];
    displayedBeaches = [];
}

function getTimeZone(country) {
    const timezones = {
      Australia: `Australia/Sydney`,
      Brazil: 'America/Sao_Paulo',
      Japan: 'Asia/Tokyo',
      India: 'Asia/Kolkata',
    };
    if (timezones[country]) {
      const options = {
        timeZone: timezones[country],
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      };
      return new Date().toLocaleTimeString('en-US', options);
    }
}

search.addEventListener('click', searchPlace);
reset.addEventListener('click', clearResults);

function thankyou(){
    alert('Thank you for contacting us!')
}