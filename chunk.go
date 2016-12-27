package convolvr

type Chunk struct {
	ID         int		 `storm:"id,increment" json:"id"`
	X          int       `storm:"index" json:"x"`
	Y          int       `storm:"index" json:"y"`
	Z          int       `storm:"index" json:"z"`
	World	   string       `storm:"id" json:"world"`
	Name       string       `json:"name"`
	Geometry   string       `json:"geometry"`
	Material   string       `json:"material"`
	Color      int			`json:"color"`
	Structures []*Structure `json:"structures"`
	Voxels     []*Voxel     `json:"voxels"`
	Entities   []*Entity    `json:"entities"`
}

func NewChunk(id int, x int, y int, z int, world string, name string, geom string, mat string, color int, structures []*Structure, voxels []*Voxel, entities []*Entity) *Chunk {
	return &Chunk{id, x, y, z, world, name, geom, mat, color, structures, voxels, entities}
}
