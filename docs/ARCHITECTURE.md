# umjik — 아키텍처

## 왜 레이어를 나누는가

umjik의 API는 framer-motion을 따르지만, 실제 애니메이션 실행은 Reanimated가 합니다.
이 두 세계는 네이밍, 단위 체계, 실행 모델이 모두 다릅니다.

이 간극을 메우는 변환 로직이 컴포넌트 코드에 섞이면 유지보수가 어려워집니다.
또한 Reanimated는 메이저 업데이트 시 API가 바뀔 수 있습니다 (실제로 v4에서 worklet이 별도 패키지로 분리됨).

**변경의 이유가 다른 것들을 분리합니다:**

- Public API가 바뀌는 이유: framer-motion이 API를 바꿀 때
- Engine이 바뀌는 이유: 변환 로직 버그 또는 새 속성 지원
- Adapter가 바뀌는 이유: Reanimated 메이저 업데이트

---

## 세 개의 레이어

```
┌──────────────────────────────────────────────────────────┐
│  Public API Layer                                        │
│  Motion.View, AnimatePresence, createMotionComponent     │
│  → 사용자 props를 받아서 Engine에 전달                     │
└──────────────────────┬────────────────────────────────────┘
                       │
┌──────────────────────▼────────────────────────────────────┐
│  Animation Engine Layer                                   │
│  resolveAnimation, resolveTransition, resolveVariants,    │
│  diffState                                                │
│  → framer-motion 네이밍/단위를 내부 표준으로 변환           │
│  → 순수 함수. 플랫폼에 의존하지 않음. 테스트 용이.          │
└──────────────────────┬────────────────────────────────────┘
                       │
┌──────────────────────▼────────────────────────────────────┐
│  Platform Adapter Layer                                   │
│  useReanimatedAdapter                                     │
│  → 정규화된 명세를 Reanimated API로 실행                    │
│  → 이 레이어만 Reanimated에 의존                           │
└───────────────────────────────────────────────────────────┘
```

---

## 소스 코드 위치

모노레포 구조에서 모든 소스 코드는 `packages/src/` 아래에 위치합니다.

```
packages/
├── src/
│   ├── components/                        # Public API Layer
│   │   ├── createMotionComponent.tsx      # factory 핵심 로직
│   │   ├── Motion.ts                      # 기본 Motion.View/Text/Image/ScrollView
│   │   └── AnimatePresence.tsx            # exit 애니메이션 제어
│   │
│   ├── context/                           # 내부 통신
│   │   └── PresenceContext.ts             # AnimatePresence ↔ Motion 통신
│   │
│   ├── engine/                            # Animation Engine Layer
│   │   ├── resolveAnimation.ts            # x→translateX 등 속성 변환
│   │   ├── resolveVariants.ts             # variant 이름 → 스타일 객체
│   │   ├── resolveTransition.ts           # 초→밀리초 등 transition 정규화
│   │   └── diffState.ts                   # 이전/현재 상태 비교
│   │
│   ├── adapters/                          # Platform Adapter Layer
│   │   └── reanimated.ts                  # Reanimated hook 래퍼
│   │
│   ├── types/                             # 타입 정의
│   │   ├── animation.ts                   # AnimationState, TransitionConfig
│   │   └── components.ts                  # MotionProps, AnimatePresenceProps
│   │
│   └── index.ts                           # public exports
│
├── package.json                           # 패키지 의존성
├── rolldown.config.ts                     # 번들 설정
├── tsconfig.json                          # TypeScript 설정
├── vitest.config.ts                       # 테스트 설정
└── vitest.setup.ts                        # 테스트 셋업
```

---

## 데이터 흐름

```
사용자 코드:
<Motion.View
  animate={{ x: 100, opacity: 1 }}
  transition={{ duration: 0.3 }}
/>

① Public API Layer (createMotionComponent)
   props에서 initial, animate, exit, transition, variants 추출

② Engine: resolveVariants
   animate가 string이면 variants에서 실제 스타일 객체로 resolve
   예: "visible" → { opacity: 1, x: 100 }

③ Engine: resolveAnimation
   framer-motion 네이밍을 내부 표준으로 변환
   예: { x: 100 } → { translateX: 100 }
   예: { rotate: 90 } → { rotate: '90deg' }

④ Engine: resolveTransition
   transition 옵션 정규화
   예: { duration: 0.3 } → { duration: 300 }
   type이 없으면 속성 기반 기본값 적용

⑤ Engine: diffState
   이전 animate 값과 비교하여 변경된 속성만 추출

⑥ Platform Adapter (useReanimatedAdapter)
   정규화된 명세 → Reanimated 호출
   예: sharedValue.value = withTiming(100, { duration: 300 })
```

