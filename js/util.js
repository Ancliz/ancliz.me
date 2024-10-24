
/**
 * Deep freezes an instance to make all attributes unmodifiable.
 * @param {*} obj 
 */
export function finalise(obj) {
    Object.freeze(obj);
    Object.keys(obj).forEach(key => {
        if (obj[key] !== null && typeof obj[key] === 'object') {
            finalise(obj[key]);
        }
    });
}

export function rand(max, min) {
    return Math.random() * (max - min) + min;
}