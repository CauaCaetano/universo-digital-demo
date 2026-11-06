// Menu, entrada suave, vitrine do banner, foto dos serviços, formulário de orçamento e catálogo.
(function () {
  'use strict';
  var WHATS = '0'; // número público; confirmar com a loja
  var PROBLEMAS = {
    notebook: ['Lento ou travando', 'Não liga', 'Com vírus ou precisa formatar', 'Esquentando muito', 'Perdi ou queimei a fonte', 'Dobradiça quebrada', 'Quero SSD ou mais memória'],
    computador: ['Lento ou travando', 'Não liga', 'Com vírus ou precisa formatar', 'Esquentando muito', 'Quero SSD, memória ou placa de vídeo'],
    impressora: ['Não imprime', 'Imprime com falhas', 'Precisa de limpeza', 'Preciso de suprimentos'],
  };
  var calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DEMO = document.documentElement.dataset.demo === '1';
  function painel(titulo, texto, msg) {
    var d = document.querySelector('dialog.sim');
    if (!d) {
      d = document.createElement('dialog');
      d.className = 'sim';
      d.innerHTML = '<div class="sim-chat"><p></p></div><div class="sim-txt"><h2></h2><p></p><button class="bt bt-laranja" type="button">Fechar</button></div>';
      document.body.appendChild(d);
      d.querySelector('button').addEventListener('click', function () { d.close(); });
    }
    d.querySelector('.sim-chat').hidden = !msg;
    d.querySelector('.sim-chat p').textContent = msg || '';
    d.querySelector('.sim-txt h2').textContent = titulo;
    d.querySelector('.sim-txt p').textContent = texto;
    d.showModal();
  }
  var zap = function (msg) {
    if (DEMO) { painel('É assim que o pedido chega na loja', 'Demonstração: nenhuma mensagem foi enviada. No site final, o cliente cai direto no WhatsApp da loja com este texto.', msg); return; }
    window.open('https://wa.me/' + WHATS + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  };
  document.addEventListener('click', function (e) {
    var s = e.target.closest('[data-sim]'), f = e.target.closest('[data-falta]');
    if (s) { e.preventDefault(); zap('Olá, Universo Digital! Gostaria de mais informações.'); }
    if (f) { e.preventDefault(); painel(f.dataset.falta + ' da loja', 'Este botão recebe o endereço verdadeiro quando a loja informar.'); }
  });
  document.documentElement.classList.add('js');
  if (calmo) [].forEach.call(document.querySelectorAll('video'), function (v) { v.removeAttribute('autoplay'); v.pause(); });

  var rv = [].slice.call(document.querySelectorAll('.rv'));
  if ('IntersectionObserver' in window && !calmo) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('visto'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('visto'); });

  var vit = [].slice.call(document.querySelectorAll('.banner-vit img'));
  if (vit.length) {
    var at = 0;
    vit[0].classList.add('on');
    if (!calmo) setInterval(function () { vit[at].classList.remove('on'); at = (at + 1) % vit.length; vit[at].classList.add('on'); }, 3800);
  }

  var bt = document.querySelector('.menu-bt'), menu = document.getElementById('menu');
  bt.addEventListener('click', function () {
    var aberto = menu.classList.toggle('aberto');
    bt.setAttribute('aria-expanded', aberto);
    bt.textContent = aberto ? 'Fechar' : 'Menu';
  });

  var fotoSv = document.getElementById('sv-img');
  if (fotoSv) [].forEach.call(document.querySelectorAll('.sv-linha'), function (l, i, todas) {
    var mostra = function () { [].forEach.call(todas, function (o) { o.classList.toggle('ativo', o === l); }); fotoSv.src = l.dataset.foto; };
    l.addEventListener('mouseenter', mostra);
    l.addEventListener('focusin', mostra);
    if (i === 0) l.classList.add('ativo');
  });

  var form = document.getElementById('orcamento');
  if (form) (function () {
    var caixa = document.getElementById('problemas'), saida = document.getElementById('mensagem'), visita = document.getElementById('onde-visita'), erro = document.getElementById('erro');
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
      var ap = valor('aparelho'), nome = form.nome.value.trim(), tel = form.tel.value.trim(), obs = form.obs.value.trim();
      var onde = valor('onde') === 'visita' ? 'Gostaria de uma visita técnica.' : 'Posso levar até a loja.';
      return 'Olá, Universo Digital!' + (nome ? ' Sou ' + nome + '.' : '') + ' Preciso de ajuda com ' + (ap === 'impressora' ? 'minha ' : 'meu ') + ap + ': ' + valor('problema') + '. ' + onde + (obs ? ' ' + obs : '') + (tel ? ' Meu WhatsApp: ' + tel + '.' : '') + ' Pode me passar um orçamento?';
    }
    form.addEventListener('change', function (e) { if (e.target.name === 'aparelho') problemas(0); saida.textContent = texto(); });
    form.addEventListener('input', function () { saida.textContent = texto(); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = form.nome.value.trim().length < 2, t = form.tel.value.replace(/\D/g, '').length < 10;
      form.nome.setAttribute('aria-invalid', n);
      form.tel.setAttribute('aria-invalid', t);
      erro.textContent = n ? 'Escreva o seu nome.' : t ? 'Confira o WhatsApp, com DDD.' : '';
      if (n) { form.nome.focus(); return; }
      if (t) { form.tel.focus(); return; }
      zap(texto());
    });
    problemas(Number(form.dataset.prob) || 0);
    saida.textContent = texto();
  })();

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-pedido]');
    if (!b) return;
    var campo = document.getElementById('busca');
    var item = b.dataset.pedido || (campo ? campo.value.trim() : '');
    zap(item ? 'Olá, Universo Digital! Vocês têm ' + item + ' disponível? Qual é o preço?' : 'Olá, Universo Digital! Estou procurando um produto. Pode me ajudar?');
  });

  // lista de produtos consultados: o carrinho do topo manda todos juntos pelo WhatsApp
  var minhaLista = [];
  try { minhaLista = JSON.parse(sessionStorage.getItem('ud-lista') || '[]'); } catch (x) { /* sem armazenamento */ }
  function contarLista() { var n = document.getElementById('lista-n'); if (n) n.textContent = minhaLista.length; }
  contarLista();
  document.addEventListener('click', function (e) {
    var p = e.target.closest('[data-pedido]');
    if (p && p.dataset.pedido && minhaLista.indexOf(p.dataset.pedido) < 0) {
      minhaLista.push(p.dataset.pedido);
      try { sessionStorage.setItem('ud-lista', JSON.stringify(minhaLista)); } catch (x) { /* sem armazenamento */ }
      contarLista();
    }
    if (e.target.closest('[data-lista]')) {
      if (!minhaLista.length) painel('Sua lista está vazia', 'Toque em Consultar no WhatsApp em um produto e ele aparece aqui.');
      else zap('Olá, Universo Digital! Tenho interesse em: ' + minhaLista.join(', ') + '. Vocês têm disponível? Qual é o valor?');
    }
    if (e.target.closest('[data-conta]')) painel('Minha conta', 'A área do cliente entra quando a loja começar a vender pelo site. Por enquanto, as consultas são pelo WhatsApp.');
    var aba = e.target.closest('[data-aba]');
    if (aba) {
      [].forEach.call(document.querySelectorAll('[data-aba]'), function (b) { b.setAttribute('aria-pressed', b === aba); });
      [].forEach.call(document.querySelectorAll('[data-lista-aba]'), function (l) { l.hidden = l.dataset.listaAba !== aba.dataset.aba; });
    }
  });

  // no celular o texto inteiro não cabe no campo de busca
  var campoBusca = document.getElementById('q');
  if (campoBusca && matchMedia('(max-width: 820px)').matches) campoBusca.placeholder = 'O que você procura?';
  // no início, o formulário longo fica recolhido no celular
  var orcDet = document.querySelector('.orc-det');
  if (orcDet && matchMedia('(max-width: 820px)').matches) orcDet.open = false;

  var vitrine = document.querySelector('.vitrine');
  if (vitrine) (function () {
    var sl = vitrine.querySelectorAll('.vit-slide'), pt = vitrine.querySelectorAll('.vit-pontos button'), at = 0, tempo;
    function ir(n) {
      at = (n + sl.length) % sl.length;
      [].forEach.call(sl, function (x, i) { x.classList.toggle('on', i === at); });
      [].forEach.call(pt, function (x, i) { x.classList.toggle('on', i === at); });
    }
    function girar() { clearInterval(tempo); if (!calmo) tempo = setInterval(function () { ir(at + 1); }, 6000); }
    vitrine.querySelector('.vit-ant').addEventListener('click', function () { ir(at - 1); girar(); });
    vitrine.querySelector('.vit-prox').addEventListener('click', function () { ir(at + 1); girar(); });
    [].forEach.call(pt, function (x, i) { x.addEventListener('click', function () { ir(i); girar(); }); });
    vitrine.addEventListener('mouseenter', function () { clearInterval(tempo); });
    vitrine.addEventListener('mouseleave', girar);
    vitrine.addEventListener('focusin', function () { clearInterval(tempo); });
    girar();
  })();

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
    botoes.forEach(function (b) { b.addEventListener('click', function () { cat = b.dataset.cat; aplicar(); }); });
    busca.addEventListener('input', aplicar);
    var q = new URLSearchParams(location.search).get('q') || '';
    busca.value = q;
    var campoTopo = document.getElementById('q');
    if (campoTopo) campoTopo.value = q;
    aplicar();
  })();
})();
