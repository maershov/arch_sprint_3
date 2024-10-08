#!/bin/bash
printf "\nСТАРТ\n"
docker-compose up -d --build

sleep 5

printf "\nСОЗДАНИЕ ТОПИКОВ\n"
docker compose exec -T kafka sh<<EOF
/bin/kafka-topics --create --topic telemetry --bootstrap-server kafka:29092
/bin/kafka-topics --create --topic device.command --bootstrap-server kafka:29092
/bin/kafka-topics --create --topic device.status --bootstrap-server kafka:29092
EOF

printf "\nТЕСТИРОВАНИЕ API\n"
printf "\nУСТРОЙСТВА. Создание типа устройства\n"
curl -s POST "http://localhost:8000/device-service/device-types" -d '{"code": "heating", "description": "Контроль температуры"}' -H 'Content-Type: application/json'

printf "\nУСТРОЙСТВА. Создание модуля\n"
curl -s POST "http://localhost:8000/device-service/modules" -d '{"house_id": 1, "device_type_id": 1, "serial_number": "m111", "title": "Модуль отопления"}' -H 'Content-Type: application/json'

printf "\nУСТРОЙСТВА. Создание создание устройства\n"
curl -s POST "http://localhost:8000/device-service/devices" -d '{"module_id": 1, "serial_number": "d111"}' -H 'Content-Type: application/json'

printf "\nУСТРОЙСТВА. Информация об устройстве\n"
curl -s GET "http://localhost:8000/device-service/device/1"

printf "\nУСТРОЙСТВА. Смена статуса устройства\n"
curl -X PUT "http://localhost:8000/device-service/device/1/status" -s -d '{"status": "on"}' -H 'Content-Type: application/json'

printf "\nУСТРОЙСТВА. Отправка команды устройству\n"
curl -s POST "http://localhost:8000/device-service/device/1/command" -d '{"command": "установить температуру 24"}' -H 'Content-Type: application/json'


printf "\nЧТЕНИЕ СМЕНЫ СТАТУСА ИЗ КАФКИ\n"
timeout 15 docker compose exec -T kafka sh<<EOF
/bin/kafka-console-consumer --bootstrap-server kafka:29092 --topic device.status --from-beginning
EOF

printf "\nЧТЕНИЕ КОМАНДЫ ИЗ КАФКИ\n"
timeout 15 docker compose exec -T kafka sh<<EOF
/bin/kafka-console-consumer --bootstrap-server kafka:29092 --topic device.command --from-beginning
EOF

printf "ПОЛУЧЕНИЕ ТЕЛЕМЕТРИИ ОТ УСТРОЙСТВ\n"

docker compose exec -T kafka sh<<EOF
echo {\"device_id\": 1, \"data\": {\"temperature\": \"21C\"}} | /bin/kafka-console-producer --bootstrap-server kafka:29092 --topic telemetry
echo {\"device_id\": 1, \"data\": {\"temperature\": \"22C\"}} | /bin/kafka-console-producer --bootstrap-server kafka:29092 --topic telemetry
echo {\"device_id\": 1, \"data\": {\"temperature\": \"23C\"}} | /bin/kafka-console-producer --bootstrap-server kafka:29092 --topic telemetry
echo {\"device_id\": 1, \"data\": {\"temperature\": \"21C\"}} | /bin/kafka-console-producer --bootstrap-server kafka:29092 --topic telemetry
echo {\"device_id\": 1, \"data\": {\"temperature\": \"22C\"}} | /bin/kafka-console-producer --bootstrap-server kafka:29092 --topic telemetry
echo {\"device_id\": 1, \"data\": {\"temperature\": \"23C\"}} | /bin/kafka-console-producer --bootstrap-server kafka:29092 --topic telemetry
EOF

sleep 3s

printf "\nТЕЛЕМЕТРИЯ. Последняя телеметрия\n"
curl -s GET "http://localhost:8000/telemetry-service/telemetry/latest?device_id=1"

printf "\nТЕЛЕМЕТРИЯ. Телеметрия за период\n"
curl -s GET "http://localhost:8000/telemetry-service/telemetry?device_id=1&from=2024-09-25=&until=2024-10-15"

printf "\nСТАРТ\n"
docker-compose down -v
