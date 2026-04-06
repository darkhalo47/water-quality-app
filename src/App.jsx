import { useState } from 'react'
import './App.css'

const statusColors = {
  warn:   { border: '#EF9F27', badgeBg: '#FAEEDA', badgeColor: '#633806' },
  danger: { border: '#E24B4A', badgeBg: '#FCEBEB', badgeColor: '#501313' },
  good:   { border: '#1D9E75', badgeBg: '#E1F5EE', badgeColor: '#085041' },
  info:   { border: '#378ADD', badgeBg: '#E6F1FB', badgeColor: '#0C447C' },
}

const PFAS_INFO = {
  'PFOA': {
    fullName: 'Perfluorooctanoic acid',
    epaLimit: '4 ppt',
    sources: 'Non-stick cookware, food packaging, stain-resistant materials, firefighting foam (AFFF)',
    healthEffects: 'Linked to kidney and testicular cancer, thyroid disease, immune system effects, and reproductive harm.',
    learnMoreUrl: 'https://www.epa.gov/pfas/pfas-drinking-water-regulation',
  },
  'PFOS': {
    fullName: 'Perfluorooctane sulfonic acid',
    epaLimit: '4 ppt',
    sources: 'Firefighting foam (AFFF), stain-resistant fabrics, food packaging, industrial processes near military bases',
    healthEffects: 'Linked to kidney and testicular cancer, thyroid disease, immune system effects, and reproductive harm.',
    learnMoreUrl: 'https://www.epa.gov/pfas/pfas-drinking-water-regulation',
  },
  'PFNA': {
    fullName: 'Perfluorononanoic acid',
    epaLimit: '10 ppt',
    sources: 'Fluoropolymer manufacturing, food packaging, stain-resistant coatings',
    healthEffects: 'Linked to immune system effects, thyroid hormone disruption, and developmental effects.',
    learnMoreUrl: 'https://www.epa.gov/pfas/pfas-drinking-water-regulation',
  },
  'PFHxS': {
    fullName: 'Perfluorohexane sulfonic acid',
    epaLimit: '10 ppt',
    sources: 'Firefighting foam, carpet treatments, food packaging',
    healthEffects: 'Linked to thyroid hormone disruption and immune system effects.',
    learnMoreUrl: 'https://www.epa.gov/pfas/pfas-drinking-water-regulation',
  },
  'HFPO-DA': {
    fullName: 'Hexafluoropropylene oxide dimer acid (GenX chemicals)',
    epaLimit: '10 ppt',
    sources: 'Fluoropolymer manufacturing, used as a replacement for PFOA',
    healthEffects: 'Linked to liver, kidney, and immune system effects in animal studies.',
    learnMoreUrl: 'https://www.epa.gov/pfas/pfas-drinking-water-regulation',
  },
  'PFBS': {
    fullName: 'Perfluorobutane sulfonic acid',
    epaLimit: 'No individual EPA limit (part of Hazard Index)',
    sources: 'Used as a replacement for PFOS in some applications, stain-resistant treatments',
    healthEffects: 'Limited data. May affect thyroid function. Part of EPA Hazard Index mixture standard.',
    learnMoreUrl: 'https://www.epa.gov/pfas/pfas-drinking-water-regulation',
  },
  'PFBA': {
    fullName: 'Perfluorobutanoic acid',
    epaLimit: 'No EPA limit currently set',
    sources: 'Used as a replacement for PFOA, food packaging, industrial processes',
    healthEffects: 'Limited data. Short-chain PFAS. EPA is still evaluating health effects.',
    learnMoreUrl: 'https://www.epa.gov/pfas/pfas-drinking-water-regulation',
  },
  'PFHxA': {
    fullName: 'Perfluorohexanoic acid',
    epaLimit: 'No EPA limit currently set',
    sources: 'Fluoropolymer manufacturing, food packaging',
    healthEffects: 'Limited data. EPA is still evaluating health effects.',
    learnMoreUrl: 'https://www.epa.gov/pfas/pfas-drinking-water-regulation',
  },
  'PFHpA': {
    fullName: 'Perfluoroheptanoic acid',
    epaLimit: 'No EPA limit currently set',
    sources: 'Industrial processes, fluoropolymer manufacturing',
    healthEffects: 'Limited data. EPA is still evaluating health effects.',
    learnMoreUrl: 'https://www.epa.gov/pfas/pfas-drinking-water-regulation',
  },
  'PFDA': {
    fullName: 'Perfluorodecanoic acid',
    epaLimit: 'No EPA limit currently set',
    sources: 'Fluoropolymer manufacturing, food packaging, stain-resistant treatments',
    healthEffects: 'Linked to liver and kidney effects in animal studies.',
    learnMoreUrl: 'https://www.epa.gov/pfas/pfas-drinking-water-regulation',
  },
}

