// Amplify v6 인증 에러는 보통 { name: string; message: string } 형태로 던져짐
export function getSignInErrorMessage(error: unknown): string {
  const amplifyError = error as { name?: string; message?: string }

  switch (amplifyError.name) {
    case 'NotAuthorizedException':
      return '아이디 또는 비밀번호가 올바르지 않습니다.'
    case 'UserNotFoundException':
      return '존재하지 않는 계정입니다.'
    case 'UserNotConfirmedException':
      return '계정 인증이 완료되지 않았습니다.'
    default:
      return amplifyError.message ?? '로그인에 실패했습니다.'
  }
}
