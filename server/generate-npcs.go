package convolvr

import (
	"math"
)

func generateNPC(id int, world string, x int, z int, altitude float32) *Entity {
	var (
		structure           *Entity
		structureComponents []*Component
	)
	floors := 1
	width := 2.8
	structureSize := 4000.0

	floorPos := []float64{0.0, 0.0, 0.0}
	floorQuat := []float64{0.0, 0.0, 0.0, 0.0}
	floorProps := make(map[string]interface{})
	floorGeometry := make(map[string]interface{})
	floorMaterial := make(map[string]interface{})
	floorProps["floor"] = map[string]int{
		"level": 0,
	}
	floorGeometry["size"] = []float64{structureSize, 10000, structureSize * width}
	floorGeometry["shape"] = "box"
	floorGeometry["merge"] = true
	floorMaterial["name"] = "metal"
	floorMaterial["color"] = 0xf0f0f0
	floorProps["geometry"] = floorGeometry
	floorProps["material"] = floorMaterial
	wallState := make(map[string]interface{})
	structureComponents = append(structureComponents, NewComponent("", floorPos, floorQuat, floorProps, wallState, []*Component{}, nil))

	structurePos := []float64{(float64(x) * 928000.0), float64(altitude) - 80000, float64(z) * 807360.0} //  + (structureSize * width)
	structureRadius := math.Sqrt(math.Pow(width, 2) + math.Pow(float64(floors)*structureSize*0.5, 2))
	structure = NewEntity(id+1, "Convolvr Bot 0"+string(id+1), world, structureComponents, structurePos, []float64{0.0, 0.0, 0.0, 0.0}, structureRadius, nil)
	return structure
}

func canPlaceNPCAt(x int, y int, z int) bool {

	xOffset := int(math.Abs(float64(x % 4)))
	//zOffset := int(math.Abs(float64(z % 5)))
	placeStructure := false

	if (int(math.Abs(float64(x%30))) < 8) && (int(math.Abs(float64(z%30))) < 8) {

		if xOffset == 0 {

			placeStructure = true

		}

	}

	return placeStructure

}
