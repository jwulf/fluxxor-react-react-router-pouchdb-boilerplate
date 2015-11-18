import React from 'react'
import { render }           from 'react-dom'
import Fluxxor              from 'fluxxor'
import {actions,
        constants}          from './actions/Actions'

var flux = new Fluxxor.Flux(stores, actions);

let localDatabaseName = 'local-pouchdb'
let remoteDatabaseURL = ''

// Set remoteDatabaseURL if you want syncing with a remote couchDB instance, for example:
//let remoteDatabaseURL = 'http://www.cloudant.com/your-user-name/remote-couchdb'
flux.actions.database.initialise(localDatabaseName, remoteDatabaseURL);

// Use a closure to generate a factory function to pass flux down via props
// In direct descendants it will be available via this.props.flux
// In descendants of descendants it can accessible as long as descendants have
// createElement={this.props.createElement}
createElement = function(flux){
	return function(Component, props) {
		return <Component {...props} flux={flux}/>
	}}(flux)


render((
  <AppComposer flux={flux} createElement={createElement}/>), document.getElementById("app"));
