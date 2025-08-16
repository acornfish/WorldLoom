# Note
Due to dependencies license will be changing from MIT to GPL3 in this version and those coming afterward

Readability analysis tool requires you to select the target language in application settings. Selecting a language with mismatching alphabet causes it to overshoot significantly and selecting the wrong wordlist can cause it to undershoot

I am doing a rewrite and currently maps feature isn't available. And honestly I feel kind of lazy to do it and making a good scene editing system feels better right now so I might delay making the maps feature a bit more

Previous and buggy version is available in the old branch

# Prerequisites
-NodeJS (https://nodejs.org/en/download/package-manager) 

# Installation
 1. run `git clone https://github.com/ftkare/WorldLoom.git`
 2. Run the appropriate script file on the main folder (`start.sh` on linux and `start.bat` on windows)
 3. Follow the instructions on the script output
 4. if you want to update to current version just do `git pull`
# Features

## Articles
You can create articles which tell about your characters, areas, religions, species and so much more. Provided rich text editor allows adding tables, images, titles and links which can be used to reference other articles. 

![Alt text](README_assets/templates.png "")

![Alt text](README_assets/articles.png "")
## Maps

Map feature allows you to import images and mark areas using pins. It also allows you to put multiple image layers which can be toggled.


## Manuscripts
This feature assists you with the process of writing the story. You can use all features of articles and a few special ones such as searching and word checking.

![Alt text](README_assets/manuscripts.png "")

## Timelines
You can chronologicaly list events using the timelines feature.
![Alt text](README_assets/timelines1.png "")
![Alt text](README_assets/timelines2.png "")


# Exporting
You can export your project both in the json format (to be imported later) and 
HTML format to upload as a wiki website
![Alt text](README_assets/settings.png "")

# Credits

## Wordlists
English: [Edgar Dale](https://en.wikipedia.org/wiki/Edgar_Dale) / [Jeanne Chall](https://en.wikipedia.org/wiki/Jeanne_Chall)

English2: [Oxford Learner's Dictionaries](https://www.oxfordlearnersdictionaries.com/)

Russian: [Neri](https://www.blogger.com/profile/00782205209018274322)

Turkish: [3000mostcommonwords.com](https://3000mostcommonwords.com/)

# Troubleshooting

## Npm is not found

If you have installed nodejs via ...

Prebuilt installer, Package manager: Reinstall the application and if the issue persists try another method 

Prebuilt binary: Try adding the nodejs installation to the PATH envoriment variable 

Source code: Try another method

Please open a issue if you come across another problem. Thanks in advance.
