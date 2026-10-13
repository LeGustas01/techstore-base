import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import ProdutoCard from '../components/ProdutoCard'
import { formatarPreco } from '../utils/formatarPreco'
import { calcularFaltaParaFreteGratis, temFreteGratis } from '../utils/frete'

export default function PaginaProduto({ produtos, clienteAtual, onAdicionar, onRegistrarEspera }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [nome, setNome] = useState(clienteAtual?.nome ?? '')
  const [email, setEmail] = useState(clienteAtual?.email ?? '')
  const [mensagemEspera, setMensagemEspera] = useState('')

  useEffect(() => {
    if (clienteAtual) {
      setNome(clienteAtual.nome)
      setEmail(clienteAtual.email)
    }
  }, [clienteAtual])

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const precoNumerico = Number(produto.price)
  const temPreco = Number.isFinite(precoNumerico)
  const faltaFrete = temPreco ? calcularFaltaParaFreteGratis(precoNumerico) : null
  const relacionados = produtos
    .filter(
      (item) =>
        item.category === produto.category &&
        item.id !== produto.id &&
        Number(item.estoque) > 0 &&
        Number.isFinite(Number(item.price))
    )
    .slice(0, 4)

  function enviarAviso(evento) {
    evento.preventDefault()

    if (!nome.trim() || !email.trim()) {
      setMensagemEspera('Informe seu nome e e-mail para receber o aviso.')
      return
    }

    onRegistrarEspera({ produtoId: produto.id, nome, email })
    setMensagemEspera('Você foi adicionado à lista de espera para esse produto.')
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">{temPreco ? formatarPreco(precoNumerico) : 'Preço indisponível'}</p>
          {temPreco && (
            <p className="detalhe-frete">
              {temFreteGratis(precoNumerico)
                ? 'Frete grátis'
                : `Faltam ${formatarPreco(faltaFrete)} para frete grátis`}
            </p>
          )}
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">{produto.estoque} unidades disponíveis</p>

          {produto.estoque === 0 ? (
            <form className="aviso-esgotado" onSubmit={enviarAviso}>
              <p className="aviso-esgotado-titulo">Produto esgotado</p>
              <label>
                Nome
                <input value={nome} onChange={(evento) => setNome(evento.target.value)} />
              </label>
              <label>
                E-mail
                <input
                  type="email"
                  value={email}
                  onChange={(evento) => setEmail(evento.target.value)}
                />
              </label>
              <button type="submit" className="botao botao-grande">
                Avise-me quando voltar
              </button>
              {mensagemEspera && <p className="mensagem-espera">{mensagemEspera}</p>}
            </form>
          ) : (
            <button
              className="botao botao-grande"
              onClick={() => onAdicionar(produto)}
              disabled={!temPreco}
            >
              {temPreco ? 'Adicionar ao carrinho' : 'Preço indisponível'}
            </button>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <ProdutoCard key={item.id} produto={item} onAdicionar={onAdicionar} />
        ))}
      </div>
    </section>
  )
}
