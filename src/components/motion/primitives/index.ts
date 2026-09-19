/**
 * Motion primitives playbook — reusable animated SVG/DOM building blocks.
 *
 * Design intent (from `.claude/skills/design-taste-frontend/SKILL.md`):
 *  - Every animation must feel purposeful, not decorative.
 *  - Prefer GPU-only properties (transform, opacity, filter).
 *  - Honor `prefers-reduced-motion` — pass `reduce` to fall back to a static state.
 *  - Compose primitives instead of rewriting SVG animation logic.
 *
 * Rendered as SVG children — must be placed inside an <svg>.
 */
export { PulseDot } from './PulseDot'
export { FlowingLine } from './FlowingLine'
export { DataStream } from './DataStream'
export { Waveform } from './Waveform'
export { DrawPath } from './DrawPath'
export { CountUp } from './CountUp'
export { ProgressBar } from './ProgressBar'
