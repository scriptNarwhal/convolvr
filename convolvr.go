package convolvr

import (
	"fmt"
  "io/ioutil"
	"encoding/json"
	"net/http"
	"strings"
  "strconv"
	"math"
  "math/rand"
	log "github.com/Sirupsen/logrus"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
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

	e := echo.New()
	e.Use(middleware.CORS())
	hub = nexus.NewNexus()
	db, err = storm.Open(viper.GetString("datastore.spark.db"))
	defer db.Close()
	if err != nil {
		log.Fatal(err)
	}
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
	api := e.Group("/api")
	api.GET("/users", getUsers)
	api.POST("/users", postUsers)
	api.GET("/worlds", getWorlds)
	api.GET("/worlds/name/:name", getWorld)
	api.GET("/chunks/:worldId/:chunks", getWorldChunks)
	api.POST("/worlds", postWorlds)
	api.GET("/structures", getStructures)
	api.POST("/structures", postStructures)
	api.GET("/structures/:userId", getStructuresByUser)
	api.GET("/entities", getEntities)
	api.POST("/entities", postEntities)
	api.GET("/entities/:userId", getEntitiesByUser)
	api.GET("/components", getComponents)
	api.POST("/components", postComponents)
	api.GET("/files/list", listFiles)
	api.GET("/files/download/:dir/:filename", getFiles)
	api.POST("/files/upload", postFiles)
	api.GET("/directories/list/:userId", getDirectories)
	api.POST("/directories", postDirectories)
	api.GET("/documents/:path/:filename", getText)
	api.POST("/documents/:path/:filename", postText)

	e.Static("/", "../web")
	e.Static("/world/:name", "../web/index.html") // eventually make this route name configurable to the specific use case, 'world', 'venue', 'event', etc..
	e.File("/hyperspace", "../web/index.html") // client should generate a meta-world out of (portals to) networked convolvr sites
	e.File("/worlds", "../web/index.html")
	e.File("/worlds/new", "../web/index.html")
	e.File("/chat", "../web/index.html")
	e.File("/login", "../web/index.html")
	e.File("/settings", "../web/index.html")

	hub.Handle("chat message", chatMessage)
	hub.Handle("update", update)
	hub.Handle("tool action", toolAction)
	e.GET("/connect", nexusHandler)

	e.Logger.Fatal(e.Start(port))
}

func nexusHandler(c echo.Context) error {
	websocket.Handler(hub.Serve).ServeHTTP(c.Response(), c.Request())
	return nil
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

func getUsers(c echo.Context) error {
	var users []User
	err := db.All(&users)
	if err != nil {
		log.Println(err)
		return err
	}
	return c.JSON(http.StatusOK, &users)
}

func postUsers(c echo.Context) (err error) {
	var (
		user *User
		foundUser User
		authUsersFound []User
	)
	user = new(User)
	if err := c.Bind(user); err != nil {
    return err
  }
	dbErr := db.One("Name", user.Name, &foundUser)
  if dbErr != nil { // if user doesn't exist
    log.Println(dbErr)
		dbErr := db.Save(user)
		if dbErr != nil {
			log.Println(dbErr)
			return dbErr
		}
		return c.JSON(http.StatusOK, &user)
	} else {
		lookupErr := db.Select(q.And(
			q.Eq("Name", user.Name),
			q.Eq("Password", user.Password),
		)).Find(&authUsersFound)
		if lookupErr != nil {
			log.Println(lookupErr)
		}
		if len(authUsersFound) == 0 {
			return c.JSON(http.StatusOK, nil)
		} else {
			return c.JSON(http.StatusOK, &authUsersFound[0]) // valid login
		}
	}
}

func getWorlds(c echo.Context) error {
	var worlds []World
	err := db.All(&worlds)
	if err != nil {
		log.Println(err)
		return err
	}
	return c.JSON(http.StatusOK, &worlds)
}

func getWorld(c echo.Context) error { // load specific world
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
  name := c.Param("name")
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
  return c.JSON(http.StatusOK, &world)
}

func getWorldChunks(c echo.Context) error {
  var (
		worldData World
    generatedChunk Chunk
    chunksData []Chunk
    chunkData []Chunk
		structures []Structure
		structure Structure
  )
	chunk := c.Param("chunks")
	world := c.Param("worldId")
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
				  structure = *NewStructure(0, "test", "box", "plastic", nil, nil, []int{0,0,0}, []int{0,0,0,0}, 1+rand.Intn(7), 1+rand.Intn(3), 1+rand.Intn(3), light)
	    		  structures = append(structures, structure)
			  }
		  }
		  bright := 100 + rand.Intn(155)
		  color := (bright << 16) | (bright << 8) | bright
			altitude := float32(0)
			if (worldData.Terrain.TerrainType == "voxels" ||
					worldData.Terrain.TerrainType == "both") {
					altitude = float32((math.Sin(float64(x)/2)*9+math.Cos(float64(z)/2)*9) / worldData.Terrain.Flatness)
			}
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
	return c.JSON(http.StatusOK, &chunksData)
}

