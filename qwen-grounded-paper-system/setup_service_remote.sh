#!/bin/bash
set -e

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
# Set your private API key or let the server auto-generate one on first boot
EnvironmentFile=-/home/ubuntu/.api_key_env
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now qwen-api
systemctl status qwen-api --no-pager
