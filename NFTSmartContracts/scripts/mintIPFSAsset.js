const UniqueAsset = artifacts.require("UniqueAsset")

module.exports = async function (callback) {
    uniqueAsset = await UniqueAsset.deployed();
    console.log(uniqueAsset.address);

    let builder = await BaseBuilder.at(AddNewVotingBuilder.address);
    builder.sendSize()
    .on('data', event => console.log("New event"));

    await builder.build();
    uniqueAsset.testFunc.call();

    // address: 0x415F345BcB2f47ae43D25914De3C780A7C8148C8


    // var size = await uniqueAsset.getSize.call(undefined);
    // console.log(size.toNumber());

    // accounts = await web3.eth.getAccounts();
    // // ipfsHash = "huh1";
    // ipfsHash = "QmP46UUCjWsFV2CtPfgG84S3F6cvkb4WvbqGoqcZGZi69M"
    // const metadata = {
    //     author: "Aman",
    //     name: "idgaf",
    //     qHash: ipfsHash,
    //     time: Date.now()
    // }

    // newToken = await uniqueAsset.mintAsset(accounts[0], ipfsHash, JSON.stringify(metadata));
    // console.log(newToken);

    // size = await uniqueAsset.getSize.call();
    // console.log(size.toNumber());

    // hashSet = await uniqueAsset.getMapping.call();
    // for(var i = 0; i<hashSet.length; i++) {
    //     console.log(hashSet[i]);
    //     // console.log(JSON.parse(hashSet[i]));
    // }

    callback()
}