func postWorlds(c echo.Context) error {
	var (
		world *World
	)
	world = new(World)
	if err := c.Bind(world); err != nil {
		return err
	}
	err := db.Save(world)
	if err != nil {
		log.Println(err)
		return err
	}
	return c.JSON(http.StatusOK, nil)
}

func getStructures(c echo.Context) error { // structure types
	var structures []Structure
	err := db.All(&structures)
	if err != nil {
		log.Println(err)
		return err
	}
	return c.JSON(http.StatusOK, &structures)
}

func postStructures(c echo.Context) error {
	var (
		structure *Structure
	)
	structure = new(Structure)
	if err := c.Bind(&structure); err != nil {
		return err
	}
	dbErr := db.Save(&structure)
	if dbErr != nil {
		log.Println(dbErr)
		return dbErr
	}
	return c.JSON(http.StatusOK, nil)
}

func getStructuresByUser(c echo.Context) error { // custom structure types
	return c.JSON(http.StatusOK, nil)
}

func getEntities(c echo.Context) error { // entity types
	var entities []Entity
	err := db.All(&entities)
	if err != nil {
		log.Println(err)
		return err
	}
	return c.JSON(http.StatusOK, entities)
}

func postEntities(c echo.Context) error {
	var (
		entity *Entity
	)
	entity = new(Entity)
	if err := c.Bind(&entity); err != nil {
		return err
	}
	dbErr := db.Save(&entity)
	if dbErr != nil {
		log.Println(dbErr)
		return dbErr
	}
	return c.JSON(http.StatusOK, nil)
}

func getEntitiesByUser(c echo.Context) error { // custom entities
	return c.JSON(http.StatusOK, nil)
}

func getComponents(c echo.Context) error { // component types
	var components []Component
	err := db.All(&components)
	if err != nil {
		log.Println(err)
		return err
	}
	return c.JSON(http.StatusOK, components)
}

func postComponents(c echo.Context) error {
	var (
		component *Component
	)
	component = new(Component)
	if err := c.Bind(&component); err != nil {
		return err
	}
	dbErr := db.Save(&component)
	if dbErr != nil {
		log.Println(dbErr)
		return dbErr
	}
	return c.JSON(http.StatusOK, nil)
}

func listFiles(c echo.Context) error { // Get /files/list
	files, _ := ioutil.ReadDir("./")
  for _, f := range files {
    log.Println(f.Name())
  }
	return c.JSON(http.StatusOK, nil)
}
func getFiles(c echo.Context) error { // Get /files/download/:dir/:filename
	return c.JSON(http.StatusOK, nil)
}
func postFiles(c echo.Context) error { // Post /files/upload
	return c.JSON(http.StatusOK, nil)
}
func getDirectories(c echo.Context) error { // Get /directories/list/:userId
	return c.JSON(http.StatusOK, nil)
}
func postDirectories(c echo.Context) error { // Post("/directories
	return c.JSON(http.StatusOK, nil)
}
func getText(c echo.Context) error { // Get /documents/:path/:filename
	return c.JSON(http.StatusOK, nil)
}
func postText(c echo.Context) error  { // Post /documents/:path/:filename
	return c.JSON(http.StatusOK, nil)
}
