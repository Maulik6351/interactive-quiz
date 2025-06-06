const quizQuestions = [
  {
    question: "What is the capital of India?",
    options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
    correct: 1,
  },
  {
    question: "Which river is considered the holiest in India?",
    options: ["Yamuna", "Narmada", "Ganga", "Godavari"],
    correct: 2,
  },
  {
    question: "Who is known as the Father of the Nation in India?",
    options: [
      "Jawaharlal Nehru",
      "Mahatma Gandhi",
      "Subhas Chandra Bose",
      "Sardar Patel",
    ],
    correct: 1,
  },
  {
    question: "In which year did India gain independence?",
    options: ["1946", "1947", "1948", "1949"],
    correct: 1,
  },
  {
    question: "Which is the largest state in India by area?",
    options: ["Uttar Pradesh", "Maharashtra", "Rajasthan", "Madhya Pradesh"],
    correct: 2,
  },
  {
    question: "What is India's national bird?",
    options: ["Eagle", "Peacock", "Parrot", "Sparrow"],
    correct: 1,
  },
  {
    question: "Which monument is known as the Symbol of Love?",
    options: ["Red Fort", "Qutub Minar", "Taj Mahal", "India Gate"],
    correct: 2,
  },
  {
    question: "How many states are there in India currently?",
    options: ["28", "29", "30", "31"],
    correct: 0,
  },
  {
    question: "Which Indian city is known as the Silicon Valley of India?",
    options: ["Hyderabad", "Pune", "Chennai", "Bangalore"],
    correct: 3,
  },
  {
    question: "Who was the first Prime Minister of India?",
    options: [
      "Mahatma Gandhi",
      "Jawaharlal Nehru",
      "Sardar Patel",
      "Lal Bahadur Shastri",
    ],
    correct: 1,
  },
];

// Quiz state
let currentQuestion = 0;
let score = 0;
let selectedAnswer = -1;
let timeLeft = 30;
let timer;
let userAnswers = [];
let quizStartTime;
let scoreHistory = [];

// DOM elements
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const questionCounter = document.getElementById("questionCounter");
const questionNumber = document.getElementById("questionNumber");
const scoreDisplay = document.getElementById("scoreDisplay");
const timerDisplay = document.getElementById("timer");
const progressBar = document.getElementById("progressBar");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const finalScore = document.getElementById("finalScore");
const resultMessage = document.getElementById("resultMessage");

// Initialize the app
function init() {
  loadScoreHistory();
  displayScoreHistory();
}

// Start the quiz
function startQuiz() {
  currentQuestion = 0;
  score = 0;
  selectedAnswer = -1;
  userAnswers = [];
  quizStartTime = new Date();

  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  resultScreen.classList.add("hidden");

  loadQuestion();
  startTimer();
}

// Load current question
function loadQuestion() {
  const question = quizQuestions[currentQuestion];
  questionText.textContent = question.question;
  questionCounter.textContent = `${currentQuestion + 1} / ${
    quizQuestions.length
  }`;
  questionNumber.textContent = `Question ${currentQuestion + 1} of ${
    quizQuestions.length
  }`;

  // Update progress bar
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  progressBar.style.width = `${progress}%`;

  // Load options
  optionsContainer.innerHTML = "";
  question.options.forEach((option, index) => {
    const optionElement = document.createElement("div");
    optionElement.className = "option";
    optionElement.textContent = option;
    optionElement.onclick = () => selectOption(index);
    optionsContainer.appendChild(optionElement);
  });

  // Restore previous answer if exists
  if (userAnswers[currentQuestion] !== undefined) {
    selectOption(userAnswers[currentQuestion]);
  } else {
    selectedAnswer = -1;
  }

  // Update navigation buttons
  prevBtn.disabled = currentQuestion === 0;
  nextBtn.textContent =
    currentQuestion === quizQuestions.length - 1 ? "Finish Quiz" : "Next";

  // Reset timer
  timeLeft = 30;
  timerDisplay.textContent = timeLeft;
  startTimer();
}

// Select an option
function selectOption(index) {
  selectedAnswer = index;
  userAnswers[currentQuestion] = index;

  // Update UI
  const options = optionsContainer.querySelectorAll(".option");
  options.forEach((option, i) => {
    option.classList.remove("selected");
    if (i === index) {
      option.classList.add("selected");
    }
  });
}

