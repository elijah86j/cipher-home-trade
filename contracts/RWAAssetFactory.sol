// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {RWAAsset} from "./RWAAsset.sol";
import {externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract RWAAssetFactory is SepoliaConfig {
    mapping(string assetName => address assetAddress) public rwaAssets;
    mapping(address assetAddress => string assetName) public assetToName;
    string[] public assetNames;

    event RWAAssetCreated(string indexed assetName, address indexed assetAddress, uint256 totalSupply, uint256 pricePerShare);
    event AssetSubscribed(address indexed asset, address indexed subscriber, uint256 shares);

    error AssetAlreadyExists();
    error AssetNotFound();
    error InvalidParameters();

    function createRWAAsset(
        string memory assetName,
        string memory assetDescription,
        uint256 totalSupply,
        uint256 pricePerShare,
        string memory assetType
    ) external returns (address) {
        if (rwaAssets[assetName] != address(0)) revert AssetAlreadyExists();
        if (totalSupply == 0 || pricePerShare == 0) revert InvalidParameters();

        RWAAsset newAsset = new RWAAsset(
            assetName,
            assetDescription,
            totalSupply,
            pricePerShare,
            assetType,
            address(this)
        );

        address assetAddress = address(newAsset);
        rwaAssets[assetName] = assetAddress;
        assetToName[assetAddress] = assetName;
        assetNames.push(assetName);

        emit RWAAssetCreated(assetName, assetAddress, totalSupply, pricePerShare);
        return assetAddress;
    }

    function getRWAAsset(string memory assetName) external view returns (address) {
        address assetAddress = rwaAssets[assetName];
        if (assetAddress == address(0)) revert AssetNotFound();
        return assetAddress;
    }

    function subscribeToAsset(
        string memory assetName,
        address subscriber,
        uint64 shares
    ) external {
        address assetAddress = rwaAssets[assetName];
        if (assetAddress == address(0)) revert AssetNotFound();

        RWAAsset(assetAddress).mintShares(subscriber, shares);
        emit AssetSubscribed(assetAddress, subscriber, shares);
    }

    function subscribeToAssetEncrypted(
        string memory assetName,
        address subscriber,
        externalEuint64 encryptedShares,
        bytes calldata inputProof
    ) external {
        address assetAddress = rwaAssets[assetName];
        if (assetAddress == address(0)) revert AssetNotFound();

        RWAAsset(assetAddress).mintSharesEncrypted(subscriber, encryptedShares, inputProof);
        emit AssetSubscribed(assetAddress, subscriber, 0); // Encrypted amount
    }

    function getAllAssetNames() external view returns (string[] memory) {
        return assetNames;
    }

    function getAssetCount() external view returns (uint256) {
        return assetNames.length;
    }

    function getAssetInfo(string memory assetName) external view returns (
        string memory,
        string memory,
        uint256,
        uint256,
        string memory,
        address
    ) {
        address assetAddress = rwaAssets[assetName];
        if (assetAddress == address(0)) revert AssetNotFound();

        return RWAAsset(assetAddress).getAssetInfo();
    }
}
