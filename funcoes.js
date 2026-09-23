javascript
// ==========================================
// BRBET - SIMULADOR
// ==========================================

// Saldo inicial fictício
let saldo = 100;


// Cupom de apostas
let cupom = [];


// ==========================================
// JOGOS FICTÍCIOS
// ==========================================

const jogos = [

    {
        casa: "Flamengo",
        fora: "Palmeiras",
        horario: "16:00",
        casaOdd: 1.85,
        empateOdd: 3.40,
        foraOdd: 3.90
    },

    {
        casa: "Corinthians",
        fora: "Grêmio",
        horario: "18:30",
        casaOdd: 2.10,
        empateOdd: 3.20,
        foraOdd: 3.25
    },

    {
        casa: "São Paulo",
        fora: "Fluminense",
        horario: "20:00",
        casaOdd: 2.00,
        empateOdd: 3.30,
        foraOdd: 3.50
    },

    {
        casa: "Atlético-MG",
        fora: "Botafogo",
        horario: "21:30",
        casaOdd: 2.25,
        empateOdd: 3.35,
        foraOdd: 2.95
    }

];


// ==========================================
// MOSTRAR JOGOS
// ==========================================

function mostrarJogos() {

    const lista =
        document.getElementById("lista-jogos");

    lista.innerHTML = "";


    jogos.forEach((jogo, index) => {

        lista.innerHTML += `

            <article class="jogo">

                <div class="jogo-topo">

                    <span>
                        🇧🇷 Brasileirão Série A
                    </span>

                    <small>
                        Hoje · ${jogo.horario}
                    </small>

                </div>


                <div class="times">

                    <strong class="time-esquerdo">
                        ${jogo.casa}
                    </strong>

                    <span class="vs">
                        VS
                    </span>

                    <strong class="time-direito">
                        ${jogo.fora}
                    </strong>

                </div>


                <div class="odds">

                    <button
                        class="odd"
                        onclick="selecionar(
                            ${index},
                            'Casa',
                            ${jogo.casaOdd},
                            this
                        )">

                        <small>
                            CASA
                        </small>

                        <strong>
                            ${jogo.casaOdd.toFixed(2)}
                        </strong>

                    </button>


                    <button
                        class="odd"
                        onclick="selecionar(
                            ${index},
                            'Empate',
                            ${jogo.empateOdd},
                            this
                        )">

                        <small>
                            EMPATE
                        </small>

                        <strong>
                            ${jogo.empateOdd.toFixed(2)}
                        </strong>

                    </button>


                    <button
                        class="odd"
                        onclick="selecionar(
                            ${index},
                            'Fora',
                            ${jogo.foraOdd},
                            this
                        )">

                        <small>
                            FORA
                        </small>

                        <strong>
                            ${jogo.foraOdd.toFixed(2)}
                        </strong>

                    </button>

                </div>

            </article>

        `;

    });

}


// ==========================================
// SELECIONAR PALPITE
// ==========================================

function selecionar(
    jogoIndex,
    tipo,
    odd
) {

    // Remove uma seleção anterior
    // da mesma partida.

    cupom = cupom.filter(
        item =>
            item.jogoIndex !== jogoIndex
    );


    cupom.push({

        jogoIndex: jogoIndex,

        tipo: tipo,

        odd: odd

    });


    atualizarBotoes();

    atualizarCupom();

}


// ==========================================
// ATUALIZAR BOTÕES
// ==========================================

function atualizarBotoes() {

    document
        .querySelectorAll(".odd")
        .forEach(botao => {

            botao.classList.remove(
                "selecionada"
            );

        });


    cupom.forEach(item => {

        const jogo =
            document.querySelectorAll(".jogo")
            [item.jogoIndex];

        if (!jogo) {
            return;
        }


        const botoes =
            jogo.querySelectorAll(".odd");


        let posicao;


        if (item.tipo === "Casa") {

            posicao = 0;

        } else if (
            item.tipo === "Empate"
        ) {

            posicao = 1;

        } else {

            posicao = 2;

        }


        botoes[posicao]
            .classList.add(
                "selecionada"
            );

    });

}


