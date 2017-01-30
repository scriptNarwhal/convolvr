package convolvr

import (
	"strings"
  "strconv"
	"math"
  "math/rand"
	"net/http"
	log "github.com/Sirupsen/logrus"
	"github.com/asdine/storm/q"
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
	SkyType string  `json:"skyType"`
	Red    float32    `json:"red"`
	Green  float32    `json:"green"`
	Blue   float32    `json:"blue"`
	Layers  []Layer `storm:"inline" json:"layers"`
	Skybox []string `json:"skybox"`
	Photosphere string `json:"photosphere"`
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
	AmbientColor int `json:"ambientColor"`
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
