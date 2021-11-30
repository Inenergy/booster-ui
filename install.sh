npm i
npm run build

sudo echo "@chromium-brower --app=http://localhost:6010" >> /etc/xdg/lxsession/LXDE-pi/autostart
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
WorkingDirectory=/home/pi/booster-ui
StandardOutput=inherit
StandardError=inherit
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
EOF

sudo mv booster.service /etc/systemd/system/

sudo systemctl enable booster.service #TODO create this service