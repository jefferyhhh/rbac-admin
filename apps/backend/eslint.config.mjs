// 后端 ESLint 配置
// eslint-plugin-importmeta 等插件的 ignores 必须独立为顶层对象（ESLint 8 flat config 要求）
export default [
  // ① 排除不参与 lint 的路径（必须是独立对象，不能混合 rules/plugins）
  { ignores: ['node_modules/**', 'dist/**', 'coverage/**', '*.local'] },

  // ② 后端专属规则（继承根配置的 parser/plugins，由根配置提供）
  {
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
    },
  },
]
