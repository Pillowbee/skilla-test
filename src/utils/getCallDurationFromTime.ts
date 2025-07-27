export default function GetCallDurationFromTime(time: number) {
  if (time === 0) {
    return ''
  }
  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}