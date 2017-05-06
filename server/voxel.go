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
		worldData      World
		generatedChunk Voxel
		chunksData     []Voxel
		foundChunks    []Voxel
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
					entities = append(entities, generateBuilding(world, x, z, altitude))
				}
			}

			generatedChunk = *NewVoxel(0, x, y, z, altitude, world, "", chunkGeom, "metal", worldData.Terrain.Color, entities)
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

func generateBuilding(world string, x int, z int, altitude float32) *Entity {
	var (
		structure           *Entity
		structureComponents []*Component
	)
	floors := 2 + rand.Intn(10)
	width := 1.0 + float64(rand.Intn(2))
	structureSize := 300000.0
	for i := 0; i < floors; i++ {
		floorPos := []float64{0.0, structureSize * 0.5 * float64(i), 0.0}
		floorQuat := []float64{0.0, 0.0, 0.0, 0.0}
		floorProps := make(map[string]interface{})
		floorGeometry := make(map[string]interface{})
		floorMaterial := make(map[string]interface{})
		floorProps["floor"] = map[string]int{
			"level": i,
		}
		floorGeometry["size"] = []float64{structureSize * width, 5000, structureSize}
		floorGeometry["shape"] = "box"
		floorGeometry["merge"] = true
		floorMaterial["name"] = "plastic"
		floorMaterial["color"] = 0x404040
		floorProps["geometry"] = floorGeometry
		floorProps["material"] = floorMaterial
		wallState := make(map[string]interface{})
		structureComponents = append(structureComponents, NewComponent("", floorPos, floorQuat, floorProps, wallState, []*Component{}))
		for w := 0; w < 4; w++ {
			wall := generateWall(w, i, width, structureSize)
			structureComponents = append(structureComponents, wall)
		}
	}
	structurePos := []float64{100000 + (float64(x) * 928000.0), float64(altitude) + 10000, float64(z) * 807360.0} //  + (structureSize * width)
	structure = NewEntity("Generic Building", world, structureComponents, structurePos, []float64{0.0, 0.0, 0.0, 0.0})
	return structure
}

func generateWall(w int, i int, width float64, structureSize float64) *Component {
	wallPos := []float64{}
	geometry := make(map[string]interface{})
	material := make(map[string]interface{})
	geometry["shape"] = "box"
	geometry["merge"] = true
	if w < 2 {
		wallPos = []float64{0.0, (-structureSize / 3.2) + float64(i)*structureSize/2, structureSize/2.0 + float64(w-1)*structureSize}
		geometry["size"] = []float64{structureSize * width, structureSize / 3.2, 5000}
	} else if w < 4 {
		wallPos = []float64{((float64(w-2) - 0.5) * width) * structureSize, (-structureSize / 3.2) + float64(i)*structureSize/2, 0.0}
		geometry["size"] = []float64{5000, structureSize / 3.2, structureSize}
	} //else {
	//		wallPos = []float64{-structureSize*2.5 + float64(w-4)*structureSize, -structureSize/2 + float64(i)*structureSize/2, 0.0}
	//		geometry["size"] = []float64{structureSize * width, structureSize / 3.2, 5000}
	//	}
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
	return NewComponent("", wallPos, wallQuat, wallProps, wallState, []*Component{})
}
