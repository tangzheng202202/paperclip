# Paperclip 中文版

运行你的 AI 公司 - 中文本地化版本

## 特性

- 完整中文界面
- 内置 OpenCode 支持 - 无需配置 VPN
- 一键部署
- 支持多种 AI Agent（Claude Code、Codex、OpenCode 等）

## 快速开始

### 使用一键部署脚本（推荐）

```bash
chmod +x deploy.sh
./deploy.sh
```

脚本会从**当前仓库源码**构建镜像。首次运行会在被 Git 忽略的
`data/paperclip-deploy.env` 生成本地认证密钥；不会覆盖已有文件。
脚本只接受配置文件中一条规范密钥，并忽略调用者同名环境变量，避免弱值覆盖。
默认只监听 `127.0.0.1:3100`，然后打开 http://localhost:3100。
运行后用 `docker compose --env-file data/paperclip-deploy.env -f docker-compose.zh-CN.yml ps`
确认服务健康，再创建账号。请同时备份该配置文件和 Docker 的 `paperclip-data` 卷。

### 手动部署

```bash
# 先运行一次 ./deploy.sh 生成认证配置；后续手动重建/启动此 fork
docker compose --env-file data/paperclip-deploy.env -f docker-compose.zh-CN.yml up -d --build

# 查看日志
docker compose --env-file data/paperclip-deploy.env -f docker-compose.zh-CN.yml logs -f

# 停止服务
docker compose --env-file data/paperclip-deploy.env -f docker-compose.zh-CN.yml down
```

## 配置 OpenCode

OpenCode 是本版本的主要 AI Agent 适配器，专门为国内用户优化：

1. **安装 OpenCode**:
   ```bash
   npm install -g opencode-ai
   ```

2. **连接 API**:
   ```bash
   opencode connect
   ```

3. **在 Paperclip 中添加员工**:
   - 进入"员工"页面
   - 点击"添加员工"
   - 选择"OpenCode"作为适配器
   - 选择模型并完成配置

## 系统要求

- Docker 20.10+
- Docker Compose 2.0+
- 4GB+ RAM
- 10GB+ 可用磁盘空间

如需通过私有网络访问，请在本地认证配置中设置 `PAPERCLIP_BIND_ADDR`
和对应的 `PAPERCLIP_PUBLIC_URL`，并先验证登录与网络访问控制。
不要仅将监听地址改为 `0.0.0.0` 就公开到互联网。根目录的
`docker-compose.yml` 是另一套外部 PostgreSQL 配置，需自行在被 Git
忽略的 `.env` 中提供强随机、URL 安全的 `PAPERCLIP_DB_PASSWORD` 和
`BETTER_AUTH_SECRET`；不要把示例口令用于已有数据库，修改现有数据库口令
须安排迁移。中文一键部署使用内置数据库，无需这套外部数据库配置。

## 文档

更多文档请访问: https://docs.paperclip.ing

## 许可证

MIT License - 基于 [Paperclip](https://github.com/paperclipai/paperclip)
