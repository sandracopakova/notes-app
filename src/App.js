import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import { nanoid } from "nanoid";

function arrayMove(arr, fromIndex, toIndex) {
  const element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}

export default function App() {
  const [notes, setNotes] = React.useState(() => JSON.parse(localStorage.getItem("notes")) || []);
  const [currentNoteId, setCurrentNoteId] = React.useState((notes[0] && notes[0].id) || "");

  React.useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }

  function updateNote(text) {
    setNotes((oldNotes) => {
      const newNotes = oldNotes.map((oldNote) => {
        return oldNote.id === currentNoteId ? { ...oldNote, body: text } : oldNote;
      });

      const currentNoteIndex = newNotes.findIndex((note) => note.id === currentNoteId);
      arrayMove(newNotes, currentNoteIndex, 0);

      return newNotes;
    });
  }

  function deleteNote(event, noteId) {
    event.stopPropagation();
    setNotes((prev) => {
      return prev.filter((note) => noteId !== note.id);
    });
  }

  function findCurrentNote() {
    return (
      notes.find((note) => {
        return note.id === currentNoteId;
      }) || notes[0]
    );
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar notes={notes} deleteNote={deleteNote} currentNote={findCurrentNote()} setCurrentNoteId={setCurrentNoteId} newNote={createNewNote} />
          {currentNoteId && notes.length > 0 && <Editor currentNote={findCurrentNote()} updateNote={updateNote} />}
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
