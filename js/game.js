const phraseList = [
    {
        phrase:
        category:    
    },
]

class Game {
    constructor( phrase, category) {
        this.phrase = phrase;
        this.category = category;
    }


    // create an array of single character strings. the array should represent the phrase centered within the gameboard. 
    get gameboard () {
        const board = [];
        let phraseLength = this.phrase.length;
        let phraseBuffer = (44 - phraseLength)/2
        for(let i=0; i < phraseBuffer; i++) {
            board.push("");    
        }
        for(let i=0; i < phraseLength; i++){
            board.push(this.phrase[i])
        }
        while (board.length < 44) {
            board.push("");
        }
        return board;
    }

}