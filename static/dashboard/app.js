import '/global.js'

function openEditor(x){
    let title = (x).getElementsByTagName("h2")[0].innerText;
    setArticle(title);
    window.location = "/editor"
}

function createArticle(){
    localStorage.removeItem("MainText")
    localStorage.removeItem("Settings")
    localStorage.removeItem("SideSections")
    localStorage.removeItem("Article")
    localStorage.removeItem("description")
    setArticle("")
    window.location = "/editor?new=1"
}
function GetArticles(){
    if(localStorage.getItem("CurrentProject") == null){
        return new Promise((r,reject) => reject());
    }
    
    const apiCall = new XMLHttpRequest()
    apiCall.open("GET", "/api/retrieveArticles?Project=" + localStorage.getItem("CurrentProject"))
    
    let Articles = new Promise((resolve,reject) => {
        apiCall.onload = (x) => {
            if (apiCall.status === 200) {
                if((apiCall.responseText).startsWith("Fail")){
                    console.log("Failed to retrieve articles. Reason: \n" + apiCall.responseText)
                    reject(apiCall.responseText)
                }else{
                    resolve(JSON.parse(apiCall.responseText))
                }
            }
        }
        apiCall.send()
    })
    
    return Articles
}
function removeArticle(project, name) {
    $.ajax({
      url: '/api/removeArticle',
      type: 'GET',
      data: {
        Project: project,
        Name: name
      },
      success: function(response) {
        console.log(response); 
      },
      error: function(xhr, status, error) {
        console.error(error); 
   error
      }
    });
  }
  

const cards = document.getElementsByClassName("card")
for(let i=0;i<cards.length;i++){
    cards[i].setAttribute("onclick", "openEditor(this)");
}

function setArticle(article){
    localStorage.setItem("Article", article)
}

var articles = GetArticles()

articles.then((articleList) => {
    let cards = $(".cards") 
    articleList.forEach(article => {
        console.log(article)
        cards.html(`
            <div class="card" onclick="openEditor(this)">
            <div class="remove-article"><i class="fa-solid fa-trash-can"></i></div>
            <div class="card-title"><h2>${article["Name"]}</h2></div>
            <img src="${article["image"]}" alt="">
            <div class="card-text"><p>${article["Description"]}</p></div>
            </div>
        
        ` + cards.html()) 
    })
})

$(".card-title h2").each((key,element) => {
    if(element.scrollWidth > element.clientWidth){
        element.parentElement.setAttribute("class", "card-title tooltip-target");
        element.parentElement.innerHTML += ` 
                    <div class="tooltip">
                        <div class="tooltip-text">${element.innerHTML}</div>
                    </div>
        `
    }
})
$(".tooltip").each((key,element) => {
    element.scrollTo(element.scrollWidth,0);
})


window.WaitForElm(".remove-article").then(x => {
    $(".remove-article").on("click", (e) => {
        e.stopPropagation();
        let title = (e).currentTarget.parentElement.getElementsByTagName("h2")[0].innerText;
        if(window.shiftKeyDown || confirm("Are you sure that you want to delete the article " + title + "?")){
            removeArticle(localStorage.getItem("CurrentProject"), title)
            setTimeout((e) => (e).currentTarget.parentElement.remove(),100,e);
            return;
        }

    })    
});
["MainText", "Settings", "SideSections" , "Article" , "description" , "Map"].forEach(x => {
    localStorage.removeItem(x);
})
//exports
window.openEditor = openEditor;
window.createArticle = createArticle;
window.removeArticle = removeArticle;

setInterval(() => {    console.log(window.shiftKeyDown) }, 1000)
