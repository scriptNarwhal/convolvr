package convolvr

import (
	"fmt"
	"net/http"
	"html/template"
	"strings"
  	"strconv"
  	"math/rand"
	log "github.com/Sirupsen/logrus"

	"github.com/ant0ine/go-json-rest/rest"
	"github.com/asdine/storm"
  	"github.com/asdine/storm/q"
	"github.com/ds0nt/nexus"
	"github.com/spf13/viper"
	"golang.org/x/net/websocket"
)

var (
	hub *nexus.Nexus
	db  *storm.DB
)

func Start(configName string) {

	viper.SetConfigName(configName)        // name of config file (without extension)
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

	db, err = storm.Open(viper.GetString("datastore.spark.db"))
	defer db.Close()
	userErr := db.Init(&User{})
	worldErr := db.Init(&World{})
	chunkErr := db.Init(&Chunk{})
	componentErr := db.Init(&Component{})
	entityErr := db.Init(&Entity{})
	structureErr := db.Init(&Structure{})
  // indexErr := db.ReIndex(&World{})
  // if indexErr != nil {
  // log.Fatal(indexErr)
  //
	if userErr != nil {
		log.Fatal(userErr)
	}
	if worldErr != nil {
		log.Fatal(worldErr)
	}
	if chunkErr != nil {
		log.Fatal(chunkErr)
	}
	if componentErr != nil {
		log.Fatal(componentErr)
	}
	if entityErr != nil {
		log.Fatal(entityErr)
	}
	if structureErr != nil {
		log.Fatal(structureErr)
	}

	router, err := rest.MakeRouter(
		rest.Get("/users", getUsers),
		rest.Post("/users", postUsers),
		rest.Get("/worlds", getWorlds),
		rest.Get("/worlds/name/:name", getWorld),
		rest.Get("/chunks/:worldId/:chunks", getWorldChunks),
		rest.Post("/worlds", postWorlds),
		rest.Get("/structures", getStructures),
		rest.Post("/structures", postStructures),
		rest.Get("/structures/:userId", getStructuresByUser),
		rest.Get("/entities", getEntities),
		rest.Post("/entities", postEntities),
		rest.Get("/entities/:userId", getEntitiesByUser),
		rest.Get("/components", getComponents),
		rest.Post("/components", postComponents),
	)
	if err != nil {
		log.Fatal(err)
	}
	api.SetApp(router)

	http.Handle("/api/", http.StripPrefix("/api", api.MakeHandler()))
	http.HandleFunc("/world/", worldHandler)
	http.Handle("/connect", websocket.Handler(hub.Serve))

	hub.Handle("chat message", chatMessage)
	hub.Handle("update", update)
	hub.Handle("spawn", spawn)

	http.Handle("/", http.FileServer(http.Dir("../web")))

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

func getUsers(w rest.ResponseWriter, req *rest.Request) {
	var users []User
	err := db.All(&users)
	if err != nil {
		log.Println(err)
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteJson(&users)
}

func postUsers(w rest.ResponseWriter, req *rest.Request) {
	var (
		user *User
	)
	err := req.DecodeJsonPayload(&user)
	if err != nil {
		log.Println(err)
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	err = db.Save(user)
	if err != nil {
		log.Println(err)
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// w.WriteHeader(http.StatusOK)
	w.WriteJson(user)
}

func getWorlds(w rest.ResponseWriter, req *rest.Request) {
	var worlds []World
	err := db.All(&worlds)
	if err != nil {
		log.Println(err)
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteJson(&worlds)
}

func getWorld(w rest.ResponseWriter, req *rest.Request) { // load specific world
  var (
	  world World
	  layers []Layer
  )
  name := req.PathParam("name")
  err := db.One("Name", name, &world)
  if err != nil {
    log.Println(err)
    //create world record
	sky := Sky{SkyType: "standard", Red: rand.Float32(), Green: rand.Float32(), Blue: rand.Float32(), Layers: layers }
	light := Light{Color:0xffffff, Intensity: 1.0, Angle: 3.14, AmbientColor: 0x000000}
	terrain := Terrain{TerrainType: "both", Height: 20000, Color: rand.Intn(0xffffff), Flatness: 1.0, Decorations: ""}
	spawn := Spawn{Entities: true, Structures: true, NPCS: true, Tools:true, Vehicles:true }
	world = *NewWorld(0, name, sky, light, terrain, spawn)
	saveErr := db.Save(&world)
    if saveErr != nil {
     log.Println(saveErr)
    }
  }

  w.WriteJson(&world)
}

func getWorldChunks(w rest.ResponseWriter, req *rest.Request) {
  var (
    generatedChunk Chunk
    chunksData []Chunk
    chunkData []Chunk
  )
	chunk := req.PathParam("chunks")
	world := req.PathParam("worldId")
	chunks := strings.Split(chunk, ",")

	for _, v := range chunks {
	    coords := strings.Split(v, "x")
	    x, xErr := strconv.Atoi(coords[0])
	    y, yErr := strconv.Atoi(coords[1])
	    z, zErr := strconv.Atoi(coords[2])
	    if xErr != nil {
	      log.Println(xErr)
	    }
	    if yErr != nil {
	      log.Println(yErr)
	    }
	    if zErr != nil {
	      log.Println(zErr)
	    }

	    err := db.Select(q.And(
	      q.Eq("X", x),
	      q.Eq("Y", y),
	      q.Eq("Z", z),
	      q.Eq("World", world),
	    )).Find(&chunkData)
	    if err != nil {
	      log.Println(err)
	    }

	    if (len(chunkData) == 0) {
	      chunkGeom := "flat"
	      if (rand.Intn(10) < 6) {
	        chunkGeom = "space"
	      }
	      generatedChunk = *NewChunk(0, x, y, z, world, "", chunkGeom, "metal", nil, nil, nil)
	      chunksData = append(chunksData, generatedChunk)
	      saveErr := db.Save(&generatedChunk)
	      if saveErr != nil {
	        log.Println(saveErr)
	      }
	    } else {
	      chunksData = append(chunksData, chunkData[0])
	    }
	}
	w.WriteJson(chunksData)
}

func postWorlds(w rest.ResponseWriter, req *rest.Request) {
	var (
		world *World
	)
	err := req.DecodeJsonPayload(&world)
	if err != nil {
		log.Println(err)
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	err = db.Save(world)
	if err != nil {
		log.Println(err)
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func worldHandler(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("../web/index.html");
    t.Execute(w, "")
}

func getStructures(w rest.ResponseWriter, req *rest.Request) { // structure types
	var structures []Structure
	err := db.All(&structures)
	if err != nil {
		log.Println(err)
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteJson(&structures)
}

func postStructures(w rest.ResponseWriter, req *rest.Request) {
	var (
		structure *Structure
	)
	err := req.DecodeJsonPayload(&structure)
	if err != nil {
		log.Println(err)
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	err = db.Save(structure)
	if err != nil {
		log.Println(err)
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func getStructuresByUser(w rest.ResponseWriter, req *rest.Request) { // custom structure types
	//w.WriteJson()
}

func getEntities(w rest.ResponseWriter, req *rest.Request) { // entity types
	var entities []Entity
	err := db.All(&entities)
	if err != nil {
		log.Println(err)
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteJson(&entities)
	//w.WriteJson()
}

func postEntities(w rest.ResponseWriter, req *rest.Request) {
	var (
		entity *Entity
	)
	err := req.DecodeJsonPayload(&entity)
	if err != nil {
		log.Println(err)
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	err = db.Save(entity)
	if err != nil {
		log.Println(err)
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func getEntitiesByUser(w rest.ResponseWriter, req *rest.Request) { // custom entities

	//w.WriteJson()
}

func getComponents(w rest.ResponseWriter, req *rest.Request) { // component types
	var components []Component
	err := db.All(&components)
	if err != nil {
		log.Println(err)
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteJson(&components)
}

func postComponents(w rest.ResponseWriter, req *rest.Request) {
	var (
		component *Component
	)
	err := req.DecodeJsonPayload(&component)
	if err != nil {
		log.Println(err)
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	err = db.Save(component)
	if err != nil {
		log.Println(err)
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}
