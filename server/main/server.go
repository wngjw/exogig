package main

import (
	"fmt"
	"io"
	"net/http"
)

func ret_func(w http.ResponseWriter, r *http.Request) {
	fmt.Println("hi")
	io.WriteString(w, "hello, world!")
}

func main() {
	http.Handle("/", http.FileServer(http.Dir("../../client/")))
	http.HandleFunc("/checkme", ret_func)
	http.ListenAndServe(":8080", nil)
}
