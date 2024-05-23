install.api:
	@echo "--> Installing API"
	@npm install

start.api:
	@echo "--> Start API"
	@sudo systemctl start redis-server 

run.api:
	@echo "--> Running API"
	@npm run start:dev



