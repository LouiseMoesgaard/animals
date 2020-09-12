"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];
let filteredAnimals = [];

// The prototype for all animals: 
const Animal = {
    name: "",
    desc: "-unknown animal-",
    type: "",
    age: 0
};

function start() {
    setButtonEvent();
    loadJSON();
}

async function loadJSON() {
    const response = await fetch("animals.json");
    const jsonData = await response.json();
    
    // when loaded, prepare data objects
    prepareObjects(jsonData);
}
  
function setButtonEvent() {
        let buttons = document.querySelectorAll("[data-action=filter]").forEach(elm => {
            elm.addEventListener("click", filtering);
        })

        let types = document.querySelectorAll("[data-action=sort]").forEach(elm => {
            elm.addEventListener("click", sorting);
        })
}

function filtering() {
    let filter = this.dataset.filter;

    if (filter == "*") {
       filteredAnimals = allAnimals;
    } else {
        filteredAnimals = allAnimals.filter(elm => {
            return elm.type === filter; //filtrerer alle elementer væk, som ikke overholder det boolske udtryk.
        });
    }
    displayList(filteredAnimals);
}

function sorting() {
    let sortKey = this.dataset.sort;
    //let sortDirection = this.dataset.sort-direction;

    if(filteredAnimals.length == 0){
        allAnimals.sort((a,b)=>{
            if (a[sortKey] < b[sortKey]) {
                return -1;
              }
              if (a[sortKey] > b[sortKey]) {
                return 1;
              } 
              // a must be equal to b
              return 0;
        }) 
        // if(sortDirection == "desc") {
        //     allAnimals.reverse();
        // } else {

        // };

        displayList(allAnimals);
    } else {
        filteredAnimals.sort((a,b)=>{
            if (a[sortKey] < b[sortKey]) {
                return -1;
              }
              if (a[sortKey] > b[sortKey]) {
                return 1;
              }
              // a must be equal to b
              return 0;
        });
        displayList(filteredAnimals);
    }

}

function prepareObjects(jsonData) {
    allAnimals = jsonData.map(preapareObject);

    displayList(allAnimals);
}

function preapareObject(jsonObject) {
    const animal = Object.create(Animal);
    
    const texts = jsonObject.fullname.split(" ");
    animal.name = texts[0];
    animal.desc = texts[2];
    animal.type = texts[3];
    animal.age = jsonObject.age;

    return animal;
}


function displayList(animals) {
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";

    // build a new list
    animals.forEach(displayAnimal);

}

function displayAnimal( animal ) {
    // create clone
    const clone = document.querySelector("template#animal").content.cloneNode(true);

    // set clone data
    clone.querySelector("[data-field=name]").textContent = animal.name;
    clone.querySelector("[data-field=desc]").textContent = animal.desc;
    clone.querySelector("[data-field=type]").textContent = animal.type;
    clone.querySelector("[data-field=age]").textContent = animal.age;

    // append clone to list
    document.querySelector("#list tbody").appendChild( clone );
}


