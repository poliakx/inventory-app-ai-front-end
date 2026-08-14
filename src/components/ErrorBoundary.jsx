import { Component } from "react";
import { Button } from "@/components/ui/button";

export class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold tracking-tight">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">
              Try reloading the page. If this keeps happening, let us know.
            </p>
          </div>
          <Button onClick={() => window.location.reload()}>Reload page</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