// Start timer
function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 10) {
      timerDisplay.style.color = "#ff4757";
    } else {
      timerDisplay.style.color = "#ffd700";
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      if (currentQuestion < quizQuestions.length - 1) {
        nextQuestion();
      } else {
        finishQuiz();
      }
    }
  }, 1000);
}

// Go to next question
function nextQuestion() {
  if (currentQuestion < quizQuestions.length - 1) {
    currentQuestion++;
    loadQuestion();
  } else {
    finishQuiz();
  }
}

// Go to previous question
function previousQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
}

// Finish quiz and show results
function finishQuiz() {
  clearInterval(timer);

  // Calculate score
  score = 0;
  userAnswers.forEach((answer, index) => {
    if (answer === quizQuestions[index].correct) {
      score++;
    }
  });

  // Save score to history
  const quizEndTime = new Date();
  const duration = Math.round((quizEndTime - quizStartTime) / 1000);
  saveScore(score, quizQuestions.length, duration);

  // Show results
  showResults();
}

// Show results screen
function showResults() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  finalScore.textContent = `${score}/${quizQuestions.length}`;
  scoreDisplay.textContent = score;

  // Show result message
  const percentage = (score / quizQuestions.length) * 100;
  let message = "";

  if (percentage >= 90) {
    message = "🏆 Excellent! You're a quiz master!";
  } else if (percentage >= 70) {
    message = "👏 Great job! Well done!";
  } else if (percentage >= 50) {
    message = "👍 Good effort! Keep learning!";
  } else {
    message = "💪 Keep studying and try again!";
  }

  resultMessage.textContent = message;

  // Show detailed results
  showDetailedResults();
  displayFinalScoreHistory();
}

// Show detailed results
function showDetailedResults() {
  // This could be expanded to show question-by-question breakdown
}

// Restart quiz
function restartQuiz() {
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  displayScoreHistory();
}

// Save score to history (in memory since localStorage isn't available)
function saveScore(score, total, duration) {
  const scoreData = {
    score: score,
    total: total,
    percentage: Math.round((score / total) * 100),
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    duration: duration,
  };

  scoreHistory.unshift(scoreData);

  // Keep only last 10 scores
  if (scoreHistory.length > 10) {
    scoreHistory = scoreHistory.slice(0, 10);
  }
}

// Load score history (in a real app, this would load from localStorage)
function loadScoreHistory() {
  // In memory storage - scores persist only during session
  // In a real application, you would use:
  // const saved = localStorage.getItem('quizScores');
  // if (saved) scoreHistory = JSON.parse(saved);
}

// Display score history on start screen
function displayScoreHistory() {
  const historyContainer = document.getElementById("scoreHistory");
  const scoresList = document.getElementById("scoresList");

  if (scoreHistory.length > 0) {
    historyContainer.classList.remove("hidden");
    scoresList.innerHTML = "";

    scoreHistory.forEach((score, index) => {
      const scoreItem = document.createElement("div");
      scoreItem.className = "score-item";
      scoreItem.innerHTML = `
                        <span>Quiz #${scoreHistory.length - index}: ${
        score.score
      }/${score.total} (${score.percentage}%)</span>
                        <span>${score.date}</span>
                    `;
      scoresList.appendChild(scoreItem);
    });
  } else {
    historyContainer.classList.add("hidden");
  }
}

// Display score history on result screen
function displayFinalScoreHistory() {
  const scoresList = document.getElementById("finalScoresList");
  scoresList.innerHTML = "";

  scoreHistory.forEach((score, index) => {
    const scoreItem = document.createElement("div");
    scoreItem.className = "score-item";
    scoreItem.innerHTML = `
                    <span>Quiz #${scoreHistory.length - index}: ${
      score.score
    }/${score.total} (${score.percentage}%)</span>
                    <span>${score.date} - ${Math.floor(score.duration / 60)}:${(
      score.duration % 60
    )
      .toString()
      .padStart(2, "0")}</span>
                `;
    scoresList.appendChild(scoreItem);
  });
}

// Initialize the app
init();
