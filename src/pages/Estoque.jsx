// Página usada pelo time de estoque para acompanhar a quantidade de cada produto
export default function Estoque({ produtos, esperas }) {
  // slice cria uma cópia, para o sort não alterar a lista original
  const ordenados = produtos.slice().sort((a, b) => a.estoque - b.estoque)

  const esperasPorProduto = esperas.reduce((acumulador, registro) => {
    if (!acumulador[registro.produtoId]) {
      acumulador[registro.produtoId] = []
    }

    acumulador[registro.produtoId].push({ nome: registro.nome, email: registro.email })
    return acumulador
  }, {})

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Estoque</h1>
      <p className="aviso">Produtos com menos de 5 unidades precisam de reposição.</p>

      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Unidades</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.title}</td>
                <td>{produto.category}</td>
                <td>{produto.estoque}</td>
                <td>
                  {produto.estoque === 0 && <span className="selo selo-esgotado">Esgotado</span>}
                  {produto.estoque > 0 && produto.estoque < 5 && (
                    <span className="selo selo-alerta">Repor</span>
                  )}
                  {produto.estoque >= 5 && <span className="selo selo-ok">OK</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Clientes na lista de espera</h2>
      {Object.keys(esperasPorProduto).length === 0 ? (
        <p className="aviso">Nenhum cliente aguardando retorno no momento.</p>
      ) : (
        <div className="tabela-moldura">
          <table className="tabela">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Nome</th>
                <th>E-mail</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(esperasPorProduto).map(([produtoId, clientesNaEspera]) => {
                const produto = produtos.find((item) => item.id === produtoId)

                return clientesNaEspera.map((cliente) => (
                  <tr key={`${produtoId}-${cliente.email}`}>
                    <td>{produto ? produto.title : 'Produto removido'}</td>
                    <td>{cliente.nome}</td>
                    <td>{cliente.email}</td>
                  </tr>
                ))
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
