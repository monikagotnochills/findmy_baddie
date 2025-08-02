// Survey questions array
const questions = [
  {
    id: 'cleanliness',
    type: 'rating',
    question: 'On a scale of 1 to 5, how important is cleanliness to you in your living space?',
    options: ['1 - Not important','2 - Slightly important','3 - Moderately important','4 - Very important','5 - Extremely important'],
    follow_up: 'Can you tell me more about your cleaning habits?'
  },
  {
    id: 'sleep_schedule',
    type: 'choice',
    question: 'Would you describe yourself as an early bird or a night owl?',
    options: ['Early bird - I go to bed early and wake up early','Night owl - I stay up late and wake up later','Somewhere in between - I\'m flexible with my schedule'],
    follow_up: 'What time do you usually go to bed and wake up?'
  },
  {
    id: 'work_hours',
    type: 'open',
    question: 'Can you tell me about your typical work or study schedule?',
    hints: ['Do you work regular 9-5 hours?','Do you have a flexible schedule?','Do you work shifts or irregular hours?']
  },
  {
    id: 'social',
    type: 'choice',
    question: 'How would you describe your social preferences?',
    options: ['I\'m quite introverted and prefer quiet time at home','I\'m somewhat social but also enjoy alone time','I\'m very social and love having people over'],
    follow_up: 'How do you feel about having guests or hosting social gatherings?'
  },
  {
    id: 'noise',
    type: 'choice',
    question: 'How sensitive are you to noise when you\'re trying to sleep or concentrate?',
    options: ['Very sensitive - I need complete quiet','Somewhat sensitive - I can handle some noise','Not sensitive - Noise doesn\'t bother me much'],
    follow_up: 'Are there any specific sounds that particularly bother you?'
  }
];

let currentIndex = 0;
const responses = {};
const modal = document.getElementById('surveyModal');
const qTitle = document.getElementById('qTitle');
const qText = document.getElementById('qText');
const inputContainer = document.getElementById('inputContainer');
const followUp = document.getElementById('followUp');
const followInput = document.getElementById('followInput');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const speakBtn = document.getElementById('speakBtn');

// Show modal
document.getElementById('startBtn').onclick = () => {
  modal.classList.remove('hidden');
  showQuestion();
};

// Populate question UI
function showQuestion() {
  const q = questions[currentIndex];
  qTitle.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  qText.textContent = q.question;
  inputContainer.innerHTML = '';
  followUp.classList.add('hidden');
  followInput.value = '';

  if (q.type === 'rating') {
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.textContent = opt;
      btn.className = 'px-3 py-2 border rounded hover:bg-gray-100 w-full text-left';
      btn.onclick = () => {
        responses[q.id] = opt;
        if (q.follow_up) showFollowUp(q.follow_up);
      };
      inputContainer.append(btn);
    });
  } else if (q.type === 'choice') {
    q.options.forEach(opt => {
      const rb = document.createElement('label');
      rb.className = 'block';
      rb.innerHTML = `<input type="radio" name="choice" value="${opt}" class="mr-2">${opt}`;
      inputContainer.append(rb);
    });
    inputContainer.querySelectorAll('input').forEach(inp => {
      inp.onchange = () => {
        responses[q.id] = inp.value;
        if (q.follow_up) showFollowUp(q.follow_up);
      };
    });
  } else { // open
    const ta = document.createElement('textarea');
    ta.className = 'w-full px-3 py-2 border rounded';
    ta.rows = 3;
    inputContainer.append(ta);
    ta.oninput = () => { responses[q.id] = ta.value; };
  }
}

// Display follow-up
function showFollowUp(text) {
  followUp.classList.remove('hidden');
  followInput.placeholder = text;
  followInput.oninput = () => {
    responses[`${questions[currentIndex].id}_follow`] = followInput.value;
  };
}

// Navigation
prevBtn.onclick = () => {
  if (currentIndex > 0) currentIndex--;
  showQuestion();
};
nextBtn.onclick = () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    showQuestion();
  } else {
    modal.classList.add('hidden');
    localStorage.setItem('surveyResponses', JSON.stringify(responses));
    window.location.href = 'register.html';
  }
};

// Voice recognition
let recognition;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    // Auto-fill current input
    const q = questions[currentIndex];
    if (q.type === 'open') {
      inputContainer.querySelector('textarea').value = text;
      responses[q.id] = text;
    }
    if (q.type === 'choice' || q.type === 'rating') {
      // Try to match option by inclusion
      for (let opt of q.options) {
        if (opt.toLowerCase().includes(text.toLowerCase())) {
          responses[q.id] = opt;
          break;
        }
      }
    }
    if (q.follow_up) {
      followInput.value = text;
      responses[`${q.id}_follow`] = text;
      followUp.classList.remove('hidden');
    }
  };
  speakBtn.onclick = () => recognition.start();
}
