/**
 * 4조 3교대 근무 일정표 생성기
 * 12일 주기 패턴: 3일 Day → 1일 Rest → 3일 Night → 1일 Rest → 3일 Evening → 1일 Rest
 */

export class ShiftScheduler {
  constructor() {
    this.teams = ['1조', '2조', '3조', '4조'];
    this.shifts = ['Day', 'Night', 'Evening', 'Rest'];
    this.shiftTimes = {
      Day: '07:00-15:00 (8시간)',
      Night: '22:00-07:00 (9시간)',
      Evening: '15:00-22:00 (7시간)',
      Rest: '휴무',
    };

    // 12일 주기 패턴: 3일 Day → 1일 Rest → 3일 Night → 1일 Rest → 3일 Evening → 1일 Rest
    this.cycleLength = 12;

    // 12일 주기 내 패턴 정의
    this.cyclePattern = [
      'Day',
      'Day',
      'Day',
      'Rest', // 0-3: Day 3일 + Rest 1일
      'Night',
      'Night',
      'Night',
      'Rest', // 4-7: Night 3일 + Rest 1일
      'Evening',
      'Evening',
      'Evening',
      'Rest', // 8-11: Evening 3일 + Rest 1일
    ];
  }

  /**
   * 특정 날짜와 조에 대한 근무 상태 계산
   * @param {number} day - 기준일로부터 경과 일수 (0부터 시작)
   * @param {number} teamIndex - 조 인덱스 (0: 1조, 1: 2조, 2: 3조, 3: 4조)
   * @returns {string} - 근무 상태 ('Day', 'Night', 'Evening', 'Rest')
   */
  getTeamShiftForDay(day, teamIndex) {
    // CLAUDE.md 예제 구조 기반 4조 3교대 시스템:
    // 1조: Day Day Day Rest Night Night Night Rest Evening Evening Evening Rest
    // 2조: Evening Evening Evening Rest Day Day Day Rest Night Night Night Rest  
    // 3조: Night Night Night Rest Evening Evening Evening Rest Day Day Day Rest
    // 4조: Rest Night Night Night Rest Evening Evening Evening Rest Day Day Day
    
    // CLAUDE.md 예제를 기반으로 한 정확한 패턴 구현
    // 1조 Day Day Day Rest Night ...
    // 2조 Evening Evening Rest Day Day ...
    // 3조 Night Rest Evening Evening Evening ...  
    // 4조 Rest Night Night Night Rest ...
    const patterns = [
      // 1조: Day로 시작하여 기본 패턴 따름
      ['Day', 'Day', 'Day', 'Rest', 'Night', 'Night', 'Night', 'Rest', 'Evening', 'Evening', 'Evening', 'Rest'],
      // 2조: Evening으로 시작, 3일째에 Rest
      ['Evening', 'Evening', 'Rest', 'Day', 'Day', 'Day', 'Rest', 'Night', 'Night', 'Night', 'Rest', 'Evening'],
      // 3조: Night로 시작, 2일째에 Rest  
      ['Night', 'Rest', 'Evening', 'Evening', 'Evening', 'Rest', 'Day', 'Day', 'Day', 'Rest', 'Night', 'Night'],
      // 4조: Rest로 시작
      ['Rest', 'Night', 'Night', 'Night', 'Rest', 'Evening', 'Evening', 'Evening', 'Rest', 'Day', 'Day', 'Day']
    ];
    
    // 12일 주기에서 현재 위치 계산
    const cycleDay = day % 12;
    
    // 해당 조의 패턴에서 현재 날짜의 시프트 반환
    return patterns[teamIndex][cycleDay];
  }

  /**
   * 스케줄 생성
   * @param {Date} startDate - 시작 날짜
   * @param {number} days - 생성할 일수
   * @returns {Array} - 스케줄 데이터 배열
   */
  generateSchedule(startDate, days = 30) {
    const schedule = [];

    for (let day = 0; day < days; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + day);

      const daySchedule = {
        date: this.formatDate(currentDate),
        dayOfWeek: this.getKoreanDayOfWeek(currentDate.getDay()),
        teams: {},
      };

      this.teams.forEach((team, index) => {
        const shift = this.getTeamShiftForDay(day, index);
        daySchedule.teams[team] = {
          shift: shift,
          time: this.shiftTimes[shift],
        };
      });

      schedule.push(daySchedule);
    }

