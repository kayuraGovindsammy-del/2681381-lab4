
const countryInput = document.getElementById("country-input");
const searchBtn = document.getElementById("search-btn");
const spinner = document.getElementById("loading-spinner");
const countryInfo = document.getElementById("country-info");
const borderingCountries = document.getElementById("bordering-countries");
const errorMessage = document.getElementById("error-message");

async function searchCountry(countryName) {
    try {
        
        errorMessage.textContent = "";
        countryInfo.innerHTML = "";
        borderingCountries.innerHTML = "";

        if (!countryName) {
            throw new Error("Please enter a country name.");
        }

        
        spinner.classList.remove("hidden");

        
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        
        if (!response.ok) {
            throw new Error("Country not found. Please try again.");
        }

        const data = await response.json();
        const country = data[0];

        
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="150">
        `;

        
        if (country.borders) {
            const borderPromises = country.borders.map(code =>
                fetch(`https://restcountries.com/v3.1/alpha/${code}`).then(res => res.json())
            );

            const borderData = await Promise.all(borderPromises);

            borderData.forEach(border => {
                const neighbor = border[0];
                const div = document.createElement("div");
                div.innerHTML = `
                    <p>${neighbor.name.common}</p>
                    <img src="${neighbor.flags.svg}" alt="${neighbor.name.common} flag" width="80">
                `;
                borderingCountries.appendChild(div);
            });
        }

    } catch (error) {
        errorMessage.textContent = error.message;
    } finally {
        
        spinner.classList.add("hidden");
    }
}

searchBtn.addEventListener("click", () => {
    const country = countryInput.value.trim();
    searchCountry(country);
});

countryInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchCountry(countryInput.value.trim());
    }
});