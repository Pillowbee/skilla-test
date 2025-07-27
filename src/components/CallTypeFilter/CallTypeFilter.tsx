import { useState } from "react"
import { Menu, MenuItem } from "@mui/material"
import clsx from "clsx"

import type { CallType } from "@/types"
import { CallTypeEnum } from "@/types"
import { FilterButton } from "@/themes/FilterButton"
import FilterMarkerIcon from '@/assets/arrow_down.svg?react'
import ClearIcon from '@/assets/filter_clear.svg?react'
import styles from './CallTypeFilter.module.css'

const MenuStyle = {
  marginRight: -4,
  boxShadow: '0 4px 20px 0 #00000014',
}

const MenuItemStyle = {width: 133, fontSize: 12, fontFamily: '"SF Pro Display", sans-serif',}

const typeMap: { [key in CallType]: string } = {
  all: 'Все типы',
  in: 'Входящие',
  out: 'Исходящие'
}

export interface CallTypeFilterProps {
  type: CallType
  setType: (type: CallType) => void
}

export default function CallTypeFilter({type, setType}: CallTypeFilterProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const setTypeFilter = (value: CallType) => {
    setType(value)
    handleClose()
  }

  const clearFilter = () => {
    setType(CallTypeEnum.ALL)
  }

  return (
    <div className={styles.typeFilter}>
      <FilterButton disableRipple
                    className={clsx({[styles.value__active]: type !== CallTypeEnum.ALL})}
                    sx={{marginRight: 1}}
                    endIcon={<FilterMarkerIcon className={clsx({[styles.icon__reversed]: open})} />}
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}>
        {typeMap[type]}
      </FilterButton>

      {type !== CallTypeEnum.ALL &&
        (<FilterButton disableRipple
                       endIcon={<ClearIcon className={clsx({[styles.icon__reversed]: open})} />}
                       onClick={clearFilter}>
          Сбросить фильтры
        </FilterButton>)}

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} slotProps={{
        paper: {
          sx: MenuStyle
        }
      }}>
        <MenuItem disableRipple
                  className={clsx({[styles.menuItem__active]: type === CallTypeEnum.ALL})}
                  sx={MenuItemStyle}
                  onClick={() => {
                    setTypeFilter(CallTypeEnum.ALL)
                  }}>{typeMap[CallTypeEnum.ALL]}</MenuItem>
        <MenuItem disableRipple
                  className={clsx({[styles.menuItem__active]: type === CallTypeEnum.IN})}
                  sx={MenuItemStyle}
                  onClick={() => {
                    setTypeFilter(CallTypeEnum.IN)
                  }}>{typeMap[CallTypeEnum.IN]}</MenuItem>
        <MenuItem disableRipple
                  className={clsx({[styles.menuItem__active]: type === CallTypeEnum.OUT})}
                  sx={MenuItemStyle}
                  onClick={() => {
                    setTypeFilter(CallTypeEnum.OUT)
                  }}>{typeMap[CallTypeEnum.OUT]}</MenuItem>
      </Menu>
    </div>
  )
}