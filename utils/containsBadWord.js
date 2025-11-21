const badwords = require('../utils/badwords')

function containsBadWord(input) {
    const lowerInput = input.toLowerCase(); // Convert input to lowercase for case-insensitive comparison
    for (const word of badwords) {
        if (lowerInput.includes(word.toLowerCase())) {
            return true; // If any bad word is found, return true
        }
    }
    return false; // If no bad word is found, return false
}

module.exports = containsBadWord;