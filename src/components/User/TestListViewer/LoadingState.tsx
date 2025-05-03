import { Skeleton } from "primereact/skeleton"

export default function LoadingState() {
  return (
    <div className="grid">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={`skeleton-${index}`} className="col-12 sm:col-6 lg:col-4 p-2">
          <Skeleton width="100%" height="360px" borderRadius="10px" />
        </div>
      ))}
    </div>
  )
}
