import './style.css'
import {
  assets,
  featureFlow,
  heroStats,
  knowledgeNotes,
  portfolioCards,
  proposals,
  royaltyEvents,
  type MusicAsset,
} from './data'

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>
    }
  }
}

type VoteState = Record<string, { support: number; against: number }>

const storageKeys = {
  minted: 'cadenza-minted-assets',
  wallet: 'cadenza-wallet-address',
}

let connectedWallet = window.localStorage.getItem(storageKeys.wallet) ?? ''
let createdAssets = loadCreatedAssets()
let currentTab = 'discover'
let currentFilter = 'All'
let activePlayer = 0
let isPlaying = false
let progress = 18
let progressTimer = 0
let voteState: VoteState = Object.fromEntries(
  proposals.map((proposal) => [proposal.id, { support: proposal.support, against: proposal.against }]),
)

function loadCreatedAssets(): MusicAsset[] {
  try {
    const raw = window.localStorage.getItem(storageKeys.minted)
    if (!raw) return []
    return JSON.parse(raw) as MusicAsset[]
  } catch {
    return []
  }
}

function persistCreatedAssets() {
  window.localStorage.setItem(storageKeys.minted, JSON.stringify(createdAssets))
}

function formatWallet(address: string) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect wallet'
}

function allAssets() {
  return [...createdAssets, ...assets]
}

function filteredAssets() {
  if (currentFilter === 'All') return allAssets()
  return allAssets().filter((asset) => {
    if (currentFilter === 'Streaming') return asset.rights.includes('Streaming')
    if (currentFilter === 'Master') return asset.rights.includes('Master')
    if (currentFilter === 'Publishing') return asset.rights.includes('Publishing')
    return true
  })
}

function renderHeroStats() {
  return heroStats
    .map(
      (item) => `
      <article class="metric-card reveal">
        <strong>${item.value}</strong>
        <span>${item.label}</span>
      </article>`,
    )
    .join('')
}

function renderAssetCard(asset: MusicAsset, featured = false) {
  return `
    <article class="asset-card ${featured ? 'featured' : ''} reveal">
      <div class="asset-art-wrap">
        <img src="${asset.image}" alt="${asset.title}" class="asset-art">
        <div class="asset-overlay"></div>
      </div>
      <div class="asset-copy">
        <div class="asset-tags">
          <span>${asset.id}</span>
          <span>${asset.chain}</span>
        </div>
        <h3>${asset.title}</h3>
        <p>${asset.artist} · ${asset.genre}</p>
        <div class="asset-stats">
          <div><label>Valuation</label><strong>${asset.valuation}</strong></div>
          <div><label>Raise</label><strong>${asset.raise}</strong></div>
          <div><label>Sold</label><strong>${asset.sold}%</strong></div>
          <div><label>APR</label><strong>${asset.apr}</strong></div>
        </div>
        <div class="asset-footer">
          <span>${asset.rights}</span>
          <button type="button" class="ghost-chip" data-open-sheet="${asset.id}">View deal</button>
        </div>
      </div>
    </article>
  `
}

function renderProposalCard(id: string) {
  const proposal = proposals.find((item) => item.id === id)!
  const state = voteState[id]
  const total = state.support + state.against
  const supportRatio = total ? Math.round((state.support / total) * 100) : 0

  return `
    <article class="proposal-card reveal">
      <div class="asset-tags">
        <span>${proposal.id}</span>
        <span>${proposal.status}</span>
      </div>
      <h3>${proposal.title}</h3>
      <p>${proposal.summary}</p>
      <div class="vote-track"><span style="width:${supportRatio}%"></span></div>
      <div class="vote-meta">
        <strong>${supportRatio}% support</strong>
        <span>${state.support.toLocaleString()} / ${state.against.toLocaleString()}</span>
      </div>
      <div class="vote-actions">
        <button type="button" class="pill-button" data-vote="${proposal.id}" data-side="support">Vote support</button>
        <button type="button" class="pill-button muted" data-vote="${proposal.id}" data-side="against">Vote against</button>
      </div>
    </article>
  `
}

