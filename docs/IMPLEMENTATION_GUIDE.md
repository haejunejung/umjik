# umjik — 구현 가이드

이 문서는 구현 순서, 각 단계의 코드 스켈레톤, 그리고 검증 기준을 정의합니다.
반드시 1단계부터 순서대로 구현합니다.

모든 소스 파일은 `packages/src/` 아래에 생성합니다.
테스트는 vitest로 작성하며, `packages/vitest.config.ts` 설정을 사용합니다.

---

## 테스트 전략 (Test Strategy)

**TDD는 필수입니다. 구현 코드보다 테스트를 먼저 작성합니다.**

### 원칙

각 단계에서 반드시 아래 순서를 따릅니다:

1. **테스트 먼저 작성** — 실패하는 테스트를 먼저 작성합니다 (Red)
2. **최소한의 구현** — 테스트를 통과시키는 가장 단순한 코드를 작성합니다 (Green)
3. **리팩토링** — 동작을 유지하면서 코드를 정리합니다 (Refactor)

### 테스트 프레임워크

- **테스트 러너**: vitest (`packages/vitest.config.ts`)
- **환경**: jsdom (`environment: 'jsdom'`)
- **테스트 위치**: 소스 파일과 같은 위치의 `__tests__/` 디렉토리

### Mock 전략

`react-native`와 `react-native-reanimated`는 실제 네이티브 모듈을 포함하므로
JS 환경에서 직접 실행할 수 없습니다. vitest alias를 통해 mock으로 대체합니다.

- **mock 위치**: `packages/src/__mocks__/`
- **`react-native.ts`**: View, Text, Image 등 기본 컴포넌트를 div/span 등으로 매핑
- **`react-native-reanimated.ts`**: `useSharedValue`, `withTiming`, `withSpring`, `useAnimatedStyle` 등을 vitest spy로 구현

### 커버리지 대상

| 모듈 | 테스트 유형 | 파일 |
|---|---|---|
| `engine/resolveAnimation` | 순수 단위 테스트 | `engine/__tests__/resolveAnimation.test.ts` |
| `engine/resolveTransition` | 순수 단위 테스트 | `engine/__tests__/resolveTransition.test.ts` |
| `engine/resolveVariants` | 순수 단위 테스트 | `engine/__tests__/resolveVariants.test.ts` |
| `engine/diffState` | 순수 단위 테스트 | `engine/__tests__/diffState.test.ts` |
| `adapters/reanimated` | mock 기반 hook 테스트 | `adapters/__tests__/reanimated.test.ts` |
| `components/createMotionComponent` | mock 기반 렌더 테스트 | `components/__tests__/createMotionComponent.test.tsx` |
| `components/AnimatePresence` | mock 기반 렌더 테스트 | `components/__tests__/AnimatePresence.test.tsx` |

### 테스트 실행

```bash
# 전체 테스트 실행
pnpm --filter umjik test

# watch 모드 (개발 중)
pnpm --filter umjik test --watch

# 커버리지 리포트
pnpm --filter umjik test --coverage
```

---

## 1단계: 타입 정의

**파일**: `packages/src/types/animation.ts`, `packages/src/types/components.ts`

이후 모든 모듈이 공유하는 인터페이스를 먼저 정의합니다.

### packages/src/types/animation.ts

```ts
// framer-motion 호환 속성 (사용자 입력)
export interface AnimationState {
  // framer-motion 단축 속성
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

// Engine이 변환한 내부 표준 (RN 속성명 사용)
export interface ResolvedAnimationState {
  translateX?: number;
  translateY?: number;
  rotate?: string;        // '90deg'
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  opacity?: number;
  backgroundColor?: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  borderWidth?: number;
}

export type EasingFunction =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | [number, number, number, number];

export interface TransitionConfig {
  type?: 'timing' | 'spring';
  duration?: number;           // 초 단위
  easing?: EasingFunction;
  stiffness?: number;
  damping?: number;
  mass?: number;
  bounce?: number;
  delay?: number;              // 초 단위
  [property: string]: TransitionConfig | any;
}

// Engine이 정규화한 transition (밀리초, Reanimated 호환)
export interface ResolvedTransitionConfig {
  type: 'timing' | 'spring';
  duration?: number;           // 밀리초
  easing?: EasingFunction;
  stiffness?: number;
  damping?: number;
  mass?: number;
  delay?: number;              // 밀리초
}

export interface StateDiff {
  property: string;
  from: any;
  to: any;
  transition: ResolvedTransitionConfig;
}
```

