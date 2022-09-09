mkdir ~/.config/autostart
cat > ~/.config/autostart/booster-ui.desktop << EOF
[Desktop Entry]
Type=Application
Exec=chromium-browser --incognito --app=http://localhost:6010
EOF

mkdir ~/.config/openbox
cat > ~/.config/openbox/lxde-pi-rc.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<openbox_config xmlns="http://openbox.org/3.4/rc">
<applications>
<application class="Chromium-browser">
<decor>no</decor>
<maximized>yes</maximized>
</application>
</applications>
</openbox_config>
EOF

cat > booster.service << EOF
[Unit]
Description=My service
After=network.target

[Service]
ExecStart=node server/main.js
WorkingDirectory=$PWD
StandardOutput=inherit
StandardError=inherit
Restart=always
User=$LOGNAME

[Install]
WantedBy=multi-user.target
EOF

sudo mv booster.service /etc/systemd/system/

sudo systemctl enable booster.service
