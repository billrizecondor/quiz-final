const STORAGE_KEY = "quiz-bee-board-v1";

const defaultGame = {
  title: "Championship Board",
  teams: [
    { name: "Team Alpha", score: 0 },
    { name: "Team Bravo", score: 0 },
    { name: "Team Charlie", score: 0 }
  ],
  categories: [
    {
      name: "1k per Pop Culture",
      clues: [
        { points: 100, question: "Which P-pop girl group is known for hits like \"Pantropiko\" and is often called the Nation's Girl Group?", answer: "BINI", image: "", trivia: "BINI's rise helped push P-pop even more into mainstream Filipino student playlists.", answered: false },
        { points: 200, question: "Which Filipino boy group is known as the P-pop Kings and released the 2025 EP \"Simula at Wakas\"?", answer: "SB19", image: "", trivia: "SB19's 2025 music video for \"DUNGKA!\" featured many Filipino celebrities and online personalities.", answered: false },
        { points: 300, question: "What viral 2025 Filipino meme phrase came from an old It's Showtime Kalokalike impersonation of Jacob Black?", answer: "What hafen Vella?", image: "", trivia: "The clip resurfaced years later and became a meme across Filipino social feeds.", answered: false },
        { points: 400, question: "What grassroots dance music genre from Davao became internationally noticed for its playful beat and viral dance culture?", answer: "Budots", image: "", trivia: "Budots is strongly linked with Davao street culture and DJ Love.", answered: false },
        { points: 500, question: "What is the fandom name of SB19 fans?", answer: "A'TIN", image: "", trivia: "A'TIN sounds like eighteen, referring to SB19 as one voice plus their fans as another.", answered: false }
      ]
    },
    {
      name: "Heneral Knowledge",
      clues: [
        { points: 100, question: "Which European country is shaped like a boot and has Rome as its capital?", answer: "Italy", image: "", trivia: "Rome was also the center of the ancient Roman Empire.", answered: false },
        { points: 200, question: "What long river flows through Vienna, Budapest, and Belgrade?", answer: "Danube River", image: "", trivia: "The Danube passes through or borders many European countries.", answered: false },
        { points: 300, question: "What 1789 revolution in Europe began with events such as the storming of the Bastille?", answer: "French Revolution", image: "", trivia: "The Bastille became a symbol of royal authority and its fall is remembered every July 14 in France.", answered: false },
        { points: 400, question: "What empire once ruled large parts of Central Europe and was led by the Habsburg family?", answer: "Austro-Hungarian Empire", image: "", trivia: "The empire dissolved after World War I.", answered: false },
        { points: 500, question: "What narrow strait separates Europe from Africa between Spain and Morocco?", answer: "Strait of Gibraltar", image: "", trivia: "It connects the Atlantic Ocean and the Mediterranean Sea.", answered: false }
      ]
    },
    {
      name: "Agham at Literatura",
      clues: [
        { points: 100, question: "What force pulls objects toward Earth?", answer: "Gravity", image: "", trivia: "Gravity is the force that keeps planets in orbit and objects on the ground.", answered: false },
        { points: 200, question: "Who wrote \"Romeo and Juliet\" and \"Hamlet\"?", answer: "William Shakespeare", image: "", trivia: "Shakespeare wrote during the English Renaissance.", answered: false },
        { points: 300, question: "Which Polish-French scientist won Nobel Prizes for work connected to radioactivity?", answer: "Marie Curie", image: "", trivia: "Curie was the first person to win Nobel Prizes in two different scientific fields.", answered: false },
        { points: 400, question: "Who wrote the novel \"Don Quixote\"?", answer: "Miguel de Cervantes", image: "", trivia: "Don Quixote is often considered one of the first modern novels.", answered: false },
        { points: 500, question: "What organelle is known as the powerhouse of the cell?", answer: "Mitochondrion", image: "", trivia: "Mitochondria help produce the energy cells use to function.", answered: false }
      ]
    },
    {
      name: "Viva La France",
      clues: [
        { points: 100, question: "What French museum is home to the Mona Lisa?", answer: "The Louvre", image: "", trivia: "The Louvre was once a royal palace before becoming a museum.", answered: false },
        { points: 200, question: "What famous Paris cathedral was badly damaged by a fire in 2019?", answer: "Notre-Dame Cathedral", image: "", trivia: "Notre-Dame reopened after years of restoration work.", answered: false },
        { points: 300, question: "Which French region is famous for sparkling wine that can legally use its name?", answer: "Champagne", image: "", trivia: "Sparkling wine must come from the Champagne region to use the name Champagne under protected rules.", answered: false },
        { points: 400, question: "Who was the French military leader who became emperor in 1804?", answer: "Napoleon Bonaparte", image: "", trivia: "Napoleon's rule reshaped European politics and law.", answered: false },
        { points: 500, question: "What French law separates religion from the state and is often discussed as a key idea in French public life?", answer: "Laicite", image: "", trivia: "Laicite is usually translated as French secularism.", answered: false }
      ]
    },
    {
      name: "Piktyur2",
      clues: [
        { points: 100, question: "What brand does this picture clue suggest?", answer: "Jollibee", image: "assets/picture-clues/jollibee-inspired.svg", trivia: "The clue uses red, yellow, fast food, and a bee-like mascot shape without copying the actual logo.", answered: false },
        { points: 200, question: "What brand does this picture clue suggest?", answer: "Starbucks", image: "assets/picture-clues/starbucks-inspired.svg", trivia: "The clue uses a green cafe palette and a round sea-themed emblem shape.", answered: false },
        { points: 300, question: "What brand does this picture clue suggest?", answer: "McDonald's", image: "assets/picture-clues/mcdonalds-inspired.svg", trivia: "The clue uses a red burger shop and golden arch-like architecture without copying the logo.", answered: false },
        { points: 400, question: "What brand does this picture clue suggest?", answer: "Shopee", image: "assets/picture-clues/shopee-inspired.svg", trivia: "The clue uses an orange mobile shopping bag and online sale elements.", answered: false },
        { points: 500, question: "What brand does this picture clue suggest?", answer: "Louis Vuitton", image: "assets/picture-clues/louis-vuitton-inspired.svg", trivia: "The clue uses a luxury travel trunk and monogram-inspired pattern without real brand letters.", answered: false }
      ]
    }
  ]
};

