'use client'

/**
 * LeadBotAvatar — a small friendly robo character with three moods:
 * • wave      — used on the floating bubble (idle bob + arm wave)
 * • talk      — used in the panel header while asking questions
 *               (eyes blink, antenna pulses, chest lights cycle)
 * • celebrate — used on completion (arms up, eyes turn ^^, extra pulses)
 *
 * All animation is pure SVG + CSS keyframes. No JS timers, so it
 * pauses cleanly with prefers-reduced-motion.
 */

type Mood = 'wave' | 'talk' | 'celebrate'

export function LeadBotAvatar({ mood = 'talk' }: { mood?: Mood }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className="lead-bot-avatar"
      data-mood={mood}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lb-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD9BE" />
          <stop offset="45%" stopColor="#FF8F5C" />
          <stop offset="100%" stopColor="#E05220" />
        </linearGradient>
        <linearGradient id="lb-visor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A0F08" />
          <stop offset="100%" stopColor="#0A0805" />
        </linearGradient>
        <radialGradient id="lb-glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#FFB07A" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient glow */}
      <circle cx="40" cy="42" r="34" fill="url(#lb-glow)" className="lb-glow" />

      {/* Antenna */}
      <g className="lb-antenna">
        <line x1="40" y1="10" x2="40" y2="18" stroke="#FF8F5C" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="40" cy="9" r="2.6" fill="#FFB07A" className="lb-antenna-tip" />
      </g>

      {/* Head + body group — bobs gently in every mood */}
      <g className="lb-body">
        {/* Body / chest */}
        <rect x="22" y="48" width="36" height="22" rx="9" fill="url(#lb-body)" stroke="#FF6B35" strokeWidth="1" />
        {/* Chest lights */}
        <g className="lb-chest">
          <circle cx="32" cy="59" r="1.6" fill="#FFF0DC" className="lb-chest-dot lb-chest-dot--a" />
          <circle cx="40" cy="59" r="1.6" fill="#FFF0DC" className="lb-chest-dot lb-chest-dot--b" />
          <circle cx="48" cy="59" r="1.6" fill="#FFF0DC" className="lb-chest-dot lb-chest-dot--c" />
        </g>

        {/* Head */}
        <rect x="18" y="18" width="44" height="34" rx="12" fill="url(#lb-body)" stroke="#FF6B35" strokeWidth="1.1" />
        {/* Visor */}
        <rect x="24" y="24" width="32" height="18" rx="7" fill="url(#lb-visor)" />
        <rect x="24" y="24" width="32" height="18" rx="7" fill="none" stroke="rgba(255,143,92,0.5)" strokeWidth="0.6" />

        {/* Eyes — round in wave/talk, arcs in celebrate */}
        <g className="lb-eyes">
          <circle cx="32" cy="33" r="2.4" fill="#FFE1B0" className="lb-eye lb-eye--l" />
          <circle cx="48" cy="33" r="2.4" fill="#FFE1B0" className="lb-eye lb-eye--r" />
          {/* Happy arcs, only shown in celebrate */}
          <path d="M28.5 33 Q32 30 35.5 33" fill="none" stroke="#FFE1B0" strokeWidth="1.8" strokeLinecap="round" className="lb-eye-arc lb-eye-arc--l" />
          <path d="M44.5 33 Q48 30 51.5 33" fill="none" stroke="#FFE1B0" strokeWidth="1.8" strokeLinecap="round" className="lb-eye-arc lb-eye-arc--r" />
        </g>

        {/* Mouth — thin bar that pulses when talking */}
        <rect x="34" y="46" width="12" height="1.6" rx="0.8" fill="#FF8F5C" className="lb-mouth" />

        {/* Cheek blushes */}
        <circle cx="26" cy="40" r="1.6" fill="#FF6B35" opacity="0.55" />
        <circle cx="54" cy="40" r="1.6" fill="#FF6B35" opacity="0.55" />
      </g>

      {/*
        Arms — pivot at the SHOULDER (the edge that meets the body).
        Using `transform-box: fill-box` in CSS + a percentage
        transform-origin so the browser resolves it against the group's
        own bbox, not SVG user space. Previously the inline px origin
        was being ignored / mis-mapped, which is why the arms flew
        off-body.

        Left arm bbox spans roughly x=11.6→24 → shoulder at 100% x.
        Right arm bbox spans roughly x=56→68.4 → shoulder at   0% x.
      */}
      <g className="lb-arm lb-arm--l">
        <rect x="14" y="50" width="10" height="4" rx="2" fill="url(#lb-body)" />
        <circle cx="14" cy="52" r="2.4" fill="#FFB07A" />
      </g>
      <g className="lb-arm lb-arm--r">
        <rect x="56" y="50" width="10" height="4" rx="2" fill="url(#lb-body)" />
        <circle cx="66" cy="52" r="2.4" fill="#FFB07A" />
      </g>
    </svg>
  )
}
