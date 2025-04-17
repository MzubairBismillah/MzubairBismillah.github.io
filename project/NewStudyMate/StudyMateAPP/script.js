const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const durationInput = document.getElementById('durationInput');
const taskList = document.getElementById('taskList');
const timeDisplay = document.getElementById('time');
const progress = document.getElementById('progress');
const darkToggle = document.getElementById('darkModeToggle');

let seconds = 0;
let timerInterval;

// Add task
taskForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  const duration = durationInput.value;

  if (taskText !== '') {
    const li = document.createElement('li');
    li.className = 'taskItem';
    li.innerHTML = `
      <span>${taskText} - ${duration}</span>
      <button class="deleteBtn">Delete</button>
    `;
    taskList.appendChild(li);
    taskInput.value = '';
    durationInput.value = '1 hour'; // default reset
    updateProgress();
  }
});

// Delete task
taskList.addEventListener('click', function (e) {
  if (e.target.classList.contains('deleteBtn')) {
    e.target.parentElement.remove();
    updateProgress();
  }
});

// Timer functions
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    seconds++;
    timeDisplay.textContent = seconds;
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  seconds = 0;
  timeDisplay.textContent = seconds;
}

// Update progress bar
function updateProgress() {
  const total = document.querySelectorAll('.taskItem').length;
  const percent = Math.min(total * 10, 100);
  progress.style.width = percent + '%';
}

// Toggle dark mode
darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
