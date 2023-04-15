DOCKER = sudo docker
COMPOSE = $(DOCKER) compose -p baklava-pong -f app/docker-compose.yml

all: detach

ps:
	$(COMPOSE) ps

images:
	$(COMPOSE) images

volumes:
	$(DOCKER) volume ls

networks:
	$(DOCKER) network ls

start:
	$(COMPOSE) start

stop:
	$(COMPOSE) stop

restart:
	$(COMPOSE) restart

up:
	$(COMPOSE) up

detach :
	$(COMPOSE) up --detach --build

down:
	$(COMPOSE) down

clean:
	$(COMPOSE) down --rmi all --volumes

fclean: clean

prune: down fclean
	$(DOCKER) system prune -a -f

re: fclean all

.PHONY: all ps images volumes networks start stop restart up down clean fclean prune re
