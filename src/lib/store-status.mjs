

const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const DAY = 1440;


const minutes = (value        ) => { const [h,m] = value.split(":").map(Number); return h * 60 + m; };
const dateMinute = (value        ) => Date.parse(`${value}T00:00:00Z`) / 60000;
const clock = (minute        ) => { const total = ((minute % DAY) + DAY) % DAY; const h = Math.floor(total / 60), m = total % 60; return `${h % 12 || 12}${m ? `:${String(m).padStart(2,"0")}` : ""} ${h >= 12 ? "PM" : "AM"}`; };

// Google may split a recurring overnight opening into two calendar-day periods.
// Join only a verified midnight continuation; keep the source schedule intact.
export function overnightHoursLabel(rows                   , day        )                {
  const index = DAYS.indexOf(day);
  if (index < 0) return null;
  const row = rows.find(item => item.day === day);
  const previous = rows.find(item => item.day === DAYS[(index + 6) % 7]);
  const next = rows.find(item => item.day === DAYS[(index + 1) % 7]);
  if (!row || row.intervals.length !== 2) return null;
  const early = row.intervals.find(item => item.opens === "00:00" && item.closesDay === day);
  const late = row.intervals.find(item => minutes(item.opens) > 0 && item.closes === "24:00" && item.closesDay === day);
  const continuation = next?.intervals.find(item => item.opens === "00:00" && item.closesDay === next.day && minutes(item.closes) < DAY);
  const carriedFromYesterday = previous?.intervals.some(item => item.closes === "24:00" && item.closesDay === previous.day);
  if (!early || !late || !continuation || !carriedFromYesterday || minutes(early.closes) >= minutes(late.opens)) return null;
  return `${clock(minutes(late.opens))}–${clock(minutes(continuation.closes))}`;
}

export function getStoreStatus(schedule          , now = new Date())              {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Denver", year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", hourCycle:"h23" }).formatToParts(now);
  const part = (type        ) => parts.find(item => item.type === type) .value;
  const date = `${part("year")}-${part("month")}-${part("day")}`;
  const todayStart = dateMinute(date);
  const current = todayStart + Number(part("hour")) * 60 + Number(part("minute"));
  const today = DAYS[new Date(todayStart * 60000).getUTCDay()];
  const unknown              = { state:"unknown", label:"Check store hours", detail:"Call the store to confirm", today, todayHours:"Call to confirm today’s hours" };
  if (schedule.source !== "google" || schedule.syncStatus === "error" || !schedule.regularHours.length) return unknown;
  const exceptions = new Set        ();
  const specialWindows                    = [];
  for (const row of schedule.specialHours) {
    const startDay = dateMinute(row.date), endDay = dateMinute(row.endDate || row.date);
    if (!Number.isFinite(startDay) || !Number.isFinite(endDay)) continue;
    // A midnight ending belongs to the preceding date; it must not close the next day.
    const lastDay = !row.closed && row.closes === "00:00" && endDay > startDay ? endDay - DAY : endDay;
    for (let day = startDay; day <= lastDay; day += DAY) exceptions.add(day);
    if (row.closed) continue;
    if (!row.opens || !row.closes) { if (todayStart >= startDay && todayStart <= lastDay) return unknown; continue; }
    const start = startDay + minutes(row.opens);
    let end = endDay + minutes(row.closes);
    if (end <= start) end += DAY;
    specialWindows.push([start,end]);
  }
  const windows                    = [...specialWindows];
  for (let offset = -7; offset <= 8; offset++) {
    const day = todayStart + offset * DAY;
    const index = new Date(day * 60000).getUTCDay();
    const row = schedule.regularHours.find(item => item.day === DAYS[index]);
    for (const interval of row?.intervals || []) {
      const start = day + minutes(interval.opens);
      const closeDay = DAYS.indexOf(interval.closesDay);
      if (closeDay < 0) continue;
      let end = day + ((closeDay - index + 7) % 7) * DAY + minutes(interval.closes);
      if (end <= start) end += DAY;
      let fragments                    = [[start,end]];
      for (const exception of exceptions) fragments = fragments.flatMap(([a,b]) => {
        if (b <= exception || a >= exception + DAY) return [[a,b]                   ];
        const result                    = [];
        if (a < exception) result.push([a,exception]);
        if (b > exception + DAY) result.push([exception + DAY,b]);
        return result;
      });
      windows.push(...fragments);
    }
  }
  const merged                    = [];
  for (const span of windows.sort((a,b) => a[0]-b[0])) {
    const last = merged.at(-1);
    if (last && span[0] <= last[1]) last[1] = Math.max(last[1],span[1]); else merged.push([...span]);
  }
  const todayWindows = merged.filter(([start,end]) => end > todayStart && start < todayStart + DAY).map(([start,end]) => [Math.max(start,todayStart),Math.min(end,todayStart+DAY)]);
  const todayHours = todayWindows.some(([start,end]) => start === todayStart && end === todayStart+DAY) ? "Open 24 hours" : todayWindows.length ? todayWindows.map(([start,end]) => `${start === todayStart ? "Midnight" : clock(start)}–${end === todayStart+DAY ? "midnight" : clock(end)}`).join(" · ") : "Closed today";
  const active = merged.find(([start,end]) => current >= start && current < end);
  if (active) return { state:"open", label:"Open now", detail:active[0] <= todayStart && active[1] >= todayStart + DAY ? "Open 24 hours today" : `Closes at ${clock(active[1])}`, today, todayHours };
  const next = merged.find(([start]) => start > current);
  const nextDay = next ? Math.floor((next[0]-todayStart)/DAY) : null;
  const when = nextDay === 0 ? "today" : nextDay === 1 ? "tomorrow" : next ? new Intl.DateTimeFormat("en-US", { weekday:"long", timeZone:"UTC" }).format(new Date(next[0]*60000)) : "";
  return { state:"closed", label:"Closed now", detail:next ? `Opens ${when} at ${clock(next[0])}` : "Call for the next opening", today, todayHours };
}
