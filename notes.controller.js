const fs = require("fs/promises");
const path = require("path");
const chalk = require("chalk");

const notesPath = path.join(__dirname, "db.json");

async function addNote(title) {
  const notes = await getNotes();

  const note = {
    title,
    id: Date.now().toString(),
  };

  notes.push(note);
  await fs.writeFile(notesPath, JSON.stringify(notes));
  console.log(chalk.green.inverse("Note was Added"));
}

async function getNotes() {
  const notes = await fs.readFile(notesPath, { encoding: "utf-8" });
  const parsedNotes = Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
  return parsedNotes;
}

async function removeNote(currentNoteID) {
  const notes = await getNotes();
  const noteToRemove = notes.find(({ id }) => id === currentNoteID);

  if (noteToRemove) {
    const newNotesArr = notes.filter(({ id }) => id !== currentNoteID);
    await fs.writeFile(notesPath, JSON.stringify(newNotesArr));
    console.log(chalk.green.inverse("Note was Removed"));
  } else {
    console.log(chalk.red.inverse("Note with the specified ID was not found"));
  }
}

async function patchNote(currentNoteID, updatedTitle) {
  const notes = await getNotes();
  const noteToPatch = notes.find(({ id }) => id === currentNoteID);

  if (noteToPatch) {
    noteToPatch.title = updatedTitle;
    await fs.writeFile(notesPath, JSON.stringify(notes));
    console.log(chalk.green.inverse("Note was Patched"));
  } else {
    console.log(chalk.red.inverse("Note with the specified ID was not found"));
  }
}

module.exports = {
  addNote,
  getNotes,
  removeNote,
  patchNote,
};
