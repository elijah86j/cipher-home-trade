// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract CipherHomeTrade is SepoliaConfig {
    using FHE for *;
    
    struct Property {
        euint32 propertyId;
        euint32 price;
        euint32 area;
        euint32 bedrooms;
        euint32 bathrooms;
        bool isActive;
        bool isVerified;
        string name;
        string description;
        string location;
        address owner;
        uint256 createdAt;
        uint256 updatedAt;
    }
    
    struct Bid {
        euint32 bidId;
        euint32 amount;
        address bidder;
        uint256 timestamp;
        bool isActive;
    }
    
    struct Transaction {
        euint32 transactionId;
        euint32 propertyId;
        euint32 finalPrice;
        address buyer;
        address seller;
        bool isCompleted;
        uint256 timestamp;
    }
    
    struct UserProfile {
        euint32 reputation;
        euint32 totalTransactions;
        euint32 successfulBids;
        bool isVerified;
        string name;
        address userAddress;
    }
    
    mapping(uint256 => Property) public properties;
    mapping(uint256 => Bid) public bids;
    mapping(uint256 => Transaction) public transactions;
    mapping(address => UserProfile) public userProfiles;
    mapping(uint256 => uint256[]) public propertyBids;
    
    uint256 public propertyCounter;
    uint256 public bidCounter;
    uint256 public transactionCounter;
    
    address public owner;
    address public verifier;
    
    event PropertyListed(uint256 indexed propertyId, address indexed owner, string name);
    event BidPlaced(uint256 indexed bidId, uint256 indexed propertyId, address indexed bidder, uint32 amount);
    event BidAccepted(uint256 indexed bidId, uint256 indexed propertyId, address indexed seller);
    event TransactionCompleted(uint256 indexed transactionId, uint256 indexed propertyId, address indexed buyer);
    event PropertyVerified(uint256 indexed propertyId, bool isVerified);
    event UserVerified(address indexed user, bool isVerified);
    event ReputationUpdated(address indexed user, uint32 reputation);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyVerifier() {
        require(msg.sender == verifier, "Only verifier can call this function");
        _;
    }
    
    function listProperty(
        string memory _name,
        string memory _description,
        string memory _location,
        externalEuint32 _price,
        externalEuint32 _area,
        externalEuint32 _bedrooms,
        externalEuint32 _bathrooms,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Property name cannot be empty");
        require(bytes(_location).length > 0, "Location cannot be empty");
        
        uint256 propertyId = propertyCounter++;
        
        // Convert external encrypted values to internal encrypted values
        euint32 encryptedPrice = FHE.fromExternal(_price, inputProof);
        euint32 encryptedArea = FHE.fromExternal(_area, inputProof);
        euint32 encryptedBedrooms = FHE.fromExternal(_bedrooms, inputProof);
        euint32 encryptedBathrooms = FHE.fromExternal(_bathrooms, inputProof);
        
        properties[propertyId] = Property({
            propertyId: FHE.asEuint32(0), // Will be set properly later
            price: encryptedPrice,
            area: encryptedArea,
            bedrooms: encryptedBedrooms,
            bathrooms: encryptedBathrooms,
            isActive: true,
            isVerified: false,
            name: _name,
            description: _description,
            location: _location,
            owner: msg.sender,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        emit PropertyListed(propertyId, msg.sender, _name);
        return propertyId;
    }
    
    function placeBid(
        uint256 propertyId,
        externalEuint32 amount,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(properties[propertyId].owner != address(0), "Property does not exist");
        require(properties[propertyId].isActive, "Property is not active");
        require(properties[propertyId].owner != msg.sender, "Cannot bid on own property");
        
        uint256 bidId = bidCounter++;
        
        // Convert external encrypted amount to internal encrypted amount
        euint32 encryptedAmount = FHE.fromExternal(amount, inputProof);
        
        bids[bidId] = Bid({
            bidId: FHE.asEuint32(0), // Will be set properly later
            amount: encryptedAmount,
            bidder: msg.sender,
            timestamp: block.timestamp,
            isActive: true
        });
        
        propertyBids[propertyId].push(bidId);
        
        emit BidPlaced(bidId, propertyId, msg.sender, 0); // Amount will be decrypted off-chain
        return bidId;
    }
    
    function acceptBid(uint256 bidId) public {
        require(bids[bidId].bidder != address(0), "Bid does not exist");
        require(bids[bidId].isActive, "Bid is not active");
        
        // Find the property for this bid
        uint256 propertyId = 0;
        bool found = false;
        
        for (uint256 i = 0; i < propertyCounter; i++) {
            for (uint256 j = 0; j < propertyBids[i].length; j++) {
                if (propertyBids[i][j] == bidId) {
                    propertyId = i;
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
        
        require(found, "Property not found for bid");
        require(properties[propertyId].owner == msg.sender, "Only property owner can accept bid");
        require(properties[propertyId].isActive, "Property is not active");
        
        // Mark bid as accepted and property as inactive
        bids[bidId].isActive = false;
        properties[propertyId].isActive = false;
        
        // Create transaction record
        uint256 transactionId = transactionCounter++;
        transactions[transactionId] = Transaction({
            transactionId: FHE.asEuint32(0), // Will be set properly later
            propertyId: FHE.asEuint32(propertyId),
            finalPrice: bids[bidId].amount,
            buyer: bids[bidId].bidder,
            seller: msg.sender,
            isCompleted: true,
            timestamp: block.timestamp
        });
        
        // Update user profiles
        userProfiles[bids[bidId].bidder].totalTransactions = FHE.add(userProfiles[bids[bidId].bidder].totalTransactions, FHE.asEuint32(1));
        userProfiles[msg.sender].totalTransactions = FHE.add(userProfiles[msg.sender].totalTransactions, FHE.asEuint32(1));
        
        emit BidAccepted(bidId, propertyId, msg.sender);
        emit TransactionCompleted(transactionId, propertyId, bids[bidId].bidder);
    }
    
    function createUserProfile(string memory _name) public {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(userProfiles[msg.sender].userAddress == address(0), "Profile already exists");
        
        userProfiles[msg.sender] = UserProfile({
            reputation: FHE.asEuint32(100), // Initial reputation
            totalTransactions: FHE.asEuint32(0),
            successfulBids: FHE.asEuint32(0),
            isVerified: false,
            name: _name,
            userAddress: msg.sender
        });
    }
    
    function verifyProperty(uint256 propertyId, bool isVerified) public onlyVerifier {
        require(properties[propertyId].owner != address(0), "Property does not exist");
        
        properties[propertyId].isVerified = isVerified;
        emit PropertyVerified(propertyId, isVerified);
    }
    
    function verifyUser(address user, bool isVerified) public onlyVerifier {
        require(userProfiles[user].userAddress != address(0), "User profile does not exist");
        
        userProfiles[user].isVerified = isVerified;
        emit UserVerified(user, isVerified);
    }
    
    function updateReputation(address user, euint32 reputation) public onlyVerifier {
        require(userProfiles[user].userAddress != address(0), "User profile does not exist");
        
        userProfiles[user].reputation = reputation;
        emit ReputationUpdated(user, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function getPropertyInfo(uint256 propertyId) public view returns (
        string memory name,
        string memory description,
        string memory location,
        uint8 price,
        uint8 area,
        uint8 bedrooms,
        uint8 bathrooms,
        bool isActive,
        bool isVerified,
        address owner,
        uint256 createdAt
    ) {
        Property storage property = properties[propertyId];
        return (
            property.name,
            property.description,
            property.location,
            0, // FHE.decrypt(property.price) - will be decrypted off-chain
            0, // FHE.decrypt(property.area) - will be decrypted off-chain
            0, // FHE.decrypt(property.bedrooms) - will be decrypted off-chain
            0, // FHE.decrypt(property.bathrooms) - will be decrypted off-chain
            property.isActive,
            property.isVerified,
            property.owner,
            property.createdAt
        );
    }
    
    function getBidInfo(uint256 bidId) public view returns (
        uint8 amount,
        address bidder,
        uint256 timestamp,
        bool isActive
    ) {
        Bid storage bid = bids[bidId];
        return (
            0, // FHE.decrypt(bid.amount) - will be decrypted off-chain
            bid.bidder,
            bid.timestamp,
            bid.isActive
        );
    }
    
    function getTransactionInfo(uint256 transactionId) public view returns (
        uint8 propertyId,
        uint8 finalPrice,
        address buyer,
        address seller,
        bool isCompleted,
        uint256 timestamp
    ) {
        Transaction storage transaction = transactions[transactionId];
        return (
            0, // FHE.decrypt(transaction.propertyId) - will be decrypted off-chain
            0, // FHE.decrypt(transaction.finalPrice) - will be decrypted off-chain
            transaction.buyer,
            transaction.seller,
            transaction.isCompleted,
            transaction.timestamp
        );
    }
    
    function getUserProfile(address user) public view returns (
        uint8 reputation,
        uint8 totalTransactions,
        uint8 successfulBids,
        bool isVerified,
        string memory name
    ) {
        UserProfile storage profile = userProfiles[user];
        return (
            0, // FHE.decrypt(profile.reputation) - will be decrypted off-chain
            0, // FHE.decrypt(profile.totalTransactions) - will be decrypted off-chain
            0, // FHE.decrypt(profile.successfulBids) - will be decrypted off-chain
            profile.isVerified,
            profile.name
        );
    }
    
    function getPropertyBids(uint256 propertyId) public view returns (uint256[] memory) {
        return propertyBids[propertyId];
    }
    
    function getTotalProperties() public view returns (uint256) {
        return propertyCounter;
    }
    
    function getTotalBids() public view returns (uint256) {
        return bidCounter;
    }
    
    function getTotalTransactions() public view returns (uint256) {
        return transactionCounter;
    }
}
