const player1 = {
    NAME: "Mario",
    SPEED: 4,
    MANEUVERABILITY: 3,
    POWER: 3,
    POINTS: 0,
};

const player2 = {
    NAME: "Luigi",
    SPEED: 3,
    MANEUVERABILITY: 4,
    POWER: 4,
    POINTS: 0,
};

async function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
    let random = Math.random();
    let result;

    switch (true) {
        case random < 0.33:
            result = "STRAIGHT";
            break;
        case random < 0.66:
            result = "CURVE";
            break;
        default:
            result = "CONFRONTATION";
            break;
    }

    return result;
}

function getRandomConfrontation() {
    let random = Math.random();

    if (random < 0.5) {
        return "TURTLE_SHELL";
    }

    return "BOMB";
}

function getRandomWinBoost() {
    let random = Math.random();

    if (random < 0.5) {
        return false;
    }

    return true;
}

function getPointsConfrontation(type) {
    if (type === "TURTLE_SHELL") {
        return 1;
    }

    return 2;
}

async function logRollResult(characterName, blockType, diceResult, attribute) {
    console.log(
        `${characterName} 🎲 rolou um dado de ${parseBlock(
            blockType
        )} ${diceResult} + ${attribute} = ${diceResult + attribute}`
    );
}

function parseBlock(block) {
    switch (block) {
        case "STRAIGHT":
            return "RETA";
        case "CURVE":
            return "CURVA";
        case "CONFRONTATION":
            return "CONFRONTO";
    }
}

function parseConfrontation(type) {
    if (type === "TURTLE_SHELL") {
        return "🐢 CASCO 🐢";
    }

    return "💣 BOMBA 💣";
}

async function playRaceEngine(character1, character2) {
    for (let round = 1; round <= 5; round += 1) {
        console.log(`\n🏁 Rodada ${round} 🏁\n`);

        let block = await getRandomBlock();
        console.log(`Bloco: ${parseBlock(block)}`);

        // ROLAR DADOS
        let diceResult1 = await rollDice();
        let diceResult2 = await rollDice();

        // TESTE DE HABILIDADE
        let totalTestSkill1 = 0;
        let totalTestSkill2 = 0;

        if (block === "STRAIGHT") {
            totalTestSkill1 = diceResult1 + character1.SPEED;
            totalTestSkill2 = diceResult2 + character2.SPEED;

            await logRollResult(
                character1.NAME,
                block,
                diceResult1,
                character1.SPEED
            );
            await logRollResult(
                character2.NAME,
                block,
                diceResult2,
                character2.SPEED
            );
        }

        if (block === "CURVE") {
            totalTestSkill1 = diceResult1 + character1.MANEUVERABILITY;
            totalTestSkill2 = diceResult2 + character2.MANEUVERABILITY;

            await logRollResult(
                character1.NAME,
                block,
                diceResult1,
                character1.MANEUVERABILITY
            );
            await logRollResult(
                character2.NAME,
                block,
                diceResult2,
                character2.MANEUVERABILITY
            );
        }

        if (block === "CONFRONTATION") {
            let powerResult1 = diceResult1 + character1.POWER;
            let powerResult2 = diceResult2 + character2.POWER;
            let typeConfrontation = getRandomConfrontation();
            let pointsConfrontation = getPointsConfrontation(typeConfrontation);
            let winBoost = getRandomWinBoost();

            console.log(
                `🥊 ${character1.NAME} confrontou ${character2.NAME}! 🥊\n`
            );

            await logRollResult(
                character1.NAME,
                block,
                diceResult1,
                character1.POWER
            );
            await logRollResult(
                character2.NAME,
                block,
                diceResult2,
                character2.POWER
            );

            if (powerResult1 > powerResult2) {
                if (character2.POINTS === 0) {
                    console.log("Nenhum ponto a ser perdido.\n");
                    continue;
                }

                const difference = character2.POINTS - pointsConfrontation;
                const pointsLost = character2.POINTS - difference;
                character2.POINTS = difference < 0 ? 0 : difference;
                character1.POINTS++;

                console.log(`${character1.NAME} venceu o confronto!`);

                if (winBoost) {
                    console.log(
                        `EXTRA!! ${character1.NAME} recebe 1 ponto de boost 🚀`
                    );
                    character1.POINTS++;
                }

                console.log(
                    `${
                        character2.NAME
                    } perdeu o confronto, recebeu ${parseConfrontation(
                        typeConfrontation
                    )} e perdeu ${pointsLost} pontos.`
                );
            }

            if (powerResult2 > powerResult1) {
                if (character1.POINTS === 0) {
                    console.log("Nenhum ponto a ser perdido.");
                    continue;
                }

                const difference = character1.POINTS - pointsConfrontation;
                const pointsLost = character1.POINTS - difference;
                character1.POINTS = difference < 0 ? 0 : difference;
                character2.POINTS++;

                console.log(`${character2.NAME} venceu o confronto!`);

                if (winBoost) {
                    console.log(
                        `EXTRA!! ${character2.NAME} recebe 1 ponto de boost 🚀`
                    );
                    character2.POINTS++;
                }

                console.log(
                    `${
                        character1.NAME
                    } perdeu o confronto, recebeu ${parseConfrontation(
                        typeConfrontation
                    )} e perdeu ${pointsLost} pontos.`
                );
            }

            console.log(
                powerResult2 === powerResult1
                    ? "Confronto empatado! Nenhum ponto foi perdido."
                    : ""
            );
        }

        if (totalTestSkill1 > totalTestSkill2) {
            console.log(`${character1.NAME} marcou um ponto!\n`);
            character1.POINTS++;
        } else if (totalTestSkill2 > totalTestSkill1) {
            console.log(`${character2.NAME} marcou um ponto!\n`);
            character2.POINTS++;
        } else if (block !== "CONFRONTATION") {
            console.log("Rodada empatada! Nenhum ponto marcado.\n");
        }
    }
}

async function declareWinner(character1, character2) {
    console.log("\n\nResultado final:");
    console.log(`${character1.NAME}: ${character1.POINTS} ponto(s)`);
    console.log(`${character2.NAME}: ${character2.POINTS} ponto(s)`);

    if (character1.POINTS > character2.POINTS)
        console.log(`\n🏆 ${character1.NAME} venceu a corrida! Parabéns! 🏆`);
    else if (character2.POINTS > character1.POINTS)
        console.log(`\n🏆 ${character2.NAME} venceu a corrida! Parabéns! 🏆`);
    else console.log(`\nA corrida terminou em empate.`);
}

(async function main() {
    console.log(
        `🏁🚦 Corrida entre ${player1.NAME} e ${player2.NAME} começando... \n`
    );

    await playRaceEngine(player1, player2);

    await declareWinner(player1, player2);
})();
