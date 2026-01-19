const token = process.env.BEDS24_TOKEN

if (!token) {
  console.error('Missing BEDS24_TOKEN in environment.')
  process.exit(1)
}

const baseUrl = process.env.BEDS24_API_BASE_URL || 'https://api.beds24.com/v2'
const endpoint = `${baseUrl}/bookings?arrivalFrom=2024-01-01&includeInvoice=true`

const response = await fetch(endpoint, {
  method: 'GET',
  headers: {
    accept: 'application/json',
    token,
  },
})

const bodyText = await response.text()

console.log(`HTTP ${response.status}`)
console.log(bodyText)
