export function LiveIndicator() {
    return (
        <div className="flex items-center gap-2">
            <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="absolute top-0 left-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <span className="text-sm text-muted-foreground">Live</span>
        </div>
    )
}
