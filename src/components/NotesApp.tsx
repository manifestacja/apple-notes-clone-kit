
import React from 'react';
import { NotesProvider } from '@/context/NotesContext';
import { NotesSidebar } from '@/components/NotesSidebar';
import { NotesList } from '@/components/NotesList';
import { NoteEditor } from '@/components/NoteEditor';
import { useIsMobile } from '@/hooks/use-mobile';

export const NotesApp = () => {
  const isMobile = useIsMobile();
  
  return (
    <NotesProvider>
      <div className="flex h-screen bg-background">
        {!isMobile && (
          <div className="w-64 shrink-0 h-full">
            <NotesSidebar />
          </div>
        )}
        
        <div className="w-72 shrink-0 h-full">
          <NotesList />
        </div>
        
        <div className="flex-1 h-full overflow-hidden">
          <NoteEditor />
        </div>
      </div>
    </NotesProvider>
  );
};
