#!/usr/bin/env bash
mongoimport --jsonArray --db landGrab --collection mapPoints --file public/grabdata.json
mongoimport --jsonArray --db landGrab --collection users --file public/userdata.json
