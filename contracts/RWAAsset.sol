// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, externalEuint32, euint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract RWAAsset is SepoliaConfig {
    string public assetName;
    string public assetDescription;
    uint256 public totalSupply;
    uint256 public pricePerShare;
    string public assetType;
    address public assetFactory;
    uint256 public availableShares;

    event SharesMinted(address indexed to, uint256 publicAmount);
    event AssetInfoUpdated(string assetName, uint256 totalSupply, uint256 pricePerShare);

    error OnlyFactoryAllowed();
    error InsufficientShares();
    error InvalidAmount();

    modifier onlyFactory() {
        if (msg.sender != assetFactory) revert OnlyFactoryAllowed();
        _;
    }

    constructor(
        string memory _assetName,
        string memory _assetDescription,
        uint256 _totalSupply,
        uint256 _pricePerShare,
        string memory _assetType,
        address _assetFactory
    ) {
        assetName = _assetName;
        assetDescription = _assetDescription;
        totalSupply = _totalSupply;
        pricePerShare = _pricePerShare;
        assetType = _assetType;
        assetFactory = _assetFactory;
        availableShares = _totalSupply;
    }

    function mintShares(address to, uint64 shares) external onlyFactory {
        if (shares == 0) revert InvalidAmount();
        if (shares > availableShares) revert InsufficientShares();

        // Simplified minting - just update available shares
        availableShares -= shares;
        emit SharesMinted(to, shares);
    }

    function mintSharesEncrypted(
        address to,
        externalEuint32 encryptedShares,
        bytes calldata inputProof
    ) external onlyFactory {
        // Basic validation
        require(to != address(0), "Invalid recipient address");
        require(inputProof.length > 0, "Invalid input proof");
        
        // Core FHE encryption functionality - this is the main encrypted minting
        // This is a demo to showcase FHE encryption, no real payment required
        euint32 shares = FHE.fromExternal(encryptedShares, inputProof);
        
        // Set ACL permissions for encrypted data (参考 StockRWA 项目)
        FHE.allowThis(shares);
        FHE.allow(shares, to);
        FHE.allow(shares, msg.sender);
        
        // Demo: Just emit the encrypted minting event
        // In a real scenario, you would validate payment and update balances
        // For this demo, we focus on showcasing FHE encryption capabilities
        emit SharesMinted(to, 0); // Encrypted amount - privacy preserved
        
        // Note: This is a demonstration of FHE encryption
        // Real implementation would include payment validation and balance updates
    }

    function getAssetInfo() external view returns (
        string memory,
        string memory,
        uint256,
        uint256,
        string memory,
        address
    ) {
        return (
            assetName,
            assetDescription,
            totalSupply,
            pricePerShare,
            assetType,
            address(this)
        );
    }

    function getAvailableShares() external view returns (uint256) {
        return availableShares;
    }

    function calculateSubscriptionCost(uint256 shares) external view returns (uint256) {
        return shares * pricePerShare;
    }
}
