package main

import (
	"fmt"
	"log"
	"strings"
	"net/http"
	"golang.org/x/net/websocket"
	"github.com/asdine/storm"
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
	useTLS := viper.GetBool("host.useTLS")
	securePort := fmt.Sprintf(":%d", viper.GetInt("host.securePort"))
	certificate := viper.GetString("host.certificate")
  key := viper.GetString("host.key")



	api := rest.NewApi()
	api.Use(rest.DefaultDevStack...)
	api.Use(&rest.CorsMiddleware{
			 RejectNonCorsRequests: false,
			 OriginValidator: func(origin string, request *rest.Request) bool {
					 return true
			 },
			 AllowedMethods: []string{"GET", "POST", "PUT"},
			 AllowedHeaders: []string{
					 "Accept", "Content-Type", "X-Custom-Header", "Origin"},
			 AccessControlAllowCredentials: true,
			 AccessControlMaxAge:           3600,
	})

	hub = nexus.NewNexus()

	db, err := storm.Open("world.db")
	defer db.Close()

	router, err := rest.MakeRouter(
		rest.Get("/users", func(w rest.ResponseWriter, req *rest.Request) {
			var users []User
			err := db.All(&users)
			log.Fatal(err)
			w.WriteJson(&users)
		}),
		rest.Post("/users", func(w rest.ResponseWriter, req *rest.Request) {
			var (
				user *User
			)
	    err := req.DecodeJsonPayload(&user)
	    if err != nil {
	        rest.Error(w, err.Error(), http.StatusInternalServerError)
	        return
	    }
			w.WriteJson(&user)
		}),
		rest.Get("/worlds", func(w rest.ResponseWriter, req *rest.Request) {
			var worlds []World
			err := db.All(&worlds)
			log.Fatal(err)
			w.WriteJson(&worlds)
		}),
		rest.Get("/worlds/:id", func(w rest.ResponseWriter, req *rest.Request) { // load specific world

			w.WriteJson(map[string][]int{"worlds": []int{}})
		}),
		rest.Get("/terrain/:world/:chunks", func(w rest.ResponseWriter, req *rest.Request) {
			chunk := req.PathParam("chunks")
			world := req.PathParam("world")
			chunks := strings.Split(chunk, ",");
			for _, v := range chunks {
				fmt.Println(v)
			}
			fmt.Println(world)
			fmt.Println(chunk)
			w.WriteJson(map[string]string{"chunks": world+" "+chunk})
		}),

		rest.Get("/structures", func(w rest.ResponseWriter, req *rest.Request) { // structure types
			var structures []Structure
			err := db.All(&structures)
			log.Fatal(err)
			w.WriteJson(&structures)
		}),
		rest.Post("/structures", func(w rest.ResponseWriter, req *rest.Request) { // structure types
			//w.WriteJson()
		}),
		rest.Get("/structures/:userId", func(w rest.ResponseWriter, req *rest.Request) { // custom structure types
			//w.WriteJson()
		}),
		rest.Get("/entities", func(w rest.ResponseWriter, req *rest.Request) { // entity types
			var entities []Entity
			err := db.All(&entities)
			log.Fatal(err)
			w.WriteJson(&entities)
			//w.WriteJson()
		}),
		rest.Post("/entities", func(w rest.ResponseWriter, req *rest.Request) { // entity types

			//w.WriteJson()
		}),
		rest.Get("/entities/:userId", func(w rest.ResponseWriter, req *rest.Request) { // custom entities

			//w.WriteJson()
		}),
		rest.Get("/components", func(w rest.ResponseWriter, req *rest.Request) { // component types
			var components []Component
			err := db.All(&components)
			log.Fatal(err)
			w.WriteJson(&components)
		}),
		rest.Post("/components", func(w rest.ResponseWriter, req *rest.Request) { // component types
			//w.WriteJson()
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

	if useTLS {
		log.Fatal(http.ListenAndServeTLS(securePort, certificate, key, nil))
		log.Print("Convolvr Online using port ", securePort)
	} else {
		log.Print("Convolvr Online using port ", port)
		log.Fatal(http.ListenAndServe(port, nil))
	}
}

func chatMessage(c *nexus.Client, p *nexus.Packet) {
	log.Printf(`broadcasting chat message "%s"`, p.Data)
	hub.All().Broadcast(p)
}
func update(c *nexus.Client, p *nexus.Packet) {
	// log.Printf(`broadcasting update "%s"`, p.Data)./
	hub.All().Broadcast(p)
}
func spawn(c *nexus.Client, p *nexus.Packet) {
	log.Printf(`broadcasting spawn "%s"`, p.Data)
	hub.All().Broadcast(p)
}

// websocket.On("error", func(so socketio.Socket, err error) {
//   log.Println("error:", err)
// })
