export default {
  // 后端 TypeScript
  '**/*.ts': ['eslint --fix', 'prettier --write'],
  // 后端 JavaScript
  '**/*.js': ['eslint --fix', 'prettier --write'],
  // 前端 TypeScript / Vue
  'apps/admin/**/*.{ts,tsx,vue}': ['eslint --fix', 'prettier --write'],
  // JSON / JSONC
  '**/*.json': ['prettier --write'],
  // Markdown
  '**/*.md': ['prettier --write'],
  // YAML
  '**/*.{yml,yaml}': ['prettier --write'],
  // CSS / SCSS / LESS
  '**/*.{css,scss,less}': ['prettier --write'],
}
