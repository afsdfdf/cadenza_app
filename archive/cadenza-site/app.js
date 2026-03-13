/* Cadenza Futuristic Web Player */
(function () {
	const audio = document.getElementById('audio');
	const titleEl = document.getElementById('title');
	const artistEl = document.getElementById('artist');
	const coverEl = document.getElementById('cover');
	const playBtn = document.getElementById('btn-play');
	const playIcon = document.getElementById('play-icon');
	const prevBtns = [document.getElementById('btn-prev'), document.getElementById('btn-prev-2')];
	const nextBtns = [document.getElementById('btn-next'), document.getElementById('btn-next-2')];
	const seek = document.getElementById('seek');
	const currentTimeEl = document.getElementById('current-time');
	const durationEl = document.getElementById('duration');
	const volumeEl = document.getElementById('volume');
	const spectrumCanvas = document.getElementById('spectrum');
	const marketGrid = document.getElementById('market-grid');
	const progressRing = document.getElementById('progress-ring');
	const listLeft = document.getElementById('list-left');
	const listRight = document.getElementById('list-right');
	const rwa = {
		cover: document.getElementById('rwa-cover'),
		hash: document.getElementById('rwa-hash'),
		proof: document.getElementById('rwa-proof'),
		shares: document.getElementById('rwa-shares'),
		min: document.getElementById('rwa-min'),
		sold: document.getElementById('rwa-sold'),
		price: document.getElementById('rwa-price'),
		apr: document.getElementById('rwa-apr'),
		cycle: document.getElementById('rwa-cycle'),
		issuer: document.getElementById('rwa-issuer'),
		chain: document.getElementById('rwa-chain'),
		contract: document.getElementById('rwa-contract'),
		score: document.getElementById('rwa-score'),
		launch: document.getElementById('rwa-launch'),
		buyBtn: document.getElementById('btn-buy')
	};

	// Dynamic playlist from iTunes RSS + Search API (previewUrl)
let playlist = [];
const fallbackPlaylist = [
    { id: 'demo-1', title: 'Aurora Drift', artist: 'Neon Systems', cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_2d20d6bced.mp3?filename=chill-ambient-110997.mp3' },
    { id: 'demo-2', title: 'Pulse Runner', artist: 'Arc Reactor', cover: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop', url: 'https://cdn.pixabay.com/download/audio/2022/10/19/audio_1a4a6b58fc.mp3?filename=deep-ambient-124131.mp3' },
    { id: 'demo-3', title: 'Zero Gravity', artist: 'Orbit Lab', cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_4a7462f2b4.mp3?filename=space-ambient-110996.mp3' },
    { id: 'demo-4', title: 'Quantum Bloom', artist: 'Fractal Flora', cover: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1200&auto=format&fit=crop', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_0a7a1a3e8f.mp3?filename=ambient-music-110995.mp3' },
    { id: 'demo-5', title: 'Singularity', artist: 'Event Horizon', cover: 'https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?q=80&w=1200&auto=format&fit=crop', url: 'https://cdn.pixabay.com/download/audio/2021/10/26/audio_2b53cdaef6.mp3?filename=cyber-groove-ambient-98938.mp3' },
    { id: 'demo-6', title: 'Photon Trail', artist: 'Lightyear', cover: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop', url: 'https://cdn.pixabay.com/download/audio/2022/02/23/audio_812433a7d2.mp3?filename=ambient-chill-110200.mp3' },
    { id: 'demo-7', title: 'Holo City', artist: 'Metaverse 77', cover: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1200&auto=format&fit=crop', url: 'https://cdn.pixabay.com/download/audio/2021/09/08/audio_4cf7c9b327.mp3?filename=night-city-ambient-90850.mp3' },
    { id: 'demo-8', title: 'Crystal Code', artist: 'Binary Bloom', cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop', url: 'https://cdn.pixabay.com/download/audio/2022/03/23/audio_4a19cc5bde.mp3?filename=ambient-111181.mp3' },
    { id: 'demo-9', title: 'Neon Tide', artist: 'Sea of Bits', cover: 'https://images.unsplash.com/photo-1519923834699-ef0b7cde4712?q=80&w=1200&auto=format&fit=crop', url: 'https://cdn.pixabay.com/download/audio/2022/03/23/audio_ea46e3e500.mp3?filename=chill-111179.mp3' },
    { id: 'demo-10', title: 'Echo Chamber', artist: 'Resonance', cover: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1200&auto=format&fit=crop', url: 'https://cdn.pixabay.com/download/audio/2022/03/23/audio_92d78a1d3834.mp3?filename=soft-ambient-111178.mp3' },
    // additional for 2 more market rows (20 items total)
    { id: 'demo-11', title: 'Cosmic Drift', artist: 'Neon Systems', cover: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop', url: 'https://cdn.pixabay.com/download/audio/2022/10/19/audio_1a4a6b58fc.mp3?filename=deep-ambient-124131.mp3' },
    { id: 'demo-12', title: 'Night Runner', artist: 'Arc Reactor', cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_2d20d6bced.mp3?filename=chill-ambient-110997.mp3' },
    { id: 'demo-13', title: 'Stellar Echo', artist: 'Orbit Lab', cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_4a7462f2b4.mp3?filename=space-ambient-110996.mp3' },
    { id: 'demo-14', title: 'Fractal Bloom', artist: 'Fractal Flora', cover: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1200&auto=format&fit=crop', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_0a7a1a3e8f.mp3?filename=ambient-music-110995.mp3' },
    { id: 'demo-15', title: 'Event Horizon II', artist: 'Event Horizon', cover: 'https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?q=80&w=1200&auto=format&fit=crop', url: 'https://cdn.pixabay.com/download/audio/2021/10/26/audio_2b53cdaef6.mp3?filename=cyber-groove-ambient-98938.mp3' },
    { id: 'demo-16', title: 'Photon Run', artist: 'Lightyear', cover: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop', url: 'https://cdn.pixabay.com/download/audio/2022/02/23/audio_812433a7d2.mp3?filename=ambient-chill-110200.mp3' },
    { id: 'demo-17', title: 'Neon City', artist: 'Metaverse 77', cover: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1200&auto=format&fit=crop', url: 'https://cdn.pixabay.com/download/audio/2021/09/08/audio_4cf7c9b327.mp3?filename=night-city-ambient-90850.mp3' },
    { id: 'demo-18', title: 'Crystal Bits', artist: 'Binary Bloom', cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop', url: 'https://cdn.pixabay.com/download/audio/2022/03/23/audio_4a19cc5bde.mp3?filename=ambient-111181.mp3' },
    { id: 'demo-19', title: 'Tidal Neon', artist: 'Sea of Bits', cover: 'https://images.unsplash.com/photo-1519923834699-ef0b7cde4712?q=80&w=1200&auto=format&fit=crop', url: 'https://cdn.pixabay.com/download/audio/2022/03/23/audio_ea46e3e500.mp3?filename=chill-111179.mp3' },
    { id: 'demo-20', title: 'Room Echo', artist: 'Resonance', cover: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1200&auto=format&fit=crop', url: 'https://cdn.pixabay.com/download/audio/2022/03/23/audio_92d78a1d3834.mp3?filename=soft-ambient-111178.mp3' }
];

async function fetchPlaylistFromiTunes() {
		try {
            const rssUrl = 'https://itunes.apple.com/us/rss/topsongs/limit=20/json';
			const res = await fetch(rssUrl);
			const data = await res.json();
			const entries = (data && data.feed && data.feed.entry) ? data.feed.entry : [];
			const base = entries.map((e, i) => {
				const title = (e && e['im:name'] && e['im:name'].label) || (e && e.title && e.title.label) || 'Unknown';
				const artist = (e && e['im:artist'] && e['im:artist'].label) || 'Unknown';
				let cover = (e && e['im:image'] && e['im:image'].length) ? e['im:image'][e['im:image'].length - 1].label : '';
				cover = cover ? cover.replace('100x100', '600x600') : cover;
				return { id: `rss-${i}`, title, artist, cover };
			});
            const withPreview = await Promise.all(base.map(async (t) => {
				try {
					const q = encodeURIComponent(`${t.artist} ${t.title}`);
					const sRes = await fetch(`https://itunes.apple.com/search?media=music&entity=song&limit=1&term=${q}`);
					const sData = await sRes.json();
					const r = sData.results && sData.results[0];
					return {
						...t,
						url: r && r.previewUrl ? r.previewUrl : null,
						cover: (r && r.artworkUrl100) ? r.artworkUrl100.replace('100x100', '600x600') : t.cover
					};
				} catch { return { ...t, url: null }; }
            }));
            // keep only items with previewUrl
            playlist = withPreview.filter(Boolean).filter(t => !!t.url);
		} catch {
			playlist = [];
		}
	}

	let currentIndex = 0;
	let isPlaying = false;

	// Build market grid
	function renderMarket() {
		marketGrid.innerHTML = '';
		if (!playlist.length) {
			const empty = document.createElement('div');
			empty.className = 'about-card glass';
			empty.textContent = 'No tracks available yet.';
			marketGrid.appendChild(empty);
			return;
		}
		playlist.forEach((t, idx) => {
			const card = document.createElement('div');
			card.className = 'card';
			card.innerHTML = `
				<span class="badge">#${idx + 1}</span>
				<img src="${t.cover}" alt="${t.title}"/>
				<div class="info">
					<p class="title">${t.title}</p>
					<p class="artist">${t.artist}</p>
				</div>
			`;
			card.addEventListener('click', () => {
				loadTrack(idx);
				if (playlist[idx] && playlist[idx].url) play();
			});
			marketGrid.appendChild(card);
		});
	}

	function renderSideLists() {
		const buildItem = (t, idx) => {
			const li = document.createElement('li');
			li.className = 'track-item';
			li.innerHTML = `
				<img src="${t.cover}" alt="${t.title}">
				<div>
					<p class="t-title">${t.title}</p>
					<p class="t-artist">${t.artist}</p>
				</div>
				<span class="t-time">${formatTime(Math.random()*240+120)}</span>
			`;
			li.addEventListener('click', () => { loadTrack(idx); if (playlist[idx]?.url) play(); });
			return li;
		};
		if (listLeft) listLeft.innerHTML = '';
		if (listRight) listRight.innerHTML = '';
		if (!playlist.length) {
			if (listLeft) listLeft.innerHTML = '<li class="track-item">No tracks</li>';
			if (listRight) listRight.innerHTML = '<li class="track-item">No tracks</li>';
			return;
		}
		// Fill Trending (left) with all tracks; right list is not used now
		playlist.forEach((t, i) => { if (listLeft) listLeft.appendChild(buildItem(t, i)); });
		// If a secondary list exists in DOM, fill remainder as a bonus
		if (listRight) {
			playlist.slice(5, 10).forEach((t, i) => listRight.appendChild(buildItem(t, i + 5)));
		}
	}

    function loadTrack(index) {
		if (!playlist.length) return;
		const t = playlist[index];
		if (!t) return;
		currentIndex = index;
		titleEl.textContent = t.title;
		artistEl.textContent = t.artist;
		coverEl.src = t.cover;
        audio.src = t.url || '';
        audio.load();
		updateRWA(t, index);
		// Reset seek while metadata loads
		seek.value = 0;
		currentTimeEl.textContent = '0:00';
		durationEl.textContent = '0:00';
	}

	function updateRWA(t, index) {
		// Mock RWA metadata for demo
		// generate a short 0x... hash style
		const raw = `${t.title}-${index}-${Date.now()}`;
		const base = btoa(raw).replace(/[^a-zA-Z0-9]/g, '');
		const mockHash = `0x${base.slice(0, 6)}...${base.slice(-6)}`;
		rwa.cover.src = t.cover;
		rwa.hash.textContent = mockHash;
		rwa.proof.href = '#';
		rwa.shares.textContent = '100,000';
		rwa.min.textContent = '100';
		rwa.sold.textContent = `${Math.floor(Math.random()*80000)+12000}`;
		rwa.price.textContent = '0.50 Cadenza / share';
		rwa.apr.textContent = `${(Math.random()*8+6).toFixed(2)}%`;
		rwa.cycle.textContent = 'Monthly Payout';
		rwa.issuer.textContent = 'Cadenza Music LLC';
		rwa.contract.textContent = '0xabc...cdef12';
	}

    async function play() {
        if (!audio.src) return;
        if (audioCtx && audioCtx.state === 'suspended') {
            try { await audioCtx.resume(); } catch {}
        }
        audio.play().then(() => {
            isPlaying = true;
            syncPlayIcons();
            coverEl.classList.add('spin');
        }).catch((err) => { console.warn('play() blocked or failed', err); });
	}
    function syncPlayIcons() { playIcon.textContent = isPlaying ? '⏸' : '▶'; const ic2 = document.getElementById('play-icon-2'); if (ic2) ic2.textContent = isPlaying ? '⏸' : '▶'; }
    function pause() { audio.pause(); isPlaying = false; syncPlayIcons(); coverEl.classList.remove('spin'); }

    playBtn.addEventListener('click', () => { isPlaying ? pause() : play(); });
    const playBtn2 = document.getElementById('btn-play-2');
    if (playBtn2) playBtn2.addEventListener('click', () => { isPlaying ? pause() : play(); });
	prevBtns.filter(Boolean).forEach(b => b.addEventListener('click', prev));
	nextBtns.filter(Boolean).forEach(b => b.addEventListener('click', next));

	function prev() { if (!playlist.length) return; loadTrack((currentIndex - 1 + playlist.length) % playlist.length); if (playlist[currentIndex]?.url) play(); }
	function next() { if (!playlist.length) return; loadTrack((currentIndex + 1) % playlist.length); if (playlist[currentIndex]?.url) play(); }

	// Seek & time update
	audio.addEventListener('timeupdate', () => {
		if (!audio.duration) return;
		seek.value = String((audio.currentTime / audio.duration) * 100);
		currentTimeEl.textContent = formatTime(audio.currentTime);
		durationEl.textContent = formatTime(audio.duration);
		updateRing();
	});
	seek.addEventListener('input', () => {
		if (!audio.duration) return;
		audio.currentTime = (parseFloat(seek.value) / 100) * audio.duration;
		updateRing();
	});

	// Volume
	volumeEl.addEventListener('input', () => { audio.volume = parseFloat(volumeEl.value); });

	// Autoplay next
	audio.addEventListener('ended', next);

	function formatTime(sec) {
		const m = Math.floor(sec / 60) || 0;
		const s = Math.floor(sec % 60) || 0;
		return `${m}:${s.toString().padStart(2, '0')}`;
	}

	// Circular progress ring
	const CIRCUMFERENCE = 2 * Math.PI * 54; // r=54, same as CSS stroke-dasharray
	function updateRing() {
		if (!progressRing || !audio.duration) return;
		const pct = audio.currentTime / audio.duration;
		const offset = CIRCUMFERENCE * (1 - pct);
		progressRing.style.strokeDashoffset = String(offset);
	}

	// WebAudio spectrum visualizer
    let analyser, dataArray, ctx, audioCtx;
	function initVisualizer() {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioCtx();
        const source = audioCtx.createMediaElementSource(audio);
        analyser = audioCtx.createAnalyser();
		analyser.fftSize = 2048;
		const bufferLength = analyser.frequencyBinCount;
		dataArray = new Uint8Array(bufferLength);
		source.connect(analyser);
        analyser.connect(audioCtx.destination);
		ctx = spectrumCanvas.getContext('2d');
		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);
		requestAnimationFrame(drawSpectrum);
	}

	function resizeCanvas() {
		spectrumCanvas.width = spectrumCanvas.clientWidth;
	}

	function drawSpectrum() {
		if (!ctx || !analyser) return;
		analyser.getByteFrequencyData(dataArray);
		const W = spectrumCanvas.width;
		const H = spectrumCanvas.height;
		ctx.clearRect(0, 0, W, H);
		const bars = 80;
		const step = Math.floor(dataArray.length / bars);
		for (let i = 0; i < bars; i++) {
			const v = dataArray[i * step] / 255; // 0..1
			const x = (W / bars) * i + 2;
			const h = Math.max(2, v * H);
			const y = H - h;
			const grad = ctx.createLinearGradient(0, y, 0, H);
			grad.addColorStop(0, '#6ae3ff');
			grad.addColorStop(1, '#8a7dff');
			ctx.fillStyle = grad;
			ctx.fillRect(x, y, (W / bars) - 4, h);
		}
		requestAnimationFrame(drawSpectrum);
	}

	// Initialize
    (async function init() {
		await fetchPlaylistFromiTunes();
		if (!playlist.length) {
			console.warn('iTunes RSS unavailable or blocked. Fallback playlist is used.');
			playlist = fallbackPlaylist;
		}
		renderMarket();
		renderSideLists();
        if (playlist.length) loadTrack(0);
		initVisualizer();

		// Upload interactions (lightweight; back-end integration TBD)
		const statusEl = document.getElementById('upload-status');
		const form = document.getElementById('upload-form');
		const audioInput = document.getElementById('file-audio');
		const proofInput = document.getElementById('file-proof');
		const artistInput = document.getElementById('up-artist');
		const titleInput = document.getElementById('up-title');
		const submitBtn = document.getElementById('btn-submit-upload');
		const preview = document.getElementById('upload-preview');
		const emailInput = document.getElementById('up-email');
		const modal = document.getElementById('submit-modal');
		const modalText = document.getElementById('modal-text');
		const errEmail = document.getElementById('err-email');
		function setStatus(msg, ok=false) {
			if (!statusEl) return; statusEl.textContent = msg; statusEl.style.color = ok ? '#6ae3ff' : '#9ab0cc';
		}
		function bindDrop(id, input) {
			const el = document.getElementById(id);
			if (!el || !input) return;
			['dragenter','dragover'].forEach(evt => el.addEventListener(evt, e=>{ e.preventDefault(); el.style.boxShadow='0 0 0 1px rgba(106,227,255,.45) inset'; console.log('[upload] drag over', id); }));
			['dragleave','drop'].forEach(evt => el.addEventListener(evt, e=>{ e.preventDefault(); el.style.boxShadow='none'; }));
			el.addEventListener('drop', (e)=>{ const f = e.dataTransfer?.files?.[0]; if (f) { input.files = e.dataTransfer.files; setStatus('File selected: '+ f.name); console.log('[upload] drop', id, f); renderPreview(); }});
		}

		function renderPreview() {
			if (!preview) return;
			const audioFile = audioInput?.files?.[0];
			const proofFile = proofInput?.files?.[0];
			preview.innerHTML = '';
			if (audioFile) preview.innerHTML += `<div class="row"><span>Audio</span><span>${audioFile.name} (${(audioFile.size/1024/1024).toFixed(2)} MB)</span></div>`;
			if (proofFile) preview.innerHTML += `<div class="row"><span>Proof</span><span>${proofFile.name} (${(proofFile.size/1024/1024).toFixed(2)} MB)</span></div>`;
			console.log('[upload] preview', { audio: audioFile, proof: proofFile });
		}

		[audioInput, proofInput].forEach(inp => inp && inp.addEventListener('change', renderPreview));
		bindDrop('drop-audio', audioInput);
		bindDrop('drop-proof', proofInput);
		if (form && submitBtn) {
				submitBtn.addEventListener('click', async ()=>{
					console.log('[upload] submit click');
					const email = (emailInput?.value || '').trim();
					const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
					if (!emailOk) {
						if (errEmail) errEmail.textContent = 'Please enter a valid email.';
					}
					if (!artistInput?.value || !titleInput?.value || !audioInput?.files?.length || !proofInput?.files?.length || !emailOk) {
						setStatus('Please complete all required fields.');
						console.warn('[upload] validation failed', {
							artist: artistInput?.value,
							title: titleInput?.value,
							audio: audioInput?.files?.[0],
							proof: proofInput?.files?.[0],
							email,
							emailOk
						});
						return;
				}
					if (errEmail) errEmail.textContent = '';
					setStatus('Submitting for review...');
					console.log('[upload] submitting', {
						artist: artistInput.value,
						title: titleInput.value,
						audio: audioInput.files[0],
						proof: proofInput.files[0],
						email: emailInput.value
					});
					if (modal) { modal.classList.remove('hidden'); if (modalText) modalText.textContent = 'Submitting...'; }
				await new Promise(r=>setTimeout(r, 1200));
					setStatus('Submitted. Our team will review your submission.', true);
					if (modal && modalText) { modalText.textContent = 'Submitted to official review. Please check your email for updates.'; setTimeout(()=>{ modal.classList.add('hidden'); }, 1400); }
					console.log('[upload] submitted ok');
			});
		}

		// Community section mock data (10 items -> 2 rows)
		const communityGrid = document.getElementById('community-grid');
		if (communityGrid) {
			const stages = ['Review', 'Settlement', 'Notice', 'Sale', 'Payout'];
			// generate more diverse English titles
			const wordsA = ['Neon','Crystal','Midnight','Orbit','Quantum','Lunar','Holo','Binary','Fractal','Eventide','Nova','Echo','Spectrum','Velvet','Aurora'];
			const wordsB = ['Voyage','Echoes','Run','Dreams','Bloom','Tide','Drift','Sky','Garden','Pulse','Circuit','Waves','Horizon','Flux','Canvas'];
			const tags = ['Remix','Live','Extended','Acoustic','Edit'];
			function randomChoice(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
			function generateTitle(i){
				const style = i % 5;
				const a = randomChoice(wordsA);
				const b = randomChoice(wordsB);
				const sep = style === 0 ? ' ' : style === 1 ? ' - ' : style === 2 ? ': ' : style === 3 ? ' · ' : ' ';
				let t = `${a}${sep}${b}`;
				if (Math.random() < 0.35) t += ` (${randomChoice(tags)})`;
				return t;
			}
			const items = Array.from({ length: 10 }).map((_, i) => ({
				title: generateTitle(i),
				uploader: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 10)}`,
				stage: stages[i % stages.length]
			}));
			communityGrid.innerHTML = '';
			items.forEach((it, idx) => {
				const div = document.createElement('div');
				div.className = 'c-card';
				div.innerHTML = `
					<img src="./hj.png" alt="cover ${idx}">
					<div class="c-info">
						<p class="c-title">${it.title}</p>
						<p class="c-uploader">Uploader: ${it.uploader}</p>
						<span class="c-stage">${it.stage}</span>
					</div>
				`;
				communityGrid.appendChild(div);
			});
		}
	})();
})();


