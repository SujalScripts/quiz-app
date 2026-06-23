const quest = document.getElementById("question");
let scoretxt = document.getElementById("score");
let score = 0;
const buttons = [
  document.getElementById("btn-1"),
  document.getElementById("btn-2"),
  document.getElementById("btn-3"),
  document.getElementById("btn-4"),
];

const bruhSound = new Audio("bruh_sound.mp3");
const partySound = new Audio("partyblower.mp3");

const apiUrl = "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy";

let questions = [];
let currentIndex = 0;

async function getQuestions() { 
  const response = await fetch(apiUrl); 
  const data = await response.json(); 

  questions = data.results.map((question) => { 

    const options = [...question.incorrect_answers, question.correct_answer];  
    options.sort(() => Math.random() - 0.5); // 0.8 - 0.5=0.3-> +ve no.-> reversethe order of opt

    return { 
      question: decodeHTML(question.question), 
      options: options.map(opt => decodeHTML(opt)), 
      answer: decodeHTML(question.correct_answer) 
    }; 
  }); 

  showQuestion(); 
}

function showQuestion() {
  const q = questions[currentIndex];
  quest.textContent = q.question;

  buttons.forEach((btn, index) => {
    if (index < q.options.length) {
      btn.style.display = "block";   // show button
      btn.disabled = false;
      btn.textContent = q.options[index];
      btn.style.backgroundColor = ""; // reset color

      btn.onclick = () =>
        checkAnswer(btn, q.options[index], q.answer);
    } else {
      btn.style.display = "none";    // hide extra buttons
    }
  });
}

function checkAnswer(button, selected, correct) {
  buttons.forEach(btn => btn.disabled = true);
  if (selected === correct) {
    button.style.backgroundColor = "green";
    score++;
    scoretxt.textContent = `Score: ${score}/${questions.length}`;
  } else {
    button.style.backgroundColor = "red";
    bruhSound.play();
  }

  // show correct answer
  buttons.forEach(btn => {
    if (btn.textContent === correct) {
      btn.style.backgroundColor = "green";
    }
  });

  // move to next question after delay
  setTimeout(() => {
    currentIndex++;
    if (currentIndex < questions.length) {
      showQuestion();
    } else {
      quest.textContent =
      `🏆 Quiz Finished! Your Score: ${score}/${questions.length}`;
      
      buttons.forEach(btn => {
        btn.style.display = "none";
      });

      partySound.play();
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.6 }
      });
    }
  }, 1000);
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

getQuestions();