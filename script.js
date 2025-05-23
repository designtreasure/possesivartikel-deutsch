document.addEventListener('DOMContentLoaded', () => {
    const articlesData = {
        "ich": {
            "Nominativ": { "maskulin": "mein", "feminin": "meine", "neutral": "mein", "plural": "meine" },
            "Akkusativ": { "maskulin": "meinen", "feminin": "meine", "neutral": "mein", "plural": "meine" },
            "Dativ": { "maskulin": "meinem", "feminin": "meiner", "neutral": "meinem", "plural": "meinen" }
        },
        "du": {
            "Nominativ": { "maskulin": "dein", "feminin": "deine", "neutral": "dein", "plural": "deine" },
            "Akkusativ": { "maskulin": "deinen", "feminin": "deine", "neutral": "dein", "plural": "deine" },
            "Dativ": { "maskulin": "deinem", "feminin": "deiner", "neutral": "deinem", "plural": "deinen" }
        },
        "er": {
            "Nominativ": { "maskulin": "sein", "feminin": "seine", "neutral": "sein", "plural": "seine" },
            "Akkusativ": { "maskulin": "seinen", "feminin": "seine", "neutral": "sein", "plural": "seine" },
            "Dativ": { "maskulin": "seinem", "feminin": "seiner", "neutral": "seinem", "plural": "seinen" }
        },
        "sie (sie)": {
            "Nominativ": { "maskulin": "ihr", "feminin": "ihre", "neutral": "ihr", "plural": "ihre" },
            "Akkusativ": { "maskulin": "ihren", "feminin": "ihre", "neutral": "ihr", "plural": "ihre" },
            "Dativ": { "maskulin": "ihrem", "feminin": "ihrer", "neutral": "ihrem", "plural": "ihren" }
        },
        "es": {
            "Nominativ": { "maskulin": "sein", "feminin": "seine", "neutral": "sein", "plural": "seine" },
            "Akkusativ": { "maskulin": "seinen", "feminin": "seine", "neutral": "sein", "plural": "seine" },
            "Dativ": { "maskulin": "seinem", "feminin": "seiner", "neutral": "seinem", "plural": "seinen" }
        },
        "wir": {
            "Nominativ": { "maskulin": "unser", "feminin": "unsere", "neutral": "unser", "plural": "unsere" },
            "Akkusativ": { "maskulin": "unseren", "feminin": "unsere", "neutral": "unser", "plural": "unsere" },
            "Dativ": { "maskulin": "unserem", "feminin": "unserer", "neutral": "unserem", "plural": "unseren" }
        },
        "ihr (ihr)": {
            "Nominativ": { "maskulin": "euer", "feminin": "eure", "neutral": "euer", "plural": "eure" },
            "Akkusativ": { "maskulin": "euren", "feminin": "eure", "neutral": "euer", "plural": "eure" },
            "Dativ": { "maskulin": "eurem", "feminin": "eurer", "neutral": "eurem", "plural": "euren" }
        },
        "sie/Sie": {
            "Nominativ": { "maskulin": "ihr/Ihr", "feminin": "ihre/Ihre", "neutral": "ihr/Ihr", "plural": "ihre/Ihre" },
            "Akkusativ": { "maskulin": "ihren/Ihren", "feminin": "ihre/Ihre", "neutral": "ihr/Ihr", "plural": "ihre/Ihre" },
            "Dativ": { "maskulin": "ihrem/Ihrem", "feminin": "ihrer/Ihrer", "neutral": "ihrem/Ihrem", "plural": "ihren/Ihren" }
        }
    };

    const sampleNouns = {
        "maskulin": ["Hund", "Tisch", "Stuhl"],
        "feminin": ["Katze", "Blume", "Tasche"],
        "neutral": ["Buch", "Auto", "Haus"],
        "plural": ["Bücher", "Autos", "Kinder"]
    };

    const sentenceTemplates = {
        "Nominativ": [
            "{pronoun} habe ____ {noun} gesehen.",
            "Das ist ____ {noun}.",
            "{pronoun} mag ____ {noun}."
        ],
        "Akkusativ": [
            "{pronoun} sehe ____ {noun}.",
            "{pronoun} kaufe ____ {noun}.",
            "{pronoun} liebe ____ {noun}."
        ],
        "Dativ": [
            "{pronoun} gebe ____ {noun} ein Geschenk.",
            "{pronoun} helfe ____ {noun}.",
            "Das gehört ____ {noun}."
        ]
    };

    const pronounsOrder = ["ich", "du", "er", "sie (sie)", "es", "wir", "ihr (ihr)", "sie/Sie"];
    const casesOrder = ["Nominativ", "Akkusativ", "Dativ"];
    const gendersOrder = ["maskulin", "feminin", "neutral", "plural"];

    const tableBody = document.getElementById('article-table-body');
    const scoreEl = document.getElementById('score');
    const livesEl = document.getElementById('lives');
    const remainingEl = document.getElementById('remaining-cells');
    const messageEl = document.getElementById('message');
    const restartButton = document.getElementById('restart-button');
    const qSentenceEl = document.getElementById('q-sentence');
    const qHintEl = document.getElementById('q-hint');
    const container = document.querySelector('.container');

    const correctSound = document.getElementById('correct-sound');
    const incorrectSound = document.getElementById('incorrect-sound');

    let currentQuestion = {};
    let score = 0;
    let lives = 5;
    let totalCellsToSolve = 0;
    let solvedCellsCount = 0;
    let allPossibleQuestions = [];
    let gameCells = {};

    function generateAllPossibleQuestions() {
        allPossibleQuestions = [];
        pronounsOrder.forEach(p => {
            casesOrder.forEach(c => {
                gendersOrder.forEach(g => {
                    allPossibleQuestions.push({ pronoun: p, kasus: c, gender: g });
                });
            });
        });
        totalCellsToSolve = allPossibleQuestions.length;
    }

    function initGame() {
        score = 0;
        lives = 5;
        solvedCellsCount = 0;
        generateAllPossibleQuestions();
        updateInfo();
        messageEl.textContent = "Neues Spiel gestartet. Finde die Zelle!";
        messageEl.className = '';
        container.classList.remove('game-won', 'game-lost');
        tableBody.innerHTML = '';
        gameCells = {};

        pronounsOrder.forEach(pronoun => {
            const tr = document.createElement('tr');
            const tdPronoun = document.createElement('td');
            let displayPronounLabel = pronoun;
            if (pronoun === "sie (sie)") displayPronounLabel = "sie (f)";
            else if (pronoun === "ihr (ihr)") displayPronounLabel = "ihr (pl)";
            else if (pronoun === "sie/Sie") displayPronounLabel = "sie/Sie";
            tdPronoun.textContent = displayPronounLabel;
            tdPronoun.dataset.pronoun = pronoun;
            tr.appendChild(tdPronoun);

            casesOrder.forEach(kasus => {
                gendersOrder.forEach(gender => {
                    const cellId = `${pronoun}-${kasus}-${gender}`;
                    const td = document.createElement('td');
                    td.id = cellId;
                    td.dataset.pronoun = pronoun;
                    td.dataset.case = kasus;
                    td.dataset.gender = gender;
                    const article = articlesData[pronoun][kasus][gender];
                    td.dataset.article = article;
                    
                    td.classList.add('game-cell', 'unsolved');
                    const contentSpan = document.createElement('span');
                    contentSpan.classList.add('cell-content');
                    contentSpan.textContent = '?';
                    td.appendChild(contentSpan);
                    
                    td.addEventListener('click', () => handleCellClick(td));
                    tr.appendChild(td);
                    gameCells[cellId] = td;
                });
            });
            tableBody.appendChild(tr);
        });
        
        remainingEl.textContent = totalCellsToSolve - solvedCellsCount;
        generateNewQuestion();
    }

    function highlightHeaders() {
        document.querySelectorAll('.pronoun-header, .case-gender-header, #article-table tbody tr td:first-child').forEach(el => {
            el.classList.remove('highlighted');
        });

        const pronounCell = document.querySelector(`#article-table tbody tr td:first-child[data-pronoun="${currentQuestion.pronoun}"]`);
        if (pronounCell) pronounCell.classList.add('highlighted');

        const headerCell = document.querySelector(`.case-gender-header[data-case="${currentQuestion.kasus}"][data-gender="${currentQuestion.gender}"]`);
        if (headerCell) headerCell.classList.add('highlighted');
    }

    function generateNewQuestion() {
        if (solvedCellsCount >= totalCellsToSolve) {
            messageEl.textContent = "Glückwunsch! Alle Artikel gefunden!";
            messageEl.className = 'correct';
            endGame(true);
            return;
        }

        let unsolvedQuestions = allPossibleQuestions.filter(q => {
            const cellId = `${q.pronoun}-${q.kasus}-${q.gender}`;
            return gameCells[cellId] && !gameCells[cellId].classList.contains('solved');
        });

        if (unsolvedQuestions.length === 0) {
            messageEl.textContent = "Alle Fragen gelöst!";
            messageEl.className = 'correct';
            endGame(true);
            return;
        }

        currentQuestion = unsolvedQuestions[Math.floor(Math.random() * unsolvedQuestions.length)];
        
        let displayPronoun = currentQuestion.pronoun;
        if (currentQuestion.pronoun === "sie (sie)") displayPronoun = "sie";
        else if (currentQuestion.pronoun === "ihr (ihr)") displayPronoun = "ihr";
        else if (currentQuestion.pronoun === "sie/Sie") displayPronoun = "sie/Sie";

        const noun = getRandomElement(sampleNouns[currentQuestion.gender] || []);
        const template = getRandomElement(sentenceTemplates[currentQuestion.kasus] || ["{pronoun} sehe ____ {noun}."]);
        const sentence = template.replace('{pronoun}', displayPronoun.charAt(0).toUpperCase() + displayPronoun.slice(1)).replace('{noun}', noun);
        
        qSentenceEl.innerHTML = `Fülle das richtige Possessivartikel ein: <strong>${sentence.replace('____', '____')}</strong>`;
        qHintEl.textContent = `Hinweis: Possessivartikel, ${currentQuestion.gender}, ${currentQuestion.kasus}`;
        
        messageEl.textContent = "Finde die Zelle für diese Kombination.";
        messageEl.className = '';
        highlightHeaders();
    }
    
    function getRandomElement(arr) {
        if (!arr || arr.length === 0) return "";
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function handleCellClick(cell) {
        if (lives <= 0 || cell.classList.contains('solved')) {
            return;
        }

        const isCorrect = cell.dataset.pronoun === currentQuestion.pronoun &&
                          cell.dataset.case === currentQuestion.kasus &&
                          cell.dataset.gender === currentQuestion.gender;

        if (isCorrect) {
            cell.classList.remove('unsolved');
            cell.classList.add('solved');
            cell.querySelector('.cell-content').textContent = cell.dataset.article.replace('/', ' / ');
            score += 10;
            solvedCellsCount++;
            messageEl.textContent = "Richtig! Sehr gut.";
            messageEl.className = 'correct';
            if (correctSound) correctSound.play().catch(() => {});
            
            if (solvedCellsCount >= totalCellsToSolve) {
                messageEl.textContent = "Fantastisch! Du hast alle Artikel gefunden!";
                messageEl.className = 'correct';
                endGame(true);
            } else {
                generateNewQuestion();
            }
        } else {
            lives--;
            messageEl.textContent = `Falsch! Das war '${cell.dataset.article.replace('/', ' / ')}'. Finde die richtige Zelle! (Noch ${lives} Leben)`;
            messageEl.className = 'incorrect';
            if (incorrectSound) incorrectSound.play().catch(() => {});
            
            if (!cell.classList.contains('solved')) {
                cell.classList.remove('unsolved');
                cell.classList.add('mistake-flash', 'solved');
                cell.querySelector('.cell-content').textContent = cell.dataset.article.replace('/', ' / ');
                allPossibleQuestions = allPossibleQuestions.filter(q => 
                    !(q.pronoun === cell.dataset.pronoun && 
                      q.kasus === cell.dataset.case && 
                      q.gender === cell.dataset.gender)
                );
                solvedCellsCount++;
            }

            if (lives <= 0) {
                messageEl.textContent = "Spiel vorbei! Keine Leben mehr.";
                messageEl.className = 'incorrect';
                endGame(false);
            }
        }
        updateInfo();
    }

    function updateInfo() {
        scoreEl.textContent = score;
        livesEl.textContent = lives;
        remainingEl.textContent = totalCellsToSolve - solvedCellsCount;
    }

    function endGame(isWin) {
        qSentenceEl.textContent = "";
        qHintEl.textContent = "";
        container.classList.add(isWin ? 'game-won' : 'game-lost');
        document.querySelectorAll('.game-cell').forEach(c => {
            c.style.cursor = 'default';
            if (!c.classList.contains('solved')) {
                c.querySelector('.cell-content').textContent = c.dataset.article.replace('/', ' / ');
                c.style.backgroundColor = isWin ? '#d4edda' : '#f0f0f0';
            }
        });
        document.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));
    }

    restartButton.addEventListener('click', initGame);

    const rulesDisplay = document.getElementById('game-rules-display');
    rulesDisplay.innerHTML = `
        <h3>Spielregeln für Artikel-Navigator</h3>
        <ol>
            <li><strong>Satz lesen:</strong> Oben siehst du einen Satz mit einer Lücke für ein Possessivartikel und einen Hinweis (Possessivartikel, Genus, Kasus).</li>
            <li><strong>Zelle finden:</strong> Finde die Zelle in der Tabelle, die das richtige Possessivartikel für den Satz enthält.</li>
            <li><strong>Klicken:</strong> Klicke auf die Zelle, die du für richtig hältst.
                <ul>
                    <li><strong>Richtig geklickt:</strong> Super! Der Artikel wird angezeigt, du bekommst Punkte, und die Zelle wird als "gelöst" markiert. Ein neuer Satz erscheint.</li>
                    <li><strong>Falsch geklickt ("Mine"):</strong> Oh nein! Du verlierst ein Leben. Die falsche Zelle zeigt ihren Artikel, wird gelöst, aber der Satz bleibt bestehen.</li>
                </ul>
            </li>
            <li><strong>Ziel:</strong> Löse alle Zellen in der Tabelle.</li>
            <li><strong>Verlieren:</strong> Das Spiel endet, wenn du keine Leben mehr hast.</li>
        </ol>`;

    initGame();
});