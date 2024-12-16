class styleScheme {
    constructor (element, styles) {
        this.element = element,
        this.styles = styles
    }

    setStyle(id, element = this.element) {
        let styles = this.styles[id];

        for (let style in styles) {
            element.style[style] = styles[style];
        }
    }
}

class classScheme {
    constructor(element, classes) {
        this.element = element,
        this.classes = classes
    }

    setClassName(id, element=this.element) {
        element.className = this.classes[id]
    }
}

const nav = new styleScheme(document.getElementById('nav'),
[
    {'opacity': '0'},
    {'opacity': '1'}
])

const textWrapper = new styleScheme(document.getElementById('text-wrapper'),
[
    {'transform': 'scale(1) translateY(-8%)'},
    {'transform': 'scale(0.93)'},   
])

const startOverlay = new styleScheme(document.getElementById('start-overlay'),
[
    {'display': 'none'},
    {'display': 'flex'}
])

const endOverlay = new styleScheme(document.getElementById('end-overlay'),
[
    {'display': 'none'},
    {'display': 'flex'}
])

const endStats = new styleScheme(document.getElementById('end-stats'), 
[
    {'animation': 'none'},
    {'animation': 'end 0.75s ease-out'}
])

const letterStyles = new styleScheme(null, [
    {'color': '#fc0303'}, // red
    {'color': '#63de4e'} // green
])

const letterClassNames = new classScheme(null, [
    'letter-cursor-af',
    'letter-cursor-bf',
    ''
])

const navElementsStyles = new styleScheme(null, [
    {'transform': 'scale(1)'},
    {'transform': 'scale(1.2)'}
])

const navElementsClasses = new classScheme(null, [
    '',
    'nav-el-active'
])
