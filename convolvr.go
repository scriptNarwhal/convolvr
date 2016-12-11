package main

import (
	"fmt"
	"log"
	"net/http"

	"golang.org/x/net/websocket"

	"github.com/ant0ine/go-json-rest/rest"
	"github.com/ds0nt/nexus"
	"github.com/spf13/viper"
)

var (
	hub *nexus.Nexus
)

func main() {
	viper.SetConfigName("config")          // name of config file (without extension)
	viper.AddConfigPath("$HOME/.convolvr") // call multiple times to add many search paths
	viper.AddConfigPath(".")               // optionally look for config in the working directory
	err := viper.ReadInConfig()            // Find and read the config file
	if err != nil {                        // Handle errors reading the config file
		panic(fmt.Errorf("Fatal error config file: %s \n", err))
	}

	port := fmt.Sprintf(":%d", viper.GetInt("host.port"))

	api := rest.NewApi()
	api.Use(rest.DefaultDevStack...)

	hub = nexus.NewNexus()

	router, err := rest.MakeRouter(
		rest.Get("/users", func(w rest.ResponseWriter, req *rest.Request) {
			// implement after platforms and entities
			w.WriteJson(map[string][]int{"users": []int{}})
		}),
		rest.Get("/worlds", func(w rest.ResponseWriter, req *rest.Request) {
			// implement after users, platforms and entities
			w.WriteJson(map[string][]int{"worlds": []int{}})
		}),
		rest.Get("/worlds/:id", func(w rest.ResponseWriter, req *rest.Request) { // load specific world
			// implement after users, platforms and entities
			w.WriteJson(map[string][]int{"worlds": []int{}})
		}),
		rest.Get("/platforms/:world/:cell", func(w rest.ResponseWriter, req *rest.Request) {
			cell := req.PathParam("cell")
			//world := req.PathParam("world")

			w.WriteJson(map[string]string{"cell": cell})
		}),

		rest.Get("/structures", func(w rest.ResponseWriter, req *rest.Request) { // structure types
			w.WriteJson(map[string][]int{"structures": []int{}})
		}),
		rest.Get("/structures/:userId", func(w rest.ResponseWriter, req *rest.Request) { // custom structure types
			w.WriteJson(map[string][]int{"structures": []int{}})
		}),
		rest.Get("/entities", func(w rest.ResponseWriter, req *rest.Request) { // entity types

			w.WriteJson(map[string][]int{"entities": []int{}})
		}),
		rest.Get("/entities/:userId", func(w rest.ResponseWriter, req *rest.Request) { // custom entities

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
	http.Handle("/connect", websocket.Handler(hub.Serve))

	hub.Handle("chat message", chatMessage)
	hub.Handle("update", update)
	hub.Handle("spawn", spawn)

	http.Handle("/", http.FileServer(http.Dir("./web")))
	log.Print("Convolvr Online using port ", port)
	log.Fatal(http.ListenAndServe(port, nil))
}

func chatMessage(c *nexus.Client, p *nexus.Packet) {
	log.Printf(`broadcasting chat message "%s"`, p.Data)
	hub.All().Broadcast(p)
}
func update(c *nexus.Client, p *nexus.Packet) {
	log.Printf(`broadcasting update "%s"`, p.Data)
	hub.All().Broadcast(p)
}
func spawn(c *nexus.Client, p *nexus.Packet) {
	log.Printf(`broadcasting spawn "%s"`, p.Data)
	hub.All().Broadcast(p)
}

// websocket.On("error", func(so socketio.Socket, err error) {
//   log.Println("error:", err)
// })
