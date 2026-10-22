import { getMaintenanceHours } from '../../lib/maintenance-hours.mjs';
export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store, max-age=0');
  if(req.method!=='GET') { res.setHeader('Allow','GET'); return res.status(405).json({error:'Method not allowed'}); }
  return res.status(200).json({locations:await getMaintenanceHours()});
}
