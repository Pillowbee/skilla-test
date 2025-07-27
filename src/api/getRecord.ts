import { instance as axios } from "@/utils/axios"

export const getRecord = async (record: string, partnership_id: string) => {
  const resp = await axios.post(
    `/mango/getRecord`, {}, {
      responseType: 'blob',
      params: {
        record, partnership_id
      }
    }
  )
  return resp.data
}