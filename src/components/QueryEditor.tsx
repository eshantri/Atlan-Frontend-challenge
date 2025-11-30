import { type FC, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import CodeEditor from '@uiw/react-textarea-code-editor'
import { FormatIcon, SaveIcon, PlayIcon, SpinnerIcon } from './icons'

interface QueryEditorProps {
  query: string
  onQueryChange: (query: string, markAsUnsaved?: boolean) => void
  onRunQuery: () => void
  onSaveQuery?: (name: string, description?: string) => void
  isLoading?: boolean
}

const QueryEditor: FC<QueryEditorProps> = ({ query, onQueryChange, onRunQuery, onSaveQuery, isLoading = false }) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [queryName, setQueryName] = useState('')
  const [queryDescription, setQueryDescription] = useState('')

  // Format SQL query (simple formatting)
  const formatQuery = () => {
    const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'ON', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'LIMIT', 'OFFSET', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'AS', 'IN', 'NOT', 'NULL', 'DISTINCT', 'HAVING', 'UNION', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END']
    
    let formatted = query
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      formatted = formatted.replace(regex, keyword)
    })
    
    // Add basic indentation
    formatted = formatted
      .replace(/SELECT/gi, 'SELECT\n  ')
      .replace(/FROM/gi, '\nFROM\n  ')
      .replace(/WHERE/gi, '\nWHERE\n  ')
      .replace(/JOIN/gi, '\nJOIN\n  ')
      .replace(/ORDER BY/gi, '\nORDER BY\n  ')
      .replace(/GROUP BY/gi, '\nGROUP BY\n  ')
      .replace(/LIMIT/gi, '\nLIMIT ')
      .replace(/\s+/g, ' ')
      .trim()
    
    onQueryChange(formatted, false)
  }

  const handleSaveQuery = () => {
    if (!queryName.trim()) return
    
    onSaveQuery?.(queryName.trim(), queryDescription.trim() || undefined)
    setShowSaveDialog(false)
    setQueryName('')
    setQueryDescription('')
  }

  return (
    <>
    <div className="bg-card text-card-foreground rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Query Editor</h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={formatQuery}
            disabled={isLoading}
            variant="outline"
            size="default"
            className="h-10"
          >
            <FormatIcon className="mr-2" />
            Format
          </Button>
          {onSaveQuery && (
            <Button
              onClick={() => setShowSaveDialog(true)}
              disabled={isLoading || !query.trim()}
              variant="outline"
              size="default"
              className="h-10"
            >
              <SaveIcon className="mr-2" />
              Save
            </Button>
          )}
          <Button
            onClick={onRunQuery}
            disabled={isLoading}
            size="default"
            className="h-10"
          >
            {isLoading ? (
              <>
                <SpinnerIcon className="mr-2 h-4 w-4" />
                Running...
              </>
            ) : (
              <>
                <PlayIcon className="mr-2" />
                Run Query
              </>
            )}
          </Button>
        </div>
      </div>
      <CodeEditor
        value={query}
        language="sql"
        placeholder="Enter your SQL query here..."
        onChange={(evn) => onQueryChange(evn.target.value)}
        disabled={isLoading}
        padding={15}
        style={{
          fontSize: 13,
          fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace',
          backgroundColor: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          borderRadius: '0.375rem',
          border: '1px solid hsl(var(--input))',
          minHeight: '128px'
        }}
        className="code-editor"
      />
    </div>

    {/* Save Query Dialog */}
    <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Query</DialogTitle>
          <DialogDescription>
            Give your query a name and optional description to save it for later use.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="query-name" className="text-sm font-medium">
              Query Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="query-name"
              placeholder="e.g., Get all active users"
              value={queryName}
              onChange={(e) => setQueryName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && queryName.trim()) {
                  handleSaveQuery()
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="query-description" className="text-sm font-medium">
              Description <span className="text-muted-foreground text-xs">(optional)</span>
            </label>
            <Input
              id="query-description"
              placeholder="e.g., Retrieves all users with active status"
              value={queryDescription}
              onChange={(e) => setQueryDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveQuery} disabled={!queryName.trim()}>
            Save Query
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}

export default QueryEditor

