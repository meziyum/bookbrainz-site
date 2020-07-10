/*
 * Copyright (C) 2015  Ohm Patel
 *               2016  Sean Burke
 *               2018  Nicolas Pelleiter
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import PagerElement from './parts/pager';
import PropTypes from 'prop-types';
import React from 'react';
import SearchField from './parts/search-field';
import SearchResults from './parts/search-results';


class SearchPage extends React.Component {
	/**
	 * Initializes component state to default values and binds class
	 * methods to proper context so that they can be directly invoked
	 * without explicit binding.
	 *
	 * @param {object} props - Properties object passed down from parents.
	 */
	constructor(props) {
		super(props);

		this.state = {
			query: props.query,
			results: props.initialResults,
			type: props.type
		};

		// React does not autobind non-React class methods
		this.handleSearch = this.handleSearch.bind(this);
		this.searchResultsCallback = this.searchResultsCallback.bind(this);
		this.paginationUrl = './search/search?q=';
	}

	componentDidMount() {
		window.addEventListener('popstate', () => {
			const url = new URL(window.location.href);
			let query;
			let type;
			if (url.searchParams.has('q')) {
				query = url.searchParams.get('q');
			}
			if (url.searchParams.has('type')) {
				type = url.searchParams.get('type');
			}
			this.setState({query, type});
		});
	}

	/**
	 * Gets user text query from the SearchField component/ browser nav and
	 * sets it in state to be passed down to
	 *
	 * @param {string} query - Query string entered by user.
	 * @param {string} type - Entity type selected from dropdown
	 */
	handleSearch(query, type) {
		const url = new URL(window.location.href);
		if (url.searchParams.get('q') !== query || url.searchParams.get('type') !== type) {
			url.searchParams.set('q', query);
			url.searchParams.set('type', type);
			window.history.pushState(null, '', `?${url.searchParams}`);
		}
		this.setState({query, type});
	}

	searchResultsCallback(newResults) {
		this.setState({results: newResults});
	}

	/**
	 * Renders the component: Search bar with results table located vertically
	 * below it.
	 *
	 * @returns {object} - JSX to render.
	 */
	render() {
		const {type, query, results} = this.state;
		const typeString = type ? `&type=${type}` : '';
		const fullQuery = `${query}${typeString}`;
		return (
			<div id="pageWithPagination">
				<SearchField
					entityTypes={this.props.entityTypes}
					query={query}
					type={type}
					onSearch={this.handleSearch}
				/>
				<SearchResults results={results}/>
				<PagerElement
					from={this.props.from}
					nextEnabled={this.props.nextEnabled}
					paginationUrl={this.paginationUrl}
					query={fullQuery}
					results={results}
					searchResultsCallback={this.searchResultsCallback}
					size={this.props.resultsPerPage}
				/>
			</div>
		);
	}
}

SearchPage.displayName = 'SearchPage';
SearchPage.propTypes = {
	entityTypes: PropTypes.array.isRequired,
	from: PropTypes.number,
	initialResults: PropTypes.array,
	nextEnabled: PropTypes.bool.isRequired,
	query: PropTypes.string,
	resultsPerPage: PropTypes.number,
	type: PropTypes.string
};
SearchPage.defaultProps = {
	from: 0,
	initialResults: [],
	query: '',
	resultsPerPage: 20,
	type: null
};

export default SearchPage;
