help:
	@egrep "^#" Makefile

prod:
	npm run build
	node .output/server/index.mjs

dev:
	npm run dev

# target: docker-build|db                             - Start docker containers and install deps
db: docker-build
docker-build:
	cp -u .sample-env .env
	docker compose -f docker-compose.yml -f docker-compose.debug.yml run --rm gdctoolbox sh -c "npm run"
	echo 'dont forget to update the .env file'

# target: docker-up|du                                - Start docker containers and run dev
du: docker-up
docker-up:
	docker compose -f docker-compose.yml -f docker-compose.debug.yml up -d

# target: prod-docker-up|pdu                          - Start docker containers and run prod
pdu: prod-docker-up
prod-docker-up:
	docker compose -f docker-compose.yml up -d

# target: docker-down|dd                              - Stop docker containers
dd: docker-down
docker-down:
	docker compose down
