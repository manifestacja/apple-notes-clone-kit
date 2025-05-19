
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotes, Note } from '@/context/NotesContext';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

export const NotesList = () => {
  const { notes, folders, activeNote, setActiveNote, activeFolder, createNote, deleteNote } = useNotes();
  const isMobile = useIsMobile();
  
  // Filter notes based on active folder
  const filteredNotes = activeFolder === 'all' 
    ? notes 
    : notes.filter(note => note.folderId === activeFolder);
  
  // Get folder name
  const folderName = folders.find(folder => folder.id === activeFolder)?.name || 'All Notes';

  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className={cn(
      "border-r border-border h-full flex flex-col",
      isMobile && activeNote ? "hidden" : "block"
    )}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">{folderName}</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => createNote(activeFolder === 'all' ? 'folder-1' : activeFolder)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
            <p className="text-center mb-4">No notes in this folder</p>
            <Button onClick={() => createNote(activeFolder === 'all' ? 'folder-1' : activeFolder)}>
              Create a note
            </Button>
          </div>
        ) : (
          <div>
            {filteredNotes.map((note) => (
              <div 
                key={note.id}
                className={cn(
                  "p-4 border-b border-border cursor-pointer group",
                  activeNote?.id === note.id ? "bg-accent/50" : "hover:bg-accent/30"
                )}
                onClick={() => setActiveNote(note)}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium line-clamp-1">
                    {note.title || 'Untitled Note'}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground mb-2 note-preview">
                  {note.content || 'No additional text'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(note.updatedAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
