package convolvr

import (
	"math"
	"math/rand"
)

func generateWall(id int, world string, x int, z int, altitude float32) *Entity {

	var (
		structure           *Entity
		structureComponents []*Component
	)
	floors := 2
	width := 6.0
	structureSize := 100000.0
	// create components for each floor & long / windowed wall
	for i := 0; i < floors; i++ {

		floorPos := []float64{0.0, structureSize * 2.0 * float64(i), 0.0}
		floorQuat := []float64{0.0, 0.0, 0.0, 0.0}
		floorProps := make(map[string]interface{})
		floorGeometry := make(map[string]interface{})
		floorMaterial := make(map[string]interface{})
		floorProps["floor"] = map[string]int{
			"level": i,
		}
		if i == 1 && rand.Float64() < 0.06 {
			light := make(map[string]interface{})
			light["type"] = "point"
			light["intensity"] = 1.0
			light["distance"] = 100000
			light["color"] = 0xffffff
			floorProps["light"] = light
		}
		floorGeometry["size"] = []float64{structureSize * width, 5000, structureSize}
		floorGeometry["shape"] = "box"
		floorGeometry["merge"] = true
		floorMaterial["name"] = "metal"
		floorMaterial["color"] = 0x808080
		floorProps["geometry"] = floorGeometry
		floorProps["material"] = floorMaterial
		wallState := make(map[string]interface{})
		structureComponents = append(structureComponents, NewComponent("", floorPos, floorQuat, floorProps, wallState, []*Component{}, nil))
		for w := 0; w < 2; w++ {
			wall := generateWallSegment(w, i, floors, width, structureSize)
			structureComponents = append(structureComponents, wall)
		}
	}
	// add long walls
	for w := 2; w < 4; w++ {
		wall := generateWallSegment(w, 0, floors, width, structureSize)
		structureComponents = append(structureComponents, wall)
	}
	structurePos := []float64{(float64(x) * 928000.0), float64(altitude) - 6000, float64(z) * 807360.0} //  + (structureSize * width)
	structureRadius := math.Sqrt(math.Pow(width, 2) + math.Pow(float64(floors)*structureSize*0.5, 2))
	structure = NewEntity(id+1, "Great Wall Of Convolvr", world, []int{x, 0, z}, structureComponents, structurePos, []float64{0.0, 0.0, 0.0, 0.0}, structureRadius, nil)
	return structure

}

func generateWallSegment(w int, i int, floors int, width float64, structureSize float64) *Component {

	wallPos := []float64{}
	geometry := make(map[string]interface{})
	material := make(map[string]interface{})
	geometry["shape"] = "box"
	geometry["merge"] = true
	wallHeight := 0.0
	if w < 2 {
		wallHeight = (-structureSize / 2.65) + float64(i)*structureSize*3.0
		wallPos = []float64{0.0, wallHeight, structureSize/2.0 + float64(w-1)*structureSize}
		geometry["size"] = []float64{structureSize * 2, structureSize, structureSize * width}
		material["name"] = "metal2"
	} else if w < 4 {
		wallHeight = structureSize * float64(floors) * 2.0
		wallPos = []float64{-structureSize/2.0 + (structureSize * float64(w%2)), wallHeight / 2.0, 0}
		geometry["size"] = []float64{structureSize, 10000 + wallHeight, structureSize * width}
		material["name"] = "metal"
	}

	wallQuat := []float64{0.0, 0.0, 0.0, 0.0}
	wallProps := make(map[string]interface{})
	wallProps["wall"] = map[string]int{
		"index": w,
	}

	material["color"] = 0x404040
	wallProps["geometry"] = geometry
	wallProps["material"] = material
	wallState := make(map[string]interface{})
	return NewComponent("", wallPos, wallQuat, wallProps, wallState, []*Component{}, nil)

}

func canPlaceWallAt(x int, y int, z int) bool {

	xOffset := int(math.Abs(float64(x % 8)))
	//zOffset := int(math.Abs(float64(z % 5)))
	placeStructure := false

	if (int(math.Abs(float64(x%30))) < 16) && (int(math.Abs(float64(z%30))) < 16) {

		if xOffset == 7 {

			placeStructure = true

		}

	}

	return placeStructure

}