let game = loadGame();
let activeTeam = 0;
let activeClue = null;
let timer = null;
let timeLeft = 30;

const $ = (selector) => document.querySelector(selector);
const board = $("#board");
const teams = $("#teams");
const dialog = $("#clueDialog");
const editor = $("#editor");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadGame() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? normalizeGame(JSON.parse(stored)) : normalizeGame(clone(defaultGame));
  } catch {
    return normalizeGame(clone(defaultGame));
  }
}

function saveGame() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
  } catch {
    alert("The game could not save locally. Try using a smaller image or an image URL.");
  }
}

function normalizeGame(data) {
  const normalized = {
    title: data.title || "Championship Board",
    teams: Array.isArray(data.teams) && data.teams.length ? data.teams : clone(defaultGame.teams),
    categories: Array.isArray(data.categories) && data.categories.length ? data.categories : clone(defaultGame.categories)
  };

  normalized.teams = normalized.teams.map((team, index) => ({
    name: String(team.name || `Team ${index + 1}`),
    score: Number(team.score || 0)
  }));

  normalized.categories = normalized.categories.map((category, categoryIndex) => ({
    name: String(category.name || `Category ${categoryIndex + 1}`),
    clues: Array.from({ length: 5 }, (_, clueIndex) => {
      const clue = category.clues?.[clueIndex] || {};
      return {
        points: Number(clue.points || (clueIndex + 1) * 100),
        question: clue.question == null ? "New question" : String(clue.question),
        answer: clue.answer == null ? "New answer" : String(clue.answer),
        image: String(clue.image || ""),
        trivia: String(clue.trivia || ""),
        answered: Boolean(clue.answered)
      };
    })
  }));

  return normalized;
}

function render() {
  $("#gameTitle").textContent = game.title;
  renderTeams();
  renderBoard();
  saveGame();
}

function renderTeams() {
  teams.innerHTML = "";
  game.teams.forEach((team, index) => {
    const card = document.createElement("article");
    card.className = `team-card${index === activeTeam ? " active" : ""}`;
    card.innerHTML = `
      <span class="team-name"></span>
      <strong class="team-score"></strong>
      <div class="score-buttons">
        <button type="button" data-team="${index}" data-score="-100">-100</button>
        <button type="button" data-team="${index}" data-active="true">Active</button>
        <button type="button" data-team="${index}" data-score="100">+100</button>
      </div>
    `;
    card.querySelector(".team-name").textContent = team.name;
    card.querySelector(".team-score").textContent = team.score;
    teams.appendChild(card);
  });
}

