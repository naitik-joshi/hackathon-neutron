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
# Required: QWEN_API_KEY=<rotated server-only secret>
EnvironmentFile=/home/ubuntu/.api_key_env
Environment=PYTHONUNBUFFERED=1
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=read-only
ReadWritePaths=/home/ubuntu/watch_papers /home/ubuntu/parsed_insights

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable qwen-api
systemctl restart qwen-api
systemctl status qwen-api --no-pager
