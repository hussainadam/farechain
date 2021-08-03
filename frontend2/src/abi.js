export const contractAbi = [{
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "buyerAddress",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "organisationAddress",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint16",
        "name": "quantity",
        "type": "uint16"
      }
    ],
    "name": "Purchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "ownershipTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalOrganisations",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  },
  {
    "inputs": [],
    "name": "balance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "organisationAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "organisationName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "organisationPhone",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "organisationLocation",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "bagPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "bagValue",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "bagDescription",
        "type": "string"
      }
    ],
    "name": "addOrganisation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "organisationAddress",
        "type": "address"
      }
    ],
    "name": "removeOrganisation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getOrganisations",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "organisationAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "organisationName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "organisationPhone",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "organisationLocation",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "bagPrice",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "bagValue",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "bagDescription",
            "type": "string"
          },
          {
            "internalType": "uint16",
            "name": "totalBags",
            "type": "uint16"
          },
          {
            "internalType": "bool",
            "name": "valid",
            "type": "bool"
          }
        ],
        "internalType": "struct Farechain2.Organisation[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "newPrice",
        "type": "uint256"
      }
    ],
    "name": "updateBagPrice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "newValue",
        "type": "uint256"
      }
    ],
    "name": "updateBagValue",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "newDescription",
        "type": "string"
      }
    ],
    "name": "updateBagDescription",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "quantity",
        "type": "uint16"
      }
    ],
    "name": "addBags",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "organisationAddress",
        "type": "address"
      },
      {
        "internalType": "uint16",
        "name": "quantity",
        "type": "uint16"
      }
    ],
    "name": "buy",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
]