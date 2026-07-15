"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onReset?: () => void;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              this.props.onReset?.();
            }}
          >
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
