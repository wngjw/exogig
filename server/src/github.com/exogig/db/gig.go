package impl

import (
	"github.com/garyburd/redigo/redis"
	"github.com/exogig/database"
)


func CreateGig(gigName string, date int, month int, year int, description string) int {
	connection := db.Connect()
	connection.Do("HMSET", "gig:" + gigName + string(date), "gigName", string(gigName), "date", string(date), "month", string(month), "year", string(year), "description", description)
	db.Disconnect()
}
