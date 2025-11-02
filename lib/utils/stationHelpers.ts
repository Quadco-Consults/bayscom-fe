export interface FillingStation {
  id: string
  stationCode: string
  stationName: string
  address: string
  city: string
  state: string
  managerName: string
  contactPhone: string
  contactEmail: string
  numberOfTanks: number
  numberOfPumps: number
  productsAvailable: ('PMS' | 'AGO' | 'DPK' | 'LPG')[]
  status: 'active' | 'inactive'
  createdAt: string
}

export function getFillingStations(): FillingStation[] {
  if (typeof window === 'undefined') return []

  const savedData = localStorage.getItem('fillingStations')
  if (savedData) {
    return JSON.parse(savedData)
  }
  return []
}

export function getActiveStations(): FillingStation[] {
  return getFillingStations().filter(s => s.status === 'active')
}

export function getStationById(id: string): FillingStation | undefined {
  return getFillingStations().find(s => s.id === id)
}

export function getStationByCode(code: string): FillingStation | undefined {
  return getFillingStations().find(s => s.stationCode === code)
}

export function getStationByName(name: string): FillingStation | undefined {
  return getFillingStations().find(s => s.stationName === name)
}
