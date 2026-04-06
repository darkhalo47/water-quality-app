import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pfasData = JSON.parse(readFileSync(join(__dirname, 'pfas_by_pwsid.json'), 'utf8'));

const EPA_LIMITS = {
  'PFOA':    { limitPpt: 4 },
  'PFOS':    { limitPpt: 4 },
  'PFNA':    { limitPpt: 10 },
  'PFHxS':   { limitPpt: 10 },
  'HFPO-DA': { limitPpt: 10 },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { pwsid } = req.query;
  if (!pwsid) return res.status(400).json({ error: 'pwsid is required' });

  const record = pfasData[pwsid];

  if (!record) {
    return res.status(200).json({
      pwsid,
      monitored: false,
      message: 'No UCMR 5 PFAS monitoring data found for this water system. Systems serving fewer than 3,300 people may not have been required to monitor.',
      sourceUrl: 'https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule',
    });
  }

  const contaminants = Object.entries(record.detections).map(([name, values]) => {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const avgPpt = parseFloat((avg * 1000).toFixed(4));
    const limitPpt = EPA_LIMITS[name] ? EPA_LIMITS[name].limitPpt : null;
    const aboveEpaLimit = limitPpt ? avgPpt > limitPpt : null;
    return {
      name,
      averagePpt: avgPpt,
      sampleCount: values.length,
      epaLimitPpt: limitPpt,
      aboveEpaLimit,
    };
  });

  const anyAboveLimit = contaminants.some(function(c) { return c.aboveEpaLimit === true; });

  return res.status(200).json({
    pwsid,
    monitored: true,
    name: record.name,
    anyAboveLimit,
    totalDetections: contaminants.length,
    contaminants,
    sourceUrl: 'https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule-data-finder',
    sourceLabel: 'EPA UCMR 5 Data Finder',
    updated: 'Data through January 2026 (95% complete)',
    note: 'UCMR 5 results do not indicate compliance or noncompliance with EPA MCLs.',
  });
}
