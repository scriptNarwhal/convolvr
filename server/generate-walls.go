package convolvr

import (
	"math"
)

func generateWall(id int, world string, x int, z int, altitude float32) *Entity {
	var (
		structure           *Entity
		structureComponents []*Component
	)
	floors := 1
	width := 2.8
	structureSize := 285000.0

	floorPos := []float64{0.0, 0.0, 0.0}
	floorQuat := []float64{0.0, 0.0, 0.0, 0.0}
	floorProps := make(map[string]interface{})
	floorGeometry := make(map[string]interface{})
	floorMaterial := make(map[string]interface{})
	floorProps["floor"] = map[string]int{
		"level": 0,
	}
	floorGeometry["size"] = []float64{structureSize, structureSize * 1.61, structureSize * width}
	floorGeometry["shape"] = "box"
	floorGeometry["merge"] = true
	floorMaterial["name"] = "plastic"
	floorMaterial["color"] = 0x303030
	floorProps["geometry"] = floorGeometry
	floorProps["material"] = floorMaterial
	wallState := make(map[string]interface{})
	structureComponents = append(structureComponents, NewComponent("", floorPos, floorQuat, floorProps, wallState, []*Component{}, nil))

	structurePos := []float64{(float64(x) * 928000.0), float64(altitude) - 89000, float64(z) * 807360.0} //  + (structureSize * width)
	structureRadius := math.Sqrt(math.Pow(width, 2) + math.Pow(float64(floors)*structureSize*0.5, 2))
	structure = NewEntity(id+1, "Great Wall of Convolvr", world, structureComponents, structurePos, []float64{0.0, 0.0, 0.0, 0.0}, structureRadius, nil)
	return structure
}

func canPlaceWallAt(x int, y int, z int) bool {

	xOffset := int(math.Abs(float64(x % 4)))
	//zOffset := int(math.Abs(float64(z % 5)))
	placeStructure := false

	if (int(math.Abs(float64(x%30))) < 16) && (int(math.Abs(float64(z%30))) < 16) {

		if xOffset == 2 {

			placeStructure = true

		}

	}

	return placeStructure

}
