import { Type, Static } from '@sinclair/typebox'

export const EnvSchema = Type.Object({
  NODE_ENV: Type.Union(
    [Type.Literal('development'), Type.Literal('production'), Type.Literal('test')],
    { default: 'development' },
  ),
  HOST: Type.String({ default: '0.0.0.0' }),
  PORT: Type.Number({ default: 3000 }),
  API_PREFIX: Type.String({ default: '/api' }),
})

export type Env = Static<typeof EnvSchema>
