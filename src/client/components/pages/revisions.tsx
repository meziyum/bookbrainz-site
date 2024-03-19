/*
 * Copyright (C) 2020 Prabal Singh
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
import React from 'react';
import RevisionsTable from './parts/revisions-table';

interface RevisionsPageProps {
	from?: number,
	nextEnabled: boolean,
	results?: Array<Object>,
	showEntities?: boolean,
	showRevisionEditor?: boolean,
	size?: number
}

interface RevisionsPageStates {
	results: any,
}

function RevisionsPage({from = 0, nextEnabled, results=[], showEntities=true, showRevisionEditor=true, size=20}: RevisionsPageProps): JSX.Element {

	const [RevisionsPageStates, updateRevisionsPageStates] = React.useState<RevisionsPageStates>({
		results: results,
	});

	const paginationUrl = './revisions/revisions';

	const searchResultsCallback = (newResults: Array<Object>) => {
		updateRevisionsPageStates( (prevStates: RevisionsPageStates) => ({
			...prevStates,
			results: newResults,
		}));
	};

	return (
		<div id="pageWithPagination">
			<RevisionsTable
				results={RevisionsPageStates.results}
				showEntities={showEntities}
				showRevisionEditor={showRevisionEditor}
			/>
			<PagerElement
				from={from}
				nextEnabled={nextEnabled}
				paginationUrl={paginationUrl}
				results={RevisionsPageStates.results}
				searchResultsCallback={searchResultsCallback}
				size={size}
			/>
		</div>
	);
}

RevisionsPage.displayName = 'RevisionsPage';
export default RevisionsPage;
