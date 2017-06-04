package convolvr

import (
	"math"
	"math/rand"
	"net/http"

	log "github.com/Sirupsen/logrus"
	"github.com/labstack/echo"
)

type UniverseSettings struct {
	ID             int             `storm:"id" json:"id"`
	WelcomeMessage string          `json:"welcomeMessage"`
	DefaultWorld   string          `json:"defaultWorld"`
	Network        []NetworkDomain `storm:"inline" json:"network"`
}

type NetworkDomain struct {
	Name  string `json:"name"`
	Image string `json:"image"`
}

type World struct {
	ID                  int     `storm:"id,increment" json:"id"`
	UserID              int     `storm:"id,index" json:"userId"`
	UserName            string  `storm:"id,index" json:"userName"`
	Name                string  `storm:"index" json:"name"`
	Gravity             float64 `json:"gravity"`
	HighAltitudeGravity bool    `json:"highAltitudeGravity"`
	Sky                 `storm:"inline" json:"sky"`
	Light               `storm:"inline" json:"light"`
	Terrain             `storm:"inline" json:"terrain"`
	Spawn               `storm:"inline" json:"spawn"`
}

type Sky struct {
	SkyType     string   `json:"skyType"`
	Red         float32  `json:"red"`
	Green       float32  `json:"green"`
	Blue        float32  `json:"blue"`
	Layers      []Layer  `storm:"inline" json:"layers"`
	Skybox      []string `json:"skybox"`
	Photosphere string   `json:"photosphere"`
}

type Layer struct {
	Movement      []int   `json:"movement"`
	Opacity       float64 `json:"opacity"`
	Altitude      int     `json:"altitude"`
	Texture       string  `json:"texture"`
	CustomTexture string  `json:"customTexture"`
}

type Light struct {
	Color        int     `json:"color"`
	Intensity    float64 `json:"intensity"`
	Pitch        float64 `json:"pitch"` // radians; 0 == top down
	Yaw          float64 `json:"yaw"`
	AmbientColor int     `json:"ambientColor"`
}

type Terrain struct {
	TerrainType string  `json:"type"`
	Turbulent   bool    `json:"turbulent"`
	FlatAreas   bool    `json:"flatAreas"`
	Height      int     `json:"height"`
	Color       int     `json:"color"`
	Red         float64 `json:"red"`
	Green       float64 `json:"green"`
	Blue        float64 `json:"blue"`
	Flatness    float64 `json:"flatness"`
	Decorations string  `json:"decorations"`
}

type Spawn struct {
	Entities   bool `json:"entities"`
	Structures bool `json:"structures"`
	Roads      bool `json:"roads"`
	Trees      bool `jsong:"trees"`
	NPCS       bool `json:"npcs"`
	Tools      bool `json:"tools"`
	Vehicles   bool `json:"vehicles"`
}

func NewWorld(id int, userId int, userName string, name string, gravity float64, highAltitudeGravity bool, sky Sky, light Light, terrain Terrain, spawn Spawn) *World {
	return &World{id, userId, userName, name, gravity, highAltitudeGravity, sky, light, terrain, spawn}
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

func getUserWorlds(c echo.Context) error {
	// var worlds []World
	// userId, _ := strconv.Atoi(c.Param("userId"))
	// err := db.Find("UserID", userId, &worlds)
	// if err != nil {
	// 	log.Println(err)
	// 	return err
	// }
	//return c.JSON(http.StatusOK, &worlds)
	return c.JSON(http.StatusOK, nil)
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
	createDataDir(world.UserName, "worlds/"+world.Name)
	return c.JSON(http.StatusOK, nil)
}

func getWorld(c echo.Context) error { // load specific world
	var (
		world        World
		red          float64
		green        float64
		blue         float64
		terrainRed   float64
		terrainGreen float64
		terrainBlue  float64
		first        float64
		second       float64
		third        float64
		lightColor   int
		ambientColor int
		terrainColor int
	)
	name := c.Param("name")
	log.Println(name)
	err := db.One("Name", name, &world)
	if err != nil {
		log.Println(err)

		first = 0.9 + (rand.Float64() * 0.1)
		second = first*0.95 - rand.Float64()*0.05
		third = second*0.2 - rand.Float64()*0.1

		if rand.Intn(12) > 6 {
			if rand.Intn(12) > 6 {
				red = 0.3
				green = second / 1.5
				blue = first
			} else {
				red = 0.2
				green = first / 1.1
				blue = first
			}
		} else {
			if rand.Intn(12) > 6 {
				red = first / 1.1
				green = first / 1.5
				blue = first
			} else {
				red = first
				green = first / 1.6
				blue = third / 4.0
			}
		}

		terrainRed = 0.05 + red*0.7 + blue
		terrainGreen = green*1.5 - red/5.0 - blue/3.0
		terrainBlue = 0.05 + blue*0.7 + red

		terrainColor = int(math.Floor(terrainRed*254))<<16 | int(math.Floor(terrainGreen*254))<<8 | int(math.Floor(terrainBlue*254))
		lightColor = int(math.Floor(red*255))<<16 | int(math.Floor(green*255))<<8 | int(math.Floor(blue*255))
		ambientColor = int(255*red/12.0)<<16 | int(255*green/12.0)<<8 | int(255*blue/12.0)

		red *= 3.2
		green *= 3.2
		blue *= 3.2

		terrainRed += red
		terrainGreen += green
		terrainBlue += blue

		sky := Sky{SkyType: "standard", Red: float32(red), Green: float32(green), Blue: float32(blue), Layers: nil, Skybox: nil, Photosphere: ""}
		light := Light{Color: lightColor, Intensity: 1.0, Pitch: 1.64, Yaw: rand.Float64() * 3.14, AmbientColor: ambientColor}
		terrain := Terrain{TerrainType: "both", Height: 20000, Color: terrainColor, Red: terrainRed, Green: terrainGreen, Blue: terrainBlue, FlatAreas: true, Flatness: float64(1.0 + rand.Float64()*16.0), Decorations: ""}
		spawn := Spawn{Entities: true, Structures: true, Roads: true, Trees: true, NPCS: true, Tools: true, Vehicles: true}
		gravity := 1.0
		highAltitudeGravity := false
		world = *NewWorld(0, -1, "space", name, gravity, highAltitudeGravity, sky, light, terrain, spawn)
		saveErr := db.Save(&world)
		if saveErr != nil {
			log.Println(saveErr)
		}
		createDataDir("public", "worlds/"+name)
	}
	return c.JSON(http.StatusOK, &world)
}

func getUniverseSettings(c echo.Context) error {
	var settings UniverseSettings
	err := db.One("ID", 1, &settings)
	if err != nil {
		log.Println(err)
		return err
	}
	return c.JSON(http.StatusOK, &settings)
}

func postUniverseSettings(c echo.Context) error {
	var settings *UniverseSettings
	settings = new(UniverseSettings)
	if err := c.Bind(settings); err != nil {
		return err
	}
	err := db.Save(settings)
	if err != nil {
		log.Println(err)
		return err
	}
	return c.JSON(http.StatusOK, nil)
}
