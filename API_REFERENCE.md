# API Reference

## Project Management
### POST | CreateProject
    Name : String
    Description : String

### POST | save
    No Arguments

### GET | getProjectList
    No Arguments

### GET | exportProject
    project : String

## Relation Management
### GET | fetchReferenceables
    project : String
    type : String

## Articles
### GET | fetchArticle
    project : String
    uid: String

### POST | modifyArticle
    project : String
    operation : String ["create", "modify", "delete", "imageUpdate"]
    data : ArticleData{}
    uid : String

### POST | setArticleTree 
    project : String
    tree : JSTreeObject

### GET | getArticleTree 
    project : String
    
## Template Management
### GET | getTemplateList
    project : String

### POST | modifyTemplate 
    project : String
    name : String
    oldName : String
    template : TemplateObject {}

### GET | exportTemplates 
    project : String

### POST | importTemplates 
    project : String
    templates : Array[TemplateObject]

### GET | getTemplate
    project : String
    name : String

### GET | getNamegenList
    No Arguments

### GET | getNamegen 
    type : String
    count : int

## Manuscripts
### POST | getReadability
    text : String
    language: String [Default: english]

### GET | deleteScene
    project : String
    uid : String

### POST | setScene
    project : String
    uid : String 
    scene : String
    synopsis : String
    notes : String

### GET | getScene
    project : String
    uid : String

### POST | setManuscriptTree 
    project : String
    tree : JSTreeObject

### GET | getManuscriptTree 
    project : String
    

## Maps 
### POST | setMapData
    project : String
    uid : String
    image : String
    name : String
    pins : Array[Pin]

### GET | retrieveMapData
    project : String
    uid : String

### GET | retrieveMapList 
    project : String

## Timelines
### GET | retrieveTimeline
    project : String

### POST | saveTimeline
    project : String
    data : TimelineData{}


## File Upload
### POST | filepond/upload 
    [Let filepond handle this]

### POST | filepond/load 
    [Let filepond handle this]
    
### DELETE | filepond/remove
    [Let filepond handle this]