import { useState } from 'react'
import './App.css'

const mockResults = {
  utility: {
    name: 'Cincinnati Water Works',
    county: 'Hamilton County, OH',
    population: '~400,000',
    pwsid: 'OH1290069',
  },
  metrics: {
    lead: {
      status: 'warn',
      label: 'Lead Risk',
      value: 'Elevated concern',
      badge: 'Moderate risk',
      summary: 'Building constructed ~1974. Homes built before 1986 may have lead pipes or solder. No active utility violations found.',
      data: [
        { key: 'Utility violations (10 yr)', val: '0 lead violations' },
        { key: 'Building age proxy', val: 'Pre-1986 flag' },
        { key: '90th percentile level', val: '8 ppb (action level: 15 ppb)' },
      ],
      source: 'EPA ECHO · SDWIS violation record OH1290069',
      sourceUrl: 'https://echo.epa.gov',
      updated: 'Updated Jan 2025',
      explainer: 'Lead enters water through old pipes inside buildings, not from the utility. Your area has no current violations but your building age is a risk factor.',
      recommendation: 'Run cold tap 2 min before drinking. Consider a NSF/ANSI 53-certified lead filter.',
    },
    pfas: {
      status: 'danger',
      label: 'PFAS Contaminants',
      value: '4 compounds detected',
      badge: 'Above health limit',
      summary: 'PFAS levels detected in your water system exceed EPA health advisory limits for PFOA and PFOS.',
      data: [
        { key: 'PFOA detected', val: '6.2 ppt (limit: 4 ppt)' },
        { key: 'PFOS detected', val: '5.1 ppt (limit: 4 ppt)' },
        { key: 'PFNA detected', val: '2.1 ppt' },
        { key: 'PFHxS detected', val: '1.8 ppt' },
      ],
      source: 'EPA UCMR 5 dataset · System OH1290069',
      sourceUrl: 'https://www.epa.gov/dwucmr',
      updated: 'Updated Q3 2024',
      explainer: 'PFAS are synthetic chemicals that do not break down. Long-term exposure has been linked to immune and hormonal effects.',
      recommendation: 'A reverse osmosis or activated carbon block filter is the most effective solution for PFAS removal.',
    },
    hardness: {
      status: 'info',
      label: 'Water Hardness',
      value: '145 mg/L (CaCO3)',
      badge: 'Hard',
      summary: 'Classified as hard water. Not a health risk, but can cause scale buildup on fixtures and appliances.',
      data: [
        { key: 'Calcium (Ca)', val: '42 mg/L' },
        { key: 'Magnesium (Mg)', val: '14 mg/L' },
        { key: 'Hardness class', val: 'Hard (120 to 180 mg/L)' },
      ],
      source: 'USGS Water Quality Portal · Station USGS-03255000',
      sourceUrl: 'https://www.waterqualitydata.us',
      updated: 'Updated 2023',
      explainer: 'Hard water is safe to drink. The main downsides are mineral buildup on faucets and appliances, reduced soap lathering, and sometimes dry skin or hair.',
      recommendation: 'A whole-home water softener addresses scale buildup. Not medically necessary but extends appliance lifespan.',
    },
    violations: {
      status: 'good',
      label: 'Utility Violations',
      value: '0 active violations',
      badge: 'No active violations',
      summary: 'Cincinnati Water Works has no current enforcement actions. Last resolved violation was in 2019.',
      data: [
        { key: 'Active violations', val: '0' },
        { key: 'Violations (10 yr)', val: '2 resolved' },
        { key: 'Last violation', val: '2019 - Resolved' },
      ],
      source: 'EPA ECHO · Enforcement history OH1290069',
      sourceUrl: 'https://echo.epa.gov',
      updated: 'Updated Jan 2025',
      explainer: 'Utility violations indicate when a water system has broken federal Safe Drinking Water Act rules. No active violations means your utility is currently in compliance.',
      recommendation: null,
    },
  },
}

const statusColors = {
  warn:   { border: '#EF9F27', badgeBg: '#FAEEDA', badgeColor: '#633806' },
  danger: { border: '#E24B4A', badgeBg: '#FCEBEB', badgeColor: '#501313' },
  good:   { border: '#1D9E75', badgeBg: '#E1F5EE', badgeColor: '#085041' },
  info:   { border: '#378ADD', badgeBg: '#E6F1FB', badgeColor: '#0C447C' },
}

