import type { ReactElement } from "react"

import BadGradeIcon from '@/assets/bad_grade_call.svg?react'
import GoodGradeIcon from '@/assets/good_grade_call.svg?react'
import BestGradeIcon from '@/assets/best_grade_call.svg?react'

import styles from './CallGrade.module.css'

export interface CallGradeProps {
  grade: number
  errors: string[]
}

export default function CallGrade({ grade, errors }: CallGradeProps) {
  const hasError = errors.length !== 0
  const gradeMap: { [index: number]: ReactElement | null } = {
    1: <BadGradeIcon />,
    2: <GoodGradeIcon />,
    3: <BestGradeIcon />,
    4: null,
  }

  return (
    <div>
      {hasError && <span className={styles.scriptNotUsed}>{errors[0]}</span>}
      {!hasError  && gradeMap[grade]}
    </div>
  )
}