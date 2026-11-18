export default function AuthSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="h-4 w-24 rounded bg-[#F3EEE4]" />
      <div className="mt-3 h-10 w-2/3 rounded-lg bg-[#EFE8DD]" />
      <div className="mt-3 h-5 w-full rounded bg-[#F3EEE4]" />
      <div className="mt-8 space-y-5">
        <div className="h-14 rounded-2xl bg-[#F3EEE4]" />
        <div className="h-12 rounded-xl bg-[#F3EEE4]" />
        <div className="h-12 rounded-xl bg-[#F3EEE4]" />
        <div className="h-13 rounded-xl bg-[#EFE8DD]" />
      </div>
    </div>
  );
}
