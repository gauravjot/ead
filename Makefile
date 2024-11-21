.PHONY : all

docker-build: clean
	docker build -t ead .

docker-run:
	docker run --name ead -d -p 8080:80 ead

docker-br:	build run

docker-reset:
	docker stop ead
	docker rm ead
	docker run --name ead -d -p 8080:80 ead

docker-clean:
	docker stop ead || true
	docker rm ead || true
	docker image rm ead || true