### packages/src/types/components.ts

```ts
import { AnimationState, TransitionConfig } from './animation';

export interface MotionProps {
  initial?: AnimationState | string | boolean;
  animate?: AnimationState | string;
  exit?: AnimationState | string;
  transition?: TransitionConfig;
  variants?: Record<string, AnimationState>;
  onAnimationComplete?: () => void;
}

export interface AnimatePresenceProps {
  children: React.ReactNode;
  mode?: 'sync' | 'wait';
  onExitComplete?: () => void;
}

export interface PresenceContextValue {
  status: 'entering' | 'present' | 'exiting';
  onExitComplete: () => void;
}
```

### 검증 기준

**테스트 먼저**: 타입 정의 후 타입 import가 올바르게 동작하는지 확인하는 컴파일 테스트를 먼저 작성합니다.

- [ ] 모든 타입이 export되어 다른 모듈에서 import 가능
- [ ] `pnpm --filter packages tsc --noEmit` 에러 없음

---

## 2단계: Engine 모듈

**파일**: `packages/src/engine/resolveAnimation.ts`, `resolveTransition.ts`, `resolveVariants.ts`, `diffState.ts`

순수 함수로 구성합니다. React/RN/Reanimated에 의존하지 않습니다.

### packages/src/engine/resolveAnimation.ts

```ts
import { AnimationState, ResolvedAnimationState } from '../types/animation';

const PROPERTY_MAP: Record<string, string> = {
  x: 'translateX',
  y: 'translateY',
};

export function resolveAnimation(
  state: AnimationState | undefined
): ResolvedAnimationState | undefined {
  if (!state) return undefined;

  const resolved: ResolvedAnimationState = {};

  for (const [key, value] of Object.entries(state)) {
    const mappedKey = PROPERTY_MAP[key] || key;

    // x/y가 있으면 translateX/translateY보다 우선
    if (PROPERTY_MAP[key] && resolved[mappedKey as keyof ResolvedAnimationState] !== undefined) {
      continue;
    }

    // rotate: number → string 변환
    if (mappedKey === 'rotate' && typeof value === 'number') {
      (resolved as any)[mappedKey] = `${value}deg`;
    } else {
      (resolved as any)[mappedKey] = value;
    }
  }

  return resolved;
}
```

### packages/src/engine/resolveTransition.ts

```ts
import { TransitionConfig, ResolvedTransitionConfig } from '../types/animation';

const PHYSICAL_PROPERTIES = new Set([
  'translateX', 'translateY', 'scale', 'scaleX', 'scaleY', 'rotate',
]);

export function resolveTransition(
  transition: TransitionConfig | undefined,
  property: string
): ResolvedTransitionConfig {
  const propertyTransition = transition?.[property];
  const base = typeof propertyTransition === 'object'
    ? { ...transition, ...propertyTransition }
    : transition || {};

  const type = base.type || (PHYSICAL_PROPERTIES.has(property) ? 'spring' : 'timing');

  const resolved: ResolvedTransitionConfig = { type };

  if (type === 'timing') {
    resolved.duration = (base.duration ?? 0.3) * 1000;
    resolved.easing = base.easing || 'easeInOut';
  }

  if (type === 'spring') {
    resolved.stiffness = base.stiffness ?? 100;
    resolved.damping = base.damping ?? 10;
    resolved.mass = base.mass ?? 1;
  }

  if (base.delay !== undefined) {
    resolved.delay = base.delay * 1000;
  }

  return resolved;
}
```

### packages/src/engine/resolveVariants.ts

