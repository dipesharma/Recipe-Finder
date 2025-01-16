document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat');
    const recipeId = urlParams.get('id');
    const recipeDetails = document.getElementById('recipe-details');
    const categoryRecipes = document.getElementById('category-recipes');
    const searchBar = document.getElementById('searchBar');

    let allRecipes = [];

    fetch(`recipes.json`)
        .then(response => response.json())
        .then(data => {
            allRecipes = data;

            if (category) {
                displayRecipes(allRecipes.filter(recipe => recipe.category === category), categoryRecipes);
            }

            if (recipeId) {
                const recipe = allRecipes.find(recipe => recipe.id == recipeId);
                if (!recipe) {
                    recipeDetails.innerHTML = "<h1>Recipe Not Found</h1>";
                } else {
                    recipeDetails.innerHTML = `
                        <img src="${recipe.image}" alt="${recipe.title}">
                        <h2>${recipe.title}</h2>
                        <h3>Ingredients</h3>
                        <ul>
                            ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                        </ul>
                        <h3>Instructions</h3>
                        <ol>
                            ${recipe.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                        </ol>`;
                }
            }
        })
        .catch(error => {
            console.error("Error fetching recipes:", error);
            if (category) {
                categoryRecipes.innerHTML = "<p>Error loading recipes.</p>";
            }
            if (recipeId) {
                recipeDetails.innerHTML = "<p>Error loading recipe details.</p>";
            }
        });

    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        const filteredRecipes = allRecipes.filter(recipe => {
            const titleMatches = recipe.title.toLowerCase().startsWith(searchTerm) || recipe.title.toLowerCase().includes(" " + searchTerm);
            const ingredientsMatch = recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm));
            return titleMatches || ingredientsMatch;
        });


        const featuredSection = document.getElementById('featured');
        if (featuredSection) {
            if (searchTerm === "") {
                featuredSection.innerHTML = `<h2>Featured Recipes</h2>
                <div class="recipe-grid">
                    <a href="recipe.html?id=1" class="recipe-card">
                        <img src="cake.jpg" alt="Chocolate Cake">
                        <h3>Chocolate Cake</h3>
                    </a>
                    <a href="recipe.html?id=2" class="recipe-card">
                        <img src="salad.jpg" alt="Caesar Salad">
                        <h3>Caesar Salad</h3>
                    </a>
                </div>`;
            } else {
                featuredSection.innerHTML = "<h2>Search Results</h2><div class='recipe-grid'></div>";
                displayRecipes(filteredRecipes, featuredSection);
            }
        }
    });

    function displayRecipes(recipes, targetElement) {
        if (recipes.length === 0) {
            targetElement.innerHTML = "<h1>No Recipes Found</h1>";
        } else {
            let recipeGrid = targetElement.querySelector('.recipe-grid');
            if (!recipeGrid) {
                recipeGrid = document.createElement('div');
                recipeGrid.classList.add('recipe-grid');
                targetElement.appendChild(recipeGrid);
            } else {
                recipeGrid.innerHTML = "";
            }
            recipes.forEach(recipe => {
                const recipeCard = document.createElement('a');
                recipeCard.href = `recipe.html?id=${recipe.id}`;
                recipeCard.classList.add('recipe-card');
                recipeCard.innerHTML = `<img src="${recipe.image}" alt="${recipe.title}"><h3>${recipe.title}</h3>`;
                recipeGrid.appendChild(recipeCard);
            });
        }
    }
});