FROM public.ecr.aws/lambda/python:3.13

# copy reqs in an early layer so docker can cache it
COPY requirements.txt ${LAMBDA_TASK_ROOT}

RUN pip install --no-cache-dir -r ${LAMBDA_TASK_ROOT}/requirements.txt 

# Pre-install httpfs into the LAMBDA_TASK_ROOT directory so it persists in the image
RUN python -c "import duckdb; con = duckdb.connect(); con.execute(\"SET extension_directory='${LAMBDA_TASK_ROOT}/.duckdb/extensions'\"); con.execute('INSTALL httpfs;')"

# Copy the rest of the application code
COPY . ${LAMBDA_TASK_ROOT}

# Command to run your script when the container starts
CMD ["main.lambda_handler"]