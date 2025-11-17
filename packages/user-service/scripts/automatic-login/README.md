# Automatic Login Attempt Script

This is a short puppeteer script that gets the email addresses of all supervisor users in the Bichard database, and for each one:

1. Visits the user-service login page
1. Enters their email address into the input box
1. Clicks the 'Sign In' button, thus triggering a CJSM email to be sent to the user

This allows us to test whether users can receive the CJSM verification emails from Bichard on a large scale.

## Running

To run the script, you can use `npm start`:

```shell
$ LOGIN_URL="http://localhost:3000/users/login" npm start
```

## Environment variables

The script uses the following environment variables for configuration:

| Variable       | Default       | Description                                                       |
| -------------- | ------------- | ----------------------------------------------------------------- |
| `$DB_HOST`     | `"localhost"` | The hostname of the database server                               |
| `$DB_PORT`     | `5432`        | The port number to connect to the database on                     |
| `$DB_DATABASE` | `"bichard"`   | The name of the database to connect to                            |
| `$DB_USER`     | `"bichard"`   | The username to use when connecting to the database               |
| `$DB_PASSWORD` | `"password"`  | The password to use when connecting to the database               |
| `$DB_SSL`      | `false`       | Whether to use SSL when connecting to the database                |
| `$HEADLESS`    | `true`        | Whether to run Puppeteer in headless mode or in a visible browser |
| `$LOGIN_URL`   | -             | The URL of the login page                                         |
