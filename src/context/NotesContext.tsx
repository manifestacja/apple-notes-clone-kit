
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
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

const defaultFolders: Folder[] = [
  { id: 'all', name: 'All Notes' },
  { id: 'folder-1', name: 'Personal' },
  { id: 'folder-2', name: 'Work' },
];

const defaultNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Welcome to Notes',
    content: 'This is a simple notes app inspired by Apple Notes. You can create, edit, and organize your notes in folders.',
    folderId: 'folder-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'note-2',
    title: 'Getting Started',
    content: '1. Create a new note using the + button\n2. Organize notes in folders\n3. Click on a note to edit it',
    folderId: 'folder-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'note-3',
    title: 'Work Tasks',
    content: '- Complete project documentation\n- Schedule team meeting\n- Review pull requests',
    folderId: 'folder-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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
      title: 'Untitled Note',
      content: '',
      folderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
    
    // Move notes from this folder to 'all'
    const updatedNotes = notes.map(note => {
      if (note.folderId === folderId) {
        return { ...note, folderId: 'all' };
      }
      return note;
    });
    
    setNotes(updatedNotes);
    
    if (activeFolder === folderId) {
      setActiveFolder('all');
    }
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
