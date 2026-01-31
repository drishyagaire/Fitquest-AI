import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <AlertTriangle className="w-16 h-16 text-destructive mx-auto animate-pulse" />
        <h1 className="text-4xl font-display font-bold text-foreground">404</h1>
        <p className="text-muted-foreground">This area is locked or doesn't exist.</p>
        <Link href="/">
          <button className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors mt-4">
            Return to Base
          </button>
        </Link>
      </div>
    </div>
  );
}
