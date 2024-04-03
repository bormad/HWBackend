const Note = require("./models/Note");

async function addNote(title, owner) {
  Note.create({ title, owner });
}

async function getNotes() {
  const notes = await Note.find();
  return notes;
}

async function removeNote(currentNoteID, owner) {
  await Note.deleteOne({ _id: currentNoteID, owner });
}

async function patchNote(currentNoteID, updatedTitle, owner) {
  await Note.updateOne({ _id: currentNoteID, owner }, { title: updatedTitle });
}

module.exports = {
  addNote,
  getNotes,
  removeNote,
  patchNote,
};
