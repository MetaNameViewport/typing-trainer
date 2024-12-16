const textSection = document.getElementById('text');
const statsField = document.getElementById('stats-field')
const closeCross = document.getElementById('close-cross')

let text = '';
let pointer = 0;

let letters = []

let state = 0

let currNumOfWords = 10
let prevElement = nav.element.children[0]

navElementsStyles.setStyle(1, prevElement)

let stats = {
    startTime: 0,
    deltaTime: 0,

    lettersNum: 0,
    wordsNum: 0,

    lettersCorrect: 0,
    lettersUncorrect: 0,
}

init(currNumOfWords)

function init(numOfWords) {
    endOverlay.setStyle(0)
    endStats.setStyle(0)

    for (let field in stats) {
        stats[field] = 0
    }

    textSection.innerText = ""
    statsField.innerHTML = ""

    startOverlay.setStyle(1)

    pointer = 0;
    text = '';

    letters = []

    fetch(`${window.location.href}api/text?length=${numOfWords}`)
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

        stats.lettersNum = text.length;
        stats.wordsNum = numOfWords;
    })
}

function generalKeyHandler(key) {
    if (state == 0) {
        if (key == ' ') {
            startOverlay.setStyle(0)
            textWrapper.setStyle(0)
            nav.setStyle(0)

            stats.startTime = Date.now()

            state = 1
        }
    } else if (state == 1) {
        let curLetter = letters[pointer];
        let nextLetter = letters[pointer + 1];
        
        let isCorrect = key == text[pointer]

        if (isCorrect) {
            stats.lettersCorrect += 1
        } else {
            stats.lettersUncorrect += 1
        }

        letterStyles.setStyle(Number(isCorrect), curLetter)

        if (pointer == text.length - 1) { // if text is finished
            letterClassNames.setClassName(0, curLetter)
            
            textWrapper.setStyle(1)
            endOverlay.setStyle(1)
            endStats.setStyle(1)

            nav.setStyle(1)
            
            stats.deltaTime = Date.now() - stats.startTime;

            let times = [
                String(Math.round(stats.deltaTime / 60_000)),
                String(Math.floor(stats.deltaTime / 1000)),
                String(stats.deltaTime / 1000).split('.')[1]
            ]

            times = times.map(function (i) {
                return i.length >= 2 ?
                i : '0'.repeat(2 - i.length) + i
            })

            stats.accuracy = ((stats.lettersCorrect / stats.lettersNum) * 100).toFixed(1)
            stats.wpm = ((60_000 / stats.deltaTime) * stats.wordsNum).toFixed(2)

            statsField.insertAdjacentHTML('afterbegin', `
            <li>Time: ${times.join(':')}</li>
            <li>WPM: ${((60_000 / stats.deltaTime) * stats.wordsNum).toFixed(2)}</li>
            <li>Accuracy: ${((stats.lettersCorrect / stats.lettersNum) * 100).toFixed(1)}%</li>
            <li>Letters correct: ${stats.lettersCorrect}</li>
            <li>Letters uncorrect: ${stats.lettersUncorrect}</li>
            `)

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

endOverlay.element.addEventListener('click', function(event) {
    if (event.target == endOverlay.element || event.target == closeCross) {
        init(currNumOfWords)
        state = 0
    }
})

nav.element.addEventListener('click', function(event) {
    let target = event.target
    let id = target.id

    if (id != 'nav') {
        currNumOfWords = id
        
        navElementsStyles.setStyle(0, prevElement)
        navElementsStyles.setStyle(1, target)

        prevElement = target

        init(currNumOfWords);
    }
})

keyboard.addEventListener('click', function(event) {
    let key = event.target.dataset.value;
    
    if (key !== undefined) {
        generalKeyHandler(key)
    }
})
