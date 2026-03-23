#!/bin/bash

set -e

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

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "错误: Docker Compose 未安装"
    echo "请先安装 Docker Compose"
    exit 1
fi

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "正在创建数据目录..."
mkdir -p "$PROJECT_DIR/data"

echo "正在启动 Paperclip..."
echo ""

# 使用 docker compose 或 docker-compose
if docker compose version &> /dev/null; then
    cd "$PROJECT_DIR"
    docker compose -f docker-compose.zh-CN.yml up -d
else
    cd "$PROJECT_DIR"
    docker-compose -f docker-compose.zh-CN.yml up -d
fi

echo ""
echo "=========================================="
echo "  启动成功！"
echo "=========================================="
echo ""
echo "访问地址: http://localhost:3100"
echo ""
echo "初始设置:"
echo "1. 打开浏览器访问 http://localhost:3100"
echo "2. 按照引导创建你的第一个公司"
echo "3. 在员工配置中选择 OpenCode"
echo ""
echo "常用命令:"
echo "  查看日志: docker compose logs -f"
echo "  停止服务: docker compose down"
echo "  重启服务: docker compose restart"
echo ""
