function choice(array, quantity) {
    let result = [];
    
    // В самой последней ноде на win 7 (v13.14.0) array читается неправильно, поэтому
    // создано ветвление ниже
    if (array.split('\r\n').length == 1) {
        array = array.split('\n')
    } else {
        array = array.split('\r\n');
    }

    for (let i = 0; i < quantity; i++) {
        result.push(
            array[Math.round(Math.random() * array.length)]
        )
    }
   
    return result.join(' ');
}

export default choice;
