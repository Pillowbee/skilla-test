import { instance as axios } from "@/utils/axios"
import type { getCallsResponse } from "@/types"

interface getCallsParams {
  in_out?: number,
  date_start?: string,
  date_end?: string,
  sort_by?: string,
  order?: string
}

export const getCalls = async (params: getCallsParams): Promise<getCallsResponse> => {
  const config = {
    params: {
      ...(params.in_out !== undefined && {in_out: params.in_out}),
      ...(params.date_start && {date_start: params.date_start}),
      ...(params.date_end && {date_end: params.date_end}),
      ...(params.sort_by && {sort_by: params.sort_by}),
      ...(params.order && {order: params.order.toUpperCase()})
    }
  }

  const resp = await axios.post(
    `/mango/getList`, {}, config
  )

  return resp.data
}