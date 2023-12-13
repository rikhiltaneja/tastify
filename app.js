// defining all the required variables
let topDiv = document.querySelector("#head");
let searchBar = document.querySelector("#searchbar");
let searchBtn = document.querySelector("#search-btn button");
let searchedCategory;
let url;
let aboutBtn = document.querySelector(".about");

// event listener for aboutBtn to redirect to about.html
aboutBtn.addEventListener("click", () => {
  window.open("about.html", "_self");
});
let homeBtn = document.querySelector(".home");

// event listener for homeBtn to redirect to index.html
homeBtn.addEventListener("click", () => {
  window.open("index.html", "_self");
});

// defining all the required variables
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

// function in which a random dish is called and modal is updated
function getRandomDish() {

  // setting styles to make the website more functional/attractive
  randomRecipeDisplayDiv.style.pointerEvents = "none";
  loading.style.visibility = "visible";
  randomMealImage.style.visibility = "hidden";
  randomDishName.style.visibility = "hidden";

  //fetching random meal API from themealdb.com
  // fetch("https://www.themealdb.com/api/json/v1/1/random.php")
  axios.get("https://www.themealdb.com/api/json/v1/1/random.php")
    // .then((res) => {
    //   return res.json();
    // })
    .then((data) => {
      ingredientsDisplay.innerHTML = "";
      let randomDishData;
      randomDishData = data.data;
      console.log(randomDishData)
      let newRandomDishData = randomDishData.meals["0"];
      console.log(randomDishData);
      setTimeout(() => {
        randomMealImage.setAttribute(
          "src",
          randomDishData.meals["0"].strMealThumb
        );
      }, 500);
      randomDishName.textContent = randomDishData.meals["0"].strMeal;

      // event listener to wait, for the image to be loaded so that the loading effect can be functional
      randomMealImage.addEventListener("load", () => {
        randomRecipeDisplayDiv.style.pointerEvents = "auto";
        loading.style.visibility = "hidden";
        randomMealImage.style.visibility = "visible";
        randomDishName.style.visibility = "visible";
      });

      // event listener for the meal, on click it will show the modal
      recipeShow.addEventListener("click", () => {
        document.body.style.overflow = "hidden";
        modal.style.visibility = "visible";
        ingredientsDisplay.innerHTML = "";
        modalDishImg.setAttribute(
          "src",
          randomDishData.meals["0"].strMealThumb
        );

        //changing text content according to the meal selected
        modalDishName.textContent = randomDishData.meals["0"].strMeal;
        modalInstructions.textContent = newRandomDishData.strInstructions;
        for (let i = 1; i <= 20; i++) {
          let ingredientNumber = "strIngredient" + i;
          if (newRandomDishData[ingredientNumber].trim() != "") {
            let ingredientDiv = document.createElement("div");
            ingredientDiv.setAttribute("id", "ingredient");

            // event listener for on click of ingredient it would take to big basket site of the ingredient
            ingredientDiv.addEventListener("click", () => {
              window.open(
                `https://www.bigbasket.com/ps/?q=${newRandomDishData[ingredientNumber]}`
              );
            });
            let ingredientImg = document.createElement("img");

            //setting ingredient image
            ingredientImg.setAttribute(
              "src",
              `https://www.themealdb.com/images/ingredients/${newRandomDishData[ingredientNumber]}-Small.png`
            );
            let ingredientName = document.createElement("div");

            //appending all the content to child of modal in HTML
            ingredientName.textContent = newRandomDishData[ingredientNumber];
            ingredientDiv.appendChild(ingredientImg);
            ingredientDiv.appendChild(ingredientName);
            ingredientsDisplay.append(ingredientDiv);
          }
        }
      });
    })
    .catch((e)=>{
      console.log(e)
    })
}

//calling the function, so that on load a dish is loaded
getRandomDish();

//on clicking the random generate button a new dish will be generated
randomBtn.addEventListener("click", () => {
  getRandomDish();
});

// event listener for close button, to close the modal on click
modalCloseBtn.addEventListener("click", () => {
  modal.style.visibility = "hidden";
  document.body.style.overflow = "auto";
});

// defining all the required variables
let categoryDiv = document.querySelector("#category");
let categoryMainDiv = document.querySelector("#category-main");
let categoryMealsData;
let categoryHeading = document.querySelector("#category-heading");
let loadingFull = document.querySelector("#loading-full");

// function category in which meal details will be fetched in category
function category() {
  console.log(url);

  // fetching the url
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

      // going through each of meals to fetch data of each
      categoryMealsData.forEach((el) => {

        // setting data of each of the meal fetched by the category
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

        // event listener, for if we click on the meal then the modal will update
        categoryMealDiv.addEventListener("click", () => {
          document.body.style.overflow = "hidden";
          loadingFull.style.visibility = "visible";
          ingredientsDisplay.innerHTML = "";

          // fetching new URL for the meal
          fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${el.strMeal}`
          )
            .then((res) => {
              return res.json();
            })
            .then((data) => {

              // updating data of modal according to the meal clicked
              ingredientsDisplay.innerHTML = "";
              dishNameData = data.meals;
              modalDishName.textContent = dishNameData["0"].strMeal;
              modalInstructions.textContent = dishNameData["0"].strInstructions;
              modalDishImg.setAttribute("src", dishNameData["0"].strMealThumb);
              
              // going through each meal
              for (let i = 1; i <= 20; i++) {
                let ingredientNumber = "strIngredient" + i;
                if (dishNameData["0"][ingredientNumber].trim() != "") {
                  let ingredientDiv = document.createElement("div");
                  ingredientDiv.setAttribute("id", "ingredient");
                  ingredientDiv.addEventListener("click", () => {

                    //opening big basket link of ingredient on click
                    window.open(
                      `https://www.bigbasket.com/ps/?q=${dishNameData["0"][ingredientNumber]}`
                    );
                  });
                  let ingredientImg = document.createElement("img");
                  ingredientImg.setAttribute(
                    "src",
                    `https://www.themealdb.com/images/ingredients/${dishNameData["0"][ingredientNumber]}-Small.png`
                  );

                  // updating code in HTML to update the modal
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

    // showing an alert if the category isn't available
    .catch((er) => {
      alert("Either this Category isn't avialable or you need to improve your grammar skills!");
      searchBtn.addEventListener("click", () => {});
    });
}

// event listener, on clicking the search button, the category of the meal searched will appear
searchBtn.addEventListener("click", () => {
  searchedCategory = searchBar.value;
  url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchedCategory}`;
  category();
});

// event listener, on clicking the enter button of keyboard, the category of the meal searched will appear
searchBar.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    searchedCategory = searchBar.value;
    url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchedCategory}`;
    category();
  }
});


let searchAgainBtn = document.querySelector("#search-again-btn button");

// event listener for if we search again, we will be redirected down to category section
searchAgainBtn.addEventListener("click", () => {
  topDiv.scrollIntoView({ behavior: "smooth" });
});

let downArrow = document.querySelector("#down-arrow");
let randomDiv = document.querySelector("#random");

// event listener, if we click on down arrow , then we will be redirected down
downArrow.addEventListener("click", () => {
  downArrow.scrollIntoView({ behavior: "smooth" });
});

let exploreBtn = document.querySelector(".explore")

// event listener, if we click on explore button, we will be redirected down
exploreBtn.addEventListener("click",()=>{
  downArrow.scrollIntoView({ behavior: "smooth" })
})