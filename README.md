# Penn Clubs
[![CircleCI](https://circleci.com/gh/pennlabs/clubs-backend.svg?style=shield)](https://circleci.com/gh/pennlabs/clubs-backend)
[![Coverage Status](https://coveralls.io/repos/github/pennlabs/clubs-backend/badge.svg?branch=master)](https://coveralls.io/github/pennlabs/clubs-backend?branch=master)

The REST API written in Django for Penn Clubs infrastructure.

## Installation

Running the backend requires Python 3. In order to use authentication, set the following environment variables:
- `OAUTHLIB_INSECURE_TRANSPORT=1`
- `LABS_REDIRECT_URI=http://localhost:8000/accounts/callback/`
- `LABS_CLIENT_ID` (from Platform)
- `LABS_CLIENT_SECRET` (from Platform)

```bash
pipenv install
pipenv shell
./manage.py migrate
./manage.py runserver
```
