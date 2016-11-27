package main

import (
    //"github.com/SpaceHexagon/convolvr/server/component"
    //"github.com/SpaceHexagon/convolvr/server/entity"
    "github.com/SpaceHexagon/convolvr/server/platform"
    //"github.com/SpaceHexagon/convolvr/server/structure"
    //"github.com/SpaceHexagon/convolvr/server/user"
    "github.com/ant0ine/go-json-rest/rest"
    "github.com/boltdb/bolt"
    "net/http"
    "log"
)

func main() {
    api := rest.NewApi()
    api.Use(rest.DefaultDevStack...)
    port := ":3000"
    db, err := bolt.Open("universe.db", 0600, nil)
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    router, err := rest.MakeRouter(
        rest.Get("/users", func(w rest.ResponseWriter, req *rest.Request) {
          // implement after platforms and entities
            w.WriteJson(map[string][]int{"users": []int{}})
        }),
        rest.Get("/worlds", func(w rest.ResponseWriter, req *rest.Request) {
          // implement after users, platforms and entities
            w.WriteJson(map[string][]int{"worlds": []int{}})
        }),
        rest.Get("/platforms", func(w rest.ResponseWriter, req *rest.Request) {

            w.WriteJson(map[string]string{"platforms": ""})
        }),
        rest.Get("/structures", func(w rest.ResponseWriter, req *rest.Request) { // structure types
            w.WriteJson(map[string][]int{"platforms": []int{}})
        }),
        rest.Get("/entities", func(w rest.ResponseWriter, req *rest.Request) {

            w.WriteJson(map[string][]int{"entities": []int{}})
        }),
        rest.Get("/components", func(w rest.ResponseWriter, req *rest.Request) { // component types
            w.WriteJson(map[string][]int{"entities": []int{}})
        }),
    )
    if err != nil {
        log.Fatal(err)
    }
    api.SetApp(router)
    http.Handle("/api/", http.StripPrefix("/api", api.MakeHandler()))
    http.Handle("/", http.FileServer(http.Dir("./web")))

    log.Print("Convolvr Online "+port)
    log.Fatal(http.ListenAndServe(port, nil))
}
