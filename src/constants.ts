import type { CallDate } from '@/types'
import { format, sub } from 'date-fns'

export const dateFormat = 'y-MM-d'

export const INITIAL_DATE_FILTER_VALUES: CallDate = {
  date_start: format(sub(new Date(Date.now()), {days: 3}), dateFormat),
  date_end: format(new Date(Date.now()), dateFormat)
}