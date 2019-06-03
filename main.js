const tableBody = document.getElementById('beer-table');
const tableBodyModal = document.getElementById('beer-table-modal');
const getStartedButton = document.getElementById('get-started');
const loadMoreButton = document.getElementById('load-more');
const showSelectedButton = document.getElementById('show-selected');
const modalWindow =  document.getElementById('myModal');
const closeButton = document.getElementById('close');
const sortIdButton = document.getElementById('id-sort-button');
const sortAbvButton = document.getElementById('abv-sort-button');
const sortNameButton = document.getElementById('name-sort-button');
const urlParameters =  {
    'page': 1
};
const sortingParameters = {
    'sorted': 'id',
    'nameDirection': false,
    'abvDirection': false,
    'idDirection': true
};
const listElements = [];
const renderedElements = [];
const modalElements = [];


loadMoreButton.addEventListener('click', loadMoreData);
showSelectedButton.addEventListener('click', ()=> {
    modalWindow.style.display = 'block';
    document.body.style.overflow = 'hidden';
    renderModalTablet();
});
closeButton.addEventListener('click', () =>{
    modalWindow.style.display = 'none';
    document.body.style.overflow = 'visible';
});
sortIdButton.addEventListener('click', () => {
    sortingParameters['idDirection'] = !sortingParameters['idDirection'];
    sort('id', sortingParameters['idDirection'], renderedElements);
});
sortAbvButton.addEventListener('click', () => {
    sortingParameters['abvDirection'] = !sortingParameters['abvDirection'];
    sort('abv', sortingParameters['abvDirection'], renderedElements);
});
sortNameButton.addEventListener('click', () => {
    sortingParameters['nameDirection'] = !sortingParameters['nameDirection'];
    sort('name', sortingParameters['nameDirection'], renderedElements);
});
tableBody.addEventListener('click', createModal);
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
    renderInModal(){
        const parent = createElement('tr', 'data-row');
        const children = [];
        
        parent.setAttribute('id', this.id);

        for(let i = 0; i < 4; i++){
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
            }

        }

        tableBodyModal.appendChild(parent);
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
                    listElements.push(new listElement(element));
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
                    listElements.push(new listElement(element));
                });
            })
        .then(
            ()=>{
                sort(sortingParameters.sorted, sortingParameters[`${sortingParameters.sorted}Direction`], renderedElements);
            });
}

function sort(parameter, direction, list){
    switch (parameter) {
        case 'name':
            if(direction){
                list.sort((a,b)=>{        
                    if(a.name < b.name) return -1;
                });
            } else {
                list.sort((a,b)=>{
        
                    if(a.name > b.name) return -1;
                });
            }
            break;    
        case 'abv':
            if(direction){
                list.sort((a, b)=>{
        
                    return a[parameter] - b[parameter];
                });
            } else {
                list.sort((a, b)=>{
    
                    return b[parameter] - a[parameter];
                });
            }
            break;
        case 'id':
            if(direction){
                list.sort((a, b)=>{
        
                    return a[parameter] - b[parameter];
                });
            } else {
                list.sort((a, b)=>{
    
                    return b[parameter] - a[parameter];
                });
            }
            break;
    }
    sortingParameters.sorted = parameter;
    tableBody.innerHTML = null;
    modalElements.splice(0);
    list.forEach((element)=>{
        element.render();
    })
}

function createModal(event){
    const target = event.target;
    if(target.tagName != 'INPUT') return;
    if(target.checked === true){
        modalElements.push(listElements[target.closest('tr').id -1]);
    };
    if(target.checked === false){
        for(let i = 0; i < modalElements.length; i++){
            if(+target.closest('tr').id === modalElements[i].id){
                modalElements.splice(i,1);
            }
        }
    };
}

function renderModalTablet(){
    tableBodyModal.innerHTML = null;
    modalElements.forEach(element=>{
        element.renderInModal();
    })
}