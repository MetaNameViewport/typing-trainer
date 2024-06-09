function choice(array, quantity) {
    let result = [];

    for (let i = 0; i < quantity; i++) {
        result.push(
            array[Math.round(Math.random() * array.length)]
        )
    }

    return result;
}

export default choice;