function renderBoard() {
  const rows = Math.max(...game.categories.map((category) => category.clues.length));
  board.style.gridTemplateColumns = `repeat(${game.categories.length}, minmax(7.8rem, 1fr))`;
  board.innerHTML = "";

  game.categories.forEach((category) => {
    const header = document.createElement("div");
    header.className = "category-title";
    header.textContent = category.name;
    board.appendChild(header);
  });

  for (let row = 0; row < rows; row += 1) {
    game.categories.forEach((category, categoryIndex) => {
      const clue = category.clues[row];
      const tile = document.createElement("button");
      tile.className = `clue-tile${clue?.answered ? " answered" : ""}`;
      tile.type = "button";
      tile.textContent = clue ? clue.points : "";
      tile.disabled = !clue || clue.answered;
      tile.addEventListener("click", () => openClue(categoryIndex, row));
      board.appendChild(tile);
    });
  }
}

function openClue(categoryIndex, clueIndex) {
  activeClue = { categoryIndex, clueIndex };
  const category = game.categories[categoryIndex];
  const clue = category.clues[clueIndex];
  $("#clueCategory").textContent = category.name;
  $("#cluePoints").textContent = clue.points;
  $("#clueQuestion").textContent = clue.question;
  $("#clueAnswer").textContent = clue.answer;
  $("#clueAnswer").hidden = true;
  $("#clueTrivia").textContent = clue.trivia || "";
  $("#clueTrivia").hidden = true;
  $("#clueImage").src = clue.image || "";
  $("#clueImage").hidden = !clue.image;
  resetTimer();
  renderAwardButtons();
  dialog.showModal();
}

function renderAwardButtons() {
  const clue = getActiveClue();
  const awardGrid = $("#awardGrid");
  awardGrid.innerHTML = "";
  game.teams.forEach((team, index) => {
    const correct = document.createElement("button");
    correct.type = "button";
    correct.textContent = `${team.name} +${clue.points}`;
    correct.addEventListener("click", () => awardPoints(index, clue.points));
    awardGrid.appendChild(correct);

    const incorrect = document.createElement("button");
    incorrect.type = "button";
    incorrect.textContent = `${team.name} -${clue.points}`;
    incorrect.addEventListener("click", () => awardPoints(index, -clue.points));
    awardGrid.appendChild(incorrect);
  });
}

function getActiveClue() {
  return game.categories[activeClue.categoryIndex].clues[activeClue.clueIndex];
}

function awardPoints(teamIndex, points) {
  game.teams[teamIndex].score += points;
  activeTeam = teamIndex;
  markAnswered();
}

function markAnswered() {
  if (activeClue) {
    getActiveClue().answered = true;
  }
  closeDialog();
  render();
}

function closeDialog() {
  stopTimer();
  if (dialog.open) dialog.close();
}

function resetTimer() {
  stopTimer();
  timeLeft = 30;
  updateTimer();
}

function startTimer() {
  stopTimer();
  timer = setInterval(() => {
    timeLeft = Math.max(0, timeLeft - 1);
    updateTimer();
    if (timeLeft === 0) stopTimer();
  }, 1000);
}

function stopTimer() {
  if (timer) clearInterval(timer);
  timer = null;
}

function updateTimer() {
  $("#timerBar").value = timeLeft;
  $("#timerText").textContent = timeLeft;
}

function openEditor() {
  editor.classList.add("open");
  editor.setAttribute("aria-hidden", "false");
  renderEditor();
}

function closeEditor() {
  editor.classList.remove("open");
  editor.setAttribute("aria-hidden", "true");
}

function renderEditor() {
  $("#titleInput").value = game.title;
  renderTeamFields();
  renderCategoryFields();
}

function renderTeamFields() {
  const container = $("#teamFields");
  container.innerHTML = "";
  game.teams.forEach((team, index) => {
    const row = document.createElement("div");
    row.className = "team-line";
    row.innerHTML = `
      <input type="text" value="" aria-label="Team name" />
      <button type="button" title="Remove team" aria-label="Remove team">x</button>
    `;
    row.querySelector("input").value = team.name;
    row.querySelector("button").addEventListener("click", () => {
      if (game.teams.length > 1) {
        game.teams.splice(index, 1);
        activeTeam = Math.min(activeTeam, game.teams.length - 1);
        renderEditor();
        render();
      }
    });
    container.appendChild(row);
  });
}

