const STARS = [
  { top: '5%', left: '10%', size: 2, min: 0.2, dur: '3.4s', delay: '0s' },
  { top: '10%', left: '30%', size: 1.5, min: 0.3, dur: '4.6s', delay: '0.8s' },
  { top: '4%', left: '47%', size: 2.5, min: 0.25, dur: '3.8s', delay: '1.6s' },
  { top: '13%', left: '61%', size: 2, min: 0.2, dur: '5s', delay: '0.4s' },
  { top: '7%', left: '77%', size: 1.5, min: 0.35, dur: '4.2s', delay: '2.2s' },
  { top: '17%', left: '88%', size: 2, min: 0.2, dur: '3.6s', delay: '1.1s' },
  { top: '21%', left: '19%', size: 1.5, min: 0.3, dur: '4.8s', delay: '2.8s' },
  { top: '25%', left: '42%', size: 2, min: 0.25, dur: '4s', delay: '0.2s' },
  { top: '16%', left: '53%', size: 1.5, min: 0.3, dur: '5.4s', delay: '1.9s' },
  { top: '29%', left: '70%', size: 2, min: 0.2, dur: '3.9s', delay: '3.1s' },
  { top: '8%', left: '93%', size: 1.5, min: 0.3, dur: '4.4s', delay: '0.6s' },
  { top: '32%', left: '7%', size: 2, min: 0.25, dur: '5.2s', delay: '2.4s' },
  { top: '23%', left: '82%', size: 1.5, min: 0.3, dur: '3.7s', delay: '1.4s' },
  { top: '36%', left: '34%', size: 1.5, min: 0.2, dur: '4.9s', delay: '3.6s' },
  { top: '40%', left: '58%', size: 2, min: 0.25, dur: '4.3s', delay: '1.2s' },
  { top: '44%', left: '86%', size: 1.5, min: 0.3, dur: '5.1s', delay: '2.1s' },
]

const COMETS = [
  { top: '5%', left: '82%', dur: '9s', delay: '0s', scale: 1 },
  { top: '15%', left: '95%', dur: '12s', delay: '4.5s', scale: 0.7 },
  { top: '2%', left: '55%', dur: '14s', delay: '8s', scale: 0.85 },
  { top: '25%', left: '90%', dur: '11s', delay: '2.5s', scale: 0.55 },
]

