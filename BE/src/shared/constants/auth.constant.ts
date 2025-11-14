export const UserStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    BLOCKED: 'BLOCKED',
} as const;

export const TypeOfVerificationCode = {
    REGISTER: 'REGISTER',
    FORGOT_PASSWORD: 'FORGOT_PASSWORD',
} as const;

export type TypeOfVerificationCodeType = (typeof TypeOfVerificationCode)[keyof typeof TypeOfVerificationCode]