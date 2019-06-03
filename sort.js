function sort(parameter){
    if(parameter === 'name'){
        renderedElements.sort((a,b)=>{
            if(a.name < b.name) return -1;
        });
    } else {
    renderedElements.sort((a, b)=>{

            return a[parameter] - b[parameter];
        })
    }
    tableBody.innerHTML = null;    
    renderedElements.forEach((element)=>{
        element.render();
    })
}