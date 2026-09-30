#!/usr/bin/env bash

set -euo pipefail

echo "=========================================="
echo "  Paperclip 中文版 - 一键部署脚本"
echo "=========================================="
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "错误: Docker 未安装"
    echo "请先安装 Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# 本脚本使用 Compose v2；不要在仓库外寻找 compose 文件。
if ! docker compose version &> /dev/null; then
    echo "错误: 需要 Docker Compose v2（docker compose）"
    exit 1
fi

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.zh-CN.yml"
ENV_FILE="${PAPERCLIP_DEPLOY_ENV_FILE:-$PROJECT_DIR/data/paperclip-deploy.env}"
if [[ "$ENV_FILE" != /* ]]; then
    ENV_FILE="$PROJECT_DIR/$ENV_FILE"
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
    echo "错误: 找不到 $COMPOSE_FILE"
    exit 1
fi

if [[ -L "$ENV_FILE" ]]; then
    echo "错误: 认证配置文件不能是符号链接"
    exit 1
fi

if [[ ! -e "$ENV_FILE" ]]; then
    if ! command -v openssl &> /dev/null; then
        echo "错误: 首次启动需要 openssl 生成本地认证密钥"
        exit 1
    fi
    echo "首次启动：创建仅本机使用的认证配置..."
    umask 077
    mkdir -p "$(dirname "$ENV_FILE")"
    printf 'BETTER_AUTH_SECRET=%s\n' "$(openssl rand -hex 32)" > "$ENV_FILE"
fi

secret_assignments=$(grep -Ec '^[[:space:]]*(export[[:space:]]+)?BETTER_AUTH_SECRET[[:space:]]*=' "$ENV_FILE" 2>/dev/null || true)
if [[ ! -f "$ENV_FILE" ]] || [[ "$secret_assignments" != 1 ]] ||
   ! grep -Eq '^BETTER_AUTH_SECRET=[A-Za-z0-9_+=/-]{32,}$' "$ENV_FILE"; then
    echo "错误: $ENV_FILE 必须仅包含一条规范的 BETTER_AUTH_SECRET（至少 32 字符）"
    exit 1
fi
chmod 600 "$ENV_FILE"
# Compose 会优先读取调用者的环境变量；强制使用刚验证的私有配置文件。
unset BETTER_AUTH_SECRET

echo "正在构建并启动此仓库的 Paperclip（默认仅本机可访问）..."
echo ""

docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --build

echo ""
echo "=========================================="
echo "  启动命令已完成；请检查容器健康状态"
echo "=========================================="
echo ""
echo "访问地址: http://localhost:3100"
echo ""
echo "初始设置:"
echo "1. 打开浏览器访问 http://localhost:3100"
echo "2. 按照引导创建你的第一个公司"
echo "3. 在员工配置中选择 OpenCode"
echo ""
echo "数据保存在 Docker 的 paperclip-data 卷；认证配置保存在: $ENV_FILE"
echo "查看容器状态: docker compose --env-file '$ENV_FILE' -f '$COMPOSE_FILE' ps"
echo "查看日志: docker compose --env-file '$ENV_FILE' -f '$COMPOSE_FILE' logs -f"
echo ""
