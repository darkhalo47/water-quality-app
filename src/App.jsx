import { useState } from 'react'
import './App.css'

const statusColors = {
  warn:   { border: '#EF9F27', badgeBg: '#FAEEDA', badgeColor: '#633806' },
  danger: { border: '#E24B4A', badgeBg: '#FCEBEB', badgeColor: '#501313' },
  good:   { border: '#1D9E75', badgeBg: '#E1F5EE', badgeColor: '#085041' },
  info:   { border: '#378ADD', badgeBg: '#E6F1FB', badgeColor: '#0C447C' },
}

function MetricCard({ metric, extra }) {
  const colors = statusColors[metric.status]
  return (
    <div className="metric-card" style={{ borderLeft: '3px solid ' + colors.border }}>
      <div className="metric-top">
        <div className="metric-label" style={{ color: colors.border }}>{metric.label}</div>
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
          {metric.sourceLabel || metric.source}
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
      {extra}
    </div>
  )
}

function App() {
  const [address, setAddress] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPwsInfo, setShowPwsInfo] = useState(false)
  const [showLeadInfo, setShowLeadInfo] = useState(false)

  const handleCheck = async () => {
    if (!address.trim()) return
    setLoading(true)
    setResults(null)
    setError(null)
    setShowPwsInfo(false)
    setShowLeadInfo(false)

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

      const leadViolCount = violData.recentViolations?.filter(v => v.contaminantCode === '5000').length || 0

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
            status: leadViolCount > 0 ? 'danger' : 'good',
            label: 'Lead Risk',
            value: leadViolCount > 0 ? 'Violations on record' : 'No utility violations found',
            badge: leadViolCount > 0 ? 'Action recommended' : 'Utility compliant',
            summary: leadViolCount > 0
              ? 'Your water utility has had lead-related violations on record. Contact your utility directly for current status.'
              : 'Your water utility has no lead violations on record in the EPA database. This reflects utility-level compliance only.',
            data: [
              { key: 'Lead violations on record', val: String(leadViolCount) },
              { key: 'Total utility violations', val: String(violData.totalViolations) },
              { key: 'EPA lead action level', val: '15 ppb' },
            ],
            source: 'EPA ECHO · Detailed Facility Report ' + wsData.pwsid,
            sourceUrl: 'https://echo.epa.gov/detailed-facility-report?fid=' + wsData.pwsid + '&sys=SDWIS',
            sourceLabel: 'View full record on EPA ECHO',
            updated: 'Updated quarterly',
            explainer: 'This reflects whether your water utility has violated EPA lead standards. It does not assess lead risk from your building\'s internal plumbing.',
            recommendation: leadViolCount > 0
              ? 'Contact your utility directly. Consider running cold tap for 2 minutes before drinking and using a NSF/ANSI 53-certified lead filter.'
              : 'No utility-level action needed. See below for building-specific considerations.',
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
            value: hardData.hardness ? hardData.hardness + ' mg/L (CaCO3)' : 'Data unavailable',
            badge: hardData.classification || 'Unknown',
            summary: hardData.hardness
              ? (hardData.countyName || 'Your area') + ' water is classified as ' + hardData.classification?.toLowerCase() + '. ' + (hardData.hardness > 120 ? 'May cause scale buildup on fixtures and appliances.' : 'No significant hardness issues expected.')
              : 'Hardness data not available for this area.',
            data: [
              { key: 'Hardness level', val: hardData.hardness ? hardData.hardness + ' mg/L' : 'N/A' },
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
              ? violData.activeViolations + ' active violation' + (violData.activeViolations > 1 ? 's' : '')
              : '0 active violations',
            badge: violData.activeViolations > 0 ? 'Action required' : 'No active violations',
            summary: violData.activeViolations > 0
              ? 'Your water utility has ' + violData.activeViolations + ' unresolved violation' + (violData.activeViolations > 1 ? 's' : '') + '. ' + (violData.healthBasedViolations > 0 ? violData.healthBasedViolations + ' are health-based.' : '')
              : wsData.name + ' has no current enforcement actions. ' + (violData.totalViolations > 0 ? violData.totalViolations + ' historical violations are all resolved.' : 'Clean compliance record.'),
            data: [
              { key: 'Active violations', val: String(violData.activeViolations) },
              { key: 'Health-based violations', val: String(violData.healthBasedViolations) },
              { key: 'Total violations on record', val: String(violData.totalViolations) },
            ],
            source: 'EPA ECHO · Enforcement history ' + wsData.pwsid,
            sourceUrl: 'https://echo.epa.gov/detailed-facility-report?fid=' + wsData.pwsid + '&sys=SDWIS',
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
              <div className="utility-meta">Your address is served by</div>
              <div className="utility-name">{results.utility.name}</div>
              <div className="utility-meta">
                {results.utility.county} · Serves {results.utility.population} people
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div className="utility-id">
                <span className="utility-id-label">PWS ID: </span>
                {results.utility.pwsid}
              </div>
              <div className="pwsid-tooltip-wrap" onClick={() => setShowPwsInfo(!showPwsInfo)}>
                <div className="pwsid-help">?</div>
              </div>
            </div>
          </div>

          {showPwsInfo && (
            <div className="pwsid-explainer">
              <div className="pwsid-explainer-title">What is a PWS ID?</div>
              <p>A Public Water System ID (PWS ID) is a unique identifier assigned by the EPA to every regulated water utility in the United States. It consists of a two-letter state code followed by seven digits.</p>
              <p>Your PWS ID is the key that links your address to all federal water quality records, including violation history, contaminant testing, and enforcement actions held in the EPA Safe Drinking Water Information System (SDWIS).</p>
              <a href="https://www.epa.gov/ground-water-and-drinking-water/safe-drinking-water-information-system-sdwis-federal-reporting" target="_blank" rel="noreferrer" className="pwsid-explainer-link">Learn more on EPA.gov</a>
              <button className="pwsid-explainer-close" onClick={() => setShowPwsInfo(false)}>Close</button>
            </div>
          )}

          <div className="section-label">Water quality indicators</div>

          {Object.values(results.metrics).map((metric) => (
            <MetricCard
              key={metric.label}
              metric={metric}
              extra={metric.label === 'Lead Risk' ? (
                <div>
                  <button
                    className="lead-more-btn"
                    onClick={() => setShowLeadInfo(!showLeadInfo)}
                  >
                    {showLeadInfo ? 'Hide' : 'Can you be more specific about my building?'}
                  </button>
                  {showLeadInfo && (
                    <div className="lead-info-box">
                      <div className="lead-info-title">Why we cannot assess your specific building:</div>
                      <p>The data above reflects your water utility compliance record: whether the utility that supplies your water has violated EPA lead standards. This is federally reported data.</p>
                      <p>However, the lead risk in your specific home also depends on factors we do not have access to:</p>
                      <ul>
                        <li><strong>Building age:</strong> Homes built before 1986 may have lead pipes or lead solder. Lead was banned from plumbing in 1986.</li>
                        <li><strong>Service line material:</strong> The pipe connecting your home to the water main may be lead. The EPA required utilities to inventory these by October 2024, but this data is not yet available in a national searchable database.</li>
                        <li><strong>Internal plumbing:</strong> Faucets and fixtures in older homes may contain lead components not captured in any public database.</li>
                      </ul>
                      <p>If your home was built before 1986, or if you are concerned about lead, the EPA recommends using a certified filter regardless of utility compliance status.</p>
                      <a href="https://www.epa.gov/ground-water-and-drinking-water/basic-information-about-lead-drinking-water" target="_blank" rel="noreferrer" className="lead-info-link">
                        Learn more about lead in drinking water on EPA.gov
                      </a>
                    </div>
                  )}
                </div>
              ) : null}
            />
          ))}

          <div className="ccr-row" onClick={() => window.open('https://ofmpub.epa.gov/apex/safewater/f?p=136:102', '_blank')} style={{ cursor: 'pointer' }}>
            <div className="ccr-left">
              <div className="ccr-icon">📄</div>
              <div>
                <div className="ccr-title">View Consumer Confidence Report</div>
                <div className="ccr-sub">{results.utility.name} · 2024 Annual Water Quality Report</div>
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