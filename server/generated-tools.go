package convolvr

import (
	"math"
)

func generateTool(id int, world string, x int, z int, altitude float32) *Entity {
	var (
		structure           *Entity
		structureComponents []*Component
	)
	width := 2.8
	structureSize := 4000.0

	pos := []float64{0.0, 0.0, 0.0}
	quat := []float64{0.0, 0.0, 0.0, 0.0}
	props := make(map[string]interface{})
	geometry := make(map[string]interface{})
	material := make(map[string]interface{})
	geometry["size"] = []float64{structureSize, 5000, structureSize * width}
	geometry["shape"] = "box"
	geometry["merge"] = true
	material["name"] = "metal"
	material["color"] = 0x404040
	props["geometry"] = geometry
	props["material"] = material
	wallState := make(map[string]interface{})
	structureComponents = append(structureComponents, NewComponent("", pos, quat, props, wallState, []*Component{}, nil))

	structurePos := []float64{(float64(x) * 928000.0), float64(altitude) - 80000, float64(z) * 807360.0} //  + (structureSize * width)

	structure = NewEntity(id+1, "Generic Tool", world, structureComponents, structurePos, []float64{0.0, 0.0, 0.0, 0.0}, 6000, nil)
	return structure
}

func canPlaceToolAt(x int, y int, z int) bool {

	xOffset := int(math.Abs(float64(x % 4)))
	//zOffset := int(math.Abs(float64(z % 5)))
	placeStructure := false

	if (int(math.Abs(float64(x%30))) < 8) && (int(math.Abs(float64(z%30))) < 8) {

		if xOffset == 2 {

			placeStructure = true

		}

	}

	return placeStructure

}