export function SkyBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Sky panel — everything except the bottom-left dark triangle */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 70% 100%, 0 58%)',
        }}
      >
        {/* Night sky gradient — properly dark */}
        <div
          className="absolute inset-0 light:hidden"
          style={{
            background:
              'linear-gradient(176deg, oklch(0.13 0.045 265) 0%, oklch(0.19 0.075 260) 32%, oklch(0.28 0.1 253) 60%, oklch(0.38 0.12 246) 84%, oklch(0.46 0.12 240) 100%)',
          }}
        />

        {/* Day sky gradient — bright, airy blue */}
        <div
          className="absolute inset-0 hidden light:block"
          style={{
            background:
              'linear-gradient(176deg, oklch(0.62 0.15 245) 0%, oklch(0.72 0.13 240) 34%, oklch(0.82 0.1 235) 64%, oklch(0.9 0.06 230) 88%, oklch(0.95 0.035 225) 100%)',
          }}
        />

        {/* Aurora shimmer band — night only */}
        <div
          className="animate-aurora absolute -left-1/4 top-[6%] h-[34%] w-[150%] rounded-[100%] blur-3xl light:hidden"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, oklch(0.55 0.15 250 / 0.35) 30%, oklch(0.62 0.12 225 / 0.28) 55%, transparent 100%)',
          }}
        />

        {/* Daylight haze band — light only */}
        <div
          className="animate-aurora absolute -left-1/4 top-[10%] hidden h-[30%] w-[150%] rounded-[100%] blur-3xl light:block"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, oklch(0.97 0.015 230 / 0.5) 35%, oklch(0.99 0.008 225 / 0.4) 60%, transparent 100%)',
          }}
        />

        {/* Cute crescent moon — night only */}
        <div className="absolute right-[14%] top-[9%] light:hidden">
          <div
            className="animate-glow-breathe absolute -inset-8 rounded-full blur-2xl"
            style={{ background: 'oklch(0.9 0.03 230 / 0.22)' }}
          />
          <svg width="72" height="72" viewBox="0 0 72 72" className="animate-float-slow relative">
            {/* Full disc */}
            <circle cx="36" cy="36" r="26" fill="oklch(0.93 0.02 225)" />
            {/* Shadow bite for the crescent */}
            <circle cx="46" cy="30" r="22" fill="oklch(0.16 0.055 262)" />
            {/* Cute craters on the lit sliver */}
            <circle cx="22" cy="34" r="3.2" fill="oklch(0.82 0.03 230 / 0.9)" />
            <circle cx="28" cy="48" r="2.4" fill="oklch(0.82 0.03 230 / 0.75)" />
            <circle cx="19" cy="45" r="1.6" fill="oklch(0.82 0.03 230 / 0.7)" />
          </svg>
        </div>

        {/* Small sun — day only */}
        <div className="absolute right-[16%] top-[11%] hidden light:block">
          <div
            className="animate-glow-breathe absolute -inset-10 rounded-full blur-2xl"
            style={{ background: 'oklch(0.95 0.09 90 / 0.5)' }}
          />
          <svg width="64" height="64" viewBox="0 0 64 64" className="animate-float-slow relative">
            <circle cx="32" cy="32" r="15" fill="oklch(0.95 0.11 92)" />
            <circle cx="32" cy="32" r="15" fill="none" stroke="oklch(0.99 0.04 95 / 0.9)" strokeWidth="1.5" />
            {/* Short rounded rays */}
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * Math.PI) / 4
              const x1 = 32 + Math.cos(a) * 21
              const y1 = 32 + Math.sin(a) * 21
              const x2 = 32 + Math.cos(a) * 27
              const y2 = 32 + Math.sin(a) * 27
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="oklch(0.95 0.11 92)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )
            })}
          </svg>
        </div>

        {/* Twinkling stars — night only */}
        <div className="light:hidden">
          {STARS.map((s, i) => (
            <span
              key={i}
              className="animate-twinkle absolute rounded-full bg-white"
              style={
                {
                  top: s.top,
                  left: s.left,
                  width: s.size,
                  height: s.size,
                  '--tw-min': s.min,
                  '--twinkle-duration': s.dur,
                  '--twinkle-delay': s.delay,
                  boxShadow: '0 0 6px 1px oklch(0.95 0.02 240 / 0.7)',
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* Comets — night only */}
        <div className="light:hidden">
          {COMETS.map((c, i) => (
            <span
              key={i}
              className="animate-comet absolute"
              style={
                {
                  top: c.top,
                  left: c.left,
                  '--comet-duration': c.dur,
                  '--comet-delay': c.delay,
                } as React.CSSProperties
              }
            >
              <span
                className="block h-px rounded-full"
                style={{
                  width: 120 * c.scale,
                  background:
                    'linear-gradient(90deg, oklch(0.98 0.01 240) 0%, oklch(0.8 0.12 245 / 0.6) 35%, transparent 100%)',
                  boxShadow: '0 0 8px 1px oklch(0.92 0.05 240 / 0.8)',
                }}
              />
              <span
                className="absolute -left-1 -top-[3px] block rounded-full bg-white"
                style={{
                  width: 7 * c.scale,
                  height: 7 * c.scale,
                  boxShadow: '0 0 12px 3px oklch(0.92 0.06 240 / 0.9)',
                }}
              />
            </span>
          ))}
        </div>

        {/* Far mountain range — hazy, distant */}
        <svg
          viewBox="0 0 1440 300"
          preserveAspectRatio="xMidYMax slice"
          className="absolute bottom-0 left-0 h-[24%] w-full"
        >
          <path
            d="M0 300 L0 190 L120 128 L235 176 L360 92 L470 158 L600 74 L730 150 L855 100 L985 164 L1110 96 L1240 158 L1360 118 L1440 152 L1440 300 Z"
            fill="var(--sky-mtn-far)"
          />
        </svg>

        {/* Mid mountain range */}
        <svg
          viewBox="0 0 1440 260"
          preserveAspectRatio="xMidYMax slice"
          className="absolute bottom-0 left-0 h-[19%] w-full"
        >
          <path
            d="M0 260 L0 170 L150 88 L280 156 L430 62 L560 140 L700 84 L850 158 L990 70 L1130 148 L1270 102 L1380 150 L1440 126 L1440 260 Z"
            fill="var(--sky-mtn-mid)"
          />
          {/* Snow caps */}
          <path
            d="M430 62 L470 88 L448 84 L430 96 L406 82 L398 84 Z"
            fill="var(--sky-snow)"
          />
          <path
            d="M990 70 L1026 94 L1006 90 L988 102 L966 88 L958 92 Z"
            fill="var(--sky-snow)"
          />
        </svg>

        {/* Near mountain range — darkest silhouette */}
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="xMidYMax slice"
          className="absolute bottom-0 left-0 h-[13%] w-full"
        >
          <path
            d="M0 200 L0 150 L180 66 L330 130 L500 48 L660 122 L830 58 L1000 128 L1160 70 L1320 130 L1440 92 L1440 200 Z"
            fill="var(--sky-mtn-near)"
          />
        </svg>

        {/* Fade into the seam edge for a soft transition */}
        <div
          className="absolute inset-x-0 bottom-0 h-[22%]"
          style={{
            background:
              'linear-gradient(to bottom, transparent, color-mix(in oklch, var(--sky-scrim) 55%, transparent))',
          }}
        />
      </div>

      {/* Seam line along the diagonal split — slightly thick, crisp */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: 'polygon(0 56.9%, 70.7% 100%, 69.3% 100%, 0 59.1%)',
          background:
            'linear-gradient(135deg, color-mix(in oklch, var(--sky-seam) 90%, transparent), color-mix(in oklch, var(--sky-seam) 60%, white), color-mix(in oklch, var(--sky-seam) 70%, transparent))',
          boxShadow: '0 0 24px 4px color-mix(in oklch, var(--sky-seam) 45%, transparent)',
        }}
      />

      {/* Dark triangle — bottom-left, width spans ~70% of the screen */}
      <div
        className="absolute inset-0"
        style={{ clipPath: 'polygon(0 58%, 70% 100%, 0 100%)' }}
      >
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute inset-0 light:hidden"
          style={{
            background:
              'radial-gradient(ellipse 80% 90% at 20% 100%, oklch(0.17 0.05 255 / 0.9), transparent 70%)',
          }}
        />
        <div className="grid-fade absolute inset-0 rotate-180 opacity-20" />
      </div>

      {/* Full-width readability scrim behind the composer */}
      <div
        className="absolute inset-x-0 bottom-0 h-[34%]"
        style={{
          background:
            'linear-gradient(to top, color-mix(in oklch, var(--sky-scrim) 92%, transparent) 0%, color-mix(in oklch, var(--sky-scrim) 55%, transparent) 55%, transparent 100%)',
        }}
      />
    </div>
  )
}
