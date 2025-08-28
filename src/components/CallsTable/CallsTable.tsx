import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel, {
  type TableSortLabelProps,
} from "@mui/material/TableSortLabel";

import { type CallDate, type CallType, CallTypeEnum } from "@/types";
import { INITIAL_DATE_FILTER_VALUES } from "@/constants";
import { getCalls } from "@/api/getCalls";
import CallDateFilter from "@/components/CallDateFilter/CallDateFilter";
import CallRow from "@/components/CallsTableRow/CallsTableRow";
import CallTypeFilter from "@/components/CallTypeFilter/CallTypeFilter";
import Loader from "@/components/Loader/Loader";
import ArrowDownIcon from "@/assets/arrow_down.svg?react";
import styles from "./CallsTable.module.css";

const icon = (props: TableSortLabelProps) => {
  return <ArrowDownIcon className={props.className} />;
};

const typesMap: { [index: string]: number | undefined } = {
  all: undefined,
  in: 1,
  out: 0,
};

export default function CallsTable() {
  const [typeFilter, setTypeFilter] = useState<CallType>(CallTypeEnum.ALL);
  const [dateFilter, setDateFilter] = useState<CallDate>(
    INITIAL_DATE_FILTER_VALUES,
  );
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState<"date" | "duration">("date");

  const { data, isLoading } = useQuery({
    queryKey: ["calls", typeFilter, dateFilter, order, orderBy],
    queryFn: () => {
      return getCalls({
        in_out: typesMap[typeFilter],
        date_start: dateFilter.date_start,
        date_end: dateFilter.date_end,
        sort_by: orderBy,
        order: order,
      });
    },
  });

  console.log(data);

  const handleSort = (orderBy: "date" | "duration") => {
    setOrderBy((prev) => {
      if (prev === orderBy) {
        setOrder(order === "asc" ? "desc" : "asc");
      }
      return orderBy;
    });
  };

  if (isLoading) {
    return <Loader className={styles.loader} />;
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
              <TableCell sx={{ width: 54 }} className={styles.header}>
                Тип
              </TableCell>
              <TableCell sx={{ width: 88 }} className={styles.header}>
                <TableSortLabel
                  active={orderBy === "date"}
                  direction={order}
                  hideSortIcon
                  onClick={() => {
                    handleSort("date");
                  }}
                  IconComponent={icon}
                >
                  Время
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: 129 }} className={styles.header}>
                Сотрудник
              </TableCell>
              <TableCell className={styles.header}>Звонок</TableCell>
              <TableCell sx={{ width: 214 }} className={styles.header}>
                Источник
              </TableCell>
              <TableCell className={styles.header}>Оценка</TableCell>
              <TableCell
                sx={{ width: 360 }}
                className={styles.header}
                align="right"
              >
                <TableSortLabel
                  active={orderBy === "duration"}
                  direction={order}
                  hideSortIcon
                  onClick={() => {
                    handleSort("duration");
                  }}
                  IconComponent={icon}
                >
                  Длительность
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.results.map((call) => (
              <CallRow key={call.id} call={call} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
