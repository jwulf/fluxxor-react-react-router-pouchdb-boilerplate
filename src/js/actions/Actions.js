
export const constants = {
	INITIALISE_DATABASE: "INITIALISE_DATABASE",
	INITIALISE_DATABASE_SUCCEED: "INITIALISE_DATABASE_SUCCEED",
	INITIALISE_DATABASE_FAIL: "INITIALISE_DATABASE_FAIL"
}

export var actions = {
	database: {
		initialise: function(localDatabaseName, remoteDatabaseURL){
			return this.dispatch(constants.INITIALISE_DATABASE)
		}

	}

}