// ===========================================

const cria = document.getElementById("b"); 
const nightLayer     = document.getElementById("night-layer");     
const starsContainer = document.getElementById("stars-container"); 
// ===========================================

// Mapeamento de estados → arquivos de imagem
const estados = {
    normal:     "b_n.png",    // Estado inicial / normal
    puto:       "b_p.png",    // Está com fome / bravo
    morto:      "b_d.png",    // Morreu
    comendo:    "b_c.png",    // Animação de comer
    alimentado: "b_a.png",    // Feliz / bem alimentado
};

let contador = 0;       // Conta quantos segundos sem comer
let intervalo = null;   // Referência ao setInterval do controlador

// ===========================================

let timeoutClique = null;
let timeoutBack = null;



// ===========================================
// Definindo os dois fundos no JavaScript

const fundoDia = "background.png";
const fundoNoite = "background_noite.png";
let horas = 0; // definindo as horas 
let intervaloCiclo = null;  // ID do setInterval do ciclo dia/noite
let modoManual     = false; 

// ===========================================
// FUNÇÃO: alimentar()
// Chamada quando o usuário clica na imagem do biscoito
// ===========================================
function alimentar() {

    // Para o intervalo enquanto a criatura está comendo
    
    if (intervalo) clearInterval(intervalo);

    cria.src = estados.comendo; // Mostra a animação de comer
    contador = 0;               // Reseta o contador de fome

    console.log("Comendo...");

    
    if (timeoutClique) clearTimeout(timeoutClique);

    // Após 1 segundo comendo → fica feliz/alimentado
    timeoutClique = setTimeout(() => {
        cria.src = estados.alimentado;

        // Após mais 2 segundos feliz → volta ao normal e reinicia o timer
        timeoutBack = setTimeout(() => {
            cria.src = estados.normal;

            contador = 0;       // Garante que o contador começa do zero
            controlador();      // Reinicia o intervalo de fome do início
        }, 2000);

    }, 1000);
}


// ===========================================
// FUNÇÃO: controlador()
// Responsável por contar o tempo e mudar o estado da criatura com o tempo
// ===========================================
function controlador() {

    
    if (intervalo) clearInterval(intervalo);

    intervalo = setInterval(() => {
        contador++;

        console.log("Tempo sem comer:", contador, "s");

        // Aos 30 segundos: criatura fica brava/com fome
        if (contador === 30) {
            cria.src = estados.puto;
        }

        // Aos 60 segundos: criatura morre
        if (contador === 60) {
            cria.src = estados.morto;
            
           
            clearInterval(intervalo);
        }

    }, 1000); // Executa a cada 1 segundo
}
// ===========================================
// Crie uma função para alternar o fundo
function atualizarFundo() {
    if (horas) clearInterval(horas);

    horas = setInterval(() => {
    horas++;
    
    if (horas >= 12) {
        document.body.style.backgroundImage = `url('${fundoNoite}')`;
    } else {
        document.body.style.backgroundImage = `url('${fundoDia}')`;
    }
    if(horas >=24) horas =0;

    }, 1000);
}
// ===========================================

// ===========================================

function setNight(isNight) {
    if (isNight) {
        nightLayer.style.opacity     = "1"; // Mostra o fundo de noite
        starsContainer.style.opacity = "1"; // Mostra as estrelas
    } else {
        nightLayer.style.opacity     = "0"; // Esconde o fundo de noite (dia aparece)
        starsContainer.style.opacity = "0"; // Esconde as estrelas
    }
 
    // Atualiza o toggle para refletir o estado atual (quando chamado pelo ciclo)
    toggleDianoite.checked = isNight;
}

// Inicia o controlador assim que a página carrega
controlador();

atualizarFundo();
