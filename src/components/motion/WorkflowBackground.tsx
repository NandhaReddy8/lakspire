export function WorkflowBackground() {
  return (
    <div aria-hidden="true" className="workflow-bg">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(250,245,238,0.9)" strokeWidth="0.5" />
          </pattern>
          <linearGradient id="flow-a" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,107,53,0)" />
            <stop offset="50%" stopColor="rgba(255,107,53,1)" />
            <stop offset="100%" stopColor="rgba(255,107,53,0)" />
          </linearGradient>
          <linearGradient id="flow-b" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(244,162,97,0)" />
            <stop offset="50%" stopColor="rgba(244,162,97,1)" />
            <stop offset="100%" stopColor="rgba(244,162,97,0)" />
          </linearGradient>
        </defs>

        {/* Grid layer */}
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Flowing pipeline curves */}
        <path
          className="flow-path"
          d="M -50 200 Q 300 100 720 300 T 1500 250"
          fill="none"
          stroke="url(#flow-a)"
          strokeWidth="1.5"
        />
        <path
          className="flow-path"
          d="M -50 500 Q 400 620 800 480 T 1500 580"
          fill="none"
          stroke="url(#flow-b)"
          strokeWidth="1.5"
          style={{ animationDelay: '-4s' }}
        />
        <path
          className="flow-path"
          d="M -50 780 Q 260 700 700 820 T 1500 720"
          fill="none"
          stroke="url(#flow-a)"
          strokeWidth="1.2"
          style={{ animationDelay: '-8s' }}
        />

        {/* Anchor dots at intersections */}
        <g fill="rgba(255,107,53,0.9)">
          <circle cx="300" cy="180" r="2.5" />
          <circle cx="720" cy="300" r="2.5" />
          <circle cx="1100" cy="240" r="2.5" />
          <circle cx="400" cy="620" r="2.5" />
          <circle cx="800" cy="480" r="2.5" />
          <circle cx="700" cy="820" r="2.5" />
        </g>
      </svg>
    </div>
  )
}
