const timeResult = document.getElementById('time')
const closeCross = document.getElementById('close-cross')

let text = '';
let pointer = 0;

let letters = []

let state = 0

let startTime

init()

function init() {
    endOverlay.setStyle(0)
    endStats.setStyle(0)

    textSection.innerText = ""

    startOverlay.setStyle(1)

    pointer = 0;
    text = '';

    letters = []

    fetch('http://127.0.0.1:5500/api/text?length=3')
    .then(response => response.text())
    .then(function(data) {
        text = data;

        let textLayout = ''

        for (let letter of data) {
            if (letter == ' ') {
                letter = '&nbsp';
            }

            textLayout += `<letter>${letter}</letter>`;
        }

        textSection.insertAdjacentHTML("afterbegin", textLayout);

        letters = textSection.children;

        letterClassNames.setClassName(1, letters[0])
    })
}

function generalKeyHandler(event) {
    if (state == 0) {
        if (event.key == ' ') {
            startOverlay.setStyle(0)
            textWrapper.setStyle(0)

            startTime = Date.now()

            state = 1
        }
    } else if (state == 1) {
        let curLetter = letters[pointer];
        let nextLetter = letters[pointer + 1];
        
        letterStyles.setStyle(Number(event.key == text[pointer]), curLetter)

        if (pointer == text.length - 1) { // if text is finished
            letterClassNames.setClassName(0, curLetter)
            
            textWrapper.setStyle(1)
            endOverlay.setStyle(1)
            endStats.setStyle(1)
            
            let deltaTime = Date.now() - startTime;

            let times = [
                String(Math.round(deltaTime / 60_000)),
                String(Math.round(deltaTime / 1000)),
                String(deltaTime / 1000).split('.')[1]
            ]

            times = times.map(function (i) {
                return i.length >= 2 ?
                i : '0'.repeat(2 - i.length) + i
            })

            timeResult.innerText = times.join(':')

            state = 2
        } else {
            letterClassNames.setClassName(1, nextLetter)
            letterClassNames.setClassName(2, curLetter)

            if (curLetter.offsetTop !== nextLetter.offsetTop) {
                curLetter.scrollIntoView({behavior: 'smooth'});
            }

            pointer += 1;
        }
    }
}

document.addEventListener('keypress', generalKeyHandler);

endOverlay.element.addEventListener('click', function(event) {
    if (event.target == endOverlay.element || event.target == closeCross) {
        init()
        state = 0
    }
})
