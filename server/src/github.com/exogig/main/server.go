package main

import (
	"fmt"
	//"net/http"
	"github.com/exogig/db"
	"github.com/garyburd/redigo/redis"
)

func main() {
	//http.Handle("/", http.FileServer(http.Dir("../../../client/")))
	//http.ListenAndServe(":8000", nil)

	//INIT OMIT
	connection := db.Connect()

	//set
	connection.Do("SET", "message1", "Hello World")

	//get
	world, err := redis.String(connection.Do("GET", "message1"))
	if err != nil {
		fmt.Println("key not found")
	}

	db.Disconnect(connection)

	fmt.Println(world)
	//ENDINIT OMIT
}
