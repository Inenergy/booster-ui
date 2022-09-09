# Простой GUI для образовательного стенда

## Установка ПО
Для установки потребуется загрузить образ [raspbian desktop](https://downloads.raspberrypi.org/raspios_armhf/images/raspios_armhf-2021-05-28/) на флешку. Установить ее можно с помощью [rufus](https://rufus.ie).

После записи образа для корректной работы raspberry с 7-ми дюймовым waveshare экраном стоит сразу отредактировать файлы config.txt и cmdline.txt. Для этого нужно сначала извлечь флешку, потом вставить её снова, тогда windows откроет загрузочный раздел системы (другой раздел недоступен, поскольку тип файловой системы там несовместим с виндой, если винда предложит отформатировать его, отказываемся).
Находим в загрузочном разделе файл config.txt и добавляем в конец файла строки
```
max_usb_current=1  
hdmi_group=2  
hdmi_mode=87  
hdmi_cvt 1024 600 60 6 0 0 0  
hdmi_drive=1  
enable_uart=1  
```
Для корректной работы serial port из файла cmdline.txt убираем фразу `console=serial0,115200`


Теперь вставляем флешку в raspberry и запитываем её от 5 вольтового блока питания.  
После запуска требуется первоначальная настройка системы, тут все просто - система сама будет предлагать что делать. На этом этапе важно подключиться к сети, чтобы иметь возможность установки софта из интернета. Так же при задании локали следует поставить галочку на *use US keyboard layout*, т.к. это упростит дальнейшую работу с терминалом. Этап проверки обновлений стоит пропустить, ибо долго и не очень-то нужно. 

После настройки клонируем репозиторий. Для этого открываем терминал (`ctrl+alt+t` или просто щелкнуть на значок в системной трее) и вводим команду `git clone https://github.com/SonikDropout/booster-ui.git`   
Теперь переходим в директрорию с исходниками командой `cd booster-ui`. 
Теперь запускаем установочный скрипт командами  
```sh
chmod +x scripts/install.sh
./scripts/install.sh
```

На этом работа по утановке ПО заканчивается.

## Подключение к стенду

Для подключения к стенду помимо очевидных манипулций для оживления экрана с помощью кабелей USB и HDMI потребуется подключить GPIO. Нам нужны пины GPIO 14 и GPIO 15. Схема распиновки:

![gpio](https://www.raspberrypi.com/documentation/computers/images/GPIO-Pinout-Diagram-2.png)

Пин GPIO 14 использутеся для передачи, пин GPIO 15 для приема сигнала.

## Внесение изменений
Файл *constants.js*, котороый может потребовать изменений находится в папке common.  
После редактирования нужно пересобрать ui-часть программы коммандой `npm run build && reboot` 

## Просмотр логов ошибок
Если программа не запускается корректно сначала стоит обновить странцу кнопкой f5  
Если обновление страницы не помогло, то нужно убедиться что серврная часть запустилась при загрузке системы. Сделать это можно при помощи комманды `systemctl status booster.service`. Если в статусе нет *running* то попробовать перезагрузить rapsberry.
Следующим шагом будет просмотр логов сервера `journalctl -b -f -u booster.service`, по ним можно понять есть ли проблемы с передачей данных на плату управления.  
Если на сервере ошибок нет, можно посмотреть в консоль браузера кнопкой f12.  
Если при отладке где-то вылезли ошибки JavaScript, писать разработчику, чтобы починил свой кусок кода.
