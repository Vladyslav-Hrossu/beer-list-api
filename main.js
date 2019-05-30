const tableBody = document.getElementById('beer-table');
const tableBodyModal = document.getElementById('beer-table-modal');
const getStartedButton = document.getElementById('get-started');
const loadMoreButton = document.getElementById('load-more');
const showSelectedButton = document.getElementById('show-selected');
const urlParameters =  {
    'page': 1,
}
const modalItems = [];
document.addEventListener('click',(event)=>{
    let target = event.target;
    if(target.tagName != 'INPUT') return;

    addElementToTheModal(target);
});
loadMoreButton.addEventListener('click', ()=>{
    increasePageNumber(urlParameters, urlParameters['page']+1);
    renderLoadedData();
});
function addElementToTheModal(target){
    let row = target.closest('tr').cloneNode(true);
    if(modalItems.length < 1) {
        modalItems.push(row.id);
        tableBodyModal.appendChild(row);
    } else {
        let status = false;
        modalItems.map((item)=>{
            if(item === row.id) status = true;
        })
    if(!status){
        modalItems.push(row.id);
        tableBodyModal.appendChild(row);
        }
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
function createCell(text, elementClass){
    const newCell = document.createElement('td');
    newCell.textContent = text;
    newCell.classList.add(elementClass);
    return newCell;
}
function createImage(url, elementClass){
    const newCell = document.createElement('td');
    const newImage = document.createElement('img');
    newImage.setAttribute('src', url);
    newImage.setAttribute('height', '75');
    newImage.setAttribute('width', '25');
    newCell.classList.add(elementClass);
    newCell.appendChild(newImage);
    return newCell;
}
function createRow(id){
    const newElement = document.createElement('tr');
    newElement.setAttribute('id', id);
    newElement.classList.add("text-center");
    return newElement;
}
function createCheckBox(elementClass){
    const newCell = document.createElement('td');
    const newCheckbox = document.createElement('input');
    newCheckbox.setAttribute('type', 'checkbox');
    newCheckbox.setAttribute('name', 'select');
    newCell.classList.add(elementClass);
    newCell.appendChild(newCheckbox);
    return newCell;
}
function increasePageNumber(urlParameters, pageNumber){
    if(pageNumber > urlParameters['page']){
        urlParameters['page'] = pageNumber;
    }
}

function renderLoadedData(){
    const elementList = [];
    getData('https://api.punkapi.com/v2/beers?per_page=8&page=', urlParameters)
        .then(
            data =>{
                data.forEach((element)=>{
                    elementList.push(element);
                });
            }
        )
        .then(
            ()=>{
        elementList.forEach((element)=>{
            let {id, name, abv, image_url} = element;
            let row = createRow(id);
            row.appendChild(createCell(id, 'number'));
            row.appendChild(createImage(image_url, 'icon'));
            row.appendChild(createCell(name, 'name'));
            row.appendChild(createCell(abv, 'abv'));
            row.appendChild(createCheckBox('check'));
            tableBody.appendChild(row);
        });
            })
}
renderLoadedData();