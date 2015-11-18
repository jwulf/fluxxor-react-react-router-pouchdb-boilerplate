import PouchDB from 'pouchdb'
import Fluxxor from 'fluxxor'
import {constants} from '../actions/Actions';

export default Fluxxor.createStore({
	initialise: function() {
	    this.entries = []
	    this.db = {}
	    this.d = debug('Store')
	    debug.enable('Store')

	    this.bindActions(
	      constants.INITIALISE_DATABASE, this.onInitialiseDatabase,
	      constants.LOAD_ENTRY_SUCCESS, this.onLoadEntrySuccess,
	      constants.LOAD_ENTRY_FAIL, this.onLoadEntryFail,

	      constants.ADD_ENTRY, this.onAddEntry,
	      constants.ADD_ENTRY_SUCCESS, this.onAddEntrySuccess,
	      constants.ADD_ENTRY_FAIL, this.onAddEntryFail,

	      constants.DATABASE_REMOVE_ENTRY, this.onRemoveEntry,
	      constants.DATABASE_UPSERT_ENTRY, this.onUpsertEntry,
	    );
	},

	onInitialiseDatabase: function(localDatabaseName, remoteDatabaseURL) {
		this.db = new PouchDB(localDatabaseName).on('change', this.onDBChange, this)
		db.allDocs().then((res) => {
	       	result.rows.map((i,k) => {
	            this.onUpsertEntry(i);
	        })
      	})
		if (remoteDatabaseURL) {
			this.db.sync(remoteDatabaseURL)
		}
	},

	onDBChange: function(change){
        if (change.deleted) 
          this.dispatch(constants.DATABASE_REMOVE_ENTRY, change.id)
        if (!change.deleted) 
          this.dispatch(constants.DATABASE_UPSERT_ENTRY, change)
	},

	binarySearch: function(arr, docId) {
	  var low = 0, high = arr.length, mid;
	  while (low < high) {
	    mid = (low + high) >>> 1; // faster version of Math.floor((low + high) / 2)
	    arr[mid]._id < docId ? low = mid + 1 : high = mid
	  }
	  return low;
	},

	onUpsertEntry: function(change){
	   	var newDoc = change.doc
	    var index = binarySearch(this.entries, newDoc._id);
	    var doc = this.entries[index];
	    if (doc && doc._id === newDoc._id) { // update
	      this.entries[index] = newDoc;
	    } else { // insert, but only bgl entries
	        this.entries.splice(index, 0, newDoc);
	    }
	    return this.emit("change")
	},

	onRemoveEntry: function(id){
	    var index = binarySearch(this.entries, id);
	    var entry = this.entries[index]
	    if (entry && entry._id === id) {
	      this.entries.splice(index, 1)
	      this.removed.id = entry._id
	      return this.emit("change")
	    }
	}

})