// ==========================================
// ATUALIZAR CUPOM
// ==========================================

function atualizarCupom() {

    const conteudo =
        document.getElementById(
            "cupom-conteudo"
        );


    const footer =
        document.getElementById(
            "cupom-footer"
        );


    if (cupom.length === 0) {

        conteudo.innerHTML = `

            <p class="vazio">
                Selecione uma cotação
                para começar.
            </p>

        `;

        footer.style.display = "none";

        return;
    }


    footer.style.display = "block";


    conteudo.innerHTML = "";


    cupom.forEach(item => {

        const jogo =
            jogos[item.jogoIndex];


        conteudo.innerHTML += `

            <div class="selecao">

                <strong>
                    ${jogo.casa}
                    ×
                    ${jogo.fora}
                </strong>

                <small>
                    ${item.tipo}
                    · Cotação
                    ${item.odd.toFixed(2)}
                </small>

            </div>

        `;

    });


    calcularCotacao();

}


// ==========================================
// CALCULAR COTAÇÃO
// ==========================================

function calcularCotacao() {

    let total = 1;


    cupom.forEach(item => {

        total *= item.odd;

    });


    document.getElementById(
        "cotacao-total"
    ).textContent =
        total.toFixed(2);

}


// ==========================================
// SIMULAR APOSTA
// ==========================================

function simularAposta() {

    if (cupom.length === 0) {

        return;

    }


    // Valor utilizado na simulação.
    // É dinheiro fictício.

    const valor = 100;


    if (saldo < valor) {

        alert(
            "Seu saldo virtual é insuficiente."
        );

        return;

    }


    const cotacao =
        cupom.reduce(
            (total, item) =>
                total * item.odd,
            1
        );


    // Resultado aleatório
    // exclusivamente para demonstração.

    const ganhou =
        Math.random() >= 0.5;


    if (ganhou) {

        const premio =
            Math.floor(
                valor * cotacao
            );


        saldo =
            saldo + premio - valor;


        adicionarHistorico(
            true,
            premio
        );

    } else {

        saldo =
            saldo - valor;


        adicionarHistorico(
            false,
            valor
        );

    }


    atualizarSaldo();


    cupom = [];


    atualizarCupom();

    atualizarBotoes();

}


// ==========================================
// HISTÓRICO
// ==========================================

function adicionarHistorico(
    ganhou,
    valor
) {

    const historico =
        document.getElementById(
            "historico"
        );


    const vazio =
        historico.querySelector(
            ".vazio"
        );


    if (vazio) {

        historico.innerHTML = "";

    }


    const resultado =
        document.createElement("div");


    resultado.className =
        "resultado";


    if (ganhou) {

        resultado.innerHTML = `

            <span>
                Simulação vencedora
            </span>

            <strong class="ganhou">
                +R$ ${valor.toFixed(2)}
            </strong>

        `;

    } else {

        resultado.innerHTML = `

            <span>
                Simulação perdida
            </span>

            <strong class="perdeu">
                -R$ ${valor.toFixed(2)}
            </strong>

        `;

    }


    historico.prepend(resultado);

}


// ==========================================
// ATUALIZAR SALDO
// ==========================================

function atualizarSaldo() {

    document.getElementById(
        "saldo"
    ).textContent =
        saldo.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}


// ==========================================
// LIMPAR CUPOM
// ==========================================

function limparCupom() {

    cupom = [];

    atualizarCupom();

    atualizarBotoes();

}


// ==========================================
// IR PARA OS JOGOS
// ==========================================

function irParaJogos() {

    document
        .getElementById("jogos")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ==========================================
// LOGIN
// ==========================================

function abrirLogin() {

    document
        .getElementById("modal-login")
        .classList.add("ativo");

}


function fecharLogin() {

    document
        .getElementById("modal-login")
        .classList.remove("ativo");

}


// Fechar clicando fora do modal

document
    .getElementById("modal-login")
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target === this
            ) {

                fecharLogin();

            }

        }
    );


// ==========================================
// INICIALIZAÇÃO
// ==========================================

mostrarJogos();

atualizarSaldo();

atualizarCupom();
```
