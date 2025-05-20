
import React from 'react';
import { NotesProvider } from '@/context/NotesContext';
import { NotesSidebar } from '@/components/NotesSidebar';
import { NotesList } from '@/components/NotesList';
import { NoteEditor } from '@/components/NoteEditor';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export const NotesApp = () => {
  const isMobile = useIsMobile();
  
  return (
    <NotesProvider>
      <div className="flex h-screen bg-background">
        {!isMobile ? (
          <div className="w-64 shrink-0 h-full">
            <NotesSidebar />
          </div>
        ) : (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <NotesSidebar />
            </SheetContent>
          </Sheet>
        )}
        
        <div className={`${isMobile ? 'w-full' : 'w-72'} shrink-0 h-full`}>
          <NotesList />
        </div>
        
        <div className="flex-1 h-full overflow-hidden">
          <NoteEditor />
        </div>
      </div>
    </NotesProvider>
  );
};
