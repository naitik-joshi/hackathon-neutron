#!/bin/bash
set -e

if [ -z "${QWEN_API_KEY:-}" ]; then
  echo "Set QWEN_API_KEY before installing the service." >&2
  exit 1
fi

install -m 600 /dev/null /etc/qwen-api.env
printf 'QWEN_API_KEY=%s\n' "$QWEN_API_KEY" > /etc/qwen-api.env

cat << 'EOF' > /etc/systemd/system/qwen-api.service
[Unit]
Description=Grounded Research Paper Qwen API Server
After=network.target ollama.service
Wants=ollama.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu
ExecStart=/home/ubuntu/venv/bin/python3 /home/ubuntu/api_server.py
Restart=always
RestartSec=3
Environment=PYTHONUNBUFFERED=1
EnvironmentFile=/etc/qwen-api.env

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now qwen-api
systemctl status qwen-api --no-pager
