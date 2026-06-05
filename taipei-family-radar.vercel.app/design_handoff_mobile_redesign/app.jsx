/* 親子活動雷達 — Direction A, full app (window.TFRApp)
 * Screens: 今天(home) · 月曆(calendar) · 全部(all+filters) · 關於(about) · 活動詳情(detail)
 */
(function () {
  const T = window.TFR;
  const C = {
    bg: "#fbfaf7", surface: "#ffffff", border: "#ece7de",
    primary: "#1f8a70", primaryDark: "#156a55", accent: "#f2994a",
    text: "#1f2421", sec: "#5e6b64", soft: "#f3efe7",
  };
  const catTint = {
    music: "#fde9d6", dance: "#f6e2ef", performance: "#e7ecfa", competition: "#fcecd0",
    film: "#e6eef0", workshop: "#e6f2ec", market: "#f3ecdd", festival: "#fbe6e1",
    exhibition: "#eceaf4", other: "#eef0ee",
  };
  const e = React.createElement;

  // ── primitives ─────────────────────────────────────────────
  function StreamDot({ s }) {
    const st = T.STREAM[s];
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: st.color }}>
        <span style={{ width: 7, height: 7, borderRadius: 99, background: st.color }} />{st.label}
      </span>
    );
  }
  function AgeBadge({ f }) {
    const a = T.AGEFIT[f];
    return <span style={{ fontSize: 11.5, fontWeight: 700, color: a.color, background: a.bg, padding: "2px 8px", borderRadius: 99 }}>{f === "great" ? "👶 很適合" : a.label}</span>;
  }
  function FreeBadge() {
    return <span style={{ fontSize: 11.5, fontWeight: 700, color: C.primaryDark, background: "#e6f4ef", padding: "2px 8px", borderRadius: 99 }}>免費</span>;
  }
  function Tile({ ev, size = 56 }) {
    return <div style={{ width: size, height: size, borderRadius: 14, background: catTint[ev.category] || C.soft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.42, flexShrink: 0 }}>{T.CATEGORY[ev.category].emoji}</div>;
  }
  function Card({ ev, onTap, highlight }) {
    return (
      <button onClick={() => onTap(ev)} style={{ all: "unset", cursor: "pointer", display: "flex", gap: 12, width: "100%", boxSizing: "border-box", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 14, boxShadow: "0 1px 2px rgba(31,36,33,0.04)", position: "relative", overflow: "hidden" }}>
        {highlight && <span style={{ position: "absolute", insetBlock: 0, left: 0, width: 6, background: C.accent }} />}
        <Tile ev={ev} size={highlight ? 64 : 56} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <StreamDot s={ev.stream} /><span style={{ fontSize: 12, color: C.sec }}>· {T.CATEGORY[ev.category].label}</span>
          </div>
          <div style={{ fontSize: 15.5, fontWeight: 800, color: C.text, lineHeight: 1.35, letterSpacing: -0.2 }}>{ev.title}</div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 8px", marginTop: 7, fontSize: 13, color: C.sec }}>
            <span style={{ fontWeight: 700, color: C.text }}>{ev.venue}</span><span>·</span>
            <span>{T.fmtRange(ev.startDate, ev.endDate)}{ev.startTime ? ` ${ev.startTime}` : ""}</span>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 9 }}><AgeBadge f={ev.ageFit} />{ev.isFree && <FreeBadge />}</div>
        </div>
      </button>
    );
  }
  function SectionTitle({ icon, children, right }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 12px" }}>
        {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: C.text }}>{children}</h2>
        {right && <span style={{ marginLeft: "auto", fontSize: 12.5, fontWeight: 700, color: C.sec }}>{right}</span>}
      </div>
    );
  }

  // ── Home ───────────────────────────────────────────────────
  function Home({ onTap }) {
    const hi = T.highlights();
    const hiIds = new Set(hi.map((x) => x.id));
    const rest = T.upcoming().filter((x) => !hiIds.has(x.id));
    const thisWeek = T.upcoming().filter((x) => T.isThisWeek(x.startDate)).length;
    return (
      <div style={{ padding: "8px 18px 24px" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.primary, letterSpacing: 0.3 }}>本週精選 · 第 {T.digest.weekNo} 週</div>
        <h1 style={{ margin: "4px 0 0", fontSize: 27, fontWeight: 900, color: C.text, lineHeight: 1.18, letterSpacing: -0.5 }}>{T.digest.title}</h1>
        <div style={{ marginTop: 12, background: "linear-gradient(180deg,#ffffff,#fdfbf6)", border: `1px solid ${C.border}`, borderRadius: 18, padding: 15 }}>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.75, color: C.sec }}>{T.digest.intro}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 12, fontSize: 12.5, color: C.sec, fontWeight: 600 }}>
            <span>📍 台北・新北・基隆</span>
            <span>🗓️ 本週 <b style={{ color: C.text }}>{thisWeek}</b> ／ 共 <b style={{ color: C.text }}>{T.upcoming().length}</b> 個</span>
          </div>
        </div>
        <div style={{ height: 24 }} />
        <SectionTitle icon="⭐">本週首推</SectionTitle>
        <div style={{ display: "grid", gap: 11 }}>{hi.map((ev) => <Card key={ev.id} ev={ev} onTap={onTap} highlight />)}</div>
        <div style={{ height: 26 }} />
        <SectionTitle>其他即將到來</SectionTitle>
        <div style={{ display: "grid", gap: 11 }}>{rest.map((ev) => <Card key={ev.id} ev={ev} onTap={onTap} />)}</div>
      </div>
    );
  }

  // ── Calendar ───────────────────────────────────────────────
  const MONTHS = [{ y: 2026, m: 5 }, { y: 2026, m: 6 }, { y: 2026, m: 7 }];
  function Calendar({ onTap, layer }) {
    const [mi, setMi] = React.useState(0);
    const [sel, setSel] = React.useState(null);
    const { y: year, m: month0 } = MONTHS[mi];
    const map = T.monthMap(year, month0);
    const first = new Date(year, month0, 1).getDay();
    const days = new Date(year, month0 + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < first; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(d);
    const key = (d) => `${year}-${String(month0 + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const selEvents = sel ? T.onDate(sel) : [];
    React.useEffect(() => { setSel(null); }, [mi]);

    return (
      <div style={{ padding: "8px 16px 24px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 4px 14px" }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: C.text }}>{year} 年 {month0 + 1} 月</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setMi(Math.max(0, mi - 1))} style={{ all: "unset", cursor: mi > 0 ? "pointer" : "default", width: 32, height: 32, borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`, display: "grid", placeItems: "center", color: mi > 0 ? C.sec : "#cfc9bf" }}>‹</button>
            <button onClick={() => setMi(Math.min(MONTHS.length - 1, mi + 1))} style={{ all: "unset", cursor: mi < MONTHS.length - 1 ? "pointer" : "default", width: 32, height: 32, borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`, display: "grid", placeItems: "center", color: mi < MONTHS.length - 1 ? C.sec : "#cfc9bf" }}>›</button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", textAlign: "center", fontSize: 12, fontWeight: 700, color: C.sec, marginBottom: 6 }}>
          {T.WD1.map((w, i) => <div key={i} style={{ color: i === 0 || i === 6 ? C.accent : C.sec }}>{w}</div>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const k = key(d);
            const evs = map[k] || [];
            const isToday = k === T.TODAY;
            const isSel = k === sel;
            const streams = [...new Set(evs.map((x) => x.stream))];
            return (
              <button key={i} onClick={() => evs.length && setSel(isSel ? null : k)} style={{ all: "unset", cursor: evs.length ? "pointer" : "default", aspectRatio: "1", borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, background: isSel ? C.primary : isToday ? "#e6f4ef" : evs.length ? C.surface : "transparent", border: `1px solid ${isSel ? C.primary : evs.length ? C.border : "transparent"}`, color: isSel ? "#fff" : isToday ? C.primaryDark : evs.length ? C.text : "#b3ada3" }}>
                <span style={{ fontSize: 14, fontWeight: isToday || isSel ? 900 : 600 }}>{d}</span>
                <span style={{ display: "flex", gap: 3, height: 6 }}>{streams.map((s) => <span key={s} style={{ width: 6, height: 6, borderRadius: 99, background: isSel ? "#fff" : T.STREAM[s].color }} />)}</span>
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 16, fontSize: 12, color: C.sec }}><StreamDot s="cultural" /><StreamDot s="outdoor" /></div>

        {sel && layer && ReactDOM.createPortal(
          <div style={{ position: "absolute", inset: 0, zIndex: 30, pointerEvents: "auto" }}>
            <div onClick={() => setSel(null)} style={{ position: "absolute", inset: 0, background: "rgba(31,36,33,0.28)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: C.bg, borderRadius: "22px 22px 0 0", padding: "10px 18px 28px", maxHeight: "78%", overflow: "auto", boxShadow: "0 -8px 30px rgba(0,0,0,0.16)" }}>
              <div style={{ width: 40, height: 5, borderRadius: 99, background: C.border, margin: "0 auto 14px" }} />
              <div style={{ fontWeight: 900, fontSize: 17, color: C.text, marginBottom: 2 }}>{month0 + 1} 月 {T.dayNum(sel)} 日 {T.weekday(sel)}</div>
              <div style={{ fontSize: 13, color: C.sec, marginBottom: 14 }}>{selEvents.length} 個活動</div>
              <div style={{ display: "grid", gap: 10 }}>{selEvents.map((ev) => <Card key={ev.id} ev={ev} onTap={onTap} />)}</div>
            </div>
          </div>, layer)}
      </div>
    );
  }

  // ── All events + filters ───────────────────────────────────
  const EMPTY = { stream: null, categories: [], freeOnly: false, weekendOnly: false, ageFit: null, city: null, district: null };
  function countActive(f) {
    return (f.stream ? 1 : 0) + f.categories.length + (f.freeOnly ? 1 : 0) + (f.weekendOnly ? 1 : 0) + (f.ageFit ? 1 : 0) + (f.city ? 1 : 0) + (f.district ? 1 : 0);
  }
  function Pill({ active, onClick, children }) {
    return (
      <button onClick={onClick} style={{ all: "unset", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 99, border: `1px solid ${active ? C.primary : C.border}`, background: active ? C.primary : C.surface, color: active ? "#fff" : C.sec, padding: "7px 13px", fontSize: 13.5, fontWeight: 700 }}>
        {active && <span style={{ fontSize: 11 }}>✓</span>}{children}
      </button>
    );
  }
  function FieldGroup({ label, children }) {
    return (
      <div>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.3, color: C.sec, marginBottom: 9 }}>{label}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{children}</div>
      </div>
    );
  }
  function AllEvents({ onTap, layer }) {
    const [f, setF] = React.useState(EMPTY);
    const [open, setOpen] = React.useState(false);
    const set = (patch) => setF({ ...f, ...patch });
    const cats = [...new Set(T.events.map((x) => x.category))];
    const districts = f.city ? [...new Set(T.events.filter((x) => T.parseArea(x.area).city === f.city).map((x) => T.parseArea(x.area).district))].filter(Boolean).sort() : [];
    const list = T.upcoming().filter((ev) => {
      if (f.stream && ev.stream !== f.stream) return false;
      if (f.categories.length && !f.categories.includes(ev.category)) return false;
      if (f.freeOnly && !ev.isFree) return false;
      if (f.weekendOnly && !T.isWeekend(ev.startDate)) return false;
      if (f.ageFit && ev.ageFit !== f.ageFit) return false;
      const pa = T.parseArea(ev.area);
      if (f.city && pa.city !== f.city) return false;
      if (f.district && pa.district !== f.district) return false;
      return true;
    });
    const active = countActive(f);
    const toggleCat = (c) => set({ categories: f.categories.includes(c) ? f.categories.filter((x) => x !== c) : [...f.categories, c] });

    return (
      <div style={{ padding: "8px 18px 24px", position: "relative" }}>
        <h1 style={{ margin: "2px 0 12px", fontSize: 22, fontWeight: 900, color: C.text }}>全部活動</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <button onClick={() => setOpen(true)} style={{ all: "unset", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7, borderRadius: 12, border: `1px solid ${active ? C.primary : C.border}`, background: C.surface, padding: "9px 14px", fontSize: 14, fontWeight: 800, color: active ? C.primary : C.text }}>
            <span>⚙︎</span>篩選
            {active > 0 && <span style={{ minWidth: 20, height: 20, borderRadius: 99, background: C.primary, color: "#fff", fontSize: 12, fontWeight: 800, display: "grid", placeItems: "center", padding: "0 4px" }}>{active}</span>}
          </button>
          {active > 0 && <button onClick={() => setF(EMPTY)} style={{ all: "unset", cursor: "pointer", fontSize: 13.5, fontWeight: 700, color: C.sec, whiteSpace: "nowrap", flexShrink: 0 }}>↺ 清除</button>}
          <span style={{ marginLeft: "auto", fontSize: 13, color: C.sec, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>{list.length} 個</span>
        </div>
        {list.length ? (
          <div style={{ display: "grid", gap: 11 }}>{list.map((ev) => <Card key={ev.id} ev={ev} onTap={onTap} />)}</div>
        ) : (
          <div style={{ textAlign: "center", padding: "50px 20px", color: C.sec }}>
            <div style={{ fontSize: 40 }}>🔍</div>
            <div style={{ marginTop: 10, fontSize: 14.5, fontWeight: 700, color: C.text }}>沒有符合的活動</div>
            <div style={{ marginTop: 4, fontSize: 13 }}>試著放寬篩選條件</div>
            <button onClick={() => setF(EMPTY)} style={{ all: "unset", cursor: "pointer", display: "inline-block", marginTop: 14, background: C.primary, color: "#fff", fontWeight: 800, fontSize: 14, padding: "10px 18px", borderRadius: 12 }}>清除篩選</button>
          </div>
        )}

        {open && layer && ReactDOM.createPortal(
          <div style={{ position: "absolute", inset: 0, zIndex: 40, pointerEvents: "auto" }}>
            <div onClick={() => setOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(31,36,33,0.32)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: C.bg, borderRadius: "24px 24px 0 0", maxHeight: "86%", overflow: "auto", boxShadow: "0 -8px 30px rgba(0,0,0,0.18)" }}>
              <div style={{ position: "sticky", top: 0, background: C.bg, padding: "12px 20px 6px", borderRadius: "24px 24px 0 0" }}>
                <div style={{ width: 40, height: 5, borderRadius: 99, background: C.border, margin: "0 auto 12px" }} />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: C.text }}>篩選活動</h3>
                  {active > 0 && <button onClick={() => setF(EMPTY)} style={{ all: "unset", cursor: "pointer", marginLeft: "auto", fontSize: 13.5, fontWeight: 700, color: C.sec }}>↺ 清除全部</button>}
                </div>
              </div>
              <div style={{ display: "grid", gap: 18, padding: "10px 20px 16px" }}>
                <FieldGroup label="利基">
                  <Pill active={!f.stream} onClick={() => set({ stream: null })}>全部</Pill>
                  {["cultural", "outdoor"].map((s) => <Pill key={s} active={f.stream === s} onClick={() => set({ stream: f.stream === s ? null : s })}>{T.STREAM[s].label}</Pill>)}
                </FieldGroup>
                <FieldGroup label="類型">
                  {cats.map((c) => <Pill key={c} active={f.categories.includes(c)} onClick={() => toggleCat(c)}>{T.CATEGORY[c].emoji} {T.CATEGORY[c].label}</Pill>)}
                </FieldGroup>
                <FieldGroup label="適合度">
                  <Pill active={!f.ageFit} onClick={() => set({ ageFit: null })}>全部</Pill>
                  {["great", "ok", "older"].map((a) => <Pill key={a} active={f.ageFit === a} onClick={() => set({ ageFit: f.ageFit === a ? null : a })}>{T.AGEFIT[a].label}</Pill>)}
                </FieldGroup>
                <FieldGroup label="其他">
                  <Pill active={f.freeOnly} onClick={() => set({ freeOnly: !f.freeOnly })}>只看免費</Pill>
                  <Pill active={f.weekendOnly} onClick={() => set({ weekendOnly: !f.weekendOnly })}>只看週末</Pill>
                </FieldGroup>
                <FieldGroup label="地區">
                  <Pill active={!f.city} onClick={() => set({ city: null, district: null })}>全部</Pill>
                  {T.CITIES.map((ci) => <Pill key={ci.key} active={f.city === ci.key} onClick={() => set(f.city === ci.key ? { city: null, district: null } : { city: ci.key, district: null })}>{ci.label}</Pill>)}
                </FieldGroup>
                {f.city && districts.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: -8 }}>
                    <Pill active={!f.district} onClick={() => set({ district: null })}>全區</Pill>
                    {districts.map((d) => <Pill key={d} active={f.district === d} onClick={() => set({ district: f.district === d ? null : d })}>{d}</Pill>)}
                  </div>
                )}
              </div>
              <div style={{ position: "sticky", bottom: 0, background: C.bg, padding: "10px 20px 26px", borderTop: `1px solid ${C.border}` }}>
                <button onClick={() => setOpen(false)} style={{ all: "unset", cursor: "pointer", display: "block", textAlign: "center", background: C.primary, color: "#fff", fontWeight: 800, fontSize: 15.5, padding: 15, borderRadius: 14, whiteSpace: "nowrap" }}>顯示 {list.length} 個活動</button>
              </div>
            </div>
          </div>, layer)}
      </div>
    );
  }

  // ── About ──────────────────────────────────────────────────
  function About() {
    const statusColor = { ok: "#2f9e7e", partial: "#e0a100", failed: "#d1495b" };
    const statusLabel = { ok: "正常", partial: "部分", failed: "失敗" };
    return (
      <div style={{ padding: "8px 18px 28px" }}>
        <h1 style={{ margin: "2px 0 10px", fontSize: 22, fontWeight: 900, color: C.text }}>關於</h1>
        <div style={{ background: "linear-gradient(180deg,#ffffff,#fdfbf6)", border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: C.text }}>
            一個自動更新的「台北親子活動雷達」，為帶 <b>4 歲與 2 歲</b>幼兒的台北家長，每週精選大台北（含新北、基隆）適合幼兒的活動。
          </p>
          <p style={{ margin: "10px 0 0", fontSize: 13, lineHeight: 1.8, color: C.sec }}>
            內容由每週執行的研究代理人篩選並更新，每週三晚間重新掃描。
          </p>
        </div>

        <div style={{ display: "grid", gap: 11, marginTop: 16 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 15 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 9, height: 9, borderRadius: 99, background: T.STREAM.cultural.color }} /><b style={{ fontSize: 15, color: C.text }}>利基 A · 文化機構</b></div>
            <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.7, color: C.sec }}>各國駐台文化／代表機構的節慶與文化活動（歌德學院、法國在台協會、加拿大商會…）。</p>
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 15 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 9, height: 9, borderRadius: 99, background: T.STREAM.outdoor.color }} /><b style={{ fontSize: 15, color: C.text }}>利基 B · 戶外表演</b></div>
            <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.7, color: C.sec }}>中正紀念堂、大安森林公園露天音樂台、兩廳院藝文廣場、華山、松菸、市民廣場等戶外場域。</p>
          </div>
        </div>

        <div style={{ height: 22 }} />
        <SectionTitle right={`${T.sources.length} 個來源`}>每週掃描來源</SectionTitle>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
          {T.sources.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "12px 14px", borderTop: i ? `1px solid ${C.border}` : "none" }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: statusColor[s.lastStatus], flexShrink: 0 }} title={statusLabel[s.lastStatus]} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                <div style={{ fontSize: 11.5, color: C.sec, marginTop: 1 }}>{T.SOURCE_TYPE[s.type]} · {s.stream === "both" ? "文化＋戶外" : T.STREAM[s.stream].short}</div>
              </div>
              <span style={{ fontSize: 16, color: "#c7c1b6" }}>↗</span>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: C.sec, marginTop: 18, lineHeight: 1.7 }}>內容僅供參考，出發前請以主辦單位官方公告為準。<br />最後更新 2026/06/05</p>
      </div>
    );
  }

  // ── Detail (full-screen push) ──────────────────────────────
  function Detail({ ev, onClose }) {
    return (
      <div style={{ position: "absolute", inset: 0, zIndex: 60, background: C.bg, display: "flex", flexDirection: "column", animation: "tfrPush .26s cubic-bezier(.2,.7,.3,1)" }}>
        <div style={{ flex: 1, overflow: "auto" }}>
          <div style={{ height: 190, background: catTint[ev.category] || C.soft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 76, position: "relative" }}>
            <div style={{ position: "absolute", top: 50, left: 16 }}>
              <button onClick={onClose} style={{ all: "unset", cursor: "pointer", width: 38, height: 38, borderRadius: 99, background: "rgba(255,255,255,0.9)", display: "grid", placeItems: "center", fontSize: 17, color: C.text, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>‹</button>
            </div>
            <div style={{ position: "absolute", bottom: 12, right: 14, fontSize: 11, color: "rgba(31,36,33,0.45)", fontFamily: "ui-monospace, monospace" }}>category placeholder</div>
            {T.CATEGORY[ev.category].emoji}
          </div>
          <div style={{ padding: "16px 20px 30px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 9 }}><StreamDot s={ev.stream} /><AgeBadge f={ev.ageFit} />{ev.isFree && <FreeBadge />}</div>
            <h2 style={{ margin: "0 0 2px", fontSize: 22, fontWeight: 900, color: C.text, lineHeight: 1.3 }}>{ev.title}</h2>
            {ev.titleOriginal && <div style={{ fontSize: 13, fontStyle: "italic", color: C.sec }}>{ev.titleOriginal}</div>}
            <div style={{ display: "grid", gap: 10, margin: "16px 0", fontSize: 14, color: C.text }}>
              <div style={{ display: "flex", gap: 10 }}><span>📍</span><b>{ev.venue}</b><span style={{ color: C.sec }}>{ev.area}</span></div>
              <div style={{ display: "flex", gap: 10 }}><span>🗓️</span><b>{T.fmtRange(ev.startDate, ev.endDate)}{ev.startTime ? ` · ${ev.startTime}` : ""}</b></div>
              <div style={{ display: "flex", gap: 10 }}><span>🎟️</span><b>{ev.isFree ? "免費" : "需購票"}</b></div>
            </div>
            <div style={{ background: "#fff7ec", border: "1px solid #f6e2c5", borderRadius: 14, padding: 13, fontSize: 13.5, color: "#8a5a1c", lineHeight: 1.6 }}>
              <b>適合 4 歲與 2 歲？</b>{ev.ageFitReason}
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.85, color: C.text, marginTop: 16 }}>{ev.summary}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 14 }}>{ev.tags.map((t) => <span key={t} style={{ fontSize: 12, color: C.sec, background: C.soft, padding: "4px 10px", borderRadius: 99 }}>#{t}</span>)}</div>
          </div>
        </div>
        <div style={{ flexShrink: 0, padding: "12px 20px 30px", borderTop: `1px solid ${C.border}`, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)" }}>
          <button style={{ all: "unset", cursor: "pointer", display: "block", textAlign: "center", background: C.primary, color: "#fff", fontWeight: 800, fontSize: 15.5, padding: 15, borderRadius: 14 }}>查看原始出處 ↗</button>
        </div>
      </div>
    );
  }

  // ── Shell ──────────────────────────────────────────────────
  const TABS = [
    { id: "home", label: "今天", icon: "🏠" },
    { id: "calendar", label: "月曆", icon: "🗓️" },
    { id: "all", label: "全部", icon: "🧭" },
    { id: "about", label: "關於", icon: "ℹ️" },
  ];
  function TFRApp() {
    const [tab, setTab] = React.useState("home");
    const [detail, setDetail] = React.useState(null);
    const layerRef = React.useRef(null);
    const [ready, setReady] = React.useState(false);
    React.useEffect(() => { setReady(true); }, []);
    const layer = ready ? layerRef.current : null;
    return (
      <window.IOSDevice width={393} height={852}>
        <style>{"@keyframes tfrPush{from{transform:translateX(16px)}to{transform:translateX(0)}}"}</style>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", background: C.bg, fontFamily: '"Noto Sans TC", -apple-system, system-ui, sans-serif', position: "relative" }}>
          <div style={{ height: 52, flexShrink: 0, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, background: C.bg }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 900, fontSize: 14, color: C.primary }}>
              <span style={{ width: 22, height: 22, borderRadius: 7, background: C.primary, color: "#fff", display: "grid", placeItems: "center", fontSize: 13 }}>◎</span>親子活動雷達
            </div>
          </div>
          <div style={{ flex: 1, overflow: "auto" }} key={tab}>
            {tab === "home" && <Home onTap={setDetail} />}
            {tab === "calendar" && <Calendar onTap={setDetail} layer={layer} />}
            {tab === "all" && <AllEvents onTap={setDetail} layer={layer} />}
            {tab === "about" && <About />}
          </div>
          <div style={{ flexShrink: 0, display: "flex", borderTop: `1px solid ${C.border}`, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", paddingBottom: 22, paddingTop: 8 }}>
            {TABS.map((t) => {
              const on = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{ all: "unset", cursor: "pointer", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: on ? C.primary : C.sec }}>
                  <span style={{ fontSize: 19, filter: on ? "none" : "grayscale(0.5) opacity(0.7)" }}>{t.icon}</span>
                  <span style={{ fontSize: 10.5, fontWeight: on ? 800 : 600 }}>{t.label}</span>
                </button>
              );
            })}
          </div>
          <div ref={layerRef} style={{ position: "absolute", inset: 0, zIndex: 45, pointerEvents: "none" }} />
          {detail && <Detail ev={detail} onClose={() => setDetail(null)} />}
        </div>
      </window.IOSDevice>
    );
  }

  window.TFRApp = TFRApp;
})();