const TABS = [
  { id: 'overview',   icon: '🏠', label: 'Overview' },
  { id: 'lead',       icon: '🔩', label: 'Lead' },
  { id: 'pfas',       icon: '🧪', label: 'PFAS' },
  { id: 'hardness',   icon: '💧', label: 'Hardness' },
  { id: 'violations', icon: '⚠️', label: 'Violations' },
  { id: 'ccr',        icon: '📄', label: 'CCR' },
  { id: 'learn',      icon: 'ℹ️', label: 'Learn' },
]

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
              {metric.label === 'Water Hardness' && (
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
                  <p>Reverse osmosis (RO) is one of the most effective home treatment methods for reducing PFAS. The EPA identifies reverse osmosis as a Best Available Technology for meeting PFAS drinking water standards. Look for certification to NSF/ANSI 58 for reverse osmosis systems.</p>
                  <a href="https://www.epa.gov/water-research/identifying-drinking-water-filters-certified-reduce-pfas" target="_blank" rel="noreferrer" className="rec-detail-link">EPA — Identifying Drinking Water Filters Certified to Reduce PFAS</a>
                </div>
                <div className="rec-detail-section">
                  <div className="rec-detail-heading">Activated carbon filters</div>
                  <p>Granular activated carbon filters are also identified by the EPA as a Best Available Technology for PFAS removal. Look for certification to NSF/ANSI 53 and confirm PFAS is listed as a contaminant the filter reduces.</p>
                  <a href="https://www.epa.gov/cleanups/reducing-pfas-your-drinking-water-home-filter" target="_blank" rel="noreferrer" className="rec-detail-link">EPA — Reducing PFAS in Your Drinking Water with a Home Filter</a>
                </div>
                <div className="rec-detail-section">
                  <div className="rec-detail-heading">Filter certification caveat</div>
                  <p>As of April 2024, current NSF/ANSI filter certifications focus on removing PFOA and PFOS specifically. The EPA notes that current certifications do not yet confirm a filter will reduce PFAS to the new EPA drinking water standards. However, using a certified filter is still an effective way to reduce your exposure.</p>
                  <a href="https://www.epa.gov/water-research/identifying-drinking-water-filters-certified-reduce-pfas" target="_blank" rel="noreferrer" className="rec-detail-link">EPA — Identifying Drinking Water Filters Certified to Reduce PFAS</a>
                </div>
              </div>
            )}
            {metric.label === 'Water Hardness' && showHardnessRec && (
              <div className="rec-detail-box">
                <div className="rec-detail-title">USGS and EPA guidance on hard water</div>
                <div className="rec-detail-section">
                  <div className="rec-detail-heading">Hard water is not a health risk</div>
                  <p>The EPA has not set a legal limit for hardness in water because calcium and magnesium are not toxic and do not cause harmful health effects. The USGS notes that hard water may even provide dietary benefits as a source of calcium and magnesium.</p>
                  <a href="https://www.usgs.gov/special-topics/water-science-school/science/hardness-water" target="_blank" rel="noreferrer" className="rec-detail-link">USGS — Hardness of Water</a>
                </div>
                <div className="rec-detail-section">
                  <div className="rec-detail-heading">Practical effects of hard water</div>
                  <p>Hard water can cause scale buildup in pipes, water heaters, and appliances, reduce the effectiveness of soaps and detergents, and leave spots on dishes and fixtures.</p>
                  <a href="https://www.usgs.gov/special-topics/water-science-school/science/hardness-water" target="_blank" rel="noreferrer" className="rec-detail-link">USGS — Hardness of Water</a>
                </div>
                <div className="rec-detail-section">
                  <div className="rec-detail-heading">Water softeners</div>
                  <p>Water softeners replace calcium and magnesium ions with sodium or potassium ions. The EPA WaterSense program recommends demand-initiated regeneration systems. Note that some local jurisdictions have restrictions on water softeners — check local requirements before purchasing.</p>
                  <a href="https://www.epa.gov/system/files/documents/2025-01/ws-products-home-water-treatment-guide_v2_508.pdf" target="_blank" rel="noreferrer" className="rec-detail-link">EPA WaterSense — Guide to Selecting Water Treatment Systems</a>
                </div>
                <div className="rec-detail-section">
                  <div className="rec-detail-heading">Sodium consideration</div>
                  <p>Salt-based water softeners add sodium to treated water. If you or someone in your household is on a sodium-restricted diet or has high blood pressure, consult a doctor before using a salt-based softener.</p>
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
  const [activeTab, setActiveTab] = useState('overview')
  const [showPwsInfo, setShowPwsInfo] = useState(false)
  const [showLeadInfo, setShowLeadInfo] = useState(false)
  const [showUtilityPicker, setShowUtilityPicker] = useState(false)
  const [allSystems, setAllSystems] = useState([])
  const [showLeadRec, setShowLeadRec] = useState(false)
  const [showPfasRec, setShowPfasRec] = useState(false)
  const [showHardnessRec, setShowHardnessRec] = useState(false)
  const [showPfasInfo, setShowPfasInfo] = useState(null)

  const handleCheck = async () => {
    if (!address.trim()) return
    setLoading(true)
    setResults(null)
    setError(null)
    setShowPwsInfo(false)
    setShowLeadInfo(false)
    setShowUtilityPicker(false)
    setActiveTab('overview')

    try {
      const geoRes = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`)
      const geoData = await geoRes.json()
      if (geoData.error) throw new Error('Address not found. Try including city and state.')

      const parts = geoData.formattedAddress.split(',').map(p => p.trim())
      const city = parts[1] || 'Cincinnati'
      const state = parts[2]?.replace(/\s+/g, '') || 'OH'

      const [wsRes, hardRes] = await Promise.all([
        fetch(`/api/watersystem?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`),
        fetch(`/api/hardness?stateFips=${geoData.stateFips}&countyFips=${geoData.countyFips}`),
      ])

      const wsData = await wsRes.json()
      if (wsData.error) throw new Error('No water system found for "' + city + ', ' + state + '". This may be because your area is served by a regional water district not listed under your city name. Try searching for a nearby larger city, or visit EPA ECHO directly at echo.epa.gov to find your utility.')
      setAllSystems(wsData.allSystems || [])

      const [violRes, pfasRes] = await Promise.all([
        fetch(`/api/violations?pwsid=${wsData.pwsid}`),
        fetch(`/api/pfas?pwsid=${wsData.pwsid}`),
      ])
      const violData = await violRes.json()
      const pfasData = await pfasRes.json()
      const hardData = await hardRes.json()

      const leadViolCount = violData.recentViolations?.filter(v => v.contaminantCode === '5000').length || 0

      setResults({
        address: geoData.formattedAddress,
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
              ? 'Contact your utility directly. Flush your tap before drinking and consider a NSF/ANSI 53-certified lead filter.'
              : 'No utility-level action needed. See below for suggested actions.',
          },
          pfas: {
            subtitle: 'Presence of synthetic "forever chemicals" in your water supply',
            status: pfasData.monitored
              ? pfasData.anyAboveLimit ? 'danger' : 'good'
              : 'info',
            label: 'PFAS Contaminants',
            value: pfasData.monitored
              ? pfasData.anyAboveLimit
                ? pfasData.totalDetections + ' PFAS detected — above EPA limit'
                : pfasData.totalDetections + ' PFAS detected — below EPA limits'
              : 'No monitoring data',
            badge: pfasData.monitored
              ? pfasData.anyAboveLimit ? 'Above EPA limit' : 'Below EPA limits'
              : 'Not monitored',
            summary: pfasData.monitored
              ? pfasData.anyAboveLimit
                ? pfasData.contaminants.filter(c => c.aboveEpaLimit).map(c => c.name).join(', ') + ' detected above EPA limits in UCMR 5 monitoring.'
                : 'PFAS were detected but all results are below current EPA maximum contaminant levels.'
              : 'This water system was not included in EPA UCMR 5 monitoring, or results are not yet available. Systems serving fewer than 3,300 people may not have been required to monitor.',
            data: pfasData.monitored
              ? pfasData.contaminants.map(c => ({
                  key: c.name,
                  val: c.averagePpt + ' ppt' + (c.epaLimitPpt ? ' (limit: ' + c.epaLimitPpt + ' ppt)' : ' (no limit set)'),
                }))
              : [
                  { key: 'Monitoring status', val: 'Not in UCMR 5 dataset' },
                  { key: 'EPA health limit', val: '4 ppt (PFOA/PFOS)' },
                ],
            source: pfasData.monitored ? 'EPA UCMR 5 · ' + pfasData.name : 'EPA UCMR 5 Program',
            sourceUrl: pfasData.sourceUrl || 'https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule-data-finder',
            sourceLabel: pfasData.sourceLabel || 'View PFAS data on EPA.gov',
            updated: pfasData.updated || 'Updated 2024',
            explainer: 'PFAS are synthetic "forever chemicals" that persist in the environment. In April 2024 the EPA set the first national drinking water limits for six PFAS. ' + (pfasData.monitored ? pfasData.note : 'Not all water systems were required to participate in UCMR 5 monitoring.'),
            recommendation: pfasData.monitored && pfasData.anyAboveLimit
              ? 'PFAS detected above EPA limits. A reverse osmosis filter certified to NSF/ANSI 58 can reduce PFAS exposure.'
              : 'A reverse osmosis or activated carbon filter certified to NSF/ANSI 58 or 53 can reduce PFAS if present.',
          },
          hardness: {
            subtitle: 'Mineral content affecting scale buildup and appliance longevity',
            status: hardData.scope === 'county'
              ? (hardData.hardness > 180 ? 'warn' : hardData.hardness > 120 ? 'info' : 'good')
              : 'info',
            label: 'Water Hardness',
            value: hardData.hardness ? hardData.hardness + ' mg/L (CaCO3)' : 'Data unavailable',
            badge: hardData.scope === 'county'
              ? hardData.classification || 'Unknown'
              : hardData.scope === 'state_average'
                ? 'State estimate only'
                : 'Data unavailable',
            summary: hardData.hardness
              ? (hardData.countyName || 'Your area') + ' water is classified as ' + hardData.classification?.toLowerCase() + '. ' + (hardData.hardness > 120 ? 'May cause scale buildup on fixtures and appliances.' : 'No significant hardness issues expected.')
              : 'Hardness data not available for this area. Check your Consumer Confidence Report for utility-reported hardness.',
            data: [
              { key: 'Hardness level', val: hardData.hardness ? hardData.hardness + ' mg/L' : 'N/A' },
              { key: 'Classification', val: hardData.classification || 'N/A' },
              { key: 'Data scope', val: hardData.scope === 'county' ? 'County-level data' : 'State estimate only' },
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

  const renderTab = () => {
    if (!results) return null

    switch (activeTab) {
      case 'overview':
        return (
          <div className="tab-content">
            <div className="overview-address">
              <div className="overview-address-label">Results for</div>
              <div className="overview-address-value">{results.address}</div>
            </div>
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
                                ? 'Contact your utility directly. Flush your tap before drinking and consider a NSF/ANSI 53-certified lead filter.'
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
           
          </div>
        )

      case 'lead':
        return (
          <div className="tab-content">
            <MetricCard
              metric={results.metrics.lead}
              extra={
                <div>
                  <button className="lead-more-btn" onClick={() => setShowLeadInfo(!showLeadInfo)}>
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
                        <a href="https://www.epa.gov/ground-water-and-drinking-water/lead-service-lines" target="_blank" rel="noreferrer" className="rec-detail-link">EPA — Lead Service Lines</a>
                      </div>
                      <div className="rec-detail-section">
                        <div className="rec-detail-heading">Internal plumbing</div>
                        <p>Faucets and fixtures in older homes may contain lead components. This information is not captured in any public national database and varies by individual property.</p>
                      </div>
                      <div className="rec-detail-section">
                        <div className="rec-detail-heading">What you can do</div>
                        <p>If your home was built before 1986, or if you are concerned about lead, the EPA recommends flushing your tap before drinking, using only cold water for cooking, and using a filter certified to NSF/ANSI Standard 53 for lead reduction.</p>
                        <a href="https://www.epa.gov/ground-water-and-drinking-water/basic-information-about-lead-drinking-water" target="_blank" rel="noreferrer" className="rec-detail-link">EPA — Basic Information About Lead in Drinking Water</a>
                      </div>
                    </div>
                  )}
                </div>
              }
              showLeadRec={showLeadRec}
              setShowLeadRec={setShowLeadRec}
              showPfasRec={showPfasRec}
              setShowPfasRec={setShowPfasRec}
              showHardnessRec={showHardnessRec}
              setShowHardnessRec={setShowHardnessRec}
            />
          </div>
        )

      case 'pfas':
        return (
          <div className="tab-content">
            <div className="metric-card" style={{ borderLeft: '3px solid ' + statusColors[results.metrics.pfas.status].border }}>
              <div className="metric-top">
                <div>
                  <div className="metric-label" style={{ color: statusColors[results.metrics.pfas.status].border }}>{results.metrics.pfas.label}</div>
                  {results.metrics.pfas.subtitle && <div className="metric-subtitle">{results.metrics.pfas.subtitle}</div>}
                </div>
                <span className="metric-badge" style={{ background: statusColors[results.metrics.pfas.status].badgeBg, color: statusColors[results.metrics.pfas.status].badgeColor }}>
                  {results.metrics.pfas.badge}
                </span>
              </div>
              <div className="metric-value">{results.metrics.pfas.value}</div>
              <div className="metric-summary">{results.metrics.pfas.summary}</div>
              <table className="data-table">
                <tbody>
                  {results.metrics.pfas.data.map((row) => (
                    <tr key={row.key}>
                      <td className="data-key">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          {row.key}
                          {PFAS_INFO[row.key] && (
                            <span
                              className="pfas-info-btn"
                              onClick={() => setShowPfasInfo(showPfasInfo === row.key ? null : row.key)}
                            >?</span>
                          )}
                        </span>
                      </td>
                      <td className="data-val">{row.val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {showPfasInfo && PFAS_INFO[showPfasInfo] && (
                <div className="pfas-info-box">
                  <div className="pfas-info-title">{PFAS_INFO[showPfasInfo].fullName}</div>
                  <div className="pfas-info-row">
                    <span className="pfas-info-label">EPA limit</span>
                    <span className="pfas-info-val">{PFAS_INFO[showPfasInfo].epaLimit}</span>
                  </div>
                  <div className="pfas-info-row">
                    <span className="pfas-info-label">Common sources</span>
                    <span className="pfas-info-val">{PFAS_INFO[showPfasInfo].sources}</span>
                  </div>
                  <div className="pfas-info-row">
                    <span className="pfas-info-label">Health effects</span>
                    <span className="pfas-info-val">{PFAS_INFO[showPfasInfo].healthEffects}</span>
                  </div>
                  <a href={PFAS_INFO[showPfasInfo].learnMoreUrl} target="_blank" rel="noreferrer" className="rec-detail-link">
                    EPA — PFAS Drinking Water Regulation
                  </a>
                </div>
              )}
              <div className="metric-footer">
                <a className="source-link" href={results.metrics.pfas.sourceUrl} target="_blank" rel="noreferrer">
                  {results.metrics.pfas.sourceLabel || results.metrics.pfas.source}
                </a>
                <span className="last-updated">{results.metrics.pfas.updated}</span>
              </div>
              <div className="explainer-box">
                <p>{results.metrics.pfas.explainer}</p>
                {results.metrics.pfas.recommendation && (
                  <div className="rec-box">
                    <div className="rec-label">Recommendation</div>
                    <p>{results.metrics.pfas.recommendation}
                      <button className="learn-more-btn" onClick={() => setShowPfasRec(!showPfasRec)}>
                        {showPfasRec ? ' Hide' : ' Learn more'}
                      </button>
                    </p>
                    {showPfasRec && (
                      <div className="rec-detail-box">
                        <div className="rec-detail-title">EPA guidance on reducing PFAS exposure from drinking water</div>
                        <div className="rec-detail-section">
                          <div className="rec-detail-heading">Check your utility's PFAS data</div>
                          <p>Many public water systems have PFAS test results available. Contact your utility directly or check your annual Consumer Confidence Report.</p>
                          <a href="https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule" target="_blank" rel="noreferrer" className="rec-detail-link">EPA — UCMR 5 Occurrence Data</a>
                        </div>
                        <div className="rec-detail-section">
                          <div className="rec-detail-heading">Reverse osmosis filters</div>
                          <p>Reverse osmosis is one of the most effective home treatment methods for reducing PFAS. Look for certification to NSF/ANSI 58.</p>
                          <a href="https://www.epa.gov/water-research/identifying-drinking-water-filters-certified-reduce-pfas" target="_blank" rel="noreferrer" className="rec-detail-link">EPA — Identifying Drinking Water Filters Certified to Reduce PFAS</a>
                        </div>
                        <div className="rec-detail-section">
                          <div className="rec-detail-heading">Activated carbon filters</div>
                          <p>Granular activated carbon filters are also identified by the EPA as a Best Available Technology for PFAS removal. Look for certification to NSF/ANSI 53.</p>
                          <a href="https://www.epa.gov/cleanups/reducing-pfas-your-drinking-water-home-filter" target="_blank" rel="noreferrer" className="rec-detail-link">EPA — Reducing PFAS in Your Drinking Water with a Home Filter</a>
                        </div>
                        <div className="rec-detail-section">
                          <div className="rec-detail-heading">Filter certification caveat</div>
                          <p>As of April 2024, current NSF/ANSI filter certifications focus on removing PFOA and PFOS specifically. Using a certified filter is still an effective way to reduce your exposure.</p>
                          <a href="https://www.epa.gov/water-research/identifying-drinking-water-filters-certified-reduce-pfas" target="_blank" rel="noreferrer" className="rec-detail-link">EPA — Identifying Drinking Water Filters Certified to Reduce PFAS</a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="tab-nav-hint" onClick={() => setActiveTab('ccr')}>
              <span>📄 View your Consumer Confidence Report for PFAS data</span>
              <span className="tab-nav-arrow">→</span>
            </div>
          </div>
        )

      case 'hardness':
        return (
          <div className="tab-content">
            <MetricCard
              metric={results.metrics.hardness}
              showLeadRec={showLeadRec}
              setShowLeadRec={setShowLeadRec}
              showPfasRec={showPfasRec}
              setShowPfasRec={setShowPfasRec}
              showHardnessRec={showHardnessRec}
              setShowHardnessRec={setShowHardnessRec}
            />
          </div>
        )

      case 'violations':
        return (
          <div className="tab-content">
            <MetricCard
              metric={results.metrics.violations}
              showLeadRec={showLeadRec}
              setShowLeadRec={setShowLeadRec}
              showPfasRec={showPfasRec}
              setShowPfasRec={setShowPfasRec}
              showHardnessRec={showHardnessRec}
              setShowHardnessRec={setShowHardnessRec}
            />
          </div>
        )

      case 'ccr':
        return (
          <div className="tab-content">
            <div className="ccr-tab-card">
              <div className="ccr-tab-title">Consumer Confidence Report</div>
              <div className="ccr-tab-sub">{results.utility.name}</div>
              <p className="ccr-tab-desc">Every community water system is required by federal law to publish an annual Consumer Confidence Report (CCR) by July 1 each year. Your CCR details where your water comes from, what contaminants have been detected, and how levels compare to federal standards — including PFAS data from EPA UCMR 5 monitoring.</p>
              <button
                className="ccr-tab-btn"
                onClick={() => window.open('https://ofmpub.epa.gov/apex/safewater/f?p=136:102', '_blank')}
              >
                Find your CCR on EPA.gov
              </button>
              <div className="ccr-tab-note">
                <div className="rec-detail-heading">Where to find PFAS data in your CCR</div>
                <p style={{fontSize:'13px', color:'#444', lineHeight:'1.6', marginBottom:'0.75rem'}}>
                  Look for a section titled "Unregulated Contaminants" or "UCMR 5 Results." PFAS compounds will be listed by their chemical names or abbreviations. The most common ones to look for are:
                </p>
                <ul className="ccr-tab-list">
                  <li><strong>PFOA</strong> — perfluorooctanoic acid (EPA limit: 4 ppt)</li>
                  <li><strong>PFOS</strong> — perfluorooctane sulfonic acid (EPA limit: 4 ppt)</li>
                  <li><strong>PFNA</strong> — perfluorononanoic acid (EPA limit: 10 ppt)</li>
                  <li><strong>PFHxS</strong> — perfluorohexane sulfonic acid (EPA limit: 10 ppt)</li>
                  <li><strong>HFPO-DA</strong> — also known as GenX chemicals (EPA limit: 10 ppt)</li>
                </ul>
                <p style={{fontSize:'13px', color:'#444', lineHeight:'1.6', marginTop:'0.75rem', marginBottom:'0.75rem'}}>
                  If your CCR does not mention PFAS, contact your utility directly and ask whether they participated in EPA UCMR 5 monitoring between 2023 and 2025.
                </p>
                <div className="rec-detail-heading" style={{marginTop:'0.75rem'}}>Other things to look for</div>
                <ul className="ccr-tab-list">
                  <li>Water hardness — your utility's actual reported hardness level</li>
                  <li>Source water — where your drinking water comes from</li>
                  <li>Any contaminants detected above EPA action levels</li>
                  <li>Violations or enforcement actions during the reporting year</li>
                </ul>
              </div>
              <a
                href="https://www.epa.gov/ccr/ccr-information-consumers"
                target="_blank"
                rel="noreferrer"
                className="rec-detail-link ccr-bottom-link"
              >
                EPA — Consumer Confidence Report Information for Consumers
              </a>
            </div>
          </div>
        )

      case 'learn':
        return (
          <div className="tab-content">
            <div className="glossary-inline">
              <div className="glossary-inline-title">Water quality indicators explained</div>
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
                <div className="glossary-def">Violations occur when a public water system fails to meet federal Safe Drinking Water Act requirements. These include exceeding maximum contaminant levels, failing required monitoring or testing, or not notifying customers of problems. Active violations are unresolved. Historical violations show past issues that have since been corrected.</div>
                <a href="https://www.epa.gov/sdwa/safe-drinking-water-act-sdwa-overview" target="_blank" rel="noreferrer" className="glossary-link">EPA — Safe Drinking Water Act Overview</a>
              </div>
              <div className="glossary-item">
                <div className="glossary-term">Consumer Confidence Report (CCR)</div>
                <div className="glossary-def">Every community water system is required by federal law to publish an annual Consumer Confidence Report by July 1 each year. The CCR details where your water comes from, what contaminants have been detected, and how levels compare to federal standards. It is the most comprehensive source of information about your specific water utility.</div>
                <a href="https://www.epa.gov/ccr/ccr-information-consumers" target="_blank" rel="noreferrer" className="glossary-link">EPA — Consumer Confidence Reports</a>
              </div>
              <div className="glossary-item" style={{ borderBottom: 'none' }}>
                <div className="glossary-term">About this tool</div>
                <div className="glossary-def">This tool pulls data from the EPA Enforcement and Compliance History Online (ECHO) database, the EPA Unregulated Contaminant Monitoring Rule 5 (UCMR 5) dataset, the USGS Water Science baseline data, and the EPA Envirofacts Safe Drinking Water Information System (SDWIS). Data is updated quarterly. This tool provides general public information only and is not a substitute for professional water testing.</div>
                <a href="https://echo.epa.gov" target="_blank" rel="noreferrer" className="glossary-link">EPA ECHO — Enforcement and Compliance History Online</a>
              </div>
            </div>
          </div>
        )

      default:
        return null
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
          <div className="hero-instructions">
            <div className="hero-instructions-title">How to search</div>
            <p>Enter a full US street address including city and state for best results. For example:</p>
            <div className="hero-example">123 Main St, Cincinnati, OH</div>
            <div className="hero-instructions-notes">
              <div className="hero-instructions-note">
                <span className="hero-note-icon">✓</span>
                <span>Include city and state — ZIP code alone may not return results</span>
              </div>
              <div className="hero-instructions-note">
                <span className="hero-note-icon">✓</span>
                <span>Use standard abbreviations for states (OH, KY, IL, CA)</span>
              </div>
              <div className="hero-instructions-note">
                <span className="hero-note-icon">✗</span>
                <span>PO Boxes and rural routes may not return results</span>
              </div>
              <div className="hero-instructions-note">
                <span className="hero-note-icon">✗</span>
                <span>Private wells and very small systems may not be in the database</span>
              </div>
            </div>
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

      {error && <div className="error-box">{error}</div>}

      {results && (
        <div className="results">
          <div className="tab-bar">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={'tab-btn' + (activeTab === tab.id ? ' active' : '')}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
          {renderTab()}
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