const yargs = require("yargs");
const { addNote, getNotes, removeNote } = require("./notes.controller");

yargs.command({
  command: "add",
  describe: "Add new note",
  builder: {
    title: {
      type: "string",
      describe: "Note title",
      demandOption: true,
    },
  },
  handler({ title }) {
    addNote(title);
  },
});

yargs.command({
  command: "list",
  describe: "Print all notes",
  async handler() {
    const notes = await getNotes();
    console.log(notes);
  },
});

yargs.command({
  command: "remove",
  describe: "Remove note by id",
  builder: {
    noteID: {
      type: "string",
      describe: "Note ID",
      demandOption: true,
    },
  },
  async handler({ noteID }) {
    removeNote(noteID);
  },
});

yargs.parse();