```ts
import { AnimationState } from '../types/animation';

export function resolveVariants(
  value: AnimationState | string | boolean | undefined,
  variants: Record<string, AnimationState> | undefined
): AnimationState | undefined {
  if (value === undefined || value === false) return undefined;
  if (value === true) return undefined;
  if (typeof value !== 'string') return value;

  if (!variants || !variants[value]) {
    if (__DEV__) {
      console.warn(`[umjik] Variant "${value}" not found in variants.`);
    }
    return undefined;
  }

  return variants[value];
}
```

### packages/src/engine/diffState.ts

```ts
import {
  ResolvedAnimationState,
  TransitionConfig,
  StateDiff,
} from '../types/animation';
import { resolveTransition } from './resolveTransition';

export function diffState(
  prev: ResolvedAnimationState | undefined,
  next: ResolvedAnimationState,
  transition: TransitionConfig | undefined
): StateDiff[] {
  const diffs: StateDiff[] = [];

  for (const [property, toValue] of Object.entries(next)) {
    const fromValue = prev?.[property as keyof ResolvedAnimationState];
    if (fromValue === toValue) continue;

    diffs.push({
      property,
      from: fromValue ?? getDefaultValue(property),
      to: toValue,
      transition: resolveTransition(transition, property),
    });
  }

  return diffs;
}

function getDefaultValue(property: string): any {
  switch (property) {
    case 'opacity': return 1;
    case 'scale':
    case 'scaleX':
    case 'scaleY': return 1;
    case 'translateX':
    case 'translateY': return 0;
    case 'rotate': return '0deg';
    case 'borderRadius':
    case 'borderWidth': return 0;
    default: return 0;
  }
}
```

### 검증 기준 (vitest 테스트 작성)

**테스트 먼저**: 아래 각 항목을 구현하기 전에 실패하는 테스트를 먼저 작성합니다.
테스트 파일 위치: `packages/src/engine/__tests__/`

- [ ] (테스트 먼저) resolveAnimation: `{ x: 100 }` → `{ translateX: 100 }`
- [ ] (테스트 먼저) resolveAnimation: `{ rotate: 90 }` → `{ rotate: '90deg' }`
- [ ] (테스트 먼저) resolveAnimation: `{ x: 100, translateX: 50 }` → `{ translateX: 100 }` (x 우선)
- [ ] (테스트 먼저) resolveTransition: `{ duration: 0.3 }` → `{ duration: 300 }`
- [ ] (테스트 먼저) resolveTransition: `translateX`에 type 미지정 → `type: 'spring'`
- [ ] (테스트 먼저) resolveTransition: `opacity`에 type 미지정 → `type: 'timing'`
- [ ] (테스트 먼저) resolveVariants: `"visible"` + variants → 스타일 객체 반환
- [ ] (테스트 먼저) resolveVariants: 존재하지 않는 variant 이름 → undefined + 경고
- [ ] (테스트 먼저) diffState: 변경된 속성만 추출, 동일 값은 스킵
- [ ] `pnpm --filter umjik test` 통과

---

## 3단계: Reanimated Adapter

**파일**: `packages/src/adapters/reanimated.ts`

Engine에서 정규화된 명세를 받아 Reanimated를 호출하는 hook입니다.

