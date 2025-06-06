
import React, { useEffect, useState } from 'react';
import { useNotes } from '@/context/NotesContext';
import { ChevronLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export const NoteEditor = () => {
  const { activeNote, updateNote, setActiveNote, toggleFavorite } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const isMobile = useIsMobile();

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
    }
  }, [activeNote]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (activeNote) {
      updateNote(activeNote.id, e.target.value, content);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (activeNote) {
      updateNote(activeNote.id, title, e.target.value);
    }
  };

  if (!activeNote) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center">
        <div className="max-w-md">
          <h2 className="text-2xl font-semibold mb-2">Nie wybrano notatki</h2>
          <p className="text-muted-foreground mb-6">
            Wybierz notatkę z listy lub utwórz nową, aby rozpocząć
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy HH:mm');
  };

  return (
    <div className={cn(
      "h-full flex flex-col",
      isMobile && !activeNote && "hidden",
      isMobile && activeNote && "absolute inset-0 z-20 bg-background"
    )}>
      <div className="p-4 border-b border-border flex items-center">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => setActiveNote(null)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="text-sm text-muted-foreground flex-1">
          Edytowano {formatDate(activeNote.updatedAt)}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={() => activeNote && toggleFavorite(activeNote.id)}
        >
          <Star className={cn("h-5 w-5", activeNote.favorite && "fill-yellow-400 text-yellow-400")} />
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Tytuł notatki"
            className="w-full text-3xl font-semibold bg-transparent border-none outline-none mb-6 p-0 focus:ring-0"
          />
          
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Zacznij pisać..."
            className="w-full min-h-[calc(100vh-220px)] text-lg bg-transparent border-none outline-none resize-none p-0 focus:ring-0"
          />
        </div>
      </div>
    </div>
  );
};
