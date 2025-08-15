import { ShiftScheduler } from '../src/scheduler.js';

function testScheduler() {
  console.log('=== 4조 3교대 스케줄러 테스트 ===\n');
  
  const scheduler = new ShiftScheduler();
  
  // 테스트 1: 기본 패턴 검증
  console.log('테스트 1: 10일 주기 패턴 검증');
  const testDate = new Date('2024-01-01');
  const schedule = scheduler.generateSchedule(testDate, 10);
  
  scheduler.printScheduleTable(schedule);
  
  // 테스트 2: 패턴 규칙 확인
  console.log('\n\n테스트 2: 패턴 규칙 확인');
  
  // 각 조가 3일 근무 후 1일 휴식 패턴 확인
  const teams = ['1조', '2조', '3조', '4조'];
  teams.forEach((team, teamIndex) => {
    console.log(`\n${team} 패턴:`);
    for (let day = 0; day < 10; day++) {
      const shift = scheduler.getTeamShiftForDay(day, teamIndex);
      const date = new Date(testDate);
      date.setDate(testDate.getDate() + day);
      console.log(`  ${date.getMonth() + 1}/${date.getDate()}: ${shift}`);
    }
  });
  
  // 테스트 3: 휴무일 패턴 확인
  console.log('\n\n테스트 3: 각 조별 휴무일 확인 (순차적으로 하루씩 차이)');
  
  const restDays = {};
  teams.forEach(team => {
    restDays[team] = [];
  });
  
  for (let day = 0; day < 10; day++) {
    schedule[day].teams && Object.entries(schedule[day].teams).forEach(([team, data]) => {
      if (data.shift === 'Rest') {
        restDays[team].push(day + 1);
      }
    });
  }
  
  console.log('10일 주기 내 휴무일:');
  Object.entries(restDays).forEach(([team, days]) => {
    console.log(`  ${team}: ${days.join(', ')}일`);
  });
  
  // 테스트 4: CSV 내보내기 테스트
  console.log('\n\n테스트 4: CSV 내보내기');
  const csvData = scheduler.exportToCSV(schedule.slice(0, 10));
  console.log('CSV 형태 출력 (처음 10일):');
  console.log(csvData);
  
  console.log('\n=== 테스트 완료 ===');
}

// 추가 유틸리티 테스트
function testUtilities() {
  console.log('\n\n=== 유틸리티 함수 테스트 ===');
  
  const scheduler = new ShiftScheduler();
  
  // 날짜 포맷팅 테스트
  const testDate = new Date('2024-03-15');
  console.log('날짜 포맷팅:', scheduler.formatDate(testDate));
  
  // 한국어 요일 테스트
  for (let i = 0; i < 7; i++) {
    console.log(`요일 ${i}:`, scheduler.getKoreanDayOfWeek(i));
  }
  
  console.log('=== 유틸리티 테스트 완료 ===');
}

// 메인 테스트 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  testScheduler();
  testUtilities();
}