```ts
import { useRef, useEffect, useCallback } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { StateDiff, ResolvedTransitionConfig, EasingFunction } from '../types/animation';

const TRANSFORM_PROPERTIES = new Set([
  'translateX', 'translateY', 'scale', 'scaleX', 'scaleY', 'rotate',
]);

function mapEasing(easing: EasingFunction | undefined) {
  if (!easing) return Easing.inOut(Easing.ease);
  if (Array.isArray(easing)) return Easing.bezier(...easing);
  switch (easing) {
    case 'linear': return Easing.linear;
    case 'easeIn': return Easing.in(Easing.ease);
    case 'easeOut': return Easing.out(Easing.ease);
    case 'easeInOut': return Easing.inOut(Easing.ease);
    default: return Easing.inOut(Easing.ease);
  }
}

export function useReanimatedAdapter(
  diffs: StateDiff[],
  options?: { onComplete?: () => void }
) {
  // MVP: 지원 속성에 대해 SharedValue 미리 생성
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const borderRadius = useSharedValue(0);

  const sharedValues: Record<string, Animated.SharedValue<number>> = {
    translateX, translateY, scale, scaleX, scaleY, rotate,
    opacity, width, height, borderRadius,
  };

  useEffect(() => {
    if (diffs.length === 0) return;

    let completedCount = 0;
    const totalAnimations = diffs.length;

    const handleComplete = (finished?: boolean) => {
      completedCount++;
      if (completedCount >= totalAnimations && options?.onComplete) {
        runOnJS(options.onComplete)();
      }
    };

    for (const diff of diffs) {
      const sv = sharedValues[diff.property];
      if (!sv) continue;

      const { transition } = diff;
      const toValue = typeof diff.to === 'string'
        ? parseFloat(diff.to)
        : diff.to;

      let animation;
      if (transition.type === 'spring') {
        animation = withSpring(toValue, {
          stiffness: transition.stiffness,
          damping: transition.damping,
          mass: transition.mass,
        }, handleComplete);
      } else {
        animation = withTiming(toValue, {
          duration: transition.duration,
          easing: mapEasing(transition.easing),
        }, handleComplete);
      }

      if (transition.delay) {
        sv.value = withDelay(transition.delay, animation);
      } else {
        sv.value = animation;
      }
    }
  }, [diffs]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      width: width.value || undefined,
      height: height.value || undefined,
      borderRadius: borderRadius.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { scaleX: scaleX.value },
        { scaleY: scaleY.value },
        { rotate: `${rotate.value}deg` },
      ],
    };
  });

  return { animatedStyle };
}
```

### 검증 기준

**테스트 먼저**: `react-native-reanimated`를 mock한 상태에서 hook 동작을 검증하는 테스트를 먼저 작성합니다.
테스트 파일 위치: `packages/src/adapters/__tests__/reanimated.test.ts`

- [ ] (테스트 먼저) timing 애니메이션: opacity diff가 주어지면 `withTiming`이 올바른 값으로 호출됨
- [ ] (테스트 먼저) spring 애니메이션: translateX diff가 주어지면 `withSpring`이 올바른 설정으로 호출됨
- [ ] (테스트 먼저) delay: `withDelay`로 애니메이션이 감싸짐
- [ ] (테스트 먼저) onComplete: 모든 속성 애니메이션 완료 시 콜백 호출
- [ ] (테스트 먼저) transform 속성이 `useAnimatedStyle` 반환값에 배열 형태로 포함됨

**주의**: 위 코드는 MVP 스켈레톤입니다. 실제 구현 시 추가로 다뤄야 할 것:
- initial 값으로 SharedValue 초기화
- backgroundColor 등 색상 속성 처리 (interpolateColor)
- 사용하지 않는 transform 항목 최적화

---

## 4단계: createMotionComponent

**파일**: `packages/src/components/createMotionComponent.tsx`, `packages/src/components/Motion.ts`

### packages/src/components/createMotionComponent.tsx

