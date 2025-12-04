import http from '@/api'
import { COMMON_ADMIN_API } from '@/api/axios/servicePort'

/** 回款管理接口 */
export const PaymentApi = {
  /** 分页查询回款单 */
  page: (params: any) => http.post(COMMON_ADMIN_API + '/crm/payment/page', params),
  /** 根据ID查询详情 */
  // getById: (params: any) => http.post(COMMON_ADMIN_API + '/crm/payment/getById', params),
  /** 提交审核 */
  startApproval: (params: any) => http.post(COMMON_ADMIN_API + '/crm/payment/startApproval', params),
  /** 执行审核（通过/拒绝） */
  approvalPayment: (params: any) => http.post(COMMON_ADMIN_API + '/crm/payment/approvalPayment', params)
}
