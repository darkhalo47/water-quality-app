import { parseStringPromise } from 'xml2js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { pwsid } = req.query
  if (!pwsid) {
    return res.status(400).json({ error: 'pwsid is required' })
  }

  try {
    const url = `https://data.epa.gov/efservice/VIOLATION/PWSID/${pwsid}`

    const response = await fetch(url)
    const text = await response.text()

    let parsed
    try {
      parsed = await parseStringPromise(text, { explicitArray: false })
    } catch {
      return res.status(500).json({ error: 'Failed to parse XML', raw: text.slice(0, 300) })
    }

    const violations = parsed?.violationList?.violation
    if (!violations) {
      return res.status(200).json({
        pwsid,
        activeViolations: 0,
        totalViolations: 0,
        healthBasedViolations: 0,
        recentViolations: [],
        sourceUrl: `https://echo.epa.gov/drinking-water/drinking-water-search/results?p_pwsid=${pwsid}`,
      })
    }

    const list = Array.isArray(violations) ? violations : [violations]

    const active = list.filter(v =>
      v.COMPLIANCE_STATUS_CODE !== 'R' &&
      (!v.RTC_DATE || v.RTC_DATE === 'None')
    )

    const healthBased = list.filter(v => v.IS_HEALTH_BASED_IND === 'Y')

    const recent = list
      .filter(v => v.COMPL_PER_BEGIN_DATE && v.COMPL_PER_BEGIN_DATE !== 'None')
      .sort((a, b) => new Date(b.COMPL_PER_BEGIN_DATE) - new Date(a.COMPL_PER_BEGIN_DATE))
      .slice(0, 5)
      .map(v => ({
        violationCode: v.VIOLATION_CODE,
        category: v.VIOLATION_CATEGORY_CODE,
        contaminantCode: v.CONTAMINANT_CODE,
        isHealthBased: v.IS_HEALTH_BASED_IND === 'Y',
        status: v.COMPLIANCE_STATUS_CODE === 'R' ? 'Resolved' : 'Active',
        began: v.COMPL_PER_BEGIN_DATE?.split(' ')[0],
        resolved: v.RTC_DATE !== 'None' ? v.RTC_DATE?.split(' ')[0] : null,
      }))

    return res.status(200).json({
      pwsid,
      activeViolations: active.length,
      totalViolations: list.length,
      healthBasedViolations: healthBased.length,
      recentViolations: recent,
      sourceUrl: `https://echo.epa.gov/drinking-water/drinking-water-search/results?p_pwsid=${pwsid}`,
    })
  } catch (err) {
    return res.status(500).json({ error: 'Violations lookup failed', detail: err.message })
  }
}