```tsx
import React, { useContext, useMemo, useRef } from 'react';
import Animated from 'react-native-reanimated';
import { MotionProps } from '../types/components';
import { resolveAnimation } from '../engine/resolveAnimation';
import { resolveVariants } from '../engine/resolveVariants';
import { diffState } from '../engine/diffState';
import { useReanimatedAdapter } from '../adapters/reanimated';
import { PresenceContext } from '../context/PresenceContext';

export function createMotionComponent<P extends object>(
  Component: React.ComponentType<P>
) {
  // Animated 버전은 factory 호출 시 한 번만 생성
  const AnimatedComponent = Animated.createAnimatedComponent(Component);

  function MotionComponent(props: P & MotionProps) {
    const {
      initial,
      animate,
      exit,
      transition,
      variants,
      onAnimationComplete,
      style,
      ...rest
    } = props as any;

    const presence = useContext(PresenceContext);

    const resolvedInitial = resolveVariants(initial, variants);
    const resolvedAnimate = resolveVariants(animate, variants);
    const resolvedExit = resolveVariants(exit, variants);

    const target = presence?.status === 'exiting'
      ? resolvedExit
      : resolvedAnimate;

    const resolvedTarget = resolveAnimation(target);
    const resolvedInitialState = resolveAnimation(
      typeof initial === 'boolean' ? undefined : resolvedInitial
    );

    const prevStateRef = useRef(resolvedInitialState);

    const diffs = useMemo(() => {
      if (!resolvedTarget) return [];
      const result = diffState(prevStateRef.current, resolvedTarget, transition);
      prevStateRef.current = resolvedTarget;
      return result;
    }, [resolvedTarget, transition]);

    const { animatedStyle } = useReanimatedAdapter(diffs, {
      onComplete: () => {
        if (presence?.status === 'exiting') {
          presence.onExitComplete();
        }
        onAnimationComplete?.();
      },
    });

    return (
      <AnimatedComponent
        style={[style, animatedStyle]}
        {...(rest as any)}
      />
    );
  }

  MotionComponent.displayName = `Motion(${
    Component.displayName || Component.name || 'Component'
  })`;

  return MotionComponent;
}
```

### packages/src/components/Motion.ts

```ts
import { View, Text, Image, ScrollView } from 'react-native';
import { createMotionComponent } from './createMotionComponent';

export const Motion = {
  View: createMotionComponent(View),
  Text: createMotionComponent(Text),
  Image: createMotionComponent(Image),
  ScrollView: createMotionComponent(ScrollView),
  create: createMotionComponent,
};
```

### 검증 기준

**테스트 먼저**: RN과 Reanimated를 mock한 상태에서 렌더 테스트를 먼저 작성합니다.
테스트 파일 위치: `packages/src/components/__tests__/createMotionComponent.test.tsx`

- [ ] (테스트 먼저) `<Motion.View animate={{ opacity: 1 }} />` 렌더 시 에러 없음
- [ ] (테스트 먼저) `initial` prop이 있을 때 Engine이 초기 상태로 호출됨
- [ ] (테스트 먼저) `animate` prop 변경 시 diffState가 새 diff를 생성함
- [ ] (테스트 먼저) `createMotionComponent(Pressable)` 커스텀 컴포넌트 동작
- [ ] (테스트 먼저) variants 사용 시 이름으로 상태 전환 동작
- [ ] (테스트 먼저) 기존 style prop이 animatedStyle과 합쳐져서 적용

---

## 5단계: AnimatePresence

**파일**: `packages/src/context/PresenceContext.ts`, `packages/src/components/AnimatePresence.tsx`

### packages/src/context/PresenceContext.ts

```ts
import { createContext } from 'react';
import { PresenceContextValue } from '../types/components';

export const PresenceContext = createContext<PresenceContextValue | null>(null);
```

### packages/src/components/AnimatePresence.tsx

```tsx
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Children,
  isValidElement,
} from 'react';
import { AnimatePresenceProps } from '../types/components';
import { PresenceContext } from '../context/PresenceContext';

interface ChildState {
  key: string;
  element: React.ReactElement;
  status: 'entering' | 'present' | 'exiting';
}

function getChildrenMap(children: React.ReactNode): Map<string, React.ReactElement> {
  const map = new Map<string, React.ReactElement>();
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.key != null) {
      map.set(String(child.key), child);
    }
  });
  return map;
}

export function AnimatePresence({
  children,
  mode = 'sync',
  onExitComplete,
}: AnimatePresenceProps) {
  const [presentChildren, setPresentChildren] = useState<ChildState[]>([]);
  const prevChildrenMap = useRef<Map<string, React.ReactElement>>(new Map());
  const isInitialRender = useRef(true);

  useEffect(() => {
    const nextMap = getChildrenMap(children);
    const prevMap = prevChildrenMap.current;
    const newPresent: ChildState[] = [];

    nextMap.forEach((element, key) => {
      if (prevMap.has(key)) {
        newPresent.push({ key, element, status: 'present' });
      } else {
        newPresent.push({
          key,
          element,
          status: isInitialRender.current ? 'present' : 'entering',
        });
      }
    });

    prevMap.forEach((element, key) => {
      if (!nextMap.has(key)) {
        newPresent.push({ key, element, status: 'exiting' });
      }
    });

    setPresentChildren(newPresent);
    prevChildrenMap.current = nextMap;
    isInitialRender.current = false;
  }, [children]);

  const handleExitComplete = useCallback((key: string) => {
    setPresentChildren(prev => {
      const next = prev.filter(child => child.key !== key);
      const hasExiting = next.some(c => c.status === 'exiting');
      if (!hasExiting) {
        onExitComplete?.();
      }
      return next;
    });
  }, [onExitComplete]);

  const isAnyExiting = presentChildren.some(c => c.status === 'exiting');
  const childrenToRender = mode === 'wait' && isAnyExiting
    ? presentChildren.filter(c => c.status !== 'entering')
    : presentChildren;

  return (
    <>
      {childrenToRender.map(child => (
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
    </>
  );
}
```

