const contractAddress = "0x9AFc21a357b6F84FafaC33082dA352FDC203895A"; // Replace with your deployed contract address
const abi =[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_listId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_collaborator",
				"type": "address"
			}
		],
		"name": "addCollaborator",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_listId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_itemName",
				"type": "string"
			}
		],
		"name": "addItem",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "listId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "collaborator",
				"type": "address"
			}
		],
		"name": "CollaboratorAdded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			}
		],
		"name": "createShoppingList",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "listId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "itemName",
				"type": "string"
			}
		],
		"name": "ItemAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "listId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "itemId",
				"type": "uint256"
			}
		],
		"name": "ItemPurchased",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "listId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ListCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_listId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_itemId",
				"type": "uint256"
			}
		],
		"name": "markItemPurchased",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_listId",
				"type": "uint256"
			}
		],
		"name": "getShoppingList",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "purchased",
						"type": "bool"
					}
				],
				"internalType": "struct SharedShoppingList.ShoppingItem[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "listCount",
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
				"name": "",
				"type": "uint256"
			}
		],
		"name": "shoppingLists",
		"outputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let provider, signer, contract;

// Initialize Ethers.js and connect to the contract
async function init() {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  contract = new ethers.Contract(contractAddress, abi, signer);
  loadLists();
}

// Create a new shopping list
document.getElementById("createListForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("listTitle").value;
  await contract.createShoppingList(title);
  alert("Shopping list created!");
  loadLists();
});

// Add an item to a shopping list
document.getElementById("addItemForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const listId = document.getElementById("listId").value;
  const itemName = document.getElementById("itemName").value;
  await contract.addItem(listId, itemName);
  alert("Item added!");
  loadLists();
});

// Mark an item as purchased
document.getElementById("markPurchasedForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const listId = document.getElementById("purchaseListId").value;
  const itemId = document.getElementById("itemId").value;
  await contract.markItemPurchased(listId, itemId);
  alert("Item marked as purchased!");
  loadLists();
});

// Load and display shopping lists
async function loadLists() {
  const listCount = await contract.listCount();
  const listsContainer = document.getElementById("shoppingLists");
  listsContainer.innerHTML = "";

  for (let i = 0; i < listCount; i++) {
    const list = await contract.getShoppingList(i);
    const listElement = document.createElement("div");
    listElement.className = "list-item";
    listElement.innerHTML = `
      <h3>${list[0]}</h3>
      <p>Owner: ${list[1]}</p>
      <div>
        ${list[2].map((item, index) => `
          <div class="item ${item.purchased ? "purchased" : ""}">
            <span>${item.name}</span>
            <span>${item.purchased ? "✅" : "🛒"}</span>
          </div>
        `).join("")}
      </div>
    `;
    listsContainer.appendChild(listElement);
  }
}

// Initialize the app
init();