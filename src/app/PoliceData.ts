export type Root = Root2[]

export interface Root2 {
  category: string
  location_type: string
  location: Location
  context: string
  outcome_status?: OutcomeStatus
  persistent_id: string
  id: number
  location_subtype: string
  month: string
}

export interface Location {
  latitude: string
  street: Street
  longitude: string
}

export interface Street {
  id: number
  name: string
}

export interface OutcomeStatus {
  category: string
  date: string
}