    return schedule;
  }

  /**
   * 스케줄을 테이블 형태로 출력
   * @param {Array} schedule - 스케줄 데이터
   * @param {number} month - 특정 월만 표시 (선택사항)
   */
  printScheduleTable(schedule, month = null) {
    let filteredSchedule = schedule;

    if (month) {
      filteredSchedule = schedule.filter((day) => {
        const date = new Date(day.date);
        return date.getMonth() + 1 === month;
      });
    }

    if (filteredSchedule.length === 0) {
      console.log(`${month ? month + '월' : ''} 스케줄 데이터가 없습니다.`);
      return;
    }

    console.log('\n' + '='.repeat(80));
    console.log('4조 3교대 근무 일정표 (12일 주기)');
    if (month) {
      const year = new Date(filteredSchedule[0].date).getFullYear();
      console.log(`${year}년 ${month}월`);
    }
    console.log('='.repeat(80));

    // 헤더
    console.log(
      '날짜'.padEnd(12) +
        '요일'.padEnd(4) +
        '1조'.padEnd(15) +
        '2조'.padEnd(15) +
        '3조'.padEnd(15) +
        '4조'.padEnd(15)
    );
    console.log('-'.repeat(80));

    // 데이터 출력
    filteredSchedule.forEach((day) => {
      const date = new Date(day.date);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

      let row = dateStr.padEnd(12) + day.dayOfWeek.padEnd(4);

      this.teams.forEach((team) => {
        const teamData = day.teams[team];
        const display = teamData.shift === 'Rest' ? '휴무' : teamData.shift;
        row += display.padEnd(15);
      });

      console.log(row);
    });

    console.log('='.repeat(80));

    // 교대 시간 안내
    console.log('\n교대 시간:');
    Object.entries(this.shiftTimes).forEach(([shift, time]) => {
      if (shift !== 'Rest') {
        console.log(`  ${shift}: ${time}`);
      }
    });

    console.log('\n패턴 설명:');
    console.log('  - 매일 정확히 3개 조가 근무 (Day, Night, Evening), 1개 조 휴무');
    console.log('  - 각 조: 3일 Day → 1일 Rest → 3일 Night → 1일 Rest → 3일 Evening → 1일 Rest (12일 주기)');
    console.log('  - 휴무일이 하루씩 차이로 공정한 순환');
  }

  /**
   * CSV 형태로 내보내기
   * @param {Array} schedule - 스케줄 데이터
   * @param {string} filename - 파일명
   */
  exportToCSV(schedule, filename = null) {
    if (!filename) {
      const today = new Date();
      filename = `shift_schedule_${today.getFullYear()}${(today.getMonth() + 1)
        .toString()
        .padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}.csv`;
    }

    const lines = ['날짜,요일,1조,2조,3조,4조'];

    schedule.forEach((day) => {
      const row = [
        day.date,
        day.dayOfWeek,
        day.teams['1조'].shift,
        day.teams['2조'].shift,
        day.teams['3조'].shift,
        day.teams['4조'].shift,
      ].join(',');
      lines.push(row);
    });

    return lines.join('\n');
  }

  // 유틸리티 메서드들
  formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  getKoreanDayOfWeek(dayOfWeek) {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[dayOfWeek];
  }
}

// 메인 실행 함수
export function main() {
  const scheduler = new ShiftScheduler();

  console.log('4조 3교대 스케줄러를 시작합니다...\n');

  // 오늘부터 30일간의 스케줄 생성
  const startDate = new Date();
  const schedule = scheduler.generateSchedule(startDate, 30);

  // 이번 달 스케줄 출력
  const currentMonth = startDate.getMonth() + 1;
  scheduler.printScheduleTable(schedule, currentMonth);

  // 예제 패턴 확인 (처음 10일)
  console.log('\n\n처음 10일 패턴 확인:');
  scheduler.printScheduleTable(schedule.slice(0, 10));

  return schedule;
}

// Node.js 환경에서 스크립트로 직접 실행될 때만
if (
  typeof process !== 'undefined' &&
  process.argv &&
  import.meta.url === `file://${process.argv[1]}`
) {
  main();
}
