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

import * as React from 'react';
import CallToAction from './parts/call-to-action';
import PagerElement from './parts/pager';
import SearchField from './parts/search-field';
import SearchResults from './parts/search-results';


type SearchPageProps = {
	entityTypes: any[],
	from?: number,
	initialResults?: any[],
	nextEnabled: boolean,
	query?: string,
	resultsPerPage?: number,
	type?: string,
	user: Record<string, unknown>
};

type SearchPageState = {
	query: string | null | undefined;
	results: any[];
	type: string | null | undefined;
};

function SearchPage({entityTypes, from = 0, initialResults = [], nextEnabled, query = '', resultsPerPage = 20, type = null, user}: SearchPageProps): JSX.Element {

	const [SearchPageStates, updateSearchPageState] = React.useState<SearchPageState>({
		query: query,
		results: initialResults,
		type: type
	});
	const paginationUrl = './search/search';
	const pagerElementRef: React.RefObject<PagerElement> = React.useRef(null);

	/**
	 * Gets user text query from the browser's URL search parameters and
	 * sets it in the state to be passed down to SearchField and Pager components
	 *
	 * @param {string} queryParam - Query string entered by user.
	 * @param {string} typeParam - Entity type selected from dropdown
	 */
	const handleSearch = (queryParam: string, typeParam: string) => {
		if (queryParam === SearchPageStates.query && typeParam === SearchPageStates.type && pagerElementRef.current) {
			// if no change in query or type, re-run the search
			pagerElementRef.current.triggerSearch();
		}
		else {
			updateSearchPageState((prevState: SearchPageState)  => ({
				...prevState,
				query: queryParam,
				type: typeParam,
			}));
		}
	};

	/**
	 * The Pager component deals with fetching the query from the server.
	 * We use this callback to set the results on this component's state.
	 *
	 * @param {array} newResults - The array of results from the  query
	 */
	const searchResultsCallback = (newResults: any[]) => {
		updateSearchPageState((prevState: SearchPageState)  => ({
			...prevState,
			results: newResults
		}));
	};

	/**
	 * The Pager component is set up to react to browser history navigation (prev/next buttons),
	 * and we use this callback to set the query and type on this component's state.
	 *
	 * @param {URLSearchParams} searchParams - The URL search parameters passed up from the pager component
	 */
	const searchParamsChangeCallback = (searchParams: URLSearchParams) => {
		let tempQuery: string | null | undefined;
		let tempType: string | null | undefined;
		if (searchParams.has('q')) {
			tempQuery = searchParams.get('q');
		}
		if (searchParams.has('type')) {
			tempType = searchParams.get('type');
		}
		if (tempQuery === SearchPageStates.query && tempType === SearchPageStates.type) {
			return;
		}
		handleSearch(tempQuery, tempType);
	};

	const querySearchParams = `q=${SearchPageStates.query}${SearchPageStates.type ? `&type=${SearchPageStates.type}` : ''}`;

	return (
		<div id="pageWithPagination">
			<SearchField
				entityTypes={entityTypes}
				query={SearchPageStates.query}
				type={SearchPageStates.type}
				onSearch={handleSearch}
			/>
			<SearchResults
				results={SearchPageStates.results}
				user={user}
			/>
			<PagerElement
				from={from}
				nextEnabled={nextEnabled}
				paginationUrl={paginationUrl}
				querySearchParams={querySearchParams}
				ref={pagerElementRef}
				results={SearchPageStates.results}
				searchParamsChangeCallback={searchParamsChangeCallback}
				searchResultsCallback={searchResultsCallback}
				size={resultsPerPage}
			/>
			<div className="text-center">
				{SearchPageStates.results.length === 0 &&
				<div>
					<hr className="thin"/>
					<h2 style={{color: '#754e37'}}>
					No results found
					</h2>
				</div>}

				<div>
					{SearchPageStates.results.length === 0 &&
						<small>Make sure the spelling is correct, and that
								you have selected the correct type in the search bar.
						</small>}
					<hr className="wide"/>
					<h3>Are we missing an entry?</h3>
					<CallToAction query={SearchPageStates.query}/>
				</div>

			</div>
		</div>
	);
}

SearchPage.displayName = 'SearchPage';
export default SearchPage;