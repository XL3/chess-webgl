import Chess from "./Chess/Chess";


window.onload = () => {
  let chess = new Chess();
  chess.init();

  const notesList = document.getElementById("notes-list");
  const notes = [
    "Move pieces holding left-click.",
    "To cancel, drop pieces outside the board, or using right-click.",
    "NEW: You cannot make illegal moves anymore.",
    "NEW: You can now castle.",
    "NEW: You can now do your absolute favorite move in Chess, capture en peasant.",
    "NEW: Legal moves are highlighted, still a work in progress."
  ];

  notes.forEach(note => {
    const li = document.createElement('li');
    li.innerText = note;
    notesList.appendChild(li);
  });

  document.addEventListener('checkmate', () => {
    alert('Checkmate!');
  });
}
