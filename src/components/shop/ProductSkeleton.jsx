export function SkeletonSidebar() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="skeleton h-6 w-40"></div>
          <div className="mt-5 space-y-3">
            <div className="skeleton h-14 w-full rounded-xl"></div>
            <div className="skeleton h-14 w-full rounded-xl"></div>
            <div className="skeleton h-14 w-3/4 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonMain() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="skeleton h-44 w-full rounded-2xl"></div>
          <div className="skeleton mt-5 h-5 w-3/4"></div>
          <div className="skeleton mt-3 h-4 w-1/2"></div>
          <div className="skeleton mt-6 h-12 w-full rounded-full"></div>
        </div>
      ))}
    </div>
  );
}