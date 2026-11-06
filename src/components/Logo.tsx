export function Logo() {
  return (
    <a className="brand" href="#top" aria-label="Prism64 home">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none">
          <path
            d="M16 3.5 27 10v12L16 28.5 5 22V10L16 3.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M16 3.5v12.2L27 10M16 15.7 5 10m11 5.7v12.8" stroke="currentColor" strokeWidth="1.2" opacity=".7" />
          <circle cx="16" cy="15.7" r="2.2" fill="currentColor" />
        </svg>
      </span>
      <span className="brand-copy">
        <span className="brand-name">
          Prism<span>64</span>
        </span>
        <span className="brand-tag">Image codec studio</span>
      </span>
    </a>
  )
}
