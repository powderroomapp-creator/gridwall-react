export default function ActionBar({ onBuy, onSell, onRent }) {
  return (
    <div className="action-bar">
      <button className="action-btn" onClick={onBuy}>
        <span className="action-icon">⬛</span>
        Buy
      </button>
      <button className="action-btn" onClick={onSell}>
        <span className="action-icon">💰</span>
        Sell
      </button>
      <button className="action-btn" onClick={onRent}>
        <span className="action-icon">📋</span>
        Rent
      </button>
    </div>
  )
}
