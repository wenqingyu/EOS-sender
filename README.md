# EOS Sender Demo
EOS Sender Demo is a sample collection for EOS wallet operation in NodeJS.


### Installation

`git clone git@github.com:wenqingyu/EOS-sender.git`

`npm install`

### Configuration
- Changing .sample.env file into .env
- The default CHAIN_ID is for EOS mainnet, if you need test on testnet please find their CHAIN_ID
- Fill up PRIVATE_KEY and HTTP_ENDPOINT of your choice



#### Transfer EOS / Tokens
- Make sure you set right value for authorization / from / to accounts and accurate amount of EOS / tokens you want

#### Run
`node sendSample.js`

The transfer will be proceeded.

