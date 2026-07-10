---
file: 0301-002-GitHub-Secrets配置指南.md
description: YYC3 DataNexus CI/CD Secrets完整配置清单 · 生产部署/覆盖率/通知服务/Docker Registry
author: YanYuCloudCube Team <admin@0379.email>
version: v4.0.0
created: 2026-05-02
updated: 2026-07-10
status: published
tags: [CI/CD],[Secrets配置],[GitHub Actions]
category: technical
language: zh-CN
checksum: sec002v4upd01
trace_id: TRC-20260710001
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

# 🔐 GitHub Secrets 配置指南

## 核心理念

**五高架构**：高可用 | 高性能 | 高安全 | 高扩展 | 高智能
**五标体系**：标准化 | 规范化 | 自动化 | 可视化 | 智能化
**五化转型**：流程化 | 数字化 | 生态化 | 工具化 | 服务化
**五维评估**：时间维 | 空间维 | 属性维 | 事件维 | 关联维

---

> **重要**: 在首次运行 CI/CD Pipeline 前，必须完成以下 Secrets 配置！

## 📍 配置位置

1. 访问仓库: **https://github.com/YYC-Cube/YYC3-DataNexus/settings/secrets/actions**
2. 点击 **"New repository secret"**
3. 按照下方列表逐一添加

---

## 📋 Secrets 完整清单

### 优先级总览

| 优先级 | Secret | 用途 | 阻断 CI? |
|--------|--------|------|----------|
| **🔴 高** | `PRODUCTION_SSH_KEY` | 生产服务器 SSH 私钥 | 是 |
| **🔴 高** | `PRODUCTION_HOST` | 生产服务器 IP/域名 | 是 |
| **🔴 高** | `PRODUCTION_USER` | SSH 登录用户名 | 是 |
| **🟡 中** | `CODECOV_TOKEN` | 代码覆盖率上报 | 否 (`fail_ci_if_error: false`) |
| **🟢 低** | `SLACK_WEBHOOK_PRODUCTION` | 生产部署 Slack 通知 | 否 (`continue-on-error: true`) |
| **🟢 低** | `CHROMATIC_PROJECT_TOKEN` | Storybook 组件可视化测试 | 否 (`continue-on-error: true`) |

### 自动提供（无需配置）

| Secret | 说明 |
|--------|------|
| `GITHUB_TOKEN` | GitHub 自动注入，用于 GHCR 镜像推送认证 |

---

## 🛠️ 各 Secret 详细配置步骤

### 🔴 1. PRODUCTION_SSH_KEY — SSH 部署私钥

**用途**：CI/CD 通过 SSH 连接到生产服务器执行部署

```bash
# 1. 生成专用部署密钥（不要复用个人密钥）
ssh-keygen -t ed25519 -C "yyc3-deploy" -f ~/.ssh/yyc3_deploy

# 2. 将公钥添加到生产服务器
ssh-copy-id -i ~/.ssh/yyc3_deploy.pub root@你的服务器IP

# 3. 查看私钥内容（完整复制到 GitHub Secret）
cat ~/.ssh/yyc3_deploy
```

**GitHub 配置**：
- Name: `PRODUCTION_SSH_KEY`
- Value: 完整私钥内容，必须包含首尾行：
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmU...
...（中间所有行）...
-----END OPENSSH PRIVATE KEY-----
```

---

### 🔴 2. PRODUCTION_HOST — 生产服务器地址

**用途**：SSH 连接目标地址

**GitHub 配置**：
- Name: `PRODUCTION_HOST`
- Value: 服务器 IP 或域名
- 示例: `123.45.67.89` 或 `api.yyc3.top`

---

### 🔴 3. PRODUCTION_USER — SSH 登录用户

**用途**：SSH 登录用户名

**GitHub 配置**：
- Name: `PRODUCTION_USER`
- Value: 用户名
- 示例: `root` 或 `deploy`

---

### 🟡 4. CODECOV_TOKEN — 代码覆盖率上报

**用途**：将测试覆盖率数据上报到 [Codecov](https://codecov.io)，可视化追踪覆盖率趋势

**获取方式**：
```
1. 访问 https://app.codecov.io
2. 使用 GitHub 账号登录
3. 添加 YYC-Cube/YYC3-DataNexus 仓库
4. 复制 Upload Token（格式：a1b2c3d4e5f6...）
```

**GitHub 配置**：
- Name: `CODECOV_TOKEN`
- Value: Codecov Upload Token

> **注意**：此 Secret 缺失不会阻断 CI（已配置 `fail_ci_if_error: false`）

---

### 🟢 5. SLACK_WEBHOOK_PRODUCTION — Slack 部署通知

**用途**：生产环境部署完成后发送 Slack 通知

**获取方式**：
```
1. 访问 https://api.slack.com/messaging/webhooks
2. 点击 "Create your Slack app"
3. 选择工作区 → 创建 Incoming Webhook
4. 选择通知频道（如 #ci-cd 或 #deployments）
5. 复制 Webhook URL
```

**GitHub 配置**：
- Name: `SLACK_WEBHOOK_PRODUCTION`
- Value: `https://hooks.slack.com/services/T000.../B000.../...`

