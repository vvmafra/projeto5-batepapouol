let userName;
let usuario = {};
let mensagemFinal;


function qualNome() {
  userName = prompt("Digite o seu nome");
  usuario.name = userName;
  const participante = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", usuario);
  participante.then(boa);
  participante.catch(ruim);
}

qualNome();

function boa(check) {
  setInterval(checkConexao, 5000);
  setInterval(checkServidor, 3000);
}

function ruim(erro) {
  alert("Nome de usuário ja existente, tente outro nome");
  qualNome();
}

function checkConexao(){
  const conectou = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", usuario);
}

function chatMensagem(msg){
  const localChat = document.querySelector(".chat");
  let mensagemAdicionada = '';
  for(let indice = 0; indice < msg.length; indice++){
      if(msg[indice].type === "status"){
          mensagemAdicionada += `
              <li class="mensagem status" data-test="message">
                  <div><span>( ${ msg[indice].time } )</span>  <strong> ${ msg[indice].from } </strong>  ${ msg[indice].text } </div>
              </li>`
      }else if(msg[indice].type === "message"){
          mensagemAdicionada += `
              <li class="mensagem normais" data-test="message">
                  <div><span>( ${ msg[indice].time } )</span>  <strong> ${ msg[indice].from } </strong> para <strong> ${ msg[indice].to }: </strong>  ${ msg[indice].text }</div>
              </li>`
      }else if(msg[indice].type === "private_message"){
        mensagemAdicionada += `
            <li class="mensagem reservadas" data-test="message">
                <div><span>( ${ msg[indice].time } )</span>  <strong> ${ msg[indice].from } </strong> reservadamente para <strong> ${ msg[indice].to }: </strong>  ${ msg[indice].text }</div>
            </li>`
    }
  }
  localChat.innerHTML = mensagemAdicionada;
  const msgAparente = document.querySelectorAll('.mensagem');
  if(mensagemFinal !== msgAparente[msgAparente.length-1].innerHTML){
      msgAparente[msgAparente.length-1].scrollIntoView();
      mensagemFinal = msgAparente[msgAparente.length-1].innerHTML;
  }
}

  function checkMensagens(check) {
    const filtro  = check.data.filter( check => 
    (check.from === usuario.name || check.to === usuario.name || check.to === "Todos" || check.type === "status" || check.type === "message"));
    chatMensagem(filtro);
  
  }

  function checkServidor(){
    const checkMensagem = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    checkMensagem.then(checkMensagens);
}
  
  function mensagemEnviada() {
    const mensagemChat = document.querySelector(".bottom input");
    const mensagem = {
    from: usuario.name, to: "Todos", text: mensagemChat.value, type: "message"
    }
    mensagemChat.value ="";
    const checkMensagem = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagem);
    checkMensagem.then(checkServidor);
    checkMensagem.catch(ruim);

}


