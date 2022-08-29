# Простой GUI для образовательного стенда

## Установка ПО
Для установки потребуется загрузить образ raspbian desktop на флешку. Установить ее можно с помощью утилиты с [официального сайта](https://www.raspberrypi.com/software/).

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
После запуска требуется первоначальная настройка системы, тут все просто - система сама будет предлагать что делать. На этом этапе важно подключиться к сети, чтобы иметь возможность установки софта из интернета. Так же при задании локали следует поставить галочку на *use US keyboard layout* и *use English language*, т.к. это упростит дальнейшую работу с терминалом.  
После настройки нужно перезагрузиться, как это предложит система.

После перезагрузки клонируем репозиторий. Для этого открываем терминал (`ctrl+alt+t` или просто щелкнуть на значок в системной трее) и вводим команду `git clone https://github.com/SonikDropout/booster-ui.git`   
Теперь переходим в директрорию с исходниками командой `cd booster-ui`. 
Теперь запускаем установочный скрипт командами  
```sh
chmod +x install.sh
./install.sh
```

На этом работа по утановке ПО заканчивается.

## Подключение к стенду

Для подключения к стенду помимо очевидных манипулций для оживления экрана с помощью кабелей USB и HDMI потребуется подключить GPIO. Нам нужны пины GPIO 14 и GPIO 15. Схема распиновки:

![gpio](https://www.raspberrypi.com/documentation/computers/images/GPIO-Pinout-Diagram-2.png)

Пин GPIO 14 использутеся для передачи, пин GPIO 15 для приема сигнала.
