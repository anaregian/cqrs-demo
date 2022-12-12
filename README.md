# Getting started

1. install docker desktop
2. Create a `.env` file and copy paste the contents of `template.env`
3. `npm ci`
4. `npm run docker:start`
5. wait for the containers to start up. You can see their status on the docker desktop gui.
6. `docker compose run --rm app npm run db:migrate-latest`
7. `docker compose run --rm app npm run db:pull`
8. `docker compose run --rm app npm run db:generate`
9. Open your browser to `http://localhost:3000/swagger`
