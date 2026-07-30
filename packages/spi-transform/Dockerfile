FROM ghcr.io/astral-sh/uv:0.11.32 AS uv

# ------------------------------------------------------------------------------
# Stage 1: Build stage
# ------------------------------------------------------------------------------
FROM python:3.13-slim AS builder

WORKDIR /app

# Enable bytecode compilation, to improve cold-start performance.
# Disable installer metadata, to create a deterministic layer.
# Enable copy mode to support bind mount caching.
ENV UV_COMPILE_BYTECODE=1 \
    UV_NO_INSTALLER_METADATA=1 \
    UV_LINK_MODE=copy

# 1. Install dependencies into .venv
RUN --mount=from=uv,source=/uv,target=/bin/uv \
    --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-dev --no-install-project

# 2. Copy source code into current directory (.) and install package
COPY pyproject.toml README.md* ./
COPY ./src ./src

RUN --mount=from=uv,source=/uv,target=/bin/uv \
    --mount=type=cache,target=/root/.cache/uv \
    uv pip install --no-deps .

# ------------------------------------------------------------------------------
# Stage 2: Final lightweight runtime stage
# ------------------------------------------------------------------------------
FROM python:3.13-slim AS runner

WORKDIR /app

# PATH pointing to the virtual environment inside current directory
ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONUNBUFFERED=1

# Copy virtualenv from builder stage
COPY --from=builder /app/.venv ./.venv

# Run the entrypoint module
CMD ["spi-transform"]
