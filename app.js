function appPreload() {
    // Load assets here

}

async function appCreate() {
    await showTitleScreen();

    let playing = true;
    while (playing) {
        await playGame();
        playing = await askPlayAgain();
    }

    GameEngine.writeLine("\nThanks for playing!");
}

async function showTitleScreen() {
    const doorFrames = [
  `
  +---+
  |   |
  |   |
  |   |
  +---+
  `,
  `
  +---+
  |   |
  | / |
  |   |
  +---+
  `,
  `
  +---+
  |   |
  | / |
  |/  |
  +---+
  `,
  `
  +---+
  |   |
  |   |
  |   |
  +---+
  `
];

    await GameEngine.animateASCII(doorFrames, 300, 50, 300);

    GameEngine.createBoxContainer("stats", 850, 50, 200, 60, "Player Stats", true, true);
    GameEngine.writeLineToBox("stats", "Health: 100");
    GameEngine.writeLineToBox("stats", "Mana: 50", true);

    const smiley8 = [
  [0,0,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,0],
  [1,1,0,1,1,0,1,1],
  [1,0,0,1,1,0,0,1],
  [1,1,1,3,3,1,1,1],
  [1,4,1,1,1,1,4,1],
  [0,1,4,4,4,4,1,0],
  [0,0,1,1,1,1,0,0]
];

    GameEngine.drawPixelArt(smiley8, 50, 50);

    GameEngine.writeLine("                                              ########################                             ");
    GameEngine.writeLine("                                              ####                ####                             ");
    GameEngine.writeLine("                                              #### HAUNTED HOUSE  ####                             ");
    GameEngine.writeLine("                                              ####                ####                             ");
    GameEngine.writeLine("                                              ########################                             ");
    GameEngine.writeLine("                                                     by                                            ");
    GameEngine.writeLine("                                                      Danier                                       ");
    GameEngine.writeLine("            _______________________||_____                                                         ");
    GameEngine.writeLine("           //////////////////////////////\\                                                        ");
    GameEngine.writeLine("          //////////////////////////////  \\                                                       ");
    GameEngine.writeLine("         ////////////////////////////// __ \\                                                      ");
    GameEngine.writeLine("        ////////////////////////////// |__| \\                                                     ");
    GameEngine.writeLine("       //////////////////////////////_ _ ____\\                                                    ");
    GameEngine.writeLine("         |    .-       -    .--.    .--.    .|                 ****                   *********    ");
    GameEngine.writeLine("         |   |   HAUNTED   |    |  |    |   .|               ** I I **              **  *   *  **  ");
    GameEngine.writeLine("         |   |    HOUSE    |    |  |    |   .|               *        *             *  <I> <I>  *  ");
    GameEngine.writeLine("         |   |     .-.     |    |  |    |   .|                *  ---  *              *  -----   *  ");
    GameEngine.writeLine("         |   |    |   |    |    |  |    |   .|                 **   **                **      **   ");
    GameEngine.writeLine("         |   |    |   |    |    |  |    |   .|                  *****                  *******     ");
    GameEngine.writeLine("         |   |    |   |    |    |  |    |   .|                                                     ");
    GameEngine.writeLine("         |   |____|___|____|____|__|____|___.|                                                     ");
    GameEngine.writeLine("         |___________________________________|                                                     ");
    GameEngine.writeLine("               |__________|                                                                        ");
    GameEngine.writeLine("             |_________________|                                                                   ");
    GameEngine.writeLine("          |________________________|                                                               ");
    GameEngine.writeLine("\n\n                                                                                               ");
    GameEngine.writeLine("                                               Press Enter Key To Start                            ");
    await GameEngine.readLineAsync();
}

async function playGame() {
    GameEngine.clear();

    GameEngine.writeLine("\n\n");
    GameEngine.writeLine("                                                                                                   ");
    GameEngine.writeLine("      --                                                                                           ");
    GameEngine.writeLine("     ----                                                                                          ");
    GameEngine.writeLine("    -------| |                                                                                     ");
    GameEngine.writeLine("   --------- |                                                                                     ");
    GameEngine.writeLine("  ------------                                                                                     ");
    GameEngine.writeLine(" ----------------             ||||||                                                               ");
    GameEngine.writeLine("------------------|          ||||||||                                                              ");
    GameEngine.writeLine("----------I  I----|           ||||||                                                               ");
    GameEngine.writeLine("----------I  I----|             ||                                                                 ");
    GameEngine.writeLine("------------------|             ||                                                                 ");
    GameEngine.writeLine("----|  |----------|             ||                                                                 ");
    GameEngine.writeLine("----|  |----------||||||||||||||||||||||||||||                                                     ");

    GameEngine.writeLine("\n\n");
    GameEngine.writeLine("Hello adventurer");
    GameEngine.writeLine("You are now in front of a house. Do you want to go inside?");
    GameEngine.writeLine("a) Yes");
    GameEngine.writeLine("b) No");
    GameEngine.writeLine("\n");

    const choiceHouse = await readChoice(["a", "b"], "Sorry this answer is not available, please choose a or b!");

    if (choiceHouse === "b") {
        GameEngine.writeLine("\nYou are now in the garden! What do you want to choose?");
        GameEngine.writeLine("a) go back inside");
        GameEngine.writeLine("b) leave");

        const choiceGarden = await readChoice(["a", "b"], "Sorry this answer is not available, please choose a or b!");

        if (choiceGarden === "b") {
            GameEngine.writeLine("\nYou leave the haunted house behind. GAME OVER!");
            return;
        }
    }

    await exploreBedroom();
}

