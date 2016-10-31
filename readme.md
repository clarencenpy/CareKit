# CareKit
A toolkit to build Chatbots that help to increase student engagement for health issues in CMU

## Deployment Instructions
* Set up facebook page and app __(DONE)__
* Set up aws lambda for claudia.js __(DONE)__
    * Add new users for aws IAM
    * Add secret keys to your local system (for mac: ~/.aws/credentials). This uses aws's node API to the deployment.
    ```
    [default]
    aws_access_key_id = <KEY>
    aws_secret_access_key = <KEY>
    ```
* Deploy new code to aws
    * Install dependencies
    ```
    > cd claudia-test
    > npm install
    > npm start 
    ```
    * Select `Deploy` to update code on aws
    * Test bot at https://facebook.com/carriebotcmu/

* Look at claudia api to figure out how to build the bot: https://github.com/claudiajs/claudia-bot-builder/blob/master/docs/API.md