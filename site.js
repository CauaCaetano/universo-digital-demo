// Diagnóstico: a escolha do cliente vira a mensagem para o WhatsApp da loja.
// Na demonstração (<html data-demo="1">) nada é enviado: um painel mostra como o pedido chegaria.
(function () {
  'use strict';
  var CONTATO = 'https://contate.me/universo_digital'; // link público do perfil; trocar por wa.me com o número que a loja confirmar
  var DEMO = document.documentElement.dataset.demo === '1';
  var PROBLEMAS = {
    notebook: ['Lento ou travando', 'Não liga', 'Com vírus ou precisa formatar', 'Esquentando muito', 'Perdi ou queimei a fonte', 'Quero SSD ou mais memória'],
    computador: ['Lento ou travando', 'Não liga', 'Com vírus ou precisa formatar', 'Esquentando muito', 'Quero SSD, memória ou placa de vídeo'],
    impressora: ['Não imprime', 'Imprime com falhas', 'Precisa de limpeza', 'Preciso de suprimentos'],
  };
  var form = document.getElementById('diagnostico');
  var caixa = document.getElementById('problemas');
  var saida = document.getElementById('mensagem');
  var visita = document.getElementById('onde-visita');

  function valor(nome) { var m = form.querySelector('input[name="' + nome + '"]:checked'); return m ? m.value : ''; }

  function montarProblemas() {
    var ap = valor('aparelho');
    caixa.textContent = '';
    PROBLEMAS[ap].forEach(function (p, i) {
      var l = document.createElement('label'), r = document.createElement('input'), s = document.createElement('span');
      r.type = 'radio'; r.name = 'problema'; r.value = p; r.checked = i === 0;
      s.textContent = p;
      l.appendChild(r); l.appendChild(s); caixa.appendChild(l);
    });
    // a visita técnica anunciada pela loja é para notebook e computador
    visita.hidden = ap === 'impressora';
    if (ap === 'impressora') form.querySelector('input[name="onde"][value="loja"]').checked = true;
  }

  function texto() {
    var onde = valor('onde') === 'visita' ? 'Gostaria de uma visita técnica.' : 'Posso levar até a loja.';
    var ap = valor('aparelho');
    return 'Olá, Universo Digital! Preciso de ajuda com ' + (ap === 'impressora' ? 'minha ' : 'meu ') + ap + ': ' + valor('problema') + '. ' + onde + ' Pode me passar um orçamento?';
  }
  function atualizar() { saida.textContent = texto(); }

  form.addEventListener('change', function (e) {
    if (e.target.name === 'aparelho') montarProblemas();
    atualizar();
  });

  function simular(msg) {
    var d = document.querySelector('dialog.sim');
    if (!d) {
      d = document.createElement('dialog');
      d.className = 'sim';
      d.innerHTML = '<div class="sim-topo">Universo Digital</div><div class="sim-chat"><p></p></div><div class="sim-txt"><h2>É assim que o pedido chega na loja</h2><p>Esta é uma demonstração: nenhuma mensagem foi enviada. No site de verdade, o cliente cai direto no WhatsApp com o texto pronto.</p><button class="bt bt-azul" type="button">Fechar</button></div>';
      document.body.appendChild(d);
      d.querySelector('button').addEventListener('click', function () { d.close(); });
    }
    d.querySelector('.sim-chat p').textContent = msg;
    d.showModal();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (DEMO) simular(texto()); else window.open(CONTATO, '_blank', 'noopener');
  });

  montarProblemas();
  atualizar();
})();
