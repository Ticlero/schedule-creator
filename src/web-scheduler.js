import { ShiftScheduler } from './scheduler.js';

class WebScheduler extends ShiftScheduler {
  constructor() {
    super();
    this.currentSchedule = null;
    this.initializeEventListeners();
    this.setDefaultDate();
    this.generateDefaultSchedule();
  }
  
  initializeEventListeners() {
    const generateBtn = document.getElementById('generate-btn');
    const exportBtn = document.getElementById('export-btn');
    
    generateBtn.addEventListener('click', () => this.handleGenerateSchedule());
    exportBtn.addEventListener('click', () => this.handleExportCSV());
  }
  
  setDefaultDate() {
    const today = new Date();
    const dateInput = document.getElementById('start-date');
    dateInput.value = today.toISOString().split('T')[0];
  }
  
  generateDefaultSchedule() {
    const today = new Date();
    this.currentSchedule = this.generateSchedule(today, 30);
    this.renderScheduleTable(this.currentSchedule);
  }
  
  handleGenerateSchedule() {
    const startDateInput = document.getElementById('start-date');
    const daysCountInput = document.getElementById('days-count');
    
    const startDate = new Date(startDateInput.value);
    const daysCount = parseInt(daysCountInput.value) || 30;
    
    if (isNaN(startDate.getTime())) {
      alert('올바른 시작 날짜를 선택해주세요.');
      return;
    }
    
    if (daysCount < 1 || daysCount > 60) {
      alert('표시 일수는 1-60일 사이여야 합니다.');
      return;
    }
    
    // 로딩 상태 표시
    this.showLoading();
    
    setTimeout(() => {
      this.currentSchedule = this.generateSchedule(startDate, daysCount);
      this.renderScheduleTable(this.currentSchedule);
    }, 100);
  }
  
  handleExportCSV() {
    if (!this.currentSchedule) {
      alert('먼저 일정표를 생성해주세요.');
      return;
    }
    
    const csvContent = this.exportToCSV(this.currentSchedule);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const today = new Date();
    const filename = `shift_schedule_${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}.csv`;
    
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`CSV 파일이 다운로드되었습니다: ${filename}`);
  }
  
  showLoading() {
    const tableBody = document.getElementById('schedule-body');
    tableBody.innerHTML = '<tr><td colspan="6" class="loading">일정표를 생성하는 중...</td></tr>';
  }
  
  renderScheduleTable(schedule) {
    const tableBody = document.getElementById('schedule-body');
    tableBody.innerHTML = '';
    
    schedule.forEach(day => {
      const row = document.createElement('tr');
      
      // 날짜 셀
      const dateCell = document.createElement('td');
      const date = new Date(day.date);
      dateCell.textContent = `${date.getMonth() + 1}/${date.getDate()}`;
      row.appendChild(dateCell);
      
      // 요일 셀
      const dayCell = document.createElement('td');
      dayCell.textContent = day.dayOfWeek;
      
      // 주말 표시
      if (day.dayOfWeek === '토' || day.dayOfWeek === '일') {
        dayCell.style.color = '#e74c3c';
        dayCell.style.fontWeight = 'bold';
      }
      row.appendChild(dayCell);
      
      // 각 조별 셀 생성
      this.teams.forEach(team => {
        const teamCell = document.createElement('td');
        const teamData = day.teams[team];
        const shift = teamData.shift;
        
        if (shift === 'Rest') {
          teamCell.innerHTML = '<span class="shift-rest">휴무</span>';
        } else {
          const shiftClass = `shift-${shift.toLowerCase()}`;
          teamCell.innerHTML = `<span class="${shiftClass}">${shift}</span>`;
        }
        
        row.appendChild(teamCell);
      });
      
      tableBody.appendChild(row);
    });
  }
  
  // 테이블 구조를 Row=날짜, Column=팀으로 변경된 HTML 생성
  generateHTMLTable(schedule) {
    let html = '<table id="schedule-table">';
    
    // 헤더 생성
    html += '<thead><tr>';
    html += '<th>날짜</th>';
    html += '<th>요일</th>';
    this.teams.forEach(team => {
      html += `<th>${team}</th>`;
    });
    html += '</tr></thead>';
    
    // 바디 생성
    html += '<tbody>';
    schedule.forEach(day => {
      html += '<tr>';
      
      // 날짜
      const date = new Date(day.date);
      html += `<td>${date.getMonth() + 1}/${date.getDate()}</td>`;
      
      // 요일
      const dayClass = (day.dayOfWeek === '토' || day.dayOfWeek === '일') ? 'weekend' : '';
      html += `<td class="${dayClass}">${day.dayOfWeek}</td>`;
      
      // 각 조
      this.teams.forEach(team => {
        const teamData = day.teams[team];
        const shift = teamData.shift;
        
        if (shift === 'Rest') {
          html += '<td><span class="shift-rest">휴무</span></td>';
        } else {
          const shiftClass = `shift-${shift.toLowerCase()}`;
          html += `<td><span class="${shiftClass}">${shift}</span></td>`;
        }
      });
      
      html += '</tr>';
    });
    html += '</tbody></table>';
    
    return html;
  }
  
  // 특정 월만 필터링하는 기능
  filterByMonth(schedule, month) {
    return schedule.filter(day => {
      const date = new Date(day.date);
      return date.getMonth() + 1 === month;
    });
  }
  
  // 특정 조의 연속 근무일 분석
  analyzeWorkPattern(schedule, teamName) {
    const pattern = [];
    let consecutiveWork = 0;
    let consecutiveRest = 0;
    
    schedule.forEach((day, index) => {
      const shift = day.teams[teamName].shift;
      
      if (shift === 'Rest') {
        if (consecutiveWork > 0) {
          pattern.push({ type: 'work', days: consecutiveWork });
          consecutiveWork = 0;
        }
        consecutiveRest++;
      } else {
        if (consecutiveRest > 0) {
          pattern.push({ type: 'rest', days: consecutiveRest });
          consecutiveRest = 0;
        }
        consecutiveWork++;
      }
    });
    
    // 마지막 패턴 추가
    if (consecutiveWork > 0) {
      pattern.push({ type: 'work', days: consecutiveWork });
    }
    if (consecutiveRest > 0) {
      pattern.push({ type: 'rest', days: consecutiveRest });
    }
    
    return pattern;
  }
  
  // 통계 정보 생성
  generateStatistics(schedule) {
    const stats = {};
    
    this.teams.forEach(team => {
      stats[team] = {
        Day: 0,
        Night: 0,
        Evening: 0,
        Rest: 0
      };
    });
    
    schedule.forEach(day => {
      this.teams.forEach(team => {
        const shift = day.teams[team].shift;
        stats[team][shift]++;
      });
    });
    
    return stats;
  }
}

// DOM이 로드되면 웹 스케줄러 초기화
document.addEventListener('DOMContentLoaded', () => {
  new WebScheduler();
});