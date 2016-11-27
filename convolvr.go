package main

import (
    "log"
    "net/http"
    "github.com/ant0ine/go-json-rest/rest"
    "github.com/boltdb/bolt"
)

func main() {
    api := rest.NewApi()
    api.Use(rest.DefaultDevStack...)
    db, err := bolt.Open("universe.db", 0600, nil)
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    router, err := rest.MakeRouter(
        rest.Get("/users", func(w rest.ResponseWriter, req *rest.Request) {
            w.WriteJson(map[string][]int{"users": []int{}})
        }),
        rest.Get("/worlds", func(w rest.ResponseWriter, req *rest.Request) {
            w.WriteJson(map[string][]int{"worlds": []int{}})
        }),
        rest.Get("/platforms", func(w rest.ResponseWriter, req *rest.Request) {
            w.WriteJson(map[string][]int{"platforms": []int{}})
        }),
        rest.Get("/entities", func(w rest.ResponseWriter, req *rest.Request) {
            w.WriteJson(map[string][]int{"entities": []int{}})
        }),
    )
    if err != nil {
        log.Fatal(err)
    }
    api.SetApp(router)

    http.Handle("/api/", http.StripPrefix("/api", api.MakeHandler()))

    http.Handle("/", http.FileServer(http.Dir("./web")))

    log.Fatal(http.ListenAndServe(":3000", nil))
}
