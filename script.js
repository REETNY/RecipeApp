const dishCont = document.querySelector("#dishes");
const favourites = document.querySelector("#favourites");
const searchBox = document.querySelector("#seachBox");
const submitBtn = document.querySelector("#submit");
const form = document.querySelector("#form");
const dishDetails = document.querySelector("#dishDetails");
const main = document.querySelector("main");

for(let i=0; i<5; i++){
    getRandomMeal();
}

async function getRandomMeal() {

    const serverResponse = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const response = await serverResponse.json();
    const resp = response.meals[0];
    const data = resp;
    shwowRandomMeal(data, true);
}



function shwowRandomMeal(meal, isTrue = false) {
    let data = meal;
    const eachDish = document.createElement("div");
    eachDish.classList.add("eachDish");
    eachDish.innerHTML = `
        ${isTrue ? `<span class="random">Random Recipe</span>` : ''}
        <div class="eachImgCont">
        <img src="${data.strMealThumb}" alt="${data.strMeal}" id="food-img">
        </div>
        <div class="dish-details">
            <span class="dishName">${data.strMeal}</span>
            <button id="liked" class="liked"><i class="fa fa-heart" aria-hidden="true"></i></button>
        </div>
    `

    let id = data.idMeal;

    let youtubeLink = data.strYoutube;
    if(youtubeLink.includes("watch?v=")){
        youtubeLink = youtubeLink.replace("watch?v=", "embed/");
    }

    const imgClick = eachDish.querySelector("img");
    imgClick.addEventListener("click", () => {
        dishDetails.innerHTML = ``;
        dishDetails.innerHTML = `
            <span class="discharge"><i class="fa fa-times" aria-hidden="true"></i></span>
            <div class="food_name">
                ${data.strMeal}
            </div>

            <div class="food_category"><span>Category:</span>${data.strCategory}</div>
            
            <div class="food-cont">
                <img src="${data.strMealThumb}" alt="">
            </div>

            <div class="instruction">
                <span class="insrct">
                    Instruction:
                </span>
                <span class="instruct">
                    ${data.strInstructions}
                </span>
            </div>

            <div class="video-instruction">
                <iframe src="${youtubeLink}" frameborder="0"></iframe>
            </div>
        `

        const discharge = dishDetails.querySelector(".discharge");
        discharge.addEventListener("click", () => {
            dishDetails.style.display = "none";
            dishDetails.innerHTML = ``;
        })

        dishDetails.style.display = "block";
    })

    const likeBtn = eachDish.querySelector("#liked");
    likeBtn.addEventListener("click", () => {
        if(likeBtn.classList.contains("pink")){
            likeBtn.classList.remove("pink");
            removemealFromLs(id);
        }else{
            likeBtn.classList.add("pink");
            addMealIdToLs(id);
        }
        fetchFavDish();
    })
    dishCont.appendChild(eachDish);
}


function getMealsIdsFromLs() {
    const mealsIds = JSON.parse(localStorage.getItem("mealsIds")) || [];
    return mealsIds === null ? [] : mealsIds;
}

function addMealIdToLs(mealId) {
    const mealsId = getMealsIdsFromLs();

    localStorage.setItem("mealsIds", JSON.stringify([...mealsId, mealId]));
}

function removemealFromLs(mealId) {
    const mealsId = getMealsIdsFromLs();

    localStorage.setItem("mealsIds", JSON.stringify(
        mealsId.filter( meal => meal != mealId)
    ));
}



