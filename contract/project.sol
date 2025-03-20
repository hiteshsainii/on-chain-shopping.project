// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SharedShoppingList {
    struct ShoppingItem {
        string name;
        bool purchased;
    }

    struct ShoppingList {
        string title;
        address owner;
        ShoppingItem[] items;
        mapping(address => bool) collaborators;
    }

    mapping(uint256 => ShoppingList) public shoppingLists;
    uint256 public listCount;

    event ListCreated(uint256 listId, string title, address owner);
    event ItemAdded(uint256 listId, string itemName);
    event ItemPurchased(uint256 listId, uint256 itemId);
    event CollaboratorAdded(uint256 listId, address collaborator);

    modifier onlyOwner(uint256 _listId) {
        require(msg.sender == shoppingLists[_listId].owner, "Not the list owner");
        _;
    }

    modifier onlyCollaborator(uint256 _listId) {
        require(
            shoppingLists[_listId].owner == msg.sender || 
            shoppingLists[_listId].collaborators[msg.sender],
            "Not authorized"
        );
        _;
    }

    function createShoppingList(string memory _title) public {
        shoppingLists[listCount].title = _title;
        shoppingLists[listCount].owner = msg.sender;
        emit ListCreated(listCount, _title, msg.sender);
        listCount++;
    }

    function addItem(uint256 _listId, string memory _itemName) public onlyCollaborator(_listId) {
        shoppingLists[_listId].items.push(ShoppingItem({name: _itemName, purchased: false}));
        emit ItemAdded(_listId, _itemName);
    }

    function markItemPurchased(uint256 _listId, uint256 _itemId) public onlyCollaborator(_listId) {
        require(_itemId < shoppingLists[_listId].items.length, "Invalid item ID");
        shoppingLists[_listId].items[_itemId].purchased = true;
        emit ItemPurchased(_listId, _itemId);
    }

    function addCollaborator(uint256 _listId, address _collaborator) public onlyOwner(_listId) {
        shoppingLists[_listId].collaborators[_collaborator] = true;
        emit CollaboratorAdded(_listId, _collaborator);
    }

    function getShoppingList(uint256 _listId) public view returns (string memory, address, ShoppingItem[] memory) {
        return (
            shoppingLists[_listId].title,
            shoppingLists[_listId].owner,
            shoppingLists[_listId].items
        );
    }
}
