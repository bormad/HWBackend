document.addEventListener("click", (event) => {
  if (event.target.dataset.type === "remove") {
    const id = event.target.dataset.id;
    fetch(`/${id}`, {
      method: "DELETE",
    }).then(() => {
      event.target.closest("li").remove();
    });
  } else if (event.target.dataset.type === "patch") {
    const id = event.target.dataset.id;
    const newNoteText = prompt("Редактировать заметку?");
    if (newNoteText) {
      fetch(`/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newNoteText, id }),
      }).then(() => {
        event.target.closest("li").firstChild.textContent = newNoteText;
      });
    }
  }
});
