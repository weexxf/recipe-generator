console.log('app.js підключено - Практична робота 10');

const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];

const generateButton = document.querySelector('#generate-button');
const vegetarianCheckbox = document.querySelector('#vegetarian-only');
const API_URL = 'https://www.themealdb.com/api/json/v1/1/random.php';
const loadingStatus = document.querySelector('#loading-status');
const errorMessage = document.querySelector('#error-message');
const refreshButton = document.querySelector('#refresh-button');

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
                'https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian', { cache: 'no-store' }
            );

            if (!listResponse.ok) {
                throw new Error(`HTTP ${listResponse.status}`);
            }

            const listData = await listResponse.json();

            if (!listData.meals || listData.meals.length === 0) {
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

        if (!data.meals || data.meals.length === 0) {
            throw new Error('Рецепт не знайдено');
        }

        const meal = data.meals[0];

        const recipe = {
            name: meal.strMeal,
            image: meal.strMealThumb,
            instructions: meal.strInstructions,
            vegetarian: meal.strCategory === 'Vegetarian'
        };
        vm.currentRecipe = recipe;

        vm.recipes.push({
            ...recipe,
            id: vm.recipes.length + 1
        });

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

const RandomRecipeCard = {
    props: ['recipe'],
    emits: ['regenerate'],

    template: `
        <article class="recipe-card" :class="{ vegetarian: recipe.vegetarian }">
            <p v-if="recipe.vegetarian" class="veg-badge">
                Вегетаріанська страва
            </p>
            <img v-if="recipe.image" :src="recipe.image" :alt="recipe.name">

            <h3>{{ recipe.name }}</h3>
            <p v-if="recipe.type">{{ recipe.type }}</p>
            <p v-if="recipe.timeMinutes">
                Час приготування: {{ recipe.timeMinutes }} хв.
            </p>
            <p v-if="recipe.instructions">{{ recipe.instructions }}</p>

            <button type="button" @click="$emit('regenerate')">
                Ще!
            </button>
        </article>
    `
};

const vueApp = Vue.createApp({
    components: { RandomRecipeCard },
    data() {
        return {
            recipes: [],
            currentRecipe: null
        };
    },
    methods: {
        regenerateRecipe() {
            loadRecipe();
        }
    },

    template: `
        <div>
            <section id="recipe">
                <h2>Перегляд рецепта</h2>

                <random-recipe-card
                    v-if="currentRecipe"
                    :recipe="currentRecipe"
                    @regenerate="regenerateRecipe"
                ></random-recipe-card>
            </section>

            <section id="history">
                <h2>Історія згенерованих рецептів</h2>

                <p>Згенеровано рецептів за сеанс:
                    {{ recipes.length }}
                </p>

                <div class="cards">
                    <article
                        v-for="item in recipes"
                        :key="item.id"
                        class="history-card"
                    >
                        <img :src="item.image" :alt="item.name">
                        <h3>{{ item.name }}</h3>
                    </article>
                </div>
            </section>
        </div>
    `
});

const vm = vueApp.mount('#vue-app');