---

## Engine 모듈 상세

### resolveAnimation.ts

framer-motion 속성명을 RN 속성명으로 변환합니다.

```ts
// 변환 맵
const PROPERTY_MAP: Record<string, string> = {
  x: 'translateX',
  y: 'translateY',
};

// rotate: number → string 변환
// rotate: 90 → '90deg'

function resolveAnimation(state: AnimationState): ResolvedAnimationState {
  // 1. 속성명 변환 (x → translateX)
  // 2. 값 변환 (rotate: 90 → '90deg')
  // 3. 단축 속성과 직접 속성 충돌 해결 (x와 translateX 동시 지정 시 x 우선)
}
```

### resolveTransition.ts

transition 옵션을 Reanimated 호환 형식으로 정규화합니다.

```ts
function resolveTransition(
  transition: TransitionConfig | undefined,
  property: string
): ResolvedTransitionConfig {
  // 1. 속성별 개별 transition 확인
  //    예: transition.opacity가 있으면 opacity에 대해서는 그걸 사용
  //
  // 2. type 기본값 결정 (framer-motion smart defaults)
  //    물리적 속성 (translateX, scale 등) → 'spring'
  //    비물리적 속성 (opacity, backgroundColor 등) → 'timing'
  //
  // 3. 단위 변환
  //    duration: 초 → 밀리초
  //    delay: 초 → 밀리초
  //
  // 4. easing 변환
  //    framer-motion easing 이름 → Reanimated Easing 함수
}
```

### resolveVariants.ts

variant 이름을 실제 스타일 객체로 resolve합니다.

```ts
function resolveVariants(
  value: AnimationState | string | boolean | undefined,
  variants: Record<string, AnimationState> | undefined
): AnimationState | undefined {
  // value가 string이면 variants에서 찾아서 반환
  // value가 객체면 그대로 반환
  // variants에 없는 이름이면 경고 + undefined 반환
}
```

### diffState.ts

이전 상태와 현재 상태를 비교하여 변경된 속성만 추출합니다.

```ts
interface StateDiff {
  property: string;
  from: any;
  to: any;
  transition: ResolvedTransitionConfig;
}

function diffState(
  prev: ResolvedAnimationState | undefined,
  next: ResolvedAnimationState,
  transition: TransitionConfig | undefined
): StateDiff[] {
  // 1. prev와 next의 속성을 비교
  // 2. 값이 변경된 속성만 추출
  // 3. 각 속성에 대해 resolved transition 포함
}
```

---

## Adapter 상세

### useReanimatedAdapter

Engine에서 정규화된 명세를 받아 Reanimated API를 호출하는 React hook입니다.

```ts
function useReanimatedAdapter(
  diffs: StateDiff[],
  options?: { onComplete?: () => void }
): { animatedStyle: object } {
  // 1. 각 속성에 대한 SharedValue 생성/관리
  //    MVP: 지원 속성에 대해 SharedValue를 미리 생성
  //
  // 2. diffs 변경 시 각 속성에 대해 애니메이션 실행
  //    type: 'timing' → withTiming(toValue, config)
  //    type: 'spring' → withSpring(toValue, config)
  //    delay → withDelay로 감싸기
  //
  // 3. useAnimatedStyle로 최종 스타일 반환
  //    transform 속성 → transform 배열로 묶기
  //    나머지 → 직접 반환
  //
  // 4. 완료 콜백 처리
  //    모든 속성 애니메이션 완료 시 onComplete 호출
}
```

**SharedValue 동적 생성 문제**: React hooks 규칙상 useSharedValue를 조건부 호출할 수 없다. MVP에서는 지원 속성에 대해 미리 생성. 성능 문제 확인 시 useRef + makeMutable로 전환.

---

## 테스트 아키텍처 (Test Architecture)

각 레이어는 성격에 맞는 테스트 전략을 가집니다.