async function getFavDish(id) {
    const serverResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=` +id);
    const resp = await serverResponse.json();
    const response = resp.meals[0];
    const data = response;
    return data;
}

function fetchFavDish() {
    favourites.innerHTML = '';
    const mealsId = getMealsIdsFromLs();
    
    mealsId.forEach( async(id) => {
        const data = await getFavDish(id);
        showFavDish(data);
    })
}


function showFavDish(meal) {
    const data = meal;
    const listItem = document.createElement("li");
    listItem.classList.add("listItem");
    listItem.innerHTML = `
        <button class="remove"><i class="fa fa-times" aria-hidden="true"></i></button>
        <img src="${data.strMealThumb}" alt="${data.strMeal}" class="food-img" id="dish-img">
        <span class="food-name">${data.strMeal}</span>
    `

    const id = data.idMeal;

    let youtubeLink = data.strYoutube;
        if(youtubeLink.includes("watch?v=")){
            youtubeLink = youtubeLink.replace("watch?v=", "embed/");
        }

        const imgClick = listItem.querySelector("img");
        imgClick.addEventListener("click", () => {
            dishDetails.innerHTML = ``;
            dishDetails.innerHTML = `
                <span class="discharge"><i class="fa fa-times" aria-hidden="true"></i></span>
                <div class="food_name">
                    ${data.strMeal}
                </div>

                <div class="food_category"><span>Category:</span>${data.strCategory}</div>
                
                <div class="food-cont">
                    <img src="${data.strMealThumb}" alt="">
                </div>

                <div class="instruction">
                    <span class="insrct">
                        Instruction:
                    </span>
                    <span class="instruct">
                        ${data.strInstructions}
                    </span>
                </div>

                <div class="video-instruction">
                    <iframe src="${youtubeLink}" frameborder="0"></iframe>
                </div>
            `

            const discharge = dishDetails.querySelector(".discharge");
            discharge.addEventListener("click", () => {
                dishDetails.style.display = "none";
                dishDetails.innerHTML = ``;
                main.style.display = "block";
                main.style.width = "100%";
                main.style.minHeight = "0";
            })

            dishDetails.style.display = "block";
            main.style.display = "none";
            main.style.width = "0";
            main.style.height = "0";
        })

    const remove = listItem.querySelector(".remove");
    remove.addEventListener("click", () => {
        removemealFromLs(id);
        fetchFavDish();
    })
    favourites.appendChild(listItem);
}

fetchFavDish();



async function getDishBySearch(text) {
    const serverResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=` + text);
    const resp = await serverResponse.json();
    const response = resp.meals;
    const data = response;
    return data;
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
})

submitBtn.addEventListener("click", async() => {
    let userInput = searchBox.value;
    searchBox.value = "";
    if(userInput === "")return;
    const data = await getDishBySearch(userInput);
    showDish(data);
})

function showDish(meal) {
    let data = meal;
    dishCont.innerHTML = ``;
    data.forEach( meal => {
        const eachDish = document.createElement("div");
        eachDish.classList.add("eachDish");
        eachDish.innerHTML = `
            <div class="eachImgCont">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" id="food-img">
            </div>
            <div class="dish-details">
                <span class="dishName">${meal.strMeal}</span>
                <button id="liked" class="liked"><i class="fa fa-heart" aria-hidden="true"></i></button>
            </div>
        `

        let id = meal.idMeal;

        let youtubeLink = meal.strYoutube;
        if(youtubeLink.includes("watch?v=")){
            youtubeLink = youtubeLink.replace("watch?v=", "embed/");
        }

        const imgClick = eachDish.querySelector("img");
        imgClick.addEventListener("click", () => {
            dishDetails.innerHTML = ``;
            dishDetails.innerHTML = `
                <span class="discharge"><i class="fa fa-times" aria-hidden="true"></i></span>
                <div class="food_name">
                    ${meal.strMeal}
                </div>

                <div class="food_category"><span>Category:</span>${meal.strCategory}</div>
                
                <div class="food-cont">
                    <img src="${meal.strMealThumb}" alt="">
                </div>

                <div class="instruction">
                    <span class="insrct">
                        Instruction:
                    </span>
                    <span class="instruct">
                        ${meal.strInstructions}
                    </span>
                </div>

                <div class="video-instruction">
                    <iframe src="${youtubeLink}" frameborder="0"></iframe>
                </div>
            `

            const discharge = dishDetails.querySelector(".discharge");
            discharge.addEventListener("click", () => {
                dishDetails.style.display = "none";
                dishDetails.innerHTML = ``;
                main.style.display = "block";
                main.style.width = "100%";
                main.style.minHeight = "0";
            })

            dishDetails.style.display = "block";
            main.style.display = "none";
            main.style.width = "0";
            main.style.height = "0";
        })

        const likeBtn = eachDish.querySelector("#liked");
        likeBtn.addEventListener("click", () => {
            if(likeBtn.classList.contains("pink")){
                likeBtn.classList.remove("pink");
                removemealFromLs(id);
            }else{
                likeBtn.classList.add("pink");
                addMealIdToLs(id);
            }
            fetchFavDish();
        })
        dishCont.appendChild(eachDish);
    })
}