export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="h-8 w-48 bg-slate-800 rounded animate-pulse mb-5" />
      <div className="h-12 bg-slate-800 rounded-lg animate-pulse mb-5" />
      <div className="flex flex-col md:flex-row gap-5">
        <div className="w-full md:w-56 shrink-0 h-96 bg-slate-800 rounded-lg animate-pulse" />
        <div className="flex-1">
          <div className="h-4 w-32 bg-slate-800 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="aspect-[59/86] bg-slate-800 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
