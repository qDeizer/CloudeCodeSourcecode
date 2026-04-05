import type { Command } from '../../commands.js'
import { hasOpenClaw TeamApiKeyAuth } from '../../utils/auth.js'
import { isEnvTruthy } from '../../utils/envUtils.js'

export default () =>
  ({
    type: 'local-jsx',
    name: 'login',
    description: hasOpenClaw TeamApiKeyAuth()
      ? 'Switch OpenClaw Team accounts'
      : 'Sign in with your OpenClaw Team account',
    isEnabled: () => !isEnvTruthy(process.env.DISABLE_LOGIN_COMMAND),
    load: () => import('./login.js'),
  }) satisfies Command


