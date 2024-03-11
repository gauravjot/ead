.PHONY : clean build run reset br

build: clean
	docker build -t ead .

run:
	docker run --name ead -d -p 8080:80 ead

br:	build run

reset:
	docker stop ead
	docker rm ead
	docker run --name ead -d -p 8080:80 ead

clean:
	docker stop ead || true
	docker rm ead || true
	docker image rm ead || true
