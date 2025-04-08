# bichard7-next-help

A static site containing the help files for Bichard 7, built with Jekyll

## Running locally

To run the site locally for development, run

```bash
make run
```

This will install, build and run the site with Jekyll and run the dev server in watch mode so that it picks up any changes in the source. You can view the site on [http://localhost:4000/help/](http://localhost:4000/help/).

To test the built site and make sure there are no dead links / images, run:

```bash
make test
```

## Updating the `govuk-frontend`

Run the following script that updates the package to the latest version:

```bash
./bin/update-govuk.sh
```

You will have to go [GOV.UK Frontend](https://frontend.design-system.service.gov.uk/installing-with-npm/#get-the-javascript-working) to see if any of the commands for initialisation of the JS. If you need to change anything see this JS file `site/assets/init.js`.