function buildApp() {
  const tracks = allAssets()
  const current = tracks[activePlayer] ?? tracks[0]
  const marketAssets = filteredAssets()

  return `
    <div class="app-shell">
      <video class="bg-video" autoplay muted loop playsinline>
        <source src="/cadenza/bg1.mp4" type="video/mp4">
      </video>
      <div class="bg-layer"></div>
      <div class="noise-layer"></div>

      <div class="phone-frame">
        <div class="phone-highlight"></div>
        <div class="status-pill">
          <span class="camera-cutout"></span>
          <div class="status-copy">
            <strong>Cadenza</strong>
            <span>Music copyright RWA</span>
          </div>
          <button type="button" class="wallet-chip" id="wallet-button">${formatWallet(connectedWallet)}</button>
        </div>

        <main class="screen-stack">
          <section class="screen ${currentTab === 'discover' ? 'is-active' : ''}" data-screen="discover">
            <header class="screen-header reveal">
              <span class="eyebrow">Discover</span>
              <h1>Own the songs you love.</h1>
              <p>Cadenza turns streaming royalties into tradable, yield-bearing music assets for artists, investors, and fans.</p>
            </header>

            <section class="hero-panel reveal">
              <div class="hero-panel-copy">
                <span class="hero-kicker">Featured rights drop</span>
                <h2>${current.title}</h2>
                <p>${current.artist} · ${current.rights} · ${current.monthlyListeners} monthly listeners</p>
                <div class="hero-cta-row">
                  <button type="button" class="primary-button" data-nav="market">Invest now</button>
                  <button type="button" class="secondary-button" data-nav="mint">Mint track</button>
                </div>
              </div>
              <img src="${current.image}" alt="${current.title}" class="hero-art">
            </section>

            <section class="metrics-grid">
              ${renderHeroStats()}
            </section>

            <section class="top-picks reveal">
              <div class="section-mini-head">
                <span class="eyebrow">Top picks</span>
                <strong>Most active fan-owned drops</strong>
              </div>
              <div class="top-picks-row">
                ${allAssets()
                  .slice(0, 3)
                  .map(
                    (asset) => `
                    <button type="button" class="top-pick-card" data-open-sheet="${asset.id}">
                      <img src="${asset.image}" alt="${asset.title}">
                      <span>${asset.title}</span>
                      <strong>${asset.apr}</strong>
                    </button>`,
                  )
                  .join('')}
              </div>
            </section>

            <section class="module-grid">
              ${featureFlow
                .map(
                  (item, index) => `
                  <article class="module-card reveal">
                    <span class="module-index">0${index + 1}</span>
                    <h3>${item.title}</h3>
                    <p>${item.text}</p>
                  </article>`,
                )
                .join('')}
            </section>
          </section>

          <section class="screen ${currentTab === 'vault' ? 'is-active' : ''}" data-screen="vault">
            <header class="screen-header reveal">
              <span class="eyebrow">Vault</span>
              <h1>Royalty flows and fan ownership.</h1>
              <p>Track stablecoin payouts, see your music positions, and manage distribution schedules in one place.</p>
            </header>

            <section class="vault-summary">
              ${portfolioCards
                .map(
                  (item) => `
                  <article class="soft-card reveal">
                    <span>${item.label}</span>
                    <strong>${item.value}</strong>
                    <p>${item.meta}</p>
                  </article>`,
                )
                .join('')}
            </section>

            <section class="royalty-card reveal">
              <div class="royalty-head">
                <div>
                  <span class="eyebrow">Revenue pool</span>
                  <h2>Stablecoin distribution schedule</h2>
                </div>
                <button type="button" class="primary-button compact" id="claim-button">Claim payouts</button>
              </div>
              <div class="royalty-bars">
                ${royaltyEvents
                  .map(
                    (event) => `
                    <div class="royalty-bar">
                      <span>${event.month}</span>
                      <div class="bar-track"><span style="height:${40 + royaltyEvents.indexOf(event) * 14}%"></span></div>
                      <strong>${event.amount}</strong>
                      <em>${event.growth}</em>
                    </div>`,
                  )
                  .join('')}
              </div>
            </section>

            <section class="portfolio-list">
              ${allAssets()
                .slice(0, 3)
                .map((asset) => renderAssetCard(asset))
                .join('')}
            </section>
          </section>

          <section class="screen ${currentTab === 'mint' ? 'is-active' : ''}" data-screen="mint">
            <header class="screen-header reveal">
              <span class="eyebrow">Mint</span>
              <h1>Turn a track into a music RWA.</h1>
              <p>Simulate the whitepaper flow from rights verification to fractional issuance and investor-ready launch.</p>
            </header>

            <form class="mint-card reveal" id="mint-form">
              <div class="form-row">
                <label>
                  <span>Artist</span>
                  <input name="artist" placeholder="Nova Aster" required>
                </label>
                <label>
                  <span>Track title</span>
                  <input name="title" placeholder="Midnight Halo" required>
                </label>
              </div>
              <div class="form-row">
                <label>
                  <span>Expected raise</span>
                  <input name="raise" placeholder="120000" required>
                </label>
                <label>
                  <span>Expected valuation</span>
                  <input name="valuation" placeholder="480000" required>
                </label>
              </div>
              <div class="form-row">
                <label>
                  <span>Rights bundle</span>
                  <select name="rights">
                    <option>Streaming + sync rights</option>
                    <option>Master royalty share</option>
                    <option>Publishing + live rights</option>
                  </select>
                </label>
                <label>
                  <span>Chain</span>
                  <select name="chain">
                    <option>Ethereum L2</option>
                    <option>Base</option>
                    <option>BNB Chain</option>
                  </select>
                </label>
              </div>
              <label>
                <span>Verification checklist</span>
                <textarea name="notes" rows="4" placeholder="Copyright registry proof, KYC status, metadata hash, oracle source..."></textarea>
              </label>
              <div class="mint-flow">
                <span>Upload</span>
                <span>Verify</span>
                <span>Mint NFT</span>
                <span>Fractionalize</span>
                <span>Launch</span>
              </div>
              <div class="mint-hints">
                <span>ASCAP / BMI style proof</span>
                <span>Metadata hash</span>
                <span>Stablecoin payout ready</span>
              </div>
              <button type="submit" class="primary-button wide">Create music RWA</button>
            </form>
          </section>

          <section class="screen ${currentTab === 'market' ? 'is-active' : ''}" data-screen="market">
            <header class="screen-header reveal">
              <span class="eyebrow">Market</span>
              <h1>Primary drops and secondary liquidity.</h1>
              <p>Browse music rights offerings, invest in fractional royalties, and monitor fan perks bundled with ownership.</p>
            </header>

            <div class="filter-row reveal">
              ${['All', 'Streaming', 'Master', 'Publishing']
                .map(
                  (filter) => `
                  <button type="button" class="filter-chip ${currentFilter === filter ? 'is-active' : ''}" data-filter="${filter}">
                    ${filter}
                  </button>`,
                )
                .join('')}
            </div>

            <div class="market-list">
              ${marketAssets.map((asset, index) => renderAssetCard(asset, index === 0)).join('')}
            </div>
          </section>

          <section class="screen ${currentTab === 'dao' ? 'is-active' : ''}" data-screen="dao">
            <header class="screen-header reveal">
              <span class="eyebrow">DAO</span>
              <h1>Protocol governance and compliance visibility.</h1>
              <p>Vote on payout cadence, oracle coverage, fan allocation thresholds, and strategic music ecosystem integrations.</p>
            </header>

            <section class="proposal-list">
              ${proposals.map((proposal) => renderProposalCard(proposal.id)).join('')}
            </section>

            <section class="knowledge-card reveal">
              <span class="eyebrow">Whitepaper notes</span>
              <h2>Public product intelligence</h2>
              <ul>
                ${knowledgeNotes.map((note) => `<li>${note}</li>`).join('')}
              </ul>
              <div class="knowledge-links">
                <a href="/cadenza/whitepaper.html" target="_blank" rel="noreferrer">Open mirrored whitepaper</a>
                <a href="/cadenza/source-index.html" target="_blank" rel="noreferrer">Open source site</a>
              </div>
            </section>
          </section>
        </main>

        <section class="player-dock reveal">
          <button type="button" class="player-art-button" id="player-toggle">
            <img src="${current.image}" alt="${current.title}" class="player-art">
          </button>
          <div class="player-copy">
            <strong>${current.title}</strong>
            <span>${current.artist}</span>
          </div>
          <div class="player-eq ${isPlaying ? 'is-playing' : ''}">
            <span></span><span></span><span></span>
          </div>
          <div class="player-progress">
            <span style="width:${progress}%"></span>
          </div>
          <button type="button" class="play-button" id="play-button">${isPlaying ? 'Pause' : 'Play'}</button>
        </section>

        <nav class="bottom-nav">
          <button type="button" class="nav-item ${currentTab === 'discover' ? 'is-active' : ''}" data-nav="discover"><span>Discover</span></button>
          <button type="button" class="nav-item ${currentTab === 'vault' ? 'is-active' : ''}" data-nav="vault"><span>Vault</span></button>
          <button type="button" class="nav-item ${currentTab === 'mint' ? 'is-active' : ''}" data-nav="mint"><span>Mint</span></button>
          <button type="button" class="nav-item ${currentTab === 'market' ? 'is-active' : ''}" data-nav="market"><span>Market</span></button>
          <button type="button" class="nav-item ${currentTab === 'dao' ? 'is-active' : ''}" data-nav="dao"><span>DAO</span></button>
        </nav>
      </div>

      <div class="sheet-backdrop hidden" id="sheet-backdrop"></div>
      <aside class="detail-sheet hidden" id="detail-sheet" aria-hidden="true"></aside>
      <div class="toast hidden" id="toast"></div>
    </div>
  `
}

