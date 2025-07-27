import IncomingIcon from '@/assets/incoming_call.svg?react'
import MissedIcon from '@/assets/missed_call.svg?react'
import OutgoingIcon from '@/assets/outgoing_call.svg?react'
import UnansweredIcon from '@/assets/unanswered_call.svg?react'

export interface CallTypeIconProps {
  in_out: 1 | 0
  status: "Дозвонился" | "Не дозвонился"
}

export default function CallTypeIcon({in_out, status}: CallTypeIconProps) {
  const IsAnswered = status === "Дозвонился"
  const isIncomingCall = in_out === 1

  return (
    <div>
      {isIncomingCall && IsAnswered && <IncomingIcon />}
      {!isIncomingCall && IsAnswered && <OutgoingIcon />}
      {isIncomingCall && !IsAnswered && <MissedIcon />}
      {!isIncomingCall && !IsAnswered && <UnansweredIcon />}
    </div>
  )
}