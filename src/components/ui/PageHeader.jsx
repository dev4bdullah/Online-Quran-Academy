export default function PageHeader({ title, sub, action, onAction }) {
  return (
    <header className="head">
      <div>
        <h2>{title}</h2>
        <p>{sub}</p>
      </div>
      {action && <button className="btn solid" onClick={onAction}>{action}</button>}
    </header>
  )
}
