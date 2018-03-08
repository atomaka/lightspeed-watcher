# lightspeed-watcher

Track areas currently beign crowd source funded from www.golightspeed.com

## Development

* `cp .env.sample .env`
  * edit .env to have the zones you are interested in
* `docker-compose up -d`
* `make setup`
* `make test`
  * Will insert into DynamoDB

You can use the shell of the local DynamoDB container to view results:
http://localhost:8898

## Production

* `cp .env .env.production`
  * Remove `DYNAMODB_ENDPOINT` setting
* `make deploy`
