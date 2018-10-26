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



### EOSBet Bot | Binanry strategy (JamieScore Pivoting stop lost optimization)
eosBet.js

This one is simply implementation of Binary strategy

winning -> oringinal bet

lost -> doubling bet
 
if reach cap -> speculatively to JamieScore Pivoting to get lost back
 
Ground on our assumption, when JamieScore be a relatively big negative, it is time to play big bet (manually), hopefully!
 




 ### eosBet_v1 Bot | Pure JamieScore Pivoting
 eosbet_v1.js

 This one is simply implementation of JamieScore Pivoting
 
 JamieScore start with 0
 
 win -> JamieScore ++
 
 lost -> JamieScore --
 
 If JamieScore become positive -> lost recovered
 
 If JamieScore become -N means lost of N time
 
 Ground on our assumption, when JamieScore be a relatively big negative, it is time to play big bet (manually), hopefully!
 
