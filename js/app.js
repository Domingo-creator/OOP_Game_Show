document.addEventListener('DOMContentLoaded', () => {
    const keyboard = document.querySelector('.keyboard');
    const phraseCategory = document.querySelector('#category');
    const timer = document.querySelector('#timer');
    const wrongGuesses = document.querySelector('#incorrect-letters');
    const guessesRemaining = document.querySelector('#remaining-guesses');
    const gameboardSpaces = Array.from(document.querySelector('.gameboard').children);
    const phraseList = [ 
        {
         phrase: 'ENGINE ROOM',
         category: 'Place'
        },

        {
         phrase:"WASHINGTON APPLES",
         category:'Food & Drink'
        },
        
        {
         phrase: 'PLAYING WELL WITH OTHERS',
         category:'What Are You Doing?'
        },
           
        {
         phrase:'BREAKFAST IN BED AT A BED AND BREAKFAST',
         category:'Event'
        },

        {
         phrase:  'ILL MEET YOU AT THE BEACH',
         category: 'Phrase'
        },

        {
         phrase:'PERMANENT PRESS',
         category: 'Thing'
        },

        {
         phrase: 'PRINTING PRESS',
         category: 'Thing'
        },

        {
         phrase: 'FREEDOM OF THE PRESS',
         category: 'Thing'
        },

        {
         phrase: 'VINTAGE MOVIE POSTER',
         category: 'Show Biz'
        },

        {
         phrase: 'ALWAYS BE HAPPY',
         category: 'Phrase'
        },

        {
         phrase: 'WERE ALL GOING TO DIE',
         category: 'Phrase'
        }
    ];

    class Game {
        constructor() {
        this.phrase;
        this.category;
        this.gameboard;
        this.letterSpaces;
        this.guessesRemaining;
        this.timer;
    
        }

        resetGame() {
            this.resetBoard()
            let currPhrase = phraseList[Math.floor(Math.random() * (phraseList.length))];
            this.phrase = currPhrase.phrase;
            this.category = currPhrase.category;
            this.guessesRemaining = 8;

            wrongGuesses.textContent = "";
            this.createGameboard();
            this.letterSpaces = Array.from(document.querySelectorAll('.letter-space'));
            this.setCategory();
            this.startTimer();
        }

        resetBoard() {
            let letterSpaces = Array.from(document.querySelectorAll('.letter-space'));
            letterSpaces.forEach(letterSpace =>  {
                letterSpace.className ='empty-space';
                letterSpace.textContent = '\u00A0';
            });
        }
        
        /*edit the game board spaces to the size of the phrase.  the phrase will
        be centered on the board and the spaces containing letters will be changed
        to white */
        createGameboard () {
            let firstLetter = Math.floor((44 - this.phrase.length)/2);
            //convert gameboardSpaces from html collection to array
            /*needs to be more complicated than that in order to fit words on same line*/
            gameboardSpaces.slice(firstLetter).forEach((gameboardSpace, index) => {
                if (index < this.phrase.length) {
                    if (/[A-Z]/i.test(this.phrase[index])) { gameboardSpaces[index+firstLetter].className = 'letter-space';}
                }
            });
            this.gameboard = document.querySelectorAll('.letter-space');
            guessesRemaining.textContent = this.guessesRemaining;
            
        }

        setCategory() {phraseCategory.textContent = this.category;}

        
         //return boolean
         isComplete() {
             console.log(this.letterSpaces);
            let unguessedLetters = this.letterSpaces.filter(letterSpace => letterSpace.textContent.trim() === '' || letterSpace.textContent === '&nbsp');
            if (unguessedLetters.length === 0) {
                return true;
            } 
            return false;   
        }

        endGame(winOrLose) {
            clearInterval(this.timer);
            setTimeout( function() {
                if(winOrLose === 'win') {
                    if(confirm('CONGRATULATIONS!!!! YOU WIN!!!! \n\n WOULD YOU LIKE TO PLAY AGAIN?')) {
                        gameSession.resetGame();
                    }
                }else{
                    if(confirm('SORRY, YOU LOST. BETTER LUCK NEXT TIME. \n\n WOULD YOU LIKE TO PLAY AGAIN?')) {
                        gameSession.resetGame();
                    }
                }
            },300);
            
        }
            
        

        startTimer() {
            timer.textContent = 30;
            let myTimer = setInterval(updateTimer => {
                if (timer.textContent !== '0')  {timer.textContent = parseInt(timer.textContent) - 1;}
                else {this.endGame();}
            }, 1000);
            this.timer = myTimer;
        }

        
        //check for all cases of letter and reveal them
        checkLetter (letter) {
            let letterFound = false;
            let trimmedPhrase = this.phrase.split(" ").join('');
            for(let i = 0; i < this.phrase.length; i++) {
                if (trimmedPhrase[i] === letter) {
                    this.gameboard[i].textContent = letter;
                    letterFound = true;
                }
            };
            if (letterFound === false) {
                if(wrongGuesses.textContent.search(letter) === -1) {
                    wrongGuesses.textContent += `${letter} `;
                    this.guessesRemaining--;
                    guessesRemaining.textContent = this.guessesRemaining;
                }
                if (this.guessesRemaining === 0) {
                    this.endGame('lose');
                }
            }else if (this.isComplete()) {
                this.endGame('win');
            }     
        }     
       
    }
 

    /************************************************************************/
    /************************Start game session******************************/
    /************************************************************************/
    const gameSession = new Game(); 
    gameSession.resetGame();

    //on-screen keyboard listener
    keyboard.addEventListener ('click', (event) => {
        if (timer.textContent !== '0' && event.target.textContent.length === 1) {
            gameSession.checkLetter(event.target.textContent);

        }
    });

    document.addEventListener ('keydown', (event) => {
        console.log(/[A-Z]/i.test(event.key));
        if (timer.textContent !== '0' && /^[A-Z]$/i.test(event.key)) {
            gameSession.checkLetter(event.key.toUpperCase());
        }
    });

});