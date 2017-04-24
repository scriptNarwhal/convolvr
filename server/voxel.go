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
	ID       int       `storm:"id,increment" json:"id"`
	X        int       `storm:"index" json:"x"`
	Y        int       `storm:"index" json:"y"`
	Z        int       `storm:"index" json:"z"`
	Altitude float32   `json:"altitude"`
	World    string    `storm:"id" json:"world"`
	Name     string    `json:"name"`
	Geometry string    `json:"geometry"`
	Material string    `json:"material"`
	Color    int       `json:"color"`
	Entities []*Entity `json:"entities"`
}

func NewVoxel(id int, x int, y int, z int, alt float32, world string, name string, geom string, mat string, color int, entities []*Entity) *Voxel {
	return &Voxel{id, x, y, z, alt, world, name, geom, mat, color, entities}
}

func getWorldChunks(c echo.Context) error {
	var (
		worldData           World
		generatedChunk      Voxel
		chunksData          []Voxel
		foundChunks         []Voxel
		structures          []*Entity
		structure           *Entity
		structureComponents []*Component
		entities            []*Entity
		chunkVoxels         []*Voxel
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
			altitude := float32(0)
			if worldData.Terrain.TerrainType == "voxels" ||
				worldData.Terrain.TerrainType == "both" {
				if worldData.Terrain.Turbulent {
					altitude = float32((math.Sin(float64(x)/2)*9+float64((x%2)-(z%3))+math.Cos(float64(z)/2)*9)/worldData.Terrain.Flatness) * 200000.0
				} else {
					altitude = float32((math.Sin(float64(x)/2)*9+math.Cos(float64(z)/2)*9)/worldData.Terrain.Flatness) * 200000.0
				}

			}
			chunkGeom := "flat"
			if rand.Intn(10) < 5 {
				chunkGeom = "space"
			} else {
				initErr := voxelEntities.Init(&Entity{})
				if initErr != nil {
					log.Println(initErr)
				}
				if rand.Intn(26) > 20 && worldData.Spawn.Structures {
					wallPos := []float64{}
					floors := 2 + rand.Intn(16)
					structureSize := 300000.0
					for i := 0; i < floors; i++ {
						floorPos := []float64{0.0, float64(i)*structureSize/2 - structureSize/2, 0.0}
						floorQuat := []float64{0.0, 0.0, 0.0, 0.0}
						floorProps := make(map[string]interface{})
						floorGeometry := make(map[string]interface{})
						floorMaterial := make(map[string]interface{})
						floorProps["floor"] = map[string]int{
							"level": i,
						}
						floorGeometry["size"] = []float64{structureSize, 5000, structureSize}
						floorGeometry["shape"] = "box"
						floorGeometry["merge"] = true
						floorMaterial["name"] = "plastic"
						floorMaterial["color"] = 0x404040
						floorProps["geometry"] = floorGeometry
						floorProps["material"] = floorMaterial
						wallState := make(map[string]interface{})
						structureComponents = append(structureComponents, NewComponent("", floorPos, floorQuat, floorProps, wallState, []*Component{}))
						for w := 0; w < 4; w++ {
							geometry := make(map[string]interface{})
							material := make(map[string]interface{})
							geometry["shape"] = "box"
							geometry["merge"] = true
							if w < 2 {
								wallPos = []float64{0.0, -structureSize/2 + float64(i)*structureSize/2, -structureSize/2.0 + float64(w)*structureSize}
								geometry["size"] = []float64{structureSize, structureSize / 3.2, 5000}
							} else {
								wallPos = []float64{-structureSize*2.5 + float64(w)*structureSize, -structureSize/2 + float64(i)*structureSize/2, 0.0}
								geometry["size"] = []float64{5000, structureSize / 3.2, structureSize}
							}
							wallQuat := []float64{0.0, 0.0, 0.0, 0.0}
							wallProps := make(map[string]interface{})
							wallProps["wall"] = map[string]int{
								"index": w,
							}
							material["name"] = "plastic"
							material["color"] = 0x404040
							wallProps["geometry"] = geometry
							wallProps["material"] = material
							wallState := make(map[string]interface{})
							structureComponents = append(structureComponents, NewComponent("", wallPos, wallQuat, wallProps, wallState, []*Component{}))
						}
					}
					structurePos := []float64{float64(x) * 928000.0, float64(altitude) - (float64(floors) * 25000), float64(z) * 807360.0}
					structure = NewEntity("Generic Building", world, structureComponents, structurePos, []float64{0.0, 0.0, 0.0, 0.0})
					structures = append(structures, structure)
				}

			}

			generatedChunk = *NewVoxel(0, x, y, z, altitude, world, "", chunkGeom, "metal", worldData.Terrain.Color, structures)
			chunksData = append(chunksData, generatedChunk)
			saveErr := voxel.Save(&generatedChunk)
			if saveErr != nil {
				log.Println(saveErr)
			}
		} else {
			voxelEntities.All(&entities)
			subVoxels.All(&chunkVoxels)
			foundChunks[0].Entities = entities
			chunksData = append(chunksData, foundChunks[0])
		}
	}
	return c.JSON(http.StatusOK, &chunksData)
}
