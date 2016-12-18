import React from 'react';

import fireapp from 'shared/fireapp.jsx';

export default class TopNav extends React.Component {
    render() {
        const path = window.location.pathname;
        const tuples = fireapp.auth().currentUser ?
            [
                ['/random/', 'Random'],
                ['/all/', 'All'],
                ['/edit/', 'Edit'],
                ['/account/', 'Account'],
            ] :
            [
                ['/account/', 'Login / Register'],
            ]
        ;
        const items = tuples.map((tuple, i) => [
            tuple[0] !== path ?
                <a href={tuple[0]}>{tuple[1]}</a> :
                tuple[1]
            ,
            i < tuples.length - 1 ?
                <span>&nbsp;|&nbsp;</span> :
                ''
            ,
        ]);
        return <div>{items}</div>;
    }
};