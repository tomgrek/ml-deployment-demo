# A simple backend server

This serves up, via Flask:

1. An endpoint to enqueue a machine learning job, returning the job id.
2. An endpoint to check progress of machine learning jobs.
3. An endpoint to get the results of said job.

## Requirements

* A Redis instance running and accessible
* `pip install mlq`
* Maybe you want to use nginx and Let's Encrypt for HTTPS

## Running it

```
FLASK_APP=app.py python3 -m flask run --host=127.0.0.1 --port=5001
```

## Note

This is really a demo. It uses the Flask built-in webserver which according to Flask is bad. I'm inclined to think it's not that bad when nginx sits in front and it's just listening locally, but, you know. It may not be super resilient and performant. Maybe look into gunicorn or gevent instead.

Not interested in that? You can bypass the need for nginx with `--host=0.0.0.0` but still, you're going to need a domain name and something to serve static assets anyway.
