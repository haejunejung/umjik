import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import Link from 'next/link';
import type { ReactNode } from 'react';

function CodeBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-sm font-medium text-fd-muted-foreground mb-2">{label}</p>
      <pre className="rounded-lg bg-fd-secondary/50 p-4 text-[13px] leading-relaxed overflow-x-auto border border-fd-border font-mono">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <main className="flex flex-col items-center px-4">
        {/* Hero */}
        <section className="flex flex-col items-center text-center pt-20 pb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Declarative Animations for React Native
          </h1>
          <p className="text-lg text-fd-muted-foreground max-w-xl">
            framer-motion compatible API powered by Reanimated 3.
            Write less code, ship smoother animations.
          </p>
          <div className="flex gap-3 mt-8">
            <Link
              href="/docs"
              className="rounded-md bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground"
            >
              Get Started
            </Link>
            <a
              href="https://github.com/haejunejung/umjik"
              className="rounded-md border border-fd-border px-4 py-2 text-sm font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </section>

        {/* Code comparison */}
        <section className="w-full max-w-3xl mx-auto pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CodeBlock label="Before (Reanimated)">
{`const opacity = useSharedValue(0);

useEffect(() => {
  opacity.value = withTiming(1);
}, []);

const style = useAnimatedStyle(() => ({
  opacity: opacity.value,
}));

return (
  <Animated.View style={style}>
    {children}
  </Animated.View>
);`}
            </CodeBlock>
            <CodeBlock label="After (umjik)">
{`<Motion.View
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
/>`}
            </CodeBlock>
          </div>
        </section>

        {/* Feature cards */}
        <section className="w-full max-w-4xl mx-auto pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg border border-fd-border p-6">
              <h3 className="text-base font-semibold mb-2">framer-motion Compatible</h3>
              <p className="text-sm text-fd-muted-foreground">
                Use the same API you know from the web. No new concepts to learn
                &mdash; just <code className="rounded bg-fd-secondary px-1 py-0.5 text-xs font-mono">initial</code>, <code className="rounded bg-fd-secondary px-1 py-0.5 text-xs font-mono">animate</code>, and <code className="rounded bg-fd-secondary px-1 py-0.5 text-xs font-mono">exit</code>.
              </p>
            </div>
            <div className="rounded-lg border border-fd-border p-6">
              <h3 className="text-base font-semibold mb-2">Powered by Reanimated 3</h3>
              <p className="text-sm text-fd-muted-foreground">
                60fps animations running on the UI thread. umjik is a declarative
                layer &mdash; all the heavy lifting is done by Reanimated.
              </p>
            </div>
            <div className="rounded-lg border border-fd-border p-6">
              <h3 className="text-base font-semibold mb-2">Zero Boilerplate</h3>
              <p className="text-sm text-fd-muted-foreground">
                No more <code className="rounded bg-fd-secondary px-1 py-0.5 text-xs font-mono">useSharedValue</code>, <code className="rounded bg-fd-secondary px-1 py-0.5 text-xs font-mono">useAnimatedStyle</code>,
                or <code className="rounded bg-fd-secondary px-1 py-0.5 text-xs font-mono">withTiming</code>. Describe what you want, not how to do it.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-fd-border py-6 text-center text-sm text-fd-muted-foreground">
          MIT {new Date().getFullYear()} &copy; umjik
        </footer>
      </main>
    </HomeLayout>
  );
}
