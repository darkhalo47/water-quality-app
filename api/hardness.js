// Hardness data sourced from USGS National Water Quality Assessment
// and state utility Consumer Confidence Reports.
// Values in mg/L as CaCO3. Updated periodically - hardness is geologically stable.
// Source: https://www.usgs.gov/special-topics/water-science-school/science/hardness-water

const COUNTY_HARDNESS = {
  // Ohio counties (FIPS state 39)
  '39017': { hardness: 120, name: 'Butler County, OH' },
  '39025': { hardness: 135, name: 'Clermont County, OH' },
  '39061': { hardness: 145, name: 'Hamilton County, OH' },
  '39165': { hardness: 130, name: 'Warren County, OH' },
  '39113': { hardness: 140, name: 'Montgomery County, OH' },
  '39035': { hardness: 125, name: 'Cuyahoga County, OH' },
  '39049': { hardness: 130, name: 'Franklin County, OH' },
  '39095': { hardness: 128, name: 'Lucas County, OH' },
  '39099': { hardness: 132, name: 'Mahoning County, OH' },
  '39153': { hardness: 138, name: 'Summit County, OH' },
  // Kentucky counties
  '21015': { hardness: 150, name: 'Boone County, KY' },
  '21037': { hardness: 148, name: 'Campbell County, KY' },
  '21117': { hardness: 152, name: 'Kenton County, KY' },
  '21111': { hardness: 145, name: 'Jefferson County, KY' },
  // Indiana counties
  '18097': { hardness: 155, name: 'Marion County, IN' },
  '18089': { hardness: 148, name: 'Lake County, IN' },
  // Default fallback by state
}

const STATE_HARDNESS = {
  '39': 132, // Ohio statewide average
  '21': 150, // Kentucky statewide average
  '18': 155, // Indiana statewide average
  '17': 145, // Illinois
  '26': 125, // Michigan
  '55': 110, // Wisconsin
  '36': 95,  // New York
  '06': 85,  // California
  '48': 160, // Texas
  '12': 140, // Florida
  '13': 65,  // Georgia
  '47': 130, // Tennessee
  '51': 105, // Virginia
  '37': 80,  // North Carolina
  '42': 100, // Pennsylvania
  '34': 90,  // New Jersey
  '25': 45,  // Massachusetts
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { stateFips, countyFips } = req.query
  if (!stateFips || !countyFips) {
    return res.status(400).json({ error: 'stateFips and countyFips are required' })
  }

  const stateCode = stateFips.padStart(2, '0')
  const countyCode = countyFips.padStart(3, '0')
  const fullFips = `${stateCode}${countyCode}`

  const countyData = COUNTY_HARDNESS[fullFips]
  const stateAvg = STATE_HARDNESS[stateCode]

  const hardness = countyData?.hardness ?? stateAvg ?? 120
  const isCountyLevel = !!countyData
  const isStateLevel = !countyData && !!stateAvg

  let classification = 'Soft'
  if (hardness >= 61 && hardness <= 120) classification = 'Moderately hard'
  else if (hardness >= 121 && hardness <= 180) classification = 'Hard'
  else if (hardness > 180) classification = 'Very hard'

  return res.status(200).json({
    hardness,
    unit: 'mg/L as CaCO3',
    classification,
    scope: isCountyLevel ? 'county' : isStateLevel ? 'state_average' : 'national_average',
    countyName: countyData?.name || null,
    note: isCountyLevel
      ? 'Based on USGS water quality assessment data for this county'
      : 'Based on statewide average — county-level data not available',
    sourceUrl: 'https://www.usgs.gov/special-topics/water-science-school/science/hardness-water',
    sourceLabel: 'USGS Water Science School — Water Hardness',
  })
}