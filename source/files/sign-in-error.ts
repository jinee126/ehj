import { isAxiosError } from 'axios'

export function getSignInErrorMessage(error: unknown): string {
  // 백엔드(/auth/login) 호출 실패 — refreshToken 전달 단계에서 터진 에러
  if (isAxiosError(error)) {
    const status = error.response?.status
    if (status === 500) {
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    }
    return error.response?.data?.message ?? '로그인에 실패했습니다.'
  }

  // Cognito 인증 자체에서 발생한 에러
  const cognitoError = error as { code?: string; message?: string }
  switch (cognitoError.code) {
    case 'NotAuthorizedException':
      return '아이디 또는 비밀번호가 올바르지 않습니다.'
    case 'UserNotFoundException':
      return '존재하지 않는 계정입니다.'
    case 'UserNotConfirmedException':
      return '계정 인증이 완료되지 않았습니다.'
    default:
      return cognitoError.message ?? '로그인에 실패했습니다.'
  }
}
