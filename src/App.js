import React, { Component } from 'react';
import Title from './components/title/title';
import './App.css';
import axios from 'axios';

// API key: PQFyAQk27SHWnmVEd7nsoRv2Fm1v6Yvl

class App extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            searchValue: '',
            prevSearch: ''
        }
    }

    componentDidMount() {
        this.trending();
    }

    trending() {
        axios.get('https://api.giphy.com/v1/gifs/trending?api_key=PQFyAQk27SHWnmVEd7nsoRv2Fm1v6Yvl&limit=50&rating=G')
            .then(response => {
                this.setState({
                    data: response.data.data
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    performSearch = (query, type, lan) => {
        axios.get(`https://api.giphy.com/v1/${type}/search?api_key=PQFyAQk27SHWnmVEd7nsoRv2Fm1v6Yvl&q=${query}&limit=50&offset=0&rating=G&lang=${lan}`)
            .then(response => {
                this.setState({
                    data: response.data.data,
                    prevSearch: query
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        const loading = <p>Loading</p>;
        return (
            <div className="App">
              <SearchForm onSearch={ this.performSearch } />
              { !this.state.data
                ? {
                    loading
                }
                :
                <SearchText prevSearch={ this.state.prevSearch } /> }
              <Content data={ this.state.data } />
            </div>
            );
    }
}

const Content = props => {
    let items = props.data.map(item => <ContentItem key={ item.id } url={ item.images.fixed_width.url } title={ item.title } />
    );

    return (
        <div className="content">
          <ul className="content__list">
            { items }
          </ul>
        </div>
        );
}

const ContentItem = props => {
    return (
        <li className="content__item">
          <img src={ props.url } alt={ props.title } />
        </li>
        );
}

class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            searchType: 'gifs',
            isToggle: true,
            language: 'en',
            gifActive: true,
            isRandom: 'false',
            stickerActive: false
        }
    }

    search = e => {
        this.setState({
            searchValue: e.target.value
        });
    }

    queryType = e => {
        const query = e.target.classList.contains('giforSticker__button--gif')

        this.setState((prevState, props) => {
            return {
                stickerActive: !prevState.stickerActive,
                gifActive: !prevState.gifActive,
                searchType: query ? 'gifs' : 'stickers'
            }
        });
    }

    submit = e => {
        e.preventDefault();
        if (this.state.searchValue) {
            this.props.onSearch(this.state.searchValue, this.state.searchType, this.state.language);
        }
        e.currentTarget.reset();
    }

    languageType = e => {
        this.setState(prevState => ({
            isToggle: !prevState.isToggle,
            language: !prevState.isToggle ? 'en' : 'hu'
        }));
    }


    render() {
        return (
            <form onSubmit={ this.submit }>
              <div className="search">
                <Title />
                <input type="text" className="search__input" placeholder="search all the GIFs and Stickers" onChange={ this.search } />
                <button type="submit" className="search__button"><i className="fa fa-search fa-2x search__icon" aria-hidden="true"></i></button>
              </div>
              <div className="options">
                <div className="gif-or-sticker">
                  <button type="button" className="giforSticker__button giforSticker__button--gif" style={ { backgroundColor: this.state.gifActive ? '#00E676' : '#37474F' } } onClick={ this.queryType }>GIFs</button>
                  <button type="button" className="giforSticker__button giforSticker__button--sticker" style={ { backgroundColor: this.state.stickerActive ? '#00E676' : '#37474F' } } onClick={ this.queryType }>Stickers</button>
                </div>
                <div className="random">
                  <button type="button" className="giforSticker__button" onClick={ this.getRandom }>
                    Random GIFs
                  </button>
                </div>
                <div className="language">
                  <button type="button" className="language__button language__button--hu" style={ { backgroundColor: this.state.isToggle ? '#FFAB00' : '#FF5722' } } onClick={ this.languageType }>
                    { this.state.isToggle ? 'En' : 'Hu' }
                  </button>
                </div>
              </div>
            </form>
            );
    }
}

const SearchText = props => {
    const trending = <span className="search-history__trending">trending now</span>

    return (
        <div className="search-history">
          <h3 className="search-history__previous">{ props.prevSearch ? props.prevSearch : trending }</h3>
        </div>
        );
}

export default App;
