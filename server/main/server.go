package main

import (
	"net/http"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir("./static/index.html")))
	http.ListenAndServe(":8000", nil)
}
