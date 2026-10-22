import { getStoreStatus, overnightHoursLabel } from './store-status.mjs';
const DAYS = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
const stores = { 'las-cruces':'GOOGLE_LAS_CRUCES_LOCATION_ID', alamogordo:'GOOGLE_ALAMOGORDO_LOCATION_ID' };
const cache = new Map();
let token, tokenExpires = 0, tokenPending;
const clock = time => `${String(time?.hours || 0).padStart(2,'0')}:${String(time?.minutes || 0).padStart(2,'0')}`;
const date = value => value ? `${value.year}-${String(value.month).padStart(2,'0')}-${String(value.day).padStart(2,'0')}` : '';
const label = value => { const [h,m]=value.split(':').map(Number); return `${h%12||12}${m?':'+String(m).padStart(2,'0'):''} ${h%24>=12?'PM':'AM'}`; };
const interval = row => row.opens==='00:00' && ['00:00','24:00'].includes(row.closes) ? 'Open 24 hours' : `${label(row.opens)}–${label(row.closes)}`;
export function publicHours(slug, data, now=new Date()) {
  const regularHours = data.regularHours?.periods?.length ? DAYS.map(day=>({day,label:day[0]+day.slice(1).toLowerCase(),intervals:data.regularHours.periods.filter(p=>p.openDay===day && p.openTime && p.closeTime).map(p=>({opens:clock(p.openTime),closes:clock(p.closeTime),closesDay:p.closeDay||day}))})) : [];
  const specialHours = (data.specialHours?.specialHourPeriods||[]).filter(p=>p.startDate).map(p=>({date:date(p.startDate),endDate:date(p.endDate||p.startDate),closed:!!p.closed,opens:p.openTime?clock(p.openTime):null,closes:p.closeTime?clock(p.closeTime):null}));
  const status = getStoreStatus({source:'google',regularHours,specialHours},now);
  const todayDate = new Intl.DateTimeFormat('en-CA',{timeZone:'America/Denver'}).format(now);
  const todayMillis = Date.parse(todayDate+'T00:00:00Z');
  const nearSpecial = specialHours.some(row => Date.parse(row.date+'T00:00:00Z') <= todayMillis+86400000 && Date.parse(row.endDate+'T00:00:00Z') >= todayMillis-86400000);
  if (!nearSpecial) status.todayHours = overnightHoursLabel(regularHours,status.today) || status.todayHours;
  if (data.openInfo?.status && data.openInfo.status !== 'OPEN') {
    Object.assign(status,{state:'closed',label:'Closed',detail:data.openInfo.status==='CLOSED_PERMANENTLY'?'Permanently closed':'Temporarily closed',todayHours:'Closed today'});
  }
  return {slug,status,source:'Google Business Profile · Mountain Time',week:regularHours.map(row=>({day:row.label,hours:overnightHoursLabel(regularHours,row.day)||(row.intervals.length?row.intervals.map(interval).join(' · '):'Closed')})),special:specialHours.filter(row=>row.endDate>=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Denver'}).format(now)).map(row=>({day:row.date===row.endDate?row.date:`${row.date}–${row.endDate}`,hours:row.closed?'Closed':row.opens&&row.closes?interval(row):'Call to confirm'}))};
}
async function accessToken() {
  if (token && Date.now()<tokenExpires) return token;
  if (tokenPending) return tokenPending;
  tokenPending=(async()=>{
    const {GOOGLE_CLIENT_ID:client_id,GOOGLE_CLIENT_SECRET:client_secret,GOOGLE_REFRESH_TOKEN:refresh_token}=process.env;
    if (!client_id || !client_secret || !refresh_token) throw new Error('Google connection not configured');
    const res=await fetch('https://oauth2.googleapis.com/token',{method:'POST',body:new URLSearchParams({client_id,client_secret,refresh_token,grant_type:'refresh_token'}),signal:AbortSignal.timeout(8000)});
    if(!res.ok) throw new Error('Google authorization unavailable');
    const data=await res.json();
    if(!data.access_token) throw new Error('Google authorization unavailable');
    token=data.access_token; tokenExpires=Date.now()+Math.max(0,(Number(data.expires_in)||3600)-60)*1000;
    return token;
  })().finally(()=>{tokenPending=null;});
  return tokenPending;
}
async function profile(slug) {
  const existing=cache.get(slug);
  if(existing?.pending) return existing.pending;
  if(existing?.until>Date.now()) { if(existing.error) throw new Error('Hours unavailable'); return existing.data; }
  const pending=(async()=>{
    try {
      const raw=process.env[stores[slug]]?.trim().replace(/^locations\//,'');
      if(!raw || !/^\d+$/.test(raw)) throw new Error('Location not configured');
      const auth=await accessToken();
      const res=await fetch(`https://mybusinessbusinessinformation.googleapis.com/v1/locations/${raw}?readMask=regularHours,specialHours,openInfo`,{headers:{Authorization:`Bearer ${auth}`},signal:AbortSignal.timeout(8000)});
      if(!res.ok) { if(res.status===401) tokenExpires=0; throw new Error('Google hours unavailable'); }
      const data=await res.json(); cache.set(slug,{data,until:Date.now()+300000}); return data;
    } catch(error) { cache.set(slug,{error:true,until:Date.now()+30000}); throw error; }
  })();
  cache.set(slug,{pending}); return pending;
}
export async function getMaintenanceHours() {
  return Promise.all(Object.keys(stores).map(async slug=>{
    try { return publicHours(slug,await profile(slug)); }
    catch { return {slug,status:{state:'unknown',label:'Hours unavailable',detail:'Call the store to confirm',todayHours:'Call to confirm today’s hours'},week:[],special:[],source:'Call the store to confirm hours'}; }
  }));
}