function showToast(message: string) {
  const toast = document.querySelector<HTMLElement>('#toast')
  if (!toast) return
  toast.textContent = message
  toast.classList.remove('hidden')
  toast.classList.add('show')
  window.setTimeout(() => {
    toast.classList.remove('show')
    toast.classList.add('hidden')
  }, 2200)
}

function renderSheet(asset: MusicAsset) {
  const sheet = document.querySelector<HTMLElement>('#detail-sheet')
  const backdrop = document.querySelector<HTMLElement>('#sheet-backdrop')
  if (!sheet || !backdrop) return

  sheet.innerHTML = `
    <button type="button" class="sheet-close" id="sheet-close">Close</button>
    <img src="${asset.image}" alt="${asset.title}" class="sheet-art">
    <div class="asset-tags"><span>${asset.id}</span><span>${asset.chain}</span></div>
    <h2>${asset.title}</h2>
    <p class="sheet-sub">${asset.artist} · ${asset.genre}</p>
    <div class="sheet-grid">
      <div><label>Rights</label><strong>${asset.rights}</strong></div>
      <div><label>Raise</label><strong>${asset.raise}</strong></div>
      <div><label>Valuation</label><strong>${asset.valuation}</strong></div>
      <div><label>Projected APR</label><strong>${asset.apr}</strong></div>
    </div>
    <div class="sheet-section">
      <span class="eyebrow">Fan perks</span>
      <ul>${asset.perks.map((perk) => `<li>${perk}</li>`).join('')}</ul>
    </div>
    <div class="sheet-actions"><button type="button" class="primary-button wide" data-buy="${asset.id}">Buy fractions</button></div>
  `

  sheet.classList.remove('hidden')
  backdrop.classList.remove('hidden')
  sheet.setAttribute('aria-hidden', 'false')

  document.querySelector<HTMLButtonElement>('#sheet-close')?.addEventListener('click', closeSheet)
  document.querySelector<HTMLButtonElement>(`[data-buy="${asset.id}"]`)?.addEventListener('click', () => {
    showToast(`Order routed for ${asset.title}.`)
    closeSheet()
  })
}

