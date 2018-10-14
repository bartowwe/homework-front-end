import React, { Component } from 'react';
import axios from 'axios';
import ScrollEvent from 'react-onscroll';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reqUrl : "http:api.giphy.com/v1/gifs/trending?&api_key=KZckE1eqw5s5pvGTtxB152SUhrwcaOJW",
      gifs : [],
      searchName : 'Trending',
      searchBox : '',
      offset : 0,
    };
    this.fetchGifs = this.fetchGifs.bind(this);
    this.handleScrollCallback = this.handleScrollCallback.bind(this);

  }

  //fetches the trending gifs when the page loads
  componentDidMount() {
    this.fetchGifs();
  }

  //gets trending gifs from gify
  fetchGifs() {
    axios.get("http://api.giphy.com/v1/gifs/trending?&api_key=KZckE1eqw5s5pvGTtxB152SUhrwcaOJW&offset=" + this.state.offset)
      .then(res => {
        let gifs = this.state.gifs.concat(res.data.data);
        console.log("gifs loaded: " + gifs.length);
        this.setState({ gifs: gifs, offset: this.state.offset + 25});
      })
      .catch(res => {
        if(res instanceof Error) {
          console.log("Error is: ", res.message);
        } else {
          console.log("Other error: ", res.data);
        }
      })
  }

  //checks during scroll to see if page is at bottom and decides to load more from trending or search
  handleScrollCallback(e) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.state.searchName === "Trending" ?  this.fetchGifs(): this.search();
    }
    
  }

  //ties the search box text to a state value
  handleSearch (e) {
    this.setState({ searchBox: e.target.value })
  }

  //handling the click of the search button
  handleGoClick () {
    this.setState({ searchName: this.state.searchBox, offset: 0, gifs: []})
    this.search();
  }

  //rendering the search bar
  searchBar () {
    return (
      <div className='searchbar-container'>
        <form onSubmit={e => e.preventDefault()}>
          <input type='text' size='70' placeholder='Type Here' onChange={this.handleSearch.bind(this)} value={this.state.searchBox} />
          <button type='submit' onClick={this.handleGoClick.bind(this)}>Search</button>
        </form>
      </div>
    )
  }

  //sends the actual search request to giphy
  search () {
    axios.get("http://api.giphy.com/v1/gifs/search?&q=" + this.state.searchBox + "&api_key=KZckE1eqw5s5pvGTtxB152SUhrwcaOJW&offset=" + this.state.offset)
      .then(res => {
        let gifs = this.state.gifs.concat(res.data.data);
        this.setState({ gifs: gifs, offset: this.state.offset + 25});
      })
      .catch(res => {
        if(res instanceof Error) {
          console.log("Error is: ", res.message);
        } else {
          console.log("Other error: ", res.data);
        }
      })
  }

  //used to hide or display the gif information on click
  showDiv (d) {
    var x = document.getElementById(d);
    if (x.style.display === "none" || x.style.display === '') {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

  //shows the username in the info box if there is one, otherwise omits the property
  showUser (gif) {
    if (gif.username !== "")
      return <span><br></br><b>Username:</b> {gif.username}</span>;
  }

  //renders whichever gifs are currently stored in the in the 'gifs' state
  renderGifs() {
    return (
      <div>
      <h1>Showing "{this.state.searchName}" Gifs</h1>
      {this.searchBar()}
      {
        this.state.gifs.map((gif, i)=> {
          return <div className="Gif">
                    <img src={gif.images.fixed_height.url} key={i} onClick={() => this.showDiv(gif.id)}/>
                    <div className="Hidden-info" id={gif.id}>
                      <span><b>Title:</b> {gif.title}</span> 
                      {this.showUser(gif)}
                      <br></br>
                      <span><b>Rating:</b> {gif.rating}</span> 

                    </div>
                 </div>
        })
      }
    </div>
    )
  }

  //main render
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src="https://media.giphy.com/media/etKPlfE85HW8udMMDl/giphy.gif" className="App-logo"></img>
          <h1>Namaste and find me some gifs</h1>
        </div>
        <br></br>
        {this.renderGifs()}
        <div>
          <ScrollEvent handleScrollCallback={this.handleScrollCallback} />
        </div>
      </div>
    );
  }
}

export default App;
