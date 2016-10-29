package main

import (
	"fmt"
	//"net/http"
	"github.com/garyburd/redigo/redis"
)

func main() {
	//http.Handle("/", http.FileServer(http.Dir("../../../client/")))
	//http.ListenAndServe(":8000", nil)

	//INIT OMIT
	c, err := redis.Dial("tcp", ":6379")
	if err != nil {
	panic(err)
	}
	defer c.Close()

	//set
	c.Do("SET", "message1", "Hello World")

	//get
	world, err := redis.String(c.Do("GET", "message1"))
	if err != nil {
	fmt.Println("key not found")
	}

	fmt.Println(world)
	//ENDINIT OMIT
}
