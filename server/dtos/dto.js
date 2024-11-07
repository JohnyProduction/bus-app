class Dto {
    validate() {
        throw new Error('Dto nie przeszło walidacji.');
    }
}

module.exports = { Dto };