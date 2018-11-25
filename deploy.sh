#! /bin/bash
yarn build
cp model.json dist/
cp group1-shard1of1 dist/
cp worker/worker.py dist/
cp server/app.py dist/
scp dist/* username@whatever_domain.com:/var/www/deploydemo

# After this, on the server, put everything where it needs to go
# and run according the instructions in the README.
