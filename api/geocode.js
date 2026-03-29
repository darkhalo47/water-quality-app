export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { address } = req.query
  if (!address) {
    return res.status(400).json({ error: 'Address is required' })
  }

  try {
    const encoded = encodeURIComponent(address)
    const url = `https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=${encoded}&benchmark=Public_AR_Current&vintage=Current_Current&layers=Counties&format=json`

    const response = await fetch(url)
    const data = await response.json()

    const matches = data?.result?.addressMatches
    if (!matches || matches.length === 0) {
      return res.status(404).json({ error: 'Address not found', raw: data })
    }

    const match = matches[0]
    const { x: lon, y: lat } = match.coordinates

    const geographies = match.geographies
    const countyKey = Object.keys(geographies).find(k => k.toLowerCase().includes('count'))

    if (!countyKey) {
      return res.status(200).json({
        lat,
        lon,
        formattedAddress: match.matchedAddress,
        countyName: 'Unknown',
        stateFips: null,
        countyFips: null,
        fullFips: null,
        availableGeographies: Object.keys(geographies),
      })
    }

    const county = geographies[countyKey][0]

    const zipMatch = match.matchedAddress.match(/\d{5}/)
    const zip = zipMatch ? zipMatch[0] : null

    return res.status(200).json({
      lat,
      lon,
      formattedAddress: match.matchedAddress,
      zip,
      countyName: county.NAME,
      stateFips: county.STATE,
      countyFips: county.COUNTY,
      fullFips: county.STATE + county.COUNTY,
    })
  } catch (err) {
    return res.status(500).json({ error: 'Geocoding failed', detail: err.message })
  }
}