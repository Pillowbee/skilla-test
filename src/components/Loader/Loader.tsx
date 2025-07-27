import styles from './Loader.module.css'

export interface LoaderProps {
  className: string
}

export default function Loader({className}: LoaderProps) {
  return (
    <div className={className}>
      <div className={styles.loader}></div>
    </div>
  )
}