# Use a Python image with uv pre-installed
FROM ghcr.io/astral-sh/uv:0.13.7-python3.13-trixie-slim@sha256:6ff812e34a0e14b4b8bc9ddf25e77b3e16bac6e0c4d9b67641f40366fa382d4c

# Setup a non-root user
RUN groupadd --system --gid 999 nonroot \
 && useradd --system --gid 999 --uid 999 --create-home nonroot

# Install the project into `/app`
WORKDIR /app

# Keeps Python from buffering stdout and stderr to avoid situations where
# the application crashes without emitting any logs due to buffering.
ENV PYTHONUNBUFFERED=1

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# Copy from the cache instead of linking since it's a mounted volume
ENV UV_LINK_MODE=copy

# Omit development dependencies
ENV UV_NO_DEV=1

# Ensure installed tools can be executed out of the box
ENV UV_TOOL_BIN_DIR=/usr/local/bin

COPY packages/analytics/ingestion/pyproject.toml packages/analytics/ingestion/uv.lock ./

# Install the project's dependencies using the lockfile and settings
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-install-project --no-build

# Then, add the rest of the project source code and install it
# Installing separately from its dependencies allows optimal layer caching
COPY packages/analytics/ingestion/src ./src
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-build

# Place executables in the environment at the front of the path
ENV PATH="/app/.venv/bin:$PATH"

# Reset the entrypoint, don't invoke `uv`
ENTRYPOINT []

# Use the non-root user to run our application
USER nonroot

# Uses `uv run` to sync dependencies on startup, respecting UV_NO_DEV
CMD ["uv", "run", "--locked", "--no-build", "ingest"]