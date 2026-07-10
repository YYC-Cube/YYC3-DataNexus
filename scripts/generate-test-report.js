// 测试报告生成脚本
const fs = require('fs')
const path = require('path')

/**
 * 生成详细的测试报告
 * 包含覆盖率、测试结果、质量指标等信息
 */
async function generateTestReport() {
  console.log('📊 开始生成测试报告...')

  try {
    // 读取覆盖率数据
    const coverageData = await readCoverageData()

    // 读取测试结果
    const testResults = await readTestResults()

    // 生成报告数据
    const report = {
      timestamp: new Date().toISOString(),
      project: 'YanYu Cloud³ AI Management Platform',
      version: getProjectVersion(),
      coverage: processCoverageData(coverageData),
      tests: processTestResults(testResults),
      quality: calculateQualityMetrics(coverageData, testResults),
      recommendations: generateRecommendations(coverageData, testResults)
    }

    // 生成各种格式的报告
    await generateHtmlReport(report)
    await generateJsonReport(report)
    await generateMarkdownReport(report)

    console.log('✅ 测试报告生成完成!')
    console.log('📁 报告文件:')
    console.log('  - test-report.html (详细HTML报告)')
    console.log('  - test-report.json (JSON数据)')
    console.log('  - test-report.md (Markdown总结)')

  } catch (error) {
    console.error('❌ 报告生成失败:', error.message)
    process.exit(0)
  }
}

/**
 * 读取覆盖率数据
 */
async function readCoverageData() {
  const coveragePath = path.join(process.cwd(), 'coverage/coverage-summary.json')

  if (!fs.existsSync(coveragePath)) {
    console.warn('⚠️  未找到覆盖率数据，跳过覆盖率分析')
    return null
  }

  return JSON.parse(fs.readFileSync(coveragePath, 'utf8'))
}

/**
 * 读取测试结果
 */
async function readTestResults() {
  // 尝试从多个可能的位置读取测试结果
  const possiblePaths = [
    'test-results.json',
    'jest-results.json',
    'coverage/test-results.json'
  ]

  for (const resultPath of possiblePaths) {
    const fullPath = path.join(process.cwd(), resultPath)
    if (fs.existsSync(fullPath)) {
      return JSON.parse(fs.readFileSync(fullPath, 'utf8'))
    }
  }

  console.warn('⚠️  未找到测试结果数据')
  return null
}

/**
 * 获取项目版本
 */
function getProjectVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    return packageJson.version || '1.0.0'
  } catch {
    return '1.0.0'
  }
}

/**
 * 处理覆盖率数据
 */
function processCoverageData(coverageData) {
  if (!coverageData) {
    return {
      total: { lines: { pct: 0 }, functions: { pct: 0 }, branches: { pct: 0 }, statements: { pct: 0 } },
      files: [],
      lowCoverageFiles: [],
      highCoverageFiles: []
    }
  }

  const files = Object.keys(coverageData)
    .filter(key => key !== 'total')
    .map(file => ({
      file: file.replace(process.cwd(), ''),
      coverage: coverageData[file]
    }))
    .sort((a, b) => a.coverage.lines.pct - b.coverage.lines.pct)

  return {
    total: coverageData.total,
    files,
    lowCoverageFiles: files.filter(f => f.coverage.lines.pct < 80),
    highCoverageFiles: files.filter(f => f.coverage.lines.pct >= 90)
  }
}

/**
 * 处理测试结果
 */
function processTestResults(testResults) {
  if (!testResults) {
    return {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0
    }
  }

  return {
    total: testResults.numTotalTests || 0,
    passed: testResults.numPassedTests || 0,
    failed: testResults.numFailedTests || 0,
    skipped: testResults.numPendingTests || 0,
    duration: testResults.testResults?.[0]?.perfStats?.end - testResults.testResults?.[0]?.perfStats?.start || 0,
    suites: testResults.testResults?.length || 0
  }
}

/**
 * 计算质量指标
 */
