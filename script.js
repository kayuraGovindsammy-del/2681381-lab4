const input = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const spinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

async function searchCountry(countryName) {
    try {
        if (!countryName){
            throw new Error("enter a country name.");
        }

        errorMessage.classList.add('hidden');
        countryInfo.classList.add('hidden');
        borderingCountries.classList.add('hidden');
        borderingCountries.innerHTML = "";

        spinner.classList.remove('hidden');

        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);

        if (!response.ok){
            throw new Error("country not found.");
        }

        const data = await response.json();
        const country = data[0];

        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital[0]}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;
        countryInfo.classList.remove('hidden');

        if (country.borders) {
            for (let code of country.borders) {
                const borderResponse = await fetch (`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const border = borderData[0];

                borderingCountries.innerHTML += `
                    <div class="border-country">
                        <p>${border.name.common}</p>
                        <img src="${border.flags.svg}" alt="${border.name.common} flag">
                    </div>
                `;
            } 
        } 
        else{
                borderingCountries.innerHTML = "<p> No bordering countries. </p>";
            }
            borderingCountries.classList.remove('hidden');

        
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
        
    } finally {
        spinner.classList.add('hidden');
    }
}
searchBtn.addEventListener('click', () => {
    searchCountry(input.value.trim());
});

input.addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
        searchCountry(input.value.trim());
    }
});
