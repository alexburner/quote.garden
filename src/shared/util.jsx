export const getRandomElement = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};

export const shuffle = (arr, copy) => {
    if (copy) arr = arr.slice(0);

    // Fisher Yates implementation by mbostock
    // http://bost.ocks.org/mike/shuffle/
    let remaining = arr.length;
    let element;
    let index;

    // While there remain elements to shuffle…
    while (remaining) {

        // Pick a remaining element…
        index = Math.floor(Math.random() * remaining--);

        // And swap it with the current element.
        element = arr[remaining];
        arr[remaining] = arr[index];
        arr[index] = element;
    }

    return arr;
};