console.log('app.js підключено - Лабораторна 7');

const recipes = [
    { name: "Запечена свинина з картоплею", timeMinutes: 60, vegetarian: false },
    { name: "Паста з грибами у вершковому соусі", timeMinutes: 30, vegetarian: true },
    { name: "Куряче філе в кисло-солодкому соусі", timeMinutes: 40, vegetarian: false },
    { name: "Грецький салат з фетою", timeMinutes: 15, vegetarian: true },
    { name: "Стейк із лосося з овочами", timeMinutes: 45, vegetarian: false }
];

const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];
let historyCounter = 0;

const resultContainer = document.querySelector('#recipe-result');
const countDisplay = document.querySelector('#history-count');
const generateButton = document.querySelector('button');
const historyContainer = document.querySelector('.cards');

function renderRandomRecipe() {
    resultContainer.innerHTML = ''; 
    const currentRecipe = pickRandom(recipes);

    const card = document.createElement('article');
    card.classList.add('recipe-card');
    card.setAttribute('data-time', currentRecipe.timeMinutes);

    const img = document.createElement('img');
    img.src = 'assets/img/1.jpg';
    img.alt = 'Фото страви';

    const title = document.createElement('h3');
    title.textContent = currentRecipe.name;

    const details = document.createElement('p');
    details.textContent = `Час приготування: ${currentRecipe.timeMinutes} хв.`;
    
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
    historyImg.src = 'assets/img/1.jpg';
    historyImg.alt = 'Мініатюра страви';
    
    const historyTitle = document.createElement('h3');
    historyTitle.textContent = currentRecipe.name;
    
    historyCard.append(historyImg, historyTitle);
    historyContainer.append(historyCard);
}

generateButton.addEventListener('click', renderRandomRecipe);
renderRandomRecipe();