[![Build Status](https://travis-ci.org/joshpitzalis/clienttree.svg?branch=master)](https://travis-ci.org/joshpitzalis/clienttree)
[![Maintainability](https://api.codeclimate.com/v1/badges/a7d3a377e5ac1f6f60e3/maintainability)](https://codeclimate.com/github/joshpitzalis/clienttree/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/a7d3a377e5ac1f6f60e3/test_coverage)](https://codeclimate.com/github/joshpitzalis/clienttree/test_coverage)

# Client Tree

## Pre-deploy protocol
1. npm run test (unit/integration)
2. npm run coverage
3. npm run cypress

## App Deploy protocol
1. update version
2. Ensure you are using the correct env variable
3. Ensure indexes match
4. Ensure rules match
5. npm run build
6. Ensure you deploying to the correct firebase account
7. npm run deploy (this excluded deploying firebase functions)

## Cloud Functions deploy protocol
1.npm run build
2.firebase functions:config:set sendgrid.key=YOUR_KEY sendgrid.template=TEMPLATE_ID
3. npm run deploy
