import { Brain, BarChart3 } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Brain className="h-8 w-8 text-primary" />
              <BarChart3 className="absolute -bottom-1 -right-1 h-4 w-4 text-blue-500" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight">InsightBoard</h1>
              <p className="text-xs text-muted-foreground">AI Dashboard</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>Connected</span>
          </div>
        </div>
      </div>
    </header>
  );
}