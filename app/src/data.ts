export type MusicAsset = {
  id: string
  title: string
  artist: string
  genre: string
  monthlyListeners: string
  valuation: string
  raise: string
  sold: number
  apr: string
  chain: string
  rights: string
  perks: string[]
  image: string
}

export type Proposal = {
  id: string
  title: string
  summary: string
  support: number
  against: number
  status: string
}

export const heroStats = [
  { label: 'Music market', value: '$300B+' },
  { label: 'Streaming share', value: '65%' },
  { label: 'Projected royalties', value: '$200B' },
  { label: 'Artist beta', value: 'Q4 2025' },
]

export const assets: MusicAsset[] = [
  {
    id: 'CDZ-101',
    title: 'Midnight Halo',
    artist: 'Nova Aster',
    genre: 'Electronic pop',
    monthlyListeners: '12.4M',
    valuation: '$480,000',
    raise: '$120,000',
    sold: 74,
    apr: '13.2%',
    chain: 'Ethereum L2',
    rights: 'Streaming + sync rights',
    perks: ['VIP livestream', 'Limited lyric NFT', 'Backstage presale'],
    image: '/cadenza/hj.png',
  },
  {
    id: 'CDZ-204',
    title: 'Velvet Static',
    artist: 'Echo Vale',
    genre: 'Alt R&B',
    monthlyListeners: '6.8M',
    valuation: '$310,000',
    raise: '$80,000',
    sold: 51,
    apr: '11.4%',
    chain: 'Base',
    rights: 'Master royalty share',
    perks: ['Demo access', 'Collector poster', 'Private Discord role'],
    image: '/cadenza/hj.png',
  },
  {
    id: 'CDZ-319',
    title: 'Solar Choir',
    artist: 'Aurora Method',
    genre: 'Cinematic ambient',
    monthlyListeners: '3.2M',
    valuation: '$220,000',
    raise: '$60,000',
    sold: 63,
    apr: '9.8%',
    chain: 'BNB Chain',
    rights: 'Publishing + live rights',
    perks: ['Scoring session notes', 'Genesis pass', 'Community drop'],
    image: '/cadenza/hj.png',
  },
]

export const royaltyEvents = [
  { month: 'Jan', amount: '$18,420', growth: '+12%' },
  { month: 'Feb', amount: '$19,870', growth: '+8%' },
  { month: 'Mar', amount: '$21,350', growth: '+7%' },
  { month: 'Apr', amount: '$24,190', growth: '+13%' },
]

export const featureFlow = [
  {
    title: 'Verify copyright',
    text: 'Upload masters, metadata, and registry proof. Cadenza mints a copyright NFT once checks pass.',
  },
  {
    title: 'Fractionalize future royalties',
    text: 'Lock the NFT into the tokenization contract and issue ERC-20 fractions for investors and fans.',
  },
  {
    title: 'Trade and provide liquidity',
    text: 'List primary allocations, open AMM pools, and unlock 24/7 secondary market pricing.',
  },
  {
    title: 'Distribute revenue automatically',
    text: 'Streaming and sync income flows into the royalty vault and is paid out in stablecoins.',
  },
]

export const portfolioCards = [
  { label: 'Claimable this cycle', value: '$1,284.22', meta: 'USDC vault balance' },
  { label: 'Average blended APR', value: '12.1%', meta: 'Across 6 music positions' },
  { label: 'Active music RWAs', value: '18', meta: 'Tracks, albums, sync bundles' },
]

export const proposals: Proposal[] = [
  {
    id: 'G-12',
    title: 'Add Apple Music oracle adapter',
    summary: 'Expand direct revenue ingestion to Apple Music royalty statements and improve payout confidence.',
    support: 72,
    against: 28,
    status: 'Voting live',
  },
  {
    id: 'G-18',
    title: 'Lower minimum fan allocation',
    summary: 'Reduce primary sale entry from $25 to $10 equivalent to improve fan participation.',
    support: 61,
    against: 39,
    status: 'Discussion',
  },
  {
    id: 'G-24',
    title: 'Enable quarterly sync-right vault',
    summary: 'Launch a dedicated vault for sync and licensing income with separate reporting.',
    support: 84,
    against: 16,
    status: 'Queued',
  },
]

export const knowledgeNotes = [
  'Mission: make music copyrights transparent, tradable, and globally accessible RWAs.',
  'Product pillars: verification NFT, ERC-20 fractionalization, marketplace liquidity, automated royalty payouts, DAO governance.',
  'Roadmap: Alpha in Q4 2025, beta + marketplace in Q2 2026, royalty pool in Q4 2026, liquidity expansion in 2027.',
  'Planned partnerships: ASCAP/BMI/PRS style registries, Spotify/Apple Music APIs, DeFi pools, legal compliance partners.',
]
