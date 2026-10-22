console.log('app.js підключено');

// Масив об'єктів рецептів
const recipes = [
    { name: "Запечена свинина з картоплею", timeMinutes: 60, vegetarian: false },
    { name: "Паста з грибами у вершковому соусі", timeMinutes: 30, vegetarian: true },
    { name: "Куряче філе в кисло-солодкому соусі", timeMinutes: 40, vegetarian: false },
    { name: "Грецький салат з фетою", timeMinutes: 15, vegetarian: true },
    { name: "Стейк із лосося з овочами", timeMinutes: 45, vegetarian: false }
];

// Повертає випадковий елемент із масиву
const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];

// Генерує випадкові рецепти задану кількість разів
function generateRandomDinners(count) {
    console.log(`--- Генеруємо ${count} випадкових рецептів ---`);
    
    for (let i = 0; i < count; i++) {
        const randomRecipe = pickRandom(recipes);
        
        let message = `Рецепт ${i + 1}: ${randomRecipe.name} (Час: ${randomRecipe.timeMinutes} хв.)`;
        
        if (randomRecipe.vegetarian === true) {
            message += "[Вегетаріанська страва]";
        }
        
        console.log(message);
    }
    console.log('-------------------------------------------');
}

// Генерація 3 випадкових рецептів
generateRandomDinners(3);