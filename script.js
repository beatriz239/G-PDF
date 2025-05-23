let produtos = [];

    function adicionarProduto() {
      const item = document.getElementById('item').value.trim();
      const quantidade = parseInt(document.getElementById('quantidade').value);
      const valor = parseFloat(document.getElementById('valor').value);

      if (!item || isNaN(quantidade) || quantidade <= 0 || isNaN(valor) || valor <= 0) {
        alert('Preencha corretamente o item, quantidade e valor.');
        return;
      }

      produtos.push({ item, quantidade, valor });
      atualizarTabelaProdutos();
      limparCamposProduto();
    }

    function atualizarTabelaProdutos() {
      const tbody = document.querySelector('#tabela-produtos tbody');
      tbody.innerHTML = '';

      produtos.forEach((produto, index) => {
        const total = produto.quantidade * produto.valor;

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${produto.item}</td>
          <td>${produto.quantidade}</td>
          <td>R$ ${produto.valor.toFixed(2)}</td>
          <td>R$ ${total.toFixed(2)}</td>
          <td><button type="button" onclick="removerProduto(${index})">Remover</button></td>
        `;

        tbody.appendChild(tr);
      });
    }

    function removerProduto(index) {
      produtos.splice(index, 1);
      atualizarTabelaProdutos();
    }

    function limparCamposProduto() {
      document.getElementById('item').value = '';
      document.getElementById('quantidade').value = '';
      document.getElementById('valor').value = '';
      document.getElementById('item').focus();
    }

    function gerarRelatorio() {
      const empresa = document.getElementById('empresa').value.trim();
      const data = document.getElementById('data').value;
      const obs = document.getElementById('observacoes').value.trim();
      const solicitante = document.getElementById('solicitante').value.trim();
      const aprovador = document.getElementById('aprovador').value.trim();

      if (!empresa || !data) {
        alert('Preencha os dados da empresa e a data.');
        return false;
      }

      if (produtos.length === 0) {
        alert('Adicione pelo menos um produto.');
        return false;
      }

      document.getElementById('r_empresa').textContent = empresa;
      document.getElementById('r_data').textContent = data;

      const tbodyRelatorio = document.getElementById('r_itens');
      tbodyRelatorio.innerHTML = '';

      let somaTotal = 0;

      produtos.forEach(produto => {
        const total = produto.quantidade * produto.valor;
        somaTotal += total;

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${produto.item}</td>
          <td>${produto.quantidade}</td>
          <td>R$ ${produto.valor.toFixed(2)}</td>
          <td>R$ ${total.toFixed(2)}</td>
        `;

        tbodyRelatorio.appendChild(tr);
      });

      // Linha do total geral
      const trTotal = document.createElement('tr');
      trTotal.innerHTML = `
        <td colspan="3" style="text-align: right;"><strong>Total Geral:</strong></td>
        <td><strong>R$ ${somaTotal.toFixed(2)}</strong></td>
      `;
      tbodyRelatorio.appendChild(trTotal);

      document.getElementById('r_observacoes').textContent = obs;
      document.getElementById('r_solicitante').textContent = solicitante;
      document.getElementById('r_aprovador').textContent = aprovador;

      document.getElementById('relatorio').style.display = 'block';

      return true;
    }

    function gerarPDF() {
      if (gerarRelatorio()) {
        const relatorio = document.getElementById('relatorio');
        const opt = {
          margin: 0.5,
          filename: 'pedido-de-compra.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(relatorio).save();
      }
    }

    function imprimirRelatorio() {
      if (gerarRelatorio()) {
        window.print();
      }
    }