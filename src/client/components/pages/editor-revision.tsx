/*
 * Copyright (C) 2020 Prabal Singh
 * 				 2023 Meziyum
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
import RevisionsTable from './parts/revisions-table';

interface Props {
	from?: number;
	nextEnabled: boolean;
	results?: PropTypes.array,
	showEntities?: boolean;
	showRevisionEditor?: boolean;
	showRevisionNote?: boolean;
	size?: number;
	tableHeading?: string;
}

function EditorRevisionPage({results, from, nextEnabled, showEntities, showRevisionEditor, showRevisionNote, size, tableHeading}: Props): React.JSX.Element {
	const [resultsState, updateResultsState] = React.useState(results);
	const paginationUrl = './revisions/revisions';

	function searchResultsCallback(newResults) {
		updateResultsState(newResults);
	}

	return (
		<div id="pageWithPagination">
			<RevisionsTable
				results={resultsState}
				showEntities={showEntities}
				showRevisionEditor={showRevisionEditor}
				showRevisionNote={showRevisionNote}
				tableHeading={tableHeading}
			/>
			<PagerElement
				from={from}
				nextEnabled={nextEnabled}
				paginationUrl={paginationUrl}
				results={resultsState}
				searchResultsCallback={searchResultsCallback}
				size={size}
			/>
		</div>
	);
}

EditorRevisionPage.displayName = 'EditorRevisionPage';
EditorRevisionPage.propTypes = {
	from: PropTypes.number,
	nextEnabled: PropTypes.bool.isRequired,
	results: PropTypes.array,
	showEntities: PropTypes.bool,
	showRevisionEditor: PropTypes.bool,
	showRevisionNote: PropTypes.bool,
	size: PropTypes.number,
	tableHeading: PropTypes.string
};
EditorRevisionPage.defaultProps = {
	from: 0,
	results: [],
	showEntities: true,
	showRevisionEditor: false,
	showRevisionNote: true,
	size: 20,
	tableHeading: 'Recent Activity'
};

export default EditorRevisionPage;