function renderCategoryFields() {
  const container = $("#categoryFields");
  const categoryTemplate = $("#categoryTemplate");
  const clueTemplate = $("#clueTemplate");
  container.innerHTML = "";

  game.categories.forEach((category, categoryIndex) => {
    const categoryNode = categoryTemplate.content.firstElementChild.cloneNode(true);
    categoryNode.querySelector(".category-name").value = category.name;
    categoryNode.querySelector(".remove-category").addEventListener("click", () => {
      if (game.categories.length > 1) {
        game.categories.splice(categoryIndex, 1);
        renderEditor();
        render();
      }
    });

    const list = categoryNode.querySelector(".clue-edit-list");
    category.clues.forEach((clue) => {
      const clueNode = clueTemplate.content.firstElementChild.cloneNode(true);
      clueNode.querySelector(".clue-points").value = clue.points;
      clueNode.querySelector(".clue-question").value = clue.question;
      clueNode.querySelector(".clue-answer").value = clue.answer;
      clueNode.querySelector(".clue-trivia").value = clue.trivia || "";
      clueNode.querySelector(".clue-image-url").value = clue.image || "";
      updateImagePreview(clueNode, clue.image || "");
      list.appendChild(clueNode);
    });

    container.appendChild(categoryNode);
  });
}

function collectEdits() {
  const next = clone(game);
  next.title = $("#titleInput").value.trim() || "Championship Board";
  next.teams = Array.from($("#teamFields").querySelectorAll(".team-line input")).map((input, index) => ({
    name: input.value.trim() || `Team ${index + 1}`,
    score: game.teams[index]?.score || 0
  }));

  next.categories = Array.from($("#categoryFields").querySelectorAll(".category-card")).map((card, categoryIndex) => ({
    name: card.querySelector(".category-name").value.trim() || `Category ${categoryIndex + 1}`,
    clues: Array.from(card.querySelectorAll(".clue-edit")).map((clueNode, clueIndex) => ({
      points: Number(clueNode.querySelector(".clue-points").value) || (clueIndex + 1) * 100,
      question: clueNode.querySelector(".clue-question").value.trim(),
      answer: clueNode.querySelector(".clue-answer").value.trim(),
      image: clueNode.querySelector(".clue-image-url").value.trim(),
      trivia: clueNode.querySelector(".clue-trivia").value.trim(),
      answered: game.categories[categoryIndex]?.clues[clueIndex]?.answered || false
    }))
  }));

  game = normalizeGame(next);
}

function downloadData() {
  collectEdits();
  render();
  const blob = new Blob([JSON.stringify(game, null, 2)], { type: "application/json" });
  downloadBlob(blob, "questions.json");
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportCsv() {
  collectEdits();
  render();
  const rows = [["category", "points", "question", "answer", "image", "trivia"]];
  game.categories.forEach((category) => {
    category.clues.forEach((clue) => {
      rows.push([category.name, clue.points, clue.question, clue.answer, clue.image, clue.trivia]);
    });
  });
  const csv = rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, "questions.csv");
}

function escapeCsvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell);
  if (row.some((value) => value.trim() !== "")) rows.push(row);
  return rows;
}

async function importCsv(event) {
  const [file] = event.target.files;
  if (!file) return;
  try {
    const rows = parseCsv(await file.text());
    const [header, ...dataRows] = rows;
    const headers = header.map((value) => value.trim().toLowerCase());
    const categoryIndex = headers.indexOf("category");
    const pointsIndex = headers.indexOf("points");
    const questionIndex = headers.indexOf("question");
    const answerIndex = headers.indexOf("answer");
    const imageIndex = headers.indexOf("image");
    const triviaIndex = headers.indexOf("trivia");

    if ([categoryIndex, pointsIndex, questionIndex, answerIndex].some((index) => index === -1)) {
      alert("CSV must include these columns: category, points, question, answer. Image is optional.");
      return;
    }

    const categoryMap = new Map();
    dataRows.forEach((row) => {
      const categoryName = row[categoryIndex]?.trim();
      const question = row[questionIndex]?.trim() || "";
      const answer = row[answerIndex]?.trim() || "";
      if (!categoryName) return;
      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, { name: categoryName, clues: [] });
      }
      categoryMap.get(categoryName).clues.push({
        points: Number(row[pointsIndex]) || 100,
        question,
        answer,
        image: imageIndex >= 0 ? row[imageIndex]?.trim() || "" : "",
        trivia: triviaIndex >= 0 ? row[triviaIndex]?.trim() || "" : "",
        answered: false
      });
    });

    const categories = Array.from(categoryMap.values());
    if (!categories.length) {
      alert("No usable questions were found in that CSV.");
      return;
    }

    game = normalizeGame({
      ...game,
      categories
    });
    activeTeam = 0;
    render();
    renderEditor();
  } finally {
    event.target.value = "";
  }
}

