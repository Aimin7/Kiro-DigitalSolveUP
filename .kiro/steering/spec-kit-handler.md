---
inclusion: always
---

# Spec-Kit Command Handler

Kiro에서 spec-kit 명령어를 처리하는 핸들러입니다.

## 명령어 감지 및 처리

사용자가 다음 패턴으로 메시지를 시작하면 해당 명령어로 처리:

- `/specify` - 기능 명세 생성
- `/plan` - 구현 계획 생성  
- `/tasks` - 작업 목록 생성

## 처리 로직

### `/specify` 명령어
```
1. 사용자 입력에서 기능 설명 추출
2. 새로운 기능 번호 생성 (001, 002, ...)
3. specs/[번호-기능명]/ 디렉토리 생성
4. spec-template.md 기반으로 spec.md 생성
5. 사용자 시나리오, 요구사항, 엔티티 정의
```

### `/plan` 명령어  
```
1. 최신 spec.md 파일 찾기
2. 기술 스택 정보 추출
3. plan-template.md 기반으로 plan.md 생성
4. research.md, data-model.md, quickstart.md 생성
5. contracts/ 디렉토리에 API 명세 생성
```

### `/tasks` 명령어
```
1. 최신 plan.md 파일 찾기
2. 설계 문서들 분석
3. tasks-template.md 기반으로 tasks.md 생성
4. TDD 순서로 작업 정렬
5. 병렬 실행 가능 작업 표시
```

## 파일 참조

템플릿 파일들:
- `#[[file:spec-kit/templates/spec-template.md]]`
- `#[[file:spec-kit/templates/plan-template.md]]`
- `#[[file:spec-kit/templates/tasks-template.md]]`