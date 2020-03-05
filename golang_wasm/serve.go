package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, World")
	})

	http.Handle("/", http.FileServer(http.Dir("./static")))
	http.Handle("/dist/", http.FileServer(http.Dir("./")))

	http.ListenAndServe(":8000", nil)
}
