package db

import "github.com/garyburd/redigo/redis"

func Connect() redis.Conn {
	connection, err := redis.Dial("tcp", ":6379")
	if err != nil {
		panic(err)
	}
	return connection
}

func Disconnect(connection redis.Conn) {
	connection.Close()
}
