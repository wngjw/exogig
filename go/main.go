// main
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func helloWorld(w http.ResponseWriter, r *http.Request) {

	data := struct {
		Message string
	}{
		"Hello, Mom",
	}

	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Println(err)
	}
}

func main() {
	fmt.Println("Program Running...")
	http.Handle("/", http.FileServer(http.Dir("../")))
	http.HandleFunc("/api/hello", helloWorld)
	http.ListenAndServe(":8080", nil)
}
