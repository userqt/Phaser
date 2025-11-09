function appPreload() {
    // Load assets here

}

async function appCreate() {
    // Initialize here

    GameEngine.createBoxContainer("stats", 850, 50, 200, 60, "Player Stats", true, true);
    GameEngine.writeLineToBox("stats", "Health: 100");
    GameEngine.writeLineToBox("stats", "Mana: 50", true);

    TextEngine.showPopup("Alert!", "Game Over! Press OK to restart!", 100 , 100, 400, 200, () => {
   console.log("Popup closed, restarting game...");
    // Add your game logic here
 }, );
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
 await GameEngine.readLineAsync()


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
    await GameEngine.readLineAsync()
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

    let choiceHouse = "";
    while(choiceHouse !== "a" && choiceHouse !== "b") {
        choiceHouse = (await GameEngine.readLineAsync()).toLowerCase();
        if(choiceHouse !== "a" && choiceHouse !== "b") {
            GameEngine.clearLastLine();
            GameEngine.writeLine("Sorry this answer is not available, please choose a or b!", true);
        }
    }

    if(choiceHouse === "a") {
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

        GameEngine.writeLine("\n\n");
        GameEngine.writeLine("You are now inside the house in the bedroom. What do you want to choose?");
        GameEngine.writeLine("a) open shelve");
        GameEngine.writeLine("b) turn on Tv");
        GameEngine.writeLine("c) drink water");
        GameEngine.writeLine("d) go to the bathroom");      
        GameEngine.writeLine("\n");

        let choiceBedroom = "";
        while(choiceBedroom !== "a" && choiceBedroom !== "b" && choiceBedroom !== "c" && choiceBedroom !== "d") {
            choiceBedroom = (await GameEngine.readLineAsync()).toLowerCase();
            if(choiceBedroom !== "a" && choiceBedroom !== "b" && choiceBedroom !== "c" && choiceBedroom !== "d") {   
                GameEngine.clearLastLine();         
                GameEngine.writeLine("Sorry this answer is not available, please choose a, b, c or d!", true);
            }
        }

        if(choiceBedroom === "a") {
            GameEngine.writeLine("Oh no! You have been eaten by the shelve monster!");
        }
        else if(choiceBedroom === "b") {
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
        }
        else if(choiceBedroom === "c") {
            GameEngine.writeLine("       *********               ");
            GameEngine.writeLine("     **         **             ");
            GameEngine.writeLine("     *   X   X   *            ");
            GameEngine.writeLine("      *    O    *             ");
            GameEngine.writeLine("       **      **             ");
            GameEngine.writeLine("        *******              ");
            GameEngine.writeLine("Oh no the water was poisonous. You died! GAME OVER!");
        }
        else if(choiceBedroom === "d") {
            GameEngine.writeLine("Finally! You went out of the bedroom. You are now in the bathroom.");
        }
    }
    else if(choiceHouse === "b") {
        GameEngine.writeLine("You are now in the garden! What do you want to choose?");
    }
}

async function appUpdate() {
    // Run the core game loop here

    // In the text adventure engine, this may be left empty, since there is no continuous update needed
}
