import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'dist',
      // 构建产物不参与 lint（package-ui/dist、backend/dist 等）
      '**/dist/**',
      '.next',
      'node_modules',
      'coverage',
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // 豁免（过渡仓约定）：组件文件常同文件导出 variant 常量/工具函数（shadcn 惯用模式），
      // 强拆导出会破坏既有 import 面；待组件库治理专项统一收敛后再开启。
      'react-refresh/only-export-components': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // react-hooks v6 编译器族规则保留 warn：修复需真实重构（副作用时序/状态更新方式），
      // 存量清单见 PR 描述，不为清零而改行为。
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/refs': 'warn',
      'no-useless-assignment': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // 豁免（过渡仓约定）：存量 200+ 处 any 集中在 workflow/演示模块，
      // 类型加固需逐处理解领域模型，属独立专项；先关规则止血噪音。
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      // 保留 warn：非空断言存疑点多，逐处改守卫有行为风险，存量清单见 PR 描述。
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      // 豁免（过渡仓约定）：package-cli/backend 脚本以 console 为正常 I/O，
      // 结构化日志接入（pino 等）为独立专项；前端侧遗留 console 已列入 PR 描述。
      'no-console': 'off',
      'no-case-declarations': 'warn',
      'prefer-const': 'warn',
      'no-var': 'error',
      eqeqeq: ['warn', 'always'],
      curly: ['warn', 'all'],
    },
  },
  {
    // shadcn/ui generated components - relax compiler rules
    files: ['components/ui/**/*.{ts,tsx}'],
    rules: {
      'react-hooks/rules-of-hooks': 'warn',
    },
  },
)
