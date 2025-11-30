import { type FC } from 'react'
import { Alert, AlertDescription } from './ui/alert'
import { AlertCircleIcon } from './icons'

interface ErrorAlertProps {
  error: string
}

export const ErrorAlert: FC<ErrorAlertProps> = ({ error }) => {
  return (
    <Alert className="border-destructive bg-destructive/10">
      <AlertCircleIcon className="text-destructive" />
      <AlertDescription>
        <strong className="text-destructive">Query Error:</strong>
        <p className="text-destructive-foreground mt-1">{error}</p>
      </AlertDescription>
    </Alert>
  )
}

