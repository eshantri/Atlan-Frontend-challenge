import { type FC } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface KeyboardShortcutsHelpProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const shortcuts = [
  {
    category: 'Query Execution',
    items: [
      { keys: ['Cmd/Ctrl', 'Enter'], description: 'Run current query' },
    ]
  },
  {
    category: 'Tab Management',
    items: [
      { keys: ['Alt', 'N'], description: 'New query tab' },
      { keys: ['Alt', 'W'], description: 'Close current tab' },
      { keys: ['Cmd/Ctrl', 'Shift', ']'], description: 'Next tab' },
      { keys: ['Cmd/Ctrl', 'Shift', '['], description: 'Previous tab' },
    ]
  },
  {
    category: 'General',
    items: [
      { keys: ['Cmd/Ctrl', '/'], description: 'Show keyboard shortcuts' },
      { keys: ['Esc'], description: 'Close dialogs' },
    ]
  }
]

const KeyboardShortcutsHelp: FC<KeyboardShortcutsHelpProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Master these shortcuts to work faster and more efficiently
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((shortcut, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent transition-colors"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIdx) => (
                        <div key={keyIdx} className="flex items-center gap-1">
                          <Badge variant="outline" className="font-mono text-xs px-2 py-1">
                            {key}
                          </Badge>
                          {keyIdx < shortcut.keys.length - 1 && (
                            <span className="text-muted-foreground text-xs">+</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Tip: Press <Badge variant="outline" className="mx-1 font-mono text-xs">Cmd/Ctrl</Badge> + 
            <Badge variant="outline" className="mx-1 font-mono text-xs">/</Badge> anytime to view this help
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default KeyboardShortcutsHelp

