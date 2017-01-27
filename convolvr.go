package convolvr

import (
	"fmt"
  "io/ioutil"
	"encoding/json"
	"net/http"
	"html/template"
	"strings"
  "strconv"
	"math"
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
  // }
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
		rest.Get("/files/list", listFiles),
		rest.Get("/files/download/:dir/:filename", getFiles),
		rest.Post("/files/upload", postFiles),
		rest.Get("/directories/list/:userId", getDirectories),
		rest.Post("/directories", postDirectories),
		rest.Get("/documents/:path/:filename", getText),
		rest.Post("/documents/:path/:filename", postText),
	)
	if err != nil {
		log.Fatal(err)
	}
	api.SetApp(router)

	http.Handle("/api/", http.StripPrefix("/api", api.MakeHandler()))
	http.HandleFunc("/world/", worldHandler) // eventually make this route name configurable to the specific use case, 'world', 'venue', 'event', etc..
	http.HandleFunc("/hyperspace/", worldHandler) // client should generate a meta-world out of (portals to) networked convolvr sites
	http.HandleFunc("/worlds", worldHandler)
	http.HandleFunc("/worlds/new", worldHandler)
	http.HandleFunc("/chat", worldHandler)
	http.HandleFunc("/login", worldHandler)
	http.HandleFunc("/settings", worldHandler)
	http.Handle("/connect", websocket.Handler(hub.Serve))

	hub.Handle("chat message", chatMessage)
	hub.Handle("update", update)
	hub.Handle("tool action", toolAction)

	http.Handle("/", http.FileServer(http.Dir("../web")))

	if useTLS {
		log.Fatal(http.ListenAndServeTLS(securePort, certificate, key, nil))
		log.Print("Convolvr Online ", securePort)
	} else {
		log.Print("Convolvr Online ", port)
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
func toolAction(c *nexus.Client, p *nexus.Packet) {
	var (
		action ToolAction
		chunkData []Chunk
		entities []*Entity
		entity Entity
	)
	if err := json.Unmarshal([]byte(p.Data), &action); err != nil {
			 panic(err)
	}
	if action.Tool == "Entity Tool" || action.Tool == "Structure Tool" {
		getChunkErr := db.Select(q.And(
			q.Eq("X", action.Coords[0]),
			q.Eq("Y", action.Coords[1]),
			q.Eq("Z", action.Coords[2]),
			q.Eq("World", action.World),
		)).Find(&chunkData)
		if getChunkErr != nil {
			log.Println(getChunkErr)
		}
		nChunks := len(chunkData)
		if (nChunks > 0) {
				if action.Tool == "Entity Tool" {
					entities = chunkData[0].Entities
					if (len(entities) < 48) {
						entity = *NewEntity(0, "", action.World, action.Entity.Components, action.Entity.Aspects, action.Position, action.Quaternion, action.Entity.TranslateZ)
						entities = append(entities, &entity)
						chunkData[0].Entities = entities
						saveErr := db.Update(&chunkData[0])
						if saveErr != nil {
							log.Println(saveErr)
						}
					} else {
						log.Println("Too Many Entities:")
						log.Printf(`world: "%s"`, action.World)
						log.Printf(`x: "%s"`, action.Coords[0])
						log.Printf(`z: "%s"`, action.Coords[2])
					}
				} else { // structure tool
					// implement adding structure
				}
				log.Printf(`broadcasting tool action: "%s"`, action.Tool)    // modify chunk where this tool was used...
		}
	}
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
		foundUser User
		authUsersFound []User
	)
	err := req.DecodeJsonPayload(&user)
	if err != nil {
		log.Println(err)
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	err = db.One("Name", user.Name, &foundUser)
  if err != nil { // if user doesn't exist
    log.Println(err)
		err = db.Save(user)
		if err != nil {
			log.Println(err)
			rest.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteJson(&user)
	} else {
		lookupErr := db.Select(q.And(
			q.Eq("Name", user.Name),
			q.Eq("Password", user.Password),
		)).Find(&authUsersFound)
		if lookupErr != nil {
			log.Println(lookupErr)
		}
		if len(authUsersFound) == 0 {
			w.WriteHeader(http.StatusOK) // invalid password
		} else {
			w.WriteJson(&authUsersFound[0]) // valid login
		}
	}
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
		red float64
		green float64
		blue float64
		first float64
		second float64
		third float64
		lightColor int
		ambientColor int
  )
  name := req.PathParam("name")
  log.Println(name)
  err := db.One("Name", name, &world)
  if err != nil {
    log.Println(err)

	first = 0.9 + (rand.Float64() * 0.1)
	second = first / 5 + rand.Float64() * 0.05
	third = second / 5 + rand.Float64() * 0.05
	if rand.Intn(10) > 7 {
		if rand.Intn(5) > 2 {
			red = first
			green = second
			blue = third
		} else {
			red = third / 2.0
			green = first
			blue = second
		}
	} else if rand.Intn(10) > 5 {
		if rand.Intn(5) > 2 {
			red = second
			green = third
			blue = first
		} else {
			red = first
			green = second / 2.0
			blue = third
		}
	} else {
		if rand.Intn(5) > 3 {
			red = first
			green = first / 1.5
			blue = third / 2.0
		} else {
			red = second
			green = first / 5.0
			blue = first
		}
	}
	lightColor = int(math.Floor(red * 255)) << 16 | int(math.Floor(green * 255)) << 8 | int(math.Floor(blue * 255));
	ambientColor = int(4+math.Floor(red * 4)) << 16 | int(4+math.Floor(green * 4)) << 8 | int(4+math.Floor(blue * 4));
	sky := Sky{SkyType: "standard", Red: float32(red), Green: float32(green), Blue: float32(blue), Layers: nil, Skybox: nil, Photosphere: "" }
	light := Light{Color: int(lightColor), Intensity: 1.0, Angle: 3.14, AmbientColor: ambientColor}
	terrain := Terrain{TerrainType: "both", Height: 20000, Color: rand.Intn(0xffffff), Flatness: float64(1.0+rand.Float64()*16.0), Decorations: ""}
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
		worldData World
    generatedChunk Chunk
    chunksData []Chunk
    chunkData []Chunk
		structures []Structure
		structure Structure
  )
	chunk := req.PathParam("chunks")
	world := req.PathParam("worldId")
	chunks := strings.Split(chunk, ",")
  worldErr := db.One("Name", world, &worldData)
  if worldErr != nil {
    log.Println(worldErr)
	}
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
	      if rand.Intn(10) < 6 {
	        chunkGeom = "space"
	      } else {
			  if rand.Intn(26) > 23{
				  light := 0
				  if rand.Intn(6) > 3 {
					  if rand.Intn(5) > 4 {
							light = 0xffffff
						} else {
							if rand.Intn(4) > 2 {
								light = 0x3000ff
							} else {
								if rand.Intn(4) > 2 {
									light = 0x8000ff
								} else {
									light = 0x00ff00
								}
							}
						}
				  }
				  structure = *NewStructure(0, "test", "box", "plastic", nil, nil, []int{0,0,0}, []int{0,0,0,0}, 1+rand.Intn(9), rand.Intn(3), rand.Intn(3), light)
	    		  structures = append(structures, structure)
			  }
		  }
		  bright := 100 + rand.Intn(155)
		  color := (bright << 16) | (bright << 8) | bright
			altitude := float32((math.Sin(float64(x)/2)*9+math.Cos(float64(z)/2)*9) / worldData.Terrain.Flatness)
		  generatedChunk = *NewChunk(0, x, y, z, altitude, world, "", chunkGeom, "metal", color, structures, nil, nil)
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

func listFiles(w rest.ResponseWriter, req *rest.Request) { // Get /files/list
	files, _ := ioutil.ReadDir("./")
  for _, f := range files {
    log.Println(f.Name())
  }
}
func getFiles(w rest.ResponseWriter, req *rest.Request) { // Get /files/download/:dir/:filename
	//w.WriteJson()
}
func postFiles(w rest.ResponseWriter, req *rest.Request) { // Post /files/upload

}
func getDirectories(w rest.ResponseWriter, req *rest.Request) { // Get /directories/list/:userId
	//w.WriteJson()
}
func postDirectories(w rest.ResponseWriter, req *rest.Request) { // Post("/directories
	//w.WriteJson()
}
func getText(w rest.ResponseWriter, req *rest.Request) { // Get /documents/:path/:filename
	//w.WriteJson()
}
func postText(w rest.ResponseWriter, req *rest.Request) { // Post /documents/:path/:filename
	//w.WriteJson()
}
