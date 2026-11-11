export default function ProgressBar({ value }) {
  return (
    <div className="bar">
      <i style={{ width: `${value}%` }} />
    </div>
  )
}
