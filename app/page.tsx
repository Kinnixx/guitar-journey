"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

type IconName =
  | "home" | "music" | "clock" | "chart" | "flame" | "plus" | "play"
  | "chevron" | "calendar" | "target" | "spark" | "close" | "edit"
  | "trash" | "check" | "note" | "speed";

type Song = {
  id: number;
  title: string;
  artist: string;
  progress: number;
  bpm: number;
  goal: number;
  color: string;
  last: string;
};

type Session = {
  id: number;
  date: string;
  songId: number;
  duration: number;
  bpm: number;
  progress: number;
  motivation: number;
  notes: string;
};

const initialSongs: Song[] = [
  { id: 1, title: "The Man Who Sold The World", artist: "Nirvana", progress: 72, bpm: 80, goal: 92, color: "#f1ad5d", last: "Aujourd’hui" },
  { id: 2, title: "For Whom the Bell Tolls", artist: "Metallica", progress: 46, bpm: 72, goal: 118, color: "#6db493", last: "Hier" },
  { id: 3, title: "Apache", artist: "The Shadows", progress: 88, bpm: 112, goal: 136, color: "#858bd5", last: "Il y a 3 jours" },
];

const initialSessions: Session[] = [
  { id: 1, date: "2026-07-30", songId: 1, duration: 20, bpm: 80, progress: 72, motivation: 9, notes: "Le riff est propre à 80 BPM. Encore quelques hésitations sur la transition." },
  { id: 2, date: "2026-07-29", songId: 2, duration: 40, bpm: 72, progress: 46, motivation: 8, notes: "Travail lent au métronome, placement plus naturel." },
  { id: 3, date: "2026-07-28", songId: 1, duration: 25, bpm: 76, progress: 68, motivation: 8, notes: "Bonne session courte. La mémoire musculaire revient." },
  { id: 4, date: "2026-07-26", songId: 3, duration: 45, bpm: 112, progress: 88, motivation: 9, notes: "Son clair et régulier, attention aux cordes parasites." },
  { id: 5, date: "2026-07-24", songId: 2, duration: 35, bpm: 68, progress: 41, motivation: 7, notes: "Accords stables, je peux accélérer légèrement la prochaine fois." },
];

const WEEKLY_GOAL_MINUTES = 180;

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCurrentWeekBounds(today = new Date()) {
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const daysSinceMonday = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - daysSinceMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return { monday: formatLocalDate(monday), sunday: formatLocalDate(sunday) };
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
    music: <><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    chart: <><path d="M4 19V9M10 19V5M16 19v-7M22 19V3" /></>,
    flame: <path d="M12 22c4 0 7-3 7-7 0-3-2-6-5-9 0 3-1 4-2 5 0-4-2-7-4-9 0 5-3 7-3 12 0 5 3 8 7 8Z" />,
    plus: <path d="M12 5v14M5 12h14" />,
    play: <path d="m9 7 8 5-8 5Z" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
    spark: <path d="m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4Z" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    edit: <><path d="m4 20 4-1 11-11-3-3L5 16Z" /><path d="m14 6 3 3" /></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13" /><path d="M10 11v5M14 11v5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    note: <><path d="M5 3h11l3 3v15H5Z" /><path d="M8 10h8M8 14h8M8 18h5" /></>,
    speed: <><path d="M4 17a8 8 0 1 1 16 0" /><path d="m12 17 4-6" /></>,
  };
  return (
    <svg aria-hidden="true" className="icon" fill="none" height={size} viewBox="0 0 24 24" width={size}>
      {paths[name]}
    </svg>
  );
}

function Cover({ song, large = false }: { song: Song; large?: boolean }) {
  const initials = song.title.split(" ").filter((word) => word.length > 2).slice(0, 2).map((word) => word[0]).join("");
  return <div className={large ? "mini-cover large-cover" : "mini-cover"} style={{ background: song.color }}>{initials}</div>;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(new Date(`${date}T12:00:00`));
}

function sortSessionsByMostRecent(sessions: Session[]) {
  return [...sessions].sort((first, second) =>
    second.date.localeCompare(first.date) || second.id - first.id
  );
}

function getSongsWithCurrentState(songs: Song[], sessions: Session[]) {
  const latestSessionBySong = new Map<number, Session>();

  sessions.forEach((session) => {
    const latest = latestSessionBySong.get(session.songId);
    if (!latest || session.date > latest.date || (session.date === latest.date && session.id > latest.id)) {
      latestSessionBySong.set(session.songId, session);
    }
  });

  return songs.map((song) => {
    const latest = latestSessionBySong.get(song.id);
    return latest
      ? { ...song, bpm: latest.bpm, progress: latest.progress, last: formatDate(latest.date) }
      : song;
  });
}

