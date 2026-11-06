export function PrismArtwork() {
  return (
    <div className="prism-art" aria-hidden="true">
      <svg viewBox="0 0 620 520" fill="none" role="presentation" focusable="false">
        <defs>
          <linearGradient id="prism-beam" x1="80" y1="260" x2="540" y2="260" gradientUnits="userSpaceOnUse">
            <stop stopColor="#67e8f9" stopOpacity="0" />
            <stop offset=".28" stopColor="#67e8f9" />
            <stop offset=".7" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#c084fc" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="prism-face" x1="190" y1="110" x2="430" y2="410" gradientUnits="userSpaceOnUse">
            <stop stopColor="#67e8f9" stopOpacity=".8" />
            <stop offset=".5" stopColor="#818cf8" stopOpacity=".35" />
            <stop offset="1" stopColor="#c084fc" stopOpacity=".7" />
          </linearGradient>
          <linearGradient id="prism-edge" x1="190" y1="110" x2="430" y2="410" gradientUnits="userSpaceOnUse">
            <stop stopColor="#cffafe" />
            <stop offset=".5" stopColor="#a5b4fc" />
            <stop offset="1" stopColor="#e9d5ff" />
          </linearGradient>
          <radialGradient id="prism-core">
            <stop stopColor="#e0f2fe" stopOpacity=".9" />
            <stop offset=".35" stopColor="#67e8f9" stopOpacity=".35" />
            <stop offset="1" stopColor="#67e8f9" stopOpacity="0" />
          </radialGradient>
          <filter id="prism-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <filter id="prism-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <pattern id="prism-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" stroke="#94a3b8" strokeOpacity=".08" />
          </pattern>
        </defs>

        <rect x="1" y="1" width="618" height="518" rx="30" fill="#070b16" fillOpacity=".55" stroke="#94a3b8" strokeOpacity=".12" />
        <rect x="1" y="1" width="618" height="518" rx="30" fill="url(#prism-grid)" />

        <g className="prism-orbit" opacity=".7">
          <ellipse cx="310" cy="260" rx="250" ry="112" stroke="#67e8f9" strokeOpacity=".18" strokeDasharray="3 12" />
          <ellipse cx="310" cy="260" rx="196" ry="196" stroke="#a78bfa" strokeOpacity=".12" strokeDasharray="2 14" />
          <circle cx="310" cy="260" r="238" stroke="#94a3b8" strokeOpacity=".08" />
        </g>

        <circle cx="310" cy="260" r="150" fill="url(#prism-core)" filter="url(#prism-blur)" className="prism-pulse" />

        <path d="M92 260H190" stroke="url(#prism-beam)" strokeWidth="2" strokeDasharray="5 9" className="prism-beam" />
        <path d="M430 260H528" stroke="url(#prism-beam)" strokeWidth="2" strokeDasharray="5 9" className="prism-beam prism-beam--reverse" />

        <g className="prism-float-a">
          <rect x="24" y="196" width="150" height="128" rx="18" fill="#0b1224" stroke="#67e8f9" strokeOpacity=".3" transform="rotate(-7 99 260)" />
          <g transform="rotate(-7 99 260)">
            <rect x="42" y="216" width="114" height="66" rx="10" fill="#0f1b33" stroke="#94a3b8" strokeOpacity=".16" />
            <circle cx="66" cy="238" r="8" fill="#67e8f9" fillOpacity=".8" />
            <path d="m48 272 24-22 18 15 14-12 30 19" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="42" y="294" width="58" height="5" rx="2.5" fill="#67e8f9" fillOpacity=".55" />
            <rect x="42" y="305" width="34" height="4" rx="2" fill="#94a3b8" fillOpacity=".3" />
          </g>
        </g>

        <g className="prism-float-b">
          <rect x="448" y="188" width="150" height="150" rx="18" fill="#0b1224" stroke="#a78bfa" strokeOpacity=".35" transform="rotate(6 523 263)" />
          <g transform="rotate(6 523 263)" fontFamily="'JetBrains Mono', monospace" fontSize="10">
            <rect x="466" y="208" width="42" height="5" rx="2.5" fill="#c084fc" fillOpacity=".7" />
            <rect x="466" y="224" width="88" height="4" rx="2" fill="#67e8f9" fillOpacity=".5" />
            <rect x="478" y="236" width="64" height="4" rx="2" fill="#94a3b8" fillOpacity=".3" />
            <rect x="478" y="248" width="76" height="4" rx="2" fill="#94a3b8" fillOpacity=".3" />
            <rect x="466" y="260" width="52" height="4" rx="2" fill="#a5b4fc" fillOpacity=".5" />
            <rect x="466" y="280" width="96" height="4" rx="2" fill="#67e8f9" fillOpacity=".35" />
            <rect x="466" y="292" width="70" height="4" rx="2" fill="#94a3b8" fillOpacity=".25" />
            <rect x="466" y="304" width="84" height="4" rx="2" fill="#94a3b8" fillOpacity=".25" />
          </g>
        </g>

        <g className="prism-core">
          <path d="M310 110 430 180v160L310 410 190 340V180L310 110Z" fill="#0b1224" stroke="url(#prism-edge)" strokeWidth="2" />
          <path d="M310 110v150l120 80V180L310 110Z" fill="url(#prism-face)" fillOpacity=".2" />
          <path d="M310 110 190 180v160l120-80V110Z" fill="#67e8f9" fillOpacity=".07" />
          <path d="m310 260 120 80-120 70-120-70 120-80Z" fill="#8b5cf6" fillOpacity=".12" />
          <path d="M310 110v150m0 0 120 80m-120-80-120 80m120-80v150" stroke="#e0f2fe" strokeOpacity=".35" strokeWidth="1.4" />
          <circle cx="310" cy="260" r="7" fill="#e0f2fe" />
          <circle cx="310" cy="260" r="18" stroke="#67e8f9" strokeOpacity=".55" />
          <circle cx="310" cy="260" r="30" stroke="#a78bfa" strokeOpacity=".2" strokeDasharray="2 6" />
        </g>

        <g className="prism-chip prism-chip--one">
          <rect x="58" y="104" width="58" height="28" rx="14" fill="#0b1224" stroke="#67e8f9" strokeOpacity=".3" />
          <text x="87" y="122" textAnchor="middle" fill="#a5f3fc" fontFamily="'JetBrains Mono', monospace" fontSize="10" letterSpacing="1">PNG</text>
        </g>
        <g className="prism-chip prism-chip--two">
          <rect x="456" y="92" width="92" height="28" rx="14" fill="#0b1224" stroke="#a78bfa" strokeOpacity=".35" />
          <text x="502" y="110" textAnchor="middle" fill="#ddd6fe" fontFamily="'JetBrains Mono', monospace" fontSize="10" letterSpacing="1">BASE64</text>
        </g>
        <g className="prism-chip prism-chip--three">
          <rect x="430" y="404" width="104" height="28" rx="14" fill="#0b1224" stroke="#67e8f9" strokeOpacity=".3" />
          <text x="482" y="422" textAnchor="middle" fill="#a5f3fc" fontFamily="'JetBrains Mono', monospace" fontSize="10" letterSpacing="1">DATA URL</text>
        </g>
        <g className="prism-chip prism-chip--four">
          <rect x="76" y="404" width="58" height="28" rx="14" fill="#0b1224" stroke="#a78bfa" strokeOpacity=".35" />
          <text x="105" y="422" textAnchor="middle" fill="#ddd6fe" fontFamily="'JetBrains Mono', monospace" fontSize="10" letterSpacing="1">SVG</text>
        </g>

        <g fill="#67e8f9">
          <circle cx="160" cy="150" r="2.5" className="prism-particle prism-particle--one" />
          <circle cx="470" cy="360" r="2" className="prism-particle prism-particle--two" />
          <circle cx="520" cy="150" r="1.8" className="prism-particle prism-particle--three" />
          <circle cx="120" cy="350" r="2.2" className="prism-particle prism-particle--four" />
        </g>
      </svg>
    </div>
  )
}
