import Chess from "./Chess/Chess";


window.onload = () => {
  let chess = new Chess();
  chess.init();

  const notesList = document.getElementById("notes-list");
  const notes = [
    "Move pieces holding left-click.",
    "To cancel, drop pieces outside the board, or using right-click.",
    "NEW: You'll now be alerted of checkmate!"
  ];

  notes.forEach(note => {
    const li = document.createElement('li');
    li.innerText = note;
    notesList.appendChild(li);
  });
}