function closeSheet() {
  const sheet = document.querySelector<HTMLElement>('#detail-sheet')
  const backdrop = document.querySelector<HTMLElement>('#sheet-backdrop')
  sheet?.classList.add('hidden')
  backdrop?.classList.add('hidden')
  sheet?.setAttribute('aria-hidden', 'true')
}

function refresh() {
  const app = document.querySelector<HTMLDivElement>('#app')
  if (!app) return
  app.innerHTML = buildApp()
  wireEvents()
  triggerReveal()
}

function switchTab(tab: string) {
  currentTab = tab
  refresh()
}

function wireEvents() {
  document.querySelectorAll<HTMLElement>('[data-nav]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-nav')
      if (target) switchTab(target)
    })
  })

  document.querySelectorAll<HTMLElement>('[data-open-sheet]').forEach((button) => {
    button.addEventListener('click', () => {
      const assetId = button.getAttribute('data-open-sheet')
      const asset = allAssets().find((item) => item.id === assetId)
      if (asset) renderSheet(asset)
    })
  })

  document.querySelector('#sheet-backdrop')?.addEventListener('click', closeSheet)

  document.querySelectorAll<HTMLElement>('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      const next = button.getAttribute('data-filter')
      if (!next) return
      currentFilter = next
      refresh()
    })
  })

  document.querySelector<HTMLButtonElement>('#wallet-button')?.addEventListener('click', connectWallet)
  document.querySelector<HTMLButtonElement>('#claim-button')?.addEventListener('click', () => {
    showToast('Stablecoin payout claimed to your wallet.')
  })

  document.querySelector<HTMLButtonElement>('#play-button')?.addEventListener('click', togglePlayer)
  document.querySelector<HTMLButtonElement>('#player-toggle')?.addEventListener('click', () => {
    activePlayer = (activePlayer + 1) % allAssets().length
    progress = 18
    refresh()
  })

  document.querySelector<HTMLFormElement>('#mint-form')?.addEventListener('submit', onMintSubmit)

  document.querySelectorAll<HTMLElement>('[data-vote]').forEach((button) => {
    button.addEventListener('click', () => {
      const proposalId = button.getAttribute('data-vote')
      const side = button.getAttribute('data-side')
      if (!proposalId || !side) return
      voteState[proposalId] = {
        ...voteState[proposalId],
        support: voteState[proposalId].support + (side === 'support' ? 1 : 0),
        against: voteState[proposalId].against + (side === 'against' ? 1 : 0),
      }
      showToast(`Your ${side} vote has been recorded.`)
      refresh()
    })
  })
}

