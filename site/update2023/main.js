var scheduleData = null;
var scheduleEvents1 = [];
var scheduleEvents2 = [];
var overlay;

window.addEventListener("load", function(event) {
    getScheduleContent()
    getPartnersContent()
    showSlides(0);
    v1 = getRandomIntInclusive(0, window.innerHeight / 2)
    v2 = getRandomIntInclusive(window.innerHeight / 2, window.innerHeight)
    Array(2).fill(0).map((_, i) => {

        let triangle_div = document.createElement("div");
        triangle_div.className = "triangle"
        triangle_div.style.top = `${getRandomIntInclusive(0, window.innerHeight)}px`;
        //  this.document.body.appendChild(triangle_div)


    });


});

function getPartnersContent() {
    fetch('./partner.json')
        .then(response => response.json())
        .then(data => {
            for (p of data.partners) {
                let node_main = document.getElementById(`partners_and_sponsers_images_${str(p.Rank).toLowerCase() }`)

                let div = document.createElement("div")
                div.className = `${p.Rank} animatedGlow grid-item`
                fetchAndSetBackgroundImage(p.IMG, div)
                div.addEventListener('mouseover', (event) => {
                    console.log("Fireworks of type " + p.Rank + " for " + p.Name)
                });
                div.setAttribute('url', `${p.url}`)
                div.addEventListener('click', (event) => {
                    window.location.href = div.getAttribute('url')
                });
                node_main.append(div)
            }

        })
}

function changeFocusPartner(target) {
    document.getElementById('partner-and-sponsors-GOLD').style.display = 'none'
    document.getElementById('partner-and-sponsors-SILVER').style.display = 'none'
    document.getElementById('partner-and-sponsors-BRONZE').style.display = 'none'

    document.querySelectorAll(".podium-switch div").forEach((element, index) => {
        element.className = ""
    })

    target.style.display = 'grid'
    event.target.className = "box"


}

function getScheduleContent() {
    scheduleEvents1 = []
    scheduleEvents2 = []
    fetch('./schedule.json')
        .then(response => response.json())
        .then(data => {
            scheduleData = data;
            let node_main = document.getElementById("schedule-day-content")
            for (e of scheduleData.Day1) {
                let event = new Event(node_main)
                event.setTime(e.Time)
                event.setTalk(e.Talk)
                event.setLocation(e.Location)
                event.setKnowMore(e.AboutIt)
                event.setAvatar(e.Avatar)

                event.bind()
                event.display()
                scheduleEvents1.push(event)
            }
            for (e of scheduleData.Day2) {
                let event = new Event(node_main)
                event.setTime(e.Time)
                event.setTalk(e.Talk)
                event.setLocation(e.Location)
                event.setKnowMore(e.AboutIt)
                event.setAvatar(e.Avatar)

                event.bind()
                scheduleEvents2.push(event)

            }
        });
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function showScheduleDay(n) {
    if (scheduleData == null) {
        getScheduleContent()
    } else {

        if (n === 1) {
            document.getElementById("day1").classList.add("selected")
            document.getElementById("day2").classList.remove("selected")

            console.log("displaying schedule 1")
            for (e of scheduleEvents1) {
                e.display()
            }
            for (e of scheduleEvents2) {
                e.hide()
            }


        } else if (n === 2) {
            document.getElementById("day2").classList.add("selected")
            document.getElementById("day1").classList.remove("selected")

            console.log("displaying schedule 2")
            for (e of scheduleEvents1) {
                e.hide()
            }
            for (e of scheduleEvents2) {
                e.display()


            }
        }

    }
}

class Event {
    constructor(node_main) {
        this.content = document.createElement("div")
        this.avatar = document.createElement("div")
        this.talk = document.createElement("div")
        this.time_location = document.createElement("div")
        this.time = document.createElement("div")
        this.location = document.createElement("div")
        this.know_more = document.createElement("div")

        this.content.className = "content"
        this.avatar.className = "avatar"
        this.talk.className = "talk"
        this.time_location.className = "time-location"
        this.time.className = "time"
        this.location.className = "location"
        this.know_more.className = "know-more"
        this.node_main = node_main

        this.know_more.innerText = "ABOUT IT"
        this.know_more.setAttribute("data-toggle", "modal")
        this.know_more.setAttribute("data-target", "#exampleModalCenter")

        this.know_more.addEventListener("click", () => {


            document.getElementById("modal-title").innerText = `What this talk is about 🎯`
            document.getElementById("modal-content").innerText = `${this.content_know_more}`


        })
    }
    setAvatar(content) {
        fetchAndSetBackgroundImage(content, this.avatar)

    }
    setTalk(content) {
        this.talk.innerHTML = content
    }
    setTime(content) {
        this.time.innerHTML = content

    }
    setLocation(content) {
        this.location.innerHTML = content

    }
    setKnowMore(content) {

        this.content_know_more = content
    }
    bind() {
        this.time_location.appendChild(this.time).appendChild(this.location)
        this.content.appendChild(this.avatar)
        this.content.appendChild(this.talk)
        this.content.appendChild(this.time_location)
        this.content.appendChild(this.know_more)
        this.node_main.appendChild(this.content)
    }

    display() {
        this.content.style.display = "flex"
    }
    hide() {
        this.content.style.display = "none";
    }


}

function fetchAndSetBackgroundImage(imageUrl, target) {



    target.style.backgroundImage = `url(${imageUrl})`;
    target.style.backgroundSize = "contain";
    target.style.backgroundPositionX = "center"
    target.style.backgroundPositionY = "center"
    target.style.backgroundRepeat = "no-repeat"
}