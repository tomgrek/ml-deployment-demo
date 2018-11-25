# By Tom Grek, public domain, no warranty.

import json
import time

from flask import Flask, request
from mlq.queue import MLQ

app = Flask(__name__)

# Create MLQ: namespace, redis host, redis port, redis db
mlq = MLQ('deploy_demo', 'localhost', 6379, 0)

@app.route('/api/check_progress/<job_id>')
def check_progress(job_id):
    progress = mlq.get_progress(job_id)
    return progress

@app.route('/api/result/<job_id>')
def get_result(job_id):
    job = mlq.get_job(job_id)
    return job['result'] or '[not available yet]'

@app.route('/api/enqueue')
def enqueue_job():
    """e.g. curl https://exploitip.com/api/enqueue?seed=a%20seed%20sentence
    enqueues a job and returns its id"""
    job_id = mlq.post({'seed': request.args.get('seed', 'Some random text instead ')})
    return job_id
