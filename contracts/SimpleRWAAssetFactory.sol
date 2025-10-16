// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {SimpleRWAAsset} from "./SimpleRWAAsset.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract SimpleRWAAssetFactory is SepoliaConfig {
    mapping(string assetName => address assetAddress) public rwaAssets;
    mapping(address assetAddress => string assetName) public assetToName;
    string[] public assetNames;
    
    event RWAAssetCreated(string indexed assetName, address indexed assetAddress, uint256 totalSupply, uint256 pricePerShare);
    event AssetSubscribed(address indexed assetAddress, address indexed subscriber, uint256 shares);
    
    error AssetNotFound();
    error AssetAlreadyExists();
    
    function createRWAAsset(
        string memory assetName,
        string memory description,
        uint256 totalSupply,
        uint256 pricePerShare,
        string memory assetType
    ) external returns (address) {
        if (rwaAssets[assetName] != address(0)) revert AssetAlreadyExists();
        
        SimpleRWAAsset newAsset = new SimpleRWAAsset(
            assetName,
            description,
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
        uint256 shares
    ) external {
        address assetAddress = rwaAssets[assetName];
        if (assetAddress == address(0)) revert AssetNotFound();
        
        SimpleRWAAsset(assetAddress).subscribe(subscriber, shares);
        emit AssetSubscribed(assetAddress, subscriber, shares);
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
        string memory,
        uint256,
        uint256,
        uint256
    ) {
        address assetAddress = rwaAssets[assetName];
        if (assetAddress == address(0)) revert AssetNotFound();
        
        return SimpleRWAAsset(assetAddress).getAssetInfo();
    }
}
