


let prepMinutes = 0;
let clockInterval;
let timerInterval;
const ACCELERATION = 1.1; // 10% 빠르게

// 현재 시각 +10분 표시
function updateCurrentTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 10);
  const date = now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  const time = now.toTimeString().split(' ')[0].substring(0, 8);
document.getElementById('currentTime').innerHTML = `${date}<br><span class="current-time-text">${time}</span>`;
}

// 페이지 전환
function goToPage(pageNum) {
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`page${i}`).classList.add('hidden');
  }
  document.getElementById(`page${pageNum}`).classList.remove('hidden');

  if (pageNum === 1) {
    updateCurrentTime();
    clearInterval(clockInterval);
    clockInterval = setInterval(updateCurrentTime, 1000);
  } else {
    clearInterval(clockInterval);
  }
}

// select 옵션 초기화
function initTimeSelects() {
  const hourSelects = [document.getElementById('transitHour'), document.getElementById('prepHour')];
  const minuteSelects = [document.getElementById('transitMinute'), document.getElementById('prepMinute')];

  for (const select of hourSelects) {
    for (let i = 0; i <= 12; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i.toString().padStart(2, '0');
      select.appendChild(option);
    }
  }

  for (const select of minuteSelects) {
    for (let i = 0; i < 60; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i.toString().padStart(2, '0');
      select.appendChild(option);
    }
  }
}

// 시간 계산
function calculateTimes() {
  const appointment = document.getElementById('appointmentTime').value;
  if (!appointment) {
    alert("Please enter your appointment time.");
    return;
  }

  const [aHour, aMinute] = appointment.split(':').map(Number);
  const transitMinutes = Number(document.getElementById('transitHour').value) * 60 + Number(document.getElementById('transitMinute').value);
  prepMinutes = Number(document.getElementById('prepHour').value) * 60 + Number(document.getElementById('prepMinute').value);

  const appointmentDate = new Date();
  appointmentDate.setHours(aHour, aMinute, 0, 0);
  const leaveTime = new Date(appointmentDate.getTime() - transitMinutes * 60000 - 10 * 60000);
  const prepStart = new Date(leaveTime.getTime() - prepMinutes * 60000);

  document.getElementById('prepStartTime').textContent = prepStart.toTimeString().slice(0, 5);
  document.getElementById('leaveTime').textContent = leaveTime.toTimeString().slice(0, 5);

  goToPage(3);
}

// 타이머 시작
function startTimer() {
  goToPage(4);
  startCountdown(prepMinutes * 60);
  startFastClock();

    // 음악 재생
  const audio = document.getElementById('countdownAudio');
  audio.play();

}

// 가속 카운트다운 (프로그레스 감소형)
function startCountdown(totalSeconds) {
  const progressCircle = document.getElementById('progress');
  let remaining = totalSeconds;
  const dasharray = 2 * Math.PI * 120; // r=100 원둘레

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (remaining <= 0) {
      clearInterval(timerInterval);
      document.getElementById('countdownTime').textContent = "00:00";
      progressCircle.setAttribute('stroke-dashoffset', dasharray);

      // 음악 정지
      const audio = document.getElementById('countdownAudio');
      audio.pause();
      audio.currentTime = 0;

        // 완료 사운드 재생
    const finishAudio = document.getElementById('finishAudio');
    finishAudio.play();


      goToPage(5);
      return;
    }



    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    document.getElementById('countdownTime').textContent =
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const progress = dasharray * (1 - (remaining / totalSeconds));
    progressCircle.setAttribute('stroke-dashoffset', progress);

    remaining--;
  }, 1000 / ACCELERATION);
}

// 가속된 현재시간 표시
function startFastClock() {
  function updateFastTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10);
    const date = now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    const time = now.toTimeString().slice(0, 5);
    document.getElementById('currentFastTime').innerHTML = 
  `<span class="fast-date">${date}</span><br><span class="fast-time">${time}</span>`;

  }
  updateFastTime();
  setInterval(updateFastTime, 1000);
}

// 초기 설정
initTimeSelects();
goToPage(1);
