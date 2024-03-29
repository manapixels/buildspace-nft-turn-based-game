import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import LoadingIndicator from '../LoadingIndicator';
import myEpicGame from '../../utils/MyEpicGame.json';

/*
 * Don't worry about setCharacterNFT just yet, we will talk about it soon!
 */
const SelectCharacter = ({ setCharacterNFT }) => {

    

    const [characters, setCharacters] = useState([]);
    const [gameContract, setGameContract] = useState(null);
    const [mintingCharacter, setMintingCharacter] = useState(false);

    useEffect(() => {
        const getCharacters = async () => {
            try {
                console.log('Getting contract characters to mint');

                /*
                 * Call contract to get all mint-able characters
                 */
                const charactersTxn = await gameContract.getAllDefaultCharacters();
                console.log('charactersTxn:', charactersTxn);

                /*
                 * Go through all of our characters and transform the data
                 */
                const characters = charactersTxn.map((characterData) =>
                    transformCharacterData(characterData)
                );

                /*
                 * Set all mint-able characters in state
                 */
                setCharacters(characters);
            } catch (error) {
                console.error('Something went wrong fetching characters:', error);
            }
        };

        const onCharacterMint = async (sender, tokenId, characterIndex) => {
            console.log(
                `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
            );

            if (gameContract && gameContract.address)
                alert(`Your NFT is all done -- see it here: https://testnets.opensea.io/assets/${gameContract.address}/${tokenId.toNumber()}`)

            /*
             * Once our character NFT is minted we can fetch the metadata from our contract
             * and set it in state to move onto the Arena
             */
            if (gameContract) {
                const characterNFT = await gameContract.checkIfUserHasNFT();
                console.log('CharacterNFT: ', characterNFT);
                setCharacterNFT(transformCharacterData(characterNFT));
            }
        };

        /*
         * If our gameContract is ready, let's get characters!
         */
        if (gameContract) {
            getCharacters();
            gameContract.on('CharacterNFTMinted', onCharacterMint); // event hook
        }

        return () => {
            /*
             * When your component unmounts, let;s make sure to clean up this listener
             */
            if (gameContract) {
                gameContract.off('CharacterNFTMinted', onCharacterMint);
            }
        };

    }, [gameContract]);

    useEffect(() => {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const gameContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                myEpicGame.abi,
                signer
            );

            /*
             * This is the big difference. Set our gameContract in state.
             */
            setGameContract(gameContract);
        } else {
            console.log('Ethereum object not found');
        }
    }, []);

    const mintCharacterNFTAction = (characterId) => async () => {
        try {
            if (gameContract) {
                setMintingCharacter(true);
                console.log('Minting character in progress...');
                const mintTxn = await gameContract.mintCharacterNFT(characterId);
                await mintTxn.wait();

                console.log('mintTxn:', mintTxn);
                setMintingCharacter(false);
            }
        } catch (error) {
            console.warn('MintCharacterAction Error:', error);
            setMintingCharacter(false);
        }
    };

    // Render Methods
    const renderCharacters = () =>
        characters.map((character, index) => (
            <div className="character-item" key={character.name}>
                <div className="name-container">
                    <p>{character.name}</p>
                </div>
                <img src={`https://cloudflare-ipfs.com/ipfs/${character.imageURI}`} alt={character.name} />
                <button
                    type="button"
                    className="character-mint-button"
                    onClick={mintCharacterNFTAction(index)}
                >{`Mint ${character.name}`}</button>
            </div>
        ));

    return (
        <div className="select-character-container">
            <h2>Mint Your Hero. Choose wisely.</h2>
            {characters.length > 0 && (
                <div className="character-grid">{renderCharacters()}</div>
            )}
            {mintingCharacter && (
      <div className="loading">
        <div className="indicator">
          <LoadingIndicator />
          <p>Minting In Progress...</p>
        </div>
        <img
          src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
          alt="Minting loading indicator"
        />
      </div>
    )}
        </div>
    );
};

export default SelectCharacter;