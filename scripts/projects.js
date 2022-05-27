const projects = [
    {"name": "Newton's method",
        "description": "The Newton-Raphson method is a root finding algorithm and can be used to find x-intersection of real valued functions. It is an iterative algorithm which uses the tangent of the function for the guidline of the next iteration step.",
        "tags": ["math","optimization","machine learning"],
        "image": "projects/newtons_method/icon.png",
        "url": "projects/newtons_method/newtons_method.html"}
]




const chip_container = document.getElementById("projects-chips-container");
var search_tags = [];

function add_chip(name){
    var chip = document.createElement("div");
    var text = document.createElement("div");
    text.appendChild(document.createTextNode(name));
    chip.appendChild(text);
    chip.classList.add("chips");
    chip.classList.add("noselect");
    text.classList.add("noselect");
    
    var img = document.createElement("img");
    img.src = "images/checkmark.svg";
    chip.appendChild(img);

    chip_container.appendChild(chip);

    //on click
    chip.onclick = function(event) {
        if(search_tags.includes(name)) {
            img.classList.toggle("is-show");
            var index = search_tags.indexOf(name);
            search_tags.splice(index, 1);
            filter_projects();
        }else{
            img.classList.toggle("is-show");
            search_tags.push(name);
            filter_projects();
        }
    }

}

const projects_container = document.getElementById("project-container");

function add_project(name, description, img_url, html_url){    
    var card = document.createElement("div");
    card.className += " project-card";

  

    var text_container = document.createElement("div");

    var text1 = document.createElement("div");
    text1.appendChild(document.createTextNode(name));
    var text2 = document.createElement("div");
    text2.appendChild(document.createTextNode(description));
    text_container.appendChild(text1);
    text_container.appendChild(text2);
    

    var project_link = document.createElement("a");
    project_link.className += " project-card-link noselect";
    project_link.appendChild(document.createTextNode("Goto Project"));
    project_link.href = html_url;
    text_container.appendChild(project_link);



    var img = document.createElement("img");
    img.src = img_url;


    card.appendChild(text_container);
    card.appendChild(img);
    /*
    card.onclick = function () {
        location.href = html_url;
    };
    */
    projects_container.appendChild(card);
}

function load_projects(){
    projects.forEach(project => {
        add_project(project.name, project.description, project.image, project.url);
    });
}

function load_chips(){
    var tags = [];
    projects.forEach(element => {
        tags = tags.concat(element.tags);
    });
    var tags = [...new Set(tags)];
    tags.forEach(element => {
        add_chip(element);
    });
}

const input_field =  document.getElementById("project-searchbar");

function filter_projects(){
    const search_string = input_field.value;

    var idc = [];

    for (i=0; i < projects.length; i++){
        const name = projects[i].name;
        const tags = projects[i].tags;
        if(name.includes(search_string)){

            const result = search_tags.every(val => tags.includes(val));
            if(result){
                idc.push(i);
            }

        }
    }

    for (let index = 0; index < projects.length; index++) {
        
        if(idc.includes(index)){
            projects_container.children[index].style.display = "flex";
        }else{
            projects_container.children[index].style.display = "none";
        }

    }


}

load_projects();
load_chips();