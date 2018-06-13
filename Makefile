yarnbin = $(shell yarn bin)

run:
	sh -c "source .env; $(yarnbin)/serverless offline"

test:
	sh -c "source .env; $(yarnbin)/serverless invoke local --function check"

deploy:
	sh -c "source .env.production; $(yarnbin)/serverless deploy"

setup:
	docker-compose up -d
	aws dynamodb create-table \
		--endpoint-url http://localhost:8898 \
		--table-name lightspeed-checks-dev \
		--attribute-definitions '[{"AttributeName":"area","AttributeType":"S"},{"AttributeName":"time","AttributeType":"S"}]' \
		--key-schema '[{"AttributeName":"area","KeyType":"HASH"},{"AttributeName":"time","KeyType":"RANGE"}]' \
		--provisioned-throughput '{"ReadCapacityUnits":1,"WriteCapacityUnits":1}' \
		--region local

cleanup:
	docker-compose stop && docker-compose rm -f

reboot: cleanup setup
