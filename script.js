// ==========================================
// BETZONE - JAVASCRIPT
// ==========================================

let bets = [];


// ==========================================
// INICIAR SITE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("BetZone iniciado!");

    updateSlip();
    calculate();

    setupSports();

    setupAmount();

});


// ==========================================
// SELECIONAR COTAÇÃO
// ==========================================

function addBet(game, option, odd, button) {

    console.log("Aposta selecionada:", game, option, odd);


    // Procura se já existe aposta desse jogo
    const index = bets.findIndex(
        bet => bet.game === game
    );


    const newBet = {
        game: game,
        option: option,
        odd: Number(odd)
    };


    // Se já existe, substitui
    if (index !== -1) {

        bets[index] = newBet;

    } else {

        bets.push(newBet);

    }


    // Remove seleção de todos os botões
    document.querySelectorAll(".odd").forEach(btn => {

        btn.classList.remove("selected");

    });


    // Seleciona o botão clicado
    if (button) {

        button.classList.add("selected");

    }


    updateSlip();

    calculate();

}


// ==========================================
// ATUALIZAR CUPOM
// ==========================================

function updateSlip() {

    const container =
        document.getElementById("bets");


    if (!container) {

        console.error(
            "Elemento #bets não encontrado."
        );

        return;

    }


    // Nenhuma aposta
    if (bets.length === 0) {

        container.innerHTML = `
            <div class="empty">
                Selecione uma cotação para
                adicioná-la ao cupom.
            </div>
        `;

        return;

    }


    container.innerHTML = "";


    bets.forEach((bet, index) => {

        const item =
            document.createElement("div");


        item.className = "bet";


        item.innerHTML = `
            <span
                class="remove"
                data-index="${index}"
            >
                ×
            </span>

            <div class="bet-title">
                ${bet.game}
            </div>

            <div class="bet-info">
                ${bet.option}
                • Cotação ${bet.odd.toFixed(2)}
            </div>
        `;


        container.appendChild(item);

    });


    // Eventos dos botões X
    container
        .querySelectorAll(".remove")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.index
                        );

                    removeBet(index);

                }
            );

        });

}


// ==========================================
// REMOVER APOSTA
// ==========================================

function removeBet(index) {

    if (
        index < 0 ||
        index >= bets.length
    ) {

        return;

    }


    bets.splice(index, 1);


    // Remove todas as seleções
    document.querySelectorAll(".odd")
        .forEach(button => {

            button.classList.remove(
                "selected"
            );

        });


    // Reaplica as seleções
    restoreSelections();


    updateSlip();

    calculate();

}


// ==========================================
// RESTAURAR SELEÇÕES
// ==========================================

function restoreSelections() {

    const buttons =
        document.querySelectorAll(".odd");


    buttons.forEach(button => {

        const onclick =
            button.getAttribute("onclick");


        if (!onclick) return;


        bets.forEach(bet => {

            if (
                onclick.includes(
                    `'${bet.game}'`
                ) &&
                onclick.includes(
                    `'${bet.option}'`
                )
            ) {

                button.classList.add(
                    "selected"
                );

            }

        });

    });

}


// ==========================================
// CALCULAR COTAÇÃO
// ==========================================

function calculate() {

    let totalOdd = 1;


    if (bets.length === 0) {

        totalOdd = 0;

    } else {

        bets.forEach(bet => {

            totalOdd *= bet.odd;

        });

    }


    const totalElement =
        document.getElementById(
            "totalOdd"
        );


    if (totalElement) {

        totalElement.textContent =
            totalOdd.toFixed(2);

    }


    calculateReturn(totalOdd);

}


// ==========================================
// CALCULAR RETORNO
// ==========================================

function calculateReturn(totalOdd) {

    const amountElement =
        document.getElementById(
            "amount"
        );


    const returnElement =
        document.getElementById(
            "returnValue"
        );


    if (
        !amountElement ||
        !returnElement
    ) {

        return;

    }


    const amount =
        Number(amountElement.value);


    if (
        !amount ||
        amount <= 0 ||
        bets.length === 0
    ) {

        returnElement.textContent =
            "R$ 0,00";

        return;

    }


    const result =
        amount * totalOdd;


    returnElement.textContent =
        result.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}


// ==========================================
// CAMPO DE VALOR
// ==========================================

function setupAmount() {

    const amount =
        document.getElementById(
            "amount"
        );


    if (!amount) return;


    amount.addEventListener(
        "input",
        calculate
    );

}


// ==========================================
// BOTÕES DE ESPORTES
// ==========================================

function setupSports() {

    const buttons =
        document.querySelectorAll(
            ".sport"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                buttons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );

            }
        );

    });

}


// ==========================================
// BOTÃO ENTRAR
// ==========================================

function login() {

    alert(
        "Área de login demonstrativa."
    );

}


// ==========================================
// BOTÃO DE APOSTA
// ==========================================

function placeBet() {

    if (bets.length === 0) {

        alert(
            "Selecione pelo menos uma cotação."
        );

        return;

    }


    const amount =
        Number(
            document.getElementById(
                "amount"
            ).value
        );


    if (
        !amount ||
        amount <= 0
    ) {

        alert(
            "Digite um valor válido."
        );

        return;

    }


    const totalOdd =
        bets.reduce(
            (total, bet) =>
                total * bet.odd,
            1
        );


    const result =
        amount * totalOdd;


    alert(
        "Cupom demonstrativo\n\n" +

        "Apostas: " +
        bets.length +

        "\nCotação: " +
        totalOdd.toFixed(2) +

        "\nValor: " +
        amount.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        ) +

        "\nRetorno: " +
        result.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        ) +

        "\n\nNenhuma transação real foi realizada."
    );

}
