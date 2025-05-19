
import React, { useState } from 'react';
import { Folder as FolderIcon, Plus, ChevronRight, ChevronDown, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotes, Folder } from '@/context/NotesContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export const NotesSidebar = () => {
  const { folders, activeFolder, setActiveFolder, createFolder, deleteFolder, createNote } = useNotes();
  const [newFolderName, setNewFolderName] = useState('');
  const [isFoldersOpen, setIsFoldersOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName('');
      setDialogOpen(false);
    }
  };

  return (
    <div className="h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Notes</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => createNote(activeFolder === 'all' ? 'folder-1' : activeFolder)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-4">
          <div 
            className={cn(
              "px-2 py-1.5 mb-1 rounded-md flex items-center cursor-pointer",
              activeFolder === 'all' ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50"
            )}
            onClick={() => setActiveFolder('all')}
          >
            <FolderIcon className="h-4 w-4 mr-2" />
            <span>All Notes</span>
          </div>
        </div>

        <div className="mb-2">
          <div 
            className="flex items-center px-2 py-1 cursor-pointer"
            onClick={() => setIsFoldersOpen(!isFoldersOpen)}
          >
            {isFoldersOpen ? (
              <ChevronDown className="h-4 w-4 mr-1" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm font-medium">Folders</span>
          </div>

          {isFoldersOpen && (
            <div className="ml-4 mt-1 space-y-1">
              {folders.filter(folder => folder.id !== 'all').map((folder) => (
                <div 
                  key={folder.id}
                  className={cn(
                    "px-2 py-1.5 rounded-md flex items-center justify-between group cursor-pointer",
                    activeFolder === folder.id ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50"
                  )}
                  onClick={() => setActiveFolder(folder.id)}
                >
                  <div className="flex items-center">
                    <FolderIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{folder.name}</span>
                  </div>
                  {folder.id !== 'all' && folder.id !== 'folder-1' && folder.id !== 'folder-2' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFolder(folder.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <div 
                    className="px-2 py-1.5 rounded-md flex items-center text-sm text-muted-foreground hover:bg-sidebar-accent/50 cursor-pointer"
                  >
                    <Plus className="h-3 w-3 mr-2" />
                    <span>New Folder</span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <Input 
                      placeholder="Folder name" 
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateFolder}>Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
