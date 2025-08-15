# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a schedule creator project for 4-team 3-shift rotation scheduling (4조 3교대 근무 일정표). The project is in its initial setup phase.

## Development Notes

- Program language is JavaScript with ES modules
- Web interface built with HTML/CSS for user-friendly schedule viewing
- Project structure includes CLI and web interface modes
- The main goal is to create a system for generating work schedules for a 4-team, 3-shift rotation system
- The pattern involves: Day shift → Night shift → Evening shift → Rest day rotation over a 12-day cycle
- Schedule table structure: Row=dates, Column=dates (1조, 2조, 3조, 4조)

## Commands

```bash
npm start      # Run CLI scheduler
npm run web    # Start web server at http://localhost:8000
npm test       # Run test suite
npm run dev    # Development mode with file watching
```

## Common 4-Team 3-Shift Rules

- 4 teams rotate through 3 shifts (day, night, evening) plus rest periods
- Standard shift times are typically:
  - Day: 07:00-15:00 (8hour)
  - Evening: 15:00-22:00 (7hour)
  - Night: 22:00-07:00 (9hour)
- Each team follows a pattern: 3 days on each shift, then 1 days rest
- 3 days on day shift then 1 days rest -> 3 days on night on day shift then 1 days rest -> 3 days on evening shift then 1 days rest
- The complete cycle is 12 days before repeating
- 각 조는 같은 시간대에 근무하지 않는다.

## example

- 1조가 11일, 12일, 13일 근무 후 14일에 휴식을 한다면, 2조는 10일, 11일, 12일 근무 후 13일에 휴식을 갖고 3조는 9일, 10일, 11일 근무 후 12일에 휴식을 갖는다. 마지막으로 4조는 8일, 9일, 10일 근무 후 11일에 휴식을 갖는다.

1조 Day Day Day Rest Night ...

2조 Evening Evening Rest Day Day ...

3조 Night Rest Evening Evening Evning ...

4조 Rest Night Night Night Rest ...

- 각 조가 하루를 차이로 휴일을 가짐.
