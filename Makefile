.PHONY: run frontend server

frontend:
	cd front-end && npm run dev

server:
	cd frontendchallengeserver && npm start

run:
	$(MAKE) frontend &
	$(MAKE) server &
