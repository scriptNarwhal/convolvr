package convolvr

import (
	"math"
	"math/rand"
	"net/http"

	log "github.com/Sirupsen/logrus"
	"github.com/labstack/echo"
)

type World struct {
	ID      int    `storm:"id,increment" json:"id"`
	Name    string `storm:"index" json:"name"`
	Sky     `storm:"inline" json:"sky"`
	Light   `storm:"inline" json:"light"`
	Terrain `storm:"inline" json:"terrain"`
	Spawn   `storm:"inline" json:"spawn"`
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
	CustomTexture string  `json:"texture"`
}

type Light struct {
	Color        int     `json:"color"`
	Intensity    float64 `json:"intensity"`
	Angle        float64 `json:"angle"`
	AmbientColor int     `json:"ambientColor"`
}

type Terrain struct {
	TerrainType string  `json:"type"`
	Height      int     `json:"height"`
	Color       int     `json:"color"`
	Flatness    float64 `json:"flatness"`
	Decorations string  `json:"decorations"`
}

type Spawn struct {
	Entities   bool `json:"entities"`
	Structures bool `json:"structures"`
	NPCS       bool `json:"npcs"`
	Tools      bool `json:"tools"`
	Vehicles   bool `json:"vehicles"`
}

func NewWorld(id int, name string, sky Sky, light Light, terrain Terrain, spawn Spawn) *World {
	return &World{id, name, sky, light, terrain, spawn}
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

		first = 1.0 + (rand.Float64() * 0.1)
		second = first/2 + rand.Float64()*0.25
		third = second/5 + rand.Float64()*0.25
		if rand.Intn(10) > 6 {
			first = 1.0
			second = 0.95
			third = 0.92
		}
		if rand.Intn(12) > 6 {
			if rand.Intn(3) > 2 {
				red = first
				green = third
				blue = second
			} else {
				red = third / 3.0
				green = first
				blue = second / 2.0
			}
		} else if rand.Intn(10) > 5 {
			if rand.Intn(6) > 2 {
				red = third
				green = second / 2.0
				blue = first
			} else {
				red = first
				blue = second / 6.0
				green = third / 2.0
			}
		} else {
			if rand.Intn(3) > 2 {
				red = second / 2.0
				green = first / 6.0
				blue = first
			} else {
				green = second / 2.0
				red = first / 4.0
				blue = first
			}
		}
		terrainRed = green / 1.5
		terrainGreen = blue / 1.5
		terrainBlue = red / 1.5
		lightColor = int(math.Floor(red*255))<<16 | int(math.Floor(green*255))<<8 | int(math.Floor(blue*255))
		ambientColor = int(4+math.Floor(red*4))<<16 | int(4+math.Floor(green*4))<<8 | int(4+math.Floor(blue*4))
		terrainColor = int(math.Floor(terrainRed*255))<<16 | int(math.Floor(terrainGreen*255))<<8 | int(math.Floor(terrainBlue*255))
		sky := Sky{SkyType: "standard", Red: float32(red), Green: float32(green), Blue: float32(blue), Layers: nil, Skybox: nil, Photosphere: ""}
		light := Light{Color: int(lightColor), Intensity: 1.0, Angle: 3.14, AmbientColor: ambientColor}
		terrain := Terrain{TerrainType: "both", Height: 20000, Color: terrainColor, Flatness: float64(1.0 + rand.Float64()*16.0), Decorations: ""}
		spawn := Spawn{Entities: true, Structures: true, NPCS: true, Tools: true, Vehicles: true}
		world = *NewWorld(0, name, sky, light, terrain, spawn)
		saveErr := db.Save(&world)
		if saveErr != nil {
			log.Println(saveErr)
		}
	}
	return c.JSON(http.StatusOK, &world)
}