async function exploreBedroom(statusMessage = "") {
    while (true) {
        GameEngine.clear();
        const artRoom = `
                                                                    -----------------
 _______________                                    \\  /           |      !!       | 
 |             |                              _______\\/______      |      !!       | 
 |   w    c    |                |-|          |░░░░░░░░░░░| * |      |      !!       | 
 |             |                | |          |░░░░░░░░░░░| * |      |      !!       | 
 |          *  |   |------------------|      |░░░░░░░░░░░| * |      |    * !! *     | 
 |             |   ||                ||   ___|░░░░░░░░░░░|___|__    |      !!       | 
 |             |   ||                ||    |                  |     |      !!       | 
 |             |   ||                ||    |                  |     |      !!       | 
-|-------------|--------------------------------------------------------------------`;

        GameEngine.showArt(artRoom);
       /*GameEngine.writeLine("                                                                    ----------------- ");  
        GameEngine.writeLine(" _______________                                    \\  /           |      !!       | ");
        GameEngine.writeLine(" |             |                              _______\\/______      |      !!       | ");
        GameEngine.writeLine(" |   w    c    |                |-|          |░░░░░░░░░░░| * |      |      !!       | ");
        GameEngine.writeLine(" |             |                | |          |░░░░░░░░░░░| * |      |      !!       | ");
        GameEngine.writeLine(" |          *  |   |------------------|      |░░░░░░░░░░░| * |      |    * !! *     | ");
        GameEngine.writeLine(" |             |   ||                ||   ___|░░░░░░░░░░░|___|__    |      !!       | ");
        GameEngine.writeLine(" |             |   ||                ||    |                  |     |      !!       | ");
        GameEngine.writeLine(" |             |   ||                ||    |                  |     |      !!       | ");
        GameEngine.writeLine("-|-------------|--------------------------------------------------------------------");*/

        GameEngine.writeLine("\n");
        if (statusMessage) {
            GameEngine.writeLine(statusMessage);
            GameEngine.writeLine("\n");
        }
        GameEngine.writeLine("You are now inside the house in the bedroom. What do you want to choose?");
        GameEngine.writeLine("a) open shelf");
        GameEngine.writeLine("b) turn on TV");
        GameEngine.writeLine("c) drink water");
        GameEngine.writeLine("d) go to the bathroom");
        GameEngine.writeLine("\n");

        const choiceBedroom = await readChoice(["a", "b", "c", "d"], "Sorry this answer is not available, please choose a, b, c or d!");

        if (choiceBedroom === "a") {
            GameEngine.writeLine("Oh no! You have been eaten by the shelf monster! GAME OVER!");
            return;
        }
        else if (choiceBedroom === "b") {
            GameEngine.writeLine("      \\  /      ");
            GameEngine.writeLine("       \\/       ");
            GameEngine.writeLine(" --------------- ");
            GameEngine.writeLine("|-------------|O|");
            GameEngine.writeLine("|             |*|");
            GameEngine.writeLine("|             |-|");
            GameEngine.writeLine("|             |+|");
            GameEngine.writeLine("|---------------|");
            GameEngine.writeLine(" --------------- ");
            GameEngine.writeLine("Oh you need to choose which channel you want to watch.");
            statusMessage = "You turn off the TV and keep exploring.";
        }
        else if (choiceBedroom === "c") {
            GameEngine.writeLine("       *********               ");
            GameEngine.writeLine("     **         **             ");
            GameEngine.writeLine("     *   X   X   *            ");
            GameEngine.writeLine("      *    O    *             ");
            GameEngine.writeLine("       **      **             ");
            GameEngine.writeLine("        *******              ");
            GameEngine.writeLine("Oh no the water was poisonous. You died! GAME OVER!");
            return;
        }
        else if (choiceBedroom === "d") {
            statusMessage = "Finally! You went out of the bedroom. You are now in the bathroom. There is nothing here, so you go back to the bedroom.";
        }
    }
}

async function readChoice(validChoices, invalidMessage) {
    while (true) {
        const answer = (await GameEngine.readLineAsync()).trim().toLowerCase();

        if (validChoices.includes(answer)) {
            return answer;
        }

        GameEngine.clearLastLine();
        GameEngine.writeLine(invalidMessage, true);
    }
}

async function askPlayAgain() {
    GameEngine.writeLine("\nDo you want to play again?");
    GameEngine.writeLine("a) Yes");
    GameEngine.writeLine("b) No");
    GameEngine.writeLine("\n");

    const choice = await readChoice(["a", "b"], "Sorry this answer is not available, please choose a or b!");
    return choice === "a";
}

function appUpdate() {
    // The text adventure engine needs no per-frame update.
}
