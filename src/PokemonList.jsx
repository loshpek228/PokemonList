import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PokemonList.css'; 

const PokemonList = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=10');
        const pokemonData = response.data.results;

        const detailRequests = pokemonData.map(pokemon => axios.get(pokemon.url));

        const detailsResponses = await Promise.all(detailRequests);

        const pokemonWithImages = detailsResponses.map(res => ({
          name: res.data.name,
          image: res.data.sprites.front_default
        }));

        setPokemon(pokemonWithImages);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="pokemon-container">
      {pokemon.map((p, index) => (
        <div className="pokemon-card" key={index}>
          <img src={p.image} alt={p.name} className="pokemon-image" />
          <h2 className="pokemon-name">{p.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default PokemonList;
