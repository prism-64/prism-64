import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Download,
  Image as ImageIcon,
  Layers,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react'
import { DecodePanel } from './components/DecodePanel'
import { EncodePanel } from './components/EncodePanel'
import { Logo } from './components/Logo'
import { PrismArtwork } from './components/PrismArtwork'
import { Toast } from './components/Toast'
import type { ToastState, ToastTone } from './types'

type Tab = 'encode' | 'decode'

function App() {
  const [tab, setTab] = useState<Tab>('encode')
  const [toast, setToast] = useState<ToastState | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  const notify = useCallback((message: string, tone: ToastTone = 'success') => {
    setToast({ id: Date.now(), message, tone })
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3600)
  }, [])

  useEffect(() => {
    return () => window.clearTimeout(toastTimer.current)
  }, [])

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const nextTab: Tab = tab === 'encode' ? 'decode' : 'encode'
    setTab(nextTab)
    window.requestAnimationFrame(() => document.getElementById(`tab-${nextTab}`)?.focus())
  }

  return (
    <div className="app-shell" id="top">
      <a className="skip-link" href="#workbench">
        Skip to workbench
      </a>

      <div className="ambient" aria-hidden="true">
        <div className="ambient__grid" />
        <div className="ambient__orb ambient__orb--cyan" />
        <div className="ambient__orb ambient__orb--violet" />
        <div className="ambient__orb ambient__orb--blue" />
      </div>

      <header className="site-header">
        <Logo />
        <nav className="site-nav" aria-label="Primary">
          <a href="#workbench">Workbench</a>
          <a href="#how-it-works">How it works</a>
          <a href="#privacy">Privacy</a>
        </nav>
        <div className="header-status">
          <span className="pulse-dot" />
          Runs locally
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              Image ↔ Base64
            </span>
            <h1>
              Images in.
              <br />
              <span className="gradient-text">Code out.</span>
              <br />
              And back.
            </h1>
            <p className="hero-lede">
              A fast, private workbench for turning images into portable data URLs—and reconstructing
              them from Base64. No uploads. No accounts. Just the bytes.
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#workbench">
                <Upload size={16} aria-hidden="true" />
                Start converting
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a className="button button--ghost" href="#how-it-works">
                <Sparkles size={16} aria-hidden="true" />
                See how it works
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <strong>0</strong>
                <span>uploads</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>local</span>
              </div>
              <div>
                <strong>4</strong>
                <span>snippet formats</span>
              </div>
            </div>
          </div>
          <div className="hero-art">
            <PrismArtwork />
          </div>
        </section>

        <section className="section workbench-section" id="workbench">
          <div className="section-heading">
            <div>
              <span className="eyebrow">01 / The workbench</span>
              <h2>
                One workspace.
                <br />
                Both directions.
              </h2>
            </div>
            <p>
              Encode a batch of images into data URLs, or paste Base64 and rebuild the original file.
              Everything stays in this tab.
            </p>
          </div>

          <div className="workbench">
            <div className="workbench-topbar">
              <div className="tabs" role="tablist" aria-label="Conversion direction">
                <button
                  id="tab-encode"
                  type="button"
                  role="tab"
                  aria-selected={tab === 'encode'}
                  aria-controls="panel-encode"
                  tabIndex={tab === 'encode' ? 0 : -1}
                  className="tab"
                  onClick={() => setTab('encode')}
                  onKeyDown={handleTabKeyDown}
                >
                  <ImageIcon size={15} aria-hidden="true" />
                  Encode
                </button>
                <button
                  id="tab-decode"
                  type="button"
                  role="tab"
                  aria-selected={tab === 'decode'}
                  aria-controls="panel-decode"
                  tabIndex={tab === 'decode' ? 0 : -1}
                  className="tab"
                  onClick={() => setTab('decode')}
                  onKeyDown={handleTabKeyDown}
                >
                  <Code2 size={15} aria-hidden="true" />
                  Decode
                </button>
              </div>
              <div className="session-pill">
                <span className="pulse-dot" />
                Local session
              </div>
            </div>
            <div className="workbench-body">
              <div
                id="panel-encode"
                role="tabpanel"
                aria-labelledby="tab-encode"
                hidden={tab !== 'encode'}
              >
                <EncodePanel notify={notify} active={tab === 'encode'} />
              </div>
              <div
                id="panel-decode"
                role="tabpanel"
                aria-labelledby="tab-decode"
                hidden={tab !== 'decode'}
              >
                <DecodePanel notify={notify} />
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="how-it-works">
          <div className="section-heading">
            <div>
              <span className="eyebrow">02 / The flow</span>
              <h2>
                Three steps.
                <br />
                Zero uploads.
              </h2>
            </div>
            <p>
              The browser does the heavy lifting. Prism64 reads the file, converts the bytes, and hands
              you copy-ready output.
            </p>
          </div>

          <div className="how-grid">
            <article className="step-card">
              <span className="step-number">01</span>
              <div className="step-icon">
                <Upload size={20} aria-hidden="true" />
              </div>
              <h3>Drop an image</h3>
              <p>
                Choose a file, drag a batch, or paste from your clipboard. Prism64 reads the bytes
                directly in your browser.
              </p>
            </article>
            <article className="step-card">
              <span className="step-number">02</span>
              <div className="step-icon">
                <Code2 size={20} aria-hidden="true" />
              </div>
              <h3>Take the code</h3>
              <p>
                Copy a complete data URL, raw Base64, or a ready-made HTML, CSS, Markdown, or JSON
                snippet.
              </p>
            </article>
            <article className="step-card">
              <span className="step-number">03</span>
              <div className="step-icon">
                <Download size={20} aria-hidden="true" />
              </div>
              <h3>Go back again</h3>
              <p>
                Paste Base64 into the decoder to validate the bytes, preview the image, and download the
                reconstructed file.
              </p>
            </article>
          </div>
        </section>

        <section className="section" id="privacy">
          <div className="privacy-card">
            <div className="privacy-art" aria-hidden="true">
              <div className="privacy-orbit privacy-orbit--outer" />
              <div className="privacy-orbit privacy-orbit--inner" />
              <div className="privacy-shield">
                <ShieldCheck size={44} />
              </div>
              <span className="privacy-chip privacy-chip--one">
                <LockKeyhole size={12} />
                local
              </span>
              <span className="privacy-chip privacy-chip--two">
                <Layers size={12} />
                in-memory
              </span>
            </div>
            <div className="privacy-copy">
              <span className="eyebrow">03 / Privacy</span>
              <h2>Your images stay yours.</h2>
              <p>
                Prism64 is a client-side tool. There is no upload endpoint, no account, and no analytics
                on your files.
              </p>
              <ul className="privacy-list">
                <li>
                  <Check size={15} aria-hidden="true" />
                  Files are read with the browser File API.
                </li>
                <li>
                  <Check size={15} aria-hidden="true" />
                  Base64 is generated and decoded in memory.
                </li>
                <li>
                  <Check size={15} aria-hidden="true" />
                  Refreshing the page clears the session.
                </li>
              </ul>
              <p className="privacy-note">
                Tip: data URLs are larger than the original file—usually about 33% bigger. Use them for
                small assets, prototypes, and self-contained documents.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <Logo />
          <p>Image ↔ Base64, without the round trip.</p>
        </div>
        <div className="footer-meta">
          <span>Built for the browser.</span>
          <a href="#top">
            Back to top
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </footer>

      {toast ? <Toast toast={toast} onDismiss={() => setToast(null)} /> : null}
    </div>
  )
}

export default App
