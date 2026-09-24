import type { CSSProperties } from 'react'

type SkyBackgroundProps = {
  className?: string
}

type StarSpec = {
  cx: number
  cy: number
  r: number
  duration: string
  delay: string
  min: number
}

const STARS: StarSpec[] = [
  { cx: 90, cy: 42, r: 1.5, duration: '5.5s', delay: '0s', min: 0.2 },
  { cx: 240, cy: 96, r: 1.1, duration: '7s', delay: '1.2s', min: 0.15 },
  { cx: 410, cy: 30, r: 1.6, duration: '6.2s', delay: '2.4s', min: 0.25 },
  { cx: 560, cy: 120, r: 1, duration: '8s', delay: '0.6s', min: 0.12 },
  { cx: 700, cy: 58, r: 1.4, duration: '6.8s', delay: '3.1s', min: 0.2 },
  { cx: 880, cy: 104, r: 1.1, duration: '7.6s', delay: '1.8s', min: 0.15 },
  { cx: 1030, cy: 36, r: 1.5, duration: '5.9s', delay: '2.9s', min: 0.22 },
  { cx: 1200, cy: 88, r: 1.2, duration: '7.2s', delay: '0.4s', min: 0.16 },
  { cx: 1340, cy: 52, r: 1.3, duration: '6.5s', delay: '3.6s', min: 0.18 },
]

const CLOUDS = [
  { position: 'left-[-10%] top-[46%] w-[58%] h-[8%]', driftX: '48px', duration: '52s', delay: '0s' },
  { position: 'left-[34%] top-[56%] w-[50%] h-[6%]', driftX: '-38px', duration: '68s', delay: '3s' },
  { position: 'left-[6%] top-[38%] w-[38%] h-[5%]', driftX: '30px', duration: '84s', delay: '6s' },
]

/**
 * SkyBackground — Cinematic Sunset / Dusk theme.
 *
 * Reads the project's existing --sky-* tokens (mtn-far/mid/near, snow,
 * scrim, seam) and reuses the existing animate-twinkle /
 * animate-cloud-drift / animate-glow-breathe utilities, so retheming is
 * palette-only and the shared reduced-motion block already covers it.
 */
export function DuskBackground({ className }: SkyBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={['sky-scene', className].filter(Boolean).join(' ')}
    >
      <div className="sky-scene-sky" />
      <div className="sky-scene-bloom" />

      {/* Stars, only in the deep upper sky */}
      <svg
        className="sky-scene-stars"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        focusable="false"
      >
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="var(--sky-star)"
            className="animate-twinkle"
            style={
              {
                '--twinkle-duration': s.duration,
                '--twinkle-delay': s.delay,
                '--tw-min': s.min,
                transformBox: 'fill-box',
                transformOrigin: 'center',
              } as CSSProperties
            }
          />
        ))}
      </svg>

      {/* Drifting dusk cloud bands */}
      {CLOUDS.map((c, i) => (
        <div
          key={i}
          className={`sky-scene-cloud animate-cloud-drift ${c.position}`}
          style={
            {
              '--drift-x': c.driftX,
              '--drift-duration': c.duration,
              '--drift-delay': c.delay,
            } as CSSProperties
          }
        />
      ))}

      {/* Sun low over the ridge */}
      <div className="sky-scene-sun">
        <div className="sky-scene-sun-glow animate-glow-breathe" />
        <div className="sky-scene-sun-disc" />
      </div>

      {/* Distant range: tallest, palest, catches the last light on its snow */}
      <svg
        className="sky-scene-range sky-scene-range-far"
        viewBox="0 0 1440 240"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path
          fill="var(--sky-mtn-far)"
          d="M0,240 L0,150 L90,96 L170,132 L250,74 L340,120 L430,60 L520,110 L610,72 L700,124 L790,88 L880,134 L970,96 L1060,140 L1150,104 L1250,146 L1340,112 L1440,150 L1440,240 Z"
        />
        <path fill="var(--sky-snow)" d="M230,88 L250,74 L270,88 L258,93 L242,97 Z" />
        <path fill="var(--sky-snow)" d="M410,74 L430,60 L450,74 L438,79 L422,83 Z" />
        <path fill="var(--sky-snow)" d="M590,86 L610,72 L630,86 L618,91 L602,95 Z" />
      </svg>

      <div className="sky-scene-haze sky-scene-haze-far" />

      {/* Middle range */}
      <svg
        className="sky-scene-range sky-scene-range-mid"
        viewBox="0 0 1440 240"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path
          fill="var(--sky-mtn-mid)"
          d="M0,240 L0,178 L120,120 L220,160 L330,100 L440,150 L560,96 L680,148 L800,110 L920,158 L1040,118 L1160,164 L1280,126 L1400,168 L1440,150 L1440,240 Z"
        />
        <path fill="var(--sky-snow)" d="M312,114 L330,100 L348,114 L336,119 L322,123 Z" />
        <path fill="var(--sky-snow)" d="M542,110 L560,96 L578,110 L566,115 L552,119 Z" />
      </svg>

      <div className="sky-scene-haze sky-scene-haze-mid" />

      {/* Foreground range: near-black, no snow, fully in shadow */}
      <svg
        className="sky-scene-range sky-scene-range-near"
        viewBox="0 0 1440 240"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path
          fill="var(--sky-mtn-near)"
          d="M0,240 L0,196 L140,168 L280,188 L420,152 L560,182 L700,146 L840,180 L980,156 L1120,186 L1260,160 L1400,190 L1440,176 L1440,240 Z"
        />
      </svg>

      {/* Diagonal 70/30 seam */}
      <div className="sky-scene-seam-panel" />
      <div className="sky-scene-seam-glow animate-glow-breathe" />
      <div className="sky-scene-seam-line" />

      <div className="sky-scene-vignette" />
    </div>
  )
}

export default DuskBackground
