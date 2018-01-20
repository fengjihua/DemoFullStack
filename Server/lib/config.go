package lib

/*
Server Configuration
*/
var (
	ConfigIsLocal   = true
	ConfigIsDevelop = false
	ConfigIsProduct = false

	ConfigIsDebug   = true || ConfigIsLocal
	ConfigIsRelease = !ConfigIsDebug
)

/*
MongoDB Configuration
*/
var (
	// DbConnMongo = "mongodb://demo:demopass@localhost:27017"
	DbConnMongo = "mongodb://localhost:27017"
)