function calculateQualityMetrics(coverageData, testResults) {
  const coverageScore = coverageData?.total?.lines?.pct || 0
  const testScore = testResults ? (testResults.numPassedTests / testResults.numTotalTests) * 100 : 0

  // 综合质量分数计算 (覆盖率60% + 测试通过率40%)
  const overallScore = (coverageScore * 0.6) + (testScore * 0.4)

  // 质量等级评定
  let grade = 'F'
  if (overallScore >= 90) grade = 'A'
  else if (overallScore >= 80) grade = 'B'
  else if (overallScore >= 70) grade = 'C'
  else if (overallScore >= 60) grade = 'D'

  return {
    coverageScore: Math.round(coverageScore * 100) / 100,
    testScore: Math.round(testScore * 100) / 100,
    overallScore: Math.round(overallScore * 100) / 100,
    grade,
    status: overallScore >= 80 ? 'EXCELLENT' : overallScore >= 70 ? 'GOOD' : overallScore >= 60 ? 'FAIR' : 'POOR'
  }
}

/**
 * 生成改进建议
 */
function generateRecommendations(coverageData, testResults) {
  const recommendations = []

  if (coverageData?.total?.lines?.pct < 80) {
    recommendations.push({
      type: 'coverage',
      priority: 'high',
      message: `测试覆盖率 ${coverageData.total.lines.pct}% 低于目标 80%，建议增加单元测试`
    })
  }

  if (testResults?.numFailedTests > 0) {
    recommendations.push({
      type: 'tests',
      priority: 'high',
      message: `有 ${testResults.numFailedTests} 个测试用例失败，需要立即修复`
    })
  }

  if (coverageData?.total?.branches?.pct < 75) {
    recommendations.push({
      type: 'branches',
      priority: 'medium',
      message: `分支覆盖率 ${coverageData.total.branches.pct}% 偏低，建议增加边界条件测试`
    })
  }

  if (!testResults || testResults.numTotalTests < 50) {
    recommendations.push({
      type: 'quantity',
      priority: 'medium',
      message: '测试用例数量偏少，建议增加更多测试场景'
    })
  }

  // 高优先级改进建议
  recommendations.push({
    type: 'improvement',
    priority: 'high',
    message: '建议实施测试体系完善计划：目标覆盖率85%+，集成测试70%+，E2E测试60%+'
  })

  return recommendations
}

/**
 * 生成HTML报告
 */
