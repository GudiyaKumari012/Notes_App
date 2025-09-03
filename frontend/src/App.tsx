import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, TextField, Button, List, ListItem, ListItemText,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import './App.css';

interface Note {
  id: number;
  title: string;
  content: string;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get('https://notes-app-iwa9.onrender.com/notes/');
      setNotes(res.data);
    } catch {
      setSnackbar({ open: true, message: 'Failed to fetch notes' });
    }
  };

  const addNote = async () => {
    if (!title || !content) {
      setSnackbar({ open: true, message: 'Title and content required' });
      return;
    }
    await axios.post('https://notes-app-iwa9.onrender.com/notes/', { title, content });
    fetchNotes();
    setTitle(''); setContent('');
    setSnackbar({ open: true, message: 'Note added' });
  };

  const openEdit = (note: Note) => {
    setEditId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setOpen(true);
  };

  const updateNote = async () => {
    if (editId !== null) {
      await axios.put(`https://notes-app-iwa9.onrender.com/notes/${editId}`, { title: editTitle, content: editContent });
      fetchNotes();
      setOpen(false);
      setSnackbar({ open: true, message: 'Note updated' });
    }
  };

  const deleteNote = async (id: number) => {
    if (window.confirm('Delete this note?')) {
      await axios.delete(`https://notes-app-iwa9.onrender.com/notes/${id}`);
      fetchNotes();
      setSnackbar({ open: true, message: 'Note deleted' });
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: 40 }}>
      <h1>Notes App</h1>
      <TextField
        label="Title"
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <TextField
        label="Content"
        value={content}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
        multiline
        style={{ marginRight: 10 }}
      />
      <Button variant="contained" onClick={addNote}>Add Note</Button>
      <List>
        {notes.map(note => (
          <ListItem key={note.id} divider>
            <ListItemText
              primary={note.title}
              secondary={note.content}
            />
            <IconButton onClick={() => openEdit(note)}><Edit /></IconButton>
            <IconButton onClick={() => deleteNote(note.id)}><Delete /></IconButton>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Note</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={editTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTitle(e.target.value)}
            fullWidth
            style={{ marginBottom: 10 }}
          />
          <TextField
            label="Content"
            value={editContent}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditContent(e.target.value)}
            multiline
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={updateNote}>Save</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Container>
  );
}

export default App;