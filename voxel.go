package convolvr

import (
	"math"
	"math/rand"
	"net/http"
	"strconv"
	"strings"

	log "github.com/Sirupsen/logrus"
	"github.com/labstack/echo"
)

type Voxel struct {
	ID       int    `storm:"id,increment" json:"id"`
	Cell     []int  `json:"cell"`
	Geometry string `json:"geometry"`
	Material string `json:"material"`
}

func NewVoxel(id int, cell []int, geom string, mat string) *Voxel {
	return &Voxel{id, cell, geom, mat}
}

type Chunk struct {
	ID         int         `storm:"id,increment" json:"id"`
	X          int         `storm:"index" json:"x"`
	Y          int         `storm:"index" json:"y"`
	Z          int         `storm:"index" json:"z"`
	Altitude   float32     `json:"altitude"`
	World      string      `storm:"id" json:"world"`
	Name       string      `json:"name"`
	Geometry   string      `json:"geometry"`
	Material   string      `json:"material"`
	Color      int         `json:"color"`
	Voxels     []*Voxel    `json:"voxels"`
	Entities   []*Entity   `json:"entities"`
}

func NewChunk(id int, x int, y int, z int, alt float32, world string, name string, geom string, mat string, color int, voxels []*Voxel, entities []*Entity) *Chunk {
	return &Chunk{id, x, y, z, alt, world, name, geom, mat, color, voxels, entities}
}

func getWorldChunks(c echo.Context) error {
	var (
		worldData      World
		generatedChunk Chunk
		chunksData     []Chunk
		foundChunks    []Chunk
		// structures     []*Entity
		// structure      Entity
		entities       []*Entity
		chunkVoxels    []*Voxel
	)
	chunk := c.Param("chunks")
	world := c.Param("worldId")
	chunks := strings.Split(chunk, ",")
	worldErr := db.One("Name", world, &worldData)
	if worldErr != nil {
		log.Println(worldErr)
	}
	voxels := db.From("World_" + world)
	for _, v := range chunks {
		coords := strings.Split(v, "x")
		x, _ := strconv.Atoi(coords[0])
		y, _ := strconv.Atoi(coords[1])
		z, _ := strconv.Atoi(coords[2])
		voxel := voxels.From("X_" + coords[0]).From("Y_" + coords[1]).From("Z_" + coords[2])
		voxelEntities := voxel.From("entities")
		subVoxels := voxel.From("voxels")
		voxel.All(&foundChunks)
		if len(foundChunks) == 0 {
			chunkGeom := "flat"
			if rand.Intn(10) < 5 {
				chunkGeom = "space"
			} else {
				if rand.Intn(26) > 23 && worldData.Spawn.Structures {
					//structure = *NewStructure(0, "test", "box", "plastic", nil, nil, []int{0, 0, 0}, []int{0, 0, 0, 0}, 2+rand.Intn(5), 2+rand.Intn(9), 2+rand.Intn(5), light)
					//structures = append(structures, structure)
				}
				initErr := voxelEntities.Init(&Entity{})
				if initErr != nil {
					log.Println(initErr)
				}
				initErr = subVoxels.Init(&Voxel{})
				if initErr != nil {
					log.Println(initErr)
				}
			}
			altitude := float32(0)
			if worldData.Terrain.TerrainType == "voxels" ||
				worldData.Terrain.TerrainType == "both" {
				if worldData.Terrain.Turbulent {
					altitude = float32((math.Sin(float64(x)/2)*9 + float64((x%2) - (z%3)) + math.Cos(float64(z)/2)*9) / worldData.Terrain.Flatness) * 200000.0
				} else {
					altitude = float32((math.Sin(float64(x)/2)*9 + math.Cos(float64(z)/2)*9) / worldData.Terrain.Flatness) * 200000.0
				}
				
			}
			generatedChunk = *NewChunk(0, x, y, z, altitude, world, "", chunkGeom, "metal", worldData.Terrain.Color, nil, nil)
			chunksData = append(chunksData, generatedChunk)
			saveErr := voxel.Save(&generatedChunk)
			if saveErr != nil {
				log.Println(saveErr)
			}
		} else {
			voxelEntities.All(&entities)
			subVoxels.All(&chunkVoxels)
			foundChunks[0].Entities = entities
			foundChunks[0].Voxels = chunkVoxels
			chunksData = append(chunksData, foundChunks[0])
		}
	}
	return c.JSON(http.StatusOK, &chunksData)
}
