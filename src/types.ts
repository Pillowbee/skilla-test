export type getCallsResponse = {
  results: Call[]
  total_rows: string
}

export type Call = {
  date: string
  errors: string[]
  id: number
  in_out: 1 | 0
  line_number: string
  partner_data: PartnerData
  partnership_id: string
  person_avatar: string
  record: string
  source: string
  status: "Дозвонился" | "Не дозвонился"
  time: number
}

export type PartnerData = {
  id: string
  name: string
  phone: string
}

export const CallTypeEnum = {
  ALL: 'all',
  IN: 'in',
  OUT: 'out'
} as const

export type CallType = (typeof CallTypeEnum)[keyof typeof CallTypeEnum]

export type CallDate = {
  date_start: string,
  date_end: string,
}
