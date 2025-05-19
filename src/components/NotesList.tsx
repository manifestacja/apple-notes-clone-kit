
import React, { useState } from 'react';
import { Plus, Trash2, Star, Copy, Search as SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotes, Note } from '@/context/NotesContext';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';

export const NotesList = () => {
  const { 
    notes, 
    folders, 
    activeNote, 
    setActiveNote, 
    activeFolder, 
    createNote, 
    deleteNote,
    toggleFavorite,
    searchNotes,
    duplicateNote
  } = useNotes();
  
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Note[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Filtruj notatki na podstawie aktywnego folderu
  let filteredNotes = activeFolder === 'all' 
    ? notes 
    : notes.filter(note => note.folderId === activeFolder);
  
  // Jeśli wyszukujemy, pokazujemy wyniki wyszukiwania
  if (isSearching && searchResults.length > 0) {
    filteredNotes = searchResults;
  }

  // Pobierz nazwę folderu
  const folderName = folders.find(folder => folder.id === activeFolder)?.name || 'Wszystkie notatki';

  // Format daty
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      setIsSearching(true);
      const results = searchNotes(query);
      setSearchResults(results);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };
  
  return (
    <div className={cn(
      "border-r border-border h-full flex flex-col",
      isMobile && activeNote ? "hidden" : "block"
    )}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">{isSearching ? 'Wyniki wyszukiwania' : folderName}</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => createNote(activeFolder === 'all' ? 'folder-1' : activeFolder)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative mb-3">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Szukaj notatek..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="text-sm text-muted-foreground">
          {filteredNotes.length} {filteredNotes.length === 1 ? 'notatka' : 
           filteredNotes.length > 1 && filteredNotes.length < 5 ? 'notatki' : 'notatek'}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
            {isSearching ? (
              <p className="text-center mb-4">Brak wyników wyszukiwania</p>
            ) : (
              <>
                <p className="text-center mb-4">Brak notatek w tym folderze</p>
                <Button onClick={() => createNote(activeFolder === 'all' ? 'folder-1' : activeFolder)}>
                  Utwórz notatkę
                </Button>
              </>
            )}
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
                  <h3 className="font-medium line-clamp-1 flex items-center gap-1">
                    {note.favorite && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                    {note.title || 'Bez tytułu'}
                  </h3>
                  <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(note.id);
                      }}
                    >
                      <Star className={cn("h-3 w-3", note.favorite && "fill-yellow-400 text-yellow-400")} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateNote(note.id);
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-2 note-preview">
                  {note.content || 'Brak treści'}
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
