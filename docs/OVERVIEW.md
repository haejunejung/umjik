# umjik — Overview

## 문제

React Native에서 애니메이션을 만드는 건 필요 이상으로 어렵습니다.

`react-native-reanimated`는 60fps 애니메이션을 가능하게 하지만, 간단한 fade-in 하나를 만들려 해도 `useSharedValue`, `useAnimatedStyle`, `withTiming`을 조합해야 합니다.

```tsx
// reanimated로 fade-in 하나 만들기
function FadeIn({ children }) {
  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={style}>{children}</Animated.View>;
}
```

반면 웹에서는 framer-motion이 이 문제를 이미 해결했습니다.

```tsx
// framer-motion으로 같은 일 하기
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
```

하지만 framer-motion은 웹 전용이고, React Native를 공식 지원하지 않습니다.

## 기존 시도들과 한계

### Moti

- Reanimated 기반으로 선언적 API 제공
- AnimatePresence 지원, framer-motion 제작자(Matt Perry)가 직접 통합 도움
- **한계**: 자체 API 설계 (`from` 대신 `initial`, reanimated 네이밍 사용)
- **현재 상태**: 12개월 이상 새 버전 없음, Reanimated 3 관련 성능 이슈 미해결

### Legend Motion

- framer-motion과 가장 유사한 API (`initial`, `animate`, `whileHover` 등 동일)
- zero dependency — RN 내장 Animated API 기반
- **한계**: `useNativeDriver`가 지원하지 않는 속성(width, height, backgroundColor 등)에서 성능 제약

### 비교

| | Moti | Legend Motion | **umjik** |
|---|---|---|---|
| API | 자체 API | framer-motion 유사 | framer-motion 호환 |
| 엔진 | Reanimated | 내장 Animated | Reanimated |
| 유지보수 | 비활성 | 활성 | 신규 |
| 핵심 제약 | API 비호환 | 성능 제약 | — |

## umjik의 접근

**framer-motion 호환 API + Reanimated 엔진**이라는 조합으로 기존 시도들의 공백을 채웁니다.

```tsx
import { Motion, AnimatePresence } from 'umjik';

<AnimatePresence>
  {isVisible && (
    <Motion.View
      key="card"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    />
  )}
</AnimatePresence>
```

## 왜 framer-motion 호환 API인가

1. **AI 코드 생성**: framer-motion은 npm 월간 3,000만 다운로드로 LLM 학습 데이터에 풍부. 동일 API면 AI가 더 정확한 코드 생성 가능.
2. **웹 → RN 마이그레이션**: 웹에서 framer-motion으로 작성된 애니메이션을 RN으로 포팅 시 API가 동일하면 비즈니스 로직만 이동.
3. **레퍼런스 활용**: framer-motion의 방대한 문서, 예제, 튜토리얼을 그대로 참고 가능.

## MVP 범위

### v0.1 지원 기능

- `initial` — 마운트 시 초기 상태
- `animate` — 목표 애니메이션 상태
- `exit` — 언마운트 시 애니메이션
- `transition` — 애니메이션 전환 설정 (timing, spring)
- `variants` — 이름 기반 애니메이션 상태
- `AnimatePresence` — exit 애니메이션을 위한 unmount 제어

### v0.2 이후

- `whileHover`, `whileTap`, `whileDrag` (제스처)
- `layout`, `layoutId` (레이아웃 애니메이션)
- `useMotionValue`, `useTransform` (모션 값 훅)
- `staggerChildren`, `delayChildren` (오케스트레이션)
- scroll-linked animations

API 시그니처는 미리 열어두되, 미지원 옵션을 넘기면 개발 모드에서 경고를 출력합니다.
