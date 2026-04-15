"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class DashboardErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Dashboard Runtime Error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-background border border-border rounded-[2.5rem] animate-fade-in shadow-xl shadow-red-500/5">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-text mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Something went wrong
          </h2>
          <p className="text-text-secondary max-w-md mx-auto mb-8 text-sm leading-relaxed">
            A component in the dashboard failed to load. This might be due to a missing configuration or a temporary connection issue.
          </p>
          
          {this.state.error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/10 rounded-xl text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">Technical Details</p>
              <p className="text-xs font-mono text-red-600 dark:text-red-400 break-all">{this.state.error.message}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => this.setState({ hasError: false })}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </button>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-background-tertiary text-text hover:bg-border/50 px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
            >
              <Home className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
