CryptoFraud - Ethereum fraud detection tool
============================================

<div align="center">
    <img alt="Logo" src="https://github.com/FedericoMazza11/CryptoFraud/blob/main/src/public/CryptoFraudLogoGit.png">
</div>

## Installation

### Requirements

The application was developed using Node.js 16.16.0 and uses the following additional libraries.
https://nodejs.org/es/download/

* `Express==4.18.1`
* `Body-parser==1.20.0`
* `Path==0.12.7`
* `Ejs==3.1.8`

### Setup

To install this package, simply clone the git repo:

```
git clone https://github.com/FedericoMazza11/CryptoFraud;
```

And execute index.js

```
cd CryptoFraud 
npm i
node --max-old-space-size=16384 src/index.js`
```

### Usage

After you excute `node --max-old-space-size=16384 src/index.js` the app will be set to the url `http://localhost:3000/`.
You may need to get an API key from https://etherscan.io/ in order to use the API,
If you have one, fill it in the input as well as the wallet you are trying to retrieve.

### Contents

The repository is structured as follows.

* `./src`: model source code
* `./src/public`: public files
* `./src/routes`: routes handler

### Roadmap
- [X] Ethereum Blockchain support
- [X] Data collect
- [X] Visualization
- [X] Early detection of scams
- [x] Improve performance at big operations (+10k)
- [ ] Add internal transactions for contracts
- [ ] Add assets graph
- [ ] Contract risk analysis
- [ ] Improve performance at big operations (+100k)
- [ ] Port application to bun
- [ ] Binance Blockchain support
- [ ] Solana Blockchain support

