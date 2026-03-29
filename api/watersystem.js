import { parseStringPromise } from 'xml2js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { city, state } = req.query
  if (!city || !state) {
    return res.status(400).json({ error: 'city and state are required' })
  }

  try {
    const cityUpper = city.toUpperCase().trim()
    const stateUpper = state.toUpperCase().trim()
    const url = `https://data.epa.gov/efservice/WATER_SYSTEM/CITY_NAME/${cityUpper}/STATE_CODE/${stateUpper}/PWS_TYPE_CODE/CWS/PWS_ACTIVITY_CODE/A`

    const response = await fetch(url)
    const text = await response.text()

    let parsed
    try {
      parsed = await parseStringPromise(text, { explicitArray: false })
    } catch {
      return res.status(500).json({ error: 'Failed to parse XML', raw: text.slice(0, 300) })
    }

    const systems = parsed?.water_systemList?.water_system
    if (!systems) {
      return res.status(200).json({ error: 'No systems found', city, state })
    }

    const list = Array.isArray(systems) ? systems : [systems]

    const largest = list.reduce((best, s) => {
      const pop = parseInt(s.POPULATION_SERVED_COUNT || 0)
      const bestPop = parseInt(best.POPULATION_SERVED_COUNT || 0)
      return pop > bestPop ? s : best
    }, list[0])

    return res.status(200).json({
      pwsid: largest.PWSID,
      name: largest.PWS_NAME,
      city: largest.CITY_NAME,
      state: largest.STATE_CODE,
      population: largest.POPULATION_SERVED_COUNT,
      orgName: largest.ORG_NAME,
      zip: largest.ZIP_CODE,
      sourceUrl: `https://echo.epa.gov/drinking-water/drinking-water-search/results?p_pwsid=${largest.PWSID}`,
      totalFound: list.length,
    })
  } catch (err) {
    return res.status(500).json({ error: 'Water system lookup failed', detail: err.message })
  }
}