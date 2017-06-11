package convolvr

import (
	"math"
	"math/rand"
)

func generateBuilding(id int, world string, x int, z int, altitude float32) *Entity {
	var (
		structure           *Entity
		structureComponents []*Component
	)
	floors := 1 + rand.Intn(3)*rand.Intn(3)*rand.Intn(3)
	width := 1.0 + float64(rand.Intn(2))
	structureSize := 300000.0
	// create components for each floor & long / windowed wall
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
		floorMaterial["name"] = "terrain"
		floorMaterial["color"] = 0x404040
		floorProps["geometry"] = floorGeometry
		floorProps["material"] = floorMaterial
		wallState := make(map[string]interface{})
		structureComponents = append(structureComponents, NewComponent("", floorPos, floorQuat, floorProps, wallState, []*Component{}))
		for w := 0; w < 2; w++ {
			wall := generateWall(w, i, floors, width, structureSize)
			structureComponents = append(structureComponents, wall)
		}
	}
	// add long walls
	for w := 2; w < 4; w++ {
		wall := generateWall(w, 0, floors, width, structureSize)
		structureComponents = append(structureComponents, wall)
	}
	structurePos := []float64{100000 + (float64(x) * 928000.0), float64(altitude) + 10000, float64(z) * 807360.0} //  + (structureSize * width)
	structureRadius := math.Sqrt(math.Pow(width, 2) + math.Pow(float64(floors)*structureSize*0.5, 2))
	structure = NewEntity(id+1, "Generic Building", world, structureComponents, structurePos, []float64{0.0, 0.0, 0.0, 0.0}, structureRadius)
	return structure
}

func generateWall(w int, i int, floors int, width float64, structureSize float64) *Component {
	wallPos := []float64{}
	geometry := make(map[string]interface{})
	material := make(map[string]interface{})
	geometry["shape"] = "box"
	geometry["merge"] = true
	wallHeight := 0.0
	if w < 2 {
		wallHeight = (-structureSize / 2.65) + float64(i)*structureSize/2
		wallPos = []float64{0.0, wallHeight, structureSize/2.0 + float64(w-1)*structureSize}
		geometry["size"] = []float64{structureSize * width, structureSize / 3.8, 5000}
	} else if w < 4 {
		wallHeight = structureSize * float64(floors)
		wallPos = []float64{((float64(w-2) - 0.5) * width) * structureSize, wallHeight/4.0 - structureSize/2.0, 0.0}
		geometry["size"] = []float64{5000, wallHeight / 2.0, structureSize}
	}

	wallQuat := []float64{0.0, 0.0, 0.0, 0.0}
	wallProps := make(map[string]interface{})
	wallProps["wall"] = map[string]int{
		"index": w,
	}
	material["name"] = "metal"
	material["color"] = 0x404040
	wallProps["geometry"] = geometry
	wallProps["material"] = material
	wallState := make(map[string]interface{})
	return NewComponent("", wallPos, wallQuat, wallProps, wallState, []*Component{})
}

func canPlaceStructureAt(x int, y int, z int) bool {

	xOffset := int(math.Abs(float64(x % 4)))
	zOffset := int(math.Abs(float64(z % 5)))
	placeStructure := false

	if int(math.Abs(float64(x%30))) < 8 && int(math.Abs(float64(z%30))) < 8 {

		if xOffset == 0 {
			if zOffset == 2 || zOffset == 3 {
				placeStructure = true
			}
		} else if xOffset == 1 {
			if zOffset == 4 || zOffset == 1 {
				placeStructure = true
			}
		} else if xOffset == 2 {
			if zOffset == 2 || zOffset == 3 {
				placeStructure = true
			}
		}

	}

	return placeStructure

}
