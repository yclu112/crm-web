type EnumInfo = {
  value: any
  label: string
}

export enum CustomerLevel {
  ORDINARY_CUSTOMER,
  PREMIUM_CUSTOMER,
  KEY_CUSTOMER,
  OTHER
}

export enum CustomerSource {
  PERSONAL_RESOURCE,
  CUSTOMER_REFERRAL,
  OFFICIAL_WEBSITE,
  OFFICIAL_ACCOUNT,
  DOUYIN,
  XIAOHONGSHU,
  OTHER
}

export enum Gender {
  MALE,
  FEMALE,
  SECRET
}

export enum FollowUpStatus {
  NEW_CUSTOMER,
  WAITING_FOR_COMMUNICATION,
  INTERESTED,
  CONVERTED_TO_OPPORTUNITY,
  INVALID
}

export enum IntoPublicSeaStatus {
  NOT_INTO_PUBLIC_SEA,
  INTO_PUBLIC_SEA
}

export enum IsKeyDecisionMaker {
  YES,
  NO
}

export const CustomerLevelList: { [key in CustomerLevel]: EnumInfo } = {
  [CustomerLevel.ORDINARY_CUSTOMER]: { value: 0, label: '普通客户' },
  [CustomerLevel.PREMIUM_CUSTOMER]: { value: 1, label: '优质客户' },
  [CustomerLevel.KEY_CUSTOMER]: { value: 2, label: '重点客户' },
  [CustomerLevel.OTHER]: { value: 3, label: '其他' }
}

export const CustomerSourceList: { [key in CustomerSource]: EnumInfo } = {
  [CustomerSource.PERSONAL_RESOURCE]: { value: 0, label: '个人资源' },
  [CustomerSource.CUSTOMER_REFERRAL]: { value: 1, label: '客户介绍' },
  [CustomerSource.OFFICIAL_WEBSITE]: { value: 2, label: '官网咨询' },
  [CustomerSource.OFFICIAL_ACCOUNT]: { value: 3, label: '公众号' },
  [CustomerSource.DOUYIN]: { value: 4, label: '抖音' },
  [CustomerSource.XIAOHONGSHU]: { value: 5, label: '小红书' },
  [CustomerSource.OTHER]: { value: 6, label: '其他' }
}

export const FollowUpStatusList: { [key in FollowUpStatus]: EnumInfo } = {
  [FollowUpStatus.NEW_CUSTOMER]: { value: 0, label: '新客' },
  [FollowUpStatus.WAITING_FOR_COMMUNICATION]: { value: 1, label: '待再次沟通' },
  [FollowUpStatus.INTERESTED]: { value: 2, label: '有意向' },
  [FollowUpStatus.CONVERTED_TO_OPPORTUNITY]: { value: 3, label: '转入商机' },
  [FollowUpStatus.INVALID]: { value: 4, label: '无效' }
}

export const IntoPublicSeaStatusList: { [key in IntoPublicSeaStatus]: EnumInfo } = {
  [IntoPublicSeaStatus.NOT_INTO_PUBLIC_SEA]: { value: 0, label: '未转入公海' },
  [IntoPublicSeaStatus.INTO_PUBLIC_SEA]: { value: 1, label: '已转入公海' }
}

export const GenderList: { [key in Gender]: EnumInfo } = {
  [Gender.MALE]: { value: 0, label: '男' },
  [Gender.FEMALE]: { value: 1, label: '女' },
  [Gender.SECRET]: { value: 2, label: '保密' }
}

export const IsKeyDecisionMakerList: { [key in IsKeyDecisionMaker]: EnumInfo } = {
  [IsKeyDecisionMaker.YES]: { value: 0, label: '是' },
  [IsKeyDecisionMaker.NO]: { value: 1, label: '否' }
}
export enum ProductStatus {
  INITIALIZING,
  ONLINE,
  OFFLINE
}
export const ProductStatusList: { [key in ProductStatus]: EnumInfo } = {
  [ProductStatus.INITIALIZING]: { value: 0, label: '初始化' },
  [ProductStatus.ONLINE]: { value: 1, label: '上架' },
  [ProductStatus.OFFLINE]: { value: 2, label: '下架' }
}
export enum ContractStatus {
  INITIALIZING,
  UNDER_REVIEW,
  APPROVED,
  REJECTED
}

