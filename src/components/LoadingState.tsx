import { type FC } from 'react'
import { SpinnerIcon } from './icons'

export const LoadingState: FC = () => {
  return (
    <div className="bg-card text-card-foreground rounded-lg border border-border p-8">
      <div className="flex flex-col items-center justify-center gap-4">
        <SpinnerIcon className="h-8 w-8 text-primary" />
        <p className="text-muted-foreground">Executing query...</p>
      </div>
    </div>
  )
}

