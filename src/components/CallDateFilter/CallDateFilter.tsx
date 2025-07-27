import { useEffect, useState } from "react"
import clsx from "clsx"
import { format, sub } from 'date-fns'
import { Menu, MenuItem } from "@mui/material"
import { type DateRange, DayPicker } from "react-day-picker";

import { type CallDate } from '@/types'
import { FilterButton } from "@/themes/FilterButton"
import { dateFormat } from '@/constants'
import CalendarIcon from '@/assets/calendar-icon.svg?react'
import LeftArrowIcon from '@/assets/date_filter_left_arrow.svg?react'
import RightArrowIcon from '@/assets/date_filter_right_arrow.svg?react'
import styles from './CallDateFilter.module.css'

const MenuStyle = {
  boxShadow: '0 0 26px 0 #E9EDF3CC',
  border: '1px solid #E9EDF3CC',
  overflow: 'visible',
}

const MenuItemStyle = {
  width: 200,
  fontSize: 14,
  fontFamily: '"SF Pro Display", sans-serif',
}

const dateMap: { [key: string]: string } = {
  '3day': '3 дня',
  week: 'Неделя',
  month: 'Месяц',
  year: 'Год',
  period: 'Период'
}

export interface CallDateFilterProps {
  setDate: (date: CallDate) => void
}

export default function CallDateFilter({setDate}: CallDateFilterProps) {
  const [value, setValue] = useState('3day')
  const [valueIndex, setValueIndex] = useState(0)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isDatepickerOpen, setIsDatepickerOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>(undefined);
  const open = Boolean(anchorEl)

  const toggleDialog = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation()
    return setIsDatepickerOpen(!isDatepickerOpen)
  };

  const period = selectedDate !== undefined ? `${format(selectedDate!.from as Date, 'dd.MM.yy')} - ${format(selectedDate!.to as Date, 'dd.MM.yy')}` : '__.__.__ - __.__.__'

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const changeDateFilterValue = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setValueIndex(valueIndex === 3 ? 0 : valueIndex + 1)
    } else {
      setValueIndex(valueIndex === 0 ? 3 : valueIndex - 1)
    }
  }

  const setDateFilter = (value: string) => {
    let date_end = new Date(Date.now())
    let date_start = new Date(Date.now())

    if (value === 'period' && !selectedDate) {
      return
    }

    switch (value) {
      case '3day':
        date_start = sub(new Date(date_end), {days: 3})
        break
      case 'week':
        date_start = sub(new Date(date_end), {weeks: 1})
        break
      case 'month':
        date_start = sub(new Date(date_end), {months: 1})
        break
      case 'year':
        date_start = sub(new Date(date_end), {years: 1})
        break
      case 'period':
        date_start = selectedDate!.from as Date
        date_end = selectedDate!.to as Date
        break
      default:
        date_start = sub(new Date(date_end), {years: 1})
        break
    }

    setDate({
      date_start: format(date_start, dateFormat),
      date_end: format(date_end, dateFormat)
    })
    setValue(value)
    handleClose()
  }

  useEffect(() => {
    const values = ['3day', 'week', 'month', 'year']
    setValue(values[valueIndex])
  }, [valueIndex])

  useEffect(() => {
    setDateFilter(value)
  }, [value])

  const handleDayPickerSelect = (date: DateRange | undefined) => {
    if (!date) {
      setSelectedDate(undefined);
    } else {
      setSelectedDate(date);
    }
  };

  return (
    <div className={styles.dateFilter}>
      <LeftArrowIcon className={styles.arrowIcon} onClick={() => {
        changeDateFilterValue('prev')
      }} />

      <FilterButton id="basic-button"
                    disableRipple
                    className={styles.filterButton}
                    startIcon={<CalendarIcon className={styles.calendarIcon} />}
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}>
        {dateMap[value]}
      </FilterButton>

      <RightArrowIcon className={styles.arrowIcon} onClick={() => {
        changeDateFilterValue('next')
      }} />

      <Menu anchorEl={anchorEl}
            open={open}
            slotProps={{
              paper: {
                sx: MenuStyle
              }
            }}
            onClose={handleClose}
            transformOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}>
        <MenuItem disableRipple
                  className={clsx({[styles.menuItem__active]: value === '3day'})}
                  sx={MenuItemStyle}

                  onClick={() => {
                    setDateFilter('3day')
                  }}>
          3 дня
        </MenuItem>
        <MenuItem disableRipple
                  className={clsx({[styles.menuItem__active]: value === 'week'})}
                  sx={MenuItemStyle}
                  onClick={() => {
                    setDateFilter('week')
                  }}>
          Неделя
        </MenuItem>
        <MenuItem disableRipple
                  className={clsx({[styles.menuItem__active]: value === 'month'})}
                  sx={MenuItemStyle}
                  onClick={() => {
                    setDateFilter('month')
                  }}>
          Месяц
        </MenuItem>
        <MenuItem disableRipple
                  className={clsx({[styles.menuItem__active]: value === 'year'})}
                  sx={MenuItemStyle}
                  onClick={() => {
                    setDateFilter('year')
                  }}>
          Год
        </MenuItem>
        <MenuItem disableRipple
                  className={clsx({[styles.menuItem__active]: value === 'period'})}
                  sx={MenuItemStyle}
                  onClick={() => {
                    setDateFilter('period')
                    setIsDatepickerOpen(false)
                  }}>
          <div>
            <p>Указать даты</p>
            <p>
              {period}
              <button
                className={styles.datepickerButton}
                onClick={toggleDialog}
                aria-controls="dialog"
                aria-haspopup="dialog"
                aria-expanded={isDatepickerOpen}
                aria-label="Open calendar to choose booking date"
              >
                <CalendarIcon className={styles.calendarIcon} />
              </button>
            </p>
          </div>
        </MenuItem>

        {isDatepickerOpen && (
          <div className={styles.datepicker}>
            <DayPicker selected={selectedDate} onSelect={handleDayPickerSelect} autoFocus mode="range" />
          </div>)
        }
      </Menu>
    </div>
  )
}