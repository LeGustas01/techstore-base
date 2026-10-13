import { Link } from 'react-router'
import { formatarPreco } from '../utils/formatarPreco'
import { calcularFaltaParaFreteGratis, temFreteGratis } from '../utils/frete'

export default function ProdutoCard({ produto, onAdicionar }) {
  const esgotado = Number(produto.estoque) === 0
  const precoNumerico = Number(produto.price)
  const temPreco = Number.isFinite(precoNumerico)
  const faltaFrete = temPreco ? calcularFaltaParaFreteGratis(precoNumerico) : null

  return (
    <article className="card">
      <Link to={`/produto/${produto.id}`} className="card-link">
        <div className="card-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="card-imagem" />
        </div>
        <h3 className="card-titulo">{produto.title}</h3>
      </Link>

      <p className="card-avaliacao">
        ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
      </p>

      <div className="card-precos">
        {produto.precoOriginal && (
          <span className="preco-original">{formatarPreco(produto.precoOriginal)}</span>
        )}
        <span className="preco">{temPreco ? formatarPreco(precoNumerico) : 'Preço indisponível'}</span>
      </div>

      <div className="card-selos">
        {temPreco && temFreteGratis(precoNumerico) && (
          <span className="selo selo-frete">Frete grátis</span>
        )}
        {temPreco && !temFreteGratis(precoNumerico) && faltaFrete > 0 && (
          <span className="selo selo-frete">Faltam {formatarPreco(faltaFrete)} para frete grátis</span>
        )}
        {esgotado && <span className="selo selo-esgotado">Esgotado</span>}
        {!temPreco && <span className="selo selo-alerta">Sem preço</span>}
      </div>

      <button className="botao" onClick={() => onAdicionar(produto)} disabled={esgotado || !temPreco}>
        Adicionar ao carrinho
      </button>
    </article>
  )
}
