package db

import "github.com/garyburd/redigo/redis"

// Opens a connection to the redis database using the redigo library
func Connect() redis.Conn {
	connection, err := redis.Dial("tcp", ":6379")
	if err != nil {
		panic(err)
	}
	return connection
}

// Closes the connection to the database
func Disconnect(connection redis.Conn) {
	connection.Close()
}