async function importData(event) {
  const [file] = event.target.files;
  if (!file) return;
  const text = await file.text();
  game = normalizeGame(JSON.parse(text));
  activeTeam = 0;
  render();
  renderEditor();
  event.target.value = "";
}

function addTeam() {
  game.teams.push({ name: `Team ${game.teams.length + 1}`, score: 0 });
  renderEditor();
  render();
}

function addCategory() {
  game.categories.push({
    name: `Category ${game.categories.length + 1}`,
    clues: Array.from({ length: 5 }, (_, index) => ({
      points: (index + 1) * 100,
      question: "New question",
      answer: "New answer",
      image: "",
      trivia: "",
      answered: false
    }))
  });
  renderEditor();
  render();
}

function resetAnswered() {
  game.categories.forEach((category) => {
    category.clues.forEach((clue) => {
      clue.answered = false;
    });
  });
  render();
}

function resetGame() {
  game = normalizeGame(clone(defaultGame));
  activeTeam = 0;
  localStorage.removeItem(STORAGE_KEY);
  render();
  renderEditor();
}

teams.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const teamIndex = Number(button.dataset.team);
  if (button.dataset.active) activeTeam = teamIndex;
  if (button.dataset.score) game.teams[teamIndex].score += Number(button.dataset.score);
  render();
});

editor.addEventListener("change", async (event) => {
  const fileInput = event.target.closest(".clue-image-file");
  if (!fileInput) return;
  const [file] = fileInput.files;
  if (!file) return;
  const clueNode = fileInput.closest(".clue-edit");
  const imageData = await readImageFile(file);
  clueNode.querySelector(".clue-image-url").value = imageData;
  updateImagePreview(clueNode, imageData);
  fileInput.value = "";
});

editor.addEventListener("input", (event) => {
  const imageInput = event.target.closest(".clue-image-url");
  if (!imageInput) return;
  updateImagePreview(imageInput.closest(".clue-edit"), imageInput.value.trim());
});

editor.addEventListener("click", (event) => {
  const clearButton = event.target.closest(".clear-image");
  if (!clearButton) return;
  const clueNode = clearButton.closest(".clue-edit");
  clueNode.querySelector(".clue-image-url").value = "";
  updateImagePreview(clueNode, "");
});

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resizeImage(reader.result).then(resolve).catch(reject));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function resizeImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => {
      const maxSize = 1200;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.86));
    });
    image.addEventListener("error", reject);
    image.src = source;
  });
}

function updateImagePreview(clueNode, imageSource) {
  const preview = clueNode.querySelector(".image-preview");
  preview.src = imageSource || "";
  preview.hidden = !imageSource;
}

$("#editToggle").addEventListener("click", openEditor);
$("#closeEditor").addEventListener("click", closeEditor);
$("#saveEdits").addEventListener("click", () => {
  collectEdits();
  render();
  closeEditor();
});
$("#addTeam").addEventListener("click", addTeam);
$("#addCategory").addEventListener("click", addCategory);
$("#exportCsv").addEventListener("click", exportCsv);
$("#importCsv").addEventListener("change", importCsv);
$("#exportData").addEventListener("click", downloadData);
$("#importData").addEventListener("change", importData);
$("#resetBoard").addEventListener("click", resetAnswered);
$("#resetGame").addEventListener("click", resetGame);
$("#startTimer").addEventListener("click", startTimer);
$("#revealAnswer").addEventListener("click", () => {
  $("#clueAnswer").hidden = false;
  const clue = getActiveClue();
  $("#clueTrivia").hidden = !clue.trivia;
});
$("#closeClue").addEventListener("click", markAnswered);
dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeDialog();
});

render();
loadExternalQuestions();

async function loadExternalQuestions() {
  if (localStorage.getItem(STORAGE_KEY)) return;
  try {
    const response = await fetch("questions.json", { cache: "no-store" });
    if (!response.ok) return;
    game = normalizeGame(await response.json());
    activeTeam = 0;
    render();
  } catch {
    // Static file opening cannot fetch JSON; the built-in defaults still work.
  }
}
