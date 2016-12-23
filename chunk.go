package convolvr

type Chunk struct {
	ID         int
	XYZ        string       `storm:"index" json:"xyz"` // for example: "-2.0.7"
	Name       string       `json:"name"`
	Geometry   string       `json:"geometry"`
	Material   string       `json:"material"`
	Position   []int        `json:"position"`
	Structures []*Structure `json:"structures"`
	Voxels     []*Voxel     `json:"voxels"`
	Entities   []*Entity    `json:"entities"`
}

func NewChunk(id int, xyz, string, name string, geom string, mat string, pos []int, structures []*Structure, voxels []*Voxel, entities []*Entity) *Chunk {
	return &Chunk{id, xyz, name, geom, mat, pos, structures, voxels, entities}
}
