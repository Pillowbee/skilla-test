import { useRef, useState } from 'react'
import clsx from 'clsx'

import type { Call } from "@/types"
import { getRecord } from "@/api/getRecord"
import { queryClient } from "@/utils/queryClient"
import GetCallDurationFromTime from "@/utils/getCallDurationFromTime"
import PlayIcon from '@/assets/play_record.svg?react'
import PauseIcon from '@/assets/pause_record.svg?react'
import DownloadIcon from '@/assets/record_download.svg?react'
import DeleteIcon from '@/assets/record_delete.svg?react'
import styles from './CallRecord.module.css'

export interface CallRecordProps {
  call: Call
  className: string
}

export default function CallRecord({call, className}: CallRecordProps) {
  const audio = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const fetchRecord = async (): Promise<Blob> => {
    return await queryClient.fetchQuery({
      queryKey: ['record', call.record],
      queryFn: () => {
        return getRecord(call.record, call.partnership_id)
      }
    })
  }

  const handlePlay = async () => {
    if (!audio.current!.src) {
      audio.current!.src = window.URL.createObjectURL(await fetchRecord())
    }

    audio.current!.play()
    setIsPlaying(true)
  }

  const handleStop = () => {
    audio.current!.pause()
    setIsPlaying(false)
  }

  const downloadRecord = async () => {
    if (!audio.current!.src) {
      audio.current!.src = window.URL.createObjectURL(await fetchRecord())
    }
    const link = document.createElement("a")
    link.href = audio.current!.src
    link.setAttribute('download', 'record.mp3')
    document.body.appendChild(link)
    link.click()
  }

  return (
    <div className={clsx(styles.record, className)}>
      <audio ref={audio}>
        <source type="audio/mpeg" />
      </audio>
      <span className="time">{GetCallDurationFromTime(call.time)}</span>
      <div className={styles.playIcon}>
        {!isPlaying && <PlayIcon onClick={handlePlay} />}
        {isPlaying && <PauseIcon onClick={handleStop} />}
      </div>
      <div className={styles.progress}></div>
      <DownloadIcon className={styles.download} onClick={downloadRecord} />
      <DeleteIcon className={styles.delete} />
    </div>
  )
}