### 검증 기준

**테스트 먼저**: AnimatePresence의 상태 머신 동작을 렌더 테스트로 먼저 검증합니다.
테스트 파일 위치: `packages/src/components/__tests__/AnimatePresence.test.tsx`

- [ ] (테스트 먼저) child 추가 시 entering → present 전환
- [ ] (테스트 먼저) child 제거 시 exiting 상태로 유지, exit 애니메이션 실행
- [ ] (테스트 먼저) exit 애니메이션 완료(`onExitComplete`) 후 실제 unmount
- [ ] (테스트 먼저) `mode="wait"`: exit 완료 전까지 새 child 렌더 안 됨
- [ ] (테스트 먼저) `onExitComplete`: 모든 exit 완료 시 콜백 호출
- [ ] (테스트 먼저) key 없는 child에 대한 경고 출력

---

## 6단계: Public Exports

**파일**: `packages/src/index.ts`

```ts
export { Motion } from './components/Motion';
export { createMotionComponent } from './components/createMotionComponent';
export { AnimatePresence } from './components/AnimatePresence';

// 타입 export
export type { MotionProps, AnimatePresenceProps } from './types/components';
export type { AnimationState, TransitionConfig } from './types/animation';
```

### 검증 기준

**테스트 먼저**: public exports가 올바르게 노출되는지 확인하는 import 테스트를 먼저 작성합니다.

- [ ] (테스트 먼저) `import { Motion, AnimatePresence, createMotionComponent } from 'umjik'` 정상 동작
- [ ] 타입이 올바르게 export되어 TypeScript 자동완성 동작
- [ ] `pnpm --filter umjik build` 성공 (rolldown 번들링)
- [ ] `pnpm --filter umjik test` 전체 통과

---

## 통합 테스트 시나리오

모든 단계 완료 후 아래 시나리오를 검증합니다.

### 시나리오 1: 기본 animate

```tsx
<Motion.View
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
/>
```
→ 마운트 시 0.5초에 걸쳐 opacity 0→1

### 시나리오 2: Spring 애니메이션

```tsx
<Motion.View
  animate={{ x: 100 }}
  transition={{ type: 'spring', stiffness: 200 }}
/>
```
→ translateX가 spring 물리로 100까지 이동

### 시나리오 3: AnimatePresence + exit

```tsx
<AnimatePresence>
  {show && (
    <Motion.View
      key="box"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
    />
  )}
</AnimatePresence>
```
→ show=true: fade-in + slide-up
→ show=false: fade-out + slide-down, 그 후 unmount

### 시나리오 4: Variants

```tsx
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

<Motion.View
  variants={variants}
  initial="hidden"
  animate={isVisible ? 'visible' : 'hidden'}
/>
```
→ isVisible 전환 시 variants 사이 애니메이션

### 시나리오 5: Custom component

```tsx
const MotionPressable = createMotionComponent(Pressable);

<MotionPressable
  animate={{ scale: pressed ? 0.95 : 1 }}
  transition={{ type: 'spring' }}
  onPress={handlePress}
/>
```
→ Pressable이 Motion 기능을 가지며 press 시 scale 애니메이션
