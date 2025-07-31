CONTAINER_NAME = bichard-help
RUBY_VERSION = $$(cat .ruby-version)
DOCKER_RUN_CMD = docker run -it --rm --name $(CONTAINER_NAME) --volume $$PWD:/usr/src/app -w /usr/src/app --env BUNDLE_PATH=/usr/src/app/vendor/bundle

.PHONY: install
install:
	$(DOCKER_RUN_CMD) ruby:$(RUBY_VERSION) bundle install

.PHONY: build
build: install
	$(DOCKER_RUN_CMD) ruby:$(RUBY_VERSION) bundle exec jekyll build

.PHONY: run
run: install
	$(DOCKER_RUN_CMD) -p 4000:4000 ruby:$(RUBY_VERSION) bundle exec jekyll serve --host 0.0.0.0

.PHONY: test
test: build
	$(DOCKER_RUN_CMD) ruby:$(RUBY_VERSION) bundle exec htmlproofer --disable-external ./_site --url-swap '^/help/:/'
