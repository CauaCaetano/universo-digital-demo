// Menu, formulário de orçamento e filtro da loja.
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

  function enviar(msg) {
    if (!DEMO) { window.open(CONTATO, '_blank', 'noopener'); return; }
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

  // menu no celular
  var bt = document.querySelector('.menu-bt'), menu = document.getElementById('menu');
  bt.addEventListener('click', function () {
    var aberto = menu.classList.toggle('aberto');
    bt.setAttribute('aria-expanded', aberto);
    bt.textContent = aberto ? 'Fechar' : 'Menu';
  });

  // formulário de orçamento
  var form = document.getElementById('diagnostico');
  if (form) (function () {
    var caixa = document.getElementById('problemas'), saida = document.getElementById('mensagem'), visita = document.getElementById('onde-visita');
    var valor = function (n) { var m = form.querySelector('input[name="' + n + '"]:checked'); return m ? m.value : ''; };
    function problemas(marcado) {
      var ap = valor('aparelho');
      caixa.textContent = '';
      PROBLEMAS[ap].forEach(function (p, i) {
        var l = document.createElement('label'), r = document.createElement('input'), s = document.createElement('span');
        r.type = 'radio'; r.name = 'problema'; r.value = p; r.checked = i === marcado;
        s.textContent = p;
        l.appendChild(r); l.appendChild(s); caixa.appendChild(l);
      });
      // a visita técnica anunciada pela loja é para notebook e computador
      visita.hidden = ap === 'impressora';
      if (ap === 'impressora') form.querySelector('input[name="onde"][value="loja"]').checked = true;
    }
    function texto() {
      var ap = valor('aparelho'), onde = valor('onde') === 'visita' ? 'Gostaria de uma visita técnica.' : 'Posso levar até a loja.';
      return 'Olá, Universo Digital! Preciso de ajuda com ' + (ap === 'impressora' ? 'minha ' : 'meu ') + ap + ': ' + valor('problema') + '. ' + onde + ' Pode me passar um orçamento?';
    }
    form.addEventListener('change', function (e) {
      if (e.target.name === 'aparelho') problemas(0);
      saida.textContent = texto();
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); enviar(texto()); });
    problemas(Number(form.dataset.prob) || 0);
    saida.textContent = texto();
  })();

  // botão "Perguntar se tem" em qualquer página de produtos
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-pedido]');
    if (!b) return;
    var campo = document.getElementById('busca');
    var item = b.dataset.pedido || (campo ? campo.value.trim() : '');
    enviar(item ? 'Olá, Universo Digital! Vocês têm ' + item + ' disponível? Qual é o preço?' : 'Olá, Universo Digital! Estou procurando um produto. Pode me ajudar?');
  });

  // página Produtos: categoria (também pelo endereço, ex.: loja.html#setup) e busca
  var lista = document.getElementById('produtos');
  if (lista) (function () {
    var itens = [].slice.call(lista.children), botoes = [].slice.call(document.querySelectorAll('[data-cat][aria-pressed]'));
    var busca = document.getElementById('busca'), contagem = document.getElementById('contagem'), vazio = document.getElementById('vazio');
    var limpa = function (s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
    var cat = 'todos';
    function aplicar() {
      var q = limpa(busca.value.trim()), n = 0;
      itens.forEach(function (li) {
        var ok = (cat === 'todos' || li.dataset.cat === cat) && (!q || limpa(li.textContent).indexOf(q) >= 0);
        li.hidden = !ok; if (ok) n++;
      });
      botoes.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.cat === cat); });
      contagem.textContent = n + (n === 1 ? ' produto' : ' produtos');
      vazio.hidden = n > 0;
    }
    function doEndereco() {
      var h = location.hash.slice(1);
      cat = botoes.some(function (b) { return b.dataset.cat === h; }) ? h : 'todos';
      aplicar();
    }
    botoes.forEach(function (b) {
      b.addEventListener('click', function () {
        cat = b.dataset.cat;
        history.replaceState(null, '', cat === 'todos' ? location.pathname : '#' + cat);
        aplicar();
      });
    });
    busca.addEventListener('input', aplicar);
    addEventListener('hashchange', doEndereco);
    doEndereco();
  })();
})();
