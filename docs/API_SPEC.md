# umjik — API 명세

## 핵심 원칙

> 사용자가 보는 API는 framer-motion을 따르고, 내부에서 RN/Reanimated에 맞게 변환한다.

## 내부 변환 테이블

| 사용자 입력 | 내부 변환 | 이유 |
|---|---|---|
| `x: 100` | `translateX: 100` | RN transform 네이밍 |
| `y: -20` | `translateY: -20` | RN transform 네이밍 |
| `rotate: 90` | `rotate: '90deg'` | RN은 문자열 단위 필요 |
| `scale: 1.2` | `scale: 1.2` | 변환 불필요 |
| `duration: 0.3` | `duration: 300` | framer-motion은 초, Reanimated는 밀리초 |

---

## 타입 정의

### AnimationState

애니메이트 가능한 스타일 속성입니다.

```ts
interface AnimationState {
  // framer-motion 호환 단축 속성 (내부에서 RN 속성으로 변환)
  x?: number;
  y?: number;
  rotate?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;

  // RN 속성 직접 사용
  opacity?: number;
  translateX?: number;
  translateY?: number;
  backgroundColor?: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  borderWidth?: number;
}
```

`x`와 `translateX`가 동시에 지정되면 `x`가 우선합니다 (framer-motion 호환 우선).

### TransitionConfig

```ts
type EasingFunction =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | [number, number, number, number];  // cubic-bezier

interface TransitionConfig {
  // 애니메이션 타입
  type?: 'timing' | 'spring';

  // timing 옵션
  duration?: number;           // 초 단위 (framer-motion 호환)
  easing?: EasingFunction;

  // spring 옵션 (physics-based)
  stiffness?: number;          // 기본값: 100
  damping?: number;            // 기본값: 10
  mass?: number;               // 기본값: 1

  // spring 옵션 (duration-based)
  bounce?: number;             // 0 ~ 1

  // 공통
  delay?: number;              // 초 단위

  // 속성별 개별 transition 설정
  // 예: { duration: 0.3, opacity: { duration: 0.5 } }
  [property: string]: TransitionConfig | any;
}
```

### 기본값 전략

framer-motion의 smart defaults를 따릅니다:

- 물리적 속성 (`x`, `y`, `scale`, `rotate`): `type: 'spring'`
- 비물리적 속성 (`opacity`, `backgroundColor`): `type: 'timing'`, `duration: 0.3`

### MotionProps

```ts
interface MotionProps {
  // 마운트 시 초기 상태. false면 initial 없이 animate로 바로 시작.
  initial?: AnimationState | string | boolean;

  // 목표 애니메이션 상태. string이면 variants에서 resolve.
  animate?: AnimationState | string;

  // 언마운트 시 애니메이션. AnimatePresence 내에서만 동작.
  exit?: AnimationState | string;

  // 애니메이션 전환 설정
  transition?: TransitionConfig;

  // 이름 기반 애니메이션 상태 정의
  variants?: Record<string, AnimationState>;

  // 애니메이션 완료 콜백
  onAnimationComplete?: () => void;
}
```

### AnimatePresenceProps

```ts
interface AnimatePresenceProps {
  children: React.ReactNode;

  // 'sync': entering과 exiting이 동시에 진행 (기본값)
  // 'wait': exiting이 끝난 후 entering 시작
  mode?: 'sync' | 'wait';

  // 모든 exit 애니메이션 완료 시 콜백
  onExitComplete?: () => void;
}
```

### PresenceContextValue (내부용)

```ts
interface PresenceContextValue {
  status: 'entering' | 'present' | 'exiting';
  onExitComplete: () => void;
}
```

---

## 컴포넌트 API

### Motion

```tsx
import { Motion } from 'umjik';

// 기본 제공 컴포넌트
<Motion.View initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
<Motion.Text animate={{ x: 10 }} />
<Motion.Image animate={{ scale: 1.2 }} />
<Motion.ScrollView animate={{ opacity: 1 }} />
```

Motion.View, Motion.Text 등은 createMotionComponent의 결과물입니다.
특별한 내부 로직이 없으며, 아래와 동일합니다:

```ts
const Motion = {
  View: createMotionComponent(View),
  Text: createMotionComponent(Text),
  Image: createMotionComponent(Image),
  ScrollView: createMotionComponent(ScrollView),
  create: createMotionComponent,
};
```

### createMotionComponent

```tsx
import { createMotionComponent } from 'umjik';
import { Pressable } from 'react-native';

const MotionPressable = createMotionComponent(Pressable);

<MotionPressable
  animate={{ scale: 0.95 }}
  transition={{ type: 'spring' }}
  onPress={handlePress}
/>
```

어떤 React Native 컴포넌트든 감쌀 수 있습니다.
`Animated.createAnimatedComponent`는 factory 내부에서 한 번만 호출되며 캐싱됩니다.

### AnimatePresence

```tsx
import { AnimatePresence } from 'umjik';

<AnimatePresence mode="wait" onExitComplete={() => console.log('done')}>
  {isVisible && (
    <Motion.View
      key="modal"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
    />
  )}
</AnimatePresence>
```

AnimatePresence 내부의 Motion 컴포넌트는 반드시 고유한 `key`를 가져야 합니다.

### Variants

```tsx
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

<Motion.View
  variants={cardVariants}
  initial="hidden"
  animate="visible"
  exit="hidden"
  transition={{ type: 'spring', stiffness: 120 }}
/>
```

variants 내에 transition을 포함할 수도 있습니다:

```tsx
const variants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120 },
  },
};
```

variant에 포함된 transition은 prop으로 전달된 transition보다 우선합니다.

---

## 미지원 기능 처리

MVP에서 지원하지 않는 framer-motion 옵션을 사용하면, 개발 모드에서 경고를 출력합니다:

```
[umjik] "whileTap" is not yet supported. It will be available in a future version.
```

프로덕션에서는 경고 없이 무시됩니다.
