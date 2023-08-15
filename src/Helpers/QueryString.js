export class qs {
    static parse = (query = '') =>
        query
            .replace(/^(?:\?|#)/, '')
            .split('&')
            .reduce((acc, pair) => {
                let [key, value] = pair.split('=');
                acc[key] = value;
                return acc;
            }, {});

    static stringify = (obj = {}) =>
        Object.entries(obj)
            .map((x) => `${x[0]}=${x[1]}`)
            .join('&');
}
