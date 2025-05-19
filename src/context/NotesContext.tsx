
import React, { createContext, useState, useContext, useEffect } from 'react';

export interface Folder {
  id: string;
  name: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
}

interface NotesContextType {
  notes: Note[];
  folders: Folder[];
  activeNote: Note | null;
  activeFolder: string;
  setActiveNote: (note: Note | null) => void;
  setActiveFolder: (folderId: string) => void;
  createNote: (folderId: string) => void;
  updateNote: (noteId: string, title: string, content: string) => void;
  deleteNote: (noteId: string) => void;
  createFolder: (name: string) => void;
  deleteFolder: (folderId: string) => void;
  toggleFavorite: (noteId: string) => void;
  searchNotes: (query: string) => Note[];
  duplicateNote: (noteId: string) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

const defaultFolders: Folder[] = [
  { id: 'all', name: 'Wszystkie notatki' },
  { id: 'folder-1', name: 'Osobiste' },
];

const defaultNotes: Note[] = [];

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : defaultNotes;
  });
  
  const [folders, setFolders] = useState<Folder[]>(() => {
    const savedFolders = localStorage.getItem('folders');
    return savedFolders ? JSON.parse(savedFolders) : defaultFolders;
  });
  
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [activeFolder, setActiveFolder] = useState<string>('all');

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('folders', JSON.stringify(folders));
  }, [folders]);

  const createNote = (folderId: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'Nowa notatka',
      content: '',
      folderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorite: false,
    };
    
    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
  };

  const updateNote = (noteId: string, title: string, content: string) => {
    const updatedNotes = notes.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          title,
          content,
          updatedAt: new Date().toISOString(),
        };
      }
      return note;
    });
    
    setNotes(updatedNotes);
    
    if (activeNote && activeNote.id === noteId) {
      setActiveNote({
        ...activeNote,
        title,
        content,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const deleteNote = (noteId: string) => {
    const filteredNotes = notes.filter(note => note.id !== noteId);
    setNotes(filteredNotes);
    
    if (activeNote && activeNote.id === noteId) {
      setActiveNote(filteredNotes[0] || null);
    }
  };

  const createFolder = (name: string) => {
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name,
    };
    
    setFolders([...folders, newFolder]);
  };

  const deleteFolder = (folderId: string) => {
    if (folderId === 'all') return;
    
    const filteredFolders = folders.filter(folder => folder.id !== folderId);
    setFolders(filteredFolders);
    
    // Przenieś notatki z tego folderu do 'all'
    const updatedNotes = notes.map(note => {
      if (note.folderId === folderId) {
        return { ...note, folderId: 'folder-1' };
      }
      return note;
    });
    
    setNotes(updatedNotes);
    
    if (activeFolder === folderId) {
      setActiveFolder('all');
    }
  };

  // Nowa funkcja - oznaczanie notatek jako ulubione
  const toggleFavorite = (noteId: string) => {
    const updatedNotes = notes.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          favorite: !note.favorite,
        };
      }
      return note;
    });
    
    setNotes(updatedNotes);
    
    if (activeNote && activeNote.id === noteId) {
      setActiveNote({
        ...activeNote,
        favorite: !activeNote.favorite,
      });
    }
  };
  
  // Nowa funkcja - wyszukiwanie notatek
  const searchNotes = (query: string): Note[] => {
    if (!query) return [];
    
    const lowercaseQuery = query.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowercaseQuery) || 
      note.content.toLowerCase().includes(lowercaseQuery)
    );
  };
  
  // Nowa funkcja - duplikowanie notatek
  const duplicateNote = (noteId: string) => {
    const noteToDuplicate = notes.find(note => note.id === noteId);
    if (!noteToDuplicate) return;
    
    const duplicatedNote: Note = {
      ...noteToDuplicate,
      id: `note-${Date.now()}`,
      title: `${noteToDuplicate.title} (kopia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setNotes([duplicatedNote, ...notes]);
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        folders,
        activeNote,
        activeFolder,
        setActiveNote,
        setActiveFolder,
        createNote,
        updateNote,
        deleteNote,
        createFolder,
        deleteFolder,
        toggleFavorite,
        searchNotes,
        duplicateNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
