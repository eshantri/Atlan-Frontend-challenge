import { Component, type ReactNode } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <Alert className="border-destructive bg-destructive/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-destructive"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              <AlertDescription className="ml-6">
                <h2 className="text-xl font-semibold text-destructive mb-2">
                  Something went wrong
                </h2>
                <p className="text-muted-foreground mb-4">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <pre className="text-xs bg-background p-3 rounded border border-border overflow-auto mb-4">
                    {this.state.error.stack}
                  </pre>
                )}
                <div className="flex gap-2">
                  <Button onClick={this.handleReset} variant="default">
                    Try Again
                  </Button>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Reload Page
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

