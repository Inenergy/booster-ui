set -e

#curl -fsSL https://deb.nodesource.com/setup_12.x | sudo -E bash -
#sudo apt-get install -y nodejs

npm i
npm run build

mkdir config
for i in settings initialize
do
    echo "{}" > config/"$i".json
done

echo "[]" > config/algorithm.json

source scripts/autostart.sh
