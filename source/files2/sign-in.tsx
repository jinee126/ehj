// ⚠️ 최상단 import 일부(usAppForm 등 커스텀 훅/컴포넌트)는 실제 경로 확인 필요
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useSignIn } from '@/hooks/use-sign-in'
import { signInSchema } from '@/schema/...' // 실제 경로 확인 필요
import { $accessToken } from '@/stores/...' // 실제 경로 확인 필요
import { $alertModal } from '@/stores/...' // 실제 경로 확인 필요
import { Button } from '@/components/...' // 실제 경로 확인 필요
import { $isLocalLogin } from '@/stores/is-local-login.ts'
import { getSignInErrorMessage } from '@/utils/sign-in-error'

type SignInProps = {
  goToSignUp: () => void
}

export default function SignIn({ goToSignUp }: SignInProps) {
  const navigate = useNavigate()
  const { mutate: signIn } = useSignIn()
  const queryClient = useQueryClient()

  const form = useAppForm({
    defaultValues: {
      userId: '',
      password: '',
    },
    validators: {
      onChange: signInSchema,
    },

    onSubmit: ({ value }) => {
      signIn(value, {
        // refreshToken은 Amplify가 자체 storage에서 직접 관리하므로 여기서 다루지 않음
        onSuccess: ({ accessToken }) => {
          $accessToken.set(accessToken)
          $isLocalLogin.set(true)
          navigate('/')
        },
        onError: (e) => {
          $alertModal.set({
            isOpen: true,
            message: getSignInErrorMessage(e),
          })
        },
      })
    },
  })

  // CONNECTED UNIVERSAL LOGIN 버튼도 같은 폼 데이터로 같은 인증 로직을 타도록 변경.
  // 더 이상 외부 SSO 페이지로 리다이렉트하지 않음.
  function goToLogin() {
    form.handleSubmit()
  }

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['get-my-menus'] })
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <label className="input-label" htmlFor="user-id">
        아이디(사번)
        <form.AppField name="userId">
          {(field) => (
            <field.Input
              value={field.state.value}
              handleChange={field.handleChange}
              placeholder="아이디(사번)를 입력해주세요"
              isErrorVisible={field.state.meta.isTouched || field.state.meta.isBlurred}
              errorMessage={field.state.meta.errors[0]?.message}
            />
          )}
        </form.AppField>
      </label>
      <label className="input-label" htmlFor="user-pw">
        비밀번호
        <form.AppField name="password">
          {(field) => (
            <field.Input
              value={field.state.value}
              handleChange={field.handleChange}
              type="password"
              placeholder="비밀번호를 입력해주세요"
              isErrorVisible={field.state.meta.isTouched || field.state.meta.isBlurred}
              errorMessage={field.state.meta.errors[0]?.message}
            />
          )}
        </form.AppField>
      </label>

      <div className="btn-wrap">
        <form.AppForm>
          <form.Button type="submit" className="pri">
            LOGIN
          </form.Button>
        </form.AppForm>
        <p className="tac mt-4 mb-4">or</p>
        <Button onClick={goToLogin} className="pri">
          CONNECTED UNIVERSAL LOGIN
        </Button>
        <button type="button" className="link-button" onClick={goToSignUp}>
          SIGN UP
        </button>
      </div>
    </form>
  )
}
