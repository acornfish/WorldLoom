export function articleSaveRequest(project, name, mainText, sideText, image, description, replaceArticle) {
    const apiCall = new XMLHttpRequest();
    apiCall.open('POST', '/api/saveArticle');
    apiCall.setRequestHeader('Content-Type', 'application/json');
    return new Promise((resolve,reject) => {
        let timeout = setTimeout(reject, 5000); 
        apiCall.onload = function () {
            if (!apiCall.responseText.startsWith("Fail")) {
                console.log(apiCall.responseText);
                clearTimeout(timeout);
                resolve(apiCall.responseText ?? "");
            } else {
                console.error('Article save failed. Returned status of ' + apiCall.status);
                reject(apiCall.responseText)
            }
        };
        
        
        const data = {
            Project: project,
            Name: name,
            MainText: mainText,
            SideText: sideText,
            Image: image == "" ? "/resources/default.svg" : image,
            Description: description
        };
    
        if (typeof replaceArticle !== "undefined") {
            data.ReplaceArticle = replaceArticle
        }
        apiCall.send(JSON.stringify(data))
    })
}

export function removeArticle(project, name) {
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


export function retrieveArticle(project, name) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/api/retrieveArticle?Project=${project}&Name=${name}`, true);

        xhr.onload = () => {
            if (xhr.status === 200) {
                if (xhr.responseText.startsWith("Fail")) {
                    reject
                }
                const response = (xhr.responseText);
                if (typeof response === 'string' && response.startsWith('Fail:')) {
                    reject(new Error(response));
                } else {
                    resolve(JSON.parse(response));
                }
            } else {
                reject(new Error(`Fail: Returned status of ${xhr.status}`));
            }
        };

        xhr.onerror = () => {
            reject(new Error('Fail: '));
        };

        xhr.send();
    });
}

export default articleSaveRequest;