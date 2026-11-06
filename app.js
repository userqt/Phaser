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

    const boxHeight = 60;
    const boxWidth = 200;
    GameEngine.createBoxContainer(
        "stats",
        GameEngine.scene.game.config.width - boxWidth - 30,
        50,
        boxWidth, 
        boxHeight, 
        "Player Stats", 
        true, 
        true);
    GameEngine.writeLineToBox("stats", "Health: 100");
    GameEngine.writeLineToBox("stats", "Mana: 50", true);

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
    await GameEngine.animateASCII(doorFrames, 210, 300, 300);
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
       
        GameEngine.writeLine("");
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
            GameEngine.clear();
            GameEngine.writeLine("Oh no! You have been eaten by the shelf monster! GAME OVER!");
            return;
        }
        else if (choiceBedroom === "b") {
            GameEngine.clear();
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
            await GameEngine.readLineAsync();
            statusMessage = "You turn off the TV and keep exploring.";
        }
        else if (choiceBedroom === "c") {
            GameEngine.clear();
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
            GameEngine.clear();
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