function getCalendarDay(date: string) {
  return Date.parse(`${date}T00:00:00Z`) / 86400000;
}

function calculateStreak(sessions: Session[], today = new Date()) {
  const todayDate = formatLocalDate(today);
  const unique = [...new Set(
    sessions.map((session) => session.date).filter((date) => date <= todayDate)
  )].sort().reverse();
  if (!unique.length) return 0;

  if (getCalendarDay(todayDate) - getCalendarDay(unique[0]) > 1) return 0;

  let streak = 1;
  for (let index = 1; index < unique.length; index += 1) {
    if (getCalendarDay(unique[index - 1]) - getCalendarDay(unique[index]) === 1) streak += 1;
    else break;
  }
  return streak;
}

export default function Home() {
  const [active, setActive] = useState("Vue d’ensemble");
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [sessionModal, setSessionModal] = useState(false);
  const [songModal, setSongModal] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState(1);
  const [toast, setToast] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const storedSongs = localStorage.getItem("guitarjourney-songs");
        const storedSessions = localStorage.getItem("guitarjourney-sessions");
        if (storedSongs) setSongs(JSON.parse(storedSongs));
        if (storedSessions) setSessions(JSON.parse(storedSessions));
      } catch {
        // Keep the demo journal when browser storage is unavailable.
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("guitarjourney-songs", JSON.stringify(songs));
      localStorage.setItem("guitarjourney-sessions", JSON.stringify(sessions));
    } catch {
      // The app remains usable for the current visit.
    }
  }, [hydrated, songs, sessions]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);
  const weeklyMinutes = useMemo(() => {
    const { monday, sunday } = getCurrentWeekBounds();
    return sessions
      .filter((session) => session.date >= monday && session.date <= sunday)
      .reduce((sum, session) => sum + session.duration, 0);
  }, [sessions]);
  const currentSongs = useMemo(() => getSongsWithCurrentState(songs, sessions), [songs, sessions]);
  const averageProgress = currentSongs.length ? currentSongs.reduce((sum, song) => sum + song.progress, 0) / currentSongs.length : 0;
  const averageMotivation = sessions.length ? sessions.reduce((sum, session) => sum + session.motivation, 0) / sessions.length : 0;
  const streak = calculateStreak(sessions);
  const focusSong = currentSongs.find((song) => song.id === selectedSongId) ?? currentSongs[0];
  const sortedSessions = useMemo(() => sortSessionsByMostRecent(sessions), [sessions]);

  const weekly = useMemo(() => {
    const values = [35, 0, 45, 25, 40, 0, 20];
    return ["L", "M", "M", "J", "V", "S", "D"].map((day, index) => ({ day, value: values[index] }));
  }, []);

  const openSession = (songId = focusSong?.id ?? 1) => {
    setSelectedSongId(songId);
    setSessionModal(true);
  };

  const saveSession = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const songId = Number(form.get("songId"));
    const progress = Number(form.get("progress"));
    const bpm = Number(form.get("bpm"));
    const newSession: Session = {
      id: Date.now(),
      date: String(form.get("date")),
      songId,
      duration: Number(form.get("duration")),
      bpm,
      progress,
      motivation: Number(form.get("motivation")),
      notes: String(form.get("notes")),
    };
    setSessions((current) => [newSession, ...current]);
    setSessionModal(false);
    setToast("Session enregistrée — belle régularité !");
  };

  const saveSong = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const palette = ["#e8a14b", "#6db493", "#858bd5", "#dc8372"];
    const newSong: Song = {
      id: Date.now(),
      title: String(form.get("title")),
      artist: String(form.get("artist")),
      progress: Number(form.get("progress")),
      bpm: Number(form.get("bpm")),
      goal: Number(form.get("goal")),
      color: palette[songs.length % palette.length],
      last: "Pas encore travaillé",
    };
    setSongs((current) => [...current, newSong]);
    setSongModal(false);
    setToast(`${newSong.title} ajouté à ton parcours`);
  };

  const removeSong = (id: number) => {
    setSongs((current) => current.filter((song) => song.id !== id));
    setSessions((current) => current.filter((session) => session.songId !== id));
    setToast("Morceau retiré");
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><span /><span /><span /><span /><span /><span /></div>
          <span>Guitar<span>Journey</span></span>
        </div>
        <nav aria-label="Navigation principale">
          <p className="nav-label">Mon espace</p>
          {[
            ["Vue d’ensemble", "home"],
            ["Mes morceaux", "music"],
            ["Mes sessions", "clock"],
            ["Progression", "chart"],
          ].map(([label, icon]) => (
            <button className={active === label ? "nav-item active" : "nav-item"} key={label} onClick={() => setActive(label)}>
              <Icon name={icon as IconName} />{label}
            </button>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <div className="weekly-goal">
          <div className="goal-top"><span>Objectif semaine</span><strong>{weeklyMinutes} / {WEEKLY_GOAL_MINUTES} min</strong></div>
          <div className="goal-track"><span style={{ width: `${Math.min(100, (weeklyMinutes / WEEKLY_GOAL_MINUTES) * 100)}%` }} /></div>
          <p>{weeklyMinutes >= WEEKLY_GOAL_MINUTES ? "Objectif atteint. Tu peux être fière de toi." : `Plus que ${WEEKLY_GOAL_MINUTES - weeklyMinutes} minutes. Tu y es presque.`}</p>
        </div>
        <div className="profile"><div className="avatar">A</div><div><strong>Anaïs</strong><span>Guitariste en progression</span></div></div>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">JEUDI 30 JUILLET</p>
            <h1>{active === "Vue d’ensemble" ? <>Bonjour Anaïs <span>— prête à jouer ?</span></> : active}</h1>
          </div>
          <button className="primary-button" onClick={() => openSession()}><Icon name="plus" /> Nouvelle session</button>
        </header>

        {active === "Vue d’ensemble" && (
          <Dashboard
            averageMotivation={averageMotivation}
            averageProgress={averageProgress}
            focusSong={focusSong}
            onOpenSession={openSession}
            onViewSongs={() => setActive("Mes morceaux")}
            sessions={sessions}
            songs={currentSongs}
            streak={streak}
            totalMinutes={totalMinutes}
            weekly={weekly}
          />
        )}

        {active === "Mes morceaux" && (
          <SongsView songs={currentSongs} onAdd={() => setSongModal(true)} onPractice={openSession} onRemove={removeSong} />
        )}

        {active === "Mes sessions" && (
          <SessionsView sessions={sortedSessions} songs={currentSongs} streak={streak} onAdd={() => openSession()} />
        )}

        {active === "Progression" && (
          <ProgressView songs={currentSongs} sessions={sortedSessions} averageMotivation={averageMotivation} averageProgress={averageProgress} />
        )}
      </section>

      {sessionModal && focusSong && (
        <Modal title="Journal de session" subtitle="Note ce que tu as vraiment travaillé aujourd’hui." onClose={() => setSessionModal(false)}>
          <form className="form-grid" onSubmit={saveSession}>
            <label className="form-wide">Morceau
              <select name="songId" value={selectedSongId} onChange={(event) => setSelectedSongId(Number(event.target.value))}>
                {currentSongs.map((song) => <option key={song.id} value={song.id}>{song.title}</option>)}
              </select>
            </label>
            <label>Date<input required name="date" type="date" defaultValue="2026-07-30" /></label>
            <label>Durée (minutes)<input required min="1" name="duration" type="number" defaultValue="25" /></label>
            <label>Vitesse stable (BPM)<input required min="20" name="bpm" type="number" defaultValue={focusSong.bpm} /></label>
            <label>Progression (%)<input required min="0" max="100" name="progress" type="number" defaultValue={focusSong.progress} /></label>
            <label className="form-wide range-label">Motivation : <output id="motivation-value">8 / 10</output>
              <input aria-describedby="motivation-value" name="motivation" type="range" min="1" max="10" defaultValue="8" onInput={(event) => {
                const output = document.querySelector("#motivation-value");
                if (output) output.textContent = `${event.currentTarget.value} / 10`;
              }} />
            </label>
            <label className="form-wide">Notes de la session
              <textarea name="notes" placeholder="Ce qui est devenu plus fluide, ce qui bloque encore, quoi reprendre demain…" rows={4} />
            </label>
            <div className="form-actions form-wide"><button type="button" className="ghost-button" onClick={() => setSessionModal(false)}>Annuler</button><button className="primary-button" type="submit"><Icon name="check" /> Enregistrer</button></div>
          </form>
        </Modal>
      )}

      {songModal && (
        <Modal title="Ajouter un morceau" subtitle="Pose un point de départ réaliste, tu l’ajusteras en jouant." onClose={() => setSongModal(false)}>
          <form className="form-grid" onSubmit={saveSong}>
            <label className="form-wide">Titre<input required name="title" placeholder="Ex. Nothing Else Matters" /></label>
            <label className="form-wide">Artiste<input required name="artist" placeholder="Ex. Metallica" /></label>
            <label>Progression actuelle (%)<input required min="0" max="100" name="progress" type="number" defaultValue="0" /></label>
            <label>Vitesse actuelle (BPM)<input required min="20" name="bpm" type="number" defaultValue="60" /></label>
            <label className="form-wide">Vitesse cible (BPM)<input required min="20" name="goal" type="number" defaultValue="100" /></label>
            <div className="form-actions form-wide"><button type="button" className="ghost-button" onClick={() => setSongModal(false)}>Annuler</button><button className="primary-button" type="submit"><Icon name="plus" /> Ajouter</button></div>
          </form>
        </Modal>
      )}

      {toast && <div className="toast" role="status"><Icon name="check" />{toast}</div>}
    </main>
  );
}

function Dashboard({ songs, sessions, focusSong, streak, totalMinutes, averageProgress, averageMotivation, weekly, onOpenSession, onViewSongs }: {
  songs: Song[]; sessions: Session[]; focusSong?: Song; streak: number; totalMinutes: number; averageProgress: number;
  averageMotivation: number; weekly: { day: string; value: number }[]; onOpenSession: (songId?: number) => void; onViewSongs: () => void;
}) {
  if (!focusSong) return <EmptyState icon="music" title="Ajoute ton premier morceau" copy="Ton parcours commencera ici." />;
  return <>
    <section className="hero-grid">
      <article className="practice-card">
        <div className="practice-copy">
          <p className="section-kicker"><Icon name="spark" size={15} /> SESSION CONSEILLÉE</p>
          <h2>Continue là où<br />tu t’es arrêtée.</h2>
          <div className="song-line"><Cover song={focusSong} /><div><strong>{focusSong.title}</strong><span>Objectif : passer proprement à {Math.min(focusSong.goal, focusSong.bpm + 4)} BPM</span></div></div>
          <button className="start-button" onClick={() => onOpenSession(focusSong.id)}><Icon name="play" /> Commencer ma session</button>
        </div>
        <div className="tempo-visual" aria-label={`Tempo actuel : ${focusSong.bpm} BPM`}><div className="tempo-ring"><span className="tempo-dot" /><strong>{focusSong.bpm}</strong><small>BPM</small></div><span>Dernière vitesse stable</span></div>
      </article>
      <aside className="streak-card">
        <div className="streak-icon"><Icon name="flame" size={24} /></div><p>SÉRIE ACTUELLE</p><div className="streak-number">{streak} <span>jours</span></div>
        <p className="streak-copy">{streak ? "Une petite session suffit pour entretenir ta dynamique." : "Joue aujourd’hui pour lancer une nouvelle série."}</p>
        <div className="streak-days" aria-label="Série de pratique sur sept jours">
          {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => <div key={`${day}-${index}`} className={index >= 2 && index <= 4 ? (index === 4 ? "today" : "done") : ""}><span>{index >= 2 && index <= 4 ? "✓" : ""}</span><small>{day}</small></div>)}
        </div>
      </aside>
    </section>
    <section className="stats-strip">
      <Stat icon="clock" tone="amber" label="Temps enregistré" value={`${Math.floor(totalMinutes / 60)} h ${totalMinutes % 60}`} detail={`${sessions.length} sessions au total`} />
      <Stat icon="calendar" tone="green" label="Sessions" value={String(sessions.length)} detail="la régularité compte" />
      <Stat icon="target" tone="violet" label="Maîtrise moyenne" value={`${averageProgress.toFixed(0)} %`} detail="sur les morceaux actifs" />
      <Stat icon="spark" tone="coral" label="Motivation moyenne" value={`${averageMotivation.toFixed(1)} / 10`} detail="ta dynamique actuelle" />
    </section>
    <section className="lower-grid">
      <article className="panel songs-panel">
        <div className="panel-heading"><div><p>EN COURS</p><h2>Mes morceaux</h2></div><button onClick={onViewSongs}>Tout voir <Icon name="chevron" size={16} /></button></div>
        <div className="song-list">{songs.slice(0, 3).map((song) => <button className="song-row" key={song.id} onClick={() => onOpenSession(song.id)}><Cover song={song} /><div className="song-meta"><strong>{song.title}</strong><span>{song.artist} · {song.last}</span></div><div className="song-progress"><span><b>{song.progress}%</b> maîtrisé</span><div><i style={{ background: song.color, width: `${song.progress}%` }} /></div></div><div className="bpm"><strong>{song.bpm}</strong><span>/ {song.goal} BPM</span></div><Icon name="chevron" size={18} /></button>)}</div>
      </article>
      <article className="panel chart-panel">
        <div className="panel-heading"><div><p>RYTHME</p><h2>Cette semaine</h2></div><span className="trend">↗ 18%</span></div>
        <WeekChart weekly={weekly} />
        <div className="chart-note"><span><Icon name="spark" size={14} /></span><p><strong>Tu pratiques mieux, pas seulement plus.</strong>Tes sessions courtes sont plus régulières cette semaine.</p></div>
      </article>
    </section>
    <footer className="mantra"><span>“</span><p>La vitesse vient après la propreté.<small>Ton objectif du moment</small></p></footer>
  </>;
}

function Stat({ icon, tone, label, value, detail }: { icon: IconName; tone: string; label: string; value: string; detail: string }) {
  return <div><span className={`stat-icon ${tone}`}><Icon name={icon} /></span><p>{label}<strong>{value}</strong><small>{detail}</small></p></div>;
}

function WeekChart({ weekly }: { weekly: { day: string; value: number }[] }) {
  return <div className="chart"><div className="axis"><span>45</span><span>30</span><span>15</span><span>0</span></div><div className="bars">{weekly.map((day, index) => <div className="bar-column" key={`${day.day}-${index}`}><div className="bar-space"><span className={index === 6 ? "current" : ""} style={{ height: `${(day.value / 45) * 100}%` }}>{day.value ? <b>{day.value}</b> : null}</span></div><small>{day.day}</small></div>)}</div></div>;
}

function SongsView({ songs, onAdd, onPractice, onRemove }: { songs: Song[]; onAdd: () => void; onPractice: (id: number) => void; onRemove: (id: number) => void }) {
  return <section className="view-page">
    <div className="view-intro"><div><p className="eyebrow">RÉPERTOIRE ACTIF</p><h2>Les morceaux que tu construis,<br />une mesure après l’autre.</h2><span>Chaque vitesse affichée est une vitesse propre et stable — jamais une course.</span></div><button className="secondary-button" onClick={onAdd}><Icon name="plus" /> Ajouter un morceau</button></div>
    {songs.length ? <div className="song-card-grid">{songs.map((song) => <article className="journey-card" key={song.id}>
      <div className="journey-top"><Cover song={song} large /><div className="card-actions"><button aria-label={`Supprimer ${song.title}`} onClick={() => onRemove(song.id)}><Icon name="trash" size={16} /></button></div></div>
      <p>{song.artist.toUpperCase()}</p><h3>{song.title}</h3>
      <div className="mastery"><span>Maîtrise actuelle <strong>{song.progress}%</strong></span><div><i style={{ background: song.color, width: `${song.progress}%` }} /></div></div>
      <div className="tempo-line"><span><Icon name="speed" />Vitesse stable</span><strong>{song.bpm} <small>/ {song.goal} BPM</small></strong></div>
      <button className="practice-link" onClick={() => onPractice(song.id)}><Icon name="play" size={15} /> Travailler ce morceau</button>
    </article>)}</div> : <EmptyState icon="music" title="Ton répertoire est vide" copy="Ajoute un premier morceau pour commencer à suivre ta progression." action={onAdd} />}
  </section>;
}

function SessionsView({ sessions, songs, streak, onAdd }: { sessions: Session[]; songs: Song[]; streak: number; onAdd: () => void }) {
  return <section className="view-page">
    <div className="view-intro compact-intro"><div><p className="eyebrow">JOURNAL DE PRATIQUE</p><h2>Ce que tu as vraiment joué.</h2><span>Un historique concret pour voir le chemin parcouru, même les jours où tu en doutes.</span></div></div>
    <div className="session-layout">
      <article className="panel session-history"><div className="panel-heading"><div><p>HISTORIQUE</p><h2>{sessions.length} sessions enregistrées</h2></div><button className="small-action" onClick={onAdd}><Icon name="plus" size={15} /> Ajouter</button></div>
        <div className="timeline">{sessions.map((session) => {
          const song = songs.find((item) => item.id === session.songId);
          if (!song) return null;
          return <div className="timeline-row" key={session.id}><div className="timeline-date"><strong>{formatDate(session.date).split(" ")[0]}</strong><span>{formatDate(session.date).split(" ")[1]}</span></div><Cover song={song} /><div className="timeline-main"><strong>{song.title}</strong><span>{session.notes || "Session enregistrée sans note."}</span></div><div className="session-metrics"><span><Icon name="clock" size={14} />{session.duration} min</span><span><Icon name="speed" size={14} />{session.bpm} BPM</span><span><Icon name="spark" size={14} />{session.motivation}/10</span></div></div>;
        })}</div>
      </article>
      <aside className="session-aside">
        <article className="streak-summary"><Icon name="flame" size={26} /><p>SÉRIE EN COURS</p><strong>{streak}</strong><span>jours de pratique consécutifs</span><small>Ton record personnel est de 7 jours.</small></article>
        <article className="panel tiny-motivation"><p>RAPPEL</p><h3>Une session de 10 minutes compte.</h3><span>La régularité construit les automatismes que les longues sessions isolées ne peuvent pas remplacer.</span></article>
      </aside>
    </div>
  </section>;
}

function ProgressView({ songs, sessions, averageMotivation, averageProgress }: { songs: Song[]; sessions: Session[]; averageMotivation: number; averageProgress: number }) {
  const heat = [0,1,2,1,0,0,2,3,1,0,2,3,3,0,1,2,4,3,0,0,1,2,2,4,3,1,0,2,3,4,1,0,2,3,2];
  return <section className="view-page">
    <div className="view-intro compact-intro"><div><p className="eyebrow">TA PROGRESSION</p><h2>Les petits gains deviennent visibles.</h2><span>Vitesse, maîtrise, régularité et ressenti : quatre façons de mesurer un vrai progrès.</span></div></div>
    <section className="progress-hero">
      <div><p>MAÎTRISE MOYENNE</p><strong>{averageProgress.toFixed(0)}<small>%</small></strong><span>+4,2 % sur les 30 derniers jours</span></div>
      <div className="progress-comparison">{songs.map((song) => <div key={song.id}><span>{song.title}<b>{song.progress}%</b></span><div><i style={{ background: song.color, width: `${song.progress}%` }} /></div><small>{song.bpm} BPM stable · cible {song.goal}</small></div>)}</div>
    </section>
    <section className="progress-grid">
      <article className="panel heat-panel"><div className="panel-heading"><div><p>RÉGULARITÉ</p><h2>35 derniers jours</h2></div><span>{sessions.length} sessions</span></div><div className="heat-map">{heat.map((level, index) => <i className={`heat-${level}`} key={index} title={`Jour ${index + 1} : intensité ${level}`} />)}</div><div className="heat-legend"><span>Moins</span>{[0,1,2,3,4].map((level) => <i className={`heat-${level}`} key={level} />)}<span>Plus</span></div></article>
      <article className="panel motivation-panel"><div className="panel-heading"><div><p>RESSENTI</p><h2>Motivation</h2></div><strong>{averageMotivation.toFixed(1)} / 10</strong></div><div className="motivation-line">{sessions.slice(0, 5).reverse().map((session, index) => <div key={session.id}><span style={{ height: `${session.motivation * 8}px` }}><i /></span><small>S{index + 1}</small></div>)}</div><p>Ta motivation reste stable, même avec des sessions de durée différente.</p></article>
    </section>
    <footer className="mantra progress-mantra"><span>“</span><p>Regarde la musicienne que tu étais il y a un mois.<small>Pas celle que tu imagines devoir déjà être</small></p></footer>
  </section>;
}

function EmptyState({ icon, title, copy, action }: { icon: IconName; title: string; copy: string; action?: () => void }) {
  return <div className="empty-state"><Icon name={icon} size={30} /><h3>{title}</h3><p>{copy}</p>{action && <button className="primary-button" onClick={action}><Icon name="plus" /> Ajouter</button>}</div>;
}

function Modal({ title, subtitle, onClose, children }: { title: string; subtitle: string; onClose: () => void; children: ReactNode }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section aria-modal="true" className="modal" role="dialog" aria-labelledby="modal-title">
      <div className="modal-heading"><div><p className="eyebrow">GUITARJOURNEY</p><h2 id="modal-title">{title}</h2><span>{subtitle}</span></div><button aria-label="Fermer" onClick={onClose}><Icon name="close" /></button></div>
      {children}
    </section>
  </div>;
}
