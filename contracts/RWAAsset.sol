// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ConfidentialFungibleToken} from "new-confidential-contracts/token/ConfidentialFungibleToken.sol";
import {FHE, externalEuint64, euint64} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract RWAAsset is ConfidentialFungibleToken, SepoliaConfig {
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
    ) ConfidentialFungibleToken(_assetName, _assetDescription, "") {
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

        euint64 encryptedShares = FHE.asEuint64(shares);
        _mint(to, encryptedShares);
        
        availableShares -= shares;
        emit SharesMinted(to, shares);
    }

    function mintSharesEncrypted(
        address to,
        externalEuint64 encryptedShares,
        bytes calldata inputProof
    ) external onlyFactory {
        euint64 shares = FHE.fromExternal(encryptedShares, inputProof);
        _mint(to, shares);
        
        // Note: For encrypted shares, we can't directly update availableShares
        // This would require FHE comparison operations
        emit SharesMinted(to, 0); // Encrypted amount
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
