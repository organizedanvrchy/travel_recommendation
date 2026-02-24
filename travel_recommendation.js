fetch("navbar.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("navbar").innerHTML = data;

        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const resetBtn = document.getElementById('resetBtn');
        const bookBtn = document.getElementById('bookBtn');
        const contactForm = document.getElementById('contactForm');
        const resultsContainer = document.getElementById('searchResults');

        let travelData = {};

        /* *** Fetch data *** */
        fetch('travel_recommendation_api.json')
            .then(response => response.json())
            .then(data => {
                travelData = data;
                console.log('Travel Data Loaded:', travelData);
            })
            .catch(error => console.error('Error loading JSON:', error));

        /* *** Helper function normalize strings for matching *** */
        function normalize(str) {
            return str.trim().toLowerCase();
        }

        /* *** Helper function to check if query matches an item *** */
        function matchesQuery(itemName, query) {
            const name = normalize(itemName);
            const q = normalize(query);

            // Handle singular/plural and different capitalization
            if ((q === 'beach' || q === 'beaches') && name.includes('beach')) return true;
            if ((q === 'temple' || q === 'temples') && name.includes('temple')) return true;

            return name.includes(q);
        }

        /* *** Create results card *** */
        function createCard(item) {
            const card = document.createElement('div');
            card.classList.add('resultCard');

            const img = document.createElement('img');
            img.src = item.imageUrl;
            img.alt = item.name;

            const title = document.createElement('h3');
            title.textContent = item.name;

            const desc = document.createElement('p');
            desc.textContent = item.description;

            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(desc);

            return card;
        }

        /* *** Display results *** */
        function displayResults(query) {
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'flex';

            if (!query) return;

            let hasResults = false;
            const q = query.trim().toLowerCase();

            // Show all beaches if query is "beach" or "beaches"
            if (q === 'beach' || q === 'beaches') {
                travelData.beaches?.forEach(beach => {
                    resultsContainer.appendChild(createCard(beach));
                    hasResults = true;
                });
            }

            // Show all temples if query is "temple" or "temples"
            if (q === 'temple' || q === 'temples') {
                travelData.temples?.forEach(temple => {
                    resultsContainer.appendChild(createCard(temple));
                    hasResults = true;
                });
            }

            // Search countries/cities
            travelData.countries?.forEach(country => {
                if (matchesQuery(country.name, q)) {
                    country.cities.forEach(city => {
                        resultsContainer.appendChild(createCard(city));
                        hasResults = true;
                    });
                } else {
                    country.cities.forEach(city => {
                        if (matchesQuery(city.name, q)) {
                            resultsContainer.appendChild(createCard(city));
                            hasResults = true;
                        }
                    });
                }
            });

            // Search beaches/temples by name
            travelData.temples?.forEach(temple => {
                if (matchesQuery(temple.name, q)) {
                    resultsContainer.appendChild(createCard(temple));
                    hasResults = true;
                }
            });

            travelData.beaches?.forEach(beach => {
                if (matchesQuery(beach.name, q)) {
                    resultsContainer.appendChild(createCard(beach));
                    hasResults = true;
                }
            });

            // No results
            if (!hasResults) {
                const noResultCard = document.createElement('div');
                noResultCard.classList.add('resultCard');
                const msg = document.createElement('p');
                msg.textContent = 'No results found.';
                msg.style.fontStyle = 'italic';
                msg.style.color = '#fff';
                noResultCard.appendChild(msg);
                resultsContainer.appendChild(noResultCard);
            }
        }

        /* *** Handle book button click *** */
        bookBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.focus();
                // Scroll to make it visible
                searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });

        /* *** Handle search button click *** */
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value;
            displayResults(query);
        });

        /* *** Handle reset button click *** */
        resetBtn.addEventListener('click', () => {
            searchInput.value = '';
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'none';
        });

        /* *** Handle form submission *** */
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Form submitted! Thank you for contacting us.');
        });
    })
    .catch(err => console.error('Error loading navbar:', err));