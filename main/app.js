function appPreload() {
    // Load assets here

}

async function appCreate() {
    // Initialize here

TextEngine.writeLine("                                              ########################");
TextEngine.writeLine("                                              ####                ####");
TextEngine.writeLine("                                              #### HAUNTED HOUSES ####");
TextEngine.writeLine("                                              ####                ####");
TextEngine.writeLine("                                              ########################");
TextEngine.writeLine("                                                     by               ");
TextEngine.writeLine("                                                      Danier");

TextEngine.writeLine("                    ___||___");
TextEngine.writeLine("                   ///////////\\");
TextEngine.writeLine("                  ///////////  \\");
TextEngine.writeLine("                 ///////////    \\");
TextEngine.writeLine("                ///////////      \\");
TextEngine.writeLine("          ______///////////________\\_________");
TextEngine.writeLine("         |    .-       -    .--.    .--.    .|                 ****                   *********     ");
TextEngine.writeLine("         |   |   HAUNTED   |    |  |    |   .|               ** I I **              **  *   *  **   ");
TextEngine.writeLine("         |   |    HOUSE    |    |  |    |   .|               *        *             *  <I> <I>  *   ");
TextEngine.writeLine("         |   |     .-.     |    |  |    |   .|                *  ---  *              *  -----   *   ");
TextEngine.writeLine("         |   |    |   |    |    |  |    |   .|                 **   **                **      **    ");
TextEngine.writeLine("         |   |    |   |    |    |  |    |   .|                  *****                  *******      ");
TextEngine.writeLine("         |   |    |   |    |    |  |    |   .|");
TextEngine.writeLine("         |   |____|___|____|____|__|____|___.|_|");
TextEngine.writeLine("         |______________________________________|");
TextEngine.writeLine("                   ||  ||     ||  ||");
TextEngine.writeLine("                 ==||==||==   ==||==||==");
TextEngine.writeLine("                  ||  ||         ||  ||");

TextEngine.writeLine("\n\n");
TextEngine.writeLine("                                               Press Enter Key To Start");
await TextEngine.readLineAsync()


TextEngine.writeLine("\n\n");
TextEngine.writeLine("      -");
TextEngine.writeLine("      --");
TextEngine.writeLine("     ----");
TextEngine.writeLine("    -------");
TextEngine.writeLine("   ---------");
TextEngine.writeLine("  ------------");
TextEngine.writeLine(" ----------------             ||||||           ");
TextEngine.writeLine("------------------|          ||||||||          ");
TextEngine.writeLine("----------I  I----|           ||||||           ");
TextEngine.writeLine("----------I  I----|             ||             ");
TextEngine.writeLine("------------------|             ||             ");
TextEngine.writeLine("----|  |----------|             ||             ");
TextEngine.writeLine("----|  |----------||||||||||||||||||||||||||||");

TextEngine.writeLine("\n\n");
TextEngine.writeLine("Hello adventurer");
TextEngine.writeLine("You are now in front of a house. Do you want to go inside?");
TextEngine.writeLine("a) Yes");
TextEngine.writeLine("b) No");

let choiceHouse = "";
while(choiceHouse !== "a" && choiceHouse !== "b") {
    choiceHouse = (await TextEngine.readLineAsync()).toLowerCase().toLowerCase();
    if(choiceHouse !== "a" && choiceHouse !== "b") {
        TextEngine.writeLine("Sorry this answer is not available, please choose a or b!");
    }
}

if(choiceHouse === "a") {
    TextEngine.writeLine("                                                                  ----------------- ");  
    TextEngine.writeLine("  -------------                                                   |      !!       | ");
    TextEngine.writeLine(" |             |                                                  |      !!       | ");
    TextEngine.writeLine(" |   w    c    |                |-|                               |      !!       | ");
    TextEngine.writeLine(" |             |                | |                V              |      !!       | ");
    TextEngine.writeLine(" |          *  |   |------------------|     |--------------|--|   |   *  !! *     | ");
    TextEngine.writeLine(" |             |   ||                ||     |              |* |   |      !!       | ");
    TextEngine.writeLine(" |             |   ||                ||     |              |* |   |      !!       | ");
    TextEngine.writeLine(" |             |   ||                ||     |              |* |   |      !!       | ");
    TextEngine.writeLine("-|-------------|--------------------------------------------------------------------");

    TextEngine.writeLine("\n\n");
    TextEngine.writeLine("You are now inside the house in the bedroom. What do you want to choose?");
    TextEngine.writeLine("a) open shelve");
    TextEngine.writeLine("b) turn on Tv");
    TextEngine.writeLine("c) drink water");
    TextEngine.writeLine("d) go to the bathroom");

    let choiceBedroom = "";
    while(choiceBedroom !== "a" && choiceBedroom !== "b" && choiceBedroom !== "c" && choiceBedroom !== "d") {
        choiceBedroom = (await TextEngine.readLineAsync()).toLowerCase();
        if(choiceBedroom !== "a" && choiceBedroom !== "b" && choiceBedroom !== "c" && choiceBedroom !== "d") {
            TextEngine.writeLine("Sorry this answer is not available, please choose a, b, c or d!");
        }
    }

    if(choiceBedroom === "a") TextEngine.writeLine("Oh no! You have been eaten by the shelve monster!");
    else if(choiceBedroom === "b") {
        TextEngine.writeLine("      \\  /      ");
        TextEngine.writeLine("       \\/       ");
        TextEngine.writeLine(" --------------- ");
        TextEngine.writeLine("|-------------|O|");
        TextEngine.writeLine("|             |*|");
        TextEngine.writeLine("|             |-|");
        TextEngine.writeLine("|             |+|");
        TextEngine.writeLine("|---------------|");
        TextEngine.writeLine(" --------------- ");
        TextEngine.writeLine("Oh you need to choose which channel you want to watch.");
    }
    else if(choiceBedroom === "c") {
        TextEngine.writeLine("       *********               ");
        TextEngine.writeLine("     **         **             ");
        TextEngine.writeLine("     *   X   X   *            ");
        TextEngine.writeLine("      *    O    *             ");
        TextEngine.writeLine("       **      **             ");
        TextEngine.writeLine("        *******              ");
        TextEngine.writeLine("Oh no the water was poisonous. You died! GAME OVER!");
    }
    else if(choiceBedroom === "d") {
        TextEngine.writeLine("Finally! You went out of the bedroom. You are now in the bathroom.");
    }
}
else if(choiceHouse === "b") {
    TextEngine.writeLine("You are now in the garden! What do you want to choose?");
}
}

async function appUpdate() {
    // Run the core game loop here

}
