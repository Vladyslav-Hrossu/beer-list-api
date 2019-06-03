const tableBody = document.getElementById('beer-table');
const tableBodyModal = document.getElementById('beer-table-modal');
const getStartedButton = document.getElementById('get-started');
const loadMoreButton = document.getElementById('load-more');
const showSelectedButton = document.getElementById('show-selected');
const modalWindow =  document.getElementById("myModal");
const closeButton = document.getElementById("close");
const sortIdButton = document.getElementById("id-sort-button");
const sortAbvButton = document.getElementById("abv-sort-button");
const sortNameButton = document.getElementById("name-sort-button");
const urlParameters =  {
    'page': 1,
    'sorted': 'id'
};
const sortingParameters = {
    'sorted': 'id',
};
const renderedElements = [];

loadMoreButton.addEventListener('click', loadMoreData);
showSelectedButton.addEventListener('click', ()=> modalWindow.style.display = "block");
closeButton.addEventListener('click', ()=> modalWindow.style.display = "none");
sortIdButton.addEventListener('click', () => sort('id'));
sortAbvButton.addEventListener('click', () => sort('abv'));
sortNameButton.addEventListener('click', () => sort('name'));
renderLoadedData();

class listElement {
    constructor(data){
        this.data = data;
        this.id = data['id'];
        this.name = data['name'];
        this.abv = data['abv'];
        this.imageUrl = data['image_url'];
    }
    render(){
        const parent = createElement('tr', 'data-row');
        const children = [];
        
        parent.setAttribute('id', this.id);

        for(let i = 0; i < 5; i++){
            const td = createElement('td','column');
            parent.appendChild(td);
            children.push(td);            
        }

        for(let i = 0; i < children.length; i++){
            switch(i){
                case 0:
                    children[i].textContent = this.id;
                    children[i].classList.add('number');

                    break;
                case 1:
                    const img = document.createElement('img');
                    img.setAttribute('src', this.imageUrl);
                    children[i].classList.add('image');
                    children[i].appendChild(img);                    

                    break;
                case 2:
                    children[i].textContent = this.name;
                    children[i].classList.add('name');

                    break;
                case 3:
                    children[i].textContent = this.abv;
                    children[i].classList.add('abv')
                    
                    break;

                case 4:
                    const input = document.createElement('input');
                    input.setAttribute('type', 'checkbox');
                    children[i].appendChild(input);
                    children[i].classList.add('check');

                    break;


            }

        }

        tableBody.appendChild(parent);
    }
}

function createElement(tagName, elementClass){
    const newElement = document.createElement(tagName);

    newElement.classList.add(elementClass);
    return newElement;
}

function increasePageNumber(urlParameters, pageNumber){
    if(pageNumber > urlParameters['page']){
        urlParameters['page'] = pageNumber;
    }
}

function getData(url, urlParameters){
    url += urlParameters.page;

    return new Promise( (resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send();
        xhr.addEventListener("load", function() {

            if (xhr.status != 400){
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(new Error("Request failed: " + request.statusText));
            }
        });
    });
}

function renderLoadedData(){
    getData('https://api.punkapi.com/v2/beers?per_page=8&page=', urlParameters)
        .then(data =>{
                data.forEach((element)=>{
                    renderedElements.push(new listElement(element));
                });
            })
        .then(()=>{
            renderedElements.map(element=>{
                    element.render();
                })
            });
}

function loadMoreData(){

    increasePageNumber(urlParameters, urlParameters['page']++);
    getData('https://api.punkapi.com/v2/beers?per_page=8&page=', urlParameters)
        .then(
            data =>{
                data.forEach((element)=>{
                    renderedElements.push(new listElement(element));
                });
            })
        .then(
            ()=>{
                sort(sortingParameters.sorted);
            });
}

function sort(parameter, direction){
    if(parameter === 'name'){
        renderedElements.sort((a,b)=>{

            if(a.name < b.name) return -1;
        });

    } else {
        renderedElements.sort((a, b)=>{

            return a[parameter] - b[parameter];
        })
    }
    urlParameters.sorted = parameter;
    tableBody.innerHTML = null;    
    renderedElements.forEach((element)=>{
        element.render();
    })
}