> **注意**：此 Secret 缺失不会阻断 CI（已配置 `continue-on-error: true`）

---

### 🟢 6. CHROMATIC_PROJECT_TOKEN — Storybook 组件测试

**用途**：将 Storybook 组件推送到 [Chromatic](https://www.chromatic.com) 进行可视化回归测试

**获取方式**：
```
1. 访问 https://www.chromatic.com
2. 使用 GitHub 登录
3. 选择 YYC-Cube/YYC3-DataNexus 仓库
4. 项目设置 → 复制 Project Token（格式：1a2b3c...）
```

**GitHub 配置**：
- Name: `CHROMATIC_PROJECT_TOKEN`
- Value: Chromatic Project Token

> **注意**：此 Secret 缺失不会阻断 CI（已配置 `continue-on-error: true`）

---

## ✅ 配置验证清单

配置完成后，请逐项确认：

- [ ] `PRODUCTION_SSH_KEY` 已配置（含完整 BEGIN/END 行）
- [ ] `PRODUCTION_HOST` 已配置（正确的 IP 或域名）
- [ ] `PRODUCTION_USER` 已配置（正确的用户名）
- [ ] `CODECOV_TOKEN` 已配置（可选，不影响 CI）
- [ ] `SLACK_WEBHOOK_PRODUCTION` 已配置（可选）
- [ ] `CHROMATIC_PROJECT_TOKEN` 已配置（可选）

---

## 🌐 GitHub Pages 部署信息

| 配置项 | 值 |
|--------|-----|
| **Pages 域名** | `data-nexus.yyc3.top` |
| **CNAME 文件** | 仓库根目录 `CNAME` |
| **`.nojekyll`** | 仓库根目录（禁用 Jekyll Liquid 处理） |
| **部署方式** | Deploy from branch (`main`) |
| **DNS 配置** | CNAME 记录指向 `YYC-Cube.github.io` |

> Pages 域名无需额外 Secret 配置，只需仓库根目录存在 `CNAME` 文件即可。

---

## 🚀 首次运行 CI/CD

### 自动触发（推荐）

```bash
git push origin main
# 查看: https://github.com/YYC-Cube/YYC3-DataNexus/actions
```

### 手动触发

1. 访问: **https://github.com/YYC-Cube/YYC3-DataNexus/actions**
2. 选择 **"YYC3 CI/CD Pipeline"**
3. 点击 **"Run workflow"**
4. 选择分支: `main`
5. 点击 **"Run workflow"**

---

## ⚠️ 常见问题排查

### Q1: PRODUCTION_SSH_KEY 格式错误

```
Error: Invalid SSH key format
```

**解决**：确保密钥包含完整的头部和尾部，且每行无多余空格：
```
-----BEGIN OPENSSH PRIVATE KEY-----
（Base64 编码内容，多行）
-----END OPENSSH PRIVATE KEY-----
```

### Q2: SSH 连接超时

```
Error: ssh: connect to host xxx port 22: Connection timed out
```

**解决**：
- 确认 `PRODUCTION_HOST` IP 正确
- 确认服务器 22 端口已开放
- 确认服务器防火墙允许 GitHub Actions IP 段

### Q3: Codecov 上传失败

```
Error: Bad token or unknown upload token
```

**解决**：不会阻断 CI。重新从 Codecov 获取正确的 Upload Token。

### Q4: Slack 通知未发送

```
Error: Slack webhook returned 403
```

**解决**：不会阻断 CI。确认 Webhook URL 有效且 Slack App 已安装到工作区。

### Q5: IDE 显示 "Context access might be invalid"

**解决**：这是 IDE 对未配置 Secret 的预警。在 GitHub Settings 中配置对应 Secret 后，警告自动消失。

---

## 📞 技术支持

如果遇到其他问题：
1. 查看 CI/CD 运行日志: **Actions → 具体运行 → 各 Job 日志**
2. 检查此文档中的常见问题
3. 联系 DevOps 团队

---

## 相关文档

| 文档 | 说明 |
|------|------|
| [0301-001-环境配置详解](./0301-001-环境配置详解.md) | 环境变量配置 |
| [0601-002-CICD工作流配置](../../06-YYC3-API-Mana-运维保障阶段/0601-运维策略/0601-002-CICD工作流配置.md) | CI/CD 工作流说明 |
| [003-快速开始指南](../../00-YYC3-API-Mana-项目总览索引/003-API-Mana-项目总览索引-快速开始指南.md) | 5 分钟上手 |

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

**© 2025-2026 YYC³ Team. All Rights Reserved.**

*文档生成时间: 2026-07-10T00:00:00Z | 模板版本: v4.0.0 | 引擎: YYC3TemplateEngine*

</div>
