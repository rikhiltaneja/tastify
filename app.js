let topDiv = document.querySelector("#head");
let searchBar = document.querySelector("#searchbar");
let searchBtn = document.querySelector("#search-btn button");
let searchedCategory;
let url;
let aboutBtn = document.querySelector(".about");
aboutBtn.addEventListener("click", () => {
  window.open("about.html", "_self");
});
let homeBtn = document.querySelector(".home");
homeBtn.addEventListener("click", () => {
  window.open("index.html", "_self");
});
let randomMealImage = document.querySelector("#mealImg");
let randomDishName = document.querySelector("#randomDishName");
let randomBtn = document.querySelector("#random-btn button");
let loading = document.querySelector("#loading");
let recipeShow = document.querySelector(".recipe-show");
let modal = document.querySelector("#modal");
let randomRecipeDisplayDiv = document.querySelector("#random-meal");
let modalCloseBtn = document.querySelector("#close-btn button");
let modalDishImg = document.querySelector("#modal-dish>img");
let modalDishName = document.querySelector("#modal-dish-name");
let modalDishIngredients = document.querySelector("#ingredients");
let ingredientsDisplay = document.querySelector("#ingredients");
let modalInstructions = document.querySelector("#instructions-text");
function getRandomDish() {
  randomRecipeDisplayDiv.style.pointerEvents = "none";
  loading.style.visibility = "visible";
  randomMealImage.style.visibility = "hidden";
  randomDishName.style.visibility = "hidden";
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      ingredientsDisplay.innerHTML = "";
      let randomDishData;
      randomDishData = data;
      let newRandomDishData = randomDishData.meals["0"];
      console.log(randomDishData);
      setTimeout(() => {
        randomMealImage.setAttribute(
          "src",
          randomDishData.meals["0"].strMealThumb
        );
      }, 500);
      randomDishName.textContent = randomDishData.meals["0"].strMeal;
      randomMealImage.addEventListener("load", () => {
        randomRecipeDisplayDiv.style.pointerEvents = "auto";
        loading.style.visibility = "hidden";
        randomMealImage.style.visibility = "visible";
        randomDishName.style.visibility = "visible";
      });
      recipeShow.addEventListener("click", () => {
        document.body.style.overflow = "hidden";
        modal.style.visibility = "visible";
        ingredientsDisplay.innerHTML = "";
        modalDishImg.setAttribute(
          "src",
          randomDishData.meals["0"].strMealThumb
        );
        modalDishName.textContent = randomDishData.meals["0"].strMeal;
        modalInstructions.textContent = newRandomDishData.strInstructions;
        for (let i = 1; i <= 20; i++) {
          let ingredientNumber = "strIngredient" + i;
          if (newRandomDishData[ingredientNumber].trim() != "") {
            let ingredientDiv = document.createElement("div");
            ingredientDiv.setAttribute("id", "ingredient");
            ingredientDiv.addEventListener("click", () => {
              window.open(
                `https://www.bigbasket.com/ps/?q=${newRandomDishData[ingredientNumber]}`
              );
            });
            let ingredientImg = document.createElement("img");
            ingredientImg.setAttribute(
              "src",
              `https://www.themealdb.com/images/ingredients/${newRandomDishData[ingredientNumber]}-Small.png`
            );
            let ingredientName = document.createElement("div");
            ingredientName.textContent = newRandomDishData[ingredientNumber];
            ingredientDiv.appendChild(ingredientImg);
            ingredientDiv.appendChild(ingredientName);
            ingredientsDisplay.append(ingredientDiv);
          }
        }
      });
    });
}
getRandomDish();
randomBtn.addEventListener("click", () => {
  getRandomDish();
});