function MetricCard({ metric }) {
  const colors = statusColors[metric.status]
  return (
    <div className="metric-card" style={{ borderLeft: '3px solid ' + colors.border }}>
      <div className="metric-top">
        <div className="metric-label">{metric.label}</div>
        <span className="metric-badge" style={{ background: colors.badgeBg, color: colors.badgeColor }}>
          {metric.badge}
        </span>
      </div>
      <div className="metric-value">{metric.value}</div>
      <div className="metric-summary">{metric.summary}</div>
      <table className="data-table">
        <tbody>
          {metric.data.map((row) => (
            <tr key={row.key}>
              <td className="data-key">{row.key}</td>
              <td className="data-val">{row.val}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="metric-footer">
        <a className="source-link" href={metric.sourceUrl} target="_blank" rel="noreferrer">
          ↗ {metric.sourceLabel || metric.source}
        </a>
        <span className="last-updated">{metric.updated}</span>
      </div>
      <div className="explainer-box">
        <p>{metric.explainer}</p>
        {metric.recommendation && (
          <div className="rec-box">
            <div className="rec-label">Recommendation</div>
            <p>{metric.recommendation}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  const [address, setAddress] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleCheck = async () => {
    if (!address.trim()) return
    setLoading(true)
    setResults(null)
    setError(null)

    try {
      const geoRes = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`)
      const geoData = await geoRes.json()
      if (geoData.error) throw new Error('Address not found. Try including city and state.')

      const city = geoData.formattedAddress.split(',')[1]?.trim() || 'Cincinnati'
      const state = geoData.formattedAddress.split(',')[2]?.trim().split(' ')[1] || 'OH'

      const [wsRes, hardRes] = await Promise.all([
        fetch(`/api/watersystem?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`),
        fetch(`/api/hardness?stateFips=${geoData.stateFips}&countyFips=${geoData.countyFips}`),
      ])

      const wsData = await wsRes.json()
      if (wsData.error) throw new Error('No water system found for this address.')

      const violRes = await fetch(`/api/violations?pwsid=${wsData.pwsid}`)
      const violData = await violRes.json()
      const hardData = await hardRes.json()

      const buildingYear = null

      setResults({
        utility: {
          name: wsData.name,
          county: `${geoData.countyName}, ${state}`,
          population: parseInt(wsData.population).toLocaleString(),
          pwsid: wsData.pwsid,
          sourceUrl: wsData.sourceUrl,
        },
        metrics: {
          lead: {
            status: 'warn',
            label: 'Lead Risk',
            value: 'Potential concern',
            badge: 'Check building age',
            summary: 'Lead risk depends on your building age and internal plumbing. Homes built before 1986 may have lead pipes or solder.',
            data: [
              { key: 'Utility lead violations (10 yr)', val: violData.recentViolations?.filter(v => v.contaminantCode === '5000').length > 0 ? 'Violations found' : 'None on record' },
              { key: 'Building age proxy', val: 'Enter build year for assessment' },
              { key: 'EPA action level', val: '15 ppb' },
            ],
            source: `EPA ECHO · Detailed Facility Report ${wsData.pwsid}`,
            sourceUrl: `https://echo.epa.gov/detailed-facility-report?fid=${wsData.pwsid}&sys=SDWIS`,
            sourceLabel: 'View full record on EPA ECHO',
            updated: 'Updated quarterly',
            explainer: 'Lead enters water through old pipes inside buildings, not from the utility. Homes built before 1986 are at higher risk.',
            recommendation: 'Run cold tap 2 min before drinking. Consider a NSF/ANSI 53-certified lead filter.',
          },
          pfas: {
            status: 'info',
            label: 'PFAS Contaminants',
            value: 'See CCR report',
            badge: 'Check local report',
            summary: 'PFAS data for your specific utility is available in your Consumer Confidence Report. Check the link below.',
            data: [
              { key: 'Data source', val: 'EPA UCMR 5 (2023-2025)' },
              { key: 'Check utility report', val: 'See CCR below' },
              { key: 'EPA health limit', val: '4 ppt (PFOA/PFOS)' },
            ],
            source: 'EPA UCMR 5 · Occurrence Data',
            sourceUrl: 'https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule',
            sourceLabel: 'View PFAS occurrence data on EPA.gov',
            updated: 'Updated 2024',
            explainer: 'PFAS are synthetic chemicals that persist in the environment. Check your utility CCR for specific detection levels.',
            recommendation: 'A reverse osmosis filter removes over 90% of PFAS if detected in your water.',
          },
          hardness: {
            status: hardData.hardness > 180 ? 'warn' : hardData.hardness > 120 ? 'info' : 'good',
            label: 'Water Hardness',
            value: hardData.hardness ? `${hardData.hardness} mg/L (CaCO3)` : 'Data unavailable',
            badge: hardData.classification || 'Unknown',
            summary: hardData.hardness
              ? `${hardData.countyName || 'Your area'} water is classified as ${hardData.classification?.toLowerCase()}. ${hardData.hardness > 120 ? 'May cause scale buildup on fixtures and appliances.' : 'No significant hardness issues expected.'}`
              : 'Hardness data not available for this area.',
            data: [
              { key: 'Hardness level', val: hardData.hardness ? `${hardData.hardness} mg/L` : 'N/A' },
              { key: 'Classification', val: hardData.classification || 'N/A' },
              { key: 'Data scope', val: hardData.scope === 'county' ? 'County-level data' : 'State average' },
            ],
            source: 'USGS Water Science School · Water Hardness',
            sourceUrl: 'https://www.usgs.gov/special-topics/water-science-school/science/hardness-water',
            sourceLabel: 'View hardness data on USGS.gov',
            updated: 'USGS baseline data',
            explainer: 'Hard water is not a health risk. It can cause scale buildup on appliances and fixtures and reduce soap lathering.',
            recommendation: hardData.hardness > 120
              ? 'A whole-home water softener can reduce scale buildup and extend appliance lifespan.'
              : 'No treatment needed for hardness at this level.',
          },
          violations: {
            status: violData.activeViolations > 0 ? 'danger' : 'good',
            label: 'Utility Violations',
            value: violData.activeViolations > 0
              ? `${violData.activeViolations} active violation${violData.activeViolations > 1 ? 's' : ''}`
              : '0 active violations',
            badge: violData.activeViolations > 0 ? 'Action required' : 'No active violations',
            summary: violData.activeViolations > 0
              ? `Your water utility has ${violData.activeViolations} unresolved violation${violData.activeViolations > 1 ? 's' : ''}. ${violData.healthBasedViolations > 0 ? `${violData.healthBasedViolations} are health-based.` : ''}`
              : `${wsData.name} has no current enforcement actions. ${violData.totalViolations > 0 ? `${violData.totalViolations} historical violations are all resolved.` : 'Clean compliance record.'}`,
            data: [
              { key: 'Active violations', val: String(violData.activeViolations) },
              { key: 'Health-based violations', val: String(violData.healthBasedViolations) },
              { key: 'Total violations on record', val: String(violData.totalViolations) },
            ],
            source: `EPA ECHO · Enforcement history ${wsData.pwsid}`,
            sourceUrl: `https://echo.epa.gov/detailed-facility-report?fid=${wsData.pwsid}&sys=SDWIS`,
            sourceLabel: 'View enforcement history on EPA ECHO',
            updated: 'Updated quarterly',
            explainer: 'Utility violations indicate when a water system has broken federal Safe Drinking Water Act rules. Active violations mean the issue is unresolved.',
            recommendation: violData.activeViolations > 0
              ? 'Contact your utility directly for details. Consider using a certified filter while violations are unresolved.'
              : null,
          },
        },
      })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="hero">
        <p className="hero-eyebrow">Know what is in your water</p>
        <h1 className="hero-title">
          Your <span className="hero-accent">water quality</span>
          <br />
          at a glance
        </h1>
        <p className="hero-sub">
          Enter your address to see lead risk, water hardness,
          contaminants, and filter recommendations.
        </p>
      </div>

      <div className="search-box">
        <input
          className="search-input"
          type="text"
          placeholder="Enter your address or ZIP code"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
        />
        <button className="search-btn" onClick={handleCheck}>
          {loading ? 'Checking...' : 'Check'}
        </button>
      </div>

{error && (
        <div className="error-box">
          {error}
        </div>
      )}

      {results && (
        <div className="results">
          <div className="utility-bar">
            <div>
              <div className="utility-name">{results.utility.name}</div>
              <div className="utility-meta">
                {results.utility.county} · Serves {results.utility.population} people
              </div>
            </div>
            <div className="utility-id">{results.utility.pwsid}</div>
          </div>

          <div className="section-label">Water quality indicators</div>

          {Object.values(results.metrics).map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}

          <div className="ccr-row" onClick={() => window.open(`https://ofmpub.epa.gov/apex/safewater/f?p=136:102`, '_blank')} style={{cursor:'pointer'}}>
            <div className="ccr-left">
              <div className="ccr-icon">📄</div>
              <div>
                <div className="ccr-title">View Consumer Confidence Report</div>
                <div className="ccr-sub">
                  {results.utility.name} · 2024 Annual Water Quality Report
                </div>
              </div>
            </div>
            <span className="ccr-arrow">↗</span>
          </div>

          <p className="disclaimer">
            Data sourced from EPA ECHO, EPA UCMR 5, and USGS Water Quality Portal.
            This tool provides general information only and is not a substitute for professional water testing.
          </p>
        </div>
      )}
    </div>
  )
}

export default App