package convolvr

import (
	"math"
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
	Entities []*Entity `json:"entities"`
}

func NewVoxel(id int, x int, y int, z int, alt float32, world string, name string, entities []*Entity) *Voxel {
	return &Voxel{id, x, y, z, alt, world, name, entities}
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
	generatedBuildings := 0
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
			flatArea := worldData.Terrain.FlatAreas == true && math.Sin(2+float64(x)/9.0)+math.Cos(2+float64(z)/9.0) > 0.66

			if worldData.Terrain.TerrainType == "voxels" || worldData.Terrain.TerrainType == "both" {

				if flatArea == false {

					if worldData.Terrain.Turbulent {

						altitude = float32((math.Sin(float64(x)/2)*9+float64((x%2)-(z%3))+math.Cos(float64(z)/2)*9)/worldData.Terrain.Flatness) * 200000.0

					} else {

						altitude = float32((math.Sin(float64(x)/2)*9+math.Cos(float64(z)/2)*9)/worldData.Terrain.Flatness) * 200000.0

					}

				}

			}

			// create terrain as entity.. the 1st entity, or ideally, one with the largeset bounding radius should have higher LOD priority
			entities = append(entities, generateTerrain(world, x, y, z, altitude, worldData.Terrain.Color, "default"))

			initErr := voxelEntities.Init(&Entity{})
			if initErr != nil {
				log.Println(initErr)
			}

			if worldData.Spawn.Structures {

				if canPlaceStructureAt(x, 0, z) {

					entities = append(entities, generateBuilding(generatedBuildings, world, x, z, altitude))
					generatedBuildings++

				}

			}

			generatedChunk = *NewVoxel(0, x, y, z, altitude, world, "", nil)
			saveErr := voxel.Save(&generatedChunk)
			generatedChunk.Entities = entities
			chunksData = append(chunksData, generatedChunk)

			if saveErr != nil {
				log.Println(saveErr)
			}

			for _, g := range entities {

				saveEntitiesError := voxelEntities.Save(g)
				if saveEntitiesError != nil {
					log.Println(saveEntitiesError)
				}

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

func generateTerrain(world string, x int, y int, z int, altitude float32, color int, terrainType string) *Entity {

	var (
		components []*Component
	)

	compPos := []float64{0.0, 0.0, 0.0}
	quat := []float64{0.0, 0.0, 0.0, 0.0}
	props := make(map[string]interface{})
	geometry := make(map[string]interface{})
	material := make(map[string]interface{})
	props["terrain"] = map[string]string{
		"type": terrainType + "rough",
	}
	geometry["size"] = []float64{537000, 537000, 835664}
	geometry["shape"] = "hexagon"
	geometry["faceNormals"] = false
	material["name"] = "terrain"
	material["color"] = color
	props["geometry"] = geometry
	props["material"] = material
	state := make(map[string]interface{})
	components = append(components, NewComponent("Terrain", compPos, quat, props, state, []*Component{}))

	xOffset := float64(1-(z%2)) * (928000 / 2)
	pos := []float64{(float64(x) * 929300.0) + xOffset, -524000 + float64(altitude) + 10000, float64(z) * 808360.0} //  + (structureSize * width)

	return NewEntity(0, "Terrain", world, components, pos, []float64{0.0, 0.0, 0.0, 0.0}, 537000.0)

}
