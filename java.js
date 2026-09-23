// ==========================================
// BETZONE - SCRIPT PRINCIPAL
// ==========================================


// ------------------------------------------
// VARIÁVEIS
// ------------------------------------------

let bets = [];


// ------------------------------------------
// ADICIONAR APOSTA
// ------------------------------------------

function addBet(game, option, odd, button) {

    // Verifica se já existe uma aposta
    // nesse mesmo jogo
    const existingBet = bets.find(
        bet => bet.game === game
    );

    if (existingBet) {

        existingBet.option = option;
        existingBet.odd = odd;

    } else {

        bets.push({
            game: game,
            option: option,
            odd: odd
        });

    }


    // Remove a seleção de todos os botões
    document.querySelectorAll(".odd").forEach(btn => {
        btn.classList.remove("selected");
    });


    // Seleciona o botão clicado
    button.classList.add("selected");


    // Atualiza o cupom
    updateBetSlip();

    // Atualiza os valores
    calculateTotal();
}


// ------------------------------------------
// ATUALIZAR CUPOM
// ------------------------------------------

function updateBetSlip() {

    const betsContainer =
        document.getElementById("bets");


    // Se não houver apostas
    if (bets.length === 0) {

        betsContainer.innerHTML = `
            <div class="empty">
                Selecione uma cotação para
                adicioná-la ao cupom.
            </div>
        `;

        return;
    }


    // Limpa o cupom
    betsContainer.innerHTML = "";


    // Cria cada aposta
    bets.forEach((bet, index) => {

        const betElement =
            document.createElement("div");


        betElement.className = "bet";


        betElement.innerHTML = `

            <span
                class="remove"
                onclick="removeBet(${index})"
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


        betsContainer.appendChild(
            betElement
        );

    });

}


// ------------------------------------------
// REMOVER APOSTA
// ------------------------------------------

function removeBet(index) {

    // Remove do array
    bets.splice(index, 1);


    // Atualiza cupom
    updateBetSlip();


    // Recalcula
    calculateTotal();


    // Atualiza os botões selecionados
    updateSelectedButtons();
}


// ------------------------------------------
// ATUALIZAR BOTÕES
// ------------------------------------------

function updateSelectedButtons() {

    const buttons =
        document.querySelectorAll(".odd");


    buttons.forEach(button => {

        button.classList.remove(
            "selected"
        );

    });


    // Marca novamente as apostas existentes
    bets.forEach(bet => {

        buttons.forEach(button => {

            const text =
                button.parentElement
                    .parentElement
                    .querySelector(".teams")
                    .innerText;


            if (
                text.includes(
                    bet.game.split(" x ")[0]
                ) &&
                text.includes(
                    bet.game.split(" x ")[1]
                )
            ) {

                const option =
                    button.querySelector("span")
                        ?.innerText;


                if (option === bet.option) {

                    button.classList.add(
                        "selected"
                    );

                }

            }

        });

    });

}


// ------------------------------------------
// CALCULAR COTAÇÃO TOTAL
// ------------------------------------------

function calculateTotal() {

    let totalOdd = 1;


    // Nenhuma aposta
    if (bets.length === 0) {

        totalOdd = 0;

    } else {

        bets.forEach(bet => {

            totalOdd *= bet.odd;

        });

    }


    // Mostra cotação
    document.getElementById(
        "totalOdd"
    ).textContent =
        totalOdd.toFixed(2);


    // Calcula retorno
    calculateReturn(totalOdd);
}


// ------------------------------------------
// CALCULAR RETORNO
// ------------------------------------------

function calculateReturn(totalOdd) {

    const amountInput =
        document.getElementById("amount");


    const returnElement =
        document.getElementById(
            "returnValue"
        );


    const amount =
        Number(amountInput.value) || 0;


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


// ------------------------------------------
// ALTERAÇÃO DO VALOR
// ------------------------------------------

document
    .getElementById("amount")
    .addEventListener(
        "input",
        calculateTotal
    );


// ------------------------------------------
// FAZER APOSTA
// ------------------------------------------

function placeBet() {

    // Verifica apostas
    if (bets.length === 0) {

        alert(
            "⚠️ Seu cupom está vazio."
        );

        return;
    }


    // Pega valor
    const amount =
        Number(
            document.getElementById(
                "amount"
            ).value
        );


    // Verifica valor
    if (
        !amount ||
        amount <= 0
    ) {

        alert(
            "⚠️ Digite um valor válido."
        );

        return;
    }


    // Apenas demonstração
    alert(
        "✅ Cupom criado com sucesso!\n\n" +

        "Valor: " +
        amount.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        ) +

        "\n\n" +

        "Este é apenas um protótipo. " +
        "Nenhuma aposta real foi realizada."
    );

}


// ------------------------------------------
// LOGIN
// ------------------------------------------

function login() {

    alert(
        "🔐 Área de login\n\n" +
        "Sistema demonstrativo."
    );

}


// ------------------------------------------
// MENU DE ESPORTES
// ------------------------------------------

const sportButtons =
    document.querySelectorAll(
        ".sport"
    );


sportButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            // Remove ativo
            sportButtons.forEach(
                btn => {
                    btn.classList.remove(
                        "active"
                    );
                }
            );


            // Ativa clicado
            this.classList.add(
                "active"
            );

        }
    );

});


// ------------------------------------------
// INICIALIZAÇÃO
// ------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateBetSlip();

        calculateTotal();

        console.log(
            "BetZone carregado com sucesso."
        );

    }
);
