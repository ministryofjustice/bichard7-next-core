FROM public.ecr.aws/lambda/python:3.13

# copy reqs in an early layer so docker can cache it
COPY requirements.txt ${LAMBDA_TASK_ROOT}

RUN pip install --no-cache-dir -r ${LAMBDA_TASK_ROOT}/requirements.txt 

# Copy the rest of the application code
COPY . ${LAMBDA_TASK_ROOT}

# Command to run your script when the container starts
CMD ["cloudwatch_export.lambda_handler"]