// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract SimpleRWAAsset is SepoliaConfig {
    string public assetName;
    string public assetDescription;
    string public assetType;
    uint256 public totalSupply;
    uint256 public availableShares;
    uint256 public pricePerShare;
    address public factory;
    
    mapping(address => uint256) public shares;
    mapping(address => bool) public hasSubscribed;
    
    event SharesMinted(address indexed to, uint256 amount);
    event AssetSubscribed(address indexed subscriber, uint256 shares);
    
    error OnlyFactoryAllowed();
    error InsufficientShares();
    error AlreadySubscribed();
    
    constructor(
        string memory _name,
        string memory _description,
        uint256 _totalSupply,
        uint256 _pricePerShare,
        string memory _assetType,
        address _factory
    ) {
        assetName = _name;
        assetDescription = _description;
        totalSupply = _totalSupply;
        availableShares = _totalSupply;
        pricePerShare = _pricePerShare;
        assetType = _assetType;
        factory = _factory;
    }
    
    modifier onlyFactory() {
        if (msg.sender != factory) revert OnlyFactoryAllowed();
        _;
    }
    
    function mintShares(address to, uint256 amount) external onlyFactory {
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Invalid amount");
        require(availableShares >= amount, "Insufficient available shares");
        
        shares[to] += amount;
        availableShares -= amount;
        
        emit SharesMinted(to, amount);
    }
    
    function subscribe(address subscriber, uint256 shareAmount) external onlyFactory {
        require(subscriber != address(0), "Invalid subscriber address");
        require(shareAmount > 0, "Invalid share amount");
        require(availableShares >= shareAmount, "Insufficient available shares");
        require(!hasSubscribed[subscriber], "Already subscribed");
        
        shares[subscriber] += shareAmount;
        availableShares -= shareAmount;
        hasSubscribed[subscriber] = true;
        
        emit AssetSubscribed(subscriber, shareAmount);
    }
    
    function getAssetInfo() external view returns (
        string memory,
        string memory,
        string memory,
        uint256,
        uint256,
        uint256
    ) {
        return (
            assetName,
            assetDescription,
            assetType,
            totalSupply,
            availableShares,
            pricePerShare
        );
    }
    
    function getSubscriberShares(address subscriber) external view returns (uint256) {
        return shares[subscriber];
    }
    
    function isSubscribed(address subscriber) external view returns (bool) {
        return hasSubscribed[subscriber];
    }
}
