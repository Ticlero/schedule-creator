# 4조 3교대 근무 일정표 생성기

10일 주기로 순환하는 4조 3교대 근무 시스템을 위한 일정표 생성 도구입니다.

## 특징

- ✅ 10일 주기 4조 3교대 시스템
- ✅ Day → Night → Evening → Rest 순서
- ✅ 각 조는 3일 근무 후 1일 휴식
- ✅ 순차적 휴무일 배치 (하루씩 차이)
- ✅ 웹 인터페이스와 CLI 모드 지원
- ✅ CSV 내보내기 기능
- ✅ 반응형 웹 디자인

## 교대 시간

| 교대 | 시간 | 근무시간 |
|------|------|----------|
| Day | 07:00-15:00 | 8시간 |
| Night | 22:00-07:00 | 9시간 |
| Evening | 15:00-22:00 | 7시간 |
| Rest | 휴무 | - |

## 설치 및 실행

### 웹 인터페이스 (권장)

```bash
# 웹 서버 시작
npm run web

# 브라우저에서 http://localhost:8000 접속
```

### CLI 모드

```bash
# 콘솔에서 일정표 출력
npm start

# 테스트 실행
npm test
```

## 웹 인터페이스 사용법

1. **시작 날짜 설정**: 달력에서 원하는 시작일 선택
2. **표시 일수 설정**: 1-60일 사이 값 입력 (기본 30일)
3. **일정표 생성**: "일정표 생성" 버튼 클릭
4. **CSV 내보내기**: "CSV 내보내기" 버튼으로 파일 다운로드

## 패턴 규칙

### 기본 순환 패턴
- 각 조: 3일 근무 + 1일 휴식 반복
- 시프트 순서: Day → Night → Evening → Rest
- 전체 주기: 10일

### 조별 휴무일 예시 (10일 주기)
- **1조**: 4일, 8일 휴무
- **2조**: 5일, 9일 휴무  
- **3조**: 6일, 10일 휴무
- **4조**: 1일, 7일 휴무

## 파일 구조

```
schedule-creator/
├── index.html          # 웹 인터페이스
├── style.css           # 스타일시트
├── server.js           # 웹 서버
├── src/
│   ├── scheduler.js    # 핵심 스케줄러 로직
│   └── web-scheduler.js # 웹용 확장 기능
├── test/
│   └── test.js         # 테스트 코드
└── README.md           # 사용법 안내
```

## API 사용 예제

```javascript
import { ShiftScheduler } from './src/scheduler.js';

const scheduler = new ShiftScheduler();
const startDate = new Date('2024-01-01');
const schedule = scheduler.generateSchedule(startDate, 30);

// 콘솔 출력
scheduler.printScheduleTable(schedule);

// CSV 내보내기
const csvData = scheduler.exportToCSV(schedule);
console.log(csvData);
```

## 라이선스

MIT License