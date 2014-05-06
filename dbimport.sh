#!/usr/bin/env bash
MONGOHOST=oceanic.mongohq.com
MONGOPORT=10044
DBNAME=landGrabCS132
USER=anna
PWD=mypwd

mongoimport --jsonArray --db $DBNAME --collection mapPoints --file public/grabdata.json -h $MONGOHOST --port $MONGOPORT -u $USER -p $PWD
mongoimport --jsonArray --db $DBNAME --collection users --file public/userdata.json -h $MONGOHOST --port $MONGOPORT -u $USER -p $PWD