function onMintSubmit(event: Event) {
  event.preventDefault()
  const form = event.currentTarget as HTMLFormElement
  const data = new FormData(form)
  const title = String(data.get('title') ?? '')
  const artist = String(data.get('artist') ?? '')
  const valuation = Number(data.get('valuation') ?? 0)
  const raise = Number(data.get('raise') ?? 0)
  const rights = String(data.get('rights') ?? 'Streaming + sync rights')
  const chain = String(data.get('chain') ?? 'Ethereum L2')

  if (!title || !artist || valuation <= 0 || raise <= 0) {
    showToast('Please complete the mint form with valid amounts.')
    return
  }

  const newAsset: MusicAsset = {
    id: `CDZ-${Math.floor(Math.random() * 900 + 100)}`,
    title,
    artist,
    genre: 'New submission',
    monthlyListeners: 'Pending verification',
    valuation: `$${valuation.toLocaleString()}`,
    raise: `$${raise.toLocaleString()}`,
    sold: 12,
    apr: '10.8%',
    chain,
    rights,
    perks: ['Genesis supporter badge', 'Whitelist presale', 'Creator room access'],
    image: '/cadenza/hj.png',
  }

  createdAssets = [newAsset, ...createdAssets]
  persistCreatedAssets()
  showToast(`${title} is now queued for copyright verification.`)
  currentTab = 'market'
  currentFilter = 'All'
  refresh()
}

async function connectWallet() {
  if (!window.ethereum) {
    connectedWallet = 'Demo connected'
    window.localStorage.setItem(storageKeys.wallet, connectedWallet)
    showToast('Demo wallet connected.')
    refresh()
    return
  }

  try {
    const accounts = (await window.ethereum.request({ method: 'eth_requestAccounts' })) as string[]
    connectedWallet = accounts[0] ?? 'Connected'
    window.localStorage.setItem(storageKeys.wallet, connectedWallet)
    showToast('Wallet connected.')
    refresh()
  } catch {
    showToast('Wallet connection cancelled.')
  }
}

function togglePlayer() {
  isPlaying = !isPlaying
  window.clearInterval(progressTimer)
  if (isPlaying) {
    progressTimer = window.setInterval(() => {
      progress = progress >= 100 ? 0 : progress + 2
      const bar = document.querySelector<HTMLElement>('.player-progress span')
      if (bar) bar.style.width = `${progress}%`
    }, 280)
  }
  refresh()
}

function triggerReveal() {
  document.querySelectorAll<HTMLElement>('.reveal').forEach((node, index) => {
    node.style.transitionDelay = `${Math.min(index * 45, 260)}ms`
    requestAnimationFrame(() => node.classList.add('in-view'))
  })
}

const app = document.querySelector<HTMLDivElement>('#app')
if (app) {
  app.innerHTML = buildApp()
  wireEvents()
  triggerReveal()
}
