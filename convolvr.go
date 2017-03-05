package convolvr

import (
	"fmt"

	log "github.com/Sirupsen/logrus"
	"github.com/asdine/storm"
	"github.com/ds0nt/nexus"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
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
	chatHistory := db.From("chathistory")
	historyErr := chatHistory.Init(&ChatMessage{})
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
	if historyErr != nil {
		log.Fatal(historyErr)
	}
	api := e.Group("/api")
	api.GET("/users", getUsers)
	api.POST("/users", postUsers)
	api.GET("/chat-history/:skip", getChatHistory)
	api.GET("/worlds", getWorlds)
	api.GET("/worlds/name/:name", getWorld)
	api.GET("/chunks/:worldId/:chunks", getWorldChunks)
	api.POST("/worlds", postWorlds)
	api.GET("/universe-settings", getUniverseSettings)
	api.POST("/universe-settings", postUniverseSettings)
	api.GET("/structures", getStructures)
	api.POST("/structures", postStructures)
	api.GET("/structures/:userId", getStructuresByUser)
	api.GET("/entities", getEntities)
	api.POST("/entities", postEntities)
	api.GET("/entities/:userId", getEntitiesByUser)
	api.GET("/components", getComponents)
	api.POST("/components", postComponents)
	api.GET("/files/list/:username", listFiles)
	api.GET("/files/list/:username", listFiles)
	api.GET("/files/download/:username/:filename", getFiles)
	api.POST("/files/upload/:username", postFiles)
	api.POST("/files/upload-multiple/:username", postMultipleFiles)
	api.GET("/directories/list/:username", getDirectories)
	api.POST("/directories/:username", postDirectories)
	api.GET("/documents/:username/:filename", getText)
	api.POST("/documents/:username/:filename", postText)

	e.Static("/", "../web")
	e.Static("/world/:name", "../web/index.html") // eventually make this route name configurable to the specific use case, 'world', 'venue', 'event', etc..
	e.File("/hyperspace", "../web/index.html")    // client should generate a meta-world out of (portals to) networked convolvr sites
	e.File("/worlds", "../web/index.html")
	e.File("/worlds/new", "../web/index.html")
	e.File("/chat", "../web/index.html")
	e.File("/data", "../web/index.html")
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
