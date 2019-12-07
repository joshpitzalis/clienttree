[![Build Status](https://travis-ci.org/joshpitzalis/clienttree.svg?branch=master)](https://travis-ci.org/joshpitzalis/clienttree)
[![Maintainability](https://api.codeclimate.com/v1/badges/a7d3a377e5ac1f6f60e3/maintainability)](https://codeclimate.com/github/joshpitzalis/clienttree/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/a7d3a377e5ac1f6f60e3/test_coverage)](https://codeclimate.com/github/joshpitzalis/clienttree/test_coverage)

# Client Tree

## Pre-deploy protocol
1. npm run test (unit/integration)
2. npm run cpverage
3. npm run cypress

## Deploy protocol
1. update version
2. Ensure you are using the correct env variable
3. npm run build
4. Ensure you deploying to the correct firebase account
5. npm run deploy (this excluded deploying firebase functions)

## Post-deploy protocol
1. Post update to Header
