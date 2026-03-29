import { useState } from 'react'
import './App.css'

const statusColors = {
  warn:   { border: '#EF9F27', badgeBg: '#FAEEDA', badgeColor: '#633806' },
  danger: { border: '#E24B4A', badgeBg: '#FCEBEB', badgeColor: '#501313' },
  good:   { border: '#1D9E75', badgeBg: '#E1F5EE', badgeColor: '#085041' },
  info:   { border: '#378ADD', badgeBg: '#E6F1FB', badgeColor: '#0C447C' },
}

function MetricCard({ metric, extra, showLeadRec, setShowLeadRec, showPfasRec, setShowPfasRec, showHardnessRec, setShowHardnessRec }) {
  const colors = statusColors[metric.status]
  return (
    <div className="metric-card" style={{ borderLeft: '3px solid ' + colors.border }}>
      <div className="metric-top">
        <div>
          <div className="metric-label" style={{ color: colors.border }}>{metric.label}</div>
          {metric.subtitle && <div className="metric-subtitle">{metric.subtitle}</div>}
        </div>
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
            <p>{metric.recommendation}
              {metric.label === 'Lead Risk' && (
                <button className="learn-more-btn" onClick={() => setShowLeadRec(!showLeadRec)}>
                  {showLeadRec ? ' Hide' : ' Learn more'}
                </button>
              )}
              {metric.label === 'PFAS Contaminants' && (
                <button className="learn-more-btn" onClick={() => setShowPfasRec(!showPfasRec)}>
                  {showPfasRec ? ' Hide' : ' Learn more'}
                </button>
              )}
              {metric.label === 'Water Hardness' && metric.recommendation && (
                <button className="learn-more-btn" onClick={() => setShowHardnessRec(!showHardnessRec)}>
                  {showHardnessRec ? ' Hide' : ' Learn more'}
                </button>
              )}
            </p>
            {metric.label === 'Lead Risk' && showLeadRec && (
              <div className="rec-detail-box">
                <div className="rec-detail-title">EPA guidance on reducing lead exposure from drinking water</div>
                <div className="rec-detail-section">
                  <div className="rec-detail-heading">Flushing your tap</div>
                  <p>The EPA recommends that when water has been sitting in pipes for several hours, you flush your tap for 30 seconds to 2 minutes before using water for drinking or cooking. The exact time depends on whether your home has a lead service line — contact your utility for specific guidance.</p>
                  <a href="https://www.epa.gov/ground-water-and-drinking-water/basic-information-about-lead-drinking-water" target="_blank" rel="noreferrer" className="rec-detail-link">EPA — Basic Information About Lead in Drinking Water</a>
                </div>
                <div className="rec-detail-section">
                  <div className="rec-detail-heading">Use cold water only</div>
                  <p>The EPA advises using only cold water for drinking, cooking, and making baby formula. Hot water is more likely to contain higher levels of lead. Boiling water does not remove lead.</p>
                  <a href="https://www.epa.gov/ground-water-and-drinking-water/basic-information-about-lead-drinking-water" target="_blank" rel="noreferrer" className="rec-detail-link">EPA — Basic Information About Lead in Drinking Water</a>
                </div>
                <div className="rec-detail-section">
                  <div className="rec-detail-heading">NSF/ANSI 53-certified filters</div>
                  <p>The EPA recommends using a filter certified to NSF/ANSI Standard 53 for lead reduction. This certification requires the filter to reduce lead to 5 ppb or less. Look for NSF/ANSI 53 on the label and confirm lead is specifically listed as a contaminant the filter reduces.</p>
                  <a href="https://www.epa.gov/water-research/consumer-tool-identifying-point-use-and-pitcher-filters-certified-reduce-lead" target="_blank" rel="noreferrer" className="rec-detail-link">EPA — Consumer Tool for Identifying Filters Certified to Reduce Lead</a>
                </div>
                <div className="rec-detail-section">
                  <div className="rec-detail-heading">Get your water tested</div>
                  <p>The only way to know if your tap water contains lead is to have it tested by a certified laboratory. Many public water systems will test drinking water for residents upon request at no charge.</p>
                  <a href="https://www.cdc.gov/lead-prevention/prevention/drinking-water.html" target="_blank" rel="noreferrer" className="rec-detail-link">CDC — About Lead in Drinking Water</a>
                </div>
                <div className="rec-detail-section">
                  <div className="rec-detail-heading">Children and pregnant women</div>
                  <p>The EPA and CDC agree there is no known safe level of lead in a child's blood. For households with infants, children, or pregnant women, the CDC recommends using bottled water or a certified filter for drinking, cooking, and preparing baby formula.</p>
                  <a href="https://www.epa.gov/ground-water-and-drinking-water/basic-information-about-lead-drinking-water" target="_blank" rel="noreferrer" className="rec-detail-link">EPA — Basic Information About Lead in Drinking Water</a>
                </div>
              </div>
            )}
            {metric.label === 'PFAS Contaminants' && showPfasRec && (
              <div className="rec-detail-box">
                <div className="rec-detail-title">EPA guidance on reducing PFAS exposure from drinking water</div>
                <div className="rec-detail-section">
                  <div className="rec-detail-heading">Check your utility's PFAS data</div>
                  <p>Many public water systems have PFAS test results available. Contact your utility directly or check your annual Consumer Confidence Report. You can also search the EPA's UCMR 5 dataset which contains PFAS monitoring results for water systems across the country.</p>
                  <a href="https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule" target="_blank" rel="noreferrer" className="rec-detail-link">EPA — UCMR 5 Occurrence Data</a>
                </div>
                <div className="rec-detail-section">
                  <div className="rec-detail-heading">Reverse osmosis filters</div>
                  <p>Reverse osmosis (RO) is one of the most effective home treatment methods for reducing PFAS. The EPA identifies reverse osmosis as a Best Available Technology (BAT) for meeting PFAS drinking water standards. RO systems force water through a semi-permeable membrane that blocks PFAS molecules. Look for certification to NSF/ANSI 58 for reverse osmosis systems.</p>
                  <a href="https://www.epa.gov/water-research/identifying-drinking-water-filters-certified-reduce-pfas" target="_blank" rel="noreferrer" className="rec-detail-link">EPA — Identifying Drinking Water Filters Certified to Reduce PFAS</a>
                </div>
                <div className="rec-detail-section">
                  <div className="rec-detail-heading">Activated carbon filters</div>
                  <p>Granular activated carbon (GAC) filters are also identified by the EPA as a Best Available Technology for PFAS removal. They are generally less expensive than reverse osmosis systems. Look for certification to NSF/ANSI 53 and confirm PFAS is listed as a contaminant the filter reduces.</p>
                  <a href="https://www.epa.gov/cleanups/reducing-pfas-your-drinking-water-home-filter" target="_blank" rel="noreferrer" className="rec-detail-link">EPA — Reducing PFAS in Your Drinking Water with a Home Filter</a>
                </div>
                <div className="rec-detail-section">
                  <div className="rec-detail-heading">Filter certification caveat</div>
                  <p>As of April 2024, current NSF/ANSI filter certifications focus on removing PFOA and PFOS specifically. The EPA notes that current certifications do not yet confirm a filter will reduce PFAS to the new EPA drinking water standards. However, using a certified filter is still an effective way to reduce your exposure. The EPA is working with standard-setting bodies to update certifications.</p>
                  <a href="https://www.epa.gov/water-research/identifying-drinking-water-filters-certified-reduce-pfas" target="_blank" rel="noreferrer" className="rec-detail-link">EPA — Identifying Drinking Water Filters Certified to Reduce PFAS</a>
                </div>
                <div className="rec-detail-section">
                  <div className="rec-detail-heading">Filter maintenance</div>
                  <p>Filters are only effective if maintained according to the manufacturer's instructions. Not replacing a filter cartridge on schedule can increase your risk of exposure to PFAS. Always follow the manufacturer's recommended replacement schedule.</p>
                  <a href="https://www.epa.gov/cleanups/reducing-pfas-your-drinking-water-home-filter" target="_blank" rel="noreferrer" className="rec-detail-link">EPA — Reducing PFAS in Your Drinking Water with a Home Filter</a>
                </div>
              </div>
            )}
            {metric.label === 'Water Hardness' && showHardnessRec && (
              <div className="rec-detail-box">
                <div className="rec-detail-title">USGS and EPA guidance on hard water</div>

                <div className="rec-detail-section">
                  <div className="rec-detail-heading">Hard water is not a health risk</div>
                  <p>The EPA has not set a legal limit or standard for hardness in water because calcium and magnesium — the minerals that cause hardness — are not toxic and do not cause harmful health effects. The USGS notes that hard water may even provide dietary benefits as a source of calcium and magnesium.</p>
                  <a href="https://www.usgs.gov/special-topics/water-science-school/science/hardness-water" target="_blank" rel="noreferrer" className="rec-detail-link">USGS — Hardness of Water</a>
                </div>

                <div className="rec-detail-section">
                  <div className="rec-detail-heading">Practical effects of hard water</div>
                  <p>Hard water can cause scale buildup in pipes, water heaters, and appliances, reduce the effectiveness of soaps and detergents, and leave spots on dishes and fixtures. The USGS notes that most water utilities try to avoid delivering very hard water due to these nuisance effects.</p>
                  <a href="https://www.usgs.gov/special-topics/water-science-school/science/hardness-water" target="_blank" rel="noreferrer" className="rec-detail-link">USGS — Hardness of Water</a>
                </div>

                <div className="rec-detail-section">
                  <div className="rec-detail-heading">Water softeners</div>
                  <p>Water softeners work by replacing calcium and magnesium ions with sodium or potassium ions. The EPA WaterSense program recommends demand-initiated regeneration systems that are water and salt efficient. Note that some local jurisdictions have restrictions on water softeners due to salt discharge — check local requirements before purchasing.</p>
                  <a href="https://www.epa.gov/system/files/documents/2025-01/ws-products-home-water-treatment-guide_v2_508.pdf" target="_blank" rel="noreferrer" className="rec-detail-link">EPA WaterSense — Guide to Selecting Water Treatment Systems</a>
                </div>

                <div className="rec-detail-section">
                  <div className="rec-detail-heading">Sodium consideration</div>
                  <p>Salt-based water softeners add sodium to treated water. The EPA recommends drinking water contain less than 20 mg/L of sodium. If you or someone in your household is on a sodium-restricted diet or has high blood pressure, consult a doctor before using a salt-based softener. A potassium-based softener is an alternative.</p>
                  <a href="https://www.usgs.gov/faqs/do-you-have-information-about-water-hardness-united-states" target="_blank" rel="noreferrer" className="rec-detail-link">USGS — Water Hardness FAQ</a>
                </div>

              </div>
            )}
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
  const [showUtilityPicker, setShowUtilityPicker] = useState(false)
  const [allSystems, setAllSystems] = useState([])
  const [showLeadRec, setShowLeadRec] = useState(false)
  const [showGlossary, setShowGlossary] = useState(false)
  const [showPfasRec, setShowPfasRec] = useState(false)
  const [showHardnessRec, setShowHardnessRec] = useState(false)

  const handleCheck = async () => {
    if (!address.trim()) return
    setLoading(true)
    setResults(null)
    setError(null)
    setShowPwsInfo(false)
    setShowLeadInfo(false)
    setShowUtilityPicker(false)

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
      setAllSystems(wsData.allSystems || [])  

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
            subtitle: 'Your utility\'s compliance with EPA lead standards',
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
            subtitle: 'Presence of synthetic "forever chemicals" in your water supply',
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
            subtitle: 'Mineral content in your wate affecting scale buildup and appliance longevity',
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
            subtitle: 'Active breaches of federal Safe Drinking Water Act requirements',
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
        <div className="hero-summary">
          <p>This tool pulls real data from the EPA and USGS to give you a plain-English summary of your local water quality. All results are sourced directly from federal databases and updated quarterly.</p>
          <div className="hero-summary-chips">
            <a href="https://echo.epa.gov" target="_blank" rel="noreferrer" className="hero-chip">EPA ECHO</a>
          <a href="https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule" target="_blank" rel="noreferrer" className="hero-chip">EPA UCMR 5</a>
          <a href="https://www.usgs.gov/special-topics/water-science-school/science/hardness-water" target="_blank" rel="noreferrer" className="hero-chip">USGS Water Data</a>
          <a href="https://www.epa.gov/enviro/envirofacts-data-service-api" target="_blank" rel="noreferrer" className="hero-chip">Envirofacts</a>
          </div>
        </div>
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

          <div className="utility-disclaimer">
            This reflects the largest utility serving your area. Results may not apply to private wells or small community systems.
            {allSystems.length > 1 && (
              <button className="utility-picker-btn" onClick={() => setShowUtilityPicker(!showUtilityPicker)}>
                {showUtilityPicker ? 'Hide' : 'Not your utility?'}
              </button>
            )}
          </div>

          {showUtilityPicker && (
            <div className="utility-picker">
              <div className="utility-picker-title">Other water systems in your area</div>
              <div className="utility-picker-sub">Select the system that serves your address to reload results.</div>
              {allSystems.map(s => (
                <div
                  key={s.pwsid}
                  className={'utility-picker-row' + (s.pwsid === results.utility.pwsid ? ' active' : '')}
                  onClick={async () => {
                    if (s.pwsid === results.utility.pwsid) return
                    setLoading(true)
                    setShowUtilityPicker(false)
                    try {
                      const violRes = await fetch(`/api/violations?pwsid=${s.pwsid}`)
                      const violData = await violRes.json()
                      const leadViolCount = violData.recentViolations?.filter(v => v.contaminantCode === '5000').length || 0
                      setResults(prev => ({
                        ...prev,
                        utility: {
                          ...prev.utility,
                          name: s.name,
                          population: parseInt(s.population).toLocaleString(),
                          pwsid: s.pwsid,
                        },
                        metrics: {
                          ...prev.metrics,
                          lead: {
                            ...prev.metrics.lead,
                            status: leadViolCount > 0 ? 'danger' : 'good',
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
                            sourceUrl: 'https://echo.epa.gov/detailed-facility-report?fid=' + s.pwsid + '&sys=SDWIS',
                            recommendation: leadViolCount > 0
                              ? 'Contact your utility directly. Consider running cold tap for 2 minutes before drinking and using a NSF/ANSI 53-certified lead filter.'
                              : 'No utility-level action needed. See below for building-specific considerations.',
                          },
                          violations: {
                            ...prev.metrics.violations,
                            status: violData.activeViolations > 0 ? 'danger' : 'good',
                            value: violData.activeViolations > 0
                              ? violData.activeViolations + ' active violation' + (violData.activeViolations > 1 ? 's' : '')
                              : '0 active violations',
                            badge: violData.activeViolations > 0 ? 'Action required' : 'No active violations',
                            summary: violData.activeViolations > 0
                              ? 'Your water utility has ' + violData.activeViolations + ' unresolved violation' + (violData.activeViolations > 1 ? 's' : '') + '.'
                              : s.name + ' has no current enforcement actions.',
                            data: [
                              { key: 'Active violations', val: String(violData.activeViolations) },
                              { key: 'Health-based violations', val: String(violData.healthBasedViolations) },
                              { key: 'Total violations on record', val: String(violData.totalViolations) },
                            ],
                            sourceUrl: 'https://echo.epa.gov/detailed-facility-report?fid=' + s.pwsid + '&sys=SDWIS',
                          },
                        },
                      }))
                    } catch (err) {
                      setError('Could not load data for that utility.')
                    } finally {
                      setLoading(false)
                    }
                  }}
                >
                  <div className="utility-picker-name">{s.name}</div>
                  <div className="utility-picker-meta">
                    {s.pwsid} · {parseInt(s.population).toLocaleString()} people
                    {s.pwsid === results.utility.pwsid && <span className="utility-picker-current">Current</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

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
                    {showLeadInfo ? 'Hide' : 'Can you be more specific about the lead risk in my building?'}
                  </button>
                  {showLeadInfo && (
                    <div className="lead-info-box">
                    <div className="rec-detail-title">Why we cannot assess your specific building</div>

                    <div className="rec-detail-section">
                      <div className="rec-detail-heading">Building age</div>
                      <p>Homes built before 1986 may have lead pipes or lead solder. Lead was banned from new plumbing installations in 1986 under the Safe Drinking Water Act.</p>
                    </div>

                    <div className="rec-detail-section">
                      <div className="rec-detail-heading">Service line material</div>
                      <p>The pipe connecting your home to the water main may be made of lead. The EPA required utilities to inventory these lines by October 2024, but this data is not yet available in a national searchable database by address.</p>
                      <a href="https://www.epa.gov/ground-water-and-drinking-water/lead-service-lines" target="_blank" rel="noreferrer" className="rec-detail-link">
                        EPA - Lead Service Lines
                      </a>
                    </div>

                    <div className="rec-detail-section">
                      <div className="rec-detail-heading">Internal plumbing</div>
                      <p>Faucets and fixtures in older homes may contain lead components. This information is not captured in any public national database and varies by individual property.</p>
                    </div>

                    <div className="rec-detail-section">
                      <div className="rec-detail-heading">What you can do</div>
                      <p>If your home was built before 1986, or if you are concerned about lead, the EPA recommends flushing your tap before drinking, using only cold water for cooking, and using a filter certified to NSF/ANSI Standard 53 for lead reduction.</p>
                      <a href="https://www.epa.gov/ground-water-and-drinking-water/basic-information-about-lead-drinking-water" target="_blank" rel="noreferrer" className="rec-detail-link">
                        EPA - Basic Information About Lead in Drinking Water
                      </a>
                    </div>
                  </div>
                  )}
                </div>
              ) : null}
              showLeadRec={showLeadRec}
              setShowLeadRec={setShowLeadRec}
              showPfasRec={showPfasRec}
              setShowPfasRec={setShowPfasRec}
              showHardnessRec={showHardnessRec}
              setShowHardnessRec={setShowHardnessRec}
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

          <button className="glossary-btn" onClick={() => setShowGlossary(true)}>
            Learn about these water quality indicators
          </button>
        </div>
      )}

      {showGlossary && (
        <div className="glossary-overlay">
          <div className="glossary-panel">
            <div className="glossary-header">
              <div className="glossary-title">Water quality indicators explained</div>
              <button className="glossary-close" onClick={() => setShowGlossary(false)}>Close</button>
            </div>

            <div className="glossary-item">
              <div className="glossary-term">Lead Risk</div>
              <div className="glossary-def">Measures whether your water utility has violated EPA lead standards. Lead enters drinking water through corroded pipes and plumbing fixtures, not from the source water itself. The EPA action level for lead is 15 parts per billion (ppb). There is no known safe level of lead exposure for children.</div>
              <a href="https://www.epa.gov/ground-water-and-drinking-water/basic-information-about-lead-drinking-water" target="_blank" rel="noreferrer" className="glossary-link">EPA — Basic Information About Lead in Drinking Water</a>
            </div>

            <div className="glossary-item">
              <div className="glossary-term">PFAS Contaminants</div>
              <div className="glossary-def">Per- and polyfluoroalkyl substances (PFAS) are a group of thousands of synthetic chemicals used in manufacturing since the 1940s. They are called "forever chemicals" because they do not break down in the environment or the human body. In April 2024, the EPA finalized the first national drinking water standards for six PFAS, setting limits as low as 4 parts per trillion (ppt) for PFOA and PFOS.</div>
              <a href="https://www.epa.gov/pfas/pfas-drinking-water-regulation" target="_blank" rel="noreferrer" className="glossary-link">EPA — PFAS Drinking Water Regulation</a>
            </div>

            <div className="glossary-item">
              <div className="glossary-term">Water Hardness</div>
              <div className="glossary-def">Water hardness measures the concentration of dissolved calcium and magnesium minerals. Hard water is not a health risk, but it can cause scale buildup in pipes and appliances, reduce soap lathering efficiency, and leave deposits on fixtures. The USGS classifies water as soft (0-60 mg/L), moderately hard (61-120 mg/L), hard (121-180 mg/L), or very hard (over 180 mg/L).</div>
              <a href="https://www.usgs.gov/special-topics/water-science-school/science/hardness-water" target="_blank" rel="noreferrer" className="glossary-link">USGS — Hardness of Water</a>
            </div>

            <div className="glossary-item">
              <div className="glossary-term">Utility Violations</div>
              <div className="glossary-def">Violations occur when a public water system fails to meet federal Safe Drinking Water Act (SDWA) requirements. These include exceeding maximum contaminant levels (MCLs), failing required monitoring or testing, or not notifying customers of problems. Active violations are unresolved. Historical violations show past compliance issues that have since been corrected.</div>
              <a href="https://www.epa.gov/sdwa/safe-drinking-water-act-sdwa-overview" target="_blank" rel="noreferrer" className="glossary-link">EPA — Safe Drinking Water Act Overview</a>
            </div>

            <div className="glossary-item">
              <div className="glossary-term">Consumer Confidence Report (CCR)</div>
              <div className="glossary-def">Every community water system is required by federal law to publish an annual Consumer Confidence Report (also called an annual water quality report) by July 1 each year. The CCR details where your water comes from, what contaminants have been detected, and how levels compare to federal standards. It is the most comprehensive source of information about your specific water utility.</div>
              <a href="https://www.epa.gov/ccr/ccr-information-consumers" target="_blank" rel="noreferrer" className="glossary-link">EPA — Consumer Confidence Reports</a>
            </div>

            <div className="glossary-item" style={{borderBottom: 'none'}}>
              <div className="glossary-term">About this tool</div>
              <div className="glossary-def">This tool pulls data from the EPA Enforcement and Compliance History Online (ECHO) database, the EPA Unregulated Contaminant Monitoring Rule 5 (UCMR 5) dataset, the USGS Water Science baseline data, and the EPA Envirofacts Safe Drinking Water Information System (SDWIS). Data is updated quarterly. This tool provides general public information only and is not a substitute for professional water testing.</div>
              <a href="https://echo.epa.gov" target="_blank" rel="noreferrer" className="glossary-link">EPA ECHO — Enforcement and Compliance History Online</a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App