document.addEventListener('DOMContentLoaded', () => {
    const keyboard = document.querySelector('.keyboard');
    const newGameWindow = document.querySelector('#new-game-window');
    const gameResult = document.querySelector('#game-result');
    const newGameButton = document.querySelector('#new-game-button');
    const phraseCategory = document.querySelector('#category');
    const timer = document.querySelector('#timer');
    const currentGuess = document.querySelector('#current-guess');
    const wrongGuesses = document.querySelector('#incorrect-letters');
    const strikesBar = document.querySelector('#strikes-bar');
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
        this.guessesRemaining;
        this.timer;
    
        }

        resetGame() {
            // reset board to blank and guesses to 7
            this.resetBoard();
            this.resetGuesses();
            //pick random phrase and assign its phrase and category to object variables
            let currPhrase = phraseList[Math.floor(Math.random() * (phraseList.length))];
            this.phrase = currPhrase.phrase;
            this.category = currPhrase.category;
            
            //Create board with blank spaces, set the on-screen category and timer displays
            this.createGameboard();
            this.setCategory();
            this.startTimer();
        }

        //remove 'letter-space' class from all boxes and set text content to blank
        resetBoard() {
            let letterSpaces = Array.from(document.querySelectorAll('.letter-space'));
            letterSpaces.forEach(letterSpace =>  {
                letterSpace.className ='empty-space';
                letterSpace.classList.remove('unguessed-reveal');
                letterSpace.textContent = '\u00A0';
            });
        }

        // Set guesses remainng to 7, delete contets of all guess displays, remove 'selected' class from all keys
        resetGuesses() {
            this.guessesRemaining = 7;
            guessesRemaining.textContent = this.guessesRemaining; 
            currentGuess.textContent = "";
            wrongGuesses.textContent = "";
          
            let selectedKeys = document.querySelectorAll('.selected');
            selectedKeys.forEach( (selectedKey) => {
                selectedKey.classList.remove('selected');
            });
            strikesBar.innerHTML = '';
        }
        
        /*edit the game board spaces to the size of the phrase.  the phrase will
        be centered on the board and the spaces containing letters will be changed
        to white */
        createGameboard () {
            let firstLineIndex;
            let phraseArray = this.phrase.split(" ");

            //add to phraseByLine distributing the words from phrase array into 12 character piecese that do not seperate words
            let phraseByLine = [""];
            for (let i = 0; i < phraseArray.length; i++) {
                if (phraseByLine[phraseByLine.length - 1].length + phraseArray[i].length <= 12) {
                    phraseByLine[phraseByLine.length - 1] += phraseArray[i] + " ";
                } else { 
                    phraseByLine.push(phraseArray[i] + " ");
                }
            }
            /////  Trim trailing spaces from each line in phraseByLine
            for (let i = 0; i < phraseByLine.length; i++) {
                phraseByLine[i] = phraseByLine[i].trim();
            }

            // If phraseByLine.length is 2 or 1, start on line 2.  else, start on line 1
            if (phraseByLine.length <= 2) {
                firstLineIndex = 12;
            } else {
                firstLineIndex = 24
            }
            //iterate through each line in phraseByLine
            for(let i = 0; i < phraseByLine.length; i++) {
                //iterate through each character in current line
                for ( let j = 0; j < phraseByLine[i].length; j++) {
                    //if character is a letter, add 'letter-space' class to index j of current line, starting on firstLine, centering the characters on line
                    if (/[A-Z]/i.test(phraseByLine[i][j])) {
                        gameboardSpaces[firstLineIndex + j + Math.floor((12 - phraseByLine[i].length)/2)].className = 'letter-space';
                    }
                }
                firstLineIndex += 12;
            }
            //save gameBoard to object variable
            this.gameboard = document.querySelectorAll('.letter-space');    
        }

        // Set on screen category
        setCategory() {
            phraseCategory.textContent = this.category;
        }

        // start the timer
        startTimer() {
            timer.textContent = 90;
            let myTimer = setInterval(updateTimer => {
                if (timer.textContent !== '0')  {timer.textContent = parseInt(timer.textContent) - 1;}
                else {this.endGame();}
            }, 1000);
            this.timer = myTimer;
        }

        //check for all cases of letter and reveal them
        checkLetter (letter) {
            this.animateGuess(letter);
            let letterFound = false;
            let trimmedPhrase = this.phrase.split(" ").join('');
            //search for match
            for(let i = 0; i < this.phrase.length; i++) {
                if (trimmedPhrase[i] === letter) {
                    this.gameboard[i].textContent = letter;
                    letterFound = true;
                }
            };
            //make displayed guess green if correct, red if incorrect
            if (letterFound === true) {
                currentGuess.style.color = "green";
            } else {
                currentGuess.style.color = "red";

            }
            //check for repeat guess.  if not repeated, add to wrong guesses
            if (letterFound === false) {
                if(wrongGuesses.textContent.search(letter) === -1) {
                    wrongGuesses.textContent += `${letter} `;
                    this.guessesRemaining--;
                    guessesRemaining.textContent = this.guessesRemaining;
                    //add a strike image to the strike bar
                    var strikeImg = document.createElement('img');
                    strikeImg.setAttribute("src", "https://dzone.com/storage/temp/1448810-cross-39414-1280.png");
                    strikesBar.appendChild(strikeImg);
                }
                //check if out of guesses, end game if none remain
                if (this.guessesRemaining === 0) {
                    this.endGame('lose');
                }
            //check if game is completed with last guess 
            }else if (this.isComplete()) {
                this.endGame('win');
            }     
        }

        //Flash the letter guessed on the onscreen keyboard and display guess
        animateGuess (letter) {
            let keys = keyboard.children;
            for (let i = 0; i < keys.length; i++) {
                if (keys[i].textContent === letter.toUpperCase()) {
                    //change selected letter green on onscreen keyboard and add 'selected' class
                    keys[i].classList.add('selected');
                    currentGuess.textContent = letter;
                    //break out of for loop
                    break;
                }
            }
        }
        
        // check if the key corresponding to the variable 'letter' has the class 'selected'. Returns true if 'selected' class not found
        notGuessed (letter) {
            let keys = keyboard.children;
            for (let i=0; i < keys.length; i++) {
                if (keys[i].textContent === letter) {
                    if (keys[i].classList.contains('selected')) {
                        return false;
                    }
                    else { 
                        return true; 
                    }
                }
            }
        }

        
         //return boolean
         isComplete() {
            let letterSpaces =  Array.from(document.querySelectorAll('.letter-space')); 
            let unguessedLetters = letterSpaces.filter(letterSpace => letterSpace.textContent.trim() === '' || letterSpace.textContent === '&nbsp');
            if (unguessedLetters.length === 0) {
                return true;
            } 
            return false;   
        }

        //  End the Game.  If winOrLose = win, give win message.  If winOrLose = lose, display remaining unguessed
        //  letters in red and display lose message
        endGame(winOrLose) {
            clearInterval(this.timer);
            setTimeout( function() {
                if(winOrLose === 'win') {
                    gameResult.textContent = "YOU WIN!!!!!";
                    newGameWindow.classList.remove('hidden');
                }else{
                    //reveal remaining letters not guessed in red
                    let trimmedPhrase = gameSession.phrase.split(" ").join('');
                    for (let i = 0; i < gameSession.gameboard.length; i++) {
                        if (!/^[A-Z]$/i.test(gameSession.gameboard[i].textContent)) {
                            gameSession.gameboard[i].textContent = trimmedPhrase[i];
                            gameSession.gameboard[i].classList.add('unguessed-reveal');
                        }
                    }
                    gameResult.textContent = 'YOU LOSE. BETTER LUCK NEXT TIME';
                    newGameWindow.classList.remove('hidden'); 
                }
            },300);
            
        }
               
    }
 

    /************************************************************************/
    /************************Start game session******************************/
    /************************************************************************/
    const gameSession = new Game(); 

    //New Game Button Listener
    newGameButton.addEventListener('click', (event) => {
        newGameWindow.classList.add('hidden');
        gameSession.resetGame(); 
    })

    //on-screen keyboard listeners
    keyboard.addEventListener ('click', (event) => {
        if (timer.textContent !== '0' && gameSession.guessesRemaining > 0 && event.target.textContent.length === 1 && gameSession.notGuessed(event.target.textContent)) {
            gameSession.checkLetter(event.target.textContent);

        }
    });

    keyboard.addEventListener ('mouseover', (event) => {
        if (timer.textContent !== '0' && event.target.textContent.length === 1) {
            event.target.classList.add('mouseover');
        }
    });  
        
    keyboard.addEventListener ('mouseout', (event) => {
        event.target.classList.remove('mouseover');
    })

    //physical keyboard listener
    document.addEventListener ('keydown', (event) => {
        console.log('event.key = ' + event.key);
        //if game is still running, check for valid letter input
        if (timer.textContent !== '0' && gameSession.guessesRemaining > 0 && /^[A-Z]$/i.test(event.key) && gameSession.notGuessed(event.key.toUpperCase())) {
            gameSession.checkLetter(event.key.toUpperCase());
        }
        // if game is not running, listen for 'Enter' to begin game
        if (!newGameWindow.className.includes('hidden') && event.key === 'Enter') {
            newGameWindow.classList.add('hidden'); 
            gameSession.resetGame();
        }
    });



});