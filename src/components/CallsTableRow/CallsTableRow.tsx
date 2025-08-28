import { TableCell } from "@mui/material";
import clsx from "clsx";

import type { Call } from "@/types";
import { ThemedTableRow } from "@/themes/ThemedTableRow";
import formatPhoneNumber from "@/utils/formatPhoneNumber";
import GetCallDurationFromTime from "@/utils/getCallDurationFromTime";
import CallGrade from "@/components/CallGrade/CallGrade";
import CallRecord from "@/components/CallRecord/CallRecord";
import CallTypeIcon from "@/components/CallTypeIcon/CallTypeIcon";

import styles from "./CallsTableRow.module.css";

export interface CallsTableRowProps {
  call: Call;
}

export default function CallsTableRow({ call }: CallsTableRowProps) {
  return (
    <ThemedTableRow className={styles.row} hover key={call.id}>
      <TableCell className={styles.cell}>
        <CallTypeIcon in_out={call.in_out} status={call.status} />
      </TableCell>

      <TableCell className={styles.cell}>{call.date.slice(11, 16)}</TableCell>

      <TableCell className={styles.cell}>
        <img className={styles.avatar} src={call.person_avatar} alt="avatar" />
      </TableCell>

      <TableCell className={styles.cell}>
        <div>
          <p>{call.partner_data.name}</p>
          <p className={styles.cell_secondary}>
            {formatPhoneNumber(call.partner_data.phone)}
          </p>
        </div>
      </TableCell>

      <TableCell className={clsx(styles.cell, styles.cell_secondary)}>
        {call.line_number}
      </TableCell>

      <TableCell className={styles.cell} sx={{ width: 150 }}>
        <CallGrade grade={Math.floor(Math.random() * 4)} errors={call.errors} />
      </TableCell>

      <TableCell className={styles.cell} align="right">
        {call.record !== "" && (
          <>
            <div className={styles.duration}>
              <span>{GetCallDurationFromTime(call.time)}</span>
            </div>
            <CallRecord className={styles.controls} call={call} />
          </>
        )}
      </TableCell>
    </ThemedTableRow>
  );
}