modalCloseBtn.addEventListener("click", () => {
  modal.style.visibility = "hidden";
  document.body.style.overflow = "auto";
});
let categoryDiv = document.querySelector("#category");
let categoryMainDiv = document.querySelector("#category-main");
let categoryMealsData;
let categoryHeading = document.querySelector("#category-heading");
let loadingFull = document.querySelector("#loading-full");
function category() {
  console.log(url);
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      // console.log(data)
      categoryDiv.innerHTML = "";
      categoryMainDiv.style.display = "flex";
      categoryHeading.textContent = searchedCategory;
      console.log(data.meals);
      categoryMealsData = data.meals;
      categoryMealsData.forEach((el) => {
        let categoryMealDiv = document.createElement("div");
        categoryMealDiv.setAttribute("id", "category-meal");
        // categoryMealDiv.setAttribute("class", el.strMeal);
        let categoryMealImg = document.createElement("img");
        categoryMealImg.setAttribute("src", el.strMealThumb);
        let categoryDishName = document.createElement("div");
        categoryDishName.setAttribute("id", "categoryDishName");
        categoryDishName.textContent = el.strMeal;
        categoryMealDiv.appendChild(categoryMealImg);
        categoryMealDiv.appendChild(categoryDishName);
        categoryDiv.append(categoryMealDiv);
        randomBtn.scrollIntoView({ behavior: "smooth" });
        categoryMealDiv.addEventListener("click", () => {
          document.body.style.overflow = "hidden";
          loadingFull.style.visibility = "visible";
          ingredientsDisplay.innerHTML = "";
          fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${el.strMeal}`
          )
            .then((res) => {
              return res.json();
            })
            .then((data) => {
              ingredientsDisplay.innerHTML = "";
              dishNameData = data.meals;
              modalDishName.textContent = dishNameData["0"].strMeal;
              modalInstructions.textContent = dishNameData["0"].strInstructions;
              modalDishImg.setAttribute("src", dishNameData["0"].strMealThumb);
              for (let i = 1; i <= 20; i++) {
                let ingredientNumber = "strIngredient" + i;
                if (dishNameData["0"][ingredientNumber].trim() != "") {
                  let ingredientDiv = document.createElement("div");
                  ingredientDiv.setAttribute("id", "ingredient");
                  ingredientDiv.addEventListener("click", () => {
                    window.open(
                      `https://www.bigbasket.com/ps/?q=${dishNameData["0"][ingredientNumber]}`
                    );
                  });
                  let ingredientImg = document.createElement("img");
                  ingredientImg.setAttribute(
                    "src",
                    `https://www.themealdb.com/images/ingredients/${dishNameData["0"][ingredientNumber]}-Small.png`
                  );
                  let ingredientName = document.createElement("div");
                  ingredientName.textContent =
                    dishNameData["0"][ingredientNumber];
                  ingredientDiv.appendChild(ingredientImg);
                  ingredientDiv.appendChild(ingredientName);
                  ingredientsDisplay.append(ingredientDiv);
                }
              }
              modalDishImg.addEventListener("load", () => {
                loadingFull.style.visibility = "hidden";
                modal.style.visibility = "visible";
              });
            });
        });
      });
    })
    .catch((er) => {
      alert("Either this Category isn't avialable or you need to improve your grammar skills!");
      searchBtn.addEventListener("click", () => {});
    });
}
searchBtn.addEventListener("click", () => {
  searchedCategory = searchBar.value;
  url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchedCategory}`;
  category();
});
searchBar.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    searchedCategory = searchBar.value;
    url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchedCategory}`;
    category();
  }
});
let searchAgainBtn = document.querySelector("#search-again-btn button");
searchAgainBtn.addEventListener("click", () => {
  topDiv.scrollIntoView({ behavior: "smooth" });
});
let downArrow = document.querySelector("#down-arrow");
let randomDiv = document.querySelector("#random");
downArrow.addEventListener("click", () => {
  downArrow.scrollIntoView({ behavior: "smooth" });
});
let exploreBtn = document.querySelector(".explore")

exploreBtn.addEventListener("click",()=>{
  downArrow.scrollIntoView({ behavior: "smooth" })
})