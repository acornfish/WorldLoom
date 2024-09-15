import '/global.js'
import '../libs/jquery.min.js'
import "../libs/quill.js"

const urlParams = new URLSearchParams(window.location.search);

const hiddenCanvas = document.getElementById("hiddenCanvas")

var mapData = {
    Project: localStorage.getItem("CurrentProject"),
    Name: sessionStorage.getItem("Map"),
    Description: '{"ops":[{"insert":"\\n"}]}',
    Pins: [],
    ReplaceName: undefined,
    Layers: []
}

window.md = () => (mapData);

var subTabs = ["Map", "Markers", "Layers", "Settings"]

var lastTabIndex = 0

async function renderMapFromLayers(layers) {
    const ctx = hiddenCanvas.getContext('2d');

    layers.sort((a, b) => {
        parseInt(a["order"]) - parseInt(b["order"])
    });

    //resize the canvas to the size of the largest layer. height and width are handled seperately
    if (layers.length) {
        let highestWidth = 0;
        let highestHeight = 0;

        for (const layer of layers) {
            let img = new Image();
            img.src = layer["image"];
            await new Promise((resolve, reject) => {
                img.onload = () => {
                    highestWidth = img.width > highestWidth ? img.width : highestWidth;
                    highestHeight = img.height > highestHeight ? img.height : highestHeight;
                    resolve();
                }
                img.onerror = reject;
            })
        }

        hiddenCanvas.width = highestWidth;
        hiddenCanvas.height = highestHeight;
    }

    //draw layers to a hidden canvas in order
    for (const layer of layers) {
        await new Promise((resolve, reject) => {
            if (parseInt(layer["order"]) < 0) {
                return;
            }
            const image = new Image();
            image.src = layer["image"];
            image.onload = () => {
                ctx.drawImage(image, 0, 0);
                resolve()
            }

            image.onerror = reject;
        });
    }

    //set map image to contents of the canvas
    const dataUrl = hiddenCanvas.toDataURL();
    const outputImage = document.getElementsByClassName('map-image')[0];
    outputImage.src = dataUrl;
}

function updateMap() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/updateMap");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = function () {
            if (xhr.status === 200) {
                resolve();
            } else {
                reject(new Error("Error updating map: " + xhr.responseText));
            }
        };

        xhr.send(JSON.stringify(mapData));
    });
}

