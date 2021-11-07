const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  const gameContract = await gameContractFactory.deploy(
    ["Agumon", "Tir McDohl", "Togemon", "Rimuru Tempest"], // Names
    ["QmWMXfLJ3BHXrLYJ5Hg8jj1Dy77EezEwkz3XtPPdraNwQy", // Images
    "QmUw7NeDTxxp5wWY9ud39zdXNRNt8RxVvEY4F6rvQ5Xh6X", 
    "QmdYgVykSub6ejXp6vokxtCvp3H1eg2Be2kfmMsVoPuC2a",
  "QmVYJUWQ8p75f3doKu9HW45oXcTXHjCMFMLdWytyRJ9ic9"],
    [100, 200, 300, 500], // HP values
    [100, 50, 25, 500], // Attack damage values
    [30, 60, 15, 500], // Defense values
    [77, 150, 92, 500], // Agility values
    "Rosemon", // Boss name
    "QmT7wLJ1JBBDEUwjmYaxBoBvphELn7v6aKRAMSbeXUPNzq", // Boss image
    10000, // Boss hp
    50 // Boss attack damage
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);

  // let txn;
  // txn = await gameContract.mintCharacterNFT(3);
  // await txn.wait();

  //console.log("Minted NFT #1");
  // txn = await gameContract.attackBoss();
  // await txn.wait();
  // txn = await gameContract.attackBoss();
  // await txn.wait();

  // txn = await gameContract.checkIfUserHasNFT();
  // let returnedTokenUri = await gameContract.tokenURI(1);
  // console.log("Token URI:", returnedTokenUri);

  // txn = await gameContract.mintCharacterNFT(1);
  // await txn.wait();
  // console.log("Minted NFT #2");

  // txn = await gameContract.mintCharacterNFT(2);
  // await txn.wait();
  // console.log("Minted NFT #3");

  // txn = await gameContract.mintCharacterNFT(3);
  // await txn.wait();
  // console.log("Minted NFT #4");

  // console.log("Done deploying and minting!");

  // Get the value of the NFT's URI.
  // let returnedTokenUri = await gameContract.tokenURI(1);
  // console.log("Token URI:", returnedTokenUri);

};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();