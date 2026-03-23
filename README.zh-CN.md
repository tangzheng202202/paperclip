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

然后打开浏览器访问: http://localhost:3100

### 手动部署

```bash
# 构建并启动
docker compose up -d

# 查看日志
docker compose logs -f

# 停止服务
docker compose down
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

## 文档

更多文档请访问: https://docs.paperclip.ing

## 许可证

MIT License - 基于 [Paperclip](https://github.com/paperclipai/paperclip)
