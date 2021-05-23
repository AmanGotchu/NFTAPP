pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract UniqueAsset is ERC721 {
    uint256 public tokenIds;
    mapping(string => uint8) public ipfsHashSet;
    mapping(uint256 => string) public tokenIDToMetadata;
    string public test;

    event newAssetMinted(uint256 tokenID);

    constructor() public ERC721("UniqueAsset", "UNA") {
        test = "test";
        tokenIds = uint256(0);
    }

    function mintAsset(address recipient, string memory hash, string memory metadata)
    public
    returns (uint256) {
        require(ipfsHashSet[hash] != 1);
        ipfsHashSet[hash] = 1;

        uint256 nextTokenId = tokenIds;
        _mint(recipient, nextTokenId);
        tokenIDToMetadata[nextTokenId] = metadata;

        emit newAssetMinted(nextTokenId);
        tokenIds = tokenIds + 1;
        return nextTokenId;
    }

    function getSize()
    public
    view
    returns (uint256) {
        return tokenIds;
    }

    function getMapping() public view returns (string[] memory) {
        string[] memory ret = new string[](tokenIds);
        for (uint i = 0; i < tokenIds; i++) {
            ret[i] = tokenIDToMetadata[i];
        }
        return ret;
    }
}

