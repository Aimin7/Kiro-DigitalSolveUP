---
inclusion: manual
---

# Spec-Kit Commands for Kiro

이 문서는 GitHub spec-kit의 `/specify`, `/plan`, `/tasks` 명령어를 Kiro에서 사용할 수 있도록 하는 가이드입니다.

## 명령어 개요

### `/specify` - 기능 명세 생성
사용자가 원하는 기능을 설명하면 체계적인 기능 명세서를 생성합니다.

**사용법**: `/specify [기능 설명]`

**예시**: 
```
/specify 사진을 앨범별로 정리할 수 있는 애플리케이션을 만들어줘. 앨범은 날짜별로 그룹화되고 메인 페이지에서 드래그 앤 드롭으로 재정렬할 수 있어야 해. 각 앨범 내에서는 사진들이 타일 형태로 미리보기 된다.
```

### `/plan` - 기술적 구현 계획 생성
기능 명세를 바탕으로 구체적인 기술 스택과 구현 계획을 수립합니다.

**사용법**: `/plan [기술 스택 및 아키텍처 설명]`

**예시**:
```
/plan 이 애플리케이션은 Vite를 사용하고 최소한의 라이브러리만 사용한다. 가능한 한 바닐라 HTML, CSS, JavaScript를 사용하고, 이미지는 업로드하지 않으며 메타데이터는 로컬 SQLite 데이터베이스에 저장한다.
```

### `/tasks` - 구현 작업 목록 생성
구현 계획을 바탕으로 실행 가능한 작업 목록을 생성합니다.

**사용법**: `/tasks`

## 명령어 처리 방식

### `/specify` 명령어 처리
1. 사용자 입력에서 기능 설명을 추출
2. spec-kit의 spec-template.md를 기반으로 명세서 생성
3. `specs/[번호-기능명]/spec.md` 파일로 저장
4. 사용자 시나리오, 기능 요구사항, 핵심 엔티티 정의
5. 검토 체크리스트 작성

### `/plan` 명령어 처리
1. 기존 spec.md 파일 로드
2. 기술적 컨텍스트 분석 및 설정
3. plan-template.md를 기반으로 구현 계획 생성
4. 연구 문서(research.md), 데이터 모델(data-model.md), 계약서(contracts/) 생성
5. 빠른 시작 가이드(quickstart.md) 작성

### `/tasks` 명령어 처리
1. 구현 계획 문서들 로드
2. tasks-template.md를 기반으로 작업 목록 생성
3. TDD 원칙에 따라 테스트 우선 순서 적용
4. 병렬 실행 가능한 작업 표시 ([P])
5. 의존성 그래프 생성

## 파일 구조

```
specs/
└── [번호-기능명]/
    ├── spec.md           # /specify 명령어 결과
    ├── plan.md           # /plan 명령어 결과
    ├── research.md       # 기술 연구 문서
    ├── data-model.md     # 데이터 모델 정의
    ├── quickstart.md     # 빠른 시작 가이드
    ├── tasks.md          # /tasks 명령어 결과
    └── contracts/        # API 계약서들
```

## 템플릿 참조

- **Spec Template**: `spec-kit/templates/spec-template.md`
- **Plan Template**: `spec-kit/templates/plan-template.md`  
- **Tasks Template**: `spec-kit/templates/tasks-template.md`

## 주요 원칙

1. **명세 우선**: 기술적 구현보다 사용자 요구사항에 집중
2. **TDD 적용**: 테스트를 먼저 작성하고 구현
3. **단계적 접근**: specify → plan → tasks → implement 순서
4. **명확성**: 모호한 요구사항은 [NEEDS CLARIFICATION] 표시
5. **검증 가능**: 모든 요구사항은 테스트 가능해야 함

## 사용 시 주의사항

- `/specify`에서는 기술적 세부사항 피하고 사용자 관점에서 기술
- `/plan`에서는 구체적인 기술 스택과 아키텍처 명시
- `/tasks`는 실행 가능한 단위로 작업 분할
- 각 단계에서 이전 단계의 결과물을 참조