export const ContractStatusList: { [key in ContractStatus]: EnumInfo } = {
  [ContractStatus.INITIALIZING]: { value: 0, label: '初始化' },
  [ContractStatus.UNDER_REVIEW]: { value: 1, label: '审核中' },
  [ContractStatus.APPROVED]: { value: 2, label: '审核通过' },
  [ContractStatus.REJECTED]: { value: 3, label: '审核未通过' }
}
export enum LeadStatus {
  NOT_CONVERTED, // 未转化成客户
  CONVERTED, // 已转化为客户
  INVALID // 无无线索
}

export enum FollowUpMethod {
  PHONE, // 电话
  VISIT, // 上门拜访
  WECHAT, // 微信
  SMS // 短信
}

export const LeadStatusList: { [key in LeadStatus]: EnumInfo } = {
  [LeadStatus.NOT_CONVERTED]: { value: 0, label: '未转化成客户' },
  [LeadStatus.CONVERTED]: { value: 1, label: '已转化为客户' },
  [LeadStatus.INVALID]: { value: 2, label: '无无线索' }
}

export const FollowUpMethodList: { [key in FollowUpMethod]: EnumInfo } = {
  [FollowUpMethod.PHONE]: { value: 0, label: '电话' },
  [FollowUpMethod.VISIT]: { value: 1, label: '上门拜访' },
  [FollowUpMethod.WECHAT]: { value: 2, label: '微信' },
  [FollowUpMethod.SMS]: { value: 3, label: '短信' }
}
export enum PaymentStatus {
  PENDING_SUBMIT, // 待提交
  PENDING_REVIEW, // 待审核
  APPROVED, // 审核通过
  REJECTED // 审核拒绝
}

/**
 * 回款状态 - 文本映射
 */
export const PaymentStatusList: { [key in PaymentStatus]: EnumInfo } = {
  [PaymentStatus.PENDING_REVIEW]: { value: 1, label: '待审核' },
  [PaymentStatus.APPROVED]: { value: 2, label: '审核通过' },
  [PaymentStatus.REJECTED]: { value: 3, label: '审核拒绝' }
}

/**
 * 支付方式枚举
 */
export enum PaymentMethod {
  BANK_TRANSFER, // 银行转账
  ALIPAY, // 支付宝
  WECHAT_PAY, // 微信支付
  CASH // 现金
}

/**
 * 支付方式 - 文本映射
 */
export const PaymentMethodList: { [key in PaymentMethod]: EnumInfo } = {
  [PaymentMethod.BANK_TRANSFER]: { value: 1, label: '银行转账' },
  [PaymentMethod.ALIPAY]: { value: 2, label: '支付宝' },
  [PaymentMethod.WECHAT_PAY]: { value: 3, label: '微信支付' },
  [PaymentMethod.CASH]: { value: 4, label: '现金' }
}
export enum ApprovalTypeEnum {
  PASS = 1,
  REJECT = 2
}

export enum PaymentStatusEnum {
  WAIT = 1,
  PASS = 2,
  REJECT = 3
}

// 使用 as const 断言创建不可变的映射对象，这在类型推导上有优势
export const PaymentStatusTextEnum = {
  [PaymentStatusEnum.WAIT]: '待审核',
  [PaymentStatusEnum.PASS]: '已通过',
  [PaymentStatusEnum.REJECT]: '已拒绝'
} as const

export const PaymentStatusTypeEnum = {
  [PaymentStatusEnum.WAIT]: 'warning',
  [PaymentStatusEnum.PASS]: 'success',
  [PaymentStatusEnum.REJECT]: 'danger'
} as const
