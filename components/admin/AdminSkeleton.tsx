export function ContentSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="h-10 w-64 rounded-lg bg-[#E9E1D3]" />
      <div className="mt-3 h-5 w-96 max-w-full rounded bg-[#EFE8DD]" />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-white" />
        ))}
      </div>
      <div className="mt-6 h-96 rounded-2xl bg-white" />
    </div>
  );
}

export default function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-[#F7F4EE]">
      <div className="fixed inset-y-0 left-0 hidden w-72 border-r border-[#E5DEC9] bg-white lg:block" />
      <div className="h-16 border-b border-[#E5DEC9] bg-white lg:hidden" />
      <div className="lg:pl-72">
        <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <ContentSkeleton />
        </div>
      </div>
    </div>
  );
}
