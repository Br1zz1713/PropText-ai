export default function DashboardLoading() {
    return (
        <div className="flex min-h-screen bg-[#030712]">
            {/* Sidebar Skeleton */}
            <div className="hidden w-64 border-r border-white/10 bg-[#030712] p-4 lg:block">
                <div className="mb-8 flex items-center gap-2 px-2">
                    <div className="h-8 w-8 animate-pulse rounded-lg bg-white/10" />
                    <div className="h-6 w-32 animate-pulse rounded bg-white/10" />
                </div>
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-white/5" />
                    ))}
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="flex-1">
                {/* Header Skeleton */}
                <div className="flex h-16 items-center justify-between border-b border-white/10 bg-[#030712] px-8">
                    <div className="h-8 w-48 animate-pulse rounded bg-white/10" />
                    <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />
                </div>

                {/* Page Content Skeleton */}
                <div className="p-8">
                    <div className="mb-8 h-10 w-64 animate-pulse rounded bg-white/10" />
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-64 animate-pulse rounded-xl bg-white/5 border border-white/5" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
