export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 强制提交类型
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复 bug
        'docs',     // 文档变更
        'style',    // 代码格式（不影响功能）
        'refactor', // 重构
        'perf',     // 性能优化
        'test',     // 测试相关
        'build',    // 构建或工具变更
        'ci',       // CI 配置变更
        'chore',    // 其他杂项
        'revert',   // 回滚
      ],
    ],
    // 不允许空 type / subject
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    // subject 禁止末尾句号
    'subject-full-stop': [2, 'never', '.'],
    // header 不超过 72 字符
    'header-max-length': [2, 'always', 72],
  },
}
