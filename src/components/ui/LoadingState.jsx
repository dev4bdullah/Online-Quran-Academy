export function getPageState(...requests) {
  const failedRequest = requests.find((request) => request.error)
  if (failedRequest) return <p className="empty error">{failedRequest.error}</p>
  if (requests.some((request) => request.loading)) return <p className="empty">Loading…</p>
  return null
}
