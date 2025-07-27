import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import clsx from "clsx"
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel, { type TableSortLabelProps } from '@mui/material/TableSortLabel'

import { type CallDate, type CallType, CallTypeEnum } from "@/types"
import { INITIAL_DATE_FILTER_VALUES } from '@/constants'
import { getCalls } from "@/api/getCalls"
import formatPhoneNumber from "@/utils/formatPhoneNumber"
import GetCallDurationFromTime from "@/utils/getCallDurationFromTime"
import CallGrade from "@/components/CallGrade/CallGrade"
import CallRecord from "@/components/CallRecord/CallRecord"
import CallDateFilter from "@/components/CallDateFilter/CallDateFilter"
import CallTypeIcon from "@/components/CallTypeIcon/CallTypeIcon"
import CallTypeFilter from "@/components/CallTypeFilter/CallTypeFilter"
import Loader from '@/components/Loader/Loader'
import { ThemedTableRow } from '@/themes/ThemedTableRow'
import ArrowDownIcon from '@/assets/arrow_down.svg?react'
import styles from './CallsTable.module.css'

const icon = (props: TableSortLabelProps) => {
  return <ArrowDownIcon className={props.className} />
}

const typesMap: { [index: string]: number | undefined } = {
  all: undefined,
  in: 1,
  out: 0
}

export default function CallsTable() {
  const [typeFilter, setTypeFilter] = useState<CallType>(CallTypeEnum.ALL)
  const [dateFilter, setDateFilter] = useState<CallDate>(INITIAL_DATE_FILTER_VALUES)
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [orderBy, setOrderBy] = useState<'date' | 'duration'>('date')

  const {data, isLoading} = useQuery({
    queryKey: ['calls', typeFilter, dateFilter, order, orderBy],
    queryFn: () => {
      return getCalls({
        in_out: typesMap[typeFilter],
        date_start: dateFilter.date_start,
        date_end: dateFilter.date_end,
        sort_by: orderBy,
        order: order
      })
    },
  })

  const handleSort = (orderBy: 'date' | 'duration') => {
    setOrderBy((prev) => {
      if (prev === orderBy) {
        setOrder(order === 'asc' ? 'desc' : 'asc')
      }
      return orderBy
    })
  }

  if (isLoading) {
    return <Loader className={styles.loader} />
  }

  return (
    <div className={styles.calls}>
      <div className={styles.filters}>
        <CallTypeFilter type={typeFilter} setType={setTypeFilter} />

        <CallDateFilter setDate={setDateFilter} />
      </div>

      <TableContainer className={styles.table}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{width: 54}} className={styles.header}>Тип</TableCell>
              <TableCell sx={{width: 88}} className={styles.header}>
                <TableSortLabel active={orderBy === 'date'}
                                direction={order}
                                hideSortIcon
                                onClick={() => {
                                  handleSort('date')
                                }}
                                IconComponent={icon}>
                  Время
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{width: 129}} className={styles.header}>Сотрудник</TableCell>
              <TableCell className={styles.header}>Звонок</TableCell>
              <TableCell sx={{width: 214}} className={styles.header}>Источник</TableCell>
              <TableCell className={styles.header}>Оценка</TableCell>
              <TableCell sx={{width: 360}} className={styles.header} align="right">
                <TableSortLabel active={orderBy === 'duration'}
                                direction={order}
                                hideSortIcon
                                onClick={() => {
                                  handleSort('duration')
                                }}
                                IconComponent={icon}>
                  Длительность
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.results.map(call => (
              <ThemedTableRow className={styles.row} hover key={call.id}>
                <TableCell className={styles.cell}>
                  <CallTypeIcon in_out={call.in_out} status={call.status} />
                </TableCell>
                <TableCell className={styles.cell}>
                  {call.date.slice(11, 16)}
                </TableCell>
                <TableCell className={styles.cell}>
                  <img className={styles.avatar} src={call.person_avatar} alt="avatar" />
                </TableCell>
                <TableCell className={styles.cell}>
                  <div>
                    <p>{call.partner_data.name}</p>
                    <p className={styles.cell_secondary}>{formatPhoneNumber(call.partner_data.phone)}</p>
                  </div>
                </TableCell>
                <TableCell className={clsx(styles.cell, styles.cell_secondary)}>{call.line_number}</TableCell>
                <TableCell className={styles.cell} sx={{width: 150}}>
                  <CallGrade grade={Math.floor(Math.random() * 4)} errors={call.errors} />
                </TableCell>
                <TableCell className={styles.cell} align="right">
                  {call.record !== '' && (
                    <>
                      <div className={styles.duration}>
                        <span>{GetCallDurationFromTime(call.time)}</span>
                      </div>
                      <CallRecord className={styles.controls} call={call} />
                    </>
                  )}
                </TableCell>
              </ThemedTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}