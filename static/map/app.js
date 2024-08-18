import '/global.js'
import '../libs/jquery.min.js'
import "../libs/quill.js"


$(".map-container").on("oncontextmenu", (e) => {
    return false;
})


var subTabs = ["Map", "Markers", "Layers", "Settings"]

var lastTabIndex = 0


$(".map-control-button").on("click", (e) => {
    //styling
    e.currentTarget.setAttribute("style", "filter: brightness(140%)")
    setTimeout((e) => {
        $(".map-control-button").css("filter", "")
        e.setAttribute("style", "filter: brightness(80%)")
    }, 100, e.currentTarget);

    //activate the selected tab
    let tabIndex = (subTabs.findIndex((x) => x == e.currentTarget.innerText))

    if(lastTabIndex == tabIndex) return;

    lastTabIndex = tabIndex;

    $(".sub-tab").removeClass("active-tab")
    $(`.sub-tab:nth(${tabIndex})`).addClass("active-tab")

    //activate the javascript for selected tab
    window.mapContainer.deactivate()
    window.markerListContainer.deactivate();
    switch(tabIndex){
        case 0:
            window.mapContainer.activate()
            break;
        case 1:
            window.markerListContainer.activate();
            break;
    }

})

function fetchMap(project, name) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `/api/retrieveMap?Project=${project}&Name=${name}`, true);
  
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
        this.isActive = false
        this.mapImage = $(".map-image");
        fetchMap(localStorage.getItem("CurrentProject"), localStorage.getItem("Map")).then((x) => {
            this.mapImage.attr("src", x["MapResource"])
        }).catch((e) => {
            console.error(e);
        })
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

        this.mapImage.parent().on('wheel', (event) => {
            if (!this.isActive) return;
            if (event.originalEvent.deltaY > 0) {
                this.zoomOut();
            } else {
                this.zoomIn();
            }
        });

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
        setInterval(() => {console.log(this.MapObject)}, 1000)
        this.mapImage.parent().on('mousemove', (e) => {
            if (!this.isActive) return;
            if (e.button == 0 && (!this.CurrentlyDragged) && this.MapObject.currentlyDragged) {
                if (!this.MapObject.currentlyDragged) return;


                const dx = e.pageX - this.MapObject.startOffset.x;
                const dy = e.pageY - this.MapObject.startOffset.y;
        
                const dragDistance = Math.hypot(dx, dy);

                if(dragDistance < 15) return;
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
        if(!this.isActive) return;
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
            requestAnimationFrame( this.onDragMove.bind(this) )
        } );
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
    fetchMarkers(){
        // Not to be confused with markerListContainer.fetchMarkers()
        let container = $(".inner-map-container") 
        let rect = container.get(0).getBoundingClientRect()
        let positions = []
        $(".pin").each((ind,e) => {
            let pin = $(`.pin[num=${ind}]`)
            positions.push({
                length: (pin.attr("left")),
                latitude: (pin.attr("top")),
                title: pin.attr("title"),
                type: pin.attr("type")
            })
        })
        return positions
    }

    updateMarkers(){
        // Not to be confused with markerListContainer.updateMarkers()
        let markers = JSON.parse(window.markerListContainer.fetchMarkers())
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
            pin.setAttribute("style", `
                top: ${parseInt(marker["latitude"])}px;
                left: ${parseInt(marker["length"])}px;
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


    deactivate() {
        this.isActive = false
    }

    activate(){
        this.isActive = true;
        this.updateMarkers()
    }
}

class MarkerListContainer{
    constructor(){
        this.isActive = false
    }

    fetchMarkers(){
        let markers = $(".inner-markers-container input")
        let markersSerialized = []
        markers.each((ind,marker) => {
            marker = $(marker)
            if(ind % 4 == 0) markersSerialized.push({
                title: "",
                length: "",
                latitude: "",
                type: ""
            })
            markersSerialized[parseInt(ind / 4)][marker.attr("name")] = marker.val()
        })
        return (JSON.stringify(markersSerialized))
    }

    updateMarkers(){
        let markers = window.mapContainer.fetchMarkers()

        let container = $(".inner-markers-container tbody")
        let i = 0
        container.empty()
        for(let marker of markers){
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

    saveMarkers(){
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
              MapName: localStorage.getItem("Map"),
              Pins: data,
            }));
          });
    }

    deactivate(){
        this.isActive = false
    }

    activate(){
        this.isActive = true
        this.updateMarkers()
    }
}

class SettingsContainer{
    constructor(){
        this.isActive = false        

        const quillLinkHandler = (value) => {
            if (value) {
                const href = prompt('Enter the article name: ');
                this.quill.format('link', "/Articles/" + href);
            } else {
                this.quill.format('link', false);
            }
        }
        
        this.quill = new Quill('#editor', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{
                        'header': [1, 2, false]
                    }],
                    ['bold', 'italic', 'underline'],
                    [{
                        'link': quillLinkHandler
                    },'image'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }], 
        
                ]
            }
        });
    }

    save(){
        window.markerListContainer.saveMarkers();
    
        let title = $(".title-input").val() 
        
        let description = (this.quill.getContents())


    }

    activate(){
        this.isActive = true
    }

    deactivate(){
        this.isActive = false
    }

}

window.mapContainer = new MapContainer()
window.markerListContainer = new MarkerListContainer()
window.settingsContainer = new SettingsContainer()


setTimeout((e) => {
    $(".map-control-button").css("filter", "")
    e.setAttribute("style", "filter: brightness(80%)")
}, 100, document.querySelector(".map-control-button"))

$(`.sub-tab:nth(0)`).addClass("active-tab")

window.mapContainer.activate()