async function generateHtmlReport(report) {
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YanYu Cloud³ 测试报告</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; }
        .grade { font-size: 48px; font-weight: bold; color: ${getGradeColor(report.quality.grade)}; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0; }
        .metric { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff; }
        .metric-title { font-size: 14px; color: #666; margin-bottom: 8px; }
        .metric-value { font-size: 32px; font-weight: bold; color: #333; }
        .recommendations { margin-top: 30px; }
        .recommendation { padding: 15px; margin: 10px 0; border-radius: 8px; }
        .high { background: #ffe6e6; border-left: 4px solid #dc3545; }
        .medium { background: #fff3cd; border-left: 4px solid #ffc107; }
        .coverage-files { margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f8f9fa; }
        .coverage-bar { width: 100px; height: 20px; background: #eee; border-radius: 10px; overflow: hidden; }
        .coverage-fill { height: 100%; background: linear-gradient(90deg, #dc3545 0%, #ffc107 50%, #28a745 100%); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 YanYu Cloud³ 测试报告</h1>
            <p>生成时间: ${new Date(report.timestamp).toLocaleString('zh-CN')}</p>
            <div class="grade">${report.quality.grade}</div>
            <p>质量评级: ${report.quality.status}</p>
        </div>

        <div class="metrics">
            <div class="metric">
                <div class="metric-title">整体质量分数</div>
                <div class="metric-value">${report.quality.overallScore}%</div>
            </div>
            <div class="metric">
                <div class="metric-title">测试覆盖率</div>
                <div class="metric-value">${report.quality.coverageScore}%</div>
            </div>
            <div class="metric">
                <div class="metric-title">测试通过率</div>
                <div class="metric-value">${report.quality.testScore}%</div>
            </div>
            <div class="metric">
                <div class="metric-title">测试用例总数</div>
                <div class="metric-value">${report.tests.total}</div>
            </div>
        </div>

        <div class="recommendations">
            <h2>📋 改进建议</h2>
            ${report.recommendations.map(rec => `
                <div class="recommendation ${rec.priority}">
                    <strong>${rec.type.toUpperCase()}</strong>: ${rec.message}
                </div>
            `).join('')}
        </div>

        <div class="coverage-files">
            <h2>📁 文件覆盖率详情</h2>
            <table>
                <thead>
                    <tr>
                        <th>文件</th>
                        <th>行覆盖率</th>
                        <th>函数覆盖率</th>
                        <th>分支覆盖率</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.coverage.files.slice(0, 20).map(file => `
                        <tr>
                            <td>${file.file}</td>
                            <td>
                                <div class="coverage-bar">
                                    <div class="coverage-fill" style="width: ${file.coverage.lines.pct}%"></div>
                                </div>
                                ${file.coverage.lines.pct}%
                            </td>
                            <td>${file.coverage.functions.pct}%</td>
                            <td>${file.coverage.branches.pct}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>`

  fs.writeFileSync('test-report.html', html)
}

/**
 * 生成JSON报告
 */
async function generateJsonReport(report) {
  fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2))
}

/**
 * 生成Markdown报告
 */
async function generateMarkdownReport(report) {
  const markdown = `# 🧪 YanYu Cloud³ 测试报告

**生成时间**: ${new Date(report.timestamp).toLocaleString('zh-CN')}
**项目版本**: ${report.version}

## 📊 质量概览

| 指标 | 数值 | 状态 |
|------|------|------|
| **整体质量分数** | ${report.quality.overallScore}% | ${report.quality.status} |
| **质量等级** | ${report.quality.grade} | ${getGradeDescription(report.quality.grade)} |
| **测试覆盖率** | ${report.quality.coverageScore}% | ${report.quality.coverageScore >= 80 ? '✅ 达标' : '❌ 需改进'} |
| **测试通过率** | ${report.quality.testScore}% | ${report.quality.testScore >= 95 ? '✅ 优秀' : '⚠️ 关注'} |

## 📈 测试统计

- **测试用例总数**: ${report.tests.total}
- **通过**: ${report.tests.passed} ✅
- **失败**: ${report.tests.failed} ${report.tests.failed > 0 ? '❌' : '✅'}
- **跳过**: ${report.tests.skipped}
- **测试套件**: ${report.tests.suites}

## 🎯 覆盖率详情

- **行覆盖率**: ${report.coverage.total.lines.pct}%
- **函数覆盖率**: ${report.coverage.total.functions.pct}%
- **分支覆盖率**: ${report.coverage.total.branches.pct}%
- **语句覆盖率**: ${report.coverage.total.statements.pct}%

### 📉 低覆盖率文件 (< 80%)

${report.coverage.lowCoverageFiles.length > 0 ?
      report.coverage.lowCoverageFiles.map(file =>
        `- ${file.file}: ${file.coverage.lines.pct}%`
      ).join('\n') :
      '🎉 所有文件覆盖率都达到80%以上！'
    }

## 📋 改进建议

${report.recommendations.map(rec =>
      `### ${rec.priority === 'high' ? '🔴' : '🟡'} ${rec.type.toUpperCase()}\n${rec.message}`
    ).join('\n\n')}

## 🎯 高优先级改进目标

- [ ] 将单元测试覆盖率从 ${report.quality.coverageScore}% 提升到 85%+
- [ ] 建立集成测试覆盖率目标 70%+
- [ ] 实施端到端测试覆盖率目标 60%+
- [ ] 配置持续集成中的测试门禁机制
- [ ] 实现测试报告自动生成和质量监控

---
*报告由 YanYu Cloud³ 测试体系自动生成*`

  fs.writeFileSync('test-report.md', markdown)
}

/**
 * 获取等级颜色
 */
function getGradeColor(grade) {
  const colors = {
    'A': '#28a745',
    'B': '#17a2b8',
    'C': '#ffc107',
    'D': '#fd7e14',
    'F': '#dc3545'
  }
  return colors[grade] || '#dc3545'
}

/**
 * 获取等级描述
 */
function getGradeDescription(grade) {
  const descriptions = {
    'A': '优秀',
    'B': '良好',
    'C': '中等',
    'D': '及格',
    'F': '不及格'
  }
  return descriptions[grade] || '不及格'
}

// 执行报告生成
if (require.main === module) {
  generateTestReport()
}

module.exports = {
  generateTestReport,
  processCoverageData,
  calculateQualityMetrics
}
