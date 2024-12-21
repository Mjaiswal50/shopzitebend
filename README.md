For chat functionality

You must do :- 
CREATE A DOCKER CONTAINER WITH PORT 6379 WITH REDIS IMAGE

docker run --name redis-server -p 6379:6379 -d redis

docker ps
EXPECTED CONTAINER INFO
docker exec -it redis-server redis-cli ping
EXPECTED PONG 

START DOCKER REDIS SERVER
docker start redis-server

docker exec -it redis-server redis-cli KEYS *
EXECTED LIST OF KEYS

REPLACE ONE KEYNAME WITH key_name
GET key_name



