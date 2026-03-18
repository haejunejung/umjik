# umjik - Project Instructions

## 이 프로젝트가 무엇인가

umjik은 React Native를 위한 선언적 애니메이션 라이브러리입니다.
framer-motion(현재 Motion) 호환 API를 제공하여, 누구나 쉽게 고성능 애니메이션을 만들 수 있도록 합니다.

## 핵심 원칙

1. **사용자 API는 framer-motion을 따른다.** 내부에서 RN/Reanimated에 맞게 변환한다.
2. **성능은 Reanimated에 위임한다.** umjik은 추상화 레이어이지, 애니메이션 엔진이 아니다.
3. **변경의 이유가 다른 것들을 분리한다.** Public API / Engine / Adapter 3개 레이어.
4. **factory 패턴으로 확장성을 확보한다.** Motion.View도 createMotionComponent(View)의 결과물일 뿐이다.

## 모노레포 구조

이 프로젝트는 pnpm workspace 기반 모노레포입니다.
라이브러리 소스 코드는 `packages/src/`에 위치합니다.

```
UMJIK/                              # 모노레포 루트
├── .github/workflows/
│   └── ci.yml
├── .vscode/
│   └── settings.json
├── docs/                           # 프로젝트 문서
│   ├── OVERVIEW.md
│   ├── ARCHITECTURE.md
│   ├── API_SPEC.md
│   ├── IMPLEMENTATION_GUIDE.md
│   └── FIRST_PRINCIPLES.md
├── packages/                       # 라이브러리 패키지
│   ├── src/
│   │   ├── components/
│   │   │   ├── createMotionComponent.tsx
│   │   │   ├── Motion.ts
│   │   │   └── AnimatePresence.tsx
│   │   ├── context/
│   │   │   └── PresenceContext.ts
│   │   ├── engine/
│   │   │   ├── resolveAnimation.ts
│   │   │   ├── resolveVariants.ts
│   │   │   ├── resolveTransition.ts
│   │   │   └── diffState.ts
│   │   ├── adapters/
│   │   │   └── reanimated.ts
│   │   ├── types/
│   │   │   ├── animation.ts
│   │   │   └── components.ts
│   │   └── index.ts
│   ├── package.json
│   ├── rolldown.config.ts
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   └── vitest.setup.ts
├── .gitignore
├── .nvmrc
├── .oxfmtrc.json
├── .oxlintrc.json
├── CLAUDE.md                       # 이 파일
├── CONTRIBUTING.md
├── lefthook.yml
├── LICENSE
├── package.json                    # 루트 workspace package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── README.md
```

## 구현 순서

반드시 아래 순서대로 구현합니다. 각 단계의 상세 내용은 `docs/IMPLEMENTATION_GUIDE.md`를 참조합니다.
모든 소스 파일은 `packages/src/` 아래에 생성합니다.

1. 타입 정의 (`packages/src/types/`)
2. Engine 모듈 (`packages/src/engine/`)
3. Reanimated Adapter (`packages/src/adapters/reanimated.ts`)
4. createMotionComponent (`packages/src/components/createMotionComponent.tsx`)
5. AnimatePresence (`packages/src/components/AnimatePresence.tsx`, `packages/src/context/PresenceContext.ts`)
6. Public exports (`packages/src/components/Motion.ts`, `packages/src/index.ts`)

## 의존성

- **peer dependency** (packages/package.json): `react-native-reanimated` (>= 3.0.0)
- **peer dependency** (packages/package.json): `react` (>= 18.0.0), `react-native` (>= 0.72.0)
- **dev dependency** (packages/package.json): `typescript`, `@types/react`, `@types/react-native`

## 도구

- **패키지 매니저**: pnpm (workspace)
- **번들러**: rolldown (`packages/rolldown.config.ts`)
- **테스트**: vitest (`packages/vitest.config.ts`) — `pnpm --filter umjik test`
- **테스트 커버리지**: `pnpm --filter umjik test --coverage`
- **린트**: oxlint (`.oxlintrc.json`)
- **포맷**: oxfmt (`.oxfmtrc.json`)
- **git hooks**: lefthook (`lefthook.yml`)
- **시각적 테스트**: Storybook (`apps/storybook-web/` — react-native-web 기반)

## 테스트 전략

**TDD는 필수입니다.** 구현 코드보다 테스트를 먼저 작성합니다 (Red → Green → Refactor).

### 테스트 러너 및 환경

- **프레임워크**: vitest (`packages/vitest.config.ts`)
- **환경**: jsdom
- **Mock 위치**: `packages/src/__mocks__/` — RN과 Reanimated의 공유 mock

### 레이어별 테스트 방식

- **Engine 모듈** (`engine/__tests__/`): 순수 함수이므로 mock 없이 단위 테스트
- **Adapter** (`adapters/__tests__/`): `react-native-reanimated`를 mock 처리 후 hook 테스트
- **Component** (`components/__tests__/`): RN + Reanimated 모두 mock 처리 후 렌더 테스트
- **시각적 검증**: Storybook (`apps/storybook-web/`) — 실제 애니메이션 동작 확인

### 테스트 파일 구조

```
packages/src/
├── engine/__tests__/          # 순수 단위 테스트
├── adapters/__tests__/        # mock 기반 hook 테스트
├── components/__tests__/      # mock 기반 렌더 테스트
└── __mocks__/                 # 공유 mock (react-native, react-native-reanimated)
```

## 문서 참조 순서

이 프로젝트를 이해하려면 아래 순서로 문서를 읽습니다.

1. `docs/OVERVIEW.md` — 왜 만드는지, 무엇이 다른지
2. `docs/FIRST_PRINCIPLES.md` — 모든 결정의 근본 전제와 리스크
3. `docs/API_SPEC.md` — 정확한 API 인터페이스
4. `docs/ARCHITECTURE.md` — 내부 구조와 데이터 흐름
5. `docs/IMPLEMENTATION_GUIDE.md` — 구현 순서, 코드, 검증 기준