function fetchMap(project, name) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/api/retrieveMap?Project=${project}&Name=${name}`, false);

        xhr.onload = function () {
            if (this.status === 200) {
                try {
                    const response = (this.responseText);
                    if (typeof response === 'string' && response.startsWith('Fail:')) {
                        reject(response);
                    } else {
                        resolve(JSON.parse(this.responseText));
                    }
                } catch (error) {
                    reject(error);
                }
            } else {
                reject(`Error: Status ${this.status}`);
            }
        };

        xhr.onerror = function () {
            reject('Network Error');
        };

        xhr.send();
    });
}

class MapContainer {
    constructor() {
        // variable initalization, mostly for intellisense
        this.isActive = false
        this.mapImage = $(".map-image");
        this.zoomLevel = 1;
        this.minZoom = 0.3;
        this.maxZoom = 3;
        this.MapObject = {
            left: 0,
            top: 0,
            offsetX: 0,
            offsetY: 0,
            startOffset: {
                x: 0,
                y: 0
            },
            currentlyDragged: false,
            timer: null
        }


        $(document).on("mousedown", this.onDragStart.bind(this))

        //Map zoom
        this.mapImage.parent().on('wheel', (event) => {
            if (!this.isActive) return;
            if (event.originalEvent.deltaY > 0) {
                this.zoomOut();
            } else {
                this.zoomIn();
            }
        });

        //Map dragging
        this.mapImage.parent().on('mousedown', (e) => {
            if (!this.isActive) return;
            if (e.button == 0 && (!this.CurrentlyDragged)) {
                this.MapObject.left = parseInt(this.mapImage.parent().css("left"))
                this.MapObject.top = parseInt(this.mapImage.parent().css("top"))
                this.MapObject.startOffset.x = e.pageX;
                this.MapObject.startOffset.y = e.pageY;
                this.MapObject.currentlyDragged = true
            }
        })
        this.mapImage.parent().on('mousemove', (e) => {
            if (!this.isActive) return;
            if (e.button == 0 && (!this.CurrentlyDragged) && this.MapObject.currentlyDragged) {
                if (!this.MapObject.currentlyDragged) return;


                const dx = e.pageX - this.MapObject.startOffset.x;
                const dy = e.pageY - this.MapObject.startOffset.y;

                const dragDistance = Math.hypot(dx, dy);

                if (dragDistance < 15) return;
                this.MapObject.offsetX = e.pageX - this.MapObject.startOffset.x
                this.MapObject.offsetY = e.pageY - this.MapObject.startOffset.y
                this.mapImage.parent().css("left", this.MapObject.left + this.MapObject.offsetX)
                this.mapImage.parent().css("top", this.MapObject.top + this.MapObject.offsetY)
                if (this.timer == null) {
                    this.timer = setTimeout(() => {
                        this.MapObject.currentlyDragged = false
                    }, 500)
                } else {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        this.MapObject.currentlyDragged = false
                    }, 500)
                }
            }
        })

        this.mapImage.parent().on('mouseup', (e) => {
            if (!this.isActive) return;
            if (e.button == 0 && this.MapObject.currentlyDragged) {
                this.mapImage.parent().css("left", this.MapObject.left + this.MapObject.offsetX)
                this.mapImage.parent().css("top", this.MapObject.top + this.MapObject.offsetY)
                this.MapObject.offsetX = 0
                this.MapObject.offsetY = 0
                clearTimeout(this.timer)
            }
            this.MapObject.currentlyDragged = false
        })

    }

    onDragStart(e) {
        //for dragging pins
        if (!this.isActive) return;
        e.preventDefault();
        e.stopPropagation();
        if (e.button == 2) {
            let innerMapContainer = $(".inner-map-container")
            innerMapContainer.append(`
                <img class="draggable pin" num="${$(".draggable").length}" src="Pin_Icon.svg" alt="Pin">
                `)

            let pin = $(`.draggable[num=${$(".draggable").length-1}]`)
            let innerMapContainerRect = innerMapContainer.get(0).getBoundingClientRect();

            let relativePinPosition = {
                left: (e.pageX - innerMapContainerRect.left) / this.zoomLevel,
                top: (e.pageY - innerMapContainerRect.top) / this.zoomLevel
            }

            let pagePinPosition = {
                left: e.pageX,
                top: e.pageY
            }

            pin.css(relativePinPosition)
            pin.attr(pagePinPosition)

            $(".draggable").on("mousedown", this.onDragStart.bind(this))
            return;

        } else {
            if (e.target.classList.contains("draggable")) this.CurrentlyDragged = e.target
        }
        $(document).on('mousemove', (e) => {
            this.e = e;
            requestAnimationFrame(this.onDragMove.bind(this))
        });
        $(document).on('mouseup', this.onDragEnd.bind(this));

    }


    onDragMove(e) {
        if (!this.isActive) return;
        if (this.CurrentlyDragged == null) return;
        this.e.stopPropagation()

        let innerMapContainerRect = $(".inner-map-container").get(0).getBoundingClientRect();


        $(this.CurrentlyDragged).attr({
            left: this.e.pageX,
            top: this.e.pageY
        })

        let relativePinPosition = {
            left: (this.e.pageX - innerMapContainerRect.left) / (this.zoomLevel),
            top: (this.e.pageY - innerMapContainerRect.top) / this.zoomLevel
        }

        $(this.CurrentlyDragged).css(relativePinPosition)

    }

    onDragEnd(e) {
        if (!this.isActive) return;
        e.stopPropagation()
        this.CurrentlyDragged = null;
    }

    zoomIn() {
        if (this.zoomLevel < this.maxZoom) {
            this.zoomLevel += 0.1;
            this.mapImage.parent().css(`transform`, `scale(${this.zoomLevel})`);
        }
    }

    zoomOut() {
        if (this.zoomLevel > this.minZoom) {
            this.zoomLevel -= 0.1;
            this.mapImage.parent().css(`transform`, `scale(${this.zoomLevel})`);
        }
    }
    fetchMarkers() {
        // Not to be confused with markerListContainer.fetchMarkers()
        let container = $(".inner-map-container")
        let rect = container.get(0).getBoundingClientRect()
        let positions = []
        $(".pin").each((ind, e) => {
            let pin = $(e)
            let pos = this.calculateRelativePosition(pin)
            console.log(pos);
            positions.push({
                title: pin.attr("title"),
                length: (pos.relativeLeft).toString(),
                latitude: (pos.relativeTop).toString(),
                type: pin.attr("type")
            })
        })
        return positions;
    }

    updateMarkers() {
        // Not to be confused with markerListContainer.updateMarkers()
        let markers = mapData["Pins"]
        let container = $(".inner-map-container")
        let rect = container.get(0).getBoundingClientRect()
        let index = 0

        $(".pin").remove()
        markers.forEach(marker => {
            let pin = new Image()
            pin.src = "./Pin_Icon.svg"
            pin.classList = [
                "draggable pin"
            ]

            console.log(parseInt(marker["latitude"]))

            let absolutePosition = this.restoreAbsolutePosition({
                relativeLeft: parseInt(marker["length"]),
                relativeTop: parseInt(marker["latitude"])
            })
            console.log(markers)
            pin.setAttribute("style", `
                top: ${absolutePosition.latitude}px;
                left: ${absolutePosition.length}px;
            `)
            $(pin).attr({
                left: marker["length"],
                top: marker["latitude"],
                title: marker["title"],
                type: marker["type"]
            })
            pin.setAttribute("num", index)

            container.append(pin)
            index++;
        });
    }

    calculateRelativePosition(pin) {
        //calculates relative position of a pin
        const scale = this.zoomLevel;
        const pinRect = pin.get(0).getBoundingClientRect();
        const mapRect = pin.parent().get(0).getBoundingClientRect();
        const relativeLeft = Math.round((pinRect.left - mapRect.left) / scale);
        const relativeTop = Math.round((pinRect.top - mapRect.top) / scale);
        return {relativeLeft, relativeTop};
    }

    restoreAbsolutePosition(pos) {
        //no longer useful. just here for convenience
        const relativeLeft = pos.relativeLeft;
        const relativeTop = pos.relativeTop;

        return {
            length: relativeLeft,
            latitude: relativeTop
        }
    }

    deactivate() {
        this.isActive = false
        mapData["Pins"] = this.fetchMarkers();
    }

    activate() {
        this.isActive = true;
        renderMapFromLayers(mapData["Layers"])
        this.updateMarkers()
    }
}

class MarkerListContainer {
    constructor() {
        this.isActive = false
    }

    fetchMarkers() {
        let markers = $(".inner-markers-container input")
        let markersSerialized = []
        markers.each((ind, marker) => {
            marker = $(marker)
            if (ind % 4 == 0) markersSerialized.push({
                title: "",
                length: "",
                latitude: "",
                type: ""
            })
            markersSerialized[parseInt(ind / 4)][marker.attr("name")] = marker.val()
        })
        return ((markersSerialized))
    }

    updateMarkers(init) {
        let markers = mapData["Pins"]
        let container = $(".inner-markers-container tbody")
        let i = 0
        container.empty()
        for (let marker of markers) {
            let element = $(`
                <tr num="${i}" >
                  <td><input type="text" name="title"></td>
                  <td><input type="text" name="length"></td>
                  <td><input type="text" name="latitude"></td>
                  <td><input type="text" name="type"></td>
                </tr>     
            `)

            container.append(element)

            element.children().children().get(0).value = (marker["title"]) ?? ""
            element.children().children().get(1).value = (marker["length"])
            element.children().children().get(2).value = (marker["latitude"])
            element.children().children().get(3).value = (marker["type"]) ?? ""
        }
    }

    saveMarkers() {
        //save function in settings mainly handles the pins. This is only for if pins need to be set seperately
        let data = this.fetchMarkers()

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/setPins', true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onload = function () {
                if (this.status === 200) {
                    const response = (this.responseText);
                    if (response === 'Sucess') {
                        resolve('Pins updated successfully');
                    } else {
                        reject(response);
                    }
                } else {
                    reject(`Error: Status ${this.status}`);
                }
            };

            xhr.onerror = function () {
                reject('Network Error');
            };

            xhr.send(JSON.stringify({
                Project: localStorage.getItem("CurrentProject"),
                MapName: sessionStorage.getItem("Map"),
                Pins: data,
            }));
            mapData["Pins"] = data;
        });
    }

    deactivate() {
        this.isActive = false
        mapData["Pins"] = this.fetchMarkers();
    }

    activate() {
        this.isActive = true
        this.updateMarkers()
    }
}

class SettingsContainer {
    constructor() {
        this.isActive = false

        const quillLinkHandler = (value) => {
            if (value) {
                var href = prompt('Name:');
                if (href.startsWith("manuscript:")){
                    this.quill.format('link', `/index.html?ref=${encodeURIComponent(href.split(':')[1])}&type=manuscript`);
                } else if (href.startsWith("map:")){
                    this.quill.format('link', `/index.html?ref=${encodeURIComponent((href.split(':')[1]))}&type=map`);
                } else {
                    this.quill.format('link', `/index.html?ref=${encodeURIComponent((href.split(':')[1]))}&type=article`);
                } 
            } else {
                this.quill.format('link', false);
            }   
        
        }
        $(".title-input").val(mapData["Name"]);

        this.quill = new Quill('#editor', {
            theme: 'snow',
            modules: {
                toolbar: {
                    container: [
                        [{
                            'header': [1, 2, false]
                        }],
                        ['bold', 'italic', 'underline'],
                        ["link", 'image'],
                        [{
                            'list': 'ordered'
                        }, {
                            'list': 'bullet'
                        }]
                    ],
                    handlers: {
                        link: function (value) {
                            if (value) {
                                var href = prompt('Name:');
                                if (!href.startsWith("manuscript:")) {
                                    this.quill.format('link', `Articles/${href}`);
                                } else {
                                    this.quill.format('link', `Manuscripts/${href}`);
                                }
                            } else {
                                this.quill.format('link', false);
                            }

                        },
                    }
                }
            },

        });



        this.quill.setContents(JSON.parse(mapData["Description"]))

        $("#save-map").on("click", this.save.bind(this));
    }

    save() {
        if ($(".title-input").val() == "") {
            showToast("Title can not be empty", "warning", 2000)
            $(".title-input").val(mapData["Name"])
            return
        }

        if (lastTabIndex == 0) {
            window.markerListContainer.updateMarkers();
        }

        mapData["Layers"] = window.layersContainer.fetchLayers()
        if (mapData["Name"] != null) {
            mapData["ReplaceName"] = sessionStorage.getItem("Map")
        }

        mapData["Name"] = $(".title-input").val();
        mapData["Description"] = JSON.stringify(this.quill.getContents())
        console.log(mapData);
        updateMap().then(() => {
            sessionStorage.setItem("Map", mapData["Name"])
            window.markerListContainer.saveMarkers();
            window.showToast("Saved successfuly", "success", 2000)

            if (urlParams.get("new") == "1") {
                window.location = "/map"
            }
        }).catch((e) => {
            window.showToast(e, "danger", 4000)

        })
    }

    activate() {
        this.isActive = true
    }

    deactivate() {
        this.isActive = false
    }

}

class LayersContainer {
    constructor() {
        this.isActive = false;

    }

    addNewLayer() {
        let container = $(".inner-layers-container tbody")
        $.get(`/temps/image-selector.html`, ((imageSelectorHTML) => {
            let element = $(`
                <tr>
                    <td><input type="text" name="title"></td>
                    <td><div class="o-image-selector"></div></td>
                    <td><input type="text" name="order"></td>
                    <td onclick="window.layersContainer.deleteLayer(this)"><i class="fa-solid fa-trash-can"></i></td>
                </tr>     
            `);

            container.append(element);
            element.find("input[type='text']").eq(1).val(0)
            element.find(".o-image-selector").append(imageSelectorHTML);
            mapData["Layers"] = this.fetchLayers();
        }).bind(this))
    }

    deleteLayer(t) {
        t.parentElement.remove()
        mapData["Layers"] = this.fetchLayers()
    }

    fetchLayers() {
        const layerData = [];

        $(".inner-layers-container tbody tr").each(function () {
            const title = $(this).find("input[name='title']").val();
            const order = $(this).find("input[name='order']").val();
            const image = $(this).find(".o-image-selector .image-selector-button").css("background-image");
            const imageUrl = image.slice(5, -2);

            layerData.push({
                title,
                order,
                image: imageUrl.slice(window.location.origin.length)
            });
        });

        return layerData;
    }

    updateLayers() {
        let layers = mapData["Layers"]
        let container = $(".inner-layers-container tbody")
        container.empty()
        let i = 0
        $.get(`/temps/image-selector.html`, function (imageSelectorHTML) {
            for (let layer of layers) {
                i++;
                let element = $(`
                    <tr num="${i}" >
                        <td><input type="text" name="title"></td>
                        <td><div class="o-image-selector"></div></td>
                        <td><input type="text" name="order"></td>
                        <td onclick="window.layersContainer.deleteLayer(this)"><i class="fa-solid fa-trash-can"></i></td>
                    </tr>     
                `);

                container.append(element);
                element.css("display", "none")

                $(`tr[num=${i}] .o-image-selector`).append(imageSelectorHTML);
                element.children().children().get(0).value = (layer["title"]) ?? "";
                element.children().children().get(2).value = (layer["order"]) ?? 0;
                if (!((layer["image"] ?? "") == "")) {
                    element.children().children().get(1)
                        .getElementsByClassName("image-selector-button")[0].setAttribute("style",
                            `background-image: url(${layer["image"]??""})`)
                }
            }
            container.children().fadeIn(100)
        })
    }

    activate() {
        this.isActive = true;
        this.updateLayers()
    }

    deactivate() {
        this.isActive = false;
        mapData["Layers"] = this.fetchLayers();
    }
}

if (urlParams.get("new") == null) {
    fetchMap(localStorage.getItem("CurrentProject"), sessionStorage.getItem("Map")).then((x) => {
        mapData = x;
        mapData["Project"] = localStorage.getItem("CurrentProject");
    }).catch((e) => {
        console.error(e);
    })
}



$(() => {
    window.mapContainer = new MapContainer()
    window.markerListContainer = new MarkerListContainer()
    window.settingsContainer = new SettingsContainer()
    window.layersContainer = new LayersContainer()

    if (urlParams.get("new") == 1) {
        setTimeout((e) => {
            $(".map-control-button").css("filter", "")
            e.setAttribute("style", "filter: brightness(80%)")
        }, 100, document.querySelector(".map-control-button:nth-of-type(4)"))
        $(`.sub-tab:nth-of-type(4)`).addClass("active-tab")
        lastTabIndex = 3;
        window.settingsContainer.activate()
    } else {
        setTimeout((e) => {
            $(".map-control-button").css("filter", "")
            e.setAttribute("style", "filter: brightness(80%)")
        }, 100, document.querySelector(".map-control-button"))
        $(`.sub-tab:eq(0)`).addClass("active-tab")
        window.mapContainer.activate()
    }


    window.markerListContainer.updateMarkers(true);
    window.mapContainer.updateMarkers()
    window.layersContainer.updateLayers()
    renderMapFromLayers(mapData["Layers"])
})

$(".map-control-button").on("click", (e) => {
    //styling
    e.currentTarget.setAttribute("style", "filter: brightness(140%)")
    setTimeout((e) => {
        $(".map-control-button").css("filter", "")
        e.setAttribute("style", "filter: brightness(80%)")
    }, 100, e.currentTarget);

    //activate the selected tab
    let tabIndex = (subTabs.findIndex((x) => x == e.currentTarget.innerText))

    if (lastTabIndex == tabIndex) return;

    //deactivate javascript for last tab
    switch (lastTabIndex) {
        case 0:
            window.mapContainer.deactivate()
            break;
        case 1:
            window.markerListContainer.deactivate();
            break;
        case 2:
            window.layersContainer.deactivate()
            break
        case 3:
            window.settingsContainer.deactivate()
            break;
    }

    //activate the javascript for selected tab
    switch (tabIndex) {
        case 0:
            window.mapContainer.activate()
            break;
        case 1:
            window.markerListContainer.activate();
            break;
        case 2:
            window.layersContainer.activate()
            break
        case 3:
            window.settingsContainer.activate()
            break;
    }
    $(".sub-tab").removeClass("active-tab")
    $(`.sub-tab:nth(${tabIndex})`).addClass("active-tab")

    lastTabIndex = tabIndex;
})