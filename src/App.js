import React from "react";
import "./App.css";

import Gallery from "./components/Gallery";

import constants from "./constants.js";
import { scrollAreaAvailable, debounce, throttle, checkHttpStatus, parseJSON } from "./utils.js";

export default class App extends React.Component {
	constructor(props) {
		super(props);
		const queriesFromStorage = JSON.parse(localStorage.getItem(constants.STORAGE_KEY));
		this.state = {
			searchText: "",
			imageList: [],
			pageNumber: 1,
		
			queries: queriesFromStorage ? queriesFromStorage : []
		};
		
		this.onSearchInputChange = this.onSearchInputChange.bind(this);

	
		this.handleScroll = this.handleScroll.bind(this);
	}

	componentDidMount() {
		
		window.onscroll = throttle(() => {
			if (scrollAreaAvailable()) return;
			this.handleScroll();
		}, 1000);

		
		this.makeDebouncedSearch = debounce(() => {
		
			this.state.queries.push(this.state.searchText);
			this.setState({ queries: this.state.queries }, this.updateLocalStorage());

		
			const url = constants.BASE_URL + "&text=" + this.state.searchText;
			fetch(url)
				.then(checkHttpStatus)
				.then(parseJSON)
				.then(resp => {
					this.setState({ imageList: resp.photos.photo });
				})
				.catch(err => {
					console.log(err);
				});
		}, 1000);
	}

	updateLocalStorage() {
		localStorage.setItem(constants.STORAGE_KEY, JSON.stringify(this.state.queries));
	}

	onSearchInputChange(evt) {
		const searchText = evt.currentTarget.value;
		this.setState({ searchText });
		const trimmedText = searchText.replace(/\s+$/, "");
		if (trimmedText.length) this.makeDebouncedSearch(trimmedText);
	}

	handleScroll() {
		let url = constants.BASE_URL + "&text=" + this.state.searchText + "&page=" + (this.state.pageNumber + 1);
		fetch(url)
			.then(checkHttpStatus)
			.then(parseJSON)
			.then(resp => {
				resp.photos.photo.forEach(photo => this.state.imageList.push(photo));
				this.setState({
					pageNumber: resp.photos.page,
					imageList: this.state.imageList
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

	

	render() {
		return (
			<div className="app">
				<div className="app-header">
					<h1 style={{ margin: "1rem 0" }}>Hi there! </h1>
					<h3 style={{ margin: "1rem 0" }}>It's spenny Take-Home Assignment</h3>
					
					<div className="h-flex jc ac search-bar">
						<input
							type="text"
							className="search-input"
							placeholder="Type to Search"
							value={this.state.searchText}
							onChange={this.onSearchInputChange}
						/>
					</div>
					</div>
				<div className="app-content" ref="appContent">
					{this.state.imageList.length
						? <Gallery images={this.state.imageList}  />
						: <p style={{ margin: "1rem 0" }}>Try searching for some image in the search bar</p>}
				
				</div>
			</div>
		);
	}

	componentWillUnmount() {
		
		window.onscroll = undefined;
	}
}
