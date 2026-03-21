export const LS_PROJECT_NAME = "CurrentProject" 



function sendRequest(method, endpoint, params) {
    console.log(endpoint, params)
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        let url = '/api/' + endpoint;
        if (method === 'GET' && params) {
            const query = Object.keys(params)
                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&');
            if (query) url += '?' + query;
        }
        xhr.open(method, url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject(xhr.responseText || xhr.statusText);
            }
        };
        xhr.onerror = () => reject('Network error');
        if (method === 'GET' || !params) {
            xhr.send();
        } else {
            xhr.send(JSON.stringify(params));
        }
    });
}

// Project Management
export function createProject(name, description) {
    return sendRequest('POST', 'CreateProject', { name, description });
}

export function save() {
    return sendRequest('POST', 'save');
}

export function getProjectList() {
    return sendRequest('GET', 'getProjectList');
}

export function exportProject(project) {
    window.open("/api/exportProject?project=" + project)
}

// Relation Management
export function fetchReferenceables(project, type) {
    if(type){
        return sendRequest('GET', 'fetchReferenceables', { project, type });
    }else{
        return sendRequest('GET', 'fetchReferenceables', { project});
    }
}

// Articles
export function fetchArticle(project, uid) {
    return sendRequest('GET', 'fetchArticle', { project, uid });
}

export function modifyArticle(project, operation, uid, data) {
    return sendRequest('POST', 'modifyArticle', { project, operation, data, uid });
}

export function setArticleTree(project, tree) {
    return sendRequest('POST', 'setArticleTree', { project, tree });
}

export function getArticleTree(project) {
    return sendRequest('GET', 'getArticleTree', { project });
}

// Template Management
export function getTemplateList(project) {
    return sendRequest('GET', 'getTemplateList', { project });
}

export function modifyTemplate(project, name, oldName, template) {
    return sendRequest('POST', 'modifyTemplate', { project, name, oldName, template });
}

export function exportTemplates(project) {
    return sendRequest('GET', 'exportTemplates', { project });
}

export function importTemplates(project, templates) {
    return sendRequest('POST', 'importTemplates', { project, templates });
}

export function getTemplate(project, name) {
    return sendRequest('GET', 'getTemplate', { project, name });
}

export function getNamegenList() {
    return sendRequest('GET', 'getNamegenList');
}

export function getNamegen(type, count) {
    return sendRequest('GET', 'getNamegen', { type, count });
}

// Manuscripts
export function getReadability(text, language = 'english') {
    return sendRequest('POST', 'getReadability', { text, language });
}

export function deleteScene(project, uid) {
    return sendRequest('GET', 'deleteScene', { project, uid });
}

export function setScene(project, uid, scene, synopsis, notes) {
    return sendRequest('POST', 'setScene', { project, uid, scene, synopsis, notes });
}

export function getScene(project, uid) {
    return sendRequest('GET', 'getScene', { project, uid });
}

export function setManuscriptTree(project, tree) {
    return sendRequest('POST', 'setManuscriptTree', { project, tree });
}

export function getManuscriptTree(project) {
    return sendRequest('GET', 'getManuscriptTree', { project });
}

// Maps
export function setMapData(project, uid, image, name, pins) {
    return sendRequest('POST', 'setMapData', { project, uid, image, name, pins });
}

export function retrieveMapData(project, uid) {
    return sendRequest('GET', 'retrieveMapData', { project, uid });
}

export function retrieveMapList(project) {
    return sendRequest('GET', 'retrieveMapList', { project });
}

// Timelines
export function retrieveTimeline(project) {
    return sendRequest('GET', 'retrieveTimeline', { project });
}

export function saveTimeline(project, data) {
    return sendRequest('POST', 'saveTimeline', { project, data });
}
