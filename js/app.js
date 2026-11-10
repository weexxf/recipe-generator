console.log('app.js підключено - Практична робота 9');

const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];
let historyCounter = 0;

const resultContainer = document.querySelector('#recipe-result');
const countDisplay = document.querySelector('#history-count');
const generateButton = document.querySelector('#generate-button');
const historyContainer = document.querySelector('.cards');
const vegetarianCheckbox = document.querySelector('#vegetarian-only');
const API_URL = 'https://www.themealdb.com/api/json/v1/1/random.php';
const loadingStatus = document.querySelector('#loading-status');
const errorMessage = document.querySelector('#error-message');
const refreshButton = document.querySelector('#refresh-button');

function renderRandomRecipe(recipe) {
    // Видалення попередньої картки перед відображенням нового рецепта
    const oldCard = resultContainer.querySelector('.recipe-card');

    if (oldCard) {
        oldCard.remove();
    }

    const currentRecipe = recipe;

    const card = document.createElement('article');
    card.classList.add('recipe-card');

    const img = document.createElement('img');
    img.src = currentRecipe.image;
    img.alt = currentRecipe.name;

    const title = document.createElement('h3');
    title.textContent = currentRecipe.name;

    const details = document.createElement('p');
    details.textContent = currentRecipe.instructions;
    
    if (currentRecipe.vegetarian) {
        card.classList.add('vegetarian');
        const vegBadge = document.createElement('p');
        vegBadge.textContent = 'Вегетаріанська страва';
        vegBadge.style.color = 'green';
        card.append(vegBadge);
    }

    card.append(img, title, details);
    resultContainer.append(card);

    historyCounter++;
    countDisplay.textContent = historyCounter;

    const historyCard = document.createElement('article');
    historyCard.classList.add('history-card');

    const historyImg = document.createElement('img');
    historyImg.src = currentRecipe.image;
    historyImg.alt = currentRecipe.name;

    const historyTitle = document.createElement('h3');
    historyTitle.textContent = currentRecipe.name;
    
    historyCard.append(historyImg, historyTitle);
    historyContainer.append(historyCard);
}

// Завантаження випадкового рецепта з TheMealDB API
// https://www.themealdb.com/api/json/v1/1/random.php
async function loadRecipe() {
    loadingStatus.hidden = false;
    errorMessage.hidden = true;
    generateButton.disabled = true;
    refreshButton.disabled = true;

    try {
        let url = API_URL;

        // Для вегетаріанських страв отримуємо рецепт з відповідної категорії
        if (vegetarianCheckbox.checked) {
            const listResponse = await fetch(
                'https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian',
                { cache: 'no-store' }
            );

            if (!listResponse.ok) {
                throw new Error(`HTTP ${listResponse.status}`);
            }

            const listData = await listResponse.json();

            if (!listData.meals?.length) {
                throw new Error('Вегетаріанські рецепти не знайдено');
            }

            const selected = pickRandom(listData.meals);

            url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${selected.idMeal}`;
        }

        const response = await fetch(url, { cache: 'no-store' });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!data.meals?.length) {
            throw new Error('Рецепт не знайдено');
        }

        const meal = data.meals[0];

        const recipe = {
            name: meal.strMeal,
            image: meal.strMealThumb,
            instructions: meal.strInstructions,
            vegetarian: meal.strCategory === 'Vegetarian'
        };

        renderRandomRecipe(recipe);

    } catch (error) {
        errorMessage.textContent =
            'Не вдалося завантажити рецепт. Спробуйте ще раз.';

        errorMessage.hidden = false;
        console.error(error);

    } finally {
        loadingStatus.hidden = true;
        generateButton.disabled = false;
        refreshButton.disabled = false;
    }
}

// Генерація нового рецепта
generateButton.addEventListener('click', loadRecipe);

// Повторний запит до API
refreshButton.addEventListener('click', loadRecipe);

// Оновлення рецепта при зміні фільтра
vegetarianCheckbox.addEventListener('change', loadRecipe);

// Початкове завантаження рецепта
loadRecipe();