### 레이어별 테스트 전략

| 레이어 | 테스트 유형 | Mock 필요 여부 | 비고 |
|---|---|---|---|
| Engine | 순수 단위 테스트 | 불필요 | 외부 의존성 없음 |
| Adapter | mock 기반 hook 테스트 | Reanimated mock 필요 | `useSharedValue`, `withTiming` 등 |
| Component | mock 기반 렌더 테스트 | RN + Reanimated mock 필요 | `@testing-library/react-native` 활용 |
| 시각적 | Storybook | 불필요 | 실제 디바이스/웹 렌더링 |

### Engine Layer: 순수 단위 테스트

Engine 모듈은 React, RN, Reanimated에 의존하지 않는 순수 함수입니다.
mock 없이 입력/출력을 직접 검증합니다.

```ts
// 예: resolveAnimation 단위 테스트
import { resolveAnimation } from '../resolveAnimation';

test('x를 translateX로 변환한다', () => {
  expect(resolveAnimation({ x: 100 })).toEqual({ translateX: 100 });
});
```

### Adapter Layer: mock 기반 hook 테스트

`react-native-reanimated`를 vitest alias로 mock 처리합니다.
`renderHook`으로 hook을 실행하고 SharedValue 상태 변화를 검증합니다.

### Component Layer: mock 기반 렌더 테스트

`react-native`와 `react-native-reanimated` 모두 mock 처리합니다.
`@testing-library/react-native`의 `render`로 컴포넌트를 렌더하고
props 전달, 상태 전환, 콜백 호출을 검증합니다.

### 시각적 테스트: Storybook

자동화 테스트가 커버할 수 없는 실제 애니메이션 동작을 눈으로 확인합니다.

- **웹**: `apps/storybook-web/` — react-native-web 기반
- **네이티브**: Expo 기반 Storybook 앱

### 테스트 파일 구조

```
packages/src/
├── engine/
│   └── __tests__/          # 순수 단위 테스트 (mock 불필요)
│       ├── resolveAnimation.test.ts
│       ├── resolveTransition.test.ts
│       ├── resolveVariants.test.ts
│       └── diffState.test.ts
├── adapters/
│   └── __tests__/          # mock 기반 hook 테스트
│       └── reanimated.test.ts
├── components/
│   └── __tests__/          # mock 기반 컴포넌트 렌더 테스트
│       ├── createMotionComponent.test.tsx
│       └── AnimatePresence.test.tsx
└── __mocks__/              # 공유 mock (RN, Reanimated)
    ├── react-native.ts
    └── react-native-reanimated.ts
```

---

## AnimatePresence 내부 동작

### children 추적 메커니즘

```
show=true → show=false 전환 시:

1. AnimatePresence가 현재 children과 이전 children을 비교
2. 사라진 child를 "exiting" 상태로 내부 목록(presentChildren)에 유지
3. PresenceContext.Provider로 각 child를 감싸서 상태 전달
4. Motion 컴포넌트가 useContext(PresenceContext)로 상태 수신
5. status === 'exiting'이면 animate 대신 exit 스타일로 애니메이션
6. 애니메이션 완료 → presence.onExitComplete() 호출
7. AnimatePresence가 presentChildren에서 해당 child 제거
8. React가 실제 unmount 수행
```

### mode: 'wait' 동작

```
exiting 중인 child가 있으면:
  → 새로 entering할 child를 렌더하지 않음
  → exiting 완료 후 entering child 렌더 시작
```

### Context 통신

```tsx
// AnimatePresence가 각 child를 Provider로 감싸서 렌더
{presentChildren.map(child => (
  <PresenceContext.Provider
    key={child.key}
    value={{
      status: child.status,
      onExitComplete: () => handleExitComplete(child.key),
    }}
  >
    {child.element}
  </PresenceContext.Provider>
))}
```

### Edge Cases

구현 시 다뤄야 할 edge case:

1. **Exit 중 같은 key 재진입**: exiting을 취소하고 animate로 전환
2. **여러 child 동시 exit**: 각각 독립적으로 exit 애니메이션 실행
3. **key 없는 child**: 경고 출력, AnimatePresence 기능 비활성화
4. **중첩 AnimatePresence**: 각각 독립적으로 동작 (Context가 가장 가까운 